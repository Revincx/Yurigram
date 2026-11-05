"""Publish a signed Yurigram TDUP v2 package to the update channel.

Requires Telethon==1.45.0 and the dedicated GitHub Actions secrets
UPDATE_API_ID, UPDATE_API_HASH and UPDATE_BOT_TOKEN, passed through environment
variables. Supply the target channel only through --chat-id, as a username
or -100... channel ID. Workflows pass the UPDATE_CHAT_ID secret to this option.
Missing credentials or an empty --chat-id skip publication with a warning.

The bot must be a channel administrator with permission to post and edit
messages. The platform's fixed text message must already exist: win64=10,
winarm=11, mac=12, armac=13, linux=14, linuxarm=15. Each publication replaces
its complete contents without reading message history or preserving previous
channel entries.

Run after Packer has verified the package and the release installer has
been uploaded. Concurrent publishers for a platform must be serialized by
the workflow. Every invocation uploads a new document, including reruns or
older builds. Signature verification remains with Packer and the client.
"""

import argparse
import asyncio
import base64
import json
import os
import re
import stat
import struct
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import BinaryIO


MAX_FILE_SIZE = 256 * 1024 * 1024
MAX_BASE = 0x7FFFFFFD
MAX_POST_ID = 0x7FFFFFFF
MAX_COUNTER = 0xFFFFFFFF
HEADER = struct.Struct("<4sIBBBQQ")
SECRET_NAMES = (
    "UPDATE_API_ID",
    "UPDATE_API_HASH",
    "UPDATE_BOT_TOKEN",
)


class PublishError(Exception):
    pass


@dataclass(frozen=True)
class Platform:
    message_id: int
    os_id: int
    arch_id: int


PLATFORMS = {
    "win64": Platform(10, 0, 1),
    "winarm": Platform(11, 0, 2),
    "mac": Platform(12, 1, 1),
    "armac": Platform(13, 1, 2),
    "linux": Platform(14, 2, 1),
    "linuxarm": Platform(15, 2, 2),
}


@dataclass(frozen=True, repr=False)
class Configuration:
    api_id: int
    api_hash: str
    bot_token: str
    chat_id: int | str


@dataclass(frozen=True)
class Package:
    base: int
    size: int
    manifest: bytes
    manifest_signature: bytes


def read_configuration(chat_id: str) -> Configuration | None:
    values = {name: os.environ.get(name, "").strip() for name in SECRET_NAMES}
    values["UPDATE_CHAT_ID"] = chat_id.strip()
    missing = [name for name, value in values.items() if not value]
    if missing:
        print(
            "::warning::Skipping Telegram update publication; missing secrets: "
            + ", ".join(missing)
        )
        return None

    api_id = values["UPDATE_API_ID"]
    if not re.fullmatch(r"[0-9]+", api_id) or not 0 < int(api_id) <= MAX_POST_ID:
        raise PublishError("UPDATE_API_ID must be a positive int32 API ID.")
    if not re.fullmatch(r"[a-fA-F0-9]{32}", values["UPDATE_API_HASH"]):
        raise PublishError("UPDATE_API_HASH must contain 32 hexadecimal digits.")
    if not re.fullmatch(r"[0-9]+:[a-zA-Z0-9_-]+", values["UPDATE_BOT_TOKEN"]):
        raise PublishError("UPDATE_BOT_TOKEN is not a valid bot token.")

    chat_id = values["UPDATE_CHAT_ID"]
    if re.fullmatch(r"-100[1-9][0-9]*", chat_id):
        chat_id = int(chat_id)
    elif re.fullmatch(r"@?[a-zA-Z][a-zA-Z0-9_]{0,31}", chat_id):
        chat_id = "@" + chat_id.removeprefix("@")
    else:
        raise PublishError("--chat-id must be a channel username or -100... channel ID.")

    return Configuration(
        int(api_id),
        values["UPDATE_API_HASH"],
        values["UPDATE_BOT_TOKEN"],
        chat_id,
    )


def read_exact(stream: BinaryIO, length: int) -> bytes:
    result = stream.read(length)
    if len(result) != length:
        raise PublishError("The TDUP v2 package is truncated.")
    return result


def read_blob(stream: BinaryIO, maximum: int) -> bytes:
    length = struct.unpack("<I", read_exact(stream, 4))[0]
    if not 0 < length <= maximum:
        raise PublishError("The TDUP v2 package contains an invalid field length.")
    return read_exact(stream, length)


def read_package(stream: BinaryIO, platform: Platform) -> Package:
    info = os.fstat(stream.fileno())
    if not stat.S_ISREG(info.st_mode) or not 0 < info.st_size <= MAX_FILE_SIZE:
        raise PublishError("The update package must be a file of at most 256 MiB.")

    magic, envelope_format, channel, os_id, arch_id, version, _created = (
        HEADER.unpack(read_exact(stream, HEADER.size))
    )
    if magic != b"TDUP" or envelope_format != 2:
        raise PublishError("Only TDUP v2 update packages can be published.")
    if channel != 0:
        raise PublishError("Only stable update packages can be published.")
    if (os_id, arch_id) != (platform.os_id, platform.arch_id):
        raise PublishError("The update package does not match --platform.")
    base, counter = version >> 32, version & MAX_COUNTER
    if not 0 < base <= MAX_BASE or counter != 0:
        raise PublishError("The stable update package has an invalid version.")

    manifest = read_blob(stream, 256 * 1024)
    manifest_signature = read_blob(stream, 256)
    if len(manifest_signature) != 64:
        raise PublishError("The package's root manifest signature must be 64 bytes.")
    read_json_object(manifest, "The package's key manifest")

    signature_count = struct.unpack("<I", read_exact(stream, 4))[0]
    if not 0 < signature_count <= 16:
        raise PublishError("The TDUP v2 package has an invalid signature count.")
    for _ in range(signature_count):
        read_blob(stream, 64)
        read_blob(stream, 512)
    payload_size = struct.unpack("<I", read_exact(stream, 4))[0]
    if (
        not 0 < payload_size <= MAX_FILE_SIZE
        or stream.tell() + payload_size != info.st_size
    ):
        raise PublishError("The TDUP v2 package has an invalid payload length.")
    return Package(base, info.st_size, manifest, manifest_signature)


def reject_json_constant(_value: str) -> None:
    raise ValueError("Non-finite JSON numbers are not allowed.")


def read_json_object(text: str | bytes, label: str) -> dict:
    try:
        result = json.loads(text, parse_constant=reject_json_constant)
    except (ValueError, UnicodeError) as error:
        raise PublishError(label + " must contain valid JSON.") from error
    if not isinstance(result, dict):
        raise PublishError(label + " must contain a JSON object.")
    return result


def metadata_text(
    package: Package,
    platform_key: str,
    post_id: int,
) -> str:
    metadata = {
        "format": 1,
        "manifest": base64.b64encode(package.manifest).decode("ascii"),
        "manifest_sig": base64.b64encode(package.manifest_signature).decode("ascii"),
        "channels": {
            "stable": {
                "base": package.base,
                "counter": 0,
                "posts": {platform_key: post_id},
            },
        },
    }
    text = json.dumps(metadata, separators=(",", ":"), allow_nan=False)
    if len(text) > 4096:
        raise PublishError("The updated metadata would exceed the 4096-character limit.")
    return text


async def publish(
    configuration: Configuration,
    platform_key: str,
    package: Package,
    stream: BinaryIO,
    filename: str,
) -> None:
    try:
        from telethon import TelegramClient, errors, types, utils
        from telethon.sessions import MemorySession
    except ImportError as error:
        raise PublishError("Install Telethon==1.45.0 before publishing updates.") from error

    platform = PLATFORMS[platform_key]
    client = TelegramClient(
        MemorySession(),
        configuration.api_id,
        configuration.api_hash,
        receive_updates=False,
        request_retries=5,
        connection_retries=5,
        flood_sleep_threshold=60,
        raise_last_call_error=True,
    )

    try:
        await client.start(bot_token=configuration.bot_token)
        channel = await client.get_entity(configuration.chat_id)
        if not isinstance(channel, types.Channel) or not channel.broadcast:
            raise PublishError("--chat-id must resolve to a broadcast channel.")
        channel_id = utils.get_peer_id(channel)
        rights = channel.admin_rights
        if not rights or not rights.post_messages or not rights.edit_messages:
            raise PublishError(
                "The bot needs channel administrator post_messages and edit_messages rights."
            )

        metadata_text(package, platform_key, MAX_POST_ID)

        stream.seek(0)
        uploaded = await client.send_file(
            channel,
            stream,
            caption=f"Yurigram {platform_key} stable {package.base}",
            force_document=True,
            mime_type="application/octet-stream",
            attributes=[types.DocumentAttributeFilename(filename)],
            file_size=package.size,
            parse_mode=None,
        )
        if (
            not isinstance(uploaded, types.Message)
            or uploaded.chat_id != channel_id
            or not 0 < uploaded.id <= MAX_POST_ID
            or not isinstance(uploaded.document, types.Document)
            or uploaded.document.size != package.size
            or uploaded.file.name != filename
        ):
            raise PublishError(
                "The uploaded document could not be confirmed; metadata was not edited."
            )
        print(f"Uploaded {platform_key} update package as channel post {uploaded.id}.")

        text = metadata_text(package, platform_key, uploaded.id)
        try:
            await client.edit_message(
                channel,
                platform.message_id,
                text,
                parse_mode=None,
                formatting_entities=[],
                link_preview=False,
            )
        except errors.MessageNotModifiedError:
            pass
        print(
            f"Published {platform_key} stable {package.base} "
            f"through metadata message {platform.message_id}."
        )
    finally:
        await client.disconnect()


def main() -> int:
    parser = argparse.ArgumentParser(
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("--platform", choices=PLATFORMS, required=True)
    parser.add_argument(
        "--package", type=Path, required=True, help="Packer-verified TDUP v2 file"
    )
    parser.add_argument(
        "--chat-id", required=True, help="Target channel username or -100... channel ID"
    )
    args = parser.parse_args()
    try:
        configuration = read_configuration(args.chat_id)
        if configuration is None:
            return 0
        with args.package.open("rb") as stream:
            package = read_package(stream, PLATFORMS[args.platform])
            asyncio.run(
                publish(configuration, args.platform, package, stream, args.package.name)
            )
    except PublishError as error:
        print("::error::" + str(error), file=sys.stderr)
        return 1
    except Exception as error:
        print(
            f"::error::Update publication failed ({type(error).__name__}). "
            "Any uploaded document is retained; "
            "check the package, bot configuration and permissions.",
            file=sys.stderr,
        )
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
