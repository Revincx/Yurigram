# Yurigram — Yet another 3rd-party [tdesktop](https://github.com/telegramdesktop/tdesktop) client

Yurigram was formerly forked from [64Gram](https://github.com/TDesktop-x64/tdesktop) and [Yukigram](https://github.com/yukigram/yukigram-legacy), but now it is a standalone client with some exclusive new features and directly follows official Telegram Desktop updates.

The source code is published under GPLv3 with OpenSSL exception, the license is available [here][license].

## Features

Yurigram includes [most features from 64Gram](https://github.com/TDesktop-x64/tdesktop/blob/dev/features.md), as it was originally forked from 64Gram. It also adds the following features.

### Chat Enhanced Settings

- Override global enhanced-setting options for an individual chat.
- Import, export, and share any enhanced-setting value through deep links.

### BotUse

Log in with a bot account and send messages as that bot. See the [BotUse wiki](https://github.com/Revincx/Yurigram/wiki/BotUse-Description) for details.

### More features

<details>
<summary><b>Messages and chats</b></summary>

- Send a message directly in a group linked to a channel.
- Temporarily hide messages and restore them easily.
- Create or edit inline user mentions with Ctrl/Ctrl+Shift-click.
- Set a custom render limit for rich message blocks.
- Open the same chat in multiple new windows.
- Quickly edit self-editable messages with Alt+Shift+Up/Down.
- Disable syncing local message drafts to the cloud.
- Show forward counts below channel messages.

</details>

<details>
<summary><b>Forwarding</b></summary>

- Remember message-forwarding targets in the forward dialog.
- Force regrouping or separating photos when forwarding media groups.
- Add spoilers to forwarded media.
- Send a comment after forwarding messages.

</details>

<details>
<summary><b>Media and emoji</b></summary>

- Use additional Fluent Emoji packs (Flat and Color).
- Save custom emoji sets without Premium.
- Adjust sticker size in chats.
- View detailed media metadata in the media viewer.
- Show controls for silent GIF videos.

</details>

<details>
<summary><b>Translation and link previews</b></summary>

- Translate messages with Google Translate or an LLM translation provider.
- Add or edit webpage previews with custom URLs using Ctrl+Shift+K.
- Force generation of webpage previews for incoming messages.
- Disable automatic webpage-preview fetching for outgoing messages.
- Replace link-preview domains with custom regular-expression rules.

</details>

<details>
<summary><b>People and groups</b></summary>

- Show mutual-contact labels and online indicators in group chats.
- Hide user Stars ratings.
- Search group messages with both user and message-type filters.
- Approve or decline all join requests at once.

</details>

And more new features will ~~(may)~~ be added in the future.

## Supported systems

Windows 7 and above

Linux 64 bit

macOS > 10.12 and above

The latest version is available on the [Release](https://github.com/Revincx/Yurigram/releases) page.

## Localization

If you want to translate this project, **Just Do It!**

Create a Pull Request: [Localization Repo](https://github.com/RuaGram/Localization).

**Here is a project [translation template](https://github.com/RuaGram/Localization/blob/master/en.json).**

You can find a language ID on Telegram's log.txt

For example: `[2022.04.23 10:37:45] Current Language pack ID: de, Base ID: `

Then your language translation filename is `de.json` or something like that.

***Note: Ignore base ID(base ID translation - Work in progress)***

## Build instructions

* [Windows (32-bit and 64-bit)][win]
* [macOS][mac]
* [GNU/Linux using Docker][linux]

## Links

* [Yurigram Dev Channel (Simplified Chinese)](https://t.me/ruadevs)

## Feedback

The project doesn't accept new feature requests for now. But if you have something else to report, please send a message to me on Telegram with this link: https://t.me/ruadevs?direct

[//]: # (LINKS)
[license]: LICENSE
[win]: docs/building-win.md
[mac]: docs/building-mac.md
[linux]: docs/building-linux.md
[preview_image]: https://github.com/TDesktop-x64/tdesktop/blob/dev/docs/assets/preview.png "Preview of 64Gram Desktop"
[preview_image_url]: https://raw.githubusercontent.com/TDesktop-x64/tdesktop/dev/docs/assets/preview.png
