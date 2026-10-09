window.TL_SCHEMA_FULL = {
  3300522427: function (e) {
    var result = { _: `error` };
    result.code = e.int();
    result.text = e.string();
    return result;
  },
  2134579434: function (e) {
    var result = { _: `inputPeerEmpty` };
    return result;
  },
  2107670217: function (e) {
    var result = { _: `inputPeerSelf` };
    return result;
  },
  900291769: function (e) {
    var result = { _: `inputPeerChat` };
    result.chatId = e.long();
    return result;
  },
  3723011404: function (e) {
    var result = { _: `inputPeerUser` };
    result.userId = e.long();
    result.accessHash = e.long();
    return result;
  },
  666680316: function (e) {
    var result = { _: `inputPeerChannel` };
    result.channelId = e.long();
    result.accessHash = e.long();
    return result;
  },
  2826635804: function (e) {
    var result = { _: `inputPeerUserFromMessage` };
    result.peer = e.object();
    result.msgId = e.int();
    result.userId = e.long();
    return result;
  },
  3173648448: function (e) {
    var result = { _: `inputPeerChannelFromMessage` };
    result.peer = e.object();
    result.msgId = e.int();
    result.channelId = e.long();
    return result;
  },
  3112732367: function (e) {
    var result = { _: `inputUserEmpty` };
    return result;
  },
  4156666175: function (e) {
    var result = { _: `inputUserSelf` };
    return result;
  },
  4061223110: function (e) {
    var result = { _: `inputUser` };
    result.userId = e.long();
    result.accessHash = e.long();
    return result;
  },
  497305826: function (e) {
    var result = { _: `inputUserFromMessage` };
    result.peer = e.object();
    result.msgId = e.int();
    result.userId = e.long();
    return result;
  },
  1780335806: function (e) {
    var result = { _: `inputPhoneContact` };
    var t = e.uint();
    result.flags = t;
    result.clientId = e.long();
    result.phone = e.string();
    result.firstName = e.string();
    result.lastName = e.string();
    if (t & 1) {
      result.note = e.object();
    }
    return result;
  },
  4113560191: function (e) {
    var result = { _: `inputFile` };
    result.id = e.long();
    result.parts = e.int();
    result.name = e.string();
    result.md5Checksum = e.string();
    return result;
  },
  4199484341: function (e) {
    var result = { _: `inputFileBig` };
    result.id = e.long();
    result.parts = e.int();
    result.name = e.string();
    return result;
  },
  1658620744: function (e) {
    var result = { _: `inputFileStoryDocument` };
    result.id = e.object();
    return result;
  },
  2523198847: function (e) {
    var result = { _: `inputMediaEmpty` };
    return result;
  },
  2105767386: function (e) {
    var result = { _: `inputMediaUploadedPhoto` };
    var t = e.uint();
    result.flags = t;
    result.spoiler = !!(t & 4);
    result.livePhoto = !!(t & 8);
    result.file = e.object();
    if (t & 1) {
      result.stickers = e.vector(e.object);
    }
    if (t & 2) {
      result.ttlSeconds = e.int();
    }
    if (t & 8) {
      result.video = e.object();
    }
    return result;
  },
  3819914292: function (e) {
    var result = { _: `inputMediaPhoto` };
    var t = e.uint();
    result.flags = t;
    result.spoiler = !!(t & 2);
    result.livePhoto = !!(t & 4);
    result.id = e.object();
    if (t & 1) {
      result.ttlSeconds = e.int();
    }
    if (t & 4) {
      result.video = e.object();
    }
    return result;
  },
  4190388548: function (e) {
    var result = { _: `inputMediaGeoPoint` };
    result.geoPoint = e.object();
    return result;
  },
  4171988475: function (e) {
    var result = { _: `inputMediaContact` };
    result.phoneNumber = e.string();
    result.firstName = e.string();
    result.lastName = e.string();
    result.vcard = e.string();
    return result;
  },
  58495792: function (e) {
    var result = { _: `inputMediaUploadedDocument` };
    var t = e.uint();
    result.flags = t;
    result.nosoundVideo = !!(t & 8);
    result.forceFile = !!(t & 16);
    result.spoiler = !!(t & 32);
    result.file = e.object();
    if (t & 4) {
      result.thumb = e.object();
    }
    result.mimeType = e.string();
    result.attributes = e.vector(e.object);
    if (t & 1) {
      result.stickers = e.vector(e.object);
    }
    if (t & 64) {
      result.videoCover = e.object();
    }
    if (t & 128) {
      result.videoTimestamp = e.int();
    }
    if (t & 2) {
      result.ttlSeconds = e.int();
    }
    return result;
  },
  2826320565: function (e) {
    var result = { _: `inputMediaDocument` };
    var t = e.uint();
    result.flags = t;
    result.spoiler = !!(t & 4);
    result.id = e.object();
    if (t & 8) {
      result.videoCover = e.object();
    }
    if (t & 16) {
      result.videoTimestamp = e.int();
    }
    if (t & 1) {
      result.ttlSeconds = e.int();
    }
    if (t & 2) {
      result.query = e.string();
    }
    return result;
  },
  3242007569: function (e) {
    var result = { _: `inputMediaVenue` };
    result.geoPoint = e.object();
    result.title = e.string();
    result.address = e.string();
    result.provider = e.string();
    result.venueId = e.string();
    result.venueType = e.string();
    return result;
  },
  3854302746: function (e) {
    var result = { _: `inputMediaPhotoExternal` };
    var t = e.uint();
    result.flags = t;
    result.spoiler = !!(t & 2);
    result.url = e.string();
    if (t & 1) {
      result.ttlSeconds = e.int();
    }
    return result;
  },
  2006319353: function (e) {
    var result = { _: `inputMediaDocumentExternal` };
    var t = e.uint();
    result.flags = t;
    result.spoiler = !!(t & 2);
    result.url = e.string();
    if (t & 1) {
      result.ttlSeconds = e.int();
    }
    if (t & 4) {
      result.videoCover = e.object();
    }
    if (t & 8) {
      result.videoTimestamp = e.int();
    }
    return result;
  },
  3544138739: function (e) {
    var result = { _: `inputMediaGame` };
    result.id = e.object();
    return result;
  },
  1080028941: function (e) {
    var result = { _: `inputMediaInvoice` };
    var t = e.uint();
    result.flags = t;
    result.title = e.string();
    result.description = e.string();
    if (t & 1) {
      result.photo = e.object();
    }
    result.invoice = e.object();
    result.payload = e.bytes();
    if (t & 8) {
      result.provider = e.string();
    }
    result.providerData = e.object();
    if (t & 2) {
      result.startParam = e.string();
    }
    if (t & 4) {
      result.extendedMedia = e.object();
    }
    return result;
  },
  2535434307: function (e) {
    var result = { _: `inputMediaGeoLive` };
    var t = e.uint();
    result.flags = t;
    result.stopped = !!(t & 1);
    result.geoPoint = e.object();
    if (t & 4) {
      result.heading = e.int();
    }
    if (t & 2) {
      result.period = e.int();
    }
    if (t & 8) {
      result.proximityNotificationRadius = e.int();
    }
    return result;
  },
  2285519112: function (e) {
    var result = { _: `inputMediaPoll` };
    var t = e.uint();
    result.flags = t;
    result.poll = e.object();
    if (t & 1) {
      result.correctAnswers = e.vector(e.int);
    }
    if (t & 8) {
      result.attachedMedia = e.object();
    }
    if (t & 2) {
      result.solution = e.string();
    }
    if (t & 2) {
      result.solutionEntities = e.vector(e.object);
    }
    if (t & 4) {
      result.solutionMedia = e.object();
    }
    return result;
  },
  3866083195: function (e) {
    var result = { _: `inputMediaDice` };
    result.emoticon = e.string();
    return result;
  },
  2315114360: function (e) {
    var result = { _: `inputMediaStory` };
    result.peer = e.object();
    result.id = e.int();
    return result;
  },
  3256584265: function (e) {
    var result = { _: `inputMediaWebPage` };
    var t = e.uint();
    result.flags = t;
    result.forceLargeMedia = !!(t & 1);
    result.forceSmallMedia = !!(t & 2);
    result.optional = !!(t & 4);
    result.url = e.string();
    return result;
  },
  3289396102: function (e) {
    var result = { _: `inputMediaPaidMedia` };
    var t = e.uint();
    result.flags = t;
    result.starsAmount = e.long();
    result.extendedMedia = e.vector(e.object);
    if (t & 1) {
      result.payload = e.string();
    }
    return result;
  },
  2680512478: function (e) {
    var result = { _: `inputMediaTodo` };
    result.todo = e.object();
    return result;
  },
  4087948362: function (e) {
    var result = { _: `inputMediaStakeDice` };
    result.gameHash = e.string();
    result.tonAmount = e.long();
    result.clientSeed = e.bytes();
    return result;
  },
  480546647: function (e) {
    var result = { _: `inputChatPhotoEmpty` };
    return result;
  },
  3184373440: function (e) {
    var result = { _: `inputChatUploadedPhoto` };
    var t = e.uint();
    result.flags = t;
    if (t & 1) {
      result.file = e.object();
    }
    if (t & 2) {
      result.video = e.object();
    }
    if (t & 4) {
      result.videoStartTs = e.double();
    }
    if (t & 8) {
      result.videoEmojiMarkup = e.object();
    }
    return result;
  },
  2303962423: function (e) {
    var result = { _: `inputChatPhoto` };
    result.id = e.object();
    return result;
  },
  3837862870: function (e) {
    var result = { _: `inputGeoPointEmpty` };
    return result;
  },
  1210199983: function (e) {
    var result = { _: `inputGeoPoint` };
    var t = e.uint();
    result.flags = t;
    result.lat = e.double();
    result.long = e.double();
    if (t & 1) {
      result.accuracyRadius = e.int();
    }
    return result;
  },
  483901197: function (e) {
    var result = { _: `inputPhotoEmpty` };
    return result;
  },
  1001634122: function (e) {
    var result = { _: `inputPhoto` };
    result.id = e.long();
    result.accessHash = e.long();
    result.fileReference = e.bytes();
    return result;
  },
  3755650017: function (e) {
    var result = { _: `inputFileLocation` };
    result.volumeId = e.long();
    result.localId = e.int();
    result.secret = e.long();
    result.fileReference = e.bytes();
    return result;
  },
  4112735573: function (e) {
    var result = { _: `inputEncryptedFileLocation` };
    result.id = e.long();
    result.accessHash = e.long();
    return result;
  },
  3134223748: function (e) {
    var result = { _: `inputDocumentFileLocation` };
    result.id = e.long();
    result.accessHash = e.long();
    result.fileReference = e.bytes();
    result.thumbSize = e.string();
    return result;
  },
  3418877480: function (e) {
    var result = { _: `inputSecureFileLocation` };
    result.id = e.long();
    result.accessHash = e.long();
    return result;
  },
  700340377: function (e) {
    var result = { _: `inputTakeoutFileLocation` };
    return result;
  },
  1075322878: function (e) {
    var result = { _: `inputPhotoFileLocation` };
    result.id = e.long();
    result.accessHash = e.long();
    result.fileReference = e.bytes();
    result.thumbSize = e.string();
    return result;
  },
  3627312883: function (e) {
    var result = { _: `inputPhotoLegacyFileLocation` };
    result.id = e.long();
    result.accessHash = e.long();
    result.fileReference = e.bytes();
    result.volumeId = e.long();
    result.localId = e.int();
    result.secret = e.long();
    return result;
  },
  925204121: function (e) {
    var result = { _: `inputPeerPhotoFileLocation` };
    var t = e.uint();
    result.flags = t;
    result.big = !!(t & 1);
    result.peer = e.object();
    result.photoId = e.long();
    return result;
  },
  2642736091: function (e) {
    var result = { _: `inputStickerSetThumb` };
    result.stickerset = e.object();
    result.thumbVersion = e.int();
    return result;
  },
  93890858: function (e) {
    var result = { _: `inputGroupCallStream` };
    var t = e.uint();
    result.flags = t;
    result.call = e.object();
    result.timeMs = e.long();
    result.scale = e.int();
    if (t & 1) {
      result.videoChannel = e.int();
    }
    if (t & 1) {
      result.videoQuality = e.int();
    }
    return result;
  },
  1498486562: function (e) {
    var result = { _: `peerUser` };
    result.userId = e.long();
    return result;
  },
  918946202: function (e) {
    var result = { _: `peerChat` };
    result.chatId = e.long();
    return result;
  },
  2728736542: function (e) {
    var result = { _: `peerChannel` };
    result.channelId = e.long();
    return result;
  },
  2861972229: function (e) {
    var result = { _: `storage.fileUnknown` };
    return result;
  },
  1086091090: function (e) {
    var result = { _: `storage.filePartial` };
    return result;
  },
  8322574: function (e) {
    var result = { _: `storage.fileJpeg` };
    return result;
  },
  3403786975: function (e) {
    var result = { _: `storage.fileGif` };
    return result;
  },
  172975040: function (e) {
    var result = { _: `storage.filePng` };
    return result;
  },
  2921222285: function (e) {
    var result = { _: `storage.filePdf` };
    return result;
  },
  1384777335: function (e) {
    var result = { _: `storage.fileMp3` };
    return result;
  },
  1258941372: function (e) {
    var result = { _: `storage.fileMov` };
    return result;
  },
  3016663268: function (e) {
    var result = { _: `storage.fileMp4` };
    return result;
  },
  276907596: function (e) {
    var result = { _: `storage.fileWebp` };
    return result;
  },
  3552332666: function (e) {
    var result = { _: `userEmpty` };
    result.id = e.long();
    return result;
  },
  2981678211: function (e) {
    var result = { _: `user` };
    var t = e.uint();
    result.flags = t;
    result.self = !!(t & 1024);
    result.contact = !!(t & 2048);
    result.mutualContact = !!(t & 4096);
    result.deleted = !!(t & 8192);
    result.bot = !!(t & 16384);
    result.botChatHistory = !!(t & 32768);
    result.botNochats = !!(t & 65536);
    result.verified = !!(t & 131072);
    result.restricted = !!(t & 262144);
    result.min = !!(t & 1048576);
    result.botInlineGeo = !!(t & 2097152);
    result.support = !!(t & 8388608);
    result.scam = !!(t & 16777216);
    result.applyMinPhoto = !!(t & 33554432);
    result.fake = !!(t & 67108864);
    result.botAttachMenu = !!(t & 134217728);
    result.premium = !!(t & 268435456);
    result.attachMenuEnabled = !!(t & 536870912);
    var n = e.uint();
    result.flags2 = n;
    result.botCanEdit = !!(n & 2);
    result.closeFriend = !!(n & 4);
    result.storiesHidden = !!(n & 8);
    result.storiesUnavailable = !!(n & 16);
    result.contactRequirePremium = !!(n & 1024);
    result.botBusiness = !!(n & 2048);
    result.botHasMainApp = !!(n & 8192);
    result.botForumView = !!(n & 65536);
    result.botForumCanManageTopics = !!(n & 131072);
    result.botCanManageBots = !!(n & 262144);
    result.botGuestchat = !!(n & 524288);
    result.botGuard = !!(n & 1048576);
    result.id = e.long();
    if (t & 1) {
      result.accessHash = e.long();
    }
    if (t & 2) {
      result.firstName = e.string();
    }
    if (t & 4) {
      result.lastName = e.string();
    }
    if (t & 8) {
      result.username = e.string();
    }
    if (t & 16) {
      result.phone = e.string();
    }
    if (t & 32) {
      result.photo = e.object();
    }
    if (t & 64) {
      result.status = e.object();
    }
    if (t & 16384) {
      result.botInfoVersion = e.int();
    }
    if (t & 262144) {
      result.restrictionReason = e.vector(e.object);
    }
    if (t & 524288) {
      result.botInlinePlaceholder = e.string();
    }
    if (t & 4194304) {
      result.langCode = e.string();
    }
    if (t & 1073741824) {
      result.emojiStatus = e.object();
    }
    if (n & 1) {
      result.usernames = e.vector(e.object);
    }
    if (n & 32) {
      result.storiesMaxId = e.object();
    }
    if (n & 256) {
      result.color = e.object();
    }
    if (n & 512) {
      result.profileColor = e.object();
    }
    if (n & 4096) {
      result.botActiveUsers = e.int();
    }
    if (n & 16384) {
      result.botVerificationIcon = e.long();
    }
    if (n & 32768) {
      result.sendPaidMessagesStars = e.long();
    }
    if (n & 2097152) {
      result.linkedCommunityId = e.long();
    }
    return result;
  },
  1326562017: function (e) {
    var result = { _: `userProfilePhotoEmpty` };
    return result;
  },
  2194798342: function (e) {
    var result = { _: `userProfilePhoto` };
    var t = e.uint();
    result.flags = t;
    result.hasVideo = !!(t & 1);
    result.personal = !!(t & 4);
    result.photoId = e.long();
    if (t & 2) {
      result.strippedThumb = e.bytes();
    }
    result.dcId = e.int();
    return result;
  },
  164646985: function (e) {
    var result = { _: `userStatusEmpty` };
    return result;
  },
  3988339017: function (e) {
    var result = { _: `userStatusOnline` };
    result.expires = e.int();
    return result;
  },
  9203775: function (e) {
    var result = { _: `userStatusOffline` };
    result.wasOnline = e.int();
    return result;
  },
  2065268168: function (e) {
    var result = { _: `userStatusRecently` };
    var t = e.uint();
    result.flags = t;
    result.byMe = !!(t & 1);
    return result;
  },
  1410997530: function (e) {
    var result = { _: `userStatusLastWeek` };
    var t = e.uint();
    result.flags = t;
    result.byMe = !!(t & 1);
    return result;
  },
  1703516023: function (e) {
    var result = { _: `userStatusLastMonth` };
    var t = e.uint();
    result.flags = t;
    result.byMe = !!(t & 1);
    return result;
  },
  693512293: function (e) {
    var result = { _: `chatEmpty` };
    result.id = e.long();
    return result;
  },
  1103884886: function (e) {
    var result = { _: `chat` };
    var t = e.uint();
    result.flags = t;
    result.creator = !!(t & 1);
    result.left = !!(t & 4);
    result.deactivated = !!(t & 32);
    result.callActive = !!(t & 8388608);
    result.callNotEmpty = !!(t & 16777216);
    result.noforwards = !!(t & 33554432);
    result.id = e.long();
    result.title = e.string();
    result.photo = e.object();
    result.participantsCount = e.int();
    result.date = e.int();
    result.version = e.int();
    if (t & 64) {
      result.migratedTo = e.object();
    }
    if (t & 16384) {
      result.adminRights = e.object();
    }
    if (t & 262144) {
      result.defaultBannedRights = e.object();
    }
    return result;
  },
  1704108455: function (e) {
    var result = { _: `chatForbidden` };
    result.id = e.long();
    result.title = e.string();
    return result;
  },
  3567203526: function (e) {
    var result = { _: `channel` };
    var t = e.uint();
    result.flags = t;
    result.creator = !!(t & 1);
    result.left = !!(t & 4);
    result.broadcast = !!(t & 32);
    result.verified = !!(t & 128);
    result.megagroup = !!(t & 256);
    result.restricted = !!(t & 512);
    result.signatures = !!(t & 2048);
    result.min = !!(t & 4096);
    result.scam = !!(t & 524288);
    result.hasLink = !!(t & 1048576);
    result.hasGeo = !!(t & 2097152);
    result.slowmodeEnabled = !!(t & 4194304);
    result.callActive = !!(t & 8388608);
    result.callNotEmpty = !!(t & 16777216);
    result.fake = !!(t & 33554432);
    result.gigagroup = !!(t & 67108864);
    result.noforwards = !!(t & 134217728);
    result.joinToSend = !!(t & 268435456);
    result.joinRequest = !!(t & 536870912);
    result.forum = !!(t & 1073741824);
    var n = e.uint();
    result.flags2 = n;
    result.storiesHidden = !!(n & 2);
    result.storiesHiddenMin = !!(n & 4);
    result.storiesUnavailable = !!(n & 8);
    result.signatureProfiles = !!(n & 4096);
    result.autotranslation = !!(n & 32768);
    result.broadcastMessagesAllowed = !!(n & 65536);
    result.monoforum = !!(n & 131072);
    result.forumTabs = !!(n & 524288);
    result.id = e.long();
    if (t & 8192) {
      result.accessHash = e.long();
    }
    result.title = e.string();
    if (t & 64) {
      result.username = e.string();
    }
    result.photo = e.object();
    result.date = e.int();
    if (t & 512) {
      result.restrictionReason = e.vector(e.object);
    }
    if (t & 16384) {
      result.adminRights = e.object();
    }
    if (t & 32768) {
      result.bannedRights = e.object();
    }
    if (t & 262144) {
      result.defaultBannedRights = e.object();
    }
    if (t & 131072) {
      result.participantsCount = e.int();
    }
    if (n & 1) {
      result.usernames = e.vector(e.object);
    }
    if (n & 16) {
      result.storiesMaxId = e.object();
    }
    if (n & 128) {
      result.color = e.object();
    }
    if (n & 256) {
      result.profileColor = e.object();
    }
    if (n & 512) {
      result.emojiStatus = e.object();
    }
    if (n & 1024) {
      result.level = e.int();
    }
    if (n & 2048) {
      result.subscriptionUntilDate = e.int();
    }
    if (n & 8192) {
      result.botVerificationIcon = e.long();
    }
    if (n & 16384) {
      result.sendPaidMessagesStars = e.long();
    }
    if (n & 262144) {
      result.linkedMonoforumId = e.long();
    }
    if (n & 1048576) {
      result.linkedCommunityId = e.long();
    }
    return result;
  },
  399807445: function (e) {
    var result = { _: `channelForbidden` };
    var t = e.uint();
    result.flags = t;
    result.broadcast = !!(t & 32);
    result.megagroup = !!(t & 256);
    result.monoforum = !!(t & 1024);
    result.id = e.long();
    result.accessHash = e.long();
    result.title = e.string();
    if (t & 65536) {
      result.untilDate = e.int();
    }
    return result;
  },
  4248623800: function (e) {
    var result = { _: `communityForbidden` };
    var t = e.uint();
    result.flags = t;
    result.id = e.long();
    if (t & 8192) {
      result.accessHash = e.long();
    }
    result.title = e.string();
    return result;
  },
  1710221652: function (e) {
    var result = { _: `community` };
    var t = e.uint();
    result.flags = t;
    result.creator = !!(t & 1);
    result.left = !!(t & 4);
    result.min = !!(t & 4096);
    var n = e.uint();
    result.flags2 = n;
    result.collapsedInDialogs = !!(n & 1048576);
    result.id = e.long();
    if (t & 8192) {
      result.accessHash = e.long();
    }
    result.title = e.string();
    result.photo = e.object();
    result.date = e.int();
    if (t & 16384) {
      result.adminRights = e.object();
    }
    if (t & 262144) {
      result.defaultBannedRights = e.object();
    }
    return result;
  },
  640893467: function (e) {
    var result = { _: `chatFull` };
    var t = e.uint();
    result.flags = t;
    result.canSetUsername = !!(t & 128);
    result.hasScheduled = !!(t & 256);
    result.translationsDisabled = !!(t & 524288);
    result.hasWelcomeMessages = !!(t & 2097152);
    result.id = e.long();
    result.about = e.string();
    result.participants = e.object();
    if (t & 4) {
      result.chatPhoto = e.object();
    }
    result.notifySettings = e.object();
    if (t & 8192) {
      result.exportedInvite = e.object();
    }
    if (t & 8) {
      result.botInfo = e.vector(e.object);
    }
    if (t & 64) {
      result.pinnedMsgId = e.int();
    }
    if (t & 2048) {
      result.folderId = e.int();
    }
    if (t & 4096) {
      result.call = e.object();
    }
    if (t & 16384) {
      result.ttlPeriod = e.int();
    }
    if (t & 32768) {
      result.groupcallDefaultJoinAs = e.object();
    }
    if (t & 65536) {
      result.themeEmoticon = e.string();
    }
    if (t & 131072) {
      result.requestsPending = e.int();
    }
    if (t & 131072) {
      result.recentRequesters = e.vector(e.long);
    }
    if (t & 262144) {
      result.availableReactions = e.object();
    }
    if (t & 1048576) {
      result.reactionsLimit = e.int();
    }
    return result;
  },
  2689502522: function (e) {
    var result = { _: `channelFull` };
    var t = e.uint();
    result.flags = t;
    result.canViewParticipants = !!(t & 8);
    result.canSetUsername = !!(t & 64);
    result.canSetStickers = !!(t & 128);
    result.hiddenPrehistory = !!(t & 1024);
    result.canSetLocation = !!(t & 65536);
    result.hasScheduled = !!(t & 524288);
    result.canViewStats = !!(t & 1048576);
    result.blocked = !!(t & 4194304);
    var n = e.uint();
    result.flags2 = n;
    result.canDeleteChannel = !!(n & 1);
    result.antispam = !!(n & 2);
    result.participantsHidden = !!(n & 4);
    result.translationsDisabled = !!(n & 8);
    result.storiesPinnedAvailable = !!(n & 32);
    result.viewForumAsMessages = !!(n & 64);
    result.restrictedSponsored = !!(n & 2048);
    result.canViewRevenue = !!(n & 4096);
    result.paidMediaAllowed = !!(n & 16384);
    result.canViewStarsRevenue = !!(n & 32768);
    result.paidReactionsAvailable = !!(n & 65536);
    result.stargiftsAvailable = !!(n & 524288);
    result.paidMessagesAvailable = !!(n & 1048576);
    result.hasWelcomeMessages = !!(n & 16777216);
    result.id = e.long();
    result.about = e.string();
    if (t & 1) {
      result.participantsCount = e.int();
    }
    if (t & 2) {
      result.adminsCount = e.int();
    }
    if (t & 4) {
      result.kickedCount = e.int();
    }
    if (t & 4) {
      result.bannedCount = e.int();
    }
    if (t & 8192) {
      result.onlineCount = e.int();
    }
    result.readInboxMaxId = e.int();
    result.readOutboxMaxId = e.int();
    result.unreadCount = e.int();
    result.chatPhoto = e.object();
    result.notifySettings = e.object();
    if (t & 8388608) {
      result.exportedInvite = e.object();
    }
    result.botInfo = e.vector(e.object);
    if (t & 16) {
      result.migratedFromChatId = e.long();
    }
    if (t & 16) {
      result.migratedFromMaxId = e.int();
    }
    if (t & 32) {
      result.pinnedMsgId = e.int();
    }
    if (t & 256) {
      result.stickerset = e.object();
    }
    if (t & 512) {
      result.availableMinId = e.int();
    }
    if (t & 2048) {
      result.folderId = e.int();
    }
    if (t & 16384) {
      result.linkedChatId = e.long();
    }
    if (t & 32768) {
      result.location = e.object();
    }
    if (t & 131072) {
      result.slowmodeSeconds = e.int();
    }
    if (t & 262144) {
      result.slowmodeNextSendDate = e.int();
    }
    if (t & 4096) {
      result.statsDc = e.int();
    }
    result.pts = e.int();
    if (t & 2097152) {
      result.call = e.object();
    }
    if (t & 16777216) {
      result.ttlPeriod = e.int();
    }
    if (t & 33554432) {
      result.pendingSuggestions = e.vector(e.string);
    }
    if (t & 67108864) {
      result.groupcallDefaultJoinAs = e.object();
    }
    if (t & 134217728) {
      result.themeEmoticon = e.string();
    }
    if (t & 268435456) {
      result.requestsPending = e.int();
    }
    if (t & 268435456) {
      result.recentRequesters = e.vector(e.long);
    }
    if (t & 536870912) {
      result.defaultSendAs = e.object();
    }
    if (t & 1073741824) {
      result.availableReactions = e.object();
    }
    if (n & 8192) {
      result.reactionsLimit = e.int();
    }
    if (n & 16) {
      result.stories = e.object();
    }
    if (n & 128) {
      result.wallpaper = e.object();
    }
    if (n & 256) {
      result.boostsApplied = e.int();
    }
    if (n & 512) {
      result.boostsUnrestrict = e.int();
    }
    if (n & 1024) {
      result.emojiset = e.object();
    }
    if (n & 131072) {
      result.botVerification = e.object();
    }
    if (n & 262144) {
      result.stargiftsCount = e.int();
    }
    if (n & 2097152) {
      result.sendPaidMessagesStars = e.long();
    }
    if (n & 4194304) {
      result.mainTab = e.object();
    }
    if (n & 8388608) {
      result.guardBotId = e.long();
    }
    return result;
  },
  3417810183: function (e) {
    var result = { _: `communityFull` };
    var t = e.uint();
    result.flags = t;
    result.id = e.long();
    result.about = e.string();
    result.chatPhoto = e.object();
    result.linkedPeers = e.vector(e.object);
    if (t & 2) {
      result.adminsCount = e.int();
    }
    if (t & 4) {
      result.kickedCount = e.int();
    }
    if (t & 1) {
      result.peerLinkRequestsPending = e.int();
    }
    return result;
  },
  954703838: function (e) {
    var result = { _: `chatParticipant` };
    var t = e.uint();
    result.flags = t;
    result.userId = e.long();
    result.inviterId = e.long();
    result.date = e.int();
    if (t & 1) {
      result.rank = e.string();
    }
    return result;
  },
  3791153080: function (e) {
    var result = { _: `chatParticipantCreator` };
    var t = e.uint();
    result.flags = t;
    result.userId = e.long();
    if (t & 1) {
      result.rank = e.string();
    }
    return result;
  },
  56677842: function (e) {
    var result = { _: `chatParticipantAdmin` };
    var t = e.uint();
    result.flags = t;
    result.userId = e.long();
    result.inviterId = e.long();
    result.date = e.int();
    if (t & 1) {
      result.rank = e.string();
    }
    return result;
  },
  2271466465: function (e) {
    var result = { _: `chatParticipantsForbidden` };
    var t = e.uint();
    result.flags = t;
    result.chatId = e.long();
    if (t & 1) {
      result.selfParticipant = e.object();
    }
    return result;
  },
  1018991608: function (e) {
    var result = { _: `chatParticipants` };
    result.chatId = e.long();
    result.participants = e.vector(e.object);
    result.version = e.int();
    return result;
  },
  935395612: function (e) {
    var result = { _: `chatPhotoEmpty` };
    return result;
  },
  476978193: function (e) {
    var result = { _: `chatPhoto` };
    var t = e.uint();
    result.flags = t;
    result.hasVideo = !!(t & 1);
    result.photoId = e.long();
    if (t & 2) {
      result.strippedThumb = e.bytes();
    }
    result.dcId = e.int();
    return result;
  },
  2426849924: function (e) {
    var result = { _: `messageEmpty` };
    var t = e.uint();
    result.flags = t;
    result.id = e.int();
    if (t & 1) {
      result.peerId = e.object();
    }
    return result;
  },
  1979759059: function (e) {
    var result = { _: `message` };
    var t = e.uint();
    result.flags = t;
    result.out = !!(t & 2);
    result.mentioned = !!(t & 16);
    result.mediaUnread = !!(t & 32);
    result.silent = !!(t & 8192);
    result.post = !!(t & 16384);
    result.fromScheduled = !!(t & 262144);
    result.legacy = !!(t & 524288);
    result.editHide = !!(t & 2097152);
    result.pinned = !!(t & 16777216);
    result.noforwards = !!(t & 67108864);
    result.invertMedia = !!(t & 134217728);
    var n = e.uint();
    result.flags2 = n;
    result.offline = !!(n & 2);
    result.videoProcessingPending = !!(n & 16);
    result.paidSuggestedPostStars = !!(n & 256);
    result.paidSuggestedPostTon = !!(n & 512);
    result.id = e.int();
    if (t & 256) {
      result.fromId = e.object();
    }
    if (t & 536870912) {
      result.fromBoostsApplied = e.int();
    }
    if (n & 4096) {
      result.fromRank = e.string();
    }
    result.peerId = e.object();
    if (t & 268435456) {
      result.savedPeerId = e.object();
    }
    if (t & 4) {
      result.fwdFrom = e.object();
    }
    if (t & 2048) {
      result.viaBotId = e.long();
    }
    if (n & 1) {
      result.viaBusinessBotId = e.long();
    }
    if (n & 524288) {
      result.guestchatViaFrom = e.object();
    }
    if (t & 8) {
      result.replyTo = e.object();
    }
    result.date = e.int();
    result.message = e.string();
    if (t & 512) {
      result.media = e.object();
    }
    if (t & 64) {
      result.replyMarkup = e.object();
    }
    if (t & 128) {
      result.entities = e.vector(e.object);
    }
    if (t & 1024) {
      result.views = e.int();
    }
    if (t & 1024) {
      result.forwards = e.int();
    }
    if (t & 8388608) {
      result.replies = e.object();
    }
    if (t & 32768) {
      result.editDate = e.int();
    }
    if (t & 65536) {
      result.postAuthor = e.string();
    }
    if (t & 131072) {
      result.groupedId = e.long();
    }
    if (t & 1048576) {
      result.reactions = e.object();
    }
    if (t & 4194304) {
      result.restrictionReason = e.vector(e.object);
    }
    if (t & 33554432) {
      result.ttlPeriod = e.int();
    }
    if (t & 1073741824) {
      result.quickReplyShortcutId = e.int();
    }
    if (n & 4) {
      result.effect = e.long();
    }
    if (n & 8) {
      result.factcheck = e.object();
    }
    if (n & 32) {
      result.reportDeliveryUntilDate = e.int();
    }
    if (n & 64) {
      result.paidMessageStars = e.long();
    }
    if (n & 128) {
      result.suggestedPost = e.object();
    }
    if (n & 1024) {
      result.scheduleRepeatPeriod = e.int();
    }
    if (n & 2048) {
      result.summaryFromLanguage = e.string();
    }
    if (n & 8192) {
      result.richMessage = e.object();
    }
    return result;
  },
  2055212554: function (e) {
    var result = { _: `messageService` };
    var t = e.uint();
    result.flags = t;
    result.out = !!(t & 2);
    result.mentioned = !!(t & 16);
    result.mediaUnread = !!(t & 32);
    result.reactionsArePossible = !!(t & 512);
    result.silent = !!(t & 8192);
    result.post = !!(t & 16384);
    result.legacy = !!(t & 524288);
    result.id = e.int();
    if (t & 256) {
      result.fromId = e.object();
    }
    result.peerId = e.object();
    if (t & 268435456) {
      result.savedPeerId = e.object();
    }
    if (t & 8) {
      result.replyTo = e.object();
    }
    result.date = e.int();
    result.action = e.object();
    if (t & 1048576) {
      result.reactions = e.object();
    }
    if (t & 33554432) {
      result.ttlPeriod = e.int();
    }
    return result;
  },
  1038967584: function (e) {
    var result = { _: `messageMediaEmpty` };
    return result;
  },
  3793152867: function (e) {
    var result = { _: `messageMediaPhoto` };
    var t = e.uint();
    result.flags = t;
    result.spoiler = !!(t & 8);
    result.livePhoto = !!(t & 16);
    if (t & 1) {
      result.photo = e.object();
    }
    if (t & 4) {
      result.ttlSeconds = e.int();
    }
    if (t & 16) {
      result.video = e.object();
    }
    return result;
  },
  1457575028: function (e) {
    var result = { _: `messageMediaGeo` };
    result.geo = e.object();
    return result;
  },
  1882335561: function (e) {
    var result = { _: `messageMediaContact` };
    result.phoneNumber = e.string();
    result.firstName = e.string();
    result.lastName = e.string();
    result.vcard = e.string();
    result.userId = e.long();
    return result;
  },
  2676290718: function (e) {
    var result = { _: `messageMediaUnsupported` };
    return result;
  },
  1389939929: function (e) {
    var result = { _: `messageMediaDocument` };
    var t = e.uint();
    result.flags = t;
    result.nopremium = !!(t & 8);
    result.spoiler = !!(t & 16);
    result.video = !!(t & 64);
    result.round = !!(t & 128);
    result.voice = !!(t & 256);
    if (t & 1) {
      result.document = e.object();
    }
    if (t & 32) {
      result.altDocuments = e.vector(e.object);
    }
    if (t & 512) {
      result.videoCover = e.object();
    }
    if (t & 1024) {
      result.videoTimestamp = e.int();
    }
    if (t & 4) {
      result.ttlSeconds = e.int();
    }
    return result;
  },
  3723562043: function (e) {
    var result = { _: `messageMediaWebPage` };
    var t = e.uint();
    result.flags = t;
    result.forceLargeMedia = !!(t & 1);
    result.forceSmallMedia = !!(t & 2);
    result.manual = !!(t & 8);
    result.safe = !!(t & 16);
    result.webpage = e.object();
    return result;
  },
  784356159: function (e) {
    var result = { _: `messageMediaVenue` };
    result.geo = e.object();
    result.title = e.string();
    result.address = e.string();
    result.provider = e.string();
    result.venueId = e.string();
    result.venueType = e.string();
    return result;
  },
  4256272392: function (e) {
    var result = { _: `messageMediaGame` };
    result.game = e.object();
    return result;
  },
  4138027219: function (e) {
    var result = { _: `messageMediaInvoice` };
    var t = e.uint();
    result.flags = t;
    result.shippingAddressRequested = !!(t & 2);
    result.test = !!(t & 8);
    result.title = e.string();
    result.description = e.string();
    if (t & 1) {
      result.photo = e.object();
    }
    if (t & 4) {
      result.receiptMsgId = e.int();
    }
    result.currency = e.string();
    result.totalAmount = e.long();
    result.startParam = e.string();
    if (t & 16) {
      result.extendedMedia = e.object();
    }
    return result;
  },
  3108030054: function (e) {
    var result = { _: `messageMediaGeoLive` };
    var t = e.uint();
    result.flags = t;
    result.geo = e.object();
    if (t & 1) {
      result.heading = e.int();
    }
    result.period = e.int();
    if (t & 2) {
      result.proximityNotificationRadius = e.int();
    }
    return result;
  },
  2000637542: function (e) {
    var result = { _: `messageMediaPoll` };
    var t = e.uint();
    result.flags = t;
    result.poll = e.object();
    result.results = e.object();
    if (t & 1) {
      result.attachedMedia = e.object();
    }
    return result;
  },
  147581959: function (e) {
    var result = { _: `messageMediaDice` };
    var t = e.uint();
    result.flags = t;
    result.value = e.int();
    result.emoticon = e.string();
    if (t & 1) {
      result.gameOutcome = e.object();
    }
    return result;
  },
  1758159491: function (e) {
    var result = { _: `messageMediaStory` };
    var t = e.uint();
    result.flags = t;
    result.viaMention = !!(t & 2);
    result.peer = e.object();
    result.id = e.int();
    if (t & 1) {
      result.story = e.object();
    }
    return result;
  },
  2852600811: function (e) {
    var result = { _: `messageMediaGiveaway` };
    var t = e.uint();
    result.flags = t;
    result.onlyNewSubscribers = !!(t & 1);
    result.winnersAreVisible = !!(t & 4);
    result.channels = e.vector(e.long);
    if (t & 2) {
      result.countriesIso2 = e.vector(e.string);
    }
    if (t & 8) {
      result.prizeDescription = e.string();
    }
    result.quantity = e.int();
    if (t & 16) {
      result.months = e.int();
    }
    if (t & 32) {
      result.stars = e.long();
    }
    result.untilDate = e.int();
    return result;
  },
  3467263649: function (e) {
    var result = { _: `messageMediaGiveawayResults` };
    var t = e.uint();
    result.flags = t;
    result.onlyNewSubscribers = !!(t & 1);
    result.refunded = !!(t & 4);
    result.channelId = e.long();
    if (t & 8) {
      result.additionalPeersCount = e.int();
    }
    result.launchMsgId = e.int();
    result.winnersCount = e.int();
    result.unclaimedCount = e.int();
    result.winners = e.vector(e.long);
    if (t & 16) {
      result.months = e.int();
    }
    if (t & 32) {
      result.stars = e.long();
    }
    if (t & 2) {
      result.prizeDescription = e.string();
    }
    result.untilDate = e.int();
    return result;
  },
  2827297937: function (e) {
    var result = { _: `messageMediaPaidMedia` };
    result.starsAmount = e.long();
    result.extendedMedia = e.vector(e.object);
    return result;
  },
  2320740372: function (e) {
    var result = { _: `messageMediaToDo` };
    var t = e.uint();
    result.flags = t;
    result.todo = e.object();
    if (t & 1) {
      result.completions = e.vector(e.object);
    }
    return result;
  },
  3395070857: function (e) {
    var result = { _: `messageMediaVideoStream` };
    var t = e.uint();
    result.flags = t;
    result.rtmpStream = !!(t & 1);
    result.call = e.object();
    return result;
  },
  3064919984: function (e) {
    var result = { _: `messageActionEmpty` };
    return result;
  },
  3175599021: function (e) {
    var result = { _: `messageActionChatCreate` };
    result.title = e.string();
    result.users = e.vector(e.long);
    return result;
  },
  3047280218: function (e) {
    var result = { _: `messageActionChatEditTitle` };
    result.title = e.string();
    return result;
  },
  2144015272: function (e) {
    var result = { _: `messageActionChatEditPhoto` };
    result.photo = e.object();
    return result;
  },
  2514746351: function (e) {
    var result = { _: `messageActionChatDeletePhoto` };
    return result;
  },
  365886720: function (e) {
    var result = { _: `messageActionChatAddUser` };
    result.users = e.vector(e.long);
    return result;
  },
  2755604684: function (e) {
    var result = { _: `messageActionChatDeleteUser` };
    result.userId = e.long();
    return result;
  },
  51520707: function (e) {
    var result = { _: `messageActionChatJoinedByLink` };
    result.inviterId = e.long();
    return result;
  },
  2513611922: function (e) {
    var result = { _: `messageActionChannelCreate` };
    result.title = e.string();
    return result;
  },
  3775102866: function (e) {
    var result = { _: `messageActionChatMigrateTo` };
    result.channelId = e.long();
    return result;
  },
  3929622761: function (e) {
    var result = { _: `messageActionChannelMigrateFrom` };
    result.title = e.string();
    result.chatId = e.long();
    return result;
  },
  2495428845: function (e) {
    var result = { _: `messageActionPinMessage` };
    return result;
  },
  2679813636: function (e) {
    var result = { _: `messageActionHistoryClear` };
    return result;
  },
  2460428406: function (e) {
    var result = { _: `messageActionGameScore` };
    result.gameId = e.long();
    result.score = e.int();
    return result;
  },
  4288679116: function (e) {
    var result = { _: `messageActionPaymentSentMe` };
    var t = e.uint();
    result.flags = t;
    result.recurringInit = !!(t & 4);
    result.recurringUsed = !!(t & 8);
    result.currency = e.string();
    result.totalAmount = e.long();
    result.payload = e.bytes();
    if (t & 1) {
      result.info = e.object();
    }
    if (t & 2) {
      result.shippingOptionId = e.string();
    }
    result.charge = e.object();
    if (t & 16) {
      result.subscriptionUntilDate = e.int();
    }
    return result;
  },
  3324293486: function (e) {
    var result = { _: `messageActionPaymentSent` };
    var t = e.uint();
    result.flags = t;
    result.recurringInit = !!(t & 4);
    result.recurringUsed = !!(t & 8);
    result.currency = e.string();
    result.totalAmount = e.long();
    if (t & 1) {
      result.invoiceSlug = e.string();
    }
    if (t & 16) {
      result.subscriptionUntilDate = e.int();
    }
    return result;
  },
  2162236031: function (e) {
    var result = { _: `messageActionPhoneCall` };
    var t = e.uint();
    result.flags = t;
    result.video = !!(t & 4);
    result.callId = e.long();
    if (t & 1) {
      result.reason = e.object();
    }
    if (t & 2) {
      result.duration = e.int();
    }
    return result;
  },
  1200788123: function (e) {
    var result = { _: `messageActionScreenshotTaken` };
    return result;
  },
  4209418070: function (e) {
    var result = { _: `messageActionCustomAction` };
    result.message = e.string();
    return result;
  },
  3306608249: function (e) {
    var result = { _: `messageActionBotAllowed` };
    var t = e.uint();
    result.flags = t;
    result.attachMenu = !!(t & 2);
    result.fromRequest = !!(t & 8);
    if (t & 1) {
      result.domain = e.string();
    }
    if (t & 4) {
      result.app = e.object();
    }
    return result;
  },
  455635795: function (e) {
    var result = { _: `messageActionSecureValuesSentMe` };
    result.values = e.vector(e.object);
    result.credentials = e.object();
    return result;
  },
  3646710100: function (e) {
    var result = { _: `messageActionSecureValuesSent` };
    result.types = e.vector(e.object);
    return result;
  },
  4092747638: function (e) {
    var result = { _: `messageActionContactSignUp` };
    return result;
  },
  2564871831: function (e) {
    var result = { _: `messageActionGeoProximityReached` };
    result.fromId = e.object();
    result.toId = e.object();
    result.distance = e.int();
    return result;
  },
  2047704898: function (e) {
    var result = { _: `messageActionGroupCall` };
    var t = e.uint();
    result.flags = t;
    result.call = e.object();
    if (t & 1) {
      result.duration = e.int();
    }
    return result;
  },
  1345295095: function (e) {
    var result = { _: `messageActionInviteToGroupCall` };
    result.call = e.object();
    result.users = e.vector(e.long);
    return result;
  },
  1007897979: function (e) {
    var result = { _: `messageActionSetMessagesTTL` };
    var t = e.uint();
    result.flags = t;
    result.period = e.int();
    if (t & 1) {
      result.autoSettingFrom = e.long();
    }
    return result;
  },
  3013637729: function (e) {
    var result = { _: `messageActionGroupCallScheduled` };
    result.call = e.object();
    result.scheduleDate = e.int();
    return result;
  },
  3105602874: function (e) {
    var result = { _: `messageActionSetChatTheme` };
    result.theme = e.object();
    return result;
  },
  3955008459: function (e) {
    var result = { _: `messageActionChatJoinedByRequest` };
    return result;
  },
  1205698681: function (e) {
    var result = { _: `messageActionWebViewDataSentMe` };
    result.text = e.string();
    result.data = e.string();
    return result;
  },
  3032714421: function (e) {
    var result = { _: `messageActionWebViewDataSent` };
    result.text = e.string();
    return result;
  },
  1223234306: function (e) {
    var result = { _: `messageActionGiftPremium` };
    var t = e.uint();
    result.flags = t;
    result.currency = e.string();
    result.amount = e.long();
    result.days = e.int();
    if (t & 1) {
      result.cryptoCurrency = e.string();
    }
    if (t & 1) {
      result.cryptoAmount = e.long();
    }
    if (t & 2) {
      result.message = e.object();
    }
    return result;
  },
  228168278: function (e) {
    var result = { _: `messageActionTopicCreate` };
    var t = e.uint();
    result.flags = t;
    result.titleMissing = !!(t & 2);
    result.title = e.string();
    result.iconColor = e.int();
    if (t & 1) {
      result.iconEmojiId = e.long();
    }
    return result;
  },
  3230943264: function (e) {
    var result = { _: `messageActionTopicEdit` };
    var t = e.uint();
    result.flags = t;
    if (t & 1) {
      result.title = e.string();
    }
    if (t & 2) {
      result.iconEmojiId = e.long();
    }
    if (t & 4) {
      result.closed = e.object();
    }
    if (t & 8) {
      result.hidden = e.object();
    }
    return result;
  },
  1474192222: function (e) {
    var result = { _: `messageActionSuggestProfilePhoto` };
    result.photo = e.object();
    return result;
  },
  827428507: function (e) {
    var result = { _: `messageActionRequestedPeer` };
    result.buttonId = e.int();
    result.peers = e.vector(e.object);
    return result;
  },
  1348510708: function (e) {
    var result = { _: `messageActionSetChatWallPaper` };
    var t = e.uint();
    result.flags = t;
    result.same = !!(t & 1);
    result.forBoth = !!(t & 2);
    result.wallpaper = e.object();
    return result;
  },
  834962247: function (e) {
    var result = { _: `messageActionGiftCode` };
    var t = e.uint();
    result.flags = t;
    result.viaGiveaway = !!(t & 1);
    result.unclaimed = !!(t & 32);
    if (t & 2) {
      result.boostPeer = e.object();
    }
    result.days = e.int();
    result.slug = e.string();
    if (t & 4) {
      result.currency = e.string();
    }
    if (t & 4) {
      result.amount = e.long();
    }
    if (t & 8) {
      result.cryptoCurrency = e.string();
    }
    if (t & 8) {
      result.cryptoAmount = e.long();
    }
    if (t & 16) {
      result.message = e.object();
    }
    return result;
  },
  2819576292: function (e) {
    var result = { _: `messageActionGiveawayLaunch` };
    var t = e.uint();
    result.flags = t;
    if (t & 1) {
      result.stars = e.long();
    }
    return result;
  },
  2279797077: function (e) {
    var result = { _: `messageActionGiveawayResults` };
    var t = e.uint();
    result.flags = t;
    result.stars = !!(t & 1);
    result.winnersCount = e.int();
    result.unclaimedCount = e.int();
    return result;
  },
  3422726765: function (e) {
    var result = { _: `messageActionBoostApply` };
    result.boosts = e.int();
    return result;
  },
  2477987912: function (e) {
    var result = { _: `messageActionRequestedPeerSentMe` };
    result.buttonId = e.int();
    result.peers = e.vector(e.object);
    return result;
  },
  1102307842: function (e) {
    var result = { _: `messageActionPaymentRefunded` };
    var t = e.uint();
    result.flags = t;
    result.peer = e.object();
    result.currency = e.string();
    result.totalAmount = e.long();
    if (t & 1) {
      result.payload = e.bytes();
    }
    result.charge = e.object();
    return result;
  },
  1171632161: function (e) {
    var result = { _: `messageActionGiftStars` };
    var t = e.uint();
    result.flags = t;
    result.currency = e.string();
    result.amount = e.long();
    result.stars = e.long();
    if (t & 1) {
      result.cryptoCurrency = e.string();
    }
    if (t & 1) {
      result.cryptoAmount = e.long();
    }
    if (t & 2) {
      result.transactionId = e.string();
    }
    return result;
  },
  2953594786: function (e) {
    var result = { _: `messageActionPrizeStars` };
    var t = e.uint();
    result.flags = t;
    result.unclaimed = !!(t & 1);
    result.stars = e.long();
    result.transactionId = e.string();
    result.boostPeer = e.object();
    result.giveawayMsgId = e.int();
    return result;
  },
  3928764883: function (e) {
    var result = { _: `messageActionStarGift` };
    var t = e.uint();
    result.flags = t;
    result.nameHidden = !!(t & 1);
    result.saved = !!(t & 4);
    result.converted = !!(t & 8);
    result.upgraded = !!(t & 32);
    result.refunded = !!(t & 512);
    result.canUpgrade = !!(t & 1024);
    result.prepaidUpgrade = !!(t & 8192);
    result.upgradeSeparate = !!(t & 65536);
    result.auctionAcquired = !!(t & 131072);
    result.gift = e.object();
    if (t & 2) {
      result.message = e.object();
    }
    if (t & 16) {
      result.convertStars = e.long();
    }
    if (t & 32) {
      result.upgradeMsgId = e.int();
    }
    if (t & 256) {
      result.upgradeStars = e.long();
    }
    if (t & 2048) {
      result.fromId = e.object();
    }
    if (t & 4096) {
      result.peer = e.object();
    }
    if (t & 4096) {
      result.savedId = e.long();
    }
    if (t & 16384) {
      result.prepaidUpgradeHash = e.string();
    }
    if (t & 32768) {
      result.giftMsgId = e.int();
    }
    if (t & 262144) {
      result.toId = e.object();
    }
    if (t & 524288) {
      result.giftNum = e.int();
    }
    return result;
  },
  2115768711: function (e) {
    var result = { _: `messageActionStarGiftUnique` };
    var t = e.uint();
    result.flags = t;
    result.upgrade = !!(t & 1);
    result.transferred = !!(t & 2);
    result.saved = !!(t & 4);
    result.refunded = !!(t & 32);
    result.prepaidUpgrade = !!(t & 2048);
    result.assigned = !!(t & 8192);
    result.fromOffer = !!(t & 16384);
    result.craft = !!(t & 65536);
    result.nameHidden = !!(t & 131072);
    result.gift = e.object();
    if (t & 8) {
      result.canExportAt = e.int();
    }
    if (t & 16) {
      result.transferStars = e.long();
    }
    if (t & 64) {
      result.fromId = e.object();
    }
    if (t & 128) {
      result.peer = e.object();
    }
    if (t & 128) {
      result.savedId = e.long();
    }
    if (t & 256) {
      result.resaleAmount = e.object();
    }
    if (t & 512) {
      result.canTransferAt = e.int();
    }
    if (t & 1024) {
      result.canResellAt = e.int();
    }
    if (t & 4096) {
      result.dropOriginalDetailsStars = e.long();
    }
    if (t & 32768) {
      result.canCraftAt = e.int();
    }
    if (t & 262144) {
      result.message = e.object();
    }
    return result;
  },
  2887720909: function (e) {
    var result = { _: `messageActionPaidMessagesRefunded` };
    result.count = e.int();
    result.stars = e.long();
    return result;
  },
  2226685304: function (e) {
    var result = { _: `messageActionPaidMessagesPrice` };
    var t = e.uint();
    result.flags = t;
    result.broadcastMessagesAllowed = !!(t & 1);
    result.stars = e.long();
    return result;
  },
  805187450: function (e) {
    var result = { _: `messageActionConferenceCall` };
    var t = e.uint();
    result.flags = t;
    result.missed = !!(t & 1);
    result.active = !!(t & 2);
    result.video = !!(t & 16);
    result.callId = e.long();
    if (t & 4) {
      result.duration = e.int();
    }
    if (t & 8) {
      result.otherParticipants = e.vector(e.object);
    }
    return result;
  },
  3430702217: function (e) {
    var result = { _: `messageActionTodoCompletions` };
    result.completed = e.vector(e.int);
    result.incompleted = e.vector(e.int);
    return result;
  },
  3354246275: function (e) {
    var result = { _: `messageActionTodoAppendTasks` };
    result.list = e.vector(e.object);
    return result;
  },
  4000978326: function (e) {
    var result = { _: `messageActionSuggestedPostApproval` };
    var t = e.uint();
    result.flags = t;
    result.rejected = !!(t & 1);
    result.balanceTooLow = !!(t & 2);
    if (t & 4) {
      result.rejectComment = e.string();
    }
    if (t & 8) {
      result.scheduleDate = e.int();
    }
    if (t & 16) {
      result.price = e.object();
    }
    return result;
  },
  2514341737: function (e) {
    var result = { _: `messageActionSuggestedPostSuccess` };
    result.price = e.object();
    return result;
  },
  1777932024: function (e) {
    var result = { _: `messageActionSuggestedPostRefund` };
    var t = e.uint();
    result.flags = t;
    result.payerInitiated = !!(t & 1);
    return result;
  },
  2829305497: function (e) {
    var result = { _: `messageActionGiftTon` };
    var t = e.uint();
    result.flags = t;
    result.currency = e.string();
    result.amount = e.long();
    result.cryptoCurrency = e.string();
    result.cryptoAmount = e.long();
    if (t & 1) {
      result.transactionId = e.string();
    }
    return result;
  },
  747579941: function (e) {
    var result = { _: `messageActionSuggestBirthday` };
    result.birthday = e.object();
    return result;
  },
  2000845012: function (e) {
    var result = { _: `messageActionStarGiftPurchaseOffer` };
    var t = e.uint();
    result.flags = t;
    result.accepted = !!(t & 1);
    result.declined = !!(t & 2);
    result.gift = e.object();
    result.price = e.object();
    result.expiresAt = e.int();
    return result;
  },
  1940760427: function (e) {
    var result = { _: `messageActionStarGiftPurchaseOfferDeclined` };
    var t = e.uint();
    result.flags = t;
    result.expired = !!(t & 1);
    result.gift = e.object();
    result.price = e.object();
    return result;
  },
  2961100933: function (e) {
    var result = { _: `messageActionNewCreatorPending` };
    result.newCreatorId = e.long();
    return result;
  },
  3783807035: function (e) {
    var result = { _: `messageActionChangeCreator` };
    result.newCreatorId = e.long();
    return result;
  },
  3212666226: function (e) {
    var result = { _: `messageActionNoForwardsToggle` };
    result.prevValue = e.object();
    result.newValue = e.object();
    return result;
  },
  1042781114: function (e) {
    var result = { _: `messageActionNoForwardsRequest` };
    var t = e.uint();
    result.flags = t;
    result.expired = !!(t & 1);
    result.prevValue = e.object();
    result.newValue = e.object();
    return result;
  },
  2644626796: function (e) {
    var result = { _: `messageActionPollAppendAnswer` };
    result.answer = e.object();
    return result;
  },
  966161628: function (e) {
    var result = { _: `messageActionPollDeleteAnswer` };
    result.answer = e.object();
    return result;
  },
  375414334: function (e) {
    var result = { _: `messageActionManagedBotCreated` };
    result.botId = e.long();
    return result;
  },
  1562426088: function (e) {
    var result = { _: `messageActionChangeCommunity` };
    var t = e.uint();
    result.flags = t;
    if (t & 1) {
      result.communityId = e.long();
    }
    return result;
  },
  1250688640: function (e) {
    var result = { _: `messageActionChatJoinedViaCommunity` };
    result.communityId = e.long();
    return result;
  },
  2468997683: function (e) {
    var result = { _: `messageActionGramTransfer` };
    var t = e.uint();
    result.flags = t;
    result.commentEncrypted = !!(t & 2);
    result.amount = e.long();
    result.peerAddress = e.string();
    result.transactionId = e.string();
    if (t & 1) {
      result.comment = e.string();
    }
    return result;
  },
  1773716671: function (e) {
    var result = { _: `messageActionWalletTonConnectRequest` };
    var t = e.uint();
    result.flags = t;
    result.accepted = !!(t & 4);
    result.declined = !!(t & 8);
    result.sessionId = e.long();
    result.expires = e.int();
    if (t & 1) {
      result.topic = e.string();
    }
    if (t & 2) {
      result.traceId = e.string();
    }
    if (t & 16) {
      result.dappName = e.string();
    }
    return result;
  },
  4236900339: function (e) {
    var result = { _: `dialog` };
    var t = e.uint();
    result.flags = t;
    result.pinned = !!(t & 4);
    result.unreadMark = !!(t & 8);
    result.viewForumAsMessages = !!(t & 64);
    result.peer = e.object();
    result.topMessage = e.int();
    result.readInboxMaxId = e.int();
    result.readOutboxMaxId = e.int();
    result.unreadCount = e.int();
    result.unreadMentionsCount = e.int();
    result.unreadReactionsCount = e.int();
    result.unreadPollVotesCount = e.int();
    result.notifySettings = e.object();
    if (t & 1) {
      result.pts = e.int();
    }
    if (t & 2) {
      result.draft = e.object();
    }
    if (t & 16) {
      result.folderId = e.int();
    }
    if (t & 32) {
      result.ttlPeriod = e.int();
    }
    return result;
  },
  1908216652: function (e) {
    var result = { _: `dialogFolder` };
    var t = e.uint();
    result.flags = t;
    result.pinned = !!(t & 4);
    result.folder = e.object();
    result.peer = e.object();
    result.topMessage = e.int();
    result.unreadMutedPeersCount = e.int();
    result.unreadUnmutedPeersCount = e.int();
    result.unreadMutedMessagesCount = e.int();
    result.unreadUnmutedMessagesCount = e.int();
    return result;
  },
  4153018739: function (e) {
    var result = { _: `dialogCommunity` };
    var t = e.uint();
    result.flags = t;
    result.pinned = !!(t & 4);
    result.communityId = e.long();
    result.notifySettings = e.object();
    return result;
  },
  590459437: function (e) {
    var result = { _: `photoEmpty` };
    result.id = e.long();
    return result;
  },
  4212750949: function (e) {
    var result = { _: `photo` };
    var t = e.uint();
    result.flags = t;
    result.hasStickers = !!(t & 1);
    result.id = e.long();
    result.accessHash = e.long();
    result.fileReference = e.bytes();
    result.date = e.int();
    result.sizes = e.vector(e.object);
    if (t & 2) {
      result.videoSizes = e.vector(e.object);
    }
    result.dcId = e.int();
    return result;
  },
  236446268: function (e) {
    var result = { _: `photoSizeEmpty` };
    result.type = e.string();
    return result;
  },
  1976012384: function (e) {
    var result = { _: `photoSize` };
    result.type = e.string();
    result.w = e.int();
    result.h = e.int();
    result.size = e.int();
    return result;
  },
  35527382: function (e) {
    var result = { _: `photoCachedSize` };
    result.type = e.string();
    result.w = e.int();
    result.h = e.int();
    result.bytes = e.bytes();
    return result;
  },
  3769678894: function (e) {
    var result = { _: `photoStrippedSize` };
    result.type = e.string();
    result.bytes = e.bytes();
    return result;
  },
  4198431637: function (e) {
    var result = { _: `photoSizeProgressive` };
    result.type = e.string();
    result.w = e.int();
    result.h = e.int();
    result.sizes = e.vector(e.int);
    return result;
  },
  3626061121: function (e) {
    var result = { _: `photoPathSize` };
    result.type = e.string();
    result.bytes = e.bytes();
    return result;
  },
  286776671: function (e) {
    var result = { _: `geoPointEmpty` };
    return result;
  },
  2997024355: function (e) {
    var result = { _: `geoPoint` };
    var t = e.uint();
    result.flags = t;
    result.long = e.double();
    result.lat = e.double();
    result.accessHash = e.long();
    if (t & 1) {
      result.accuracyRadius = e.int();
    }
    return result;
  },
  1577067778: function (e) {
    var result = { _: `auth.sentCode` };
    var t = e.uint();
    result.flags = t;
    result.type = e.object();
    result.phoneCodeHash = e.string();
    if (t & 2) {
      result.nextType = e.object();
    }
    if (t & 4) {
      result.timeout = e.int();
    }
    return result;
  },
  596704836: function (e) {
    var result = { _: `auth.sentCodeSuccess` };
    result.authorization = e.object();
    return result;
  },
  4169301695: function (e) {
    var result = { _: `auth.sentCodePaymentRequired` };
    result.storeProduct = e.string();
    result.phoneCodeHash = e.string();
    result.supportEmailAddress = e.string();
    result.supportEmailSubject = e.string();
    result.premiumDays = e.int();
    result.currency = e.string();
    result.amount = e.long();
    return result;
  },
  782418132: function (e) {
    var result = { _: `auth.authorization` };
    var t = e.uint();
    result.flags = t;
    result.setupPasswordRequired = !!(t & 2);
    if (t & 2) {
      result.otherwiseReloginDays = e.int();
    }
    if (t & 1) {
      result.tmpSessions = e.int();
    }
    if (t & 4) {
      result.futureAuthToken = e.bytes();
    }
    result.user = e.object();
    return result;
  },
  1148485274: function (e) {
    var result = { _: `auth.authorizationSignUpRequired` };
    var t = e.uint();
    result.flags = t;
    if (t & 1) {
      result.termsOfService = e.object();
    }
    return result;
  },
  3023364792: function (e) {
    var result = { _: `auth.exportedAuthorization` };
    result.id = e.long();
    result.bytes = e.bytes();
    return result;
  },
  3099351820: function (e) {
    var result = { _: `inputNotifyPeer` };
    result.peer = e.object();
    return result;
  },
  423314455: function (e) {
    var result = { _: `inputNotifyUsers` };
    return result;
  },
  1251338318: function (e) {
    var result = { _: `inputNotifyChats` };
    return result;
  },
  2983951486: function (e) {
    var result = { _: `inputNotifyBroadcasts` };
    return result;
  },
  1548122514: function (e) {
    var result = { _: `inputNotifyForumTopic` };
    result.peer = e.object();
    result.topMsgId = e.int();
    return result;
  },
  666573532: function (e) {
    var result = { _: `inputNotifyCommunity` };
    result.community = e.object();
    return result;
  },
  3402328802: function (e) {
    var result = { _: `inputPeerNotifySettings` };
    var t = e.uint();
    result.flags = t;
    if (t & 1) {
      result.showPreviews = e.object();
    }
    if (t & 2) {
      result.silent = e.object();
    }
    if (t & 4) {
      result.muteUntil = e.int();
    }
    if (t & 8) {
      result.sound = e.object();
    }
    if (t & 64) {
      result.storiesMuted = e.object();
    }
    if (t & 128) {
      result.storiesHideSender = e.object();
    }
    if (t & 256) {
      result.storiesSound = e.object();
    }
    return result;
  },
  2573347852: function (e) {
    var result = { _: `peerNotifySettings` };
    var t = e.uint();
    result.flags = t;
    if (t & 1) {
      result.showPreviews = e.object();
    }
    if (t & 2) {
      result.silent = e.object();
    }
    if (t & 4) {
      result.muteUntil = e.int();
    }
    if (t & 8) {
      result.iosSound = e.object();
    }
    if (t & 16) {
      result.androidSound = e.object();
    }
    if (t & 32) {
      result.otherSound = e.object();
    }
    if (t & 64) {
      result.storiesMuted = e.object();
    }
    if (t & 128) {
      result.storiesHideSender = e.object();
    }
    if (t & 256) {
      result.storiesIosSound = e.object();
    }
    if (t & 512) {
      result.storiesAndroidSound = e.object();
    }
    if (t & 1024) {
      result.storiesOtherSound = e.object();
    }
    return result;
  },
  4101456375: function (e) {
    var result = { _: `peerSettings` };
    var t = e.uint();
    result.flags = t;
    result.reportSpam = !!(t & 1);
    result.addContact = !!(t & 2);
    result.blockContact = !!(t & 4);
    result.shareContact = !!(t & 8);
    result.needContactsException = !!(t & 16);
    result.reportGeo = !!(t & 32);
    result.autoarchived = !!(t & 128);
    result.inviteMembers = !!(t & 256);
    result.requestChatBroadcast = !!(t & 1024);
    result.businessBotPaused = !!(t & 2048);
    result.businessBotCanReply = !!(t & 4096);
    if (t & 64) {
      result.geoDistance = e.int();
    }
    if (t & 512) {
      result.requestChatTitle = e.string();
    }
    if (t & 512) {
      result.requestChatDate = e.int();
    }
    if (t & 8192) {
      result.businessBotId = e.long();
    }
    if (t & 8192) {
      result.businessBotManageUrl = e.string();
    }
    if (t & 16384) {
      result.chargePaidMessageStars = e.long();
    }
    if (t & 32768) {
      result.registrationMonth = e.string();
    }
    if (t & 65536) {
      result.phoneCountry = e.string();
    }
    if (t & 131072) {
      result.nameChangeDate = e.int();
    }
    if (t & 262144) {
      result.photoChangeDate = e.int();
    }
    return result;
  },
  2755118061: function (e) {
    var result = { _: `wallPaper` };
    result.id = e.long();
    var t = e.uint();
    result.flags = t;
    result.creator = !!(t & 1);
    result.default = !!(t & 2);
    result.pattern = !!(t & 8);
    result.dark = !!(t & 16);
    result.accessHash = e.long();
    result.slug = e.string();
    result.document = e.object();
    if (t & 4) {
      result.settings = e.object();
    }
    return result;
  },
  3766501654: function (e) {
    var result = { _: `wallPaperNoFile` };
    result.id = e.long();
    var t = e.uint();
    result.flags = t;
    result.default = !!(t & 2);
    result.dark = !!(t & 16);
    if (t & 4) {
      result.settings = e.object();
    }
    return result;
  },
  1490799288: function (e) {
    var result = { _: `inputReportReasonSpam` };
    return result;
  },
  505595789: function (e) {
    var result = { _: `inputReportReasonViolence` };
    return result;
  },
  777640226: function (e) {
    var result = { _: `inputReportReasonPornography` };
    return result;
  },
  2918469347: function (e) {
    var result = { _: `inputReportReasonChildAbuse` };
    return result;
  },
  3252986545: function (e) {
    var result = { _: `inputReportReasonOther` };
    return result;
  },
  2609510714: function (e) {
    var result = { _: `inputReportReasonCopyright` };
    return result;
  },
  3688169197: function (e) {
    var result = { _: `inputReportReasonGeoIrrelevant` };
    return result;
  },
  4124956391: function (e) {
    var result = { _: `inputReportReasonFake` };
    return result;
  },
  177124030: function (e) {
    var result = { _: `inputReportReasonIllegalDrugs` };
    return result;
  },
  2663876157: function (e) {
    var result = { _: `inputReportReasonPersonalDetails` };
    return result;
  },
  114026053: function (e) {
    var result = { _: `userFull` };
    var t = e.uint();
    result.flags = t;
    result.blocked = !!(t & 1);
    result.phoneCallsAvailable = !!(t & 16);
    result.phoneCallsPrivate = !!(t & 32);
    result.canPinMessage = !!(t & 128);
    result.hasScheduled = !!(t & 4096);
    result.videoCallsAvailable = !!(t & 8192);
    result.voiceMessagesForbidden = !!(t & 1048576);
    result.translationsDisabled = !!(t & 8388608);
    result.storiesPinnedAvailable = !!(t & 67108864);
    result.blockedMyStoriesFrom = !!(t & 134217728);
    result.wallpaperOverridden = !!(t & 268435456);
    result.contactRequirePremium = !!(t & 536870912);
    result.readDatesPrivate = !!(t & 1073741824);
    var n = e.uint();
    result.flags2 = n;
    result.sponsoredEnabled = !!(n & 128);
    result.canViewRevenue = !!(n & 512);
    result.botCanManageEmojiStatus = !!(n & 1024);
    result.displayGiftsButton = !!(n & 65536);
    result.noforwardsMyEnabled = !!(n & 8388608);
    result.noforwardsPeerEnabled = !!(n & 16777216);
    result.unofficialSecurityRisk = !!(n & 67108864);
    result.id = e.long();
    if (t & 2) {
      result.about = e.string();
    }
    result.settings = e.object();
    if (t & 2097152) {
      result.personalPhoto = e.object();
    }
    if (t & 4) {
      result.profilePhoto = e.object();
    }
    if (t & 4194304) {
      result.fallbackPhoto = e.object();
    }
    result.notifySettings = e.object();
    if (t & 8) {
      result.botInfo = e.object();
    }
    if (t & 64) {
      result.pinnedMsgId = e.int();
    }
    result.commonChatsCount = e.int();
    if (t & 2048) {
      result.folderId = e.int();
    }
    if (t & 16384) {
      result.ttlPeriod = e.int();
    }
    if (t & 32768) {
      result.theme = e.object();
    }
    if (t & 65536) {
      result.privateForwardName = e.string();
    }
    if (t & 131072) {
      result.botGroupAdminRights = e.object();
    }
    if (t & 262144) {
      result.botBroadcastAdminRights = e.object();
    }
    if (t & 16777216) {
      result.wallpaper = e.object();
    }
    if (t & 33554432) {
      result.stories = e.object();
    }
    if (n & 1) {
      result.businessWorkHours = e.object();
    }
    if (n & 2) {
      result.businessLocation = e.object();
    }
    if (n & 4) {
      result.businessGreetingMessage = e.object();
    }
    if (n & 8) {
      result.businessAwayMessage = e.object();
    }
    if (n & 16) {
      result.businessIntro = e.object();
    }
    if (n & 32) {
      result.birthday = e.object();
    }
    if (n & 64) {
      result.personalChannelId = e.long();
    }
    if (n & 64) {
      result.personalChannelMessage = e.int();
    }
    if (n & 256) {
      result.stargiftsCount = e.int();
    }
    if (n & 2048) {
      result.starrefProgram = e.object();
    }
    if (n & 4096) {
      result.botVerification = e.object();
    }
    if (n & 16384) {
      result.sendPaidMessagesStars = e.long();
    }
    if (n & 32768) {
      result.disallowedGifts = e.object();
    }
    if (n & 131072) {
      result.starsRating = e.object();
    }
    if (n & 262144) {
      result.starsMyPendingRating = e.object();
    }
    if (n & 262144) {
      result.starsMyPendingRatingDate = e.int();
    }
    if (n & 1048576) {
      result.mainTab = e.object();
    }
    if (n & 2097152) {
      result.savedMusic = e.object();
    }
    if (n & 4194304) {
      result.note = e.object();
    }
    if (n & 33554432) {
      result.botManagerId = e.long();
    }
    return result;
  },
  341499403: function (e) {
    var result = { _: `contact` };
    result.userId = e.long();
    result.mutual = e.object();
    return result;
  },
  3242081360: function (e) {
    var result = { _: `importedContact` };
    result.userId = e.long();
    result.clientId = e.long();
    return result;
  },
  383348795: function (e) {
    var result = { _: `contactStatus` };
    result.userId = e.long();
    result.status = e.object();
    return result;
  },
  3075189202: function (e) {
    var result = { _: `contacts.contactsNotModified` };
    return result;
  },
  3941105218: function (e) {
    var result = { _: `contacts.contacts` };
    result.contacts = e.vector(e.object);
    result.savedCount = e.int();
    result.users = e.vector(e.object);
    return result;
  },
  2010127419: function (e) {
    var result = { _: `contacts.importedContacts` };
    result.imported = e.vector(e.object);
    result.popularInvites = e.vector(e.object);
    result.retryContacts = e.vector(e.long);
    result.users = e.vector(e.object);
    return result;
  },
  182326673: function (e) {
    var result = { _: `contacts.blocked` };
    result.blocked = e.vector(e.object);
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  3781575060: function (e) {
    var result = { _: `contacts.blockedSlice` };
    result.count = e.int();
    result.blocked = e.vector(e.object);
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  364538944: function (e) {
    var result = { _: `messages.dialogs` };
    result.dialogs = e.vector(e.object);
    result.messages = e.vector(e.object);
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  1910543603: function (e) {
    var result = { _: `messages.dialogsSlice` };
    result.count = e.int();
    result.dialogs = e.vector(e.object);
    result.messages = e.vector(e.object);
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  4041467286: function (e) {
    var result = { _: `messages.dialogsNotModified` };
    result.count = e.int();
    return result;
  },
  494135274: function (e) {
    var result = { _: `messages.messages` };
    result.messages = e.vector(e.object);
    result.topics = e.vector(e.object);
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  1595959062: function (e) {
    var result = { _: `messages.messagesSlice` };
    var t = e.uint();
    result.flags = t;
    result.inexact = !!(t & 2);
    result.count = e.int();
    if (t & 1) {
      result.nextRate = e.int();
    }
    if (t & 4) {
      result.offsetIdOffset = e.int();
    }
    if (t & 8) {
      result.searchFlood = e.object();
    }
    result.messages = e.vector(e.object);
    result.topics = e.vector(e.object);
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  3346446926: function (e) {
    var result = { _: `messages.channelMessages` };
    var t = e.uint();
    result.flags = t;
    result.inexact = !!(t & 2);
    result.pts = e.int();
    result.count = e.int();
    if (t & 4) {
      result.offsetIdOffset = e.int();
    }
    result.messages = e.vector(e.object);
    result.topics = e.vector(e.object);
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  1951620897: function (e) {
    var result = { _: `messages.messagesNotModified` };
    result.count = e.int();
    return result;
  },
  1694474197: function (e) {
    var result = { _: `messages.chats` };
    result.chats = e.vector(e.object);
    return result;
  },
  2631405892: function (e) {
    var result = { _: `messages.chatsSlice` };
    result.count = e.int();
    result.chats = e.vector(e.object);
    return result;
  },
  3856126364: function (e) {
    var result = { _: `messages.chatFull` };
    result.fullChat = e.object();
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  3025955281: function (e) {
    var result = { _: `messages.affectedHistory` };
    result.pts = e.int();
    result.ptsCount = e.int();
    result.offset = e.int();
    return result;
  },
  1474492012: function (e) {
    var result = { _: `inputMessagesFilterEmpty` };
    return result;
  },
  2517214492: function (e) {
    var result = { _: `inputMessagesFilterPhotos` };
    return result;
  },
  2680163941: function (e) {
    var result = { _: `inputMessagesFilterVideo` };
    return result;
  },
  1458172132: function (e) {
    var result = { _: `inputMessagesFilterPhotoVideo` };
    return result;
  },
  2665345416: function (e) {
    var result = { _: `inputMessagesFilterDocument` };
    return result;
  },
  2129714567: function (e) {
    var result = { _: `inputMessagesFilterUrl` };
    return result;
  },
  4291323271: function (e) {
    var result = { _: `inputMessagesFilterGif` };
    return result;
  },
  1358283666: function (e) {
    var result = { _: `inputMessagesFilterVoice` };
    return result;
  },
  928101534: function (e) {
    var result = { _: `inputMessagesFilterMusic` };
    return result;
  },
  975236280: function (e) {
    var result = { _: `inputMessagesFilterChatPhotos` };
    return result;
  },
  2160695144: function (e) {
    var result = { _: `inputMessagesFilterPhoneCalls` };
    var t = e.uint();
    result.flags = t;
    result.missed = !!(t & 1);
    return result;
  },
  2054952868: function (e) {
    var result = { _: `inputMessagesFilterRoundVoice` };
    return result;
  },
  3041516115: function (e) {
    var result = { _: `inputMessagesFilterRoundVideo` };
    return result;
  },
  3254314650: function (e) {
    var result = { _: `inputMessagesFilterMyMentions` };
    return result;
  },
  3875695885: function (e) {
    var result = { _: `inputMessagesFilterGeo` };
    return result;
  },
  3764575107: function (e) {
    var result = { _: `inputMessagesFilterContacts` };
    return result;
  },
  464520273: function (e) {
    var result = { _: `inputMessagesFilterPinned` };
    return result;
  },
  4197173514: function (e) {
    var result = { _: `inputMessagesFilterPoll` };
    return result;
  },
  522914557: function (e) {
    var result = { _: `updateNewMessage` };
    result.message = e.object();
    result.pts = e.int();
    result.ptsCount = e.int();
    return result;
  },
  1318109142: function (e) {
    var result = { _: `updateMessageID` };
    result.id = e.int();
    result.randomId = e.long();
    return result;
  },
  2718806245: function (e) {
    var result = { _: `updateDeleteMessages` };
    result.messages = e.vector(e.int);
    result.pts = e.int();
    result.ptsCount = e.int();
    return result;
  },
  706199388: function (e) {
    var result = { _: `updateUserTyping` };
    var t = e.uint();
    result.flags = t;
    result.userId = e.long();
    if (t & 1) {
      result.topMsgId = e.int();
    }
    result.action = e.object();
    return result;
  },
  2202565360: function (e) {
    var result = { _: `updateChatUserTyping` };
    result.chatId = e.long();
    result.fromId = e.object();
    result.action = e.object();
    return result;
  },
  125178264: function (e) {
    var result = { _: `updateChatParticipants` };
    result.participants = e.object();
    return result;
  },
  3854432478: function (e) {
    var result = { _: `updateUserStatus` };
    result.userId = e.long();
    result.status = e.object();
    return result;
  },
  2810480932: function (e) {
    var result = { _: `updateUserName` };
    result.userId = e.long();
    result.firstName = e.string();
    result.lastName = e.string();
    result.usernames = e.vector(e.object);
    return result;
  },
  2303831023: function (e) {
    var result = { _: `updateNewAuthorization` };
    var t = e.uint();
    result.flags = t;
    result.unconfirmed = !!(t & 1);
    result.hash = e.long();
    if (t & 1) {
      result.date = e.int();
    }
    if (t & 1) {
      result.device = e.string();
    }
    if (t & 1) {
      result.location = e.string();
    }
    return result;
  },
  314359194: function (e) {
    var result = { _: `updateNewEncryptedMessage` };
    result.message = e.object();
    result.qts = e.int();
    return result;
  },
  386986326: function (e) {
    var result = { _: `updateEncryptedChatTyping` };
    result.chatId = e.int();
    return result;
  },
  3030575245: function (e) {
    var result = { _: `updateEncryption` };
    result.chat = e.object();
    result.date = e.int();
    return result;
  },
  956179895: function (e) {
    var result = { _: `updateEncryptedMessagesRead` };
    result.chatId = e.int();
    result.maxDate = e.int();
    result.date = e.int();
    return result;
  },
  1037718609: function (e) {
    var result = { _: `updateChatParticipantAdd` };
    result.chatId = e.long();
    result.userId = e.long();
    result.inviterId = e.long();
    result.date = e.int();
    result.version = e.int();
    return result;
  },
  3811523959: function (e) {
    var result = { _: `updateChatParticipantDelete` };
    result.chatId = e.long();
    result.userId = e.long();
    result.version = e.int();
    return result;
  },
  2388564083: function (e) {
    var result = { _: `updateDcOptions` };
    result.dcOptions = e.vector(e.object);
    return result;
  },
  3200411887: function (e) {
    var result = { _: `updateNotifySettings` };
    result.peer = e.object();
    result.notifySettings = e.object();
    return result;
  },
  3957614617: function (e) {
    var result = { _: `updateServiceNotification` };
    var t = e.uint();
    result.flags = t;
    result.popup = !!(t & 1);
    result.invertMedia = !!(t & 4);
    if (t & 2) {
      result.inboxDate = e.int();
    }
    result.type = e.string();
    result.message = e.string();
    result.media = e.object();
    result.entities = e.vector(e.object);
    return result;
  },
  3996854058: function (e) {
    var result = { _: `updatePrivacy` };
    result.key = e.object();
    result.rules = e.vector(e.object);
    return result;
  },
  88680979: function (e) {
    var result = { _: `updateUserPhone` };
    result.userId = e.long();
    result.phone = e.string();
    return result;
  },
  2659499161: function (e) {
    var result = { _: `updateReadHistoryInbox` };
    var t = e.uint();
    result.flags = t;
    if (t & 1) {
      result.folderId = e.int();
    }
    result.peer = e.object();
    if (t & 2) {
      result.topMsgId = e.int();
    }
    result.maxId = e.int();
    result.stillUnreadCount = e.int();
    result.pts = e.int();
    result.ptsCount = e.int();
    return result;
  },
  791617983: function (e) {
    var result = { _: `updateReadHistoryOutbox` };
    result.peer = e.object();
    result.maxId = e.int();
    result.pts = e.int();
    result.ptsCount = e.int();
    return result;
  },
  2139689491: function (e) {
    var result = { _: `updateWebPage` };
    result.webpage = e.object();
    result.pts = e.int();
    result.ptsCount = e.int();
    return result;
  },
  4163006849: function (e) {
    var result = { _: `updateReadMessagesContents` };
    var t = e.uint();
    result.flags = t;
    result.messages = e.vector(e.int);
    result.pts = e.int();
    result.ptsCount = e.int();
    if (t & 1) {
      result.date = e.int();
    }
    return result;
  },
  277713951: function (e) {
    var result = { _: `updateChannelTooLong` };
    var t = e.uint();
    result.flags = t;
    result.channelId = e.long();
    if (t & 1) {
      result.pts = e.int();
    }
    return result;
  },
  1666927625: function (e) {
    var result = { _: `updateChannel` };
    result.channelId = e.long();
    return result;
  },
  1656358105: function (e) {
    var result = { _: `updateNewChannelMessage` };
    result.message = e.object();
    result.pts = e.int();
    result.ptsCount = e.int();
    return result;
  },
  2452516368: function (e) {
    var result = { _: `updateReadChannelInbox` };
    var t = e.uint();
    result.flags = t;
    if (t & 1) {
      result.folderId = e.int();
    }
    result.channelId = e.long();
    result.maxId = e.int();
    result.stillUnreadCount = e.int();
    result.pts = e.int();
    return result;
  },
  3274529554: function (e) {
    var result = { _: `updateDeleteChannelMessages` };
    result.channelId = e.long();
    result.messages = e.vector(e.int);
    result.pts = e.int();
    result.ptsCount = e.int();
    return result;
  },
  4062620680: function (e) {
    var result = { _: `updateChannelMessageViews` };
    result.channelId = e.long();
    result.id = e.int();
    result.views = e.int();
    return result;
  },
  3620364706: function (e) {
    var result = { _: `updateChatParticipantAdmin` };
    result.chatId = e.long();
    result.userId = e.long();
    result.isAdmin = e.object();
    result.version = e.int();
    return result;
  },
  1753886890: function (e) {
    var result = { _: `updateNewStickerSet` };
    result.stickerset = e.object();
    return result;
  },
  196268545: function (e) {
    var result = { _: `updateStickerSetsOrder` };
    var t = e.uint();
    result.flags = t;
    result.masks = !!(t & 1);
    result.emojis = !!(t & 2);
    result.order = e.vector(e.long);
    return result;
  },
  834816008: function (e) {
    var result = { _: `updateStickerSets` };
    var t = e.uint();
    result.flags = t;
    result.masks = !!(t & 1);
    result.emojis = !!(t & 2);
    return result;
  },
  2473931806: function (e) {
    var result = { _: `updateSavedGifs` };
    return result;
  },
  1232025500: function (e) {
    var result = { _: `updateBotInlineQuery` };
    var t = e.uint();
    result.flags = t;
    result.queryId = e.long();
    result.userId = e.long();
    result.query = e.string();
    if (t & 1) {
      result.geo = e.object();
    }
    if (t & 2) {
      result.peerType = e.object();
    }
    result.offset = e.string();
    return result;
  },
  317794823: function (e) {
    var result = { _: `updateBotInlineSend` };
    var t = e.uint();
    result.flags = t;
    result.userId = e.long();
    result.query = e.string();
    if (t & 1) {
      result.geo = e.object();
    }
    result.id = e.string();
    if (t & 2) {
      result.msgId = e.object();
    }
    return result;
  },
  457133559: function (e) {
    var result = { _: `updateEditChannelMessage` };
    result.message = e.object();
    result.pts = e.int();
    result.ptsCount = e.int();
    return result;
  },
  3117401229: function (e) {
    var result = { _: `updateBotCallbackQuery` };
    var t = e.uint();
    result.flags = t;
    result.queryId = e.long();
    result.userId = e.long();
    result.peer = e.object();
    result.msgId = e.int();
    result.chatInstance = e.long();
    if (t & 1) {
      result.data = e.bytes();
    }
    if (t & 2) {
      result.gameShortName = e.string();
    }
    return result;
  },
  3825430691: function (e) {
    var result = { _: `updateEditMessage` };
    result.message = e.object();
    result.pts = e.int();
    result.ptsCount = e.int();
    return result;
  },
  1763610706: function (e) {
    var result = { _: `updateInlineBotCallbackQuery` };
    var t = e.uint();
    result.flags = t;
    result.queryId = e.long();
    result.userId = e.long();
    result.msgId = e.object();
    result.chatInstance = e.long();
    if (t & 1) {
      result.data = e.bytes();
    }
    if (t & 2) {
      result.gameShortName = e.string();
    }
    return result;
  },
  3076495785: function (e) {
    var result = { _: `updateReadChannelOutbox` };
    result.channelId = e.long();
    result.maxId = e.int();
    return result;
  },
  3992719646: function (e) {
    var result = { _: `updateDraftMessage` };
    var t = e.uint();
    result.flags = t;
    result.peer = e.object();
    if (t & 1) {
      result.topMsgId = e.int();
    }
    if (t & 2) {
      result.savedPeerId = e.object();
    }
    result.draft = e.object();
    return result;
  },
  1461528386: function (e) {
    var result = { _: `updateReadFeaturedStickers` };
    return result;
  },
  2588027936: function (e) {
    var result = { _: `updateRecentStickers` };
    return result;
  },
  2720652550: function (e) {
    var result = { _: `updateConfig` };
    return result;
  },
  861169551: function (e) {
    var result = { _: `updatePtsChanged` };
    return result;
  },
  791390623: function (e) {
    var result = { _: `updateChannelWebPage` };
    result.channelId = e.long();
    result.webpage = e.object();
    result.pts = e.int();
    result.ptsCount = e.int();
    return result;
  },
  1852826908: function (e) {
    var result = { _: `updateDialogPinned` };
    var t = e.uint();
    result.flags = t;
    result.pinned = !!(t & 1);
    if (t & 2) {
      result.folderId = e.int();
    }
    result.peer = e.object();
    return result;
  },
  4195302562: function (e) {
    var result = { _: `updatePinnedDialogs` };
    var t = e.uint();
    result.flags = t;
    if (t & 2) {
      result.folderId = e.int();
    }
    if (t & 1) {
      result.order = e.vector(e.object);
    }
    return result;
  },
  2199371971: function (e) {
    var result = { _: `updateBotWebhookJSON` };
    result.data = e.object();
    return result;
  },
  2610053286: function (e) {
    var result = { _: `updateBotWebhookJSONQuery` };
    result.queryId = e.long();
    result.data = e.object();
    result.timeout = e.int();
    return result;
  },
  3048144253: function (e) {
    var result = { _: `updateBotShippingQuery` };
    result.queryId = e.long();
    result.userId = e.long();
    result.payload = e.bytes();
    result.shippingAddress = e.object();
    return result;
  },
  2359990934: function (e) {
    var result = { _: `updateBotPrecheckoutQuery` };
    var t = e.uint();
    result.flags = t;
    result.queryId = e.long();
    result.userId = e.long();
    result.payload = e.bytes();
    if (t & 1) {
      result.info = e.object();
    }
    if (t & 2) {
      result.shippingOptionId = e.string();
    }
    result.currency = e.string();
    result.totalAmount = e.long();
    return result;
  },
  2869914398: function (e) {
    var result = { _: `updatePhoneCall` };
    result.phoneCall = e.object();
    return result;
  },
  1180041828: function (e) {
    var result = { _: `updateLangPackTooLong` };
    result.langCode = e.string();
    return result;
  },
  1442983757: function (e) {
    var result = { _: `updateLangPack` };
    result.difference = e.object();
    return result;
  },
  3843135853: function (e) {
    var result = { _: `updateFavedStickers` };
    return result;
  },
  636691703: function (e) {
    var result = { _: `updateChannelReadMessagesContents` };
    var t = e.uint();
    result.flags = t;
    result.channelId = e.long();
    if (t & 1) {
      result.topMsgId = e.int();
    }
    if (t & 2) {
      result.savedPeerId = e.object();
    }
    result.messages = e.vector(e.int);
    return result;
  },
  1887741886: function (e) {
    var result = { _: `updateContactsReset` };
    return result;
  },
  2990524056: function (e) {
    var result = { _: `updateChannelAvailableMessages` };
    result.channelId = e.long();
    result.availableMinId = e.int();
    return result;
  },
  3059282494: function (e) {
    var result = { _: `updateDialogUnreadMark` };
    var t = e.uint();
    result.flags = t;
    result.unread = !!(t & 1);
    result.peer = e.object();
    if (t & 2) {
      result.savedPeerId = e.object();
    }
    return result;
  },
  3595325995: function (e) {
    var result = { _: `updateMessagePoll` };
    var t = e.uint();
    result.flags = t;
    if (t & 2) {
      result.peer = e.object();
    }
    if (t & 2) {
      result.msgId = e.int();
    }
    if (t & 4) {
      result.topMsgId = e.int();
    }
    result.pollId = e.long();
    if (t & 1) {
      result.poll = e.object();
    }
    result.results = e.object();
    return result;
  },
  1421875280: function (e) {
    var result = { _: `updateChatDefaultBannedRights` };
    result.peer = e.object();
    result.defaultBannedRights = e.object();
    result.version = e.int();
    return result;
  },
  422972864: function (e) {
    var result = { _: `updateFolderPeers` };
    result.folderPeers = e.vector(e.object);
    result.pts = e.int();
    result.ptsCount = e.int();
    return result;
  },
  1786671974: function (e) {
    var result = { _: `updatePeerSettings` };
    result.peer = e.object();
    result.settings = e.object();
    return result;
  },
  3031420848: function (e) {
    var result = { _: `updatePeerLocated` };
    result.peers = e.vector(e.object);
    return result;
  },
  967122427: function (e) {
    var result = { _: `updateNewScheduledMessage` };
    result.message = e.object();
    return result;
  },
  4071037315: function (e) {
    var result = { _: `updateDeleteScheduledMessages` };
    var t = e.uint();
    result.flags = t;
    result.peer = e.object();
    result.messages = e.vector(e.int);
    if (t & 1) {
      result.sentMessages = e.vector(e.int);
    }
    return result;
  },
  2182544291: function (e) {
    var result = { _: `updateTheme` };
    result.theme = e.object();
    return result;
  },
  2267003193: function (e) {
    var result = { _: `updateGeoLiveViewed` };
    result.peer = e.object();
    result.msgId = e.int();
    return result;
  },
  1448076945: function (e) {
    var result = { _: `updateLoginToken` };
    return result;
  },
  1989799956: function (e) {
    var result = { _: `updateMessagePollVote` };
    result.pollId = e.long();
    result.peer = e.object();
    result.options = e.vector(e.bytes);
    result.positions = e.vector(e.int);
    result.qts = e.int();
    return result;
  },
  654302845: function (e) {
    var result = { _: `updateDialogFilter` };
    var t = e.uint();
    result.flags = t;
    result.id = e.int();
    if (t & 1) {
      result.filter = e.object();
    }
    return result;
  },
  2782339333: function (e) {
    var result = { _: `updateDialogFilterOrder` };
    result.order = e.vector(e.int);
    return result;
  },
  889491791: function (e) {
    var result = { _: `updateDialogFilters` };
    return result;
  },
  643940105: function (e) {
    var result = { _: `updatePhoneCallSignalingData` };
    result.phoneCallId = e.long();
    result.data = e.bytes();
    return result;
  },
  3533318132: function (e) {
    var result = { _: `updateChannelMessageForwards` };
    result.channelId = e.long();
    result.id = e.int();
    result.forwards = e.int();
    return result;
  },
  3601962310: function (e) {
    var result = { _: `updateReadChannelDiscussionInbox` };
    var t = e.uint();
    result.flags = t;
    result.channelId = e.long();
    result.topMsgId = e.int();
    result.readMaxId = e.int();
    if (t & 1) {
      result.broadcastId = e.long();
    }
    if (t & 1) {
      result.broadcastPost = e.int();
    }
    return result;
  },
  1767677564: function (e) {
    var result = { _: `updateReadChannelDiscussionOutbox` };
    result.channelId = e.long();
    result.topMsgId = e.int();
    result.readMaxId = e.int();
    return result;
  },
  3957356370: function (e) {
    var result = { _: `updatePeerBlocked` };
    var t = e.uint();
    result.flags = t;
    result.blocked = !!(t & 1);
    result.blockedMyStoriesFrom = !!(t & 2);
    result.peerId = e.object();
    return result;
  },
  2357774627: function (e) {
    var result = { _: `updateChannelUserTyping` };
    var t = e.uint();
    result.flags = t;
    result.channelId = e.long();
    if (t & 1) {
      result.topMsgId = e.int();
    }
    result.fromId = e.object();
    result.action = e.object();
    return result;
  },
  3984976565: function (e) {
    var result = { _: `updatePinnedMessages` };
    var t = e.uint();
    result.flags = t;
    result.pinned = !!(t & 1);
    result.peer = e.object();
    result.messages = e.vector(e.int);
    result.pts = e.int();
    result.ptsCount = e.int();
    return result;
  },
  1538885128: function (e) {
    var result = { _: `updatePinnedChannelMessages` };
    var t = e.uint();
    result.flags = t;
    result.pinned = !!(t & 1);
    result.channelId = e.long();
    result.messages = e.vector(e.int);
    result.pts = e.int();
    result.ptsCount = e.int();
    return result;
  },
  4170869326: function (e) {
    var result = { _: `updateChat` };
    result.chatId = e.long();
    return result;
  },
  4075543374: function (e) {
    var result = { _: `updateGroupCallParticipants` };
    result.call = e.object();
    result.participants = e.vector(e.object);
    result.version = e.int();
    return result;
  },
  2636256992: function (e) {
    var result = { _: `updateGroupCall` };
    var t = e.uint();
    result.flags = t;
    result.liveStory = !!(t & 4);
    if (t & 2) {
      result.peer = e.object();
    }
    result.call = e.object();
    return result;
  },
  3147544997: function (e) {
    var result = { _: `updatePeerHistoryTTL` };
    var t = e.uint();
    result.flags = t;
    result.peer = e.object();
    if (t & 1) {
      result.ttlPeriod = e.int();
    }
    return result;
  },
  3498534458: function (e) {
    var result = { _: `updateChatParticipant` };
    var t = e.uint();
    result.flags = t;
    result.chatId = e.long();
    result.date = e.int();
    result.actorId = e.long();
    result.userId = e.long();
    if (t & 1) {
      result.prevParticipant = e.object();
    }
    if (t & 2) {
      result.newParticipant = e.object();
    }
    if (t & 4) {
      result.invite = e.object();
    }
    result.qts = e.int();
    return result;
  },
  2556246715: function (e) {
    var result = { _: `updateChannelParticipant` };
    var t = e.uint();
    result.flags = t;
    result.viaChatlist = !!(t & 8);
    result.channelId = e.long();
    result.date = e.int();
    result.actorId = e.long();
    result.userId = e.long();
    if (t & 1) {
      result.prevParticipant = e.object();
    }
    if (t & 2) {
      result.newParticipant = e.object();
    }
    if (t & 4) {
      result.invite = e.object();
    }
    result.qts = e.int();
    return result;
  },
  3297184329: function (e) {
    var result = { _: `updateBotStopped` };
    result.userId = e.long();
    result.date = e.int();
    result.stopped = e.object();
    result.qts = e.int();
    return result;
  },
  192428418: function (e) {
    var result = { _: `updateGroupCallConnection` };
    var t = e.uint();
    result.flags = t;
    result.presentation = !!(t & 1);
    result.params = e.object();
    return result;
  },
  1299263278: function (e) {
    var result = { _: `updateBotCommands` };
    result.peer = e.object();
    result.botId = e.long();
    result.commands = e.vector(e.object);
    return result;
  },
  1885586395: function (e) {
    var result = { _: `updatePendingJoinRequests` };
    result.peer = e.object();
    result.requestsPending = e.int();
    result.recentRequesters = e.vector(e.long);
    return result;
  },
  2092125561: function (e) {
    var result = { _: `updateBotChatInviteRequester` };
    var t = e.uint();
    result.flags = t;
    result.peer = e.object();
    result.date = e.int();
    result.userId = e.long();
    result.about = e.string();
    result.invite = e.object();
    result.qts = e.int();
    if (t & 1) {
      result.queryId = e.long();
    }
    return result;
  },
  506035194: function (e) {
    var result = { _: `updateMessageReactions` };
    var t = e.uint();
    result.flags = t;
    result.peer = e.object();
    result.msgId = e.int();
    if (t & 1) {
      result.topMsgId = e.int();
    }
    if (t & 2) {
      result.savedPeerId = e.object();
    }
    result.reactions = e.object();
    return result;
  },
  397910539: function (e) {
    var result = { _: `updateAttachMenuBots` };
    return result;
  },
  361936797: function (e) {
    var result = { _: `updateWebViewResultSent` };
    result.queryId = e.long();
    return result;
  },
  347625491: function (e) {
    var result = { _: `updateBotMenuButton` };
    result.botId = e.long();
    result.button = e.object();
    return result;
  },
  1960361625: function (e) {
    var result = { _: `updateSavedRingtones` };
    return result;
  },
  8703322: function (e) {
    var result = { _: `updateTranscribedAudio` };
    var t = e.uint();
    result.flags = t;
    result.pending = !!(t & 1);
    result.peer = e.object();
    result.msgId = e.int();
    result.transcriptionId = e.long();
    result.text = e.string();
    return result;
  },
  4216080748: function (e) {
    var result = { _: `updateReadFeaturedEmojiStickers` };
    return result;
  },
  674706841: function (e) {
    var result = { _: `updateUserEmojiStatus` };
    result.userId = e.long();
    result.emojiStatus = e.object();
    return result;
  },
  821314523: function (e) {
    var result = { _: `updateRecentEmojiStatuses` };
    return result;
  },
  1870160884: function (e) {
    var result = { _: `updateRecentReactions` };
    return result;
  },
  2264715141: function (e) {
    var result = { _: `updateMoveStickerSetToTop` };
    var t = e.uint();
    result.flags = t;
    result.masks = !!(t & 1);
    result.emojis = !!(t & 2);
    result.stickerset = e.long();
    return result;
  },
  3584300836: function (e) {
    var result = { _: `updateMessageExtendedMedia` };
    result.peer = e.object();
    result.msgId = e.int();
    result.extendedMedia = e.vector(e.object);
    return result;
  },
  542282808: function (e) {
    var result = { _: `updateUser` };
    result.userId = e.long();
    return result;
  },
  3959795863: function (e) {
    var result = { _: `updateAutoSaveSettings` };
    return result;
  },
  1974712216: function (e) {
    var result = { _: `updateStory` };
    result.peer = e.object();
    result.story = e.object();
    return result;
  },
  4149121835: function (e) {
    var result = { _: `updateReadStories` };
    result.peer = e.object();
    result.maxId = e.int();
    return result;
  },
  468923833: function (e) {
    var result = { _: `updateStoryID` };
    result.id = e.int();
    result.randomId = e.long();
    return result;
  },
  738741697: function (e) {
    var result = { _: `updateStoriesStealthMode` };
    result.stealthMode = e.object();
    return result;
  },
  2103604867: function (e) {
    var result = { _: `updateSentStoryReaction` };
    result.peer = e.object();
    result.storyId = e.int();
    result.reaction = e.object();
    return result;
  },
  2421019804: function (e) {
    var result = { _: `updateBotChatBoost` };
    result.peer = e.object();
    result.boost = e.object();
    result.qts = e.int();
    return result;
  },
  129403168: function (e) {
    var result = { _: `updateChannelViewForumAsMessages` };
    result.channelId = e.long();
    result.enabled = e.object();
    return result;
  },
  2923368477: function (e) {
    var result = { _: `updatePeerWallpaper` };
    var t = e.uint();
    result.flags = t;
    result.wallpaperOverridden = !!(t & 2);
    result.peer = e.object();
    if (t & 1) {
      result.wallpaper = e.object();
    }
    return result;
  },
  2887898062: function (e) {
    var result = { _: `updateBotMessageReaction` };
    result.peer = e.object();
    result.msgId = e.int();
    result.date = e.int();
    result.actor = e.object();
    result.oldReactions = e.vector(e.object);
    result.newReactions = e.vector(e.object);
    result.qts = e.int();
    return result;
  },
  164329305: function (e) {
    var result = { _: `updateBotMessageReactions` };
    result.peer = e.object();
    result.msgId = e.int();
    result.date = e.int();
    result.reactions = e.vector(e.object);
    result.qts = e.int();
    return result;
  },
  2930744948: function (e) {
    var result = { _: `updateSavedDialogPinned` };
    var t = e.uint();
    result.flags = t;
    result.pinned = !!(t & 1);
    result.peer = e.object();
    return result;
  },
  1751942566: function (e) {
    var result = { _: `updatePinnedSavedDialogs` };
    var t = e.uint();
    result.flags = t;
    if (t & 1) {
      result.order = e.vector(e.object);
    }
    return result;
  },
  969307186: function (e) {
    var result = { _: `updateSavedReactionTags` };
    return result;
  },
  4049758676: function (e) {
    var result = { _: `updateSmsJob` };
    result.jobId = e.string();
    return result;
  },
  4182182578: function (e) {
    var result = { _: `updateQuickReplies` };
    result.quickReplies = e.vector(e.object);
    return result;
  },
  4114458391: function (e) {
    var result = { _: `updateNewQuickReply` };
    result.quickReply = e.object();
    return result;
  },
  1407644140: function (e) {
    var result = { _: `updateDeleteQuickReply` };
    result.shortcutId = e.int();
    return result;
  },
  1040518415: function (e) {
    var result = { _: `updateQuickReplyMessage` };
    result.message = e.object();
    return result;
  },
  1450174413: function (e) {
    var result = { _: `updateDeleteQuickReplyMessages` };
    result.shortcutId = e.int();
    result.messages = e.vector(e.int);
    return result;
  },
  2330315130: function (e) {
    var result = { _: `updateBotBusinessConnect` };
    result.connection = e.object();
    result.qts = e.int();
    return result;
  },
  2648388732: function (e) {
    var result = { _: `updateBotNewBusinessMessage` };
    var t = e.uint();
    result.flags = t;
    result.connectionId = e.string();
    result.message = e.object();
    if (t & 1) {
      result.replyToMessage = e.object();
    }
    result.qts = e.int();
    return result;
  },
  132077692: function (e) {
    var result = { _: `updateBotEditBusinessMessage` };
    var t = e.uint();
    result.flags = t;
    result.connectionId = e.string();
    result.message = e.object();
    if (t & 1) {
      result.replyToMessage = e.object();
    }
    result.qts = e.int();
    return result;
  },
  2687146030: function (e) {
    var result = { _: `updateBotDeleteBusinessMessage` };
    result.connectionId = e.string();
    result.peer = e.object();
    result.messages = e.vector(e.int);
    result.qts = e.int();
    return result;
  },
  405070859: function (e) {
    var result = { _: `updateNewStoryReaction` };
    result.storyId = e.int();
    result.peer = e.object();
    result.reaction = e.object();
    return result;
  },
  1317053305: function (e) {
    var result = { _: `updateStarsBalance` };
    result.balance = e.object();
    return result;
  },
  513998247: function (e) {
    var result = { _: `updateBusinessBotCallbackQuery` };
    var t = e.uint();
    result.flags = t;
    result.queryId = e.long();
    result.userId = e.long();
    result.connectionId = e.string();
    result.message = e.object();
    if (t & 4) {
      result.replyToMessage = e.object();
    }
    result.chatInstance = e.long();
    if (t & 1) {
      result.data = e.bytes();
    }
    return result;
  },
  2776936473: function (e) {
    var result = { _: `updateStarsRevenueStatus` };
    result.peer = e.object();
    result.status = e.object();
    return result;
  },
  675009298: function (e) {
    var result = { _: `updateBotPurchasedPaidMedia` };
    result.userId = e.long();
    result.payload = e.string();
    result.qts = e.int();
    return result;
  },
  2339528654: function (e) {
    var result = { _: `updatePaidReactionPrivacy` };
    result.private = e.object();
    return result;
  },
  1347068303: function (e) {
    var result = { _: `updateSentPhoneCode` };
    result.sentCode = e.object();
    return result;
  },
  2759272591: function (e) {
    var result = { _: `updateGroupCallChainBlocks` };
    result.call = e.object();
    result.subChainId = e.int();
    result.blocks = e.vector(e.bytes);
    result.nextOffset = e.int();
    return result;
  },
  2008081266: function (e) {
    var result = { _: `updateReadMonoForumInbox` };
    result.channelId = e.long();
    result.savedPeerId = e.object();
    result.readMaxId = e.int();
    return result;
  },
  2762445686: function (e) {
    var result = { _: `updateReadMonoForumOutbox` };
    result.channelId = e.long();
    result.savedPeerId = e.object();
    result.readMaxId = e.int();
    return result;
  },
  2676042504: function (e) {
    var result = { _: `updateMonoForumNoPaidException` };
    var t = e.uint();
    result.flags = t;
    result.exception = !!(t & 1);
    result.channelId = e.long();
    result.savedPeerId = e.object();
    return result;
  },
  3627183885: function (e) {
    var result = { _: `updateGroupCallMessage` };
    result.call = e.object();
    result.message = e.object();
    return result;
  },
  3377964902: function (e) {
    var result = { _: `updateGroupCallEncryptedMessage` };
    result.call = e.object();
    result.fromId = e.object();
    result.encryptedMessage = e.bytes();
    return result;
  },
  1748708434: function (e) {
    var result = { _: `updatePinnedForumTopic` };
    var t = e.uint();
    result.flags = t;
    result.pinned = !!(t & 1);
    result.peer = e.object();
    result.topicId = e.int();
    return result;
  },
  3740353488: function (e) {
    var result = { _: `updatePinnedForumTopics` };
    var t = e.uint();
    result.flags = t;
    result.peer = e.object();
    if (t & 1) {
      result.order = e.vector(e.int);
    }
    return result;
  },
  1048963372: function (e) {
    var result = { _: `updateDeleteGroupCallMessages` };
    result.call = e.object();
    result.messages = e.vector(e.int);
    return result;
  },
  1222788802: function (e) {
    var result = { _: `updateStarGiftAuctionState` };
    result.giftId = e.long();
    result.state = e.object();
    return result;
  },
  3696816926: function (e) {
    var result = { _: `updateStarGiftAuctionUserState` };
    result.giftId = e.long();
    result.userState = e.object();
    return result;
  },
  4221326458: function (e) {
    var result = { _: `updateEmojiGameInfo` };
    result.info = e.object();
    return result;
  },
  2886149188: function (e) {
    var result = { _: `updateStarGiftCraftFail` };
    return result;
  },
  3179505593: function (e) {
    var result = { _: `updateChatParticipantRank` };
    result.chatId = e.long();
    result.userId = e.long();
    result.rank = e.string();
    result.version = e.int();
    return result;
  },
  1216408986: function (e) {
    var result = { _: `updateManagedBot` };
    result.userId = e.long();
    result.botId = e.long();
    result.qts = e.int();
    return result;
  },
  3453225277: function (e) {
    var result = { _: `updateBotGuestChatQuery` };
    var t = e.uint();
    result.flags = t;
    result.queryId = e.long();
    result.message = e.object();
    if (t & 1) {
      result.referenceMessages = e.vector(e.object);
    }
    result.qts = e.int();
    return result;
  },
  2349830651: function (e) {
    var result = { _: `updateAiComposeTones` };
    return result;
  },
  3182198384: function (e) {
    var result = { _: `updateJoinChatWebViewDecision` };
    result.peer = e.object();
    result.queryId = e.long();
    result.result = e.object();
    return result;
  },
  2988475302: function (e) {
    var result = { _: `updateNewBotConnection` };
    var t = e.uint();
    result.flags = t;
    result.confirmed = !!(t & 1);
    result.botId = e.long();
    if (t & 2) {
      result.date = e.int();
    }
    if (t & 2) {
      result.device = e.string();
    }
    if (t & 2) {
      result.location = e.string();
    }
    return result;
  },
  3281660638: function (e) {
    var result = { _: `updateWebBrowserSettings` };
    var t = e.uint();
    result.flags = t;
    result.openExternalBrowser = !!(t & 1);
    result.displayCloseButton = !!(t & 2);
    return result;
  },
  335872721: function (e) {
    var result = { _: `updateWebBrowserException` };
    var t = e.uint();
    result.flags = t;
    result.delete = !!(t & 2);
    if (t & 1) {
      result.openExternalBrowser = e.object();
    }
    result.exception = e.object();
    return result;
  },
  549239713: function (e) {
    var result = { _: `updateNewEphemeralMessage` };
    result.message = e.object();
    return result;
  },
  1457257720: function (e) {
    var result = { _: `updateDeleteEphemeralMessages` };
    result.peer = e.object();
    result.ids = e.vector(e.int);
    return result;
  },
  1270583041: function (e) {
    var result = { _: `updateEditEphemeralMessage` };
    result.message = e.object();
    return result;
  },
  2081454550: function (e) {
    var result = { _: `updateEphemeralBotCallbackQuery` };
    var t = e.uint();
    result.flags = t;
    result.queryId = e.long();
    result.userId = e.long();
    if (t & 1) {
      result.peer = e.object();
    }
    result.msgId = e.int();
    result.data = e.bytes();
    if (t & 2) {
      result.chatInstance = e.long();
    }
    result.message = e.object();
    return result;
  },
  1812827683: function (e) {
    var result = { _: `updateBotStarsSubscription` };
    var t = e.uint();
    result.flags = t;
    result.canceled = !!(t & 1);
    result.paymentFailed = !!(t & 2);
    result.restored = !!(t & 4);
    result.userId = e.long();
    result.payload = e.bytes();
    result.qts = e.int();
    return result;
  },
  1791226538: function (e) {
    var result = { _: `updateWalletState` };
    result.state = e.object();
    return result;
  },
  2973977930: function (e) {
    var result = { _: `updateSentWalletTransaction` };
    var t = e.uint();
    result.flags = t;
    result.gasless = !!(t & 1);
    result.msgHash = e.string();
    if (t & 2) {
      result.transaction = e.object();
    }
    return result;
  },
  2829982892: function (e) {
    var result = { _: `updateWalletGaslessInfo` };
    var t = e.uint();
    result.flags = t;
    result.available = !!(t & 1);
    result.left = e.int();
    result.resetAt = e.int();
    result.minAmount = e.long();
    result.relayerAddress = e.string();
    return result;
  },
  1352896014: function (e) {
    var result = { _: `updateWalletTonConnectSession` };
    result.session = e.object();
    return result;
  },
  3522068889: function (e) {
    var result = { _: `updateWalletTonConnectPendingDisconnect` };
    result.sessionIds = e.vector(e.long);
    return result;
  },
  2775329342: function (e) {
    var result = { _: `updates.state` };
    result.pts = e.int();
    result.qts = e.int();
    result.date = e.int();
    result.seq = e.int();
    result.unreadCount = e.int();
    return result;
  },
  1567990072: function (e) {
    var result = { _: `updates.differenceEmpty` };
    result.date = e.int();
    result.seq = e.int();
    return result;
  },
  16030880: function (e) {
    var result = { _: `updates.difference` };
    result.newMessages = e.vector(e.object);
    result.newEncryptedMessages = e.vector(e.object);
    result.otherUpdates = e.vector(e.object);
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    result.state = e.object();
    return result;
  },
  2835028353: function (e) {
    var result = { _: `updates.differenceSlice` };
    result.newMessages = e.vector(e.object);
    result.newEncryptedMessages = e.vector(e.object);
    result.otherUpdates = e.vector(e.object);
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    result.intermediateState = e.object();
    return result;
  },
  1258196845: function (e) {
    var result = { _: `updates.differenceTooLong` };
    result.pts = e.int();
    return result;
  },
  3809980286: function (e) {
    var result = { _: `updatesTooLong` };
    return result;
  },
  826001400: function (e) {
    var result = { _: `updateShortMessage` };
    var t = e.uint();
    result.flags = t;
    result.out = !!(t & 2);
    result.mentioned = !!(t & 16);
    result.mediaUnread = !!(t & 32);
    result.silent = !!(t & 8192);
    result.id = e.int();
    result.userId = e.long();
    result.message = e.string();
    result.pts = e.int();
    result.ptsCount = e.int();
    result.date = e.int();
    if (t & 4) {
      result.fwdFrom = e.object();
    }
    if (t & 2048) {
      result.viaBotId = e.long();
    }
    if (t & 8) {
      result.replyTo = e.object();
    }
    if (t & 128) {
      result.entities = e.vector(e.object);
    }
    if (t & 33554432) {
      result.ttlPeriod = e.int();
    }
    return result;
  },
  1299050149: function (e) {
    var result = { _: `updateShortChatMessage` };
    var t = e.uint();
    result.flags = t;
    result.out = !!(t & 2);
    result.mentioned = !!(t & 16);
    result.mediaUnread = !!(t & 32);
    result.silent = !!(t & 8192);
    result.id = e.int();
    result.fromId = e.long();
    result.chatId = e.long();
    result.message = e.string();
    result.pts = e.int();
    result.ptsCount = e.int();
    result.date = e.int();
    if (t & 4) {
      result.fwdFrom = e.object();
    }
    if (t & 2048) {
      result.viaBotId = e.long();
    }
    if (t & 8) {
      result.replyTo = e.object();
    }
    if (t & 128) {
      result.entities = e.vector(e.object);
    }
    if (t & 33554432) {
      result.ttlPeriod = e.int();
    }
    return result;
  },
  2027216577: function (e) {
    var result = { _: `updateShort` };
    result.update = e.object();
    result.date = e.int();
    return result;
  },
  1918567619: function (e) {
    var result = { _: `updatesCombined` };
    result.updates = e.vector(e.object);
    result.users = e.vector(e.object);
    result.chats = e.vector(e.object);
    result.date = e.int();
    result.seqStart = e.int();
    result.seq = e.int();
    return result;
  },
  1957577280: function (e) {
    var result = { _: `updates` };
    result.updates = e.vector(e.object);
    result.users = e.vector(e.object);
    result.chats = e.vector(e.object);
    result.date = e.int();
    result.seq = e.int();
    return result;
  },
  2417352961: function (e) {
    var result = { _: `updateShortSentMessage` };
    var t = e.uint();
    result.flags = t;
    result.out = !!(t & 2);
    result.id = e.int();
    result.pts = e.int();
    result.ptsCount = e.int();
    result.date = e.int();
    if (t & 512) {
      result.media = e.object();
    }
    if (t & 128) {
      result.entities = e.vector(e.object);
    }
    if (t & 33554432) {
      result.ttlPeriod = e.int();
    }
    return result;
  },
  2378853029: function (e) {
    var result = { _: `photos.photos` };
    result.photos = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  352657236: function (e) {
    var result = { _: `photos.photosSlice` };
    result.count = e.int();
    result.photos = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  539045032: function (e) {
    var result = { _: `photos.photo` };
    result.photo = e.object();
    result.users = e.vector(e.object);
    return result;
  },
  157948117: function (e) {
    var result = { _: `upload.file` };
    result.type = e.object();
    result.mtime = e.int();
    result.bytes = e.bytes();
    return result;
  },
  4052539972: function (e) {
    var result = { _: `upload.fileCdnRedirect` };
    result.dcId = e.int();
    result.fileToken = e.bytes();
    result.encryptionKey = e.bytes();
    result.encryptionIv = e.bytes();
    result.fileHashes = e.vector(e.object);
    return result;
  },
  414687501: function (e) {
    var result = { _: `dcOption` };
    var t = e.uint();
    result.flags = t;
    result.ipv6 = !!(t & 1);
    result.mediaOnly = !!(t & 2);
    result.tcpoOnly = !!(t & 4);
    result.cdn = !!(t & 8);
    result.static = !!(t & 16);
    result.thisPortOnly = !!(t & 32);
    result.id = e.int();
    result.ipAddress = e.string();
    result.port = e.int();
    if (t & 1024) {
      result.secret = e.bytes();
    }
    return result;
  },
  3424265246: function (e) {
    var result = { _: `config` };
    var t = e.uint();
    result.flags = t;
    result.defaultP2pContacts = !!(t & 8);
    result.preloadFeaturedStickers = !!(t & 16);
    result.revokePmInbox = !!(t & 64);
    result.blockedMode = !!(t & 256);
    result.forceTryIpv6 = !!(t & 16384);
    result.date = e.int();
    result.expires = e.int();
    result.testMode = e.object();
    result.thisDc = e.int();
    result.dcOptions = e.vector(e.object);
    result.dcTxtDomainName = e.string();
    result.chatSizeMax = e.int();
    result.megagroupSizeMax = e.int();
    result.forwardedCountMax = e.int();
    result.onlineUpdatePeriodMs = e.int();
    result.offlineBlurTimeoutMs = e.int();
    result.offlineIdleTimeoutMs = e.int();
    result.onlineCloudTimeoutMs = e.int();
    result.notifyCloudDelayMs = e.int();
    result.notifyDefaultDelayMs = e.int();
    result.pushChatPeriodMs = e.int();
    result.pushChatLimit = e.int();
    result.editTimeLimit = e.int();
    result.revokeTimeLimit = e.int();
    result.revokePmTimeLimit = e.int();
    result.ratingEDecay = e.int();
    result.stickersRecentLimit = e.int();
    result.channelsReadMediaPeriod = e.int();
    if (t & 1) {
      result.tmpSessions = e.int();
    }
    result.callReceiveTimeoutMs = e.int();
    result.callRingTimeoutMs = e.int();
    result.callConnectTimeoutMs = e.int();
    result.callPacketTimeoutMs = e.int();
    result.meUrlPrefix = e.string();
    if (t & 128) {
      result.autoupdateUrlPrefix = e.string();
    }
    if (t & 512) {
      result.gifSearchUsername = e.string();
    }
    if (t & 1024) {
      result.venueSearchUsername = e.string();
    }
    if (t & 2048) {
      result.imgSearchUsername = e.string();
    }
    if (t & 4096) {
      result.staticMapsProvider = e.string();
    }
    result.captionLengthMax = e.int();
    result.messageLengthMax = e.int();
    result.webfileDcId = e.int();
    if (t & 4) {
      result.suggestedLangCode = e.string();
    }
    if (t & 4) {
      result.langPackVersion = e.int();
    }
    if (t & 4) {
      result.baseLangPackVersion = e.int();
    }
    if (t & 32768) {
      result.reactionsDefault = e.object();
    }
    if (t & 65536) {
      result.autologinToken = e.string();
    }
    return result;
  },
  2384074613: function (e) {
    var result = { _: `nearestDc` };
    result.country = e.string();
    result.thisDc = e.int();
    result.nearestDc = e.int();
    return result;
  },
  3434860080: function (e) {
    var result = { _: `help.appUpdate` };
    var t = e.uint();
    result.flags = t;
    result.canNotSkip = !!(t & 1);
    result.id = e.int();
    result.version = e.string();
    result.text = e.string();
    result.entities = e.vector(e.object);
    if (t & 2) {
      result.document = e.object();
    }
    if (t & 4) {
      result.url = e.string();
    }
    if (t & 8) {
      result.sticker = e.object();
    }
    return result;
  },
  3294258486: function (e) {
    var result = { _: `help.noAppUpdate` };
    return result;
  },
  415997816: function (e) {
    var result = { _: `help.inviteText` };
    result.message = e.string();
    return result;
  },
  2877210784: function (e) {
    var result = { _: `encryptedChatEmpty` };
    result.id = e.int();
    return result;
  },
  1722964307: function (e) {
    var result = { _: `encryptedChatWaiting` };
    result.id = e.int();
    result.accessHash = e.long();
    result.date = e.int();
    result.adminId = e.long();
    result.participantId = e.long();
    return result;
  },
  1223809356: function (e) {
    var result = { _: `encryptedChatRequested` };
    var t = e.uint();
    result.flags = t;
    if (t & 1) {
      result.folderId = e.int();
    }
    result.id = e.int();
    result.accessHash = e.long();
    result.date = e.int();
    result.adminId = e.long();
    result.participantId = e.long();
    result.gA = e.bytes();
    return result;
  },
  1643173063: function (e) {
    var result = { _: `encryptedChat` };
    result.id = e.int();
    result.accessHash = e.long();
    result.date = e.int();
    result.adminId = e.long();
    result.participantId = e.long();
    result.gAOrB = e.bytes();
    result.keyFingerprint = e.long();
    return result;
  },
  505183301: function (e) {
    var result = { _: `encryptedChatDiscarded` };
    var t = e.uint();
    result.flags = t;
    result.historyDeleted = !!(t & 1);
    result.id = e.int();
    return result;
  },
  4047615457: function (e) {
    var result = { _: `inputEncryptedChat` };
    result.chatId = e.int();
    result.accessHash = e.long();
    return result;
  },
  3256830334: function (e) {
    var result = { _: `encryptedFileEmpty` };
    return result;
  },
  2818608344: function (e) {
    var result = { _: `encryptedFile` };
    result.id = e.long();
    result.accessHash = e.long();
    result.size = e.long();
    result.dcId = e.int();
    result.keyFingerprint = e.int();
    return result;
  },
  406307684: function (e) {
    var result = { _: `inputEncryptedFileEmpty` };
    return result;
  },
  1690108678: function (e) {
    var result = { _: `inputEncryptedFileUploaded` };
    result.id = e.long();
    result.parts = e.int();
    result.md5Checksum = e.string();
    result.keyFingerprint = e.int();
    return result;
  },
  1511503333: function (e) {
    var result = { _: `inputEncryptedFile` };
    result.id = e.long();
    result.accessHash = e.long();
    return result;
  },
  767652808: function (e) {
    var result = { _: `inputEncryptedFileBigUploaded` };
    result.id = e.long();
    result.parts = e.int();
    result.keyFingerprint = e.int();
    return result;
  },
  3977822488: function (e) {
    var result = { _: `encryptedMessage` };
    result.randomId = e.long();
    result.chatId = e.int();
    result.date = e.int();
    result.bytes = e.bytes();
    result.file = e.object();
    return result;
  },
  594758406: function (e) {
    var result = { _: `encryptedMessageService` };
    result.randomId = e.long();
    result.chatId = e.int();
    result.date = e.int();
    result.bytes = e.bytes();
    return result;
  },
  3236054581: function (e) {
    var result = { _: `messages.dhConfigNotModified` };
    result.random = e.bytes();
    return result;
  },
  740433629: function (e) {
    var result = { _: `messages.dhConfig` };
    result.g = e.int();
    result.p = e.bytes();
    result.version = e.int();
    result.random = e.bytes();
    return result;
  },
  1443858741: function (e) {
    var result = { _: `messages.sentEncryptedMessage` };
    result.date = e.int();
    return result;
  },
  2492727090: function (e) {
    var result = { _: `messages.sentEncryptedFile` };
    result.date = e.int();
    result.file = e.object();
    return result;
  },
  1928391342: function (e) {
    var result = { _: `inputDocumentEmpty` };
    return result;
  },
  448771445: function (e) {
    var result = { _: `inputDocument` };
    result.id = e.long();
    result.accessHash = e.long();
    result.fileReference = e.bytes();
    return result;
  },
  922273905: function (e) {
    var result = { _: `documentEmpty` };
    result.id = e.long();
    return result;
  },
  2413085912: function (e) {
    var result = { _: `document` };
    var t = e.uint();
    result.flags = t;
    result.id = e.long();
    result.accessHash = e.long();
    result.fileReference = e.bytes();
    result.date = e.int();
    result.mimeType = e.string();
    result.size = e.long();
    if (t & 1) {
      result.thumbs = e.vector(e.object);
    }
    if (t & 2) {
      result.videoThumbs = e.vector(e.object);
    }
    result.dcId = e.int();
    result.attributes = e.vector(e.object);
    return result;
  },
  398898678: function (e) {
    var result = { _: `help.support` };
    result.phoneNumber = e.string();
    result.user = e.object();
    return result;
  },
  2681474008: function (e) {
    var result = { _: `notifyPeer` };
    result.peer = e.object();
    return result;
  },
  3033021260: function (e) {
    var result = { _: `notifyUsers` };
    return result;
  },
  3221737155: function (e) {
    var result = { _: `notifyChats` };
    return result;
  },
  3591563503: function (e) {
    var result = { _: `notifyBroadcasts` };
    return result;
  },
  577659656: function (e) {
    var result = { _: `notifyForumTopic` };
    result.peer = e.object();
    result.topMsgId = e.int();
    return result;
  },
  3191302553: function (e) {
    var result = { _: `notifyCommunity` };
    result.communityId = e.long();
    return result;
  },
  381645902: function (e) {
    var result = { _: `sendMessageTypingAction` };
    return result;
  },
  4250847477: function (e) {
    var result = { _: `sendMessageCancelAction` };
    return result;
  },
  2710034031: function (e) {
    var result = { _: `sendMessageRecordVideoAction` };
    return result;
  },
  3916839660: function (e) {
    var result = { _: `sendMessageUploadVideoAction` };
    result.progress = e.int();
    return result;
  },
  3576656887: function (e) {
    var result = { _: `sendMessageRecordAudioAction` };
    return result;
  },
  4082227115: function (e) {
    var result = { _: `sendMessageUploadAudioAction` };
    result.progress = e.int();
    return result;
  },
  3520285222: function (e) {
    var result = { _: `sendMessageUploadPhotoAction` };
    result.progress = e.int();
    return result;
  },
  2852968932: function (e) {
    var result = { _: `sendMessageUploadDocumentAction` };
    result.progress = e.int();
    return result;
  },
  393186209: function (e) {
    var result = { _: `sendMessageGeoLocationAction` };
    return result;
  },
  1653390447: function (e) {
    var result = { _: `sendMessageChooseContactAction` };
    return result;
  },
  3714748232: function (e) {
    var result = { _: `sendMessageGamePlayAction` };
    return result;
  },
  2297593788: function (e) {
    var result = { _: `sendMessageRecordRoundAction` };
    return result;
  },
  608050278: function (e) {
    var result = { _: `sendMessageUploadRoundAction` };
    result.progress = e.int();
    return result;
  },
  3643548293: function (e) {
    var result = { _: `speakingInGroupCallAction` };
    return result;
  },
  3688534598: function (e) {
    var result = { _: `sendMessageHistoryImportAction` };
    result.progress = e.int();
    return result;
  },
  2958739121: function (e) {
    var result = { _: `sendMessageChooseStickerAction` };
    return result;
  },
  630664139: function (e) {
    var result = { _: `sendMessageEmojiInteraction` };
    result.emoticon = e.string();
    result.msgId = e.int();
    result.interaction = e.object();
    return result;
  },
  3060109358: function (e) {
    var result = { _: `sendMessageEmojiInteractionSeen` };
    result.emoticon = e.string();
    return result;
  },
  909162586: function (e) {
    var result = { _: `sendMessageTextDraftAction` };
    var t = e.uint();
    result.flags = t;
    result.canStop = !!(t & 1);
    result.keepOnStop = !!(t & 2);
    result.randomId = e.long();
    result.text = e.object();
    return result;
  },
  2839005118: function (e) {
    var result = { _: `inputSendMessageRichMessageDraftAction` };
    var t = e.uint();
    result.flags = t;
    result.canStop = !!(t & 1);
    result.keepOnStop = !!(t & 2);
    result.randomId = e.long();
    result.richMessage = e.object();
    return result;
  },
  1381386387: function (e) {
    var result = { _: `sendMessageRichMessageDraftAction` };
    var t = e.uint();
    result.flags = t;
    result.canStop = !!(t & 1);
    result.keepOnStop = !!(t & 2);
    result.randomId = e.long();
    result.richMessage = e.object();
    return result;
  },
  4227400368: function (e) {
    var result = { _: `sendMessageStopDraftAction` };
    result.randomId = e.long();
    return result;
  },
  3004386717: function (e) {
    var result = { _: `contacts.found` };
    result.myResults = e.vector(e.object);
    result.results = e.vector(e.object);
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  1335282456: function (e) {
    var result = { _: `inputPrivacyKeyStatusTimestamp` };
    return result;
  },
  3187344422: function (e) {
    var result = { _: `inputPrivacyKeyChatInvite` };
    return result;
  },
  4206550111: function (e) {
    var result = { _: `inputPrivacyKeyPhoneCall` };
    return result;
  },
  3684593874: function (e) {
    var result = { _: `inputPrivacyKeyPhoneP2P` };
    return result;
  },
  2765966344: function (e) {
    var result = { _: `inputPrivacyKeyForwards` };
    return result;
  },
  1461304012: function (e) {
    var result = { _: `inputPrivacyKeyProfilePhoto` };
    return result;
  },
  55761658: function (e) {
    var result = { _: `inputPrivacyKeyPhoneNumber` };
    return result;
  },
  3508640733: function (e) {
    var result = { _: `inputPrivacyKeyAddedByPhone` };
    return result;
  },
  2934349160: function (e) {
    var result = { _: `inputPrivacyKeyVoiceMessages` };
    return result;
  },
  941870144: function (e) {
    var result = { _: `inputPrivacyKeyAbout` };
    return result;
  },
  3596227020: function (e) {
    var result = { _: `inputPrivacyKeyBirthday` };
    return result;
  },
  3782419265: function (e) {
    var result = { _: `inputPrivacyKeyStarGiftsAutoSave` };
    return result;
  },
  3183843252: function (e) {
    var result = { _: `inputPrivacyKeyNoPaidMessages` };
    return result;
  },
  1304334886: function (e) {
    var result = { _: `inputPrivacyKeySavedMusic` };
    return result;
  },
  3157175088: function (e) {
    var result = { _: `privacyKeyStatusTimestamp` };
    return result;
  },
  1343122938: function (e) {
    var result = { _: `privacyKeyChatInvite` };
    return result;
  },
  1030105979: function (e) {
    var result = { _: `privacyKeyPhoneCall` };
    return result;
  },
  961092808: function (e) {
    var result = { _: `privacyKeyPhoneP2P` };
    return result;
  },
  1777096355: function (e) {
    var result = { _: `privacyKeyForwards` };
    return result;
  },
  2517966829: function (e) {
    var result = { _: `privacyKeyProfilePhoto` };
    return result;
  },
  3516589165: function (e) {
    var result = { _: `privacyKeyPhoneNumber` };
    return result;
  },
  1124062251: function (e) {
    var result = { _: `privacyKeyAddedByPhone` };
    return result;
  },
  110621716: function (e) {
    var result = { _: `privacyKeyVoiceMessages` };
    return result;
  },
  2760292193: function (e) {
    var result = { _: `privacyKeyAbout` };
    return result;
  },
  536913176: function (e) {
    var result = { _: `privacyKeyBirthday` };
    return result;
  },
  749010424: function (e) {
    var result = { _: `privacyKeyStarGiftsAutoSave` };
    return result;
  },
  399722706: function (e) {
    var result = { _: `privacyKeyNoPaidMessages` };
    return result;
  },
  4286207771: function (e) {
    var result = { _: `privacyKeySavedMusic` };
    return result;
  },
  218751099: function (e) {
    var result = { _: `inputPrivacyValueAllowContacts` };
    return result;
  },
  407582158: function (e) {
    var result = { _: `inputPrivacyValueAllowAll` };
    return result;
  },
  320652927: function (e) {
    var result = { _: `inputPrivacyValueAllowUsers` };
    result.users = e.vector(e.object);
    return result;
  },
  195371015: function (e) {
    var result = { _: `inputPrivacyValueDisallowContacts` };
    return result;
  },
  3597362889: function (e) {
    var result = { _: `inputPrivacyValueDisallowAll` };
    return result;
  },
  2417034343: function (e) {
    var result = { _: `inputPrivacyValueDisallowUsers` };
    result.users = e.vector(e.object);
    return result;
  },
  2215004623: function (e) {
    var result = { _: `inputPrivacyValueAllowChatParticipants` };
    result.chats = e.vector(e.long);
    return result;
  },
  3914272646: function (e) {
    var result = { _: `inputPrivacyValueDisallowChatParticipants` };
    result.chats = e.vector(e.long);
    return result;
  },
  793067081: function (e) {
    var result = { _: `inputPrivacyValueAllowCloseFriends` };
    return result;
  },
  2009975281: function (e) {
    var result = { _: `inputPrivacyValueAllowPremium` };
    return result;
  },
  1515179237: function (e) {
    var result = { _: `inputPrivacyValueAllowBots` };
    return result;
  },
  3303373077: function (e) {
    var result = { _: `inputPrivacyValueDisallowBots` };
    return result;
  },
  4294843308: function (e) {
    var result = { _: `privacyValueAllowContacts` };
    return result;
  },
  1698855810: function (e) {
    var result = { _: `privacyValueAllowAll` };
    return result;
  },
  3096469426: function (e) {
    var result = { _: `privacyValueAllowUsers` };
    result.users = e.vector(e.long);
    return result;
  },
  4169726490: function (e) {
    var result = { _: `privacyValueDisallowContacts` };
    return result;
  },
  2339628899: function (e) {
    var result = { _: `privacyValueDisallowAll` };
    return result;
  },
  3831632193: function (e) {
    var result = { _: `privacyValueDisallowUsers` };
    result.users = e.vector(e.long);
    return result;
  },
  1796427406: function (e) {
    var result = { _: `privacyValueAllowChatParticipants` };
    result.chats = e.vector(e.long);
    return result;
  },
  1103656293: function (e) {
    var result = { _: `privacyValueDisallowChatParticipants` };
    result.chats = e.vector(e.long);
    return result;
  },
  4159232155: function (e) {
    var result = { _: `privacyValueAllowCloseFriends` };
    return result;
  },
  3974725963: function (e) {
    var result = { _: `privacyValueAllowPremium` };
    return result;
  },
  558242653: function (e) {
    var result = { _: `privacyValueAllowBots` };
    return result;
  },
  4138072111: function (e) {
    var result = { _: `privacyValueDisallowBots` };
    return result;
  },
  1352683077: function (e) {
    var result = { _: `account.privacyRules` };
    result.rules = e.vector(e.object);
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  3100684255: function (e) {
    var result = { _: `accountDaysTTL` };
    result.days = e.int();
    return result;
  },
  1815593308: function (e) {
    var result = { _: `documentAttributeImageSize` };
    result.w = e.int();
    result.h = e.int();
    return result;
  },
  297109817: function (e) {
    var result = { _: `documentAttributeAnimated` };
    return result;
  },
  1662637586: function (e) {
    var result = { _: `documentAttributeSticker` };
    var t = e.uint();
    result.flags = t;
    result.mask = !!(t & 2);
    result.alt = e.string();
    result.stickerset = e.object();
    if (t & 1) {
      result.maskCoords = e.object();
    }
    return result;
  },
  1137015880: function (e) {
    var result = { _: `documentAttributeVideo` };
    var t = e.uint();
    result.flags = t;
    result.roundMessage = !!(t & 1);
    result.supportsStreaming = !!(t & 2);
    result.nosound = !!(t & 8);
    result.duration = e.double();
    result.w = e.int();
    result.h = e.int();
    if (t & 4) {
      result.preloadPrefixSize = e.int();
    }
    if (t & 16) {
      result.videoStartTs = e.double();
    }
    if (t & 32) {
      result.videoCodec = e.string();
    }
    return result;
  },
  2555574726: function (e) {
    var result = { _: `documentAttributeAudio` };
    var t = e.uint();
    result.flags = t;
    result.voice = !!(t & 1024);
    result.duration = e.int();
    if (t & 1) {
      result.title = e.string();
    }
    if (t & 2) {
      result.performer = e.string();
    }
    if (t & 4) {
      result.waveform = e.bytes();
    }
    return result;
  },
  358154344: function (e) {
    var result = { _: `documentAttributeFilename` };
    result.fileName = e.string();
    return result;
  },
  2550256375: function (e) {
    var result = { _: `documentAttributeHasStickers` };
    return result;
  },
  4245985433: function (e) {
    var result = { _: `documentAttributeCustomEmoji` };
    var t = e.uint();
    result.flags = t;
    result.free = !!(t & 1);
    result.textColor = !!(t & 2);
    result.alt = e.string();
    result.stickerset = e.object();
    return result;
  },
  4050950690: function (e) {
    var result = { _: `messages.stickersNotModified` };
    return result;
  },
  816245886: function (e) {
    var result = { _: `messages.stickers` };
    result.hash = e.long();
    result.stickers = e.vector(e.object);
    return result;
  },
  313694676: function (e) {
    var result = { _: `stickerPack` };
    result.emoticon = e.string();
    result.documents = e.vector(e.long);
    return result;
  },
  3898999491: function (e) {
    var result = { _: `messages.allStickersNotModified` };
    return result;
  },
  3451637435: function (e) {
    var result = { _: `messages.allStickers` };
    result.hash = e.long();
    result.sets = e.vector(e.object);
    return result;
  },
  2228326789: function (e) {
    var result = { _: `messages.affectedMessages` };
    result.pts = e.int();
    result.ptsCount = e.int();
    return result;
  },
  555358088: function (e) {
    var result = { _: `webPageEmpty` };
    var t = e.uint();
    result.flags = t;
    result.id = e.long();
    if (t & 1) {
      result.url = e.string();
    }
    return result;
  },
  2966502983: function (e) {
    var result = { _: `webPagePending` };
    var t = e.uint();
    result.flags = t;
    result.id = e.long();
    if (t & 1) {
      result.url = e.string();
    }
    result.date = e.int();
    return result;
  },
  3902555570: function (e) {
    var result = { _: `webPage` };
    var t = e.uint();
    result.flags = t;
    result.hasLargeMedia = !!(t & 8192);
    result.videoCoverPhoto = !!(t & 16384);
    result.id = e.long();
    result.url = e.string();
    result.displayUrl = e.string();
    result.hash = e.int();
    if (t & 1) {
      result.type = e.string();
    }
    if (t & 2) {
      result.siteName = e.string();
    }
    if (t & 4) {
      result.title = e.string();
    }
    if (t & 8) {
      result.description = e.string();
    }
    if (t & 16) {
      result.photo = e.object();
    }
    if (t & 32) {
      result.embedUrl = e.string();
    }
    if (t & 32) {
      result.embedType = e.string();
    }
    if (t & 64) {
      result.embedWidth = e.int();
    }
    if (t & 64) {
      result.embedHeight = e.int();
    }
    if (t & 128) {
      result.duration = e.int();
    }
    if (t & 256) {
      result.author = e.string();
    }
    if (t & 512) {
      result.document = e.object();
    }
    if (t & 1024) {
      result.cachedPage = e.object();
    }
    if (t & 4096) {
      result.attributes = e.vector(e.object);
    }
    return result;
  },
  1930545681: function (e) {
    var result = { _: `webPageNotModified` };
    var t = e.uint();
    result.flags = t;
    if (t & 1) {
      result.cachedPageViews = e.int();
    }
    return result;
  },
  2902578717: function (e) {
    var result = { _: `authorization` };
    var t = e.uint();
    result.flags = t;
    result.current = !!(t & 1);
    result.officialApp = !!(t & 2);
    result.passwordPending = !!(t & 4);
    result.encryptedRequestsDisabled = !!(t & 8);
    result.callRequestsDisabled = !!(t & 16);
    result.unconfirmed = !!(t & 32);
    result.hash = e.long();
    result.deviceModel = e.string();
    result.platform = e.string();
    result.systemVersion = e.string();
    result.apiId = e.int();
    result.appName = e.string();
    result.appVersion = e.string();
    result.dateCreated = e.int();
    result.dateActive = e.int();
    result.ip = e.string();
    result.country = e.string();
    result.region = e.string();
    return result;
  },
  1275039392: function (e) {
    var result = { _: `account.authorizations` };
    result.authorizationTtlDays = e.int();
    result.authorizations = e.vector(e.object);
    return result;
  },
  2507886843: function (e) {
    var result = { _: `account.password` };
    var t = e.uint();
    result.flags = t;
    result.hasRecovery = !!(t & 1);
    result.hasSecureValues = !!(t & 2);
    result.hasPassword = !!(t & 4);
    if (t & 4) {
      result.currentAlgo = e.object();
    }
    if (t & 4) {
      result.srpB = e.bytes();
    }
    if (t & 4) {
      result.srpId = e.long();
    }
    if (t & 8) {
      result.hint = e.string();
    }
    if (t & 16) {
      result.emailUnconfirmedPattern = e.string();
    }
    result.newAlgo = e.object();
    result.newSecureAlgo = e.object();
    result.secureRandom = e.bytes();
    if (t & 32) {
      result.pendingResetDate = e.int();
    }
    if (t & 64) {
      result.loginEmailPattern = e.string();
    }
    return result;
  },
  2589733861: function (e) {
    var result = { _: `account.passwordSettings` };
    var t = e.uint();
    result.flags = t;
    if (t & 1) {
      result.email = e.string();
    }
    if (t & 2) {
      result.secureSettings = e.object();
    }
    return result;
  },
  3258394569: function (e) {
    var result = { _: `account.passwordInputSettings` };
    var t = e.uint();
    result.flags = t;
    if (t & 1) {
      result.newAlgo = e.object();
    }
    if (t & 1) {
      result.newPasswordHash = e.bytes();
    }
    if (t & 1) {
      result.hint = e.string();
    }
    if (t & 2) {
      result.email = e.string();
    }
    if (t & 4) {
      result.newSecureSettings = e.object();
    }
    return result;
  },
  326715557: function (e) {
    var result = { _: `auth.passwordRecovery` };
    result.emailPattern = e.string();
    return result;
  },
  2743383929: function (e) {
    var result = { _: `receivedNotifyMessage` };
    result.id = e.int();
    result.flags = e.int();
    return result;
  },
  2720841110: function (e) {
    var result = { _: `chatInviteExported` };
    var t = e.uint();
    result.flags = t;
    result.revoked = !!(t & 1);
    result.permanent = !!(t & 32);
    result.requestNeeded = !!(t & 64);
    result.link = e.string();
    result.adminId = e.long();
    result.date = e.int();
    if (t & 16) {
      result.startDate = e.int();
    }
    if (t & 2) {
      result.expireDate = e.int();
    }
    if (t & 4) {
      result.usageLimit = e.int();
    }
    if (t & 8) {
      result.usage = e.int();
    }
    if (t & 128) {
      result.requested = e.int();
    }
    if (t & 1024) {
      result.subscriptionExpired = e.int();
    }
    if (t & 256) {
      result.title = e.string();
    }
    if (t & 512) {
      result.subscriptionPricing = e.object();
    }
    return result;
  },
  3977280183: function (e) {
    var result = { _: `chatInvitePublicJoinRequests` };
    return result;
  },
  1516793212: function (e) {
    var result = { _: `chatInviteAlready` };
    result.chat = e.object();
    return result;
  },
  1553807106: function (e) {
    var result = { _: `chatInvite` };
    var t = e.uint();
    result.flags = t;
    result.channel = !!(t & 1);
    result.broadcast = !!(t & 2);
    result.public = !!(t & 4);
    result.megagroup = !!(t & 8);
    result.requestNeeded = !!(t & 64);
    result.verified = !!(t & 128);
    result.scam = !!(t & 256);
    result.fake = !!(t & 512);
    result.canRefulfillSubscription = !!(t & 2048);
    result.title = e.string();
    if (t & 32) {
      result.about = e.string();
    }
    result.photo = e.object();
    result.participantsCount = e.int();
    if (t & 16) {
      result.participants = e.vector(e.object);
    }
    result.color = e.int();
    if (t & 1024) {
      result.subscriptionPricing = e.object();
    }
    if (t & 4096) {
      result.subscriptionFormId = e.long();
    }
    if (t & 8192) {
      result.botVerification = e.object();
    }
    return result;
  },
  1634294960: function (e) {
    var result = { _: `chatInvitePeek` };
    result.chat = e.object();
    result.expires = e.int();
    return result;
  },
  4290128789: function (e) {
    var result = { _: `inputStickerSetEmpty` };
    return result;
  },
  2649203305: function (e) {
    var result = { _: `inputStickerSetID` };
    result.id = e.long();
    result.accessHash = e.long();
    return result;
  },
  2250033312: function (e) {
    var result = { _: `inputStickerSetShortName` };
    result.shortName = e.string();
    return result;
  },
  42402760: function (e) {
    var result = { _: `inputStickerSetAnimatedEmoji` };
    return result;
  },
  3867103758: function (e) {
    var result = { _: `inputStickerSetDice` };
    result.emoticon = e.string();
    return result;
  },
  215889721: function (e) {
    var result = { _: `inputStickerSetAnimatedEmojiAnimations` };
    return result;
  },
  3364567810: function (e) {
    var result = { _: `inputStickerSetPremiumGifts` };
    return result;
  },
  80008398: function (e) {
    var result = { _: `inputStickerSetEmojiGenericAnimations` };
    return result;
  },
  701560302: function (e) {
    var result = { _: `inputStickerSetEmojiDefaultStatuses` };
    return result;
  },
  1153562857: function (e) {
    var result = { _: `inputStickerSetEmojiDefaultTopicIcons` };
    return result;
  },
  1232373075: function (e) {
    var result = { _: `inputStickerSetEmojiChannelDefaultStatuses` };
    return result;
  },
  485912992: function (e) {
    var result = { _: `inputStickerSetTonGifts` };
    return result;
  },
  768691932: function (e) {
    var result = { _: `stickerSet` };
    var t = e.uint();
    result.flags = t;
    result.archived = !!(t & 2);
    result.official = !!(t & 4);
    result.masks = !!(t & 8);
    result.emojis = !!(t & 128);
    result.textColor = !!(t & 512);
    result.channelEmojiStatus = !!(t & 1024);
    result.creator = !!(t & 2048);
    if (t & 1) {
      result.installedDate = e.int();
    }
    result.id = e.long();
    result.accessHash = e.long();
    result.title = e.string();
    result.shortName = e.string();
    if (t & 16) {
      result.thumbs = e.vector(e.object);
    }
    if (t & 16) {
      result.thumbDcId = e.int();
    }
    if (t & 16) {
      result.thumbVersion = e.int();
    }
    if (t & 256) {
      result.thumbDocumentId = e.long();
    }
    result.count = e.int();
    result.hash = e.int();
    return result;
  },
  1846886166: function (e) {
    var result = { _: `messages.stickerSet` };
    result.set = e.object();
    result.packs = e.vector(e.object);
    result.keywords = e.vector(e.object);
    result.documents = e.vector(e.object);
    return result;
  },
  3556320491: function (e) {
    var result = { _: `messages.stickerSetNotModified` };
    return result;
  },
  2555565778: function (e) {
    var result = { _: `botCommand` };
    var t = e.uint();
    result.flags = t;
    result.ephemeral = !!(t & 1);
    result.command = e.string();
    result.description = e.string();
    return result;
  },
  1300890265: function (e) {
    var result = { _: `botInfo` };
    var t = e.uint();
    result.flags = t;
    result.hasPreviewMedias = !!(t & 64);
    if (t & 1) {
      result.userId = e.long();
    }
    if (t & 2) {
      result.description = e.string();
    }
    if (t & 16) {
      result.descriptionPhoto = e.object();
    }
    if (t & 32) {
      result.descriptionDocument = e.object();
    }
    if (t & 4) {
      result.commands = e.vector(e.object);
    }
    if (t & 8) {
      result.menuButton = e.object();
    }
    if (t & 128) {
      result.privacyPolicyUrl = e.string();
    }
    if (t & 256) {
      result.appSettings = e.object();
    }
    if (t & 512) {
      result.verifierSettings = e.object();
    }
    return result;
  },
  795322159: function (e) {
    var result = { _: `keyboardButton` };
    var t = e.uint();
    result.flags = t;
    if (t & 1024) {
      result.style = e.object();
    }
    result.text = e.string();
    result.type = e.object();
    return result;
  },
  2002815875: function (e) {
    var result = { _: `keyboardButtonRow` };
    result.buttons = e.vector(e.object);
    return result;
  },
  2688441221: function (e) {
    var result = { _: `replyKeyboardHide` };
    var t = e.uint();
    result.flags = t;
    result.selective = !!(t & 4);
    return result;
  },
  2259946248: function (e) {
    var result = { _: `replyKeyboardForceReply` };
    var t = e.uint();
    result.flags = t;
    result.singleUse = !!(t & 2);
    result.selective = !!(t & 4);
    if (t & 8) {
      result.placeholder = e.string();
    }
    return result;
  },
  2245892561: function (e) {
    var result = { _: `replyKeyboardMarkup` };
    var t = e.uint();
    result.flags = t;
    result.resize = !!(t & 1);
    result.singleUse = !!(t & 2);
    result.selective = !!(t & 4);
    result.persistent = !!(t & 16);
    result.forceReply = !!(t & 32);
    result.rows = e.vector(e.object);
    if (t & 8) {
      result.placeholder = e.string();
    }
    return result;
  },
  2997966704: function (e) {
    var result = { _: `replyInlineMarkup` };
    var t = e.uint();
    result.flags = t;
    result.forceReply = !!(t & 32);
    result.rows = e.vector(e.object);
    return result;
  },
  3146955413: function (e) {
    var result = { _: `messageEntityUnknown` };
    result.offset = e.int();
    result.length = e.int();
    return result;
  },
  4194588573: function (e) {
    var result = { _: `messageEntityMention` };
    result.offset = e.int();
    result.length = e.int();
    return result;
  },
  1868782349: function (e) {
    var result = { _: `messageEntityHashtag` };
    result.offset = e.int();
    result.length = e.int();
    return result;
  },
  1827637959: function (e) {
    var result = { _: `messageEntityBotCommand` };
    result.offset = e.int();
    result.length = e.int();
    return result;
  },
  1859134776: function (e) {
    var result = { _: `messageEntityUrl` };
    result.offset = e.int();
    result.length = e.int();
    return result;
  },
  1692693954: function (e) {
    var result = { _: `messageEntityEmail` };
    result.offset = e.int();
    result.length = e.int();
    return result;
  },
  3177253833: function (e) {
    var result = { _: `messageEntityBold` };
    result.offset = e.int();
    result.length = e.int();
    return result;
  },
  2188348256: function (e) {
    var result = { _: `messageEntityItalic` };
    result.offset = e.int();
    result.length = e.int();
    return result;
  },
  681706865: function (e) {
    var result = { _: `messageEntityCode` };
    result.offset = e.int();
    result.length = e.int();
    return result;
  },
  1938967520: function (e) {
    var result = { _: `messageEntityPre` };
    result.offset = e.int();
    result.length = e.int();
    result.language = e.string();
    return result;
  },
  1990644519: function (e) {
    var result = { _: `messageEntityTextUrl` };
    result.offset = e.int();
    result.length = e.int();
    result.url = e.string();
    return result;
  },
  3699052864: function (e) {
    var result = { _: `messageEntityMentionName` };
    result.offset = e.int();
    result.length = e.int();
    result.userId = e.long();
    return result;
  },
  546203849: function (e) {
    var result = { _: `inputMessageEntityMentionName` };
    result.offset = e.int();
    result.length = e.int();
    result.userId = e.object();
    return result;
  },
  2607407947: function (e) {
    var result = { _: `messageEntityPhone` };
    result.offset = e.int();
    result.length = e.int();
    return result;
  },
  1280209983: function (e) {
    var result = { _: `messageEntityCashtag` };
    result.offset = e.int();
    result.length = e.int();
    return result;
  },
  2622389899: function (e) {
    var result = { _: `messageEntityUnderline` };
    result.offset = e.int();
    result.length = e.int();
    return result;
  },
  3204879316: function (e) {
    var result = { _: `messageEntityStrike` };
    result.offset = e.int();
    result.length = e.int();
    return result;
  },
  1981704948: function (e) {
    var result = { _: `messageEntityBankCard` };
    result.offset = e.int();
    result.length = e.int();
    return result;
  },
  852137487: function (e) {
    var result = { _: `messageEntitySpoiler` };
    result.offset = e.int();
    result.length = e.int();
    return result;
  },
  3369010680: function (e) {
    var result = { _: `messageEntityCustomEmoji` };
    result.offset = e.int();
    result.length = e.int();
    result.documentId = e.long();
    return result;
  },
  4056722092: function (e) {
    var result = { _: `messageEntityBlockquote` };
    var t = e.uint();
    result.flags = t;
    result.collapsed = !!(t & 1);
    result.offset = e.int();
    result.length = e.int();
    return result;
  },
  2420819911: function (e) {
    var result = { _: `messageEntityFormattedDate` };
    var t = e.uint();
    result.flags = t;
    result.relative = !!(t & 1);
    result.shortTime = !!(t & 2);
    result.longTime = !!(t & 4);
    result.shortDate = !!(t & 8);
    result.longDate = !!(t & 16);
    result.dayOfWeek = !!(t & 32);
    result.offset = e.int();
    result.length = e.int();
    result.date = e.int();
    return result;
  },
  1903653142: function (e) {
    var result = { _: `messageEntityDiffInsert` };
    result.offset = e.int();
    result.length = e.int();
    return result;
  },
  3334596007: function (e) {
    var result = { _: `messageEntityDiffReplace` };
    result.offset = e.int();
    result.length = e.int();
    result.oldText = e.string();
    return result;
  },
  106086853: function (e) {
    var result = { _: `messageEntityDiffDelete` };
    result.offset = e.int();
    result.length = e.int();
    return result;
  },
  4255891405: function (e) {
    var result = { _: `messageEntityTonAddress` };
    result.offset = e.int();
    result.length = e.int();
    return result;
  },
  4002160262: function (e) {
    var result = { _: `inputChannelEmpty` };
    return result;
  },
  4082822184: function (e) {
    var result = { _: `inputChannel` };
    result.channelId = e.long();
    result.accessHash = e.long();
    return result;
  },
  1536380829: function (e) {
    var result = { _: `inputChannelFromMessage` };
    result.peer = e.object();
    result.msgId = e.int();
    result.channelId = e.long();
    return result;
  },
  2131196633: function (e) {
    var result = { _: `contacts.resolvedPeer` };
    result.peer = e.object();
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  182649427: function (e) {
    var result = { _: `messageRange` };
    result.minId = e.int();
    result.maxId = e.int();
    return result;
  },
  1041346555: function (e) {
    var result = { _: `updates.channelDifferenceEmpty` };
    var t = e.uint();
    result.flags = t;
    result.final = !!(t & 1);
    result.pts = e.int();
    if (t & 2) {
      result.timeout = e.int();
    }
    return result;
  },
  2763835134: function (e) {
    var result = { _: `updates.channelDifferenceTooLong` };
    var t = e.uint();
    result.flags = t;
    result.final = !!(t & 1);
    if (t & 2) {
      result.timeout = e.int();
    }
    result.dialog = e.object();
    result.messages = e.vector(e.object);
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  543450958: function (e) {
    var result = { _: `updates.channelDifference` };
    var t = e.uint();
    result.flags = t;
    result.final = !!(t & 1);
    result.pts = e.int();
    if (t & 2) {
      result.timeout = e.int();
    }
    result.newMessages = e.vector(e.object);
    result.otherUpdates = e.vector(e.object);
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  2496933607: function (e) {
    var result = { _: `channelMessagesFilterEmpty` };
    return result;
  },
  3447183703: function (e) {
    var result = { _: `channelMessagesFilter` };
    var t = e.uint();
    result.flags = t;
    result.excludeNewMessages = !!(t & 2);
    result.ranges = e.vector(e.object);
    return result;
  },
  466961494: function (e) {
    var result = { _: `channelParticipant` };
    var t = e.uint();
    result.flags = t;
    result.userId = e.long();
    result.date = e.int();
    if (t & 1) {
      result.subscriptionUntilDate = e.int();
    }
    if (t & 4) {
      result.rank = e.string();
    }
    return result;
  },
  2840037914: function (e) {
    var result = { _: `channelParticipantSelf` };
    var t = e.uint();
    result.flags = t;
    result.viaRequest = !!(t & 1);
    result.userId = e.long();
    result.inviterId = e.long();
    result.date = e.int();
    if (t & 2) {
      result.subscriptionUntilDate = e.int();
    }
    if (t & 4) {
      result.rank = e.string();
    }
    return result;
  },
  803602899: function (e) {
    var result = { _: `channelParticipantCreator` };
    var t = e.uint();
    result.flags = t;
    result.userId = e.long();
    result.adminRights = e.object();
    if (t & 1) {
      result.rank = e.string();
    }
    return result;
  },
  885242707: function (e) {
    var result = { _: `channelParticipantAdmin` };
    var t = e.uint();
    result.flags = t;
    result.canEdit = !!(t & 1);
    result.self = !!(t & 2);
    result.userId = e.long();
    if (t & 2) {
      result.inviterId = e.long();
    }
    result.promotedBy = e.long();
    result.date = e.int();
    result.adminRights = e.object();
    if (t & 4) {
      result.rank = e.string();
    }
    return result;
  },
  3589320081: function (e) {
    var result = { _: `channelParticipantBanned` };
    var t = e.uint();
    result.flags = t;
    result.left = !!(t & 1);
    result.peer = e.object();
    result.kickedBy = e.long();
    result.date = e.int();
    result.bannedRights = e.object();
    if (t & 4) {
      result.rank = e.string();
    }
    return result;
  },
  453242886: function (e) {
    var result = { _: `channelParticipantLeft` };
    result.peer = e.object();
    return result;
  },
  3728686201: function (e) {
    var result = { _: `channelParticipantsRecent` };
    return result;
  },
  3026225513: function (e) {
    var result = { _: `channelParticipantsAdmins` };
    return result;
  },
  2746567045: function (e) {
    var result = { _: `channelParticipantsKicked` };
    result.q = e.string();
    return result;
  },
  2966521435: function (e) {
    var result = { _: `channelParticipantsBots` };
    return result;
  },
  338142689: function (e) {
    var result = { _: `channelParticipantsBanned` };
    result.q = e.string();
    return result;
  },
  106343499: function (e) {
    var result = { _: `channelParticipantsSearch` };
    result.q = e.string();
    return result;
  },
  3144345741: function (e) {
    var result = { _: `channelParticipantsContacts` };
    result.q = e.string();
    return result;
  },
  3763035371: function (e) {
    var result = { _: `channelParticipantsMentions` };
    var t = e.uint();
    result.flags = t;
    if (t & 1) {
      result.q = e.string();
    }
    if (t & 2) {
      result.topMsgId = e.int();
    }
    return result;
  },
  2595290799: function (e) {
    var result = { _: `channels.channelParticipants` };
    result.count = e.int();
    result.participants = e.vector(e.object);
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  4028055529: function (e) {
    var result = { _: `channels.channelParticipantsNotModified` };
    return result;
  },
  3753378583: function (e) {
    var result = { _: `channels.channelParticipant` };
    result.participant = e.object();
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  2013922064: function (e) {
    var result = { _: `help.termsOfService` };
    var t = e.uint();
    result.flags = t;
    result.popup = !!(t & 1);
    result.id = e.object();
    result.text = e.string();
    result.entities = e.vector(e.object);
    if (t & 2) {
      result.minAgeConfirm = e.int();
    }
    return result;
  },
  3892468898: function (e) {
    var result = { _: `messages.savedGifsNotModified` };
    return result;
  },
  2225089037: function (e) {
    var result = { _: `messages.savedGifs` };
    result.hash = e.long();
    result.gifs = e.vector(e.object);
    return result;
  },
  864077702: function (e) {
    var result = { _: `inputBotInlineMessageMediaAuto` };
    var t = e.uint();
    result.flags = t;
    result.invertMedia = !!(t & 8);
    result.message = e.string();
    if (t & 2) {
      result.entities = e.vector(e.object);
    }
    if (t & 4) {
      result.replyMarkup = e.object();
    }
    return result;
  },
  1036876423: function (e) {
    var result = { _: `inputBotInlineMessageText` };
    var t = e.uint();
    result.flags = t;
    result.noWebpage = !!(t & 1);
    result.invertMedia = !!(t & 8);
    result.message = e.string();
    if (t & 2) {
      result.entities = e.vector(e.object);
    }
    if (t & 4) {
      result.replyMarkup = e.object();
    }
    return result;
  },
  2526190213: function (e) {
    var result = { _: `inputBotInlineMessageMediaGeo` };
    var t = e.uint();
    result.flags = t;
    result.geoPoint = e.object();
    if (t & 1) {
      result.heading = e.int();
    }
    if (t & 2) {
      result.period = e.int();
    }
    if (t & 8) {
      result.proximityNotificationRadius = e.int();
    }
    if (t & 4) {
      result.replyMarkup = e.object();
    }
    return result;
  },
  1098628881: function (e) {
    var result = { _: `inputBotInlineMessageMediaVenue` };
    var t = e.uint();
    result.flags = t;
    result.geoPoint = e.object();
    result.title = e.string();
    result.address = e.string();
    result.provider = e.string();
    result.venueId = e.string();
    result.venueType = e.string();
    if (t & 4) {
      result.replyMarkup = e.object();
    }
    return result;
  },
  2800599037: function (e) {
    var result = { _: `inputBotInlineMessageMediaContact` };
    var t = e.uint();
    result.flags = t;
    result.phoneNumber = e.string();
    result.firstName = e.string();
    result.lastName = e.string();
    result.vcard = e.string();
    if (t & 4) {
      result.replyMarkup = e.object();
    }
    return result;
  },
  1262639204: function (e) {
    var result = { _: `inputBotInlineMessageGame` };
    var t = e.uint();
    result.flags = t;
    if (t & 4) {
      result.replyMarkup = e.object();
    }
    return result;
  },
  3622273573: function (e) {
    var result = { _: `inputBotInlineMessageMediaInvoice` };
    var t = e.uint();
    result.flags = t;
    result.title = e.string();
    result.description = e.string();
    if (t & 1) {
      result.photo = e.object();
    }
    result.invoice = e.object();
    result.payload = e.bytes();
    result.provider = e.string();
    result.providerData = e.object();
    if (t & 4) {
      result.replyMarkup = e.object();
    }
    return result;
  },
  3185362192: function (e) {
    var result = { _: `inputBotInlineMessageMediaWebPage` };
    var t = e.uint();
    result.flags = t;
    result.invertMedia = !!(t & 8);
    result.forceLargeMedia = !!(t & 16);
    result.forceSmallMedia = !!(t & 32);
    result.optional = !!(t & 64);
    result.message = e.string();
    if (t & 2) {
      result.entities = e.vector(e.object);
    }
    result.url = e.string();
    if (t & 4) {
      result.replyMarkup = e.object();
    }
    return result;
  },
  3023959404: function (e) {
    var result = { _: `inputBotInlineMessageRichMessage` };
    var t = e.uint();
    result.flags = t;
    if (t & 4) {
      result.replyMarkup = e.object();
    }
    result.richMessage = e.object();
    return result;
  },
  2294256409: function (e) {
    var result = { _: `inputBotInlineResult` };
    var t = e.uint();
    result.flags = t;
    result.id = e.string();
    result.type = e.string();
    if (t & 2) {
      result.title = e.string();
    }
    if (t & 4) {
      result.description = e.string();
    }
    if (t & 8) {
      result.url = e.string();
    }
    if (t & 16) {
      result.thumb = e.object();
    }
    if (t & 32) {
      result.content = e.object();
    }
    result.sendMessage = e.object();
    return result;
  },
  2832753831: function (e) {
    var result = { _: `inputBotInlineResultPhoto` };
    result.id = e.string();
    result.type = e.string();
    result.photo = e.object();
    result.sendMessage = e.object();
    return result;
  },
  4294507972: function (e) {
    var result = { _: `inputBotInlineResultDocument` };
    var t = e.uint();
    result.flags = t;
    result.id = e.string();
    result.type = e.string();
    if (t & 2) {
      result.title = e.string();
    }
    if (t & 4) {
      result.description = e.string();
    }
    result.document = e.object();
    result.sendMessage = e.object();
    return result;
  },
  1336154098: function (e) {
    var result = { _: `inputBotInlineResultGame` };
    result.id = e.string();
    result.shortName = e.string();
    result.sendMessage = e.object();
    return result;
  },
  1984755728: function (e) {
    var result = { _: `botInlineMessageMediaAuto` };
    var t = e.uint();
    result.flags = t;
    result.invertMedia = !!(t & 8);
    result.message = e.string();
    if (t & 2) {
      result.entities = e.vector(e.object);
    }
    if (t & 4) {
      result.replyMarkup = e.object();
    }
    return result;
  },
  2357159394: function (e) {
    var result = { _: `botInlineMessageText` };
    var t = e.uint();
    result.flags = t;
    result.noWebpage = !!(t & 1);
    result.invertMedia = !!(t & 8);
    result.message = e.string();
    if (t & 2) {
      result.entities = e.vector(e.object);
    }
    if (t & 4) {
      result.replyMarkup = e.object();
    }
    return result;
  },
  85477117: function (e) {
    var result = { _: `botInlineMessageMediaGeo` };
    var t = e.uint();
    result.flags = t;
    result.geo = e.object();
    if (t & 1) {
      result.heading = e.int();
    }
    if (t & 2) {
      result.period = e.int();
    }
    if (t & 8) {
      result.proximityNotificationRadius = e.int();
    }
    if (t & 4) {
      result.replyMarkup = e.object();
    }
    return result;
  },
  2324063644: function (e) {
    var result = { _: `botInlineMessageMediaVenue` };
    var t = e.uint();
    result.flags = t;
    result.geo = e.object();
    result.title = e.string();
    result.address = e.string();
    result.provider = e.string();
    result.venueId = e.string();
    result.venueType = e.string();
    if (t & 4) {
      result.replyMarkup = e.object();
    }
    return result;
  },
  416402882: function (e) {
    var result = { _: `botInlineMessageMediaContact` };
    var t = e.uint();
    result.flags = t;
    result.phoneNumber = e.string();
    result.firstName = e.string();
    result.lastName = e.string();
    result.vcard = e.string();
    if (t & 4) {
      result.replyMarkup = e.object();
    }
    return result;
  },
  894081801: function (e) {
    var result = { _: `botInlineMessageMediaInvoice` };
    var t = e.uint();
    result.flags = t;
    result.shippingAddressRequested = !!(t & 2);
    result.test = !!(t & 8);
    result.title = e.string();
    result.description = e.string();
    if (t & 1) {
      result.photo = e.object();
    }
    result.currency = e.string();
    result.totalAmount = e.long();
    if (t & 4) {
      result.replyMarkup = e.object();
    }
    return result;
  },
  2157631910: function (e) {
    var result = { _: `botInlineMessageMediaWebPage` };
    var t = e.uint();
    result.flags = t;
    result.invertMedia = !!(t & 8);
    result.forceLargeMedia = !!(t & 16);
    result.forceSmallMedia = !!(t & 32);
    result.manual = !!(t & 128);
    result.safe = !!(t & 256);
    result.message = e.string();
    if (t & 2) {
      result.entities = e.vector(e.object);
    }
    result.url = e.string();
    if (t & 4) {
      result.replyMarkup = e.object();
    }
    return result;
  },
  174161531: function (e) {
    var result = { _: `botInlineMessageRichMessage` };
    var t = e.uint();
    result.flags = t;
    if (t & 4) {
      result.replyMarkup = e.object();
    }
    result.richMessage = e.object();
    return result;
  },
  295067450: function (e) {
    var result = { _: `botInlineResult` };
    var t = e.uint();
    result.flags = t;
    result.id = e.string();
    result.type = e.string();
    if (t & 2) {
      result.title = e.string();
    }
    if (t & 4) {
      result.description = e.string();
    }
    if (t & 8) {
      result.url = e.string();
    }
    if (t & 16) {
      result.thumb = e.object();
    }
    if (t & 32) {
      result.content = e.object();
    }
    result.sendMessage = e.object();
    return result;
  },
  400266251: function (e) {
    var result = { _: `botInlineMediaResult` };
    var t = e.uint();
    result.flags = t;
    result.id = e.string();
    result.type = e.string();
    if (t & 1) {
      result.photo = e.object();
    }
    if (t & 2) {
      result.document = e.object();
    }
    if (t & 4) {
      result.title = e.string();
    }
    if (t & 8) {
      result.description = e.string();
    }
    result.sendMessage = e.object();
    return result;
  },
  3760321270: function (e) {
    var result = { _: `messages.botResults` };
    var t = e.uint();
    result.flags = t;
    result.gallery = !!(t & 1);
    result.queryId = e.long();
    if (t & 2) {
      result.nextOffset = e.string();
    }
    if (t & 4) {
      result.switchPm = e.object();
    }
    if (t & 8) {
      result.switchWebview = e.object();
    }
    result.results = e.vector(e.object);
    result.cacheTime = e.int();
    result.users = e.vector(e.object);
    return result;
  },
  1571494644: function (e) {
    var result = { _: `exportedMessageLink` };
    result.link = e.string();
    result.html = e.string();
    return result;
  },
  1313731771: function (e) {
    var result = { _: `messageFwdHeader` };
    var t = e.uint();
    result.flags = t;
    result.imported = !!(t & 128);
    result.savedOut = !!(t & 2048);
    if (t & 1) {
      result.fromId = e.object();
    }
    if (t & 32) {
      result.fromName = e.string();
    }
    result.date = e.int();
    if (t & 4) {
      result.channelPost = e.int();
    }
    if (t & 8) {
      result.postAuthor = e.string();
    }
    if (t & 16) {
      result.savedFromPeer = e.object();
    }
    if (t & 16) {
      result.savedFromMsgId = e.int();
    }
    if (t & 256) {
      result.savedFromId = e.object();
    }
    if (t & 512) {
      result.savedFromName = e.string();
    }
    if (t & 1024) {
      result.savedDate = e.int();
    }
    if (t & 64) {
      result.psaType = e.string();
    }
    return result;
  },
  1923290508: function (e) {
    var result = { _: `auth.codeTypeSms` };
    return result;
  },
  1948046307: function (e) {
    var result = { _: `auth.codeTypeCall` };
    return result;
  },
  577556219: function (e) {
    var result = { _: `auth.codeTypeFlashCall` };
    return result;
  },
  3592083182: function (e) {
    var result = { _: `auth.codeTypeMissedCall` };
    return result;
  },
  116234636: function (e) {
    var result = { _: `auth.codeTypeFragmentSms` };
    return result;
  },
  1035688326: function (e) {
    var result = { _: `auth.sentCodeTypeApp` };
    result.length = e.int();
    return result;
  },
  3221273506: function (e) {
    var result = { _: `auth.sentCodeTypeSms` };
    result.length = e.int();
    return result;
  },
  1398007207: function (e) {
    var result = { _: `auth.sentCodeTypeCall` };
    result.length = e.int();
    return result;
  },
  2869151449: function (e) {
    var result = { _: `auth.sentCodeTypeFlashCall` };
    result.pattern = e.string();
    return result;
  },
  2181063812: function (e) {
    var result = { _: `auth.sentCodeTypeMissedCall` };
    result.prefix = e.string();
    result.length = e.int();
    return result;
  },
  4098946459: function (e) {
    var result = { _: `auth.sentCodeTypeEmailCode` };
    var t = e.uint();
    result.flags = t;
    result.appleSigninAllowed = !!(t & 1);
    result.googleSigninAllowed = !!(t & 2);
    result.emailPattern = e.string();
    result.length = e.int();
    if (t & 8) {
      result.resetAvailablePeriod = e.int();
    }
    if (t & 16) {
      result.resetPendingDate = e.int();
    }
    return result;
  },
  2773032426: function (e) {
    var result = { _: `auth.sentCodeTypeSetUpEmailRequired` };
    var t = e.uint();
    result.flags = t;
    result.appleSigninAllowed = !!(t & 1);
    result.googleSigninAllowed = !!(t & 2);
    return result;
  },
  3646315577: function (e) {
    var result = { _: `auth.sentCodeTypeFragmentSms` };
    result.url = e.string();
    result.length = e.int();
    return result;
  },
  10475318: function (e) {
    var result = { _: `auth.sentCodeTypeFirebaseSms` };
    var t = e.uint();
    result.flags = t;
    if (t & 1) {
      result.nonce = e.bytes();
    }
    if (t & 4) {
      result.playIntegrityProjectId = e.long();
    }
    if (t & 4) {
      result.playIntegrityNonce = e.bytes();
    }
    if (t & 2) {
      result.receipt = e.string();
    }
    if (t & 2) {
      result.pushTimeout = e.int();
    }
    result.length = e.int();
    return result;
  },
  2752949377: function (e) {
    var result = { _: `auth.sentCodeTypeSmsWord` };
    var t = e.uint();
    result.flags = t;
    if (t & 1) {
      result.beginning = e.string();
    }
    return result;
  },
  3010958511: function (e) {
    var result = { _: `auth.sentCodeTypeSmsPhrase` };
    var t = e.uint();
    result.flags = t;
    if (t & 1) {
      result.beginning = e.string();
    }
    return result;
  },
  911761060: function (e) {
    var result = { _: `messages.botCallbackAnswer` };
    var t = e.uint();
    result.flags = t;
    result.alert = !!(t & 2);
    result.hasUrl = !!(t & 8);
    result.nativeUi = !!(t & 16);
    if (t & 1) {
      result.message = e.string();
    }
    if (t & 4) {
      result.url = e.string();
    }
    result.cacheTime = e.int();
    return result;
  },
  649453030: function (e) {
    var result = { _: `messages.messageEditData` };
    var t = e.uint();
    result.flags = t;
    result.caption = !!(t & 1);
    return result;
  },
  2299280777: function (e) {
    var result = { _: `inputBotInlineMessageID` };
    result.dcId = e.int();
    result.id = e.long();
    result.accessHash = e.long();
    return result;
  },
  3067680215: function (e) {
    var result = { _: `inputBotInlineMessageID64` };
    result.dcId = e.int();
    result.ownerId = e.long();
    result.id = e.int();
    result.accessHash = e.long();
    return result;
  },
  1008755359: function (e) {
    var result = { _: `inlineBotSwitchPM` };
    result.text = e.string();
    result.startParam = e.string();
    return result;
  },
  863093588: function (e) {
    var result = { _: `messages.peerDialogs` };
    result.dialogs = e.vector(e.object);
    result.messages = e.vector(e.object);
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    result.state = e.object();
    return result;
  },
  3989684315: function (e) {
    var result = { _: `topPeer` };
    result.peer = e.object();
    result.rating = e.double();
    return result;
  },
  2875595611: function (e) {
    var result = { _: `topPeerCategoryBotsPM` };
    return result;
  },
  344356834: function (e) {
    var result = { _: `topPeerCategoryBotsInline` };
    return result;
  },
  104314861: function (e) {
    var result = { _: `topPeerCategoryCorrespondents` };
    return result;
  },
  3172442442: function (e) {
    var result = { _: `topPeerCategoryGroups` };
    return result;
  },
  371037736: function (e) {
    var result = { _: `topPeerCategoryChannels` };
    return result;
  },
  511092620: function (e) {
    var result = { _: `topPeerCategoryPhoneCalls` };
    return result;
  },
  2822794409: function (e) {
    var result = { _: `topPeerCategoryForwardUsers` };
    return result;
  },
  4226728176: function (e) {
    var result = { _: `topPeerCategoryForwardChats` };
    return result;
  },
  4255022060: function (e) {
    var result = { _: `topPeerCategoryBotsApp` };
    return result;
  },
  1814361053: function (e) {
    var result = { _: `topPeerCategoryBotsGuestChat` };
    return result;
  },
  4219683473: function (e) {
    var result = { _: `topPeerCategoryPeers` };
    result.category = e.object();
    result.count = e.int();
    result.peers = e.vector(e.object);
    return result;
  },
  3727060725: function (e) {
    var result = { _: `contacts.topPeersNotModified` };
    return result;
  },
  1891070632: function (e) {
    var result = { _: `contacts.topPeers` };
    result.categories = e.vector(e.object);
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  3039597469: function (e) {
    var result = { _: `contacts.topPeersDisabled` };
    return result;
  },
  453805082: function (e) {
    var result = { _: `draftMessageEmpty` };
    var t = e.uint();
    result.flags = t;
    if (t & 1) {
      result.date = e.int();
    }
    return result;
  },
  1627271828: function (e) {
    var result = { _: `draftMessage` };
    var t = e.uint();
    result.flags = t;
    result.noWebpage = !!(t & 2);
    result.invertMedia = !!(t & 64);
    if (t & 16) {
      result.replyTo = e.object();
    }
    result.message = e.string();
    if (t & 8) {
      result.entities = e.vector(e.object);
    }
    if (t & 32) {
      result.media = e.object();
    }
    result.date = e.int();
    if (t & 128) {
      result.effect = e.long();
    }
    if (t & 256) {
      result.suggestedPost = e.object();
    }
    if (t & 512) {
      result.richMessage = e.object();
    }
    return result;
  },
  3336309862: function (e) {
    var result = { _: `messages.featuredStickersNotModified` };
    result.count = e.int();
    return result;
  },
  3191351558: function (e) {
    var result = { _: `messages.featuredStickers` };
    var t = e.uint();
    result.flags = t;
    result.premium = !!(t & 1);
    result.hash = e.long();
    result.count = e.int();
    result.sets = e.vector(e.object);
    result.unread = e.vector(e.long);
    return result;
  },
  186120336: function (e) {
    var result = { _: `messages.recentStickersNotModified` };
    return result;
  },
  2295561302: function (e) {
    var result = { _: `messages.recentStickers` };
    result.hash = e.long();
    result.packs = e.vector(e.object);
    result.stickers = e.vector(e.object);
    result.dates = e.vector(e.int);
    return result;
  },
  1338747336: function (e) {
    var result = { _: `messages.archivedStickers` };
    result.count = e.int();
    result.sets = e.vector(e.object);
    return result;
  },
  946083368: function (e) {
    var result = { _: `messages.stickerSetInstallResultSuccess` };
    return result;
  },
  904138920: function (e) {
    var result = { _: `messages.stickerSetInstallResultArchive` };
    result.sets = e.vector(e.object);
    return result;
  },
  1678812626: function (e) {
    var result = { _: `stickerSetCovered` };
    result.set = e.object();
    result.cover = e.object();
    return result;
  },
  872932635: function (e) {
    var result = { _: `stickerSetMultiCovered` };
    result.set = e.object();
    result.covers = e.vector(e.object);
    return result;
  },
  1087454222: function (e) {
    var result = { _: `stickerSetFullCovered` };
    result.set = e.object();
    result.packs = e.vector(e.object);
    result.keywords = e.vector(e.object);
    result.documents = e.vector(e.object);
    return result;
  },
  2008112412: function (e) {
    var result = { _: `stickerSetNoCovered` };
    result.set = e.object();
    return result;
  },
  2933316530: function (e) {
    var result = { _: `maskCoords` };
    result.n = e.int();
    result.x = e.double();
    result.y = e.double();
    result.zoom = e.double();
    return result;
  },
  1251549527: function (e) {
    var result = { _: `inputStickeredMediaPhoto` };
    result.id = e.object();
    return result;
  },
  70813275: function (e) {
    var result = { _: `inputStickeredMediaDocument` };
    result.id = e.object();
    return result;
  },
  3187238203: function (e) {
    var result = { _: `game` };
    var t = e.uint();
    result.flags = t;
    result.id = e.long();
    result.accessHash = e.long();
    result.shortName = e.string();
    result.title = e.string();
    result.description = e.string();
    result.photo = e.object();
    if (t & 1) {
      result.document = e.object();
    }
    return result;
  },
  53231223: function (e) {
    var result = { _: `inputGameID` };
    result.id = e.long();
    result.accessHash = e.long();
    return result;
  },
  3274827786: function (e) {
    var result = { _: `inputGameShortName` };
    result.botId = e.object();
    result.shortName = e.string();
    return result;
  },
  1940093419: function (e) {
    var result = { _: `highScore` };
    result.pos = e.int();
    result.userId = e.long();
    result.score = e.int();
    return result;
  },
  2587622809: function (e) {
    var result = { _: `messages.highScores` };
    result.scores = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  3695018575: function (e) {
    var result = { _: `textEmpty` };
    return result;
  },
  1950782688: function (e) {
    var result = { _: `textPlain` };
    result.text = e.string();
    return result;
  },
  1730456516: function (e) {
    var result = { _: `textBold` };
    result.text = e.object();
    return result;
  },
  3641877916: function (e) {
    var result = { _: `textItalic` };
    result.text = e.object();
    return result;
  },
  3240501956: function (e) {
    var result = { _: `textUnderline` };
    result.text = e.object();
    return result;
  },
  2616769429: function (e) {
    var result = { _: `textStrike` };
    result.text = e.object();
    return result;
  },
  1816074681: function (e) {
    var result = { _: `textFixed` };
    result.text = e.object();
    return result;
  },
  1009288385: function (e) {
    var result = { _: `textUrl` };
    result.text = e.object();
    result.url = e.string();
    result.webpageId = e.long();
    return result;
  },
  3730443734: function (e) {
    var result = { _: `textEmail` };
    result.text = e.object();
    result.email = e.string();
    return result;
  },
  2120376535: function (e) {
    var result = { _: `textConcat` };
    result.texts = e.vector(e.object);
    return result;
  },
  3983181060: function (e) {
    var result = { _: `textSubscript` };
    result.text = e.object();
    return result;
  },
  3355139585: function (e) {
    var result = { _: `textSuperscript` };
    result.text = e.object();
    return result;
  },
  55281185: function (e) {
    var result = { _: `textMarked` };
    result.text = e.object();
    return result;
  },
  483104362: function (e) {
    var result = { _: `textPhone` };
    result.text = e.object();
    result.phone = e.string();
    return result;
  },
  136105807: function (e) {
    var result = { _: `textImage` };
    result.documentId = e.long();
    result.w = e.int();
    result.h = e.int();
    return result;
  },
  894777186: function (e) {
    var result = { _: `textAnchor` };
    result.text = e.object();
    result.name = e.string();
    return result;
  },
  2637081751: function (e) {
    var result = { _: `textMath` };
    result.source = e.string();
    return result;
  },
  2724288192: function (e) {
    var result = { _: `textCustomEmoji` };
    result.documentId = e.long();
    result.alt = e.string();
    return result;
  },
  1277844834: function (e) {
    var result = { _: `textSpoiler` };
    result.text = e.object();
    return result;
  },
  3441741636: function (e) {
    var result = { _: `textMention` };
    result.text = e.object();
    return result;
  },
  1368728810: function (e) {
    var result = { _: `textHashtag` };
    result.text = e.object();
    return result;
  },
  50276819: function (e) {
    var result = { _: `textBotCommand` };
    result.text = e.object();
    return result;
  },
  2073958401: function (e) {
    var result = { _: `textCashtag` };
    result.text = e.object();
    return result;
  },
  2892661674: function (e) {
    var result = { _: `textAutoUrl` };
    result.text = e.object();
    return result;
  },
  3310789725: function (e) {
    var result = { _: `textAutoEmail` };
    result.text = e.object();
    return result;
  },
  616720265: function (e) {
    var result = { _: `textAutoPhone` };
    result.text = e.object();
    return result;
  },
  3109454125: function (e) {
    var result = { _: `textBankCard` };
    result.text = e.object();
    return result;
  },
  27917308: function (e) {
    var result = { _: `textMentionName` };
    result.text = e.object();
    result.userId = e.long();
    return result;
  },
  2780061227: function (e) {
    var result = { _: `textDate` };
    var t = e.uint();
    result.flags = t;
    result.relative = !!(t & 1);
    result.shortTime = !!(t & 2);
    result.longTime = !!(t & 4);
    result.shortDate = !!(t & 8);
    result.longDate = !!(t & 16);
    result.dayOfWeek = !!(t & 32);
    result.text = e.object();
    result.date = e.int();
    return result;
  },
  2525416272: function (e) {
    var result = { _: `textDiff` };
    result.text = e.object();
    result.oldText = e.object();
    return result;
  },
  2949094614: function (e) {
    var result = { _: `textButton` };
    var t = e.uint();
    result.flags = t;
    result.text = e.object();
    result.type = e.object();
    if (t & 1) {
      result.style = e.object();
    }
    return result;
  },
  1020437354: function (e) {
    var result = { _: `textTonAddress` };
    result.text = e.object();
    return result;
  },
  324435594: function (e) {
    var result = { _: `pageBlockUnsupported` };
    return result;
  },
  1890305021: function (e) {
    var result = { _: `pageBlockTitle` };
    result.text = e.object();
    return result;
  },
  2415565343: function (e) {
    var result = { _: `pageBlockSubtitle` };
    result.text = e.object();
    return result;
  },
  3132089824: function (e) {
    var result = { _: `pageBlockAuthorDate` };
    result.author = e.object();
    result.publishedDate = e.int();
    return result;
  },
  3218105580: function (e) {
    var result = { _: `pageBlockHeader` };
    result.text = e.object();
    return result;
  },
  4046173921: function (e) {
    var result = { _: `pageBlockSubheader` };
    result.text = e.object();
    return result;
  },
  1182402406: function (e) {
    var result = { _: `pageBlockParagraph` };
    result.text = e.object();
    return result;
  },
  3228621118: function (e) {
    var result = { _: `pageBlockPreformatted` };
    result.text = e.object();
    result.language = e.string();
    return result;
  },
  1216809369: function (e) {
    var result = { _: `pageBlockFooter` };
    result.text = e.object();
    return result;
  },
  3676352904: function (e) {
    var result = { _: `pageBlockDivider` };
    return result;
  },
  3456972720: function (e) {
    var result = { _: `pageBlockAnchor` };
    result.name = e.string();
    return result;
  },
  3840442385: function (e) {
    var result = { _: `pageBlockList` };
    result.items = e.vector(e.object);
    return result;
  },
  1724999435: function (e) {
    var result = { _: `pageBlockBlockquote` };
    var t = e.uint();
    result.flags = t;
    result.collapsed = !!(t & 1);
    result.text = e.object();
    result.caption = e.object();
    return result;
  },
  1329878739: function (e) {
    var result = { _: `pageBlockPullquote` };
    result.text = e.object();
    result.caption = e.object();
    return result;
  },
  391759200: function (e) {
    var result = { _: `pageBlockPhoto` };
    var t = e.uint();
    result.flags = t;
    result.spoiler = !!(t & 2);
    result.photoId = e.long();
    result.caption = e.object();
    if (t & 1) {
      result.url = e.string();
    }
    if (t & 1) {
      result.webpageId = e.long();
    }
    return result;
  },
  2089805750: function (e) {
    var result = { _: `pageBlockVideo` };
    var t = e.uint();
    result.flags = t;
    result.autoplay = !!(t & 1);
    result.loop = !!(t & 2);
    result.spoiler = !!(t & 4);
    result.videoId = e.long();
    result.caption = e.object();
    return result;
  },
  972174080: function (e) {
    var result = { _: `pageBlockCover` };
    result.cover = e.object();
    return result;
  },
  2826014149: function (e) {
    var result = { _: `pageBlockEmbed` };
    var t = e.uint();
    result.flags = t;
    result.fullWidth = !!(t & 1);
    result.allowScrolling = !!(t & 8);
    if (t & 2) {
      result.url = e.string();
    }
    if (t & 4) {
      result.html = e.string();
    }
    if (t & 16) {
      result.posterPhotoId = e.long();
    }
    if (t & 32) {
      result.w = e.int();
    }
    if (t & 32) {
      result.h = e.int();
    }
    result.caption = e.object();
    return result;
  },
  4065961995: function (e) {
    var result = { _: `pageBlockEmbedPost` };
    result.url = e.string();
    result.webpageId = e.long();
    result.authorPhotoId = e.long();
    result.author = e.string();
    result.date = e.int();
    result.blocks = e.vector(e.object);
    result.caption = e.object();
    return result;
  },
  1705048653: function (e) {
    var result = { _: `pageBlockCollage` };
    result.items = e.vector(e.object);
    result.caption = e.object();
    return result;
  },
  52401552: function (e) {
    var result = { _: `pageBlockSlideshow` };
    result.items = e.vector(e.object);
    result.caption = e.object();
    return result;
  },
  4011282869: function (e) {
    var result = { _: `pageBlockChannel` };
    result.channel = e.object();
    return result;
  },
  2151899626: function (e) {
    var result = { _: `pageBlockAudio` };
    result.audioId = e.long();
    result.caption = e.object();
    return result;
  },
  504660880: function (e) {
    var result = { _: `pageBlockKicker` };
    result.text = e.object();
    return result;
  },
  3209554562: function (e) {
    var result = { _: `pageBlockTable` };
    var t = e.uint();
    result.flags = t;
    result.bordered = !!(t & 1);
    result.striped = !!(t & 2);
    result.compact = !!(t & 4);
    result.title = e.object();
    result.rows = e.vector(e.object);
    return result;
  },
  534181569: function (e) {
    var result = { _: `pageBlockOrderedList` };
    var t = e.uint();
    result.flags = t;
    result.reversed = !!(t & 4);
    result.items = e.vector(e.object);
    if (t & 1) {
      result.start = e.int();
    }
    if (t & 2) {
      result.type = e.string();
    }
    return result;
  },
  1987480557: function (e) {
    var result = { _: `pageBlockDetails` };
    var t = e.uint();
    result.flags = t;
    result.open = !!(t & 1);
    result.blocks = e.vector(e.object);
    result.title = e.object();
    return result;
  },
  370236054: function (e) {
    var result = { _: `pageBlockRelatedArticles` };
    result.title = e.object();
    result.articles = e.vector(e.object);
    return result;
  },
  2756656886: function (e) {
    var result = { _: `pageBlockMap` };
    result.geo = e.object();
    result.zoom = e.int();
    result.w = e.int();
    result.h = e.int();
    result.caption = e.object();
    return result;
  },
  3137275695: function (e) {
    var result = { _: `pageBlockHeading1` };
    result.text = e.object();
    return result;
  },
  158018284: function (e) {
    var result = { _: `pageBlockHeading2` };
    result.text = e.object();
    return result;
  },
  1743204781: function (e) {
    var result = { _: `pageBlockHeading3` };
    result.text = e.object();
    return result;
  },
  3039983403: function (e) {
    var result = { _: `pageBlockHeading4` };
    result.text = e.object();
    return result;
  },
  3686689898: function (e) {
    var result = { _: `pageBlockHeading5` };
    result.text = e.object();
    return result;
  },
  1747599785: function (e) {
    var result = { _: `pageBlockHeading6` };
    result.text = e.object();
    return result;
  },
  1493699616: function (e) {
    var result = { _: `pageBlockMath` };
    result.source = e.string();
    return result;
  },
  1009361890: function (e) {
    var result = { _: `pageBlockThinking` };
    result.text = e.object();
    return result;
  },
  1464557951: function (e) {
    var result = { _: `inputPageBlockMap` };
    result.geo = e.object();
    result.zoom = e.int();
    result.w = e.int();
    result.h = e.int();
    result.caption = e.object();
    return result;
  },
  242108356: function (e) {
    var result = { _: `pageBlockBlockquoteBlocks` };
    result.blocks = e.vector(e.object);
    result.caption = e.object();
    return result;
  },
  1835270936: function (e) {
    var result = { _: `pageBlockButtonRow` };
    var t = e.uint();
    result.flags = t;
    result.alignLeft = !!(t & 1);
    result.alignCenter = !!(t & 2);
    result.alignRight = !!(t & 4);
    result.buttons = e.vector(e.object);
    return result;
  },
  955923363: function (e) {
    var result = { _: `pageBlockDocument` };
    result.documentId = e.long();
    result.caption = e.object();
    return result;
  },
  2246320897: function (e) {
    var result = { _: `phoneCallDiscardReasonMissed` };
    return result;
  },
  3767910816: function (e) {
    var result = { _: `phoneCallDiscardReasonDisconnect` };
    return result;
  },
  1471006352: function (e) {
    var result = { _: `phoneCallDiscardReasonHangup` };
    return result;
  },
  4210550985: function (e) {
    var result = { _: `phoneCallDiscardReasonBusy` };
    return result;
  },
  2679894519: function (e) {
    var result = { _: `phoneCallDiscardReasonMigrateConferenceCall` };
    result.slug = e.string();
    return result;
  },
  2104790276: function (e) {
    var result = { _: `dataJSON` };
    result.data = e.string();
    return result;
  },
  3408489464: function (e) {
    var result = { _: `labeledPrice` };
    result.label = e.string();
    result.amount = e.long();
    return result;
  },
  77522308: function (e) {
    var result = { _: `invoice` };
    var t = e.uint();
    result.flags = t;
    result.test = !!(t & 1);
    result.nameRequested = !!(t & 2);
    result.phoneRequested = !!(t & 4);
    result.emailRequested = !!(t & 8);
    result.shippingAddressRequested = !!(t & 16);
    result.flexible = !!(t & 32);
    result.phoneToProvider = !!(t & 64);
    result.emailToProvider = !!(t & 128);
    result.recurring = !!(t & 512);
    result.currency = e.string();
    result.prices = e.vector(e.object);
    if (t & 256) {
      result.maxTipAmount = e.long();
    }
    if (t & 256) {
      result.suggestedTipAmounts = e.vector(e.long);
    }
    if (t & 1024) {
      result.termsUrl = e.string();
    }
    if (t & 2048) {
      result.subscriptionPeriod = e.int();
    }
    return result;
  },
  3926049406: function (e) {
    var result = { _: `paymentCharge` };
    result.id = e.string();
    result.providerChargeId = e.string();
    return result;
  },
  512535275: function (e) {
    var result = { _: `postAddress` };
    result.streetLine1 = e.string();
    result.streetLine2 = e.string();
    result.city = e.string();
    result.state = e.string();
    result.countryIso2 = e.string();
    result.postCode = e.string();
    return result;
  },
  2426158996: function (e) {
    var result = { _: `paymentRequestedInfo` };
    var t = e.uint();
    result.flags = t;
    if (t & 1) {
      result.name = e.string();
    }
    if (t & 2) {
      result.phone = e.string();
    }
    if (t & 4) {
      result.email = e.string();
    }
    if (t & 8) {
      result.shippingAddress = e.object();
    }
    return result;
  },
  3452074527: function (e) {
    var result = { _: `paymentSavedCredentialsCard` };
    result.id = e.string();
    result.title = e.string();
    return result;
  },
  475467473: function (e) {
    var result = { _: `webDocument` };
    result.url = e.string();
    result.accessHash = e.long();
    result.size = e.int();
    result.mimeType = e.string();
    result.attributes = e.vector(e.object);
    return result;
  },
  4190682310: function (e) {
    var result = { _: `webDocumentNoProxy` };
    result.url = e.string();
    result.size = e.int();
    result.mimeType = e.string();
    result.attributes = e.vector(e.object);
    return result;
  },
  2616017741: function (e) {
    var result = { _: `inputWebDocument` };
    result.url = e.string();
    result.size = e.int();
    result.mimeType = e.string();
    result.attributes = e.vector(e.object);
    return result;
  },
  3258570374: function (e) {
    var result = { _: `inputWebFileLocation` };
    result.url = e.string();
    result.accessHash = e.long();
    return result;
  },
  2669814217: function (e) {
    var result = { _: `inputWebFileGeoPointLocation` };
    result.geoPoint = e.object();
    result.accessHash = e.long();
    result.w = e.int();
    result.h = e.int();
    result.zoom = e.int();
    result.scale = e.int();
    return result;
  },
  4100974884: function (e) {
    var result = { _: `inputWebFileAudioAlbumThumbLocation` };
    var t = e.uint();
    result.flags = t;
    result.small = !!(t & 4);
    if (t & 1) {
      result.document = e.object();
    }
    if (t & 2) {
      result.title = e.string();
    }
    if (t & 2) {
      result.performer = e.string();
    }
    return result;
  },
  568808380: function (e) {
    var result = { _: `upload.webFile` };
    result.size = e.int();
    result.mimeType = e.string();
    result.fileType = e.object();
    result.mtime = e.int();
    result.bytes = e.bytes();
    return result;
  },
  2684716881: function (e) {
    var result = { _: `payments.paymentForm` };
    var t = e.uint();
    result.flags = t;
    result.canSaveCredentials = !!(t & 4);
    result.passwordMissing = !!(t & 8);
    result.formId = e.long();
    result.botId = e.long();
    result.title = e.string();
    result.description = e.string();
    if (t & 32) {
      result.photo = e.object();
    }
    result.invoice = e.object();
    result.providerId = e.long();
    result.url = e.string();
    if (t & 16) {
      result.nativeProvider = e.string();
    }
    if (t & 16) {
      result.nativeParams = e.object();
    }
    if (t & 64) {
      result.additionalMethods = e.vector(e.object);
    }
    if (t & 1) {
      result.savedInfo = e.object();
    }
    if (t & 2) {
      result.savedCredentials = e.vector(e.object);
    }
    result.users = e.vector(e.object);
    return result;
  },
  2079764828: function (e) {
    var result = { _: `payments.paymentFormStars` };
    var t = e.uint();
    result.flags = t;
    result.formId = e.long();
    result.botId = e.long();
    result.title = e.string();
    result.description = e.string();
    if (t & 32) {
      result.photo = e.object();
    }
    result.invoice = e.object();
    result.users = e.vector(e.object);
    return result;
  },
  3022376929: function (e) {
    var result = { _: `payments.paymentFormStarGift` };
    result.formId = e.long();
    result.invoice = e.object();
    return result;
  },
  3510966403: function (e) {
    var result = { _: `payments.validatedRequestedInfo` };
    var t = e.uint();
    result.flags = t;
    if (t & 1) {
      result.id = e.string();
    }
    if (t & 2) {
      result.shippingOptions = e.vector(e.object);
    }
    return result;
  },
  1314881805: function (e) {
    var result = { _: `payments.paymentResult` };
    result.updates = e.object();
    return result;
  },
  3628142905: function (e) {
    var result = { _: `payments.paymentVerificationNeeded` };
    result.url = e.string();
    return result;
  },
  1891958275: function (e) {
    var result = { _: `payments.paymentReceipt` };
    var t = e.uint();
    result.flags = t;
    result.date = e.int();
    result.botId = e.long();
    result.providerId = e.long();
    result.title = e.string();
    result.description = e.string();
    if (t & 4) {
      result.photo = e.object();
    }
    result.invoice = e.object();
    if (t & 1) {
      result.info = e.object();
    }
    if (t & 2) {
      result.shipping = e.object();
    }
    if (t & 8) {
      result.tipAmount = e.long();
    }
    result.currency = e.string();
    result.totalAmount = e.long();
    result.credentialsTitle = e.string();
    result.users = e.vector(e.object);
    return result;
  },
  3669751866: function (e) {
    var result = { _: `payments.paymentReceiptStars` };
    var t = e.uint();
    result.flags = t;
    result.date = e.int();
    result.botId = e.long();
    result.title = e.string();
    result.description = e.string();
    if (t & 4) {
      result.photo = e.object();
    }
    result.invoice = e.object();
    result.currency = e.string();
    result.totalAmount = e.long();
    result.transactionId = e.string();
    result.users = e.vector(e.object);
    return result;
  },
  4220511292: function (e) {
    var result = { _: `payments.savedInfo` };
    var t = e.uint();
    result.flags = t;
    result.hasSavedCredentials = !!(t & 2);
    if (t & 1) {
      result.savedInfo = e.object();
    }
    return result;
  },
  3238965967: function (e) {
    var result = { _: `inputPaymentCredentialsSaved` };
    result.id = e.string();
    result.tmpPassword = e.bytes();
    return result;
  },
  873977640: function (e) {
    var result = { _: `inputPaymentCredentials` };
    var t = e.uint();
    result.flags = t;
    result.save = !!(t & 1);
    result.data = e.object();
    return result;
  },
  178373535: function (e) {
    var result = { _: `inputPaymentCredentialsApplePay` };
    result.paymentData = e.object();
    return result;
  },
  2328045569: function (e) {
    var result = { _: `inputPaymentCredentialsGooglePay` };
    result.paymentToken = e.object();
    return result;
  },
  3680828724: function (e) {
    var result = { _: `account.tmpPassword` };
    result.tmpPassword = e.bytes();
    result.validUntil = e.int();
    return result;
  },
  3055631583: function (e) {
    var result = { _: `shippingOption` };
    result.id = e.string();
    result.title = e.string();
    result.prices = e.vector(e.object);
    return result;
  },
  853188252: function (e) {
    var result = { _: `inputStickerSetItem` };
    var t = e.uint();
    result.flags = t;
    result.document = e.object();
    result.emoji = e.string();
    if (t & 1) {
      result.maskCoords = e.object();
    }
    if (t & 2) {
      result.keywords = e.string();
    }
    return result;
  },
  506920429: function (e) {
    var result = { _: `inputPhoneCall` };
    result.id = e.long();
    result.accessHash = e.long();
    return result;
  },
  1399245077: function (e) {
    var result = { _: `phoneCallEmpty` };
    result.id = e.long();
    return result;
  },
  3307368215: function (e) {
    var result = { _: `phoneCallWaiting` };
    var t = e.uint();
    result.flags = t;
    result.video = !!(t & 64);
    result.id = e.long();
    result.accessHash = e.long();
    result.date = e.int();
    result.adminId = e.long();
    result.participantId = e.long();
    result.protocol = e.object();
    if (t & 1) {
      result.receiveDate = e.int();
    }
    return result;
  },
  347139340: function (e) {
    var result = { _: `phoneCallRequested` };
    var t = e.uint();
    result.flags = t;
    result.video = !!(t & 64);
    result.id = e.long();
    result.accessHash = e.long();
    result.date = e.int();
    result.adminId = e.long();
    result.participantId = e.long();
    result.gAHash = e.bytes();
    result.protocol = e.object();
    return result;
  },
  912311057: function (e) {
    var result = { _: `phoneCallAccepted` };
    var t = e.uint();
    result.flags = t;
    result.video = !!(t & 64);
    result.id = e.long();
    result.accessHash = e.long();
    result.date = e.int();
    result.adminId = e.long();
    result.participantId = e.long();
    result.gB = e.bytes();
    result.protocol = e.object();
    return result;
  },
  810769141: function (e) {
    var result = { _: `phoneCall` };
    var t = e.uint();
    result.flags = t;
    result.p2pAllowed = !!(t & 32);
    result.video = !!(t & 64);
    result.conferenceSupported = !!(t & 256);
    result.id = e.long();
    result.accessHash = e.long();
    result.date = e.int();
    result.adminId = e.long();
    result.participantId = e.long();
    result.gAOrB = e.bytes();
    result.keyFingerprint = e.long();
    result.protocol = e.object();
    result.connections = e.vector(e.object);
    result.startDate = e.int();
    if (t & 128) {
      result.customParameters = e.object();
    }
    return result;
  },
  1355435489: function (e) {
    var result = { _: `phoneCallDiscarded` };
    var t = e.uint();
    result.flags = t;
    result.needRating = !!(t & 4);
    result.needDebug = !!(t & 8);
    result.video = !!(t & 64);
    result.id = e.long();
    if (t & 1) {
      result.reason = e.object();
    }
    if (t & 2) {
      result.duration = e.int();
    }
    return result;
  },
  2629903303: function (e) {
    var result = { _: `phoneConnection` };
    var t = e.uint();
    result.flags = t;
    result.tcp = !!(t & 1);
    result.id = e.long();
    result.ip = e.string();
    result.ipv6 = e.string();
    result.port = e.int();
    result.peerTag = e.bytes();
    return result;
  },
  1667228533: function (e) {
    var result = { _: `phoneConnectionWebrtc` };
    var t = e.uint();
    result.flags = t;
    result.turn = !!(t & 1);
    result.stun = !!(t & 2);
    result.id = e.long();
    result.ip = e.string();
    result.ipv6 = e.string();
    result.port = e.int();
    result.username = e.string();
    result.password = e.string();
    return result;
  },
  4236742600: function (e) {
    var result = { _: `phoneCallProtocol` };
    var t = e.uint();
    result.flags = t;
    result.udpP2p = !!(t & 1);
    result.udpReflector = !!(t & 2);
    result.minLayer = e.int();
    result.maxLayer = e.int();
    result.libraryVersions = e.vector(e.string);
    return result;
  },
  3968000320: function (e) {
    var result = { _: `phone.phoneCall` };
    result.phoneCall = e.object();
    result.users = e.vector(e.object);
    return result;
  },
  4004045934: function (e) {
    var result = { _: `upload.cdnFileReuploadNeeded` };
    result.requestToken = e.bytes();
    return result;
  },
  2845821519: function (e) {
    var result = { _: `upload.cdnFile` };
    result.bytes = e.bytes();
    return result;
  },
  3380800186: function (e) {
    var result = { _: `cdnPublicKey` };
    result.dcId = e.int();
    result.publicKey = e.string();
    return result;
  },
  1462101002: function (e) {
    var result = { _: `cdnConfig` };
    result.publicKeys = e.vector(e.object);
    return result;
  },
  3402727926: function (e) {
    var result = { _: `langPackString` };
    result.key = e.string();
    result.value = e.string();
    return result;
  },
  1816636575: function (e) {
    var result = { _: `langPackStringPluralized` };
    var t = e.uint();
    result.flags = t;
    result.key = e.string();
    if (t & 1) {
      result.zeroValue = e.string();
    }
    if (t & 2) {
      result.oneValue = e.string();
    }
    if (t & 4) {
      result.twoValue = e.string();
    }
    if (t & 8) {
      result.fewValue = e.string();
    }
    if (t & 16) {
      result.manyValue = e.string();
    }
    result.otherValue = e.string();
    return result;
  },
  695856818: function (e) {
    var result = { _: `langPackStringDeleted` };
    result.key = e.string();
    return result;
  },
  4085629430: function (e) {
    var result = { _: `langPackDifference` };
    result.langCode = e.string();
    result.fromVersion = e.int();
    result.version = e.int();
    result.strings = e.vector(e.object);
    return result;
  },
  4006239459: function (e) {
    var result = { _: `langPackLanguage` };
    var t = e.uint();
    result.flags = t;
    result.official = !!(t & 1);
    result.rtl = !!(t & 4);
    result.beta = !!(t & 8);
    result.name = e.string();
    result.nativeName = e.string();
    result.langCode = e.string();
    if (t & 2) {
      result.baseLangCode = e.string();
    }
    result.pluralCode = e.string();
    result.stringsCount = e.int();
    result.translatedCount = e.int();
    result.translationsUrl = e.string();
    return result;
  },
  3873421349: function (e) {
    var result = { _: `channelAdminLogEventActionChangeTitle` };
    result.prevValue = e.string();
    result.newValue = e.string();
    return result;
  },
  1427671598: function (e) {
    var result = { _: `channelAdminLogEventActionChangeAbout` };
    result.prevValue = e.string();
    result.newValue = e.string();
    return result;
  },
  1783299128: function (e) {
    var result = { _: `channelAdminLogEventActionChangeUsername` };
    result.prevValue = e.string();
    result.newValue = e.string();
    return result;
  },
  1129042607: function (e) {
    var result = { _: `channelAdminLogEventActionChangePhoto` };
    result.prevPhoto = e.object();
    result.newPhoto = e.object();
    return result;
  },
  460916654: function (e) {
    var result = { _: `channelAdminLogEventActionToggleInvites` };
    result.newValue = e.object();
    return result;
  },
  648939889: function (e) {
    var result = { _: `channelAdminLogEventActionToggleSignatures` };
    result.newValue = e.object();
    return result;
  },
  3924306968: function (e) {
    var result = { _: `channelAdminLogEventActionUpdatePinned` };
    result.message = e.object();
    return result;
  },
  1889215493: function (e) {
    var result = { _: `channelAdminLogEventActionEditMessage` };
    result.prevMessage = e.object();
    result.newMessage = e.object();
    return result;
  },
  1121994683: function (e) {
    var result = { _: `channelAdminLogEventActionDeleteMessage` };
    result.message = e.object();
    return result;
  },
  405815507: function (e) {
    var result = { _: `channelAdminLogEventActionParticipantJoin` };
    return result;
  },
  4170676210: function (e) {
    var result = { _: `channelAdminLogEventActionParticipantLeave` };
    return result;
  },
  3810276568: function (e) {
    var result = { _: `channelAdminLogEventActionParticipantInvite` };
    result.participant = e.object();
    return result;
  },
  3872931198: function (e) {
    var result = { _: `channelAdminLogEventActionParticipantToggleBan` };
    result.prevParticipant = e.object();
    result.newParticipant = e.object();
    return result;
  },
  3580323600: function (e) {
    var result = { _: `channelAdminLogEventActionParticipantToggleAdmin` };
    result.prevParticipant = e.object();
    result.newParticipant = e.object();
    return result;
  },
  2982398631: function (e) {
    var result = { _: `channelAdminLogEventActionChangeStickerSet` };
    result.prevStickerset = e.object();
    result.newStickerset = e.object();
    return result;
  },
  1599903217: function (e) {
    var result = { _: `channelAdminLogEventActionTogglePreHistoryHidden` };
    result.newValue = e.object();
    return result;
  },
  771095562: function (e) {
    var result = { _: `channelAdminLogEventActionDefaultBannedRights` };
    result.prevBannedRights = e.object();
    result.newBannedRights = e.object();
    return result;
  },
  2399639107: function (e) {
    var result = { _: `channelAdminLogEventActionStopPoll` };
    result.message = e.object();
    return result;
  },
  84703944: function (e) {
    var result = { _: `channelAdminLogEventActionChangeLinkedChat` };
    result.prevValue = e.long();
    result.newValue = e.long();
    return result;
  },
  241923758: function (e) {
    var result = { _: `channelAdminLogEventActionChangeLocation` };
    result.prevValue = e.object();
    result.newValue = e.object();
    return result;
  },
  1401984889: function (e) {
    var result = { _: `channelAdminLogEventActionToggleSlowMode` };
    result.prevValue = e.int();
    result.newValue = e.int();
    return result;
  },
  589338437: function (e) {
    var result = { _: `channelAdminLogEventActionStartGroupCall` };
    result.call = e.object();
    return result;
  },
  3684667712: function (e) {
    var result = { _: `channelAdminLogEventActionDiscardGroupCall` };
    result.call = e.object();
    return result;
  },
  4179895506: function (e) {
    var result = { _: `channelAdminLogEventActionParticipantMute` };
    result.participant = e.object();
    return result;
  },
  3863226816: function (e) {
    var result = { _: `channelAdminLogEventActionParticipantUnmute` };
    result.participant = e.object();
    return result;
  },
  1456906823: function (e) {
    var result = { _: `channelAdminLogEventActionToggleGroupCallSetting` };
    result.joinMuted = e.object();
    return result;
  },
  4271882584: function (e) {
    var result = { _: `channelAdminLogEventActionParticipantJoinByInvite` };
    var t = e.uint();
    result.flags = t;
    result.viaChatlist = !!(t & 1);
    result.invite = e.object();
    return result;
  },
  1515256996: function (e) {
    var result = { _: `channelAdminLogEventActionExportedInviteDelete` };
    result.invite = e.object();
    return result;
  },
  1091179342: function (e) {
    var result = { _: `channelAdminLogEventActionExportedInviteRevoke` };
    result.invite = e.object();
    return result;
  },
  3910056793: function (e) {
    var result = { _: `channelAdminLogEventActionExportedInviteEdit` };
    result.prevInvite = e.object();
    result.newInvite = e.object();
    return result;
  },
  1048537159: function (e) {
    var result = { _: `channelAdminLogEventActionParticipantVolume` };
    result.participant = e.object();
    return result;
  },
  1855199800: function (e) {
    var result = { _: `channelAdminLogEventActionChangeHistoryTTL` };
    result.prevValue = e.int();
    result.newValue = e.int();
    return result;
  },
  2947945546: function (e) {
    var result = { _: `channelAdminLogEventActionParticipantJoinByRequest` };
    result.invite = e.object();
    result.approvedBy = e.long();
    return result;
  },
  3408578406: function (e) {
    var result = { _: `channelAdminLogEventActionToggleNoForwards` };
    result.newValue = e.object();
    return result;
  },
  663693416: function (e) {
    var result = { _: `channelAdminLogEventActionSendMessage` };
    result.message = e.object();
    return result;
  },
  3192786680: function (e) {
    var result = { _: `channelAdminLogEventActionChangeAvailableReactions` };
    result.prevValue = e.object();
    result.newValue = e.object();
    return result;
  },
  4031755177: function (e) {
    var result = { _: `channelAdminLogEventActionChangeUsernames` };
    result.prevValue = e.vector(e.string);
    result.newValue = e.vector(e.string);
    return result;
  },
  46949251: function (e) {
    var result = { _: `channelAdminLogEventActionToggleForum` };
    result.newValue = e.object();
    return result;
  },
  1483767080: function (e) {
    var result = { _: `channelAdminLogEventActionCreateTopic` };
    result.topic = e.object();
    return result;
  },
  4033864200: function (e) {
    var result = { _: `channelAdminLogEventActionEditTopic` };
    result.prevTopic = e.object();
    result.newTopic = e.object();
    return result;
  },
  2920712457: function (e) {
    var result = { _: `channelAdminLogEventActionDeleteTopic` };
    result.topic = e.object();
    return result;
  },
  1569535291: function (e) {
    var result = { _: `channelAdminLogEventActionPinTopic` };
    var t = e.uint();
    result.flags = t;
    if (t & 1) {
      result.prevTopic = e.object();
    }
    if (t & 2) {
      result.newTopic = e.object();
    }
    return result;
  },
  1693675004: function (e) {
    var result = { _: `channelAdminLogEventActionToggleAntiSpam` };
    result.newValue = e.object();
    return result;
  },
  1469507456: function (e) {
    var result = { _: `channelAdminLogEventActionChangePeerColor` };
    result.prevValue = e.object();
    result.newValue = e.object();
    return result;
  },
  1581742885: function (e) {
    var result = { _: `channelAdminLogEventActionChangeProfilePeerColor` };
    result.prevValue = e.object();
    result.newValue = e.object();
    return result;
  },
  834362706: function (e) {
    var result = { _: `channelAdminLogEventActionChangeWallpaper` };
    result.prevValue = e.object();
    result.newValue = e.object();
    return result;
  },
  1051328177: function (e) {
    var result = { _: `channelAdminLogEventActionChangeEmojiStatus` };
    result.prevValue = e.object();
    result.newValue = e.object();
    return result;
  },
  1188577451: function (e) {
    var result = { _: `channelAdminLogEventActionChangeEmojiStickerSet` };
    result.prevStickerset = e.object();
    result.newStickerset = e.object();
    return result;
  },
  1621597305: function (e) {
    var result = { _: `channelAdminLogEventActionToggleSignatureProfiles` };
    result.newValue = e.object();
    return result;
  },
  1684286899: function (e) {
    var result = { _: `channelAdminLogEventActionParticipantSubExtend` };
    result.prevParticipant = e.object();
    result.newParticipant = e.object();
    return result;
  },
  3306682238: function (e) {
    var result = { _: `channelAdminLogEventActionToggleAutotranslation` };
    result.newValue = e.object();
    return result;
  },
  1476834540: function (e) {
    var result = { _: `channelAdminLogEventActionParticipantEditRank` };
    result.userId = e.long();
    result.prevRank = e.string();
    result.newRank = e.string();
    return result;
  },
  531458253: function (e) {
    var result = { _: `channelAdminLogEvent` };
    result.id = e.long();
    result.date = e.int();
    result.userId = e.long();
    result.action = e.object();
    return result;
  },
  3985307469: function (e) {
    var result = { _: `channels.adminLogResults` };
    result.events = e.vector(e.object);
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  3926948580: function (e) {
    var result = { _: `channelAdminLogEventsFilter` };
    var t = e.uint();
    result.flags = t;
    result.join = !!(t & 1);
    result.leave = !!(t & 2);
    result.invite = !!(t & 4);
    result.ban = !!(t & 8);
    result.unban = !!(t & 16);
    result.kick = !!(t & 32);
    result.unkick = !!(t & 64);
    result.promote = !!(t & 128);
    result.demote = !!(t & 256);
    result.info = !!(t & 512);
    result.settings = !!(t & 1024);
    result.pinned = !!(t & 2048);
    result.edit = !!(t & 4096);
    result.delete = !!(t & 8192);
    result.groupCall = !!(t & 16384);
    result.invites = !!(t & 32768);
    result.send = !!(t & 65536);
    result.forums = !!(t & 131072);
    result.subExtend = !!(t & 262144);
    result.editRank = !!(t & 524288);
    return result;
  },
  1558266229: function (e) {
    var result = { _: `popularContact` };
    result.clientId = e.long();
    result.importers = e.int();
    return result;
  },
  2660214483: function (e) {
    var result = { _: `messages.favedStickersNotModified` };
    return result;
  },
  750063767: function (e) {
    var result = { _: `messages.favedStickers` };
    result.hash = e.long();
    result.packs = e.vector(e.object);
    result.stickers = e.vector(e.object);
    return result;
  },
  1189204285: function (e) {
    var result = { _: `recentMeUrlUnknown` };
    result.url = e.string();
    return result;
  },
  3106671074: function (e) {
    var result = { _: `recentMeUrlUser` };
    result.url = e.string();
    result.userId = e.long();
    return result;
  },
  3000660434: function (e) {
    var result = { _: `recentMeUrlChat` };
    result.url = e.string();
    result.chatId = e.long();
    return result;
  },
  3947431965: function (e) {
    var result = { _: `recentMeUrlChatInvite` };
    result.url = e.string();
    result.chatInvite = e.object();
    return result;
  },
  3154794460: function (e) {
    var result = { _: `recentMeUrlStickerSet` };
    result.url = e.string();
    result.set = e.object();
    return result;
  },
  235081943: function (e) {
    var result = { _: `help.recentMeUrls` };
    result.urls = e.vector(e.object);
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  482797855: function (e) {
    var result = { _: `inputSingleMedia` };
    var t = e.uint();
    result.flags = t;
    result.media = e.object();
    result.randomId = e.long();
    result.message = e.string();
    if (t & 1) {
      result.entities = e.vector(e.object);
    }
    return result;
  },
  2801333330: function (e) {
    var result = { _: `webAuthorization` };
    result.hash = e.long();
    result.botId = e.long();
    result.domain = e.string();
    result.browser = e.string();
    result.platform = e.string();
    result.dateCreated = e.int();
    result.dateActive = e.int();
    result.ip = e.string();
    result.region = e.string();
    return result;
  },
  3981887996: function (e) {
    var result = { _: `account.webAuthorizations` };
    result.authorizations = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  2792792866: function (e) {
    var result = { _: `inputMessageID` };
    result.id = e.int();
    return result;
  },
  3134751637: function (e) {
    var result = { _: `inputMessageReplyTo` };
    result.id = e.int();
    return result;
  },
  2257003832: function (e) {
    var result = { _: `inputMessagePinned` };
    return result;
  },
  2902071934: function (e) {
    var result = { _: `inputMessageCallbackQuery` };
    result.id = e.int();
    result.queryId = e.long();
    return result;
  },
  4239064759: function (e) {
    var result = { _: `inputDialogPeer` };
    result.peer = e.object();
    return result;
  },
  1684014375: function (e) {
    var result = { _: `inputDialogPeerFolder` };
    result.folderId = e.int();
    return result;
  },
  1777300164: function (e) {
    var result = { _: `inputDialogPeerCommunity` };
    result.community = e.object();
    return result;
  },
  3849174789: function (e) {
    var result = { _: `dialogPeer` };
    result.peer = e.object();
    return result;
  },
  1363483106: function (e) {
    var result = { _: `dialogPeerFolder` };
    result.folderId = e.int();
    return result;
  },
  795199716: function (e) {
    var result = { _: `dialogPeerCommunity` };
    result.communityId = e.long();
    return result;
  },
  223655517: function (e) {
    var result = { _: `messages.foundStickerSetsNotModified` };
    return result;
  },
  2331024850: function (e) {
    var result = { _: `messages.foundStickerSets` };
    result.hash = e.long();
    result.sets = e.vector(e.object);
    return result;
  },
  4087022428: function (e) {
    var result = { _: `fileHash` };
    result.offset = e.long();
    result.limit = e.int();
    result.hash = e.bytes();
    return result;
  },
  1968737087: function (e) {
    var result = { _: `inputClientProxy` };
    result.address = e.string();
    result.port = e.int();
    return result;
  },
  3811614591: function (e) {
    var result = { _: `help.termsOfServiceUpdateEmpty` };
    result.expires = e.int();
    return result;
  },
  686618977: function (e) {
    var result = { _: `help.termsOfServiceUpdate` };
    result.expires = e.int();
    result.termsOfService = e.object();
    return result;
  },
  859091184: function (e) {
    var result = { _: `inputSecureFileUploaded` };
    result.id = e.long();
    result.parts = e.int();
    result.md5Checksum = e.string();
    result.fileHash = e.bytes();
    result.secret = e.bytes();
    return result;
  },
  1399317950: function (e) {
    var result = { _: `inputSecureFile` };
    result.id = e.long();
    result.accessHash = e.long();
    return result;
  },
  1679398724: function (e) {
    var result = { _: `secureFileEmpty` };
    return result;
  },
  2097791614: function (e) {
    var result = { _: `secureFile` };
    result.id = e.long();
    result.accessHash = e.long();
    result.size = e.long();
    result.dcId = e.int();
    result.date = e.int();
    result.fileHash = e.bytes();
    result.secret = e.bytes();
    return result;
  },
  2330640067: function (e) {
    var result = { _: `secureData` };
    result.data = e.bytes();
    result.dataHash = e.bytes();
    result.secret = e.bytes();
    return result;
  },
  2103482845: function (e) {
    var result = { _: `securePlainPhone` };
    result.phone = e.string();
    return result;
  },
  569137759: function (e) {
    var result = { _: `securePlainEmail` };
    result.email = e.string();
    return result;
  },
  2636808675: function (e) {
    var result = { _: `secureValueTypePersonalDetails` };
    return result;
  },
  1034709504: function (e) {
    var result = { _: `secureValueTypePassport` };
    return result;
  },
  115615172: function (e) {
    var result = { _: `secureValueTypeDriverLicense` };
    return result;
  },
  2698015819: function (e) {
    var result = { _: `secureValueTypeIdentityCard` };
    return result;
  },
  2577698595: function (e) {
    var result = { _: `secureValueTypeInternalPassport` };
    return result;
  },
  3420659238: function (e) {
    var result = { _: `secureValueTypeAddress` };
    return result;
  },
  4231435598: function (e) {
    var result = { _: `secureValueTypeUtilityBill` };
    return result;
  },
  2299755533: function (e) {
    var result = { _: `secureValueTypeBankStatement` };
    return result;
  },
  2340959368: function (e) {
    var result = { _: `secureValueTypeRentalAgreement` };
    return result;
  },
  2581823594: function (e) {
    var result = { _: `secureValueTypePassportRegistration` };
    return result;
  },
  3926060083: function (e) {
    var result = { _: `secureValueTypeTemporaryRegistration` };
    return result;
  },
  3005262555: function (e) {
    var result = { _: `secureValueTypePhone` };
    return result;
  },
  2386339822: function (e) {
    var result = { _: `secureValueTypeEmail` };
    return result;
  },
  411017418: function (e) {
    var result = { _: `secureValue` };
    var t = e.uint();
    result.flags = t;
    result.type = e.object();
    if (t & 1) {
      result.data = e.object();
    }
    if (t & 2) {
      result.frontSide = e.object();
    }
    if (t & 4) {
      result.reverseSide = e.object();
    }
    if (t & 8) {
      result.selfie = e.object();
    }
    if (t & 64) {
      result.translation = e.vector(e.object);
    }
    if (t & 16) {
      result.files = e.vector(e.object);
    }
    if (t & 32) {
      result.plainData = e.object();
    }
    result.hash = e.bytes();
    return result;
  },
  3676426407: function (e) {
    var result = { _: `inputSecureValue` };
    var t = e.uint();
    result.flags = t;
    result.type = e.object();
    if (t & 1) {
      result.data = e.object();
    }
    if (t & 2) {
      result.frontSide = e.object();
    }
    if (t & 4) {
      result.reverseSide = e.object();
    }
    if (t & 8) {
      result.selfie = e.object();
    }
    if (t & 64) {
      result.translation = e.vector(e.object);
    }
    if (t & 16) {
      result.files = e.vector(e.object);
    }
    if (t & 32) {
      result.plainData = e.object();
    }
    return result;
  },
  3978218928: function (e) {
    var result = { _: `secureValueHash` };
    result.type = e.object();
    result.hash = e.bytes();
    return result;
  },
  3903065049: function (e) {
    var result = { _: `secureValueErrorData` };
    result.type = e.object();
    result.dataHash = e.bytes();
    result.field = e.string();
    result.text = e.string();
    return result;
  },
  12467706: function (e) {
    var result = { _: `secureValueErrorFrontSide` };
    result.type = e.object();
    result.fileHash = e.bytes();
    result.text = e.string();
    return result;
  },
  2257201829: function (e) {
    var result = { _: `secureValueErrorReverseSide` };
    result.type = e.object();
    result.fileHash = e.bytes();
    result.text = e.string();
    return result;
  },
  3845639894: function (e) {
    var result = { _: `secureValueErrorSelfie` };
    result.type = e.object();
    result.fileHash = e.bytes();
    result.text = e.string();
    return result;
  },
  2054162547: function (e) {
    var result = { _: `secureValueErrorFile` };
    result.type = e.object();
    result.fileHash = e.bytes();
    result.text = e.string();
    return result;
  },
  1717706985: function (e) {
    var result = { _: `secureValueErrorFiles` };
    result.type = e.object();
    result.fileHash = e.vector(e.bytes);
    result.text = e.string();
    return result;
  },
  2258466191: function (e) {
    var result = { _: `secureValueError` };
    result.type = e.object();
    result.hash = e.bytes();
    result.text = e.string();
    return result;
  },
  2702460784: function (e) {
    var result = { _: `secureValueErrorTranslationFile` };
    result.type = e.object();
    result.fileHash = e.bytes();
    result.text = e.string();
    return result;
  },
  878931416: function (e) {
    var result = { _: `secureValueErrorTranslationFiles` };
    result.type = e.object();
    result.fileHash = e.vector(e.bytes);
    result.text = e.string();
    return result;
  },
  871426631: function (e) {
    var result = { _: `secureCredentialsEncrypted` };
    result.data = e.bytes();
    result.hash = e.bytes();
    result.secret = e.bytes();
    return result;
  },
  2905480408: function (e) {
    var result = { _: `account.authorizationForm` };
    var t = e.uint();
    result.flags = t;
    result.requiredTypes = e.vector(e.object);
    result.values = e.vector(e.object);
    result.errors = e.vector(e.object);
    result.users = e.vector(e.object);
    if (t & 1) {
      result.privacyPolicyUrl = e.string();
    }
    return result;
  },
  2166326607: function (e) {
    var result = { _: `account.sentEmailCode` };
    result.emailPattern = e.string();
    result.length = e.int();
    return result;
  },
  1722786150: function (e) {
    var result = { _: `help.deepLinkInfoEmpty` };
    return result;
  },
  1783556146: function (e) {
    var result = { _: `help.deepLinkInfo` };
    var t = e.uint();
    result.flags = t;
    result.updateApp = !!(t & 1);
    result.message = e.string();
    if (t & 2) {
      result.entities = e.vector(e.object);
    }
    return result;
  },
  289586518: function (e) {
    var result = { _: `savedPhoneContact` };
    result.phone = e.string();
    result.firstName = e.string();
    result.lastName = e.string();
    result.date = e.int();
    return result;
  },
  1304052993: function (e) {
    var result = { _: `account.takeout` };
    result.id = e.long();
    return result;
  },
  3562713238: function (e) {
    var result = { _: `passwordKdfAlgoUnknown` };
    return result;
  },
  982592842: function (e) {
    var result = { _: `passwordKdfAlgoSHA256SHA256PBKDF2HMACSHA512iter100000SHA256ModPow` };
    result.salt1 = e.bytes();
    result.salt2 = e.bytes();
    result.g = e.int();
    result.p = e.bytes();
    return result;
  },
  4883767: function (e) {
    var result = { _: `securePasswordKdfAlgoUnknown` };
    return result;
  },
  3153255840: function (e) {
    var result = { _: `securePasswordKdfAlgoPBKDF2HMACSHA512iter100000` };
    result.salt = e.bytes();
    return result;
  },
  2252807570: function (e) {
    var result = { _: `securePasswordKdfAlgoSHA512` };
    result.salt = e.bytes();
    return result;
  },
  354925740: function (e) {
    var result = { _: `secureSecretSettings` };
    result.secureAlgo = e.object();
    result.secureSecret = e.bytes();
    result.secureSecretId = e.long();
    return result;
  },
  2558588504: function (e) {
    var result = { _: `inputCheckPasswordEmpty` };
    return result;
  },
  3531600002: function (e) {
    var result = { _: `inputCheckPasswordSRP` };
    result.srpId = e.long();
    result.A = e.bytes();
    result.M1 = e.bytes();
    return result;
  },
  2191366618: function (e) {
    var result = { _: `secureRequiredType` };
    var t = e.uint();
    result.flags = t;
    result.nativeNames = !!(t & 1);
    result.selfieRequired = !!(t & 2);
    result.translationRequired = !!(t & 4);
    result.type = e.object();
    return result;
  },
  41187252: function (e) {
    var result = { _: `secureRequiredTypeOneOf` };
    result.types = e.vector(e.object);
    return result;
  },
  3216634967: function (e) {
    var result = { _: `help.passportConfigNotModified` };
    return result;
  },
  2694370991: function (e) {
    var result = { _: `help.passportConfig` };
    result.hash = e.int();
    result.countriesLangs = e.object();
    return result;
  },
  488313413: function (e) {
    var result = { _: `inputAppEvent` };
    result.time = e.double();
    result.type = e.string();
    result.peer = e.long();
    result.data = e.object();
    return result;
  },
  3235781593: function (e) {
    var result = { _: `jsonObjectValue` };
    result.key = e.string();
    result.value = e.object();
    return result;
  },
  1064139624: function (e) {
    var result = { _: `jsonNull` };
    return result;
  },
  3342098026: function (e) {
    var result = { _: `jsonBool` };
    result.value = e.object();
    return result;
  },
  736157604: function (e) {
    var result = { _: `jsonNumber` };
    result.value = e.double();
    return result;
  },
  3072226938: function (e) {
    var result = { _: `jsonString` };
    result.value = e.string();
    return result;
  },
  4148447075: function (e) {
    var result = { _: `jsonArray` };
    result.value = e.vector(e.object);
    return result;
  },
  2579616925: function (e) {
    var result = { _: `jsonObject` };
    result.value = e.vector(e.object);
    return result;
  },
  878078826: function (e) {
    var result = { _: `pageTableCell` };
    var t = e.uint();
    result.flags = t;
    result.header = !!(t & 1);
    result.alignCenter = !!(t & 8);
    result.alignRight = !!(t & 16);
    result.valignMiddle = !!(t & 32);
    result.valignBottom = !!(t & 64);
    if (t & 128) {
      result.text = e.object();
    }
    if (t & 2) {
      result.colspan = e.int();
    }
    if (t & 4) {
      result.rowspan = e.int();
    }
    return result;
  },
  3770729957: function (e) {
    var result = { _: `pageTableRow` };
    result.cells = e.vector(e.object);
    return result;
  },
  1869903447: function (e) {
    var result = { _: `pageCaption` };
    result.text = e.object();
    result.credit = e.object();
    return result;
  },
  794323004: function (e) {
    var result = { _: `pageListItemText` };
    var t = e.uint();
    result.flags = t;
    result.checkbox = !!(t & 1);
    result.checked = !!(t & 2);
    result.text = e.object();
    return result;
  },
  1674209194: function (e) {
    var result = { _: `pageListItemBlocks` };
    var t = e.uint();
    result.flags = t;
    result.checkbox = !!(t & 1);
    result.checked = !!(t & 2);
    result.blocks = e.vector(e.object);
    return result;
  },
  352522633: function (e) {
    var result = { _: `pageListOrderedItemText` };
    var t = e.uint();
    result.flags = t;
    result.checkbox = !!(t & 1);
    result.checked = !!(t & 2);
    if (t & 4) {
      result.num = e.string();
    }
    result.text = e.object();
    if (t & 8) {
      result.value = e.int();
    }
    if (t & 16) {
      result.type = e.string();
    }
    return result;
  },
  2415056368: function (e) {
    var result = { _: `pageListOrderedItemBlocks` };
    var t = e.uint();
    result.flags = t;
    result.checkbox = !!(t & 1);
    result.checked = !!(t & 2);
    if (t & 4) {
      result.num = e.string();
    }
    result.blocks = e.vector(e.object);
    if (t & 8) {
      result.value = e.int();
    }
    if (t & 16) {
      result.type = e.string();
    }
    return result;
  },
  3012615176: function (e) {
    var result = { _: `pageRelatedArticle` };
    var t = e.uint();
    result.flags = t;
    result.url = e.string();
    result.webpageId = e.long();
    if (t & 1) {
      result.title = e.string();
    }
    if (t & 2) {
      result.description = e.string();
    }
    if (t & 4) {
      result.photoId = e.long();
    }
    if (t & 8) {
      result.author = e.string();
    }
    if (t & 16) {
      result.publishedDate = e.int();
    }
    return result;
  },
  2556788493: function (e) {
    var result = { _: `page` };
    var t = e.uint();
    result.flags = t;
    result.part = !!(t & 1);
    result.rtl = !!(t & 2);
    result.v2 = !!(t & 4);
    result.url = e.string();
    result.blocks = e.vector(e.object);
    result.photos = e.vector(e.object);
    result.documents = e.vector(e.object);
    if (t & 8) {
      result.views = e.int();
    }
    return result;
  },
  2349199817: function (e) {
    var result = { _: `help.supportName` };
    result.name = e.string();
    return result;
  },
  4088278765: function (e) {
    var result = { _: `help.userInfoEmpty` };
    return result;
  },
  32192344: function (e) {
    var result = { _: `help.userInfo` };
    result.message = e.string();
    result.entities = e.vector(e.object);
    result.author = e.string();
    result.date = e.int();
    return result;
  },
  1266514026: function (e) {
    var result = { _: `pollAnswer` };
    var t = e.uint();
    result.flags = t;
    result.text = e.object();
    result.option = e.bytes();
    if (t & 1) {
      result.media = e.object();
    }
    if (t & 2) {
      result.addedBy = e.object();
    }
    if (t & 2) {
      result.date = e.int();
    }
    return result;
  },
  429911446: function (e) {
    var result = { _: `inputPollAnswer` };
    var t = e.uint();
    result.flags = t;
    result.text = e.object();
    if (t & 1) {
      result.media = e.object();
    }
    return result;
  },
  2523803071: function (e) {
    var result = { _: `poll` };
    result.id = e.long();
    var t = e.uint();
    result.flags = t;
    result.closed = !!(t & 1);
    result.publicVoters = !!(t & 2);
    result.multipleChoice = !!(t & 4);
    result.quiz = !!(t & 8);
    result.openAnswers = !!(t & 64);
    result.revotingDisabled = !!(t & 128);
    result.shuffleAnswers = !!(t & 256);
    result.hideResultsUntilClose = !!(t & 512);
    result.creator = !!(t & 1024);
    result.subscribersOnly = !!(t & 2048);
    result.question = e.object();
    result.answers = e.vector(e.object);
    if (t & 16) {
      result.closePeriod = e.int();
    }
    if (t & 32) {
      result.closeDate = e.int();
    }
    if (t & 4096) {
      result.countriesIso2 = e.vector(e.string);
    }
    result.hash = e.long();
    return result;
  },
  910500618: function (e) {
    var result = { _: `pollAnswerVoters` };
    var t = e.uint();
    result.flags = t;
    result.chosen = !!(t & 1);
    result.correct = !!(t & 2);
    result.option = e.bytes();
    if (t & 4) {
      result.voters = e.int();
    }
    if (t & 4) {
      result.recentVoters = e.vector(e.object);
    }
    return result;
  },
  3128668510: function (e) {
    var result = { _: `pollResults` };
    var t = e.uint();
    result.flags = t;
    result.min = !!(t & 1);
    result.hasUnreadVotes = !!(t & 64);
    result.canViewStats = !!(t & 128);
    if (t & 2) {
      result.results = e.vector(e.object);
    }
    if (t & 4) {
      result.totalVoters = e.int();
    }
    if (t & 8) {
      result.recentVoters = e.vector(e.object);
    }
    if (t & 16) {
      result.solution = e.string();
    }
    if (t & 16) {
      result.solutionEntities = e.vector(e.object);
    }
    if (t & 32) {
      result.solutionMedia = e.object();
    }
    return result;
  },
  4030849616: function (e) {
    var result = { _: `chatOnlines` };
    result.onlines = e.int();
    return result;
  },
  1202287072: function (e) {
    var result = { _: `statsURL` };
    result.url = e.string();
    return result;
  },
  1605510357: function (e) {
    var result = { _: `chatAdminRights` };
    var t = e.uint();
    result.flags = t;
    result.changeInfo = !!(t & 1);
    result.postMessages = !!(t & 2);
    result.editMessages = !!(t & 4);
    result.deleteMessages = !!(t & 8);
    result.banUsers = !!(t & 16);
    result.inviteUsers = !!(t & 32);
    result.pinMessages = !!(t & 128);
    result.addAdmins = !!(t & 512);
    result.anonymous = !!(t & 1024);
    result.manageCall = !!(t & 2048);
    result.other = !!(t & 4096);
    result.manageTopics = !!(t & 8192);
    result.postStories = !!(t & 16384);
    result.editStories = !!(t & 32768);
    result.deleteStories = !!(t & 65536);
    result.manageDirectMessages = !!(t & 131072);
    result.manageRanks = !!(t & 262144);
    result.manageLinkedPeers = !!(t & 524288);
    result.manageWelcomeMessages = !!(t & 1048576);
    return result;
  },
  2668758040: function (e) {
    var result = { _: `chatBannedRights` };
    var t = e.uint();
    result.flags = t;
    result.viewMessages = !!(t & 1);
    result.sendMessages = !!(t & 2);
    result.sendMedia = !!(t & 4);
    result.sendStickers = !!(t & 8);
    result.sendGifs = !!(t & 16);
    result.sendGames = !!(t & 32);
    result.sendInline = !!(t & 64);
    result.embedLinks = !!(t & 128);
    result.sendPolls = !!(t & 256);
    result.changeInfo = !!(t & 1024);
    result.inviteUsers = !!(t & 32768);
    result.pinMessages = !!(t & 131072);
    result.manageTopics = !!(t & 262144);
    result.sendPhotos = !!(t & 524288);
    result.sendVideos = !!(t & 1048576);
    result.sendRoundvideos = !!(t & 2097152);
    result.sendAudios = !!(t & 4194304);
    result.sendVoices = !!(t & 8388608);
    result.sendDocs = !!(t & 16777216);
    result.sendPlain = !!(t & 33554432);
    result.editRank = !!(t & 67108864);
    result.sendReactions = !!(t & 134217728);
    result.manageLinkedPeers = !!(t & 268435456);
    result.untilDate = e.int();
    return result;
  },
  3861952889: function (e) {
    var result = { _: `inputWallPaper` };
    result.id = e.long();
    result.accessHash = e.long();
    return result;
  },
  1913199744: function (e) {
    var result = { _: `inputWallPaperSlug` };
    result.slug = e.string();
    return result;
  },
  2524595758: function (e) {
    var result = { _: `inputWallPaperNoFile` };
    result.id = e.long();
    return result;
  },
  471437699: function (e) {
    var result = { _: `account.wallPapersNotModified` };
    return result;
  },
  3452142988: function (e) {
    var result = { _: `account.wallPapers` };
    result.hash = e.long();
    result.wallpapers = e.vector(e.object);
    return result;
  },
  2904898936: function (e) {
    var result = { _: `codeSettings` };
    var t = e.uint();
    result.flags = t;
    result.allowFlashcall = !!(t & 1);
    result.currentNumber = !!(t & 2);
    result.allowAppHash = !!(t & 16);
    result.allowMissedCall = !!(t & 32);
    result.allowFirebase = !!(t & 128);
    result.unknownNumber = !!(t & 512);
    if (t & 64) {
      result.logoutTokens = e.vector(e.bytes);
    }
    if (t & 256) {
      result.token = e.string();
    }
    if (t & 256) {
      result.appSandbox = e.object();
    }
    return result;
  },
  925826256: function (e) {
    var result = { _: `wallPaperSettings` };
    var t = e.uint();
    result.flags = t;
    result.blur = !!(t & 2);
    result.motion = !!(t & 4);
    if (t & 1) {
      result.backgroundColor = e.int();
    }
    if (t & 16) {
      result.secondBackgroundColor = e.int();
    }
    if (t & 32) {
      result.thirdBackgroundColor = e.int();
    }
    if (t & 64) {
      result.fourthBackgroundColor = e.int();
    }
    if (t & 8) {
      result.intensity = e.int();
    }
    if (t & 16) {
      result.rotation = e.int();
    }
    if (t & 128) {
      result.emoticon = e.string();
    }
    return result;
  },
  3131405864: function (e) {
    var result = { _: `autoDownloadSettings` };
    var t = e.uint();
    result.flags = t;
    result.disabled = !!(t & 1);
    result.videoPreloadLarge = !!(t & 2);
    result.audioPreloadNext = !!(t & 4);
    result.phonecallsLessData = !!(t & 8);
    result.storiesPreload = !!(t & 16);
    result.photoSizeMax = e.int();
    result.videoSizeMax = e.long();
    result.fileSizeMax = e.long();
    result.videoUploadMaxbitrate = e.int();
    result.smallQueueActiveOperationsMax = e.int();
    result.largeQueueActiveOperationsMax = e.int();
    return result;
  },
  1674235686: function (e) {
    var result = { _: `account.autoDownloadSettings` };
    result.low = e.object();
    result.medium = e.object();
    result.high = e.object();
    return result;
  },
  3585325561: function (e) {
    var result = { _: `emojiKeyword` };
    result.keyword = e.string();
    result.emoticons = e.vector(e.string);
    return result;
  },
  594408994: function (e) {
    var result = { _: `emojiKeywordDeleted` };
    result.keyword = e.string();
    result.emoticons = e.vector(e.string);
    return result;
  },
  1556570557: function (e) {
    var result = { _: `emojiKeywordsDifference` };
    result.langCode = e.string();
    result.fromVersion = e.int();
    result.version = e.int();
    result.keywords = e.vector(e.object);
    return result;
  },
  2775937949: function (e) {
    var result = { _: `emojiURL` };
    result.url = e.string();
    return result;
  },
  3019592545: function (e) {
    var result = { _: `emojiLanguage` };
    result.langCode = e.string();
    return result;
  },
  4283715173: function (e) {
    var result = { _: `folder` };
    var t = e.uint();
    result.flags = t;
    result.autofillNewBroadcasts = !!(t & 1);
    result.autofillPublicGroups = !!(t & 2);
    result.autofillNewCorrespondents = !!(t & 4);
    result.id = e.int();
    result.title = e.string();
    if (t & 8) {
      result.photo = e.object();
    }
    return result;
  },
  4224893590: function (e) {
    var result = { _: `inputFolderPeer` };
    result.peer = e.object();
    result.folderId = e.int();
    return result;
  },
  3921323624: function (e) {
    var result = { _: `folderPeer` };
    result.peer = e.object();
    result.folderId = e.int();
    return result;
  },
  3896830975: function (e) {
    var result = { _: `messages.searchCounter` };
    var t = e.uint();
    result.flags = t;
    result.inexact = !!(t & 2);
    result.filter = e.object();
    result.count = e.int();
    return result;
  },
  1020666860: function (e) {
    var result = { _: `urlAuthResultRequest` };
    var t = e.uint();
    result.flags = t;
    result.requestWriteAccess = !!(t & 1);
    result.requestPhoneNumber = !!(t & 2);
    result.matchCodesFirst = !!(t & 32);
    result.isApp = !!(t & 64);
    result.bot = e.object();
    result.domain = e.string();
    if (t & 4) {
      result.browser = e.string();
    }
    if (t & 4) {
      result.platform = e.string();
    }
    if (t & 4) {
      result.ip = e.string();
    }
    if (t & 4) {
      result.region = e.string();
    }
    if (t & 8) {
      result.matchCodes = e.vector(e.string);
    }
    if (t & 16) {
      result.userIdHint = e.long();
    }
    if (t & 128) {
      result.verifiedAppName = e.string();
    }
    return result;
  },
  1648005024: function (e) {
    var result = { _: `urlAuthResultAccepted` };
    var t = e.uint();
    result.flags = t;
    if (t & 1) {
      result.url = e.string();
    }
    return result;
  },
  2849430303: function (e) {
    var result = { _: `urlAuthResultDefault` };
    return result;
  },
  3216354699: function (e) {
    var result = { _: `channelLocationEmpty` };
    return result;
  },
  547062491: function (e) {
    var result = { _: `channelLocation` };
    result.geoPoint = e.object();
    result.address = e.string();
    return result;
  },
  3393592157: function (e) {
    var result = { _: `peerLocated` };
    result.peer = e.object();
    result.expires = e.int();
    result.distance = e.int();
    return result;
  },
  4176226379: function (e) {
    var result = { _: `peerSelfLocated` };
    result.expires = e.int();
    return result;
  },
  3497176244: function (e) {
    var result = { _: `restrictionReason` };
    result.platform = e.string();
    result.reason = e.string();
    result.text = e.string();
    return result;
  },
  1012306921: function (e) {
    var result = { _: `inputTheme` };
    result.id = e.long();
    result.accessHash = e.long();
    return result;
  },
  4119399921: function (e) {
    var result = { _: `inputThemeSlug` };
    result.slug = e.string();
    return result;
  },
  2685298646: function (e) {
    var result = { _: `theme` };
    var t = e.uint();
    result.flags = t;
    result.creator = !!(t & 1);
    result.default = !!(t & 2);
    result.forChat = !!(t & 32);
    result.id = e.long();
    result.accessHash = e.long();
    result.slug = e.string();
    result.title = e.string();
    if (t & 4) {
      result.document = e.object();
    }
    if (t & 8) {
      result.settings = e.vector(e.object);
    }
    if (t & 64) {
      result.emoticon = e.string();
    }
    if (t & 16) {
      result.installsCount = e.int();
    }
    return result;
  },
  4095653410: function (e) {
    var result = { _: `account.themesNotModified` };
    return result;
  },
  2587724909: function (e) {
    var result = { _: `account.themes` };
    result.hash = e.long();
    result.themes = e.vector(e.object);
    return result;
  },
  1654593920: function (e) {
    var result = { _: `auth.loginToken` };
    result.expires = e.int();
    result.token = e.bytes();
    return result;
  },
  110008598: function (e) {
    var result = { _: `auth.loginTokenMigrateTo` };
    result.dcId = e.int();
    result.token = e.bytes();
    return result;
  },
  957176926: function (e) {
    var result = { _: `auth.loginTokenSuccess` };
    result.authorization = e.object();
    return result;
  },
  1474462241: function (e) {
    var result = { _: `account.contentSettings` };
    var t = e.uint();
    result.flags = t;
    result.sensitiveEnabled = !!(t & 1);
    result.sensitiveCanChange = !!(t & 2);
    return result;
  },
  2837970629: function (e) {
    var result = { _: `messages.inactiveChats` };
    result.dates = e.vector(e.int);
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  3282117730: function (e) {
    var result = { _: `baseThemeClassic` };
    return result;
  },
  4225242760: function (e) {
    var result = { _: `baseThemeDay` };
    return result;
  },
  3081969320: function (e) {
    var result = { _: `baseThemeNight` };
    return result;
  },
  1834973166: function (e) {
    var result = { _: `baseThemeTinted` };
    return result;
  },
  1527845466: function (e) {
    var result = { _: `baseThemeArctic` };
    return result;
  },
  2413711439: function (e) {
    var result = { _: `inputThemeSettings` };
    var t = e.uint();
    result.flags = t;
    result.messageColorsAnimated = !!(t & 4);
    result.baseTheme = e.object();
    result.accentColor = e.int();
    if (t & 8) {
      result.outboxAccentColor = e.int();
    }
    if (t & 1) {
      result.messageColors = e.vector(e.int);
    }
    if (t & 2) {
      result.wallpaper = e.object();
    }
    if (t & 2) {
      result.wallpaperSettings = e.object();
    }
    return result;
  },
  4200117972: function (e) {
    var result = { _: `themeSettings` };
    var t = e.uint();
    result.flags = t;
    result.messageColorsAnimated = !!(t & 4);
    result.baseTheme = e.object();
    result.accentColor = e.int();
    if (t & 8) {
      result.outboxAccentColor = e.int();
    }
    if (t & 1) {
      result.messageColors = e.vector(e.int);
    }
    if (t & 2) {
      result.wallpaper = e.object();
    }
    return result;
  },
  1421174295: function (e) {
    var result = { _: `webPageAttributeTheme` };
    var t = e.uint();
    result.flags = t;
    if (t & 1) {
      result.documents = e.vector(e.object);
    }
    if (t & 2) {
      result.settings = e.object();
    }
    return result;
  },
  781501415: function (e) {
    var result = { _: `webPageAttributeStory` };
    var t = e.uint();
    result.flags = t;
    result.peer = e.object();
    result.id = e.int();
    if (t & 1) {
      result.story = e.object();
    }
    return result;
  },
  1355547603: function (e) {
    var result = { _: `webPageAttributeStickerSet` };
    var t = e.uint();
    result.flags = t;
    result.emojis = !!(t & 1);
    result.textColor = !!(t & 2);
    result.stickers = e.vector(e.object);
    return result;
  },
  3480186296: function (e) {
    var result = { _: `webPageAttributeUniqueStarGift` };
    result.gift = e.object();
    return result;
  },
  835375875: function (e) {
    var result = { _: `webPageAttributeStarGiftCollection` };
    result.icons = e.vector(e.object);
    return result;
  },
  29770178: function (e) {
    var result = { _: `webPageAttributeStarGiftAuction` };
    result.gift = e.object();
    result.endDate = e.int();
    return result;
  },
  2005007896: function (e) {
    var result = { _: `webPageAttributeAiComposeTone` };
    result.emojiId = e.long();
    return result;
  },
  1218005070: function (e) {
    var result = { _: `messages.votesList` };
    var t = e.uint();
    result.flags = t;
    result.count = e.int();
    result.votes = e.vector(e.object);
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    if (t & 1) {
      result.nextOffset = e.string();
    }
    return result;
  },
  4117234314: function (e) {
    var result = { _: `bankCardOpenUrl` };
    result.url = e.string();
    result.name = e.string();
    return result;
  },
  1042605427: function (e) {
    var result = { _: `payments.bankCardData` };
    result.title = e.string();
    result.openUrls = e.vector(e.object);
    return result;
  },
  2856789585: function (e) {
    var result = { _: `dialogFilter` };
    var t = e.uint();
    result.flags = t;
    result.contacts = !!(t & 1);
    result.nonContacts = !!(t & 2);
    result.groups = !!(t & 4);
    result.broadcasts = !!(t & 8);
    result.bots = !!(t & 16);
    result.excludeMuted = !!(t & 2048);
    result.excludeRead = !!(t & 4096);
    result.excludeArchived = !!(t & 8192);
    result.titleNoanimate = !!(t & 268435456);
    result.id = e.int();
    result.title = e.object();
    if (t & 33554432) {
      result.emoticon = e.string();
    }
    if (t & 134217728) {
      result.color = e.int();
    }
    result.pinnedPeers = e.vector(e.object);
    result.includePeers = e.vector(e.object);
    result.excludePeers = e.vector(e.object);
    return result;
  },
  909284270: function (e) {
    var result = { _: `dialogFilterDefault` };
    return result;
  },
  2522053591: function (e) {
    var result = { _: `dialogFilterChatlist` };
    var t = e.uint();
    result.flags = t;
    result.hasMyInvites = !!(t & 67108864);
    result.titleNoanimate = !!(t & 268435456);
    result.id = e.int();
    result.title = e.object();
    if (t & 33554432) {
      result.emoticon = e.string();
    }
    if (t & 134217728) {
      result.color = e.int();
    }
    result.pinnedPeers = e.vector(e.object);
    result.includePeers = e.vector(e.object);
    return result;
  },
  2004110666: function (e) {
    var result = { _: `dialogFilterSuggested` };
    result.filter = e.object();
    result.description = e.string();
    return result;
  },
  3057118639: function (e) {
    var result = { _: `statsDateRangeDays` };
    result.minDate = e.int();
    result.maxDate = e.int();
    return result;
  },
  3410210014: function (e) {
    var result = { _: `statsAbsValueAndPrev` };
    result.current = e.double();
    result.previous = e.double();
    return result;
  },
  3419287520: function (e) {
    var result = { _: `statsPercentValue` };
    result.part = e.double();
    result.total = e.double();
    return result;
  },
  1244130093: function (e) {
    var result = { _: `statsGraphAsync` };
    result.token = e.string();
    return result;
  },
  3202127906: function (e) {
    var result = { _: `statsGraphError` };
    result.error = e.string();
    return result;
  },
  2393138358: function (e) {
    var result = { _: `statsGraph` };
    var t = e.uint();
    result.flags = t;
    result.json = e.object();
    if (t & 1) {
      result.zoomToken = e.string();
    }
    return result;
  },
  963421692: function (e) {
    var result = { _: `stats.broadcastStats` };
    result.period = e.object();
    result.followers = e.object();
    result.viewsPerPost = e.object();
    result.sharesPerPost = e.object();
    result.reactionsPerPost = e.object();
    result.viewsPerStory = e.object();
    result.sharesPerStory = e.object();
    result.reactionsPerStory = e.object();
    result.enabledNotifications = e.object();
    result.growthGraph = e.object();
    result.followersGraph = e.object();
    result.muteGraph = e.object();
    result.topHoursGraph = e.object();
    result.interactionsGraph = e.object();
    result.ivInteractionsGraph = e.object();
    result.viewsBySourceGraph = e.object();
    result.newFollowersBySourceGraph = e.object();
    result.languagesGraph = e.object();
    result.reactionsByEmotionGraph = e.object();
    result.storyInteractionsGraph = e.object();
    result.storyReactionsByEmotionGraph = e.object();
    result.recentPostsInteractions = e.vector(e.object);
    return result;
  },
  2566302837: function (e) {
    var result = { _: `help.promoDataEmpty` };
    result.expires = e.int();
    return result;
  },
  145021050: function (e) {
    var result = { _: `help.promoData` };
    var t = e.uint();
    result.flags = t;
    result.proxy = !!(t & 1);
    result.expires = e.int();
    if (t & 8) {
      result.peer = e.object();
    }
    if (t & 2) {
      result.psaType = e.string();
    }
    if (t & 4) {
      result.psaMessage = e.string();
    }
    result.pendingSuggestions = e.vector(e.string);
    result.dismissedSuggestions = e.vector(e.string);
    if (t & 16) {
      result.customPendingSuggestion = e.object();
    }
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  3727929492: function (e) {
    var result = { _: `videoSize` };
    var t = e.uint();
    result.flags = t;
    result.type = e.string();
    result.w = e.int();
    result.h = e.int();
    result.size = e.int();
    if (t & 1) {
      result.videoStartTs = e.double();
    }
    return result;
  },
  4166795580: function (e) {
    var result = { _: `videoSizeEmojiMarkup` };
    result.emojiId = e.long();
    result.backgroundColors = e.vector(e.int);
    return result;
  },
  228623102: function (e) {
    var result = { _: `videoSizeStickerMarkup` };
    result.stickerset = e.object();
    result.stickerId = e.long();
    result.backgroundColors = e.vector(e.int);
    return result;
  },
  2634330011: function (e) {
    var result = { _: `statsGroupTopPoster` };
    result.userId = e.long();
    result.messages = e.int();
    result.avgChars = e.int();
    return result;
  },
  3612888199: function (e) {
    var result = { _: `statsGroupTopAdmin` };
    result.userId = e.long();
    result.deleted = e.int();
    result.kicked = e.int();
    result.banned = e.int();
    return result;
  },
  1398765469: function (e) {
    var result = { _: `statsGroupTopInviter` };
    result.userId = e.long();
    result.invitations = e.int();
    return result;
  },
  4018141462: function (e) {
    var result = { _: `stats.megagroupStats` };
    result.period = e.object();
    result.members = e.object();
    result.messages = e.object();
    result.viewers = e.object();
    result.posters = e.object();
    result.growthGraph = e.object();
    result.membersGraph = e.object();
    result.newMembersBySourceGraph = e.object();
    result.languagesGraph = e.object();
    result.messagesGraph = e.object();
    result.actionsGraph = e.object();
    result.topHoursGraph = e.object();
    result.weekdaysGraph = e.object();
    result.topPosters = e.vector(e.object);
    result.topAdmins = e.vector(e.object);
    result.topInviters = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  4265718607: function (e) {
    var result = { _: `globalPrivacySettings` };
    var t = e.uint();
    result.flags = t;
    result.archiveAndMuteNewNoncontactPeers = !!(t & 1);
    result.keepArchivedUnmuted = !!(t & 2);
    result.keepArchivedFolders = !!(t & 4);
    result.hideReadMarks = !!(t & 8);
    result.newNoncontactPeersRequirePremium = !!(t & 16);
    result.displayGiftsButton = !!(t & 128);
    if (t & 32) {
      result.noncontactPeersPaidStars = e.long();
    }
    if (t & 64) {
      result.disallowedGifts = e.object();
    }
    return result;
  },
  1107543535: function (e) {
    var result = { _: `help.countryCode` };
    var t = e.uint();
    result.flags = t;
    result.countryCode = e.string();
    if (t & 1) {
      result.prefixes = e.vector(e.string);
    }
    if (t & 2) {
      result.patterns = e.vector(e.string);
    }
    return result;
  },
  3280440867: function (e) {
    var result = { _: `help.country` };
    var t = e.uint();
    result.flags = t;
    result.hidden = !!(t & 1);
    result.iso2 = e.string();
    result.defaultName = e.string();
    if (t & 2) {
      result.name = e.string();
    }
    result.countryCodes = e.vector(e.object);
    return result;
  },
  2479628082: function (e) {
    var result = { _: `help.countriesListNotModified` };
    return result;
  },
  2278585758: function (e) {
    var result = { _: `help.countriesList` };
    result.countries = e.vector(e.object);
    result.hash = e.int();
    return result;
  },
  1163625789: function (e) {
    var result = { _: `messageViews` };
    var t = e.uint();
    result.flags = t;
    if (t & 1) {
      result.views = e.int();
    }
    if (t & 2) {
      result.forwards = e.int();
    }
    if (t & 4) {
      result.replies = e.object();
    }
    return result;
  },
  3066361155: function (e) {
    var result = { _: `messages.messageViews` };
    result.views = e.vector(e.object);
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  2788431746: function (e) {
    var result = { _: `messages.discussionMessage` };
    var t = e.uint();
    result.flags = t;
    result.messages = e.vector(e.object);
    if (t & 1) {
      result.maxId = e.int();
    }
    if (t & 2) {
      result.readInboxMaxId = e.int();
    }
    if (t & 4) {
      result.readOutboxMaxId = e.int();
    }
    result.unreadCount = e.int();
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  462937446: function (e) {
    var result = { _: `messageReplyHeader` };
    var t = e.uint();
    result.flags = t;
    result.replyToScheduled = !!(t & 4);
    result.forumTopic = !!(t & 8);
    result.quote = !!(t & 512);
    result.replyToEphemeral = !!(t & 8192);
    if (t & 16) {
      result.replyToMsgId = e.int();
    }
    if (t & 1) {
      result.replyToPeerId = e.object();
    }
    if (t & 32) {
      result.replyFrom = e.object();
    }
    if (t & 256) {
      result.replyMedia = e.object();
    }
    if (t & 2) {
      result.replyToTopId = e.int();
    }
    if (t & 64) {
      result.quoteText = e.string();
    }
    if (t & 128) {
      result.quoteEntities = e.vector(e.object);
    }
    if (t & 1024) {
      result.quoteOffset = e.int();
    }
    if (t & 2048) {
      result.todoItemId = e.int();
    }
    if (t & 4096) {
      result.pollOption = e.bytes();
    }
    return result;
  },
  240843065: function (e) {
    var result = { _: `messageReplyStoryHeader` };
    result.peer = e.object();
    result.storyId = e.int();
    return result;
  },
  2211844034: function (e) {
    var result = { _: `messageReplies` };
    var t = e.uint();
    result.flags = t;
    result.comments = !!(t & 1);
    result.replies = e.int();
    result.repliesPts = e.int();
    if (t & 2) {
      result.recentRepliers = e.vector(e.object);
    }
    if (t & 1) {
      result.channelId = e.long();
    }
    if (t & 4) {
      result.maxId = e.int();
    }
    if (t & 8) {
      result.readMaxId = e.int();
    }
    return result;
  },
  3908927508: function (e) {
    var result = { _: `peerBlocked` };
    result.peerId = e.object();
    result.date = e.int();
    return result;
  },
  2145983508: function (e) {
    var result = { _: `stats.messageStats` };
    result.viewsGraph = e.object();
    result.reactionsByEmotionGraph = e.object();
    return result;
  },
  2004925620: function (e) {
    var result = { _: `groupCallDiscarded` };
    result.id = e.long();
    result.accessHash = e.long();
    result.duration = e.int();
    return result;
  },
  4021466647: function (e) {
    var result = { _: `groupCall` };
    var t = e.uint();
    result.flags = t;
    result.joinMuted = !!(t & 2);
    result.canChangeJoinMuted = !!(t & 4);
    result.joinDateAsc = !!(t & 64);
    result.scheduleStartSubscribed = !!(t & 256);
    result.canStartVideo = !!(t & 512);
    result.recordVideoActive = !!(t & 2048);
    result.rtmpStream = !!(t & 4096);
    result.listenersHidden = !!(t & 8192);
    result.conference = !!(t & 16384);
    result.creator = !!(t & 32768);
    result.messagesEnabled = !!(t & 131072);
    result.canChangeMessagesEnabled = !!(t & 262144);
    result.min = !!(t & 524288);
    result.id = e.long();
    result.accessHash = e.long();
    result.participantsCount = e.int();
    if (t & 8) {
      result.title = e.string();
    }
    if (t & 16) {
      result.streamDcId = e.int();
    }
    if (t & 32) {
      result.recordStartDate = e.int();
    }
    if (t & 128) {
      result.scheduleDate = e.int();
    }
    if (t & 1024) {
      result.unmutedVideoCount = e.int();
    }
    result.unmutedVideoLimit = e.int();
    result.version = e.int();
    if (t & 65536) {
      result.inviteLink = e.string();
    }
    if (t & 1048576) {
      result.sendPaidMessagesStars = e.long();
    }
    if (t & 2097152) {
      result.defaultSendAs = e.object();
    }
    return result;
  },
  3635053583: function (e) {
    var result = { _: `inputGroupCall` };
    result.id = e.long();
    result.accessHash = e.long();
    return result;
  },
  4261839423: function (e) {
    var result = { _: `inputGroupCallSlug` };
    result.slug = e.string();
    return result;
  },
  2349883455: function (e) {
    var result = { _: `inputGroupCallInviteMessage` };
    result.msgId = e.int();
    return result;
  },
  708691884: function (e) {
    var result = { _: `groupCallParticipant` };
    var t = e.uint();
    result.flags = t;
    result.muted = !!(t & 1);
    result.left = !!(t & 2);
    result.canSelfUnmute = !!(t & 4);
    result.justJoined = !!(t & 16);
    result.versioned = !!(t & 32);
    result.min = !!(t & 256);
    result.mutedByYou = !!(t & 512);
    result.volumeByAdmin = !!(t & 1024);
    result.self = !!(t & 4096);
    result.videoJoined = !!(t & 32768);
    result.peer = e.object();
    result.date = e.int();
    if (t & 8) {
      result.activeDate = e.int();
    }
    result.source = e.int();
    if (t & 128) {
      result.volume = e.int();
    }
    if (t & 2048) {
      result.about = e.string();
    }
    if (t & 8192) {
      result.raiseHandRating = e.long();
    }
    if (t & 64) {
      result.video = e.object();
    }
    if (t & 16384) {
      result.presentation = e.object();
    }
    if (t & 65536) {
      result.paidStarsTotal = e.long();
    }
    return result;
  },
  2658302637: function (e) {
    var result = { _: `phone.groupCall` };
    result.call = e.object();
    result.participants = e.vector(e.object);
    result.participantsNextOffset = e.string();
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  4101460406: function (e) {
    var result = { _: `phone.groupParticipants` };
    result.count = e.int();
    result.participants = e.vector(e.object);
    result.nextOffset = e.string();
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    result.version = e.int();
    return result;
  },
  813821341: function (e) {
    var result = { _: `inlineQueryPeerTypeSameBotPM` };
    return result;
  },
  2201751468: function (e) {
    var result = { _: `inlineQueryPeerTypePM` };
    return result;
  },
  3613836554: function (e) {
    var result = { _: `inlineQueryPeerTypeChat` };
    return result;
  },
  1589952067: function (e) {
    var result = { _: `inlineQueryPeerTypeMegagroup` };
    return result;
  },
  1664413338: function (e) {
    var result = { _: `inlineQueryPeerTypeBroadcast` };
    return result;
  },
  238759180: function (e) {
    var result = { _: `inlineQueryPeerTypeBotPM` };
    return result;
  },
  375566091: function (e) {
    var result = { _: `messages.historyImport` };
    result.id = e.long();
    return result;
  },
  1578088377: function (e) {
    var result = { _: `messages.historyImportParsed` };
    var t = e.uint();
    result.flags = t;
    result.pm = !!(t & 1);
    result.group = !!(t & 2);
    if (t & 4) {
      result.title = e.string();
    }
    return result;
  },
  4019011180: function (e) {
    var result = { _: `messages.affectedFoundMessages` };
    result.pts = e.int();
    result.ptsCount = e.int();
    result.offset = e.int();
    result.messages = e.vector(e.int);
    return result;
  },
  2354765785: function (e) {
    var result = { _: `chatInviteImporter` };
    var t = e.uint();
    result.flags = t;
    result.requested = !!(t & 1);
    result.viaChatlist = !!(t & 8);
    result.userId = e.long();
    result.date = e.int();
    if (t & 4) {
      result.about = e.string();
    }
    if (t & 2) {
      result.approvedBy = e.long();
    }
    return result;
  },
  3183881676: function (e) {
    var result = { _: `messages.exportedChatInvites` };
    result.count = e.int();
    result.invites = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  410107472: function (e) {
    var result = { _: `messages.exportedChatInvite` };
    result.invite = e.object();
    result.users = e.vector(e.object);
    return result;
  },
  572915951: function (e) {
    var result = { _: `messages.exportedChatInviteReplaced` };
    result.invite = e.object();
    result.newInvite = e.object();
    result.users = e.vector(e.object);
    return result;
  },
  2176233482: function (e) {
    var result = { _: `messages.chatInviteImporters` };
    result.count = e.int();
    result.importers = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  4075613987: function (e) {
    var result = { _: `chatAdminWithInvites` };
    result.adminId = e.long();
    result.invitesCount = e.int();
    result.revokedInvitesCount = e.int();
    return result;
  },
  3063640791: function (e) {
    var result = { _: `messages.chatAdminsWithInvites` };
    result.admins = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  2723014423: function (e) {
    var result = { _: `messages.checkedHistoryImportPeer` };
    result.confirmText = e.string();
    return result;
  },
  2951045695: function (e) {
    var result = { _: `phone.joinAsPeers` };
    result.peers = e.vector(e.object);
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  541839704: function (e) {
    var result = { _: `phone.exportedGroupCallInvite` };
    result.link = e.string();
    return result;
  },
  3702593719: function (e) {
    var result = { _: `groupCallParticipantVideoSourceGroup` };
    result.semantics = e.string();
    result.sources = e.vector(e.int);
    return result;
  },
  1735736008: function (e) {
    var result = { _: `groupCallParticipantVideo` };
    var t = e.uint();
    result.flags = t;
    result.paused = !!(t & 1);
    result.endpoint = e.string();
    result.sourceGroups = e.vector(e.object);
    if (t & 2) {
      result.audioSource = e.int();
    }
    return result;
  },
  2248056895: function (e) {
    var result = { _: `stickers.suggestedShortName` };
    result.shortName = e.string();
    return result;
  },
  795652779: function (e) {
    var result = { _: `botCommandScopeDefault` };
    return result;
  },
  1011811544: function (e) {
    var result = { _: `botCommandScopeUsers` };
    return result;
  },
  1877059713: function (e) {
    var result = { _: `botCommandScopeChats` };
    return result;
  },
  3114950762: function (e) {
    var result = { _: `botCommandScopeChatAdmins` };
    return result;
  },
  3684534653: function (e) {
    var result = { _: `botCommandScopePeer` };
    result.peer = e.object();
    return result;
  },
  1071145937: function (e) {
    var result = { _: `botCommandScopePeerAdmins` };
    result.peer = e.object();
    return result;
  },
  169026035: function (e) {
    var result = { _: `botCommandScopePeerUser` };
    result.peer = e.object();
    result.userId = e.object();
    return result;
  },
  3816265825: function (e) {
    var result = { _: `account.resetPasswordFailedWait` };
    result.retryDate = e.int();
    return result;
  },
  3924819069: function (e) {
    var result = { _: `account.resetPasswordRequestedWait` };
    result.untilDate = e.int();
    return result;
  },
  3911636542: function (e) {
    var result = { _: `account.resetPasswordOk` };
    return result;
  },
  3286236164: function (e) {
    var result = { _: `chatTheme` };
    result.emoticon = e.string();
    return result;
  },
  878246344: function (e) {
    var result = { _: `chatThemeUniqueGift` };
    result.gift = e.object();
    result.themeSettings = e.vector(e.object);
    return result;
  },
  3759268292: function (e) {
    var result = { _: `account.chatThemesNotModified` };
    return result;
  },
  3188294003: function (e) {
    var result = { _: `account.chatThemes` };
    var t = e.uint();
    result.flags = t;
    result.hash = e.long();
    result.themes = e.vector(e.object);
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    if (t & 1) {
      result.nextOffset = e.string();
    }
    return result;
  },
  2109703795: function (e) {
    var result = { _: `sponsoredMessage` };
    var t = e.uint();
    result.flags = t;
    result.recommended = !!(t & 32);
    result.canReport = !!(t & 4096);
    result.randomId = e.bytes();
    result.url = e.string();
    result.title = e.string();
    result.message = e.string();
    if (t & 2) {
      result.entities = e.vector(e.object);
    }
    if (t & 64) {
      result.photo = e.object();
    }
    if (t & 16384) {
      result.media = e.object();
    }
    if (t & 8192) {
      result.color = e.object();
    }
    result.buttonText = e.string();
    if (t & 128) {
      result.sponsorInfo = e.string();
    }
    if (t & 256) {
      result.additionalInfo = e.string();
    }
    if (t & 32768) {
      result.minDisplayDuration = e.int();
    }
    if (t & 32768) {
      result.maxDisplayDuration = e.int();
    }
    return result;
  },
  4292502893: function (e) {
    var result = { _: `messages.sponsoredMessages` };
    var t = e.uint();
    result.flags = t;
    if (t & 1) {
      result.postsBetween = e.int();
    }
    if (t & 2) {
      result.startDelay = e.int();
    }
    if (t & 4) {
      result.betweenDelay = e.int();
    }
    result.messages = e.vector(e.object);
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  406407439: function (e) {
    var result = { _: `messages.sponsoredMessagesEmpty` };
    return result;
  },
  3383776159: function (e) {
    var result = { _: `searchResultsCalendarPeriod` };
    result.date = e.int();
    result.minMsgId = e.int();
    result.maxMsgId = e.int();
    result.count = e.int();
    return result;
  },
  343859772: function (e) {
    var result = { _: `messages.searchResultsCalendar` };
    var t = e.uint();
    result.flags = t;
    result.inexact = !!(t & 1);
    result.count = e.int();
    result.minDate = e.int();
    result.minMsgId = e.int();
    if (t & 2) {
      result.offsetIdOffset = e.int();
    }
    result.periods = e.vector(e.object);
    result.messages = e.vector(e.object);
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  2137295719: function (e) {
    var result = { _: `searchResultPosition` };
    result.msgId = e.int();
    result.date = e.int();
    result.offset = e.int();
    return result;
  },
  1404185519: function (e) {
    var result = { _: `messages.searchResultsPositions` };
    result.count = e.int();
    result.positions = e.vector(e.object);
    return result;
  },
  4103516358: function (e) {
    var result = { _: `channels.sendAsPeers` };
    result.peers = e.vector(e.object);
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  997004590: function (e) {
    var result = { _: `users.userFull` };
    result.fullUser = e.object();
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  1753266509: function (e) {
    var result = { _: `messages.peerSettings` };
    result.settings = e.object();
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  3282207583: function (e) {
    var result = { _: `auth.loggedOut` };
    var t = e.uint();
    result.flags = t;
    if (t & 1) {
      result.futureAuthToken = e.bytes();
    }
    return result;
  },
  2748435328: function (e) {
    var result = { _: `reactionCount` };
    var t = e.uint();
    result.flags = t;
    if (t & 1) {
      result.chosenOrder = e.int();
    }
    result.reaction = e.object();
    result.count = e.int();
    return result;
  },
  171155211: function (e) {
    var result = { _: `messageReactions` };
    var t = e.uint();
    result.flags = t;
    result.min = !!(t & 1);
    result.canSeeList = !!(t & 4);
    result.reactionsAsTags = !!(t & 8);
    result.results = e.vector(e.object);
    if (t & 2) {
      result.recentReactions = e.vector(e.object);
    }
    if (t & 16) {
      result.topReactors = e.vector(e.object);
    }
    return result;
  },
  834488621: function (e) {
    var result = { _: `messages.messageReactionsList` };
    var t = e.uint();
    result.flags = t;
    result.count = e.int();
    result.reactions = e.vector(e.object);
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    if (t & 1) {
      result.nextOffset = e.string();
    }
    return result;
  },
  3229084673: function (e) {
    var result = { _: `availableReaction` };
    var t = e.uint();
    result.flags = t;
    result.inactive = !!(t & 1);
    result.premium = !!(t & 4);
    result.reaction = e.string();
    result.title = e.string();
    result.staticIcon = e.object();
    result.appearAnimation = e.object();
    result.selectAnimation = e.object();
    result.activateAnimation = e.object();
    result.effectAnimation = e.object();
    if (t & 2) {
      result.aroundAnimation = e.object();
    }
    if (t & 2) {
      result.centerIcon = e.object();
    }
    return result;
  },
  2668042583: function (e) {
    var result = { _: `messages.availableReactionsNotModified` };
    return result;
  },
  1989032621: function (e) {
    var result = { _: `messages.availableReactions` };
    result.hash = e.int();
    result.reactions = e.vector(e.object);
    return result;
  },
  2356786748: function (e) {
    var result = { _: `messagePeerReaction` };
    var t = e.uint();
    result.flags = t;
    result.big = !!(t & 1);
    result.unread = !!(t & 2);
    result.my = !!(t & 4);
    result.peerId = e.object();
    result.date = e.int();
    result.reaction = e.object();
    return result;
  },
  2162903215: function (e) {
    var result = { _: `groupCallStreamChannel` };
    result.channel = e.int();
    result.scale = e.int();
    result.lastTimestampMs = e.long();
    return result;
  },
  3504636594: function (e) {
    var result = { _: `phone.groupCallStreamChannels` };
    result.channels = e.vector(e.object);
    return result;
  },
  767505458: function (e) {
    var result = { _: `phone.groupCallStreamRtmpUrl` };
    result.url = e.string();
    result.key = e.string();
    return result;
  },
  1165423600: function (e) {
    var result = { _: `attachMenuBotIconColor` };
    result.name = e.string();
    result.color = e.int();
    return result;
  },
  2997303403: function (e) {
    var result = { _: `attachMenuBotIcon` };
    var t = e.uint();
    result.flags = t;
    result.name = e.string();
    result.icon = e.object();
    if (t & 1) {
      result.colors = e.vector(e.object);
    }
    return result;
  },
  3641544190: function (e) {
    var result = { _: `attachMenuBot` };
    var t = e.uint();
    result.flags = t;
    result.inactive = !!(t & 1);
    result.hasSettings = !!(t & 2);
    result.requestWriteAccess = !!(t & 4);
    result.showInAttachMenu = !!(t & 8);
    result.showInSideMenu = !!(t & 16);
    result.sideMenuDisclaimerNeeded = !!(t & 32);
    result.botId = e.long();
    result.shortName = e.string();
    if (t & 8) {
      result.peerTypes = e.vector(e.object);
    }
    result.icons = e.vector(e.object);
    return result;
  },
  4057500252: function (e) {
    var result = { _: `attachMenuBotsNotModified` };
    return result;
  },
  1011024320: function (e) {
    var result = { _: `attachMenuBots` };
    result.hash = e.long();
    result.bots = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  2478794367: function (e) {
    var result = { _: `attachMenuBotsBot` };
    result.bot = e.object();
    result.users = e.vector(e.object);
    return result;
  },
  1294139288: function (e) {
    var result = { _: `webViewResultUrl` };
    var t = e.uint();
    result.flags = t;
    result.fullsize = !!(t & 2);
    result.fullscreen = !!(t & 4);
    result.sameOrigin = !!(t & 8);
    if (t & 1) {
      result.queryId = e.long();
    }
    result.url = e.string();
    return result;
  },
  211046684: function (e) {
    var result = { _: `webViewMessageSent` };
    var t = e.uint();
    result.flags = t;
    if (t & 1) {
      result.msgId = e.object();
    }
    return result;
  },
  1966318984: function (e) {
    var result = { _: `botMenuButtonDefault` };
    return result;
  },
  1113113093: function (e) {
    var result = { _: `botMenuButtonCommands` };
    return result;
  },
  3350559974: function (e) {
    var result = { _: `botMenuButton` };
    result.text = e.string();
    result.url = e.string();
    return result;
  },
  4227262641: function (e) {
    var result = { _: `account.savedRingtonesNotModified` };
    return result;
  },
  3253284037: function (e) {
    var result = { _: `account.savedRingtones` };
    result.hash = e.long();
    result.ringtones = e.vector(e.object);
    return result;
  },
  2548612798: function (e) {
    var result = { _: `notificationSoundDefault` };
    return result;
  },
  1863070943: function (e) {
    var result = { _: `notificationSoundNone` };
    return result;
  },
  2198575844: function (e) {
    var result = { _: `notificationSoundLocal` };
    result.title = e.string();
    result.data = e.string();
    return result;
  },
  4285300809: function (e) {
    var result = { _: `notificationSoundRingtone` };
    result.id = e.long();
    return result;
  },
  3072737133: function (e) {
    var result = { _: `account.savedRingtone` };
    return result;
  },
  523271863: function (e) {
    var result = { _: `account.savedRingtoneConverted` };
    result.document = e.object();
    return result;
  },
  2104224014: function (e) {
    var result = { _: `attachMenuPeerTypeSameBotPM` };
    return result;
  },
  3274439194: function (e) {
    var result = { _: `attachMenuPeerTypeBotPM` };
    return result;
  },
  4047950623: function (e) {
    var result = { _: `attachMenuPeerTypePM` };
    return result;
  },
  84480319: function (e) {
    var result = { _: `attachMenuPeerTypeChat` };
    return result;
  },
  2080104188: function (e) {
    var result = { _: `attachMenuPeerTypeBroadcast` };
    return result;
  },
  3317000281: function (e) {
    var result = { _: `inputInvoiceMessage` };
    result.peer = e.object();
    result.msgId = e.int();
    return result;
  },
  3274099439: function (e) {
    var result = { _: `inputInvoiceSlug` };
    result.slug = e.string();
    return result;
  },
  2560125965: function (e) {
    var result = { _: `inputInvoicePremiumGiftCode` };
    result.purpose = e.object();
    result.option = e.object();
    return result;
  },
  1710230755: function (e) {
    var result = { _: `inputInvoiceStars` };
    result.purpose = e.object();
    return result;
  },
  887591921: function (e) {
    var result = { _: `inputInvoiceChatInviteSubscription` };
    result.hash = e.string();
    return result;
  },
  3898760850: function (e) {
    var result = { _: `inputInvoiceStarGift` };
    var t = e.uint();
    result.flags = t;
    result.hideName = !!(t & 1);
    result.includeUpgrade = !!(t & 4);
    result.peer = e.object();
    result.giftId = e.long();
    if (t & 2) {
      result.message = e.object();
    }
    return result;
  },
  1300335965: function (e) {
    var result = { _: `inputInvoiceStarGiftUpgrade` };
    var t = e.uint();
    result.flags = t;
    result.keepOriginalDetails = !!(t & 1);
    result.stargift = e.object();
    return result;
  },
  1247763417: function (e) {
    var result = { _: `inputInvoiceStarGiftTransfer` };
    result.stargift = e.object();
    result.toId = e.object();
    return result;
  },
  3669668591: function (e) {
    var result = { _: `inputInvoicePremiumGiftStars` };
    var t = e.uint();
    result.flags = t;
    result.userId = e.object();
    result.months = e.int();
    if (t & 1) {
      result.message = e.object();
    }
    return result;
  },
  4103700034: function (e) {
    var result = { _: `inputInvoiceBusinessBotTransferStars` };
    result.bot = e.object();
    result.stars = e.long();
    return result;
  },
  3920676440: function (e) {
    var result = { _: `inputInvoiceStarGiftResale` };
    var t = e.uint();
    result.flags = t;
    result.ton = !!(t & 1);
    result.showName = !!(t & 4);
    result.slug = e.string();
    result.toId = e.object();
    if (t & 2) {
      result.message = e.object();
    }
    return result;
  },
  2584430776: function (e) {
    var result = { _: `inputInvoiceStarGiftPrepaidUpgrade` };
    result.peer = e.object();
    result.hash = e.string();
    return result;
  },
  1048049172: function (e) {
    var result = { _: `inputInvoicePremiumAuthCode` };
    result.purpose = e.object();
    return result;
  },
  153344209: function (e) {
    var result = { _: `inputInvoiceStarGiftDropOriginalDetails` };
    result.stargift = e.object();
    return result;
  },
  516618768: function (e) {
    var result = { _: `inputInvoiceStarGiftAuctionBid` };
    var t = e.uint();
    result.flags = t;
    result.hideName = !!(t & 1);
    result.updateBid = !!(t & 4);
    if (t & 8) {
      result.peer = e.object();
    }
    result.giftId = e.long();
    result.bidAmount = e.long();
    if (t & 2) {
      result.message = e.object();
    }
    return result;
  },
  2932919257: function (e) {
    var result = { _: `payments.exportedInvoice` };
    result.url = e.string();
    return result;
  },
  3485063511: function (e) {
    var result = { _: `messages.transcribedAudio` };
    var t = e.uint();
    result.flags = t;
    result.pending = !!(t & 1);
    result.transcriptionId = e.long();
    result.text = e.string();
    if (t & 2) {
      result.trialRemainsNum = e.int();
    }
    if (t & 2) {
      result.trialRemainsUntilDate = e.int();
    }
    return result;
  },
  1395946908: function (e) {
    var result = { _: `help.premiumPromo` };
    result.statusText = e.string();
    result.statusEntities = e.vector(e.object);
    result.videoSections = e.vector(e.string);
    result.videos = e.vector(e.object);
    result.periodOptions = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  2792693350: function (e) {
    var result = { _: `inputStorePaymentPremiumSubscription` };
    var t = e.uint();
    result.flags = t;
    result.restore = !!(t & 1);
    result.upgrade = !!(t & 2);
    return result;
  },
  1634697192: function (e) {
    var result = { _: `inputStorePaymentGiftPremium` };
    result.userId = e.object();
    result.currency = e.string();
    result.amount = e.long();
    return result;
  },
  4219011987: function (e) {
    var result = { _: `inputStorePaymentPremiumGiftCode` };
    var t = e.uint();
    result.flags = t;
    result.users = e.vector(e.object);
    if (t & 1) {
      result.boostPeer = e.object();
    }
    result.currency = e.string();
    result.amount = e.long();
    if (t & 2) {
      result.message = e.object();
    }
    return result;
  },
  369444042: function (e) {
    var result = { _: `inputStorePaymentPremiumGiveaway` };
    var t = e.uint();
    result.flags = t;
    result.onlyNewSubscribers = !!(t & 1);
    result.winnersAreVisible = !!(t & 8);
    result.boostPeer = e.object();
    if (t & 2) {
      result.additionalPeers = e.vector(e.object);
    }
    if (t & 4) {
      result.countriesIso2 = e.vector(e.string);
    }
    if (t & 16) {
      result.prizeDescription = e.string();
    }
    result.randomId = e.long();
    result.untilDate = e.int();
    result.currency = e.string();
    result.amount = e.long();
    return result;
  },
  4188186315: function (e) {
    var result = { _: `inputStorePaymentStarsTopup` };
    var t = e.uint();
    result.flags = t;
    result.stars = e.long();
    result.currency = e.string();
    result.amount = e.long();
    if (t & 1) {
      result.spendPurposePeer = e.object();
    }
    return result;
  },
  494149367: function (e) {
    var result = { _: `inputStorePaymentStarsGift` };
    result.userId = e.object();
    result.stars = e.long();
    result.currency = e.string();
    result.amount = e.long();
    return result;
  },
  1964968186: function (e) {
    var result = { _: `inputStorePaymentStarsGiveaway` };
    var t = e.uint();
    result.flags = t;
    result.onlyNewSubscribers = !!(t & 1);
    result.winnersAreVisible = !!(t & 8);
    result.stars = e.long();
    result.boostPeer = e.object();
    if (t & 2) {
      result.additionalPeers = e.vector(e.object);
    }
    if (t & 4) {
      result.countriesIso2 = e.vector(e.string);
    }
    if (t & 16) {
      result.prizeDescription = e.string();
    }
    result.randomId = e.long();
    result.untilDate = e.int();
    result.currency = e.string();
    result.amount = e.long();
    result.users = e.int();
    return result;
  },
  1069645911: function (e) {
    var result = { _: `inputStorePaymentAuthCode` };
    var t = e.uint();
    result.flags = t;
    result.restore = !!(t & 1);
    result.phoneNumber = e.string();
    result.phoneCodeHash = e.string();
    result.premiumDays = e.int();
    result.currency = e.string();
    result.amount = e.long();
    return result;
  },
  2298016283: function (e) {
    var result = { _: `paymentFormMethod` };
    result.url = e.string();
    result.title = e.string();
    return result;
  },
  769727150: function (e) {
    var result = { _: `emojiStatusEmpty` };
    return result;
  },
  3892250250: function (e) {
    var result = { _: `emojiStatus` };
    var t = e.uint();
    result.flags = t;
    result.documentId = e.long();
    if (t & 1) {
      result.until = e.int();
    }
    return result;
  },
  1904500795: function (e) {
    var result = { _: `emojiStatusCollectible` };
    var t = e.uint();
    result.flags = t;
    result.collectibleId = e.long();
    result.documentId = e.long();
    result.title = e.string();
    result.slug = e.string();
    result.patternDocumentId = e.long();
    result.centerColor = e.int();
    result.edgeColor = e.int();
    result.patternColor = e.int();
    result.textColor = e.int();
    if (t & 1) {
      result.until = e.int();
    }
    return result;
  },
  118758847: function (e) {
    var result = { _: `inputEmojiStatusCollectible` };
    var t = e.uint();
    result.flags = t;
    result.collectibleId = e.long();
    if (t & 1) {
      result.until = e.int();
    }
    return result;
  },
  3498894917: function (e) {
    var result = { _: `account.emojiStatusesNotModified` };
    return result;
  },
  2428790737: function (e) {
    var result = { _: `account.emojiStatuses` };
    result.hash = e.long();
    result.statuses = e.vector(e.object);
    return result;
  },
  2046153753: function (e) {
    var result = { _: `reactionEmpty` };
    return result;
  },
  455247544: function (e) {
    var result = { _: `reactionEmoji` };
    result.emoticon = e.string();
    return result;
  },
  2302016627: function (e) {
    var result = { _: `reactionCustomEmoji` };
    result.documentId = e.long();
    return result;
  },
  1379771627: function (e) {
    var result = { _: `reactionPaid` };
    return result;
  },
  3942396604: function (e) {
    var result = { _: `chatReactionsNone` };
    return result;
  },
  1385335754: function (e) {
    var result = { _: `chatReactionsAll` };
    var t = e.uint();
    result.flags = t;
    result.allowCustom = !!(t & 1);
    return result;
  },
  1713193015: function (e) {
    var result = { _: `chatReactionsSome` };
    result.reactions = e.vector(e.object);
    return result;
  },
  2960120799: function (e) {
    var result = { _: `messages.reactionsNotModified` };
    return result;
  },
  3942512406: function (e) {
    var result = { _: `messages.reactions` };
    result.hash = e.long();
    result.reactions = e.vector(e.object);
    return result;
  },
  1128644211: function (e) {
    var result = { _: `emailVerifyPurposeLoginSetup` };
    result.phoneNumber = e.string();
    result.phoneCodeHash = e.string();
    return result;
  },
  1383932651: function (e) {
    var result = { _: `emailVerifyPurposeLoginChange` };
    return result;
  },
  3153401477: function (e) {
    var result = { _: `emailVerifyPurposePassport` };
    return result;
  },
  2452510121: function (e) {
    var result = { _: `emailVerificationCode` };
    result.code = e.string();
    return result;
  },
  3683688130: function (e) {
    var result = { _: `emailVerificationGoogle` };
    result.token = e.string();
    return result;
  },
  2530243837: function (e) {
    var result = { _: `emailVerificationApple` };
    result.token = e.string();
    return result;
  },
  731303195: function (e) {
    var result = { _: `account.emailVerified` };
    result.email = e.string();
    return result;
  },
  3787132257: function (e) {
    var result = { _: `account.emailVerifiedLogin` };
    result.email = e.string();
    result.sentCode = e.object();
    return result;
  },
  1596792306: function (e) {
    var result = { _: `premiumSubscriptionOption` };
    var t = e.uint();
    result.flags = t;
    result.current = !!(t & 2);
    result.canPurchaseUpgrade = !!(t & 4);
    if (t & 8) {
      result.transaction = e.string();
    }
    result.months = e.int();
    result.currency = e.string();
    result.amount = e.long();
    result.botUrl = e.string();
    if (t & 1) {
      result.storeProduct = e.string();
    }
    return result;
  },
  3088871476: function (e) {
    var result = { _: `sendAsPeer` };
    var t = e.uint();
    result.flags = t;
    result.premiumRequired = !!(t & 1);
    result.peer = e.object();
    return result;
  },
  2908916936: function (e) {
    var result = { _: `messageExtendedMediaPreview` };
    var t = e.uint();
    result.flags = t;
    if (t & 1) {
      result.w = e.int();
    }
    if (t & 1) {
      result.h = e.int();
    }
    if (t & 2) {
      result.thumb = e.object();
    }
    if (t & 4) {
      result.videoDuration = e.int();
    }
    return result;
  },
  3997670500: function (e) {
    var result = { _: `messageExtendedMedia` };
    result.media = e.object();
    return result;
  },
  4244550300: function (e) {
    var result = { _: `stickerKeyword` };
    result.documentId = e.long();
    result.keyword = e.vector(e.string);
    return result;
  },
  3020371527: function (e) {
    var result = { _: `username` };
    var t = e.uint();
    result.flags = t;
    result.editable = !!(t & 1);
    result.active = !!(t & 2);
    result.deletable = !!(t & 4);
    result.expired = !!(t & 8);
    result.username = e.string();
    return result;
  },
  37687451: function (e) {
    var result = { _: `forumTopicDeleted` };
    result.id = e.int();
    return result;
  },
  4242200597: function (e) {
    var result = { _: `forumTopic` };
    var t = e.uint();
    result.flags = t;
    result.my = !!(t & 2);
    result.closed = !!(t & 4);
    result.pinned = !!(t & 8);
    result.short = !!(t & 32);
    result.hidden = !!(t & 64);
    result.titleMissing = !!(t & 128);
    result.id = e.int();
    result.date = e.int();
    result.peer = e.object();
    result.title = e.string();
    result.iconColor = e.int();
    if (t & 1) {
      result.iconEmojiId = e.long();
    }
    result.topMessage = e.int();
    result.readInboxMaxId = e.int();
    result.readOutboxMaxId = e.int();
    result.unreadCount = e.int();
    result.unreadMentionsCount = e.int();
    result.unreadReactionsCount = e.int();
    result.unreadPollVotesCount = e.int();
    result.fromId = e.object();
    result.notifySettings = e.object();
    if (t & 16) {
      result.draft = e.object();
    }
    return result;
  },
  913709011: function (e) {
    var result = { _: `messages.forumTopics` };
    var t = e.uint();
    result.flags = t;
    result.orderByCreateDate = !!(t & 1);
    result.count = e.int();
    result.topics = e.vector(e.object);
    result.messages = e.vector(e.object);
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    result.pts = e.int();
    return result;
  },
  1135897376: function (e) {
    var result = { _: `defaultHistoryTTL` };
    result.period = e.int();
    return result;
  },
  1103040667: function (e) {
    var result = { _: `exportedContactToken` };
    result.url = e.string();
    result.expires = e.int();
    return result;
  },
  1597737472: function (e) {
    var result = { _: `requestPeerTypeUser` };
    var t = e.uint();
    result.flags = t;
    if (t & 1) {
      result.bot = e.object();
    }
    if (t & 2) {
      result.premium = e.object();
    }
    return result;
  },
  3387977243: function (e) {
    var result = { _: `requestPeerTypeChat` };
    var t = e.uint();
    result.flags = t;
    result.creator = !!(t & 1);
    result.botParticipant = !!(t & 32);
    if (t & 8) {
      result.hasUsername = e.object();
    }
    if (t & 16) {
      result.forum = e.object();
    }
    if (t & 2) {
      result.userAdminRights = e.object();
    }
    if (t & 4) {
      result.botAdminRights = e.object();
    }
    return result;
  },
  865857388: function (e) {
    var result = { _: `requestPeerTypeBroadcast` };
    var t = e.uint();
    result.flags = t;
    result.creator = !!(t & 1);
    if (t & 8) {
      result.hasUsername = e.object();
    }
    if (t & 2) {
      result.userAdminRights = e.object();
    }
    if (t & 4) {
      result.botAdminRights = e.object();
    }
    return result;
  },
  1048699000: function (e) {
    var result = { _: `requestPeerTypeCreateBot` };
    var t = e.uint();
    result.flags = t;
    result.botManaged = !!(t & 1);
    if (t & 2) {
      result.suggestedName = e.string();
    }
    if (t & 4) {
      result.suggestedUsername = e.string();
    }
    return result;
  },
  1209970170: function (e) {
    var result = { _: `emojiListNotModified` };
    return result;
  },
  2048790993: function (e) {
    var result = { _: `emojiList` };
    result.hash = e.long();
    result.documentId = e.vector(e.long);
    return result;
  },
  2056961449: function (e) {
    var result = { _: `emojiGroup` };
    result.title = e.string();
    result.iconEmojiId = e.long();
    result.emoticons = e.vector(e.string);
    return result;
  },
  2161274055: function (e) {
    var result = { _: `emojiGroupGreeting` };
    result.title = e.string();
    result.iconEmojiId = e.long();
    result.emoticons = e.vector(e.string);
    return result;
  },
  154914612: function (e) {
    var result = { _: `emojiGroupPremium` };
    result.title = e.string();
    result.iconEmojiId = e.long();
    return result;
  },
  1874111879: function (e) {
    var result = { _: `messages.emojiGroupsNotModified` };
    return result;
  },
  2283780427: function (e) {
    var result = { _: `messages.emojiGroups` };
    result.hash = e.int();
    result.groups = e.vector(e.object);
    return result;
  },
  1964978502: function (e) {
    var result = { _: `textWithEntities` };
    result.text = e.string();
    result.entities = e.vector(e.object);
    return result;
  },
  870003448: function (e) {
    var result = { _: `messages.translateResult` };
    result.result = e.vector(e.object);
    return result;
  },
  3360175310: function (e) {
    var result = { _: `autoSaveSettings` };
    var t = e.uint();
    result.flags = t;
    result.photos = !!(t & 1);
    result.videos = !!(t & 2);
    if (t & 4) {
      result.videoMaxSize = e.long();
    }
    return result;
  },
  2170563911: function (e) {
    var result = { _: `autoSaveException` };
    result.peer = e.object();
    result.settings = e.object();
    return result;
  },
  1279133341: function (e) {
    var result = { _: `account.autoSaveSettings` };
    result.usersSettings = e.object();
    result.chatsSettings = e.object();
    result.broadcastsSettings = e.object();
    result.exceptions = e.vector(e.object);
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  2094949405: function (e) {
    var result = { _: `help.appConfigNotModified` };
    return result;
  },
  3709368366: function (e) {
    var result = { _: `help.appConfig` };
    result.hash = e.int();
    result.config = e.object();
    return result;
  },
  2837495162: function (e) {
    var result = { _: `inputBotAppID` };
    result.id = e.long();
    result.accessHash = e.long();
    return result;
  },
  2425095175: function (e) {
    var result = { _: `inputBotAppShortName` };
    result.botId = e.object();
    result.shortName = e.string();
    return result;
  },
  1571189943: function (e) {
    var result = { _: `botAppNotModified` };
    return result;
  },
  2516373974: function (e) {
    var result = { _: `botApp` };
    var t = e.uint();
    result.flags = t;
    result.id = e.long();
    result.accessHash = e.long();
    result.shortName = e.string();
    result.title = e.string();
    result.description = e.string();
    result.photo = e.object();
    if (t & 1) {
      result.document = e.object();
    }
    result.hash = e.long();
    return result;
  },
  3947933173: function (e) {
    var result = { _: `messages.botApp` };
    var t = e.uint();
    result.flags = t;
    result.inactive = !!(t & 1);
    result.requestWriteAccess = !!(t & 2);
    result.hasSettings = !!(t & 4);
    result.app = e.object();
    return result;
  },
  3044185557: function (e) {
    var result = { _: `inlineBotWebView` };
    result.text = e.string();
    result.url = e.string();
    return result;
  },
  1246753138: function (e) {
    var result = { _: `readParticipantDate` };
    result.userId = e.long();
    result.date = e.int();
    return result;
  },
  4091599411: function (e) {
    var result = { _: `inputChatlistDialogFilter` };
    result.filterId = e.int();
    return result;
  },
  206668204: function (e) {
    var result = { _: `exportedChatlistInvite` };
    var t = e.uint();
    result.flags = t;
    result.title = e.string();
    result.url = e.string();
    result.peers = e.vector(e.object);
    return result;
  },
  283567014: function (e) {
    var result = { _: `chatlists.exportedChatlistInvite` };
    result.filter = e.object();
    result.invite = e.object();
    return result;
  },
  279670215: function (e) {
    var result = { _: `chatlists.exportedInvites` };
    result.invites = e.vector(e.object);
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  4203214425: function (e) {
    var result = { _: `chatlists.chatlistInviteAlready` };
    result.filterId = e.int();
    result.missingPeers = e.vector(e.object);
    result.alreadyPeers = e.vector(e.object);
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  4044279343: function (e) {
    var result = { _: `chatlists.chatlistInvite` };
    var t = e.uint();
    result.flags = t;
    result.titleNoanimate = !!(t & 2);
    result.title = e.object();
    if (t & 1) {
      result.emoticon = e.string();
    }
    result.peers = e.vector(e.object);
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  2478671757: function (e) {
    var result = { _: `chatlists.chatlistUpdates` };
    result.missingPeers = e.vector(e.object);
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  3903288752: function (e) {
    var result = { _: `bots.botInfo` };
    result.name = e.string();
    result.about = e.string();
    result.description = e.string();
    return result;
  },
  3066834268: function (e) {
    var result = { _: `messagePeerVote` };
    result.peer = e.object();
    result.option = e.bytes();
    result.date = e.int();
    return result;
  },
  1959634180: function (e) {
    var result = { _: `messagePeerVoteInputOption` };
    result.peer = e.object();
    result.date = e.int();
    return result;
  },
  1177089766: function (e) {
    var result = { _: `messagePeerVoteMultiple` };
    result.peer = e.object();
    result.options = e.vector(e.bytes);
    result.date = e.int();
    return result;
  },
  2371443926: function (e) {
    var result = { _: `storyViews` };
    var t = e.uint();
    result.flags = t;
    result.hasViewers = !!(t & 2);
    result.viewsCount = e.int();
    if (t & 4) {
      result.forwardsCount = e.int();
    }
    if (t & 8) {
      result.reactions = e.vector(e.object);
    }
    if (t & 16) {
      result.reactionsCount = e.int();
    }
    if (t & 1) {
      result.recentViewers = e.vector(e.long);
    }
    return result;
  },
  1374088783: function (e) {
    var result = { _: `storyItemDeleted` };
    result.id = e.int();
    return result;
  },
  4289579283: function (e) {
    var result = { _: `storyItemSkipped` };
    var t = e.uint();
    result.flags = t;
    result.closeFriends = !!(t & 256);
    result.live = !!(t & 512);
    result.id = e.int();
    result.date = e.int();
    result.expireDate = e.int();
    return result;
  },
  379894076: function (e) {
    var result = { _: `storyItem` };
    var t = e.uint();
    result.flags = t;
    result.pinned = !!(t & 32);
    result.public = !!(t & 128);
    result.closeFriends = !!(t & 256);
    result.min = !!(t & 512);
    result.noforwards = !!(t & 1024);
    result.edited = !!(t & 2048);
    result.contacts = !!(t & 4096);
    result.selectedContacts = !!(t & 8192);
    result.out = !!(t & 65536);
    result.id = e.int();
    result.date = e.int();
    if (t & 262144) {
      result.fromId = e.object();
    }
    if (t & 131072) {
      result.fwdFrom = e.object();
    }
    result.expireDate = e.int();
    if (t & 1) {
      result.caption = e.string();
    }
    if (t & 2) {
      result.entities = e.vector(e.object);
    }
    result.media = e.object();
    if (t & 16384) {
      result.mediaAreas = e.vector(e.object);
    }
    if (t & 4) {
      result.privacy = e.vector(e.object);
    }
    if (t & 8) {
      result.views = e.object();
    }
    if (t & 32768) {
      result.sentReaction = e.object();
    }
    if (t & 524288) {
      result.albums = e.vector(e.int);
    }
    if (t & 1048576) {
      result.music = e.object();
    }
    return result;
  },
  291044926: function (e) {
    var result = { _: `stories.allStoriesNotModified` };
    var t = e.uint();
    result.flags = t;
    result.state = e.string();
    result.stealthMode = e.object();
    return result;
  },
  1862033025: function (e) {
    var result = { _: `stories.allStories` };
    var t = e.uint();
    result.flags = t;
    result.hasMore = !!(t & 1);
    result.count = e.int();
    result.state = e.string();
    result.peerStories = e.vector(e.object);
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    result.stealthMode = e.object();
    return result;
  },
  1673780490: function (e) {
    var result = { _: `stories.stories` };
    var t = e.uint();
    result.flags = t;
    result.count = e.int();
    result.stories = e.vector(e.object);
    if (t & 1) {
      result.pinnedToTop = e.vector(e.int);
    }
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  2965236421: function (e) {
    var result = { _: `storyView` };
    var t = e.uint();
    result.flags = t;
    result.blocked = !!(t & 1);
    result.blockedMyStoriesFrom = !!(t & 2);
    result.userId = e.long();
    result.date = e.int();
    if (t & 4) {
      result.reaction = e.object();
    }
    return result;
  },
  2424530699: function (e) {
    var result = { _: `storyViewPublicForward` };
    var t = e.uint();
    result.flags = t;
    result.blocked = !!(t & 1);
    result.blockedMyStoriesFrom = !!(t & 2);
    result.message = e.object();
    return result;
  },
  3178549065: function (e) {
    var result = { _: `storyViewPublicRepost` };
    var t = e.uint();
    result.flags = t;
    result.blocked = !!(t & 1);
    result.blockedMyStoriesFrom = !!(t & 2);
    result.peerId = e.object();
    result.story = e.object();
    return result;
  },
  1507299269: function (e) {
    var result = { _: `stories.storyViewsList` };
    var t = e.uint();
    result.flags = t;
    result.count = e.int();
    result.viewsCount = e.int();
    result.forwardsCount = e.int();
    result.reactionsCount = e.int();
    result.views = e.vector(e.object);
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    if (t & 1) {
      result.nextOffset = e.string();
    }
    return result;
  },
  3734957341: function (e) {
    var result = { _: `stories.storyViews` };
    result.views = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  1003796418: function (e) {
    var result = { _: `inputReplyToMessage` };
    var t = e.uint();
    result.flags = t;
    result.replyToMsgId = e.int();
    if (t & 1) {
      result.topMsgId = e.int();
    }
    if (t & 2) {
      result.replyToPeerId = e.object();
    }
    if (t & 4) {
      result.quoteText = e.string();
    }
    if (t & 8) {
      result.quoteEntities = e.vector(e.object);
    }
    if (t & 16) {
      result.quoteOffset = e.int();
    }
    if (t & 32) {
      result.monoforumPeerId = e.object();
    }
    if (t & 64) {
      result.todoItemId = e.int();
    }
    if (t & 128) {
      result.pollOption = e.bytes();
    }
    return result;
  },
  1484862010: function (e) {
    var result = { _: `inputReplyToStory` };
    result.peer = e.object();
    result.storyId = e.int();
    return result;
  },
  1775660101: function (e) {
    var result = { _: `inputReplyToMonoForum` };
    result.monoforumPeerId = e.object();
    return result;
  },
  1092204894: function (e) {
    var result = { _: `inputReplyToEphemeralMessage` };
    result.id = e.int();
    return result;
  },
  1070138683: function (e) {
    var result = { _: `exportedStoryLink` };
    result.link = e.string();
    return result;
  },
  1898850301: function (e) {
    var result = { _: `storiesStealthMode` };
    var t = e.uint();
    result.flags = t;
    if (t & 1) {
      result.activeUntilDate = e.int();
    }
    if (t & 2) {
      result.cooldownUntilDate = e.int();
    }
    return result;
  },
  3486113794: function (e) {
    var result = { _: `mediaAreaCoordinates` };
    var t = e.uint();
    result.flags = t;
    result.x = e.double();
    result.y = e.double();
    result.w = e.double();
    result.h = e.double();
    result.rotation = e.double();
    if (t & 1) {
      result.radius = e.double();
    }
    return result;
  },
  3196246940: function (e) {
    var result = { _: `mediaAreaVenue` };
    result.coordinates = e.object();
    result.geo = e.object();
    result.title = e.string();
    result.address = e.string();
    result.provider = e.string();
    result.venueId = e.string();
    result.venueType = e.string();
    return result;
  },
  2994872703: function (e) {
    var result = { _: `inputMediaAreaVenue` };
    result.coordinates = e.object();
    result.queryId = e.long();
    result.resultId = e.string();
    return result;
  },
  3402974509: function (e) {
    var result = { _: `mediaAreaGeoPoint` };
    var t = e.uint();
    result.flags = t;
    result.coordinates = e.object();
    result.geo = e.object();
    if (t & 1) {
      result.address = e.object();
    }
    return result;
  },
  340088945: function (e) {
    var result = { _: `mediaAreaSuggestedReaction` };
    var t = e.uint();
    result.flags = t;
    result.dark = !!(t & 1);
    result.flipped = !!(t & 2);
    result.coordinates = e.object();
    result.reaction = e.object();
    return result;
  },
  1996756655: function (e) {
    var result = { _: `mediaAreaChannelPost` };
    result.coordinates = e.object();
    result.channelId = e.long();
    result.msgId = e.int();
    return result;
  },
  577893055: function (e) {
    var result = { _: `inputMediaAreaChannelPost` };
    result.coordinates = e.object();
    result.channel = e.object();
    result.msgId = e.int();
    return result;
  },
  926421125: function (e) {
    var result = { _: `mediaAreaUrl` };
    result.coordinates = e.object();
    result.url = e.string();
    return result;
  },
  1235637404: function (e) {
    var result = { _: `mediaAreaWeather` };
    result.coordinates = e.object();
    result.emoji = e.string();
    result.temperatureC = e.double();
    result.color = e.int();
    return result;
  },
  1468491885: function (e) {
    var result = { _: `mediaAreaStarGift` };
    result.coordinates = e.object();
    result.slug = e.string();
    return result;
  },
  2587224473: function (e) {
    var result = { _: `peerStories` };
    var t = e.uint();
    result.flags = t;
    result.peer = e.object();
    if (t & 1) {
      result.maxReadId = e.int();
    }
    result.stories = e.vector(e.object);
    return result;
  },
  3404105576: function (e) {
    var result = { _: `stories.peerStories` };
    result.stories = e.object();
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  4250800829: function (e) {
    var result = { _: `messages.webPage` };
    result.webpage = e.object();
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  629052971: function (e) {
    var result = { _: `premiumGiftCodeOption` };
    var t = e.uint();
    result.flags = t;
    result.users = e.int();
    result.months = e.int();
    if (t & 1) {
      result.storeProduct = e.string();
    }
    if (t & 2) {
      result.storeQuantity = e.int();
    }
    result.currency = e.string();
    result.amount = e.long();
    return result;
  },
  3952623503: function (e) {
    var result = { _: `payments.checkedGiftCode` };
    var t = e.uint();
    result.flags = t;
    result.viaGiveaway = !!(t & 4);
    if (t & 16) {
      result.fromId = e.object();
    }
    if (t & 8) {
      result.giveawayMsgId = e.int();
    }
    if (t & 1) {
      result.toId = e.long();
    }
    result.date = e.int();
    result.days = e.int();
    if (t & 2) {
      result.usedDate = e.int();
    }
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  1130879648: function (e) {
    var result = { _: `payments.giveawayInfo` };
    var t = e.uint();
    result.flags = t;
    result.participating = !!(t & 1);
    result.preparingResults = !!(t & 8);
    result.startDate = e.int();
    if (t & 2) {
      result.joinedTooEarlyDate = e.int();
    }
    if (t & 4) {
      result.adminDisallowedChatId = e.long();
    }
    if (t & 16) {
      result.disallowedCountry = e.string();
    }
    return result;
  },
  3782600303: function (e) {
    var result = { _: `payments.giveawayInfoResults` };
    var t = e.uint();
    result.flags = t;
    result.winner = !!(t & 1);
    result.refunded = !!(t & 2);
    result.startDate = e.int();
    if (t & 8) {
      result.giftCodeSlug = e.string();
    }
    if (t & 16) {
      result.starsPrize = e.long();
    }
    result.finishDate = e.int();
    result.winnersCount = e.int();
    if (t & 4) {
      result.activatedCount = e.int();
    }
    return result;
  },
  2991824212: function (e) {
    var result = { _: `prepaidGiveaway` };
    result.id = e.long();
    result.months = e.int();
    result.quantity = e.int();
    result.date = e.int();
    return result;
  },
  2594011104: function (e) {
    var result = { _: `prepaidStarsGiveaway` };
    result.id = e.long();
    result.stars = e.long();
    result.quantity = e.int();
    result.boosts = e.int();
    result.date = e.int();
    return result;
  },
  1262359766: function (e) {
    var result = { _: `boost` };
    var t = e.uint();
    result.flags = t;
    result.gift = !!(t & 2);
    result.giveaway = !!(t & 4);
    result.unclaimed = !!(t & 8);
    result.id = e.string();
    if (t & 1) {
      result.userId = e.long();
    }
    if (t & 4) {
      result.giveawayMsgId = e.int();
    }
    result.date = e.int();
    result.expires = e.int();
    if (t & 16) {
      result.usedGiftSlug = e.string();
    }
    if (t & 32) {
      result.multiplier = e.int();
    }
    if (t & 64) {
      result.stars = e.long();
    }
    return result;
  },
  2264424764: function (e) {
    var result = { _: `premium.boostsList` };
    var t = e.uint();
    result.flags = t;
    result.count = e.int();
    result.boosts = e.vector(e.object);
    if (t & 1) {
      result.nextOffset = e.string();
    }
    result.users = e.vector(e.object);
    return result;
  },
  3293069660: function (e) {
    var result = { _: `myBoost` };
    var t = e.uint();
    result.flags = t;
    result.slot = e.int();
    if (t & 1) {
      result.peer = e.object();
    }
    result.date = e.int();
    result.expires = e.int();
    if (t & 2) {
      result.cooldownUntilDate = e.int();
    }
    return result;
  },
  2598512866: function (e) {
    var result = { _: `premium.myBoosts` };
    result.myBoosts = e.vector(e.object);
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  1230586490: function (e) {
    var result = { _: `premium.boostsStatus` };
    var t = e.uint();
    result.flags = t;
    result.myBoost = !!(t & 4);
    result.level = e.int();
    result.currentLevelBoosts = e.int();
    result.boosts = e.int();
    if (t & 16) {
      result.giftBoosts = e.int();
    }
    if (t & 1) {
      result.nextLevelBoosts = e.int();
    }
    if (t & 2) {
      result.premiumAudience = e.object();
    }
    result.boostUrl = e.string();
    if (t & 8) {
      result.prepaidGiveaways = e.vector(e.object);
    }
    if (t & 4) {
      result.myBoostSlots = e.vector(e.int);
    }
    return result;
  },
  3089555792: function (e) {
    var result = { _: `storyFwdHeader` };
    var t = e.uint();
    result.flags = t;
    result.modified = !!(t & 8);
    if (t & 1) {
      result.from = e.object();
    }
    if (t & 2) {
      result.fromName = e.string();
    }
    if (t & 4) {
      result.storyId = e.int();
    }
    return result;
  },
  3875901055: function (e) {
    var result = { _: `postInteractionCountersMessage` };
    result.msgId = e.int();
    result.views = e.int();
    result.forwards = e.int();
    result.reactions = e.int();
    return result;
  },
  2319978023: function (e) {
    var result = { _: `postInteractionCountersStory` };
    result.storyId = e.int();
    result.views = e.int();
    result.forwards = e.int();
    result.reactions = e.int();
    return result;
  },
  1355613820: function (e) {
    var result = { _: `stats.storyStats` };
    result.viewsGraph = e.object();
    result.reactionsByEmotionGraph = e.object();
    return result;
  },
  32685898: function (e) {
    var result = { _: `publicForwardMessage` };
    result.message = e.object();
    return result;
  },
  3992169936: function (e) {
    var result = { _: `publicForwardStory` };
    result.peer = e.object();
    result.story = e.object();
    return result;
  },
  2466479648: function (e) {
    var result = { _: `stats.publicForwards` };
    var t = e.uint();
    result.flags = t;
    result.count = e.int();
    result.forwards = e.vector(e.object);
    if (t & 1) {
      result.nextOffset = e.string();
    }
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  3041614543: function (e) {
    var result = { _: `peerColor` };
    var t = e.uint();
    result.flags = t;
    if (t & 1) {
      result.color = e.int();
    }
    if (t & 2) {
      result.backgroundEmojiId = e.long();
    }
    return result;
  },
  3116393370: function (e) {
    var result = { _: `peerColorCollectible` };
    var t = e.uint();
    result.flags = t;
    result.collectibleId = e.long();
    result.giftEmojiId = e.long();
    result.backgroundEmojiId = e.long();
    result.accentColor = e.int();
    result.colors = e.vector(e.int);
    if (t & 1) {
      result.darkAccentColor = e.int();
    }
    if (t & 2) {
      result.darkColors = e.vector(e.int);
    }
    return result;
  },
  3102377641: function (e) {
    var result = { _: `inputPeerColorCollectible` };
    result.collectibleId = e.long();
    return result;
  },
  639736408: function (e) {
    var result = { _: `help.peerColorSet` };
    result.colors = e.vector(e.int);
    return result;
  },
  1987928555: function (e) {
    var result = { _: `help.peerColorProfileSet` };
    result.paletteColors = e.vector(e.int);
    result.bgColors = e.vector(e.int);
    result.storyColors = e.vector(e.int);
    return result;
  },
  2917953214: function (e) {
    var result = { _: `help.peerColorOption` };
    var t = e.uint();
    result.flags = t;
    result.hidden = !!(t & 1);
    result.colorId = e.int();
    if (t & 2) {
      result.colors = e.object();
    }
    if (t & 4) {
      result.darkColors = e.object();
    }
    if (t & 8) {
      result.channelMinLevel = e.int();
    }
    if (t & 16) {
      result.groupMinLevel = e.int();
    }
    return result;
  },
  732034510: function (e) {
    var result = { _: `help.peerColorsNotModified` };
    return result;
  },
  16313608: function (e) {
    var result = { _: `help.peerColors` };
    result.hash = e.int();
    result.colors = e.vector(e.object);
    return result;
  },
  1620104917: function (e) {
    var result = { _: `storyReaction` };
    result.peerId = e.object();
    result.date = e.int();
    result.reaction = e.object();
    return result;
  },
  3148555843: function (e) {
    var result = { _: `storyReactionPublicForward` };
    result.message = e.object();
    return result;
  },
  3486322451: function (e) {
    var result = { _: `storyReactionPublicRepost` };
    result.peerId = e.object();
    result.story = e.object();
    return result;
  },
  2858383516: function (e) {
    var result = { _: `stories.storyReactionsList` };
    var t = e.uint();
    result.flags = t;
    result.count = e.int();
    result.reactions = e.vector(e.object);
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    if (t & 1) {
      result.nextOffset = e.string();
    }
    return result;
  },
  3179793260: function (e) {
    var result = { _: `savedDialog` };
    var t = e.uint();
    result.flags = t;
    result.pinned = !!(t & 4);
    result.peer = e.object();
    result.topMessage = e.int();
    return result;
  },
  1681948327: function (e) {
    var result = { _: `monoForumDialog` };
    var t = e.uint();
    result.flags = t;
    result.unreadMark = !!(t & 8);
    result.nopaidMessagesException = !!(t & 16);
    result.peer = e.object();
    result.topMessage = e.int();
    result.readInboxMaxId = e.int();
    result.readOutboxMaxId = e.int();
    result.unreadCount = e.int();
    result.unreadReactionsCount = e.int();
    if (t & 2) {
      result.draft = e.object();
    }
    return result;
  },
  4164608545: function (e) {
    var result = { _: `messages.savedDialogs` };
    result.dialogs = e.vector(e.object);
    result.messages = e.vector(e.object);
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  1153080793: function (e) {
    var result = { _: `messages.savedDialogsSlice` };
    result.count = e.int();
    result.dialogs = e.vector(e.object);
    result.messages = e.vector(e.object);
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  3223285736: function (e) {
    var result = { _: `messages.savedDialogsNotModified` };
    result.count = e.int();
    return result;
  },
  3413112872: function (e) {
    var result = { _: `savedReactionTag` };
    var t = e.uint();
    result.flags = t;
    result.reaction = e.object();
    if (t & 1) {
      result.title = e.string();
    }
    result.count = e.int();
    return result;
  },
  2291882479: function (e) {
    var result = { _: `messages.savedReactionTagsNotModified` };
    return result;
  },
  844731658: function (e) {
    var result = { _: `messages.savedReactionTags` };
    result.tags = e.vector(e.object);
    result.hash = e.long();
    return result;
  },
  1001931436: function (e) {
    var result = { _: `outboxReadDate` };
    result.date = e.int();
    return result;
  },
  3700114639: function (e) {
    var result = { _: `smsjobs.eligibleToJoin` };
    result.termsUrl = e.string();
    result.monthlySentSms = e.int();
    return result;
  },
  720277905: function (e) {
    var result = { _: `smsjobs.status` };
    var t = e.uint();
    result.flags = t;
    result.allowInternational = !!(t & 1);
    result.recentSent = e.int();
    result.recentSince = e.int();
    result.recentRemains = e.int();
    result.totalSent = e.int();
    result.totalSince = e.int();
    if (t & 2) {
      result.lastGiftSlug = e.string();
    }
    result.termsUrl = e.string();
    return result;
  },
  3869372088: function (e) {
    var result = { _: `smsJob` };
    result.jobId = e.string();
    result.phoneNumber = e.string();
    result.text = e.string();
    return result;
  },
  302717625: function (e) {
    var result = { _: `businessWeeklyOpen` };
    result.startMinute = e.int();
    result.endMinute = e.int();
    return result;
  },
  2358423704: function (e) {
    var result = { _: `businessWorkHours` };
    var t = e.uint();
    result.flags = t;
    result.openNow = !!(t & 1);
    result.timezoneId = e.string();
    result.weeklyOpen = e.vector(e.object);
    return result;
  },
  2891717367: function (e) {
    var result = { _: `businessLocation` };
    var t = e.uint();
    result.flags = t;
    if (t & 1) {
      result.geoPoint = e.object();
    }
    result.address = e.string();
    return result;
  },
  1871393450: function (e) {
    var result = { _: `inputBusinessRecipients` };
    var t = e.uint();
    result.flags = t;
    result.existingChats = !!(t & 1);
    result.newChats = !!(t & 2);
    result.contacts = !!(t & 4);
    result.nonContacts = !!(t & 8);
    result.excludeSelected = !!(t & 32);
    if (t & 16) {
      result.users = e.vector(e.object);
    }
    return result;
  },
  554733559: function (e) {
    var result = { _: `businessRecipients` };
    var t = e.uint();
    result.flags = t;
    result.existingChats = !!(t & 1);
    result.newChats = !!(t & 2);
    result.contacts = !!(t & 4);
    result.nonContacts = !!(t & 8);
    result.excludeSelected = !!(t & 32);
    if (t & 16) {
      result.users = e.vector(e.long);
    }
    return result;
  },
  3384402617: function (e) {
    var result = { _: `businessAwayMessageScheduleAlways` };
    return result;
  },
  3287479553: function (e) {
    var result = { _: `businessAwayMessageScheduleOutsideWorkHours` };
    return result;
  },
  3427638988: function (e) {
    var result = { _: `businessAwayMessageScheduleCustom` };
    result.startDate = e.int();
    result.endDate = e.int();
    return result;
  },
  26528571: function (e) {
    var result = { _: `inputBusinessGreetingMessage` };
    result.shortcutId = e.int();
    result.recipients = e.object();
    result.noActivityDays = e.int();
    return result;
  },
  3843664811: function (e) {
    var result = { _: `businessGreetingMessage` };
    result.shortcutId = e.int();
    result.recipients = e.object();
    result.noActivityDays = e.int();
    return result;
  },
  2200008160: function (e) {
    var result = { _: `inputBusinessAwayMessage` };
    var t = e.uint();
    result.flags = t;
    result.offlineOnly = !!(t & 1);
    result.shortcutId = e.int();
    result.schedule = e.object();
    result.recipients = e.object();
    return result;
  },
  4011158108: function (e) {
    var result = { _: `businessAwayMessage` };
    var t = e.uint();
    result.flags = t;
    result.offlineOnly = !!(t & 1);
    result.shortcutId = e.int();
    result.schedule = e.object();
    result.recipients = e.object();
    return result;
  },
  4287793653: function (e) {
    var result = { _: `timezone` };
    result.id = e.string();
    result.name = e.string();
    result.utcOffset = e.int();
    return result;
  },
  2533820620: function (e) {
    var result = { _: `help.timezonesListNotModified` };
    return result;
  },
  2071260529: function (e) {
    var result = { _: `help.timezonesList` };
    result.timezones = e.vector(e.object);
    result.hash = e.int();
    return result;
  },
  110563371: function (e) {
    var result = { _: `quickReply` };
    result.shortcutId = e.int();
    result.shortcut = e.string();
    result.topMessage = e.int();
    result.count = e.int();
    return result;
  },
  609840449: function (e) {
    var result = { _: `inputQuickReplyShortcut` };
    result.shortcut = e.string();
    return result;
  },
  18418929: function (e) {
    var result = { _: `inputQuickReplyShortcutId` };
    result.shortcutId = e.int();
    return result;
  },
  3331155605: function (e) {
    var result = { _: `messages.quickReplies` };
    result.quickReplies = e.vector(e.object);
    result.messages = e.vector(e.object);
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  1603398491: function (e) {
    var result = { _: `messages.quickRepliesNotModified` };
    return result;
  },
  54448129: function (e) {
    var result = { _: `connectedBot` };
    var t = e.uint();
    result.flags = t;
    result.botId = e.long();
    result.recipients = e.object();
    result.rights = e.object();
    if (t & 1) {
      result.device = e.string();
    }
    if (t & 2) {
      result.date = e.int();
    }
    if (t & 4) {
      result.location = e.string();
    }
    return result;
  },
  400029819: function (e) {
    var result = { _: `account.connectedBots` };
    result.connectedBots = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  718878489: function (e) {
    var result = { _: `messages.dialogFilters` };
    var t = e.uint();
    result.flags = t;
    result.tagsEnabled = !!(t & 1);
    result.filters = e.vector(e.object);
    return result;
  },
  1821253126: function (e) {
    var result = { _: `birthday` };
    var t = e.uint();
    result.flags = t;
    result.day = e.int();
    result.month = e.int();
    if (t & 1) {
      result.year = e.int();
    }
    return result;
  },
  2402595573: function (e) {
    var result = { _: `botBusinessConnection` };
    var t = e.uint();
    result.flags = t;
    result.disabled = !!(t & 2);
    result.connectionId = e.string();
    result.userId = e.long();
    result.dcId = e.int();
    result.date = e.int();
    if (t & 4) {
      result.rights = e.object();
    }
    return result;
  },
  163867085: function (e) {
    var result = { _: `inputBusinessIntro` };
    var t = e.uint();
    result.flags = t;
    result.title = e.string();
    result.description = e.string();
    if (t & 1) {
      result.sticker = e.object();
    }
    return result;
  },
  1510606445: function (e) {
    var result = { _: `businessIntro` };
    var t = e.uint();
    result.flags = t;
    result.title = e.string();
    result.description = e.string();
    if (t & 1) {
      result.sticker = e.object();
    }
    return result;
  },
  4211040925: function (e) {
    var result = { _: `messages.myStickers` };
    result.count = e.int();
    result.sets = e.vector(e.object);
    return result;
  },
  3818152105: function (e) {
    var result = { _: `inputCollectibleUsername` };
    result.username = e.string();
    return result;
  },
  2732725412: function (e) {
    var result = { _: `inputCollectiblePhone` };
    result.phone = e.string();
    return result;
  },
  1857945489: function (e) {
    var result = { _: `fragment.collectibleInfo` };
    result.purchaseDate = e.int();
    result.currency = e.string();
    result.amount = e.long();
    result.cryptoCurrency = e.string();
    result.cryptoAmount = e.long();
    result.url = e.string();
    return result;
  },
  3303379486: function (e) {
    var result = { _: `inputBusinessBotRecipients` };
    var t = e.uint();
    result.flags = t;
    result.existingChats = !!(t & 1);
    result.newChats = !!(t & 2);
    result.contacts = !!(t & 4);
    result.nonContacts = !!(t & 8);
    result.excludeSelected = !!(t & 32);
    if (t & 16) {
      result.users = e.vector(e.object);
    }
    if (t & 64) {
      result.excludeUsers = e.vector(e.object);
    }
    return result;
  },
  3096245107: function (e) {
    var result = { _: `businessBotRecipients` };
    var t = e.uint();
    result.flags = t;
    result.existingChats = !!(t & 1);
    result.newChats = !!(t & 2);
    result.contacts = !!(t & 4);
    result.nonContacts = !!(t & 8);
    result.excludeSelected = !!(t & 32);
    if (t & 16) {
      result.users = e.vector(e.long);
    }
    if (t & 64) {
      result.excludeUsers = e.vector(e.long);
    }
    return result;
  },
  496600883: function (e) {
    var result = { _: `contactBirthday` };
    result.contactId = e.long();
    result.birthday = e.object();
    return result;
  },
  290452237: function (e) {
    var result = { _: `contacts.contactBirthdays` };
    result.contacts = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  1653379620: function (e) {
    var result = { _: `missingInvitee` };
    var t = e.uint();
    result.flags = t;
    result.premiumWouldAllowInvite = !!(t & 1);
    result.premiumRequiredForPm = !!(t & 2);
    result.userId = e.long();
    return result;
  },
  2136862630: function (e) {
    var result = { _: `messages.invitedUsers` };
    result.updates = e.object();
    result.missingInvitees = e.vector(e.object);
    return result;
  },
  292003751: function (e) {
    var result = { _: `inputBusinessChatLink` };
    var t = e.uint();
    result.flags = t;
    result.message = e.string();
    if (t & 1) {
      result.entities = e.vector(e.object);
    }
    if (t & 2) {
      result.title = e.string();
    }
    return result;
  },
  3031328367: function (e) {
    var result = { _: `businessChatLink` };
    var t = e.uint();
    result.flags = t;
    result.link = e.string();
    result.message = e.string();
    if (t & 1) {
      result.entities = e.vector(e.object);
    }
    if (t & 2) {
      result.title = e.string();
    }
    result.views = e.int();
    return result;
  },
  3963855569: function (e) {
    var result = { _: `account.businessChatLinks` };
    result.links = e.vector(e.object);
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  2586029857: function (e) {
    var result = { _: `account.resolvedBusinessChatLinks` };
    var t = e.uint();
    result.flags = t;
    result.peer = e.object();
    result.message = e.string();
    if (t & 1) {
      result.entities = e.vector(e.object);
    }
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  3593466986: function (e) {
    var result = { _: `requestedPeerUser` };
    var t = e.uint();
    result.flags = t;
    result.userId = e.long();
    if (t & 1) {
      result.firstName = e.string();
    }
    if (t & 1) {
      result.lastName = e.string();
    }
    if (t & 2) {
      result.username = e.string();
    }
    if (t & 4) {
      result.photo = e.object();
    }
    return result;
  },
  1929860175: function (e) {
    var result = { _: `requestedPeerChat` };
    var t = e.uint();
    result.flags = t;
    result.chatId = e.long();
    if (t & 1) {
      result.title = e.string();
    }
    if (t & 4) {
      result.photo = e.object();
    }
    return result;
  },
  2342781924: function (e) {
    var result = { _: `requestedPeerChannel` };
    var t = e.uint();
    result.flags = t;
    result.channelId = e.long();
    if (t & 1) {
      result.title = e.string();
    }
    if (t & 2) {
      result.username = e.string();
    }
    if (t & 4) {
      result.photo = e.object();
    }
    return result;
  },
  1124938064: function (e) {
    var result = { _: `sponsoredMessageReportOption` };
    result.text = e.string();
    result.option = e.bytes();
    return result;
  },
  2221907522: function (e) {
    var result = { _: `channels.sponsoredMessageReportResultChooseOption` };
    result.title = e.string();
    result.options = e.vector(e.object);
    return result;
  },
  1044107055: function (e) {
    var result = { _: `channels.sponsoredMessageReportResultAdsHidden` };
    return result;
  },
  2910423113: function (e) {
    var result = { _: `channels.sponsoredMessageReportResultReported` };
    return result;
  },
  3133384218: function (e) {
    var result = { _: `reactionNotificationsFromContacts` };
    return result;
  },
  1268654752: function (e) {
    var result = { _: `reactionNotificationsFromAll` };
    return result;
  },
  1910827608: function (e) {
    var result = { _: `reactionsNotifySettings` };
    var t = e.uint();
    result.flags = t;
    if (t & 1) {
      result.messagesNotifyFrom = e.object();
    }
    if (t & 2) {
      result.storiesNotifyFrom = e.object();
    }
    if (t & 4) {
      result.pollVotesNotifyFrom = e.object();
    }
    result.sound = e.object();
    result.showPreviews = e.object();
    return result;
  },
  2479088254: function (e) {
    var result = { _: `availableEffect` };
    var t = e.uint();
    result.flags = t;
    result.premiumRequired = !!(t & 4);
    result.id = e.long();
    result.emoticon = e.string();
    if (t & 1) {
      result.staticIconId = e.long();
    }
    result.effectStickerId = e.long();
    if (t & 2) {
      result.effectAnimationId = e.long();
    }
    return result;
  },
  3522009691: function (e) {
    var result = { _: `messages.availableEffectsNotModified` };
    return result;
  },
  3185271150: function (e) {
    var result = { _: `messages.availableEffects` };
    result.hash = e.int();
    result.effects = e.vector(e.object);
    result.documents = e.vector(e.object);
    return result;
  },
  3097230543: function (e) {
    var result = { _: `factCheck` };
    var t = e.uint();
    result.flags = t;
    result.needCheck = !!(t & 1);
    if (t & 2) {
      result.country = e.string();
    }
    if (t & 2) {
      result.text = e.object();
    }
    result.hash = e.long();
    return result;
  },
  2515714020: function (e) {
    var result = { _: `starsTransactionPeerUnsupported` };
    return result;
  },
  3025646453: function (e) {
    var result = { _: `starsTransactionPeerAppStore` };
    return result;
  },
  2069236235: function (e) {
    var result = { _: `starsTransactionPeerPlayMarket` };
    return result;
  },
  621656824: function (e) {
    var result = { _: `starsTransactionPeerPremiumBot` };
    return result;
  },
  3912227074: function (e) {
    var result = { _: `starsTransactionPeerFragment` };
    return result;
  },
  3624771933: function (e) {
    var result = { _: `starsTransactionPeer` };
    result.peer = e.object();
    return result;
  },
  1617438738: function (e) {
    var result = { _: `starsTransactionPeerAds` };
    return result;
  },
  4184308397: function (e) {
    var result = { _: `starsTransactionPeerAPI` };
    return result;
  },
  198776256: function (e) {
    var result = { _: `starsTopupOption` };
    var t = e.uint();
    result.flags = t;
    result.extended = !!(t & 2);
    result.stars = e.long();
    if (t & 1) {
      result.storeProduct = e.string();
    }
    result.currency = e.string();
    result.amount = e.long();
    return result;
  },
  325426864: function (e) {
    var result = { _: `starsTransaction` };
    var t = e.uint();
    result.flags = t;
    result.refund = !!(t & 8);
    result.pending = !!(t & 16);
    result.failed = !!(t & 64);
    result.gift = !!(t & 1024);
    result.reaction = !!(t & 2048);
    result.stargiftUpgrade = !!(t & 262144);
    result.businessTransfer = !!(t & 2097152);
    result.stargiftResale = !!(t & 4194304);
    result.postsSearch = !!(t & 16777216);
    result.stargiftPrepaidUpgrade = !!(t & 33554432);
    result.stargiftDropOriginalDetails = !!(t & 67108864);
    result.phonegroupMessage = !!(t & 134217728);
    result.stargiftAuctionBid = !!(t & 268435456);
    result.offer = !!(t & 536870912);
    result.id = e.string();
    result.amount = e.object();
    result.date = e.int();
    result.peer = e.object();
    if (t & 1) {
      result.title = e.string();
    }
    if (t & 2) {
      result.description = e.string();
    }
    if (t & 4) {
      result.photo = e.object();
    }
    if (t & 32) {
      result.transactionDate = e.int();
    }
    if (t & 32) {
      result.transactionUrl = e.string();
    }
    if (t & 128) {
      result.botPayload = e.bytes();
    }
    if (t & 256) {
      result.msgId = e.int();
    }
    if (t & 512) {
      result.extendedMedia = e.vector(e.object);
    }
    if (t & 4096) {
      result.subscriptionPeriod = e.int();
    }
    if (t & 8192) {
      result.giveawayPostId = e.int();
    }
    if (t & 16384) {
      result.stargift = e.object();
    }
    if (t & 32768) {
      result.floodskipNumber = e.int();
    }
    if (t & 65536) {
      result.starrefCommissionPermille = e.int();
    }
    if (t & 131072) {
      result.starrefPeer = e.object();
    }
    if (t & 131072) {
      result.starrefAmount = e.object();
    }
    if (t & 524288) {
      result.paidMessages = e.int();
    }
    if (t & 1048576) {
      result.premiumGiftMonths = e.int();
    }
    if (t & 8388608) {
      result.adsProceedsFromDate = e.int();
    }
    if (t & 8388608) {
      result.adsProceedsToDate = e.int();
    }
    return result;
  },
  1822222573: function (e) {
    var result = { _: `payments.starsStatus` };
    var t = e.uint();
    result.flags = t;
    result.balance = e.object();
    if (t & 2) {
      result.subscriptions = e.vector(e.object);
    }
    if (t & 4) {
      result.subscriptionsNextOffset = e.string();
    }
    if (t & 16) {
      result.subscriptionsMissingBalance = e.long();
    }
    if (t & 8) {
      result.history = e.vector(e.object);
    }
    if (t & 1) {
      result.nextOffset = e.string();
    }
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  3900361664: function (e) {
    var result = { _: `foundStory` };
    result.peer = e.object();
    result.story = e.object();
    return result;
  },
  3806230327: function (e) {
    var result = { _: `stories.foundStories` };
    var t = e.uint();
    result.flags = t;
    result.count = e.int();
    result.stories = e.vector(e.object);
    if (t & 1) {
      result.nextOffset = e.string();
    }
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  3729546643: function (e) {
    var result = { _: `geoPointAddress` };
    var t = e.uint();
    result.flags = t;
    result.countryIso2 = e.string();
    if (t & 1) {
      result.state = e.string();
    }
    if (t & 2) {
      result.city = e.string();
    }
    if (t & 4) {
      result.street = e.string();
    }
    return result;
  },
  4273886353: function (e) {
    var result = { _: `starsRevenueStatus` };
    var t = e.uint();
    result.flags = t;
    result.withdrawalEnabled = !!(t & 1);
    result.currentBalance = e.object();
    result.availableBalance = e.object();
    result.overallRevenue = e.object();
    if (t & 2) {
      result.nextWithdrawalAt = e.int();
    }
    return result;
  },
  1814066038: function (e) {
    var result = { _: `payments.starsRevenueStats` };
    var t = e.uint();
    result.flags = t;
    if (t & 1) {
      result.topHoursGraph = e.object();
    }
    result.revenueGraph = e.object();
    result.status = e.object();
    result.usdRate = e.double();
    return result;
  },
  497778871: function (e) {
    var result = { _: `payments.starsRevenueWithdrawalUrl` };
    result.url = e.string();
    return result;
  },
  961445665: function (e) {
    var result = { _: `payments.starsRevenueAdsAccountUrl` };
    result.url = e.string();
    return result;
  },
  543876817: function (e) {
    var result = { _: `inputStarsTransaction` };
    var t = e.uint();
    result.flags = t;
    result.refund = !!(t & 1);
    result.id = e.string();
    return result;
  },
  1577421297: function (e) {
    var result = { _: `starsGiftOption` };
    var t = e.uint();
    result.flags = t;
    result.extended = !!(t & 2);
    result.stars = e.long();
    if (t & 1) {
      result.storeProduct = e.string();
    }
    result.currency = e.string();
    result.amount = e.long();
    return result;
  },
  428978491: function (e) {
    var result = { _: `bots.popularAppBots` };
    var t = e.uint();
    result.flags = t;
    if (t & 1) {
      result.nextOffset = e.string();
    }
    result.users = e.vector(e.object);
    return result;
  },
  602479523: function (e) {
    var result = { _: `botPreviewMedia` };
    result.date = e.int();
    result.media = e.object();
    return result;
  },
  212278628: function (e) {
    var result = { _: `bots.previewInfo` };
    result.media = e.vector(e.object);
    result.langCodes = e.vector(e.string);
    return result;
  },
  88173912: function (e) {
    var result = { _: `starsSubscriptionPricing` };
    result.period = e.int();
    result.amount = e.long();
    return result;
  },
  779004698: function (e) {
    var result = { _: `starsSubscription` };
    var t = e.uint();
    result.flags = t;
    result.canceled = !!(t & 1);
    result.canRefulfill = !!(t & 2);
    result.missingBalance = !!(t & 4);
    result.botCanceled = !!(t & 128);
    result.id = e.string();
    result.peer = e.object();
    result.untilDate = e.int();
    result.pricing = e.object();
    if (t & 8) {
      result.chatInviteHash = e.string();
    }
    if (t & 16) {
      result.title = e.string();
    }
    if (t & 32) {
      result.photo = e.object();
    }
    if (t & 64) {
      result.invoiceSlug = e.string();
    }
    return result;
  },
  1269016922: function (e) {
    var result = { _: `messageReactor` };
    var t = e.uint();
    result.flags = t;
    result.top = !!(t & 1);
    result.my = !!(t & 2);
    result.anonymous = !!(t & 4);
    if (t & 8) {
      result.peerId = e.object();
    }
    result.count = e.int();
    return result;
  },
  2496562474: function (e) {
    var result = { _: `starsGiveawayOption` };
    var t = e.uint();
    result.flags = t;
    result.extended = !!(t & 1);
    result.default = !!(t & 2);
    result.stars = e.long();
    result.yearlyBoosts = e.int();
    if (t & 4) {
      result.storeProduct = e.string();
    }
    result.currency = e.string();
    result.amount = e.long();
    result.winners = e.vector(e.object);
    return result;
  },
  1411605001: function (e) {
    var result = { _: `starsGiveawayWinnersOption` };
    var t = e.uint();
    result.flags = t;
    result.default = !!(t & 1);
    result.users = e.int();
    result.perUserStars = e.long();
    return result;
  },
  825922887: function (e) {
    var result = { _: `starGift` };
    var t = e.uint();
    result.flags = t;
    result.limited = !!(t & 1);
    result.soldOut = !!(t & 2);
    result.birthday = !!(t & 4);
    result.requirePremium = !!(t & 128);
    result.limitedPerUser = !!(t & 256);
    result.peerColorAvailable = !!(t & 1024);
    result.auction = !!(t & 2048);
    result.id = e.long();
    result.sticker = e.object();
    result.stars = e.long();
    if (t & 1) {
      result.availabilityRemains = e.int();
    }
    if (t & 1) {
      result.availabilityTotal = e.int();
    }
    if (t & 16) {
      result.availabilityResale = e.long();
    }
    result.convertStars = e.long();
    if (t & 2) {
      result.firstSaleDate = e.int();
    }
    if (t & 2) {
      result.lastSaleDate = e.int();
    }
    if (t & 8) {
      result.upgradeStars = e.long();
    }
    if (t & 16) {
      result.resellMinStars = e.long();
    }
    if (t & 32) {
      result.title = e.string();
    }
    if (t & 64) {
      result.releasedBy = e.object();
    }
    if (t & 256) {
      result.perUserTotal = e.int();
    }
    if (t & 256) {
      result.perUserRemains = e.int();
    }
    if (t & 512) {
      result.lockedUntilDate = e.int();
    }
    if (t & 2048) {
      result.auctionSlug = e.string();
    }
    if (t & 2048) {
      result.giftsPerRound = e.int();
    }
    if (t & 2048) {
      result.auctionStartDate = e.int();
    }
    if (t & 4096) {
      result.upgradeVariants = e.int();
    }
    if (t & 8192) {
      result.background = e.object();
    }
    return result;
  },
  2247141837: function (e) {
    var result = { _: `starGiftUnique` };
    var t = e.uint();
    result.flags = t;
    result.requirePremium = !!(t & 64);
    result.resaleTonOnly = !!(t & 128);
    result.themeAvailable = !!(t & 512);
    result.burned = !!(t & 16384);
    result.crafted = !!(t & 32768);
    result.id = e.long();
    result.giftId = e.long();
    result.title = e.string();
    result.slug = e.string();
    result.num = e.int();
    if (t & 1) {
      result.ownerId = e.object();
    }
    if (t & 2) {
      result.ownerName = e.string();
    }
    if (t & 4) {
      result.ownerAddress = e.string();
    }
    result.attributes = e.vector(e.object);
    result.availabilityIssued = e.int();
    result.availabilityTotal = e.int();
    if (t & 8) {
      result.giftAddress = e.string();
    }
    if (t & 16) {
      result.resellAmount = e.vector(e.object);
    }
    if (t & 32) {
      result.releasedBy = e.object();
    }
    if (t & 256) {
      result.valueAmount = e.long();
    }
    if (t & 256) {
      result.valueCurrency = e.string();
    }
    if (t & 256) {
      result.valueUsdAmount = e.long();
    }
    if (t & 1024) {
      result.themePeer = e.object();
    }
    if (t & 2048) {
      result.peerColor = e.object();
    }
    if (t & 4096) {
      result.hostId = e.object();
    }
    if (t & 8192) {
      result.offerMinStars = e.int();
    }
    if (t & 65536) {
      result.craftChancePermille = e.int();
    }
    return result;
  },
  2743640936: function (e) {
    var result = { _: `payments.starGiftsNotModified` };
    return result;
  },
  785918357: function (e) {
    var result = { _: `payments.starGifts` };
    result.hash = e.int();
    result.gifts = e.vector(e.object);
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  2030298073: function (e) {
    var result = { _: `messageReportOption` };
    result.text = e.string();
    result.option = e.bytes();
    return result;
  },
  4041531574: function (e) {
    var result = { _: `reportResultChooseOption` };
    result.title = e.string();
    result.options = e.vector(e.object);
    return result;
  },
  1862904881: function (e) {
    var result = { _: `reportResultAddComment` };
    var t = e.uint();
    result.flags = t;
    result.optional = !!(t & 1);
    result.option = e.bytes();
    return result;
  },
  2377333835: function (e) {
    var result = { _: `reportResultReported` };
    return result;
  },
  2395931921: function (e) {
    var result = { _: `messages.botPreparedInlineMessage` };
    result.id = e.string();
    result.expireDate = e.int();
    return result;
  },
  4283920525: function (e) {
    var result = { _: `messages.preparedInlineMessage` };
    result.queryId = e.long();
    result.result = e.object();
    result.peerTypes = e.vector(e.object);
    result.cacheTime = e.int();
    result.users = e.vector(e.object);
    return result;
  },
  3382384976: function (e) {
    var result = { _: `botAppSettings` };
    var t = e.uint();
    result.flags = t;
    if (t & 1) {
      result.placeholderPath = e.bytes();
    }
    if (t & 2) {
      result.backgroundColor = e.int();
    }
    if (t & 4) {
      result.backgroundDarkColor = e.int();
    }
    if (t & 8) {
      result.headerColor = e.int();
    }
    if (t & 16) {
      result.headerDarkColor = e.int();
    }
    return result;
  },
  3708577522: function (e) {
    var result = { _: `starRefProgram` };
    var t = e.uint();
    result.flags = t;
    result.botId = e.long();
    result.commissionPermille = e.int();
    if (t & 1) {
      result.durationMonths = e.int();
    }
    if (t & 2) {
      result.endDate = e.int();
    }
    if (t & 4) {
      result.dailyRevenuePerUser = e.object();
    }
    return result;
  },
  429997937: function (e) {
    var result = { _: `connectedBotStarRef` };
    var t = e.uint();
    result.flags = t;
    result.revoked = !!(t & 2);
    result.url = e.string();
    result.date = e.int();
    result.botId = e.long();
    result.commissionPermille = e.int();
    if (t & 1) {
      result.durationMonths = e.int();
    }
    result.participants = e.long();
    result.revenue = e.long();
    return result;
  },
  2564155933: function (e) {
    var result = { _: `payments.connectedStarRefBots` };
    result.count = e.int();
    result.connectedBots = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  3033913433: function (e) {
    var result = { _: `payments.suggestedStarRefBots` };
    var t = e.uint();
    result.flags = t;
    result.count = e.int();
    result.suggestedBots = e.vector(e.object);
    result.users = e.vector(e.object);
    if (t & 1) {
      result.nextOffset = e.string();
    }
    return result;
  },
  3149313187: function (e) {
    var result = { _: `starsAmount` };
    result.amount = e.long();
    result.nanos = e.int();
    return result;
  },
  1957618656: function (e) {
    var result = { _: `starsTonAmount` };
    result.amount = e.long();
    return result;
  },
  1611711796: function (e) {
    var result = { _: `messages.foundStickersNotModified` };
    var t = e.uint();
    result.flags = t;
    if (t & 1) {
      result.nextOffset = e.int();
    }
    return result;
  },
  2194268816: function (e) {
    var result = { _: `messages.foundStickers` };
    var t = e.uint();
    result.flags = t;
    if (t & 1) {
      result.nextOffset = e.int();
    }
    result.hash = e.long();
    result.stickers = e.vector(e.object);
    return result;
  },
  2703945727: function (e) {
    var result = { _: `botVerifierSettings` };
    var t = e.uint();
    result.flags = t;
    result.canModifyCustomDescription = !!(t & 2);
    result.icon = e.long();
    result.company = e.string();
    if (t & 1) {
      result.customDescription = e.object();
    }
    return result;
  },
  4146990809: function (e) {
    var result = { _: `botVerification` };
    result.botId = e.long();
    result.icon = e.long();
    result.description = e.object();
    return result;
  },
  1448235490: function (e) {
    var result = { _: `starGiftAttributeModel` };
    var t = e.uint();
    result.flags = t;
    result.crafted = !!(t & 1);
    result.name = e.string();
    result.document = e.object();
    result.rarity = e.object();
    return result;
  },
  1315997162: function (e) {
    var result = { _: `starGiftAttributePattern` };
    result.name = e.string();
    result.document = e.object();
    result.rarity = e.object();
    return result;
  },
  2670003428: function (e) {
    var result = { _: `starGiftAttributeBackdrop` };
    result.name = e.string();
    result.backdropId = e.int();
    result.centerColor = e.int();
    result.edgeColor = e.int();
    result.patternColor = e.int();
    result.textColor = e.int();
    result.rarity = e.object();
    return result;
  },
  3770675820: function (e) {
    var result = { _: `starGiftAttributeOriginalDetails` };
    var t = e.uint();
    result.flags = t;
    if (t & 1) {
      result.senderId = e.object();
    }
    result.recipientId = e.object();
    result.date = e.int();
    if (t & 2) {
      result.message = e.object();
    }
    return result;
  },
  1038213101: function (e) {
    var result = { _: `payments.starGiftUpgradePreview` };
    result.sampleAttributes = e.vector(e.object);
    result.prices = e.vector(e.object);
    result.nextPrices = e.vector(e.object);
    return result;
  },
  1658259128: function (e) {
    var result = { _: `users.users` };
    result.users = e.vector(e.object);
    return result;
  },
  828000628: function (e) {
    var result = { _: `users.usersSlice` };
    result.count = e.int();
    result.users = e.vector(e.object);
    return result;
  },
  1097619176: function (e) {
    var result = { _: `payments.uniqueStarGift` };
    result.gift = e.object();
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  2358937772: function (e) {
    var result = { _: `messages.webPagePreview` };
    result.media = e.object();
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  1105150972: function (e) {
    var result = { _: `savedStarGift` };
    var t = e.uint();
    result.flags = t;
    result.nameHidden = !!(t & 1);
    result.unsaved = !!(t & 32);
    result.refunded = !!(t & 512);
    result.canUpgrade = !!(t & 1024);
    result.pinnedToTop = !!(t & 4096);
    result.upgradeSeparate = !!(t & 131072);
    if (t & 2) {
      result.fromId = e.object();
    }
    result.date = e.int();
    result.gift = e.object();
    if (t & 4) {
      result.message = e.object();
    }
    if (t & 8) {
      result.msgId = e.int();
    }
    if (t & 2048) {
      result.savedId = e.long();
    }
    if (t & 16) {
      result.convertStars = e.long();
    }
    if (t & 64) {
      result.upgradeStars = e.long();
    }
    if (t & 128) {
      result.canExportAt = e.int();
    }
    if (t & 256) {
      result.transferStars = e.long();
    }
    if (t & 8192) {
      result.canTransferAt = e.int();
    }
    if (t & 16384) {
      result.canResellAt = e.int();
    }
    if (t & 32768) {
      result.collectionId = e.vector(e.int);
    }
    if (t & 65536) {
      result.prepaidUpgradeHash = e.string();
    }
    if (t & 262144) {
      result.dropOriginalDetailsStars = e.long();
    }
    if (t & 524288) {
      result.giftNum = e.int();
    }
    if (t & 1048576) {
      result.canCraftAt = e.int();
    }
    return result;
  },
  2515765681: function (e) {
    var result = { _: `payments.savedStarGifts` };
    var t = e.uint();
    result.flags = t;
    result.count = e.int();
    if (t & 2) {
      result.chatNotificationsEnabled = e.object();
    }
    result.gifts = e.vector(e.object);
    if (t & 1) {
      result.nextOffset = e.string();
    }
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  1764202389: function (e) {
    var result = { _: `inputSavedStarGiftUser` };
    result.msgId = e.int();
    return result;
  },
  4043418239: function (e) {
    var result = { _: `inputSavedStarGiftChat` };
    result.peer = e.object();
    result.savedId = e.long();
    return result;
  },
  545636920: function (e) {
    var result = { _: `inputSavedStarGiftSlug` };
    result.slug = e.string();
    return result;
  },
  2225748636: function (e) {
    var result = { _: `payments.starGiftWithdrawalUrl` };
    result.url = e.string();
    return result;
  },
  543872158: function (e) {
    var result = { _: `paidReactionPrivacyDefault` };
    return result;
  },
  520887001: function (e) {
    var result = { _: `paidReactionPrivacyAnonymous` };
    return result;
  },
  3698130160: function (e) {
    var result = { _: `paidReactionPrivacyPeer` };
    result.peer = e.object();
    return result;
  },
  504403720: function (e) {
    var result = { _: `account.paidMessagesRevenue` };
    result.starsAmount = e.long();
    return result;
  },
  84580409: function (e) {
    var result = { _: `requirementToContactEmpty` };
    return result;
  },
  3850495209: function (e) {
    var result = { _: `requirementToContactPremium` };
    return result;
  },
  3036053139: function (e) {
    var result = { _: `requirementToContactPaidMessages` };
    result.starsAmount = e.long();
    return result;
  },
  2690796791: function (e) {
    var result = { _: `businessBotRights` };
    var t = e.uint();
    result.flags = t;
    result.reply = !!(t & 1);
    result.readMessages = !!(t & 2);
    result.deleteSentMessages = !!(t & 4);
    result.deleteReceivedMessages = !!(t & 8);
    result.editName = !!(t & 16);
    result.editBio = !!(t & 32);
    result.editProfilePhoto = !!(t & 64);
    result.editUsername = !!(t & 128);
    result.viewGifts = !!(t & 256);
    result.sellGifts = !!(t & 512);
    result.changeGiftSettings = !!(t & 1024);
    result.transferAndUpgradeGifts = !!(t & 2048);
    result.transferStars = !!(t & 4096);
    result.manageStories = !!(t & 8192);
    return result;
  },
  1911715524: function (e) {
    var result = { _: `disallowedGiftsSettings` };
    var t = e.uint();
    result.flags = t;
    result.disallowUnlimitedStargifts = !!(t & 1);
    result.disallowLimitedStargifts = !!(t & 2);
    result.disallowUniqueStargifts = !!(t & 4);
    result.disallowPremiumGifts = !!(t & 8);
    result.disallowStargiftsFromChannels = !!(t & 16);
    return result;
  },
  3331786963: function (e) {
    var result = { _: `sponsoredPeer` };
    var t = e.uint();
    result.flags = t;
    result.randomId = e.bytes();
    result.peer = e.object();
    if (t & 1) {
      result.sponsorInfo = e.string();
    }
    if (t & 2) {
      result.additionalInfo = e.string();
    }
    return result;
  },
  3929191601: function (e) {
    var result = { _: `contacts.sponsoredPeersEmpty` };
    return result;
  },
  3942852740: function (e) {
    var result = { _: `contacts.sponsoredPeers` };
    result.peers = e.vector(e.object);
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  1219145276: function (e) {
    var result = { _: `starGiftAttributeIdModel` };
    result.documentId = e.long();
    return result;
  },
  1242965043: function (e) {
    var result = { _: `starGiftAttributeIdPattern` };
    result.documentId = e.long();
    return result;
  },
  520210263: function (e) {
    var result = { _: `starGiftAttributeIdBackdrop` };
    result.backdropId = e.int();
    return result;
  },
  783398488: function (e) {
    var result = { _: `starGiftAttributeCounter` };
    result.attribute = e.object();
    result.count = e.int();
    return result;
  },
  2491028191: function (e) {
    var result = { _: `payments.resaleStarGifts` };
    var t = e.uint();
    result.flags = t;
    result.count = e.int();
    result.gifts = e.vector(e.object);
    if (t & 1) {
      result.nextOffset = e.string();
    }
    if (t & 2) {
      result.attributes = e.vector(e.object);
    }
    if (t & 2) {
      result.attributesHash = e.long();
    }
    result.chats = e.vector(e.object);
    if (t & 4) {
      result.counters = e.vector(e.object);
    }
    result.users = e.vector(e.object);
    return result;
  },
  3280453710: function (e) {
    var result = { _: `stories.canSendStoryCount` };
    result.countRemains = e.int();
    return result;
  },
  3890753042: function (e) {
    var result = { _: `pendingSuggestion` };
    result.suggestion = e.string();
    result.title = e.object();
    result.description = e.object();
    result.url = e.string();
    return result;
  },
  3416892719: function (e) {
    var result = { _: `todoItem` };
    result.id = e.int();
    result.title = e.object();
    return result;
  },
  1236871718: function (e) {
    var result = { _: `todoList` };
    var t = e.uint();
    result.flags = t;
    result.othersCanAppend = !!(t & 1);
    result.othersCanComplete = !!(t & 2);
    result.title = e.object();
    result.list = e.vector(e.object);
    return result;
  },
  572241380: function (e) {
    var result = { _: `todoCompletion` };
    result.id = e.int();
    result.completedBy = e.object();
    result.date = e.int();
    return result;
  },
  244201445: function (e) {
    var result = { _: `suggestedPost` };
    var t = e.uint();
    result.flags = t;
    result.accepted = !!(t & 2);
    result.rejected = !!(t & 4);
    if (t & 8) {
      result.price = e.object();
    }
    if (t & 1) {
      result.scheduleDate = e.int();
    }
    return result;
  },
  453922567: function (e) {
    var result = { _: `starsRating` };
    var t = e.uint();
    result.flags = t;
    result.level = e.int();
    result.currentLevelStars = e.long();
    result.stars = e.long();
    if (t & 1) {
      result.nextLevelStars = e.long();
    }
    return result;
  },
  2641040304: function (e) {
    var result = { _: `starGiftCollection` };
    var t = e.uint();
    result.flags = t;
    result.collectionId = e.int();
    result.title = e.string();
    if (t & 1) {
      result.icon = e.object();
    }
    result.giftsCount = e.int();
    result.hash = e.long();
    return result;
  },
  2696564503: function (e) {
    var result = { _: `payments.starGiftCollectionsNotModified` };
    return result;
  },
  2317955827: function (e) {
    var result = { _: `payments.starGiftCollections` };
    result.collections = e.vector(e.object);
    return result;
  },
  2468704346: function (e) {
    var result = { _: `storyAlbum` };
    var t = e.uint();
    result.flags = t;
    result.albumId = e.int();
    result.title = e.string();
    if (t & 1) {
      result.iconPhoto = e.object();
    }
    if (t & 2) {
      result.iconVideo = e.object();
    }
    return result;
  },
  1448008427: function (e) {
    var result = { _: `stories.albumsNotModified` };
    return result;
  },
  3281549882: function (e) {
    var result = { _: `stories.albums` };
    result.hash = e.long();
    result.albums = e.vector(e.object);
    return result;
  },
  1040931690: function (e) {
    var result = { _: `searchPostsFlood` };
    var t = e.uint();
    result.flags = t;
    result.queryIsFree = !!(t & 1);
    result.totalDaily = e.int();
    result.remains = e.int();
    if (t & 2) {
      result.waitTill = e.int();
    }
    result.starsAmount = e.long();
    return result;
  },
  1362093126: function (e) {
    var result = { _: `payments.uniqueStarGiftValueInfo` };
    var t = e.uint();
    result.flags = t;
    result.lastSaleOnFragment = !!(t & 2);
    result.valueIsAverage = !!(t & 64);
    result.currency = e.string();
    result.value = e.long();
    result.initialSaleDate = e.int();
    result.initialSaleStars = e.long();
    result.initialSalePrice = e.long();
    if (t & 1) {
      result.lastSaleDate = e.int();
    }
    if (t & 1) {
      result.lastSalePrice = e.long();
    }
    if (t & 4) {
      result.floorPrice = e.long();
    }
    if (t & 8) {
      result.averagePrice = e.long();
    }
    if (t & 16) {
      result.listedCount = e.int();
    }
    if (t & 32) {
      result.fragmentListedCount = e.int();
    }
    if (t & 32) {
      result.fragmentListedUrl = e.string();
    }
    return result;
  },
  3113014934: function (e) {
    var result = { _: `profileTabPosts` };
    return result;
  },
  1296815210: function (e) {
    var result = { _: `profileTabGifts` };
    return result;
  },
  1925597525: function (e) {
    var result = { _: `profileTabMedia` };
    return result;
  },
  2872286208: function (e) {
    var result = { _: `profileTabFiles` };
    return result;
  },
  2670187118: function (e) {
    var result = { _: `profileTabMusic` };
    return result;
  },
  3833006382: function (e) {
    var result = { _: `profileTabVoice` };
    return result;
  },
  3546637465: function (e) {
    var result = { _: `profileTabLinks` };
    return result;
  },
  2730555029: function (e) {
    var result = { _: `profileTabGifs` };
    return result;
  },
  3817310884: function (e) {
    var result = { _: `users.savedMusicNotModified` };
    result.count = e.int();
    return result;
  },
  883094167: function (e) {
    var result = { _: `users.savedMusic` };
    result.count = e.int();
    result.documents = e.vector(e.object);
    return result;
  },
  1338514798: function (e) {
    var result = { _: `account.savedMusicIdsNotModified` };
    return result;
  },
  2576180790: function (e) {
    var result = { _: `account.savedMusicIds` };
    result.ids = e.vector(e.long);
    return result;
  },
  927967149: function (e) {
    var result = { _: `payments.checkCanSendGiftResultOk` };
    return result;
  },
  3588588148: function (e) {
    var result = { _: `payments.checkCanSendGiftResultFail` };
    result.reason = e.object();
    return result;
  },
  2200339587: function (e) {
    var result = { _: `inputChatThemeEmpty` };
    return result;
  },
  3376277852: function (e) {
    var result = { _: `inputChatTheme` };
    result.emoticon = e.string();
    return result;
  },
  2279989220: function (e) {
    var result = { _: `inputChatThemeUniqueGift` };
    result.slug = e.string();
    return result;
  },
  2582262557: function (e) {
    var result = { _: `starGiftUpgradePrice` };
    result.date = e.int();
    result.upgradeStars = e.long();
    return result;
  },
  445316222: function (e) {
    var result = { _: `groupCallMessage` };
    var t = e.uint();
    result.flags = t;
    result.fromAdmin = !!(t & 2);
    result.id = e.int();
    result.fromId = e.object();
    result.date = e.int();
    result.message = e.object();
    if (t & 1) {
      result.paidMessageStars = e.long();
    }
    return result;
  },
  3997371525: function (e) {
    var result = { _: `groupCallDonor` };
    var t = e.uint();
    result.flags = t;
    result.top = !!(t & 1);
    result.my = !!(t & 2);
    if (t & 8) {
      result.peerId = e.object();
    }
    result.stars = e.long();
    return result;
  },
  2635971878: function (e) {
    var result = { _: `phone.groupCallStars` };
    result.totalStars = e.long();
    result.topDonors = e.vector(e.object);
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  1897752877: function (e) {
    var result = { _: `recentStory` };
    var t = e.uint();
    result.flags = t;
    result.live = !!(t & 1);
    if (t & 2) {
      result.maxId = e.int();
    }
    return result;
  },
  822231244: function (e) {
    var result = { _: `auctionBidLevel` };
    result.pos = e.int();
    result.amount = e.long();
    result.date = e.int();
    return result;
  },
  4264769874: function (e) {
    var result = { _: `starGiftAuctionStateNotModified` };
    return result;
  },
  1998212710: function (e) {
    var result = { _: `starGiftAuctionState` };
    result.version = e.int();
    result.startDate = e.int();
    result.endDate = e.int();
    result.minBidAmount = e.long();
    result.bidLevels = e.vector(e.object);
    result.topBidders = e.vector(e.long);
    result.nextRoundAt = e.int();
    result.lastGiftNum = e.int();
    result.giftsLeft = e.int();
    result.currentRound = e.int();
    result.totalRounds = e.int();
    result.rounds = e.vector(e.object);
    return result;
  },
  2536352703: function (e) {
    var result = { _: `starGiftAuctionStateFinished` };
    var t = e.uint();
    result.flags = t;
    result.startDate = e.int();
    result.endDate = e.int();
    result.averagePrice = e.long();
    if (t & 1) {
      result.listedCount = e.int();
    }
    if (t & 2) {
      result.fragmentListedCount = e.int();
    }
    if (t & 2) {
      result.fragmentListedUrl = e.string();
    }
    return result;
  },
  787403204: function (e) {
    var result = { _: `starGiftAuctionUserState` };
    var t = e.uint();
    result.flags = t;
    result.returned = !!(t & 2);
    if (t & 1) {
      result.bidAmount = e.long();
    }
    if (t & 1) {
      result.bidDate = e.int();
    }
    if (t & 1) {
      result.minBidAmount = e.long();
    }
    if (t & 1) {
      result.bidPeer = e.object();
    }
    result.acquiredCount = e.int();
    return result;
  },
  1798960364: function (e) {
    var result = { _: `payments.starGiftAuctionState` };
    result.gift = e.object();
    result.state = e.object();
    result.userState = e.object();
    result.timeout = e.int();
    result.users = e.vector(e.object);
    result.chats = e.vector(e.object);
    return result;
  },
  1118831432: function (e) {
    var result = { _: `starGiftAuctionAcquiredGift` };
    var t = e.uint();
    result.flags = t;
    result.nameHidden = !!(t & 1);
    result.peer = e.object();
    result.date = e.int();
    result.bidAmount = e.long();
    result.round = e.int();
    result.pos = e.int();
    if (t & 2) {
      result.message = e.object();
    }
    if (t & 4) {
      result.giftNum = e.int();
    }
    return result;
  },
  2103169520: function (e) {
    var result = { _: `payments.starGiftAuctionAcquiredGifts` };
    result.gifts = e.vector(e.object);
    result.users = e.vector(e.object);
    result.chats = e.vector(e.object);
    return result;
  },
  3541812317: function (e) {
    var result = { _: `starGiftActiveAuctionState` };
    result.gift = e.object();
    result.state = e.object();
    result.userState = e.object();
    return result;
  },
  3677608656: function (e) {
    var result = { _: `payments.starGiftActiveAuctionsNotModified` };
    return result;
  },
  2935401404: function (e) {
    var result = { _: `payments.starGiftActiveAuctions` };
    result.auctions = e.vector(e.object);
    result.users = e.vector(e.object);
    result.chats = e.vector(e.object);
    return result;
  },
  48327832: function (e) {
    var result = { _: `inputStarGiftAuction` };
    result.giftId = e.long();
    return result;
  },
  2058715912: function (e) {
    var result = { _: `inputStarGiftAuctionSlug` };
    result.slug = e.string();
    return result;
  },
  2556509887: function (e) {
    var result = { _: `passkey` };
    var t = e.uint();
    result.flags = t;
    result.id = e.string();
    result.name = e.string();
    result.date = e.int();
    if (t & 1) {
      result.softwareEmojiId = e.long();
    }
    if (t & 2) {
      result.lastUsageDate = e.int();
    }
    return result;
  },
  4175473180: function (e) {
    var result = { _: `account.passkeys` };
    result.passkeys = e.vector(e.object);
    return result;
  },
  3781909729: function (e) {
    var result = { _: `account.passkeyRegistrationOptions` };
    result.options = e.object();
    return result;
  },
  3791878025: function (e) {
    var result = { _: `auth.passkeyLoginOptions` };
    result.options = e.object();
    return result;
  },
  1046713180: function (e) {
    var result = { _: `inputPasskeyResponseRegister` };
    result.clientData = e.object();
    result.attestationData = e.bytes();
    return result;
  },
  3273638218: function (e) {
    var result = { _: `inputPasskeyResponseLogin` };
    result.clientData = e.object();
    result.authenticatorData = e.bytes();
    result.signature = e.bytes();
    result.userHandle = e.string();
    return result;
  },
  1009235855: function (e) {
    var result = { _: `inputPasskeyCredentialPublicKey` };
    result.id = e.string();
    result.rawId = e.string();
    result.response = e.object();
    return result;
  },
  2952094616: function (e) {
    var result = { _: `starGiftBackground` };
    result.centerColor = e.int();
    result.edgeColor = e.int();
    result.textColor = e.int();
    return result;
  },
  984483112: function (e) {
    var result = { _: `starGiftAuctionRound` };
    result.num = e.int();
    result.duration = e.int();
    return result;
  },
  178266597: function (e) {
    var result = { _: `starGiftAuctionRoundExtendable` };
    result.num = e.int();
    result.duration = e.int();
    result.extendTop = e.int();
    result.extendWindow = e.int();
    return result;
  },
  1187439471: function (e) {
    var result = { _: `payments.starGiftUpgradeAttributes` };
    result.attributes = e.vector(e.object);
    return result;
  },
  3660240455: function (e) {
    var result = { _: `messages.emojiGameOutcome` };
    result.seed = e.bytes();
    result.stakeTonAmount = e.long();
    result.tonAmount = e.long();
    return result;
  },
  1508266805: function (e) {
    var result = { _: `messages.emojiGameUnavailable` };
    return result;
  },
  1155883043: function (e) {
    var result = { _: `messages.emojiGameDiceInfo` };
    var t = e.uint();
    result.flags = t;
    result.gameHash = e.string();
    result.prevStake = e.long();
    result.currentStreak = e.int();
    result.params = e.vector(e.int);
    if (t & 1) {
      result.playsLeft = e.int();
    }
    return result;
  },
  910391095: function (e) {
    var result = { _: `starGiftAttributeRarity` };
    result.permille = e.int();
    return result;
  },
  3687736201: function (e) {
    var result = { _: `starGiftAttributeRarityUncommon` };
    return result;
  },
  4035793259: function (e) {
    var result = { _: `starGiftAttributeRarityRare` };
    return result;
  },
  2029777832: function (e) {
    var result = { _: `starGiftAttributeRarityEpic` };
    return result;
  },
  3472353192: function (e) {
    var result = { _: `starGiftAttributeRarityLegendary` };
    return result;
  },
  1339896880: function (e) {
    var result = { _: `keyboardButtonStyle` };
    var t = e.uint();
    result.flags = t;
    result.bgPrimary = !!(t & 1);
    result.bgDanger = !!(t & 2);
    result.bgSuccess = !!(t & 4);
    if (t & 8) {
      result.icon = e.long();
    }
    return result;
  },
  1076577429: function (e) {
    var result = { _: `inputMessageReadMetric` };
    result.msgId = e.int();
    result.viewId = e.long();
    result.timeInViewMs = e.int();
    result.activeTimeInViewMs = e.int();
    result.heightToViewportRatioPermille = e.int();
    result.seenRangeRatioPermille = e.int();
    return result;
  },
  1012971041: function (e) {
    var result = { _: `bots.exportedBotToken` };
    result.token = e.string();
    return result;
  },
  4047224023: function (e) {
    var result = { _: `bots.requestedButton` };
    result.webappReqId = e.string();
    return result;
  },
  2430053882: function (e) {
    var result = { _: `messages.composedMessageWithAI` };
    var t = e.uint();
    result.flags = t;
    result.resultText = e.object();
    if (t & 1) {
      result.diffText = e.object();
    }
    return result;
  },
  697941741: function (e) {
    var result = { _: `stats.pollStats` };
    result.votesGraph = e.object();
    return result;
  },
  535407039: function (e) {
    var result = { _: `inputAiComposeToneDefault` };
    result.tone = e.string();
    return result;
  },
  125026432: function (e) {
    var result = { _: `inputAiComposeToneID` };
    result.id = e.long();
    result.accessHash = e.long();
    return result;
  },
  530584407: function (e) {
    var result = { _: `inputAiComposeToneSlug` };
    result.slug = e.string();
    return result;
  },
  235681199: function (e) {
    var result = { _: `inputAiComposeToneSingleUse` };
    result.customPrompt = e.string();
    return result;
  },
  3489021609: function (e) {
    var result = { _: `aiComposeTone` };
    var t = e.uint();
    result.flags = t;
    result.creator = !!(t & 1);
    result.id = e.long();
    result.accessHash = e.long();
    result.slug = e.string();
    result.title = e.string();
    if (t & 2) {
      result.emojiId = e.long();
    }
    if (t & 16) {
      result.prompt = e.string();
    }
    if (t & 4) {
      result.installsCount = e.int();
    }
    if (t & 8) {
      result.authorId = e.long();
    }
    if (t & 32) {
      result.exampleEnglish = e.object();
    }
    return result;
  },
  2611831828: function (e) {
    var result = { _: `aiComposeToneDefault` };
    result.tone = e.string();
    result.emojiId = e.long();
    result.title = e.string();
    return result;
  },
  3254018307: function (e) {
    var result = { _: `aicompose.tonesNotModified` };
    return result;
  },
  1822232318: function (e) {
    var result = { _: `aicompose.tones` };
    result.hash = e.long();
    result.tones = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  4057344236: function (e) {
    var result = { _: `aiComposeToneExample` };
    result.from = e.object();
    result.to = e.object();
    return result;
  },
  3709845395: function (e) {
    var result = { _: `bots.accessSettings` };
    var t = e.uint();
    result.flags = t;
    result.restricted = !!(t & 1);
    if (t & 2) {
      result.addUsers = e.vector(e.object);
    }
    return result;
  },
  1146512295: function (e) {
    var result = { _: `messages.chatInviteJoinResultOk` };
    result.updates = e.object();
    return result;
  },
  1640638931: function (e) {
    var result = { _: `messages.chatInviteJoinResultWebView` };
    result.botId = e.long();
    result.queryId = e.long();
    result.users = e.vector(e.object);
    return result;
  },
  2920622697: function (e) {
    var result = { _: `joinChatBotResultApproved` };
    return result;
  },
  251265428: function (e) {
    var result = { _: `joinChatBotResultDeclined` };
    return result;
  },
  2560862272: function (e) {
    var result = { _: `joinChatBotResultQueued` };
    return result;
  },
  3605248019: function (e) {
    var result = { _: `joinChatBotResultWebView` };
    result.url = e.string();
    return result;
  },
  2470225303: function (e) {
    var result = { _: `webDomainException` };
    var t = e.uint();
    result.flags = t;
    result.domain = e.string();
    result.url = e.string();
    result.title = e.string();
    if (t & 1) {
      result.favicon = e.long();
    }
    return result;
  },
  3273428814: function (e) {
    var result = { _: `account.webBrowserSettingsNotModified` };
    return result;
  },
  2045480115: function (e) {
    var result = { _: `account.webBrowserSettings` };
    var t = e.uint();
    result.flags = t;
    result.openExternalBrowser = !!(t & 1);
    result.displayCloseButton = !!(t & 2);
    result.externalExceptions = e.vector(e.object);
    result.inappExceptions = e.vector(e.object);
    result.hash = e.long();
    return result;
  },
  2600493611: function (e) {
    var result = { _: `inputRichFilePhoto` };
    result.id = e.string();
    result.photo = e.object();
    return result;
  },
  2200444349: function (e) {
    var result = { _: `inputRichFileDocument` };
    result.id = e.string();
    result.document = e.object();
    return result;
  },
  3838069244: function (e) {
    var result = { _: `inputRichMessage` };
    var t = e.uint();
    result.flags = t;
    result.rtl = !!(t & 1);
    result.noautolink = !!(t & 2);
    result.blocks = e.vector(e.object);
    if (t & 4) {
      result.photos = e.vector(e.object);
    }
    if (t & 8) {
      result.documents = e.vector(e.object);
    }
    if (t & 16) {
      result.users = e.vector(e.object);
    }
    return result;
  },
  3670770538: function (e) {
    var result = { _: `inputRichMessageHTML` };
    var t = e.uint();
    result.flags = t;
    result.rtl = !!(t & 1);
    result.noautolink = !!(t & 2);
    result.html = e.string();
    if (t & 4) {
      result.files = e.vector(e.object);
    }
    return result;
  },
  4937516: function (e) {
    var result = { _: `inputRichMessageMarkdown` };
    var t = e.uint();
    result.flags = t;
    result.rtl = !!(t & 1);
    result.noautolink = !!(t & 2);
    result.markdown = e.string();
    if (t & 4) {
      result.files = e.vector(e.object);
    }
    return result;
  },
  3136527755: function (e) {
    var result = { _: `richMessage` };
    var t = e.uint();
    result.flags = t;
    result.rtl = !!(t & 1);
    result.part = !!(t & 2);
    result.blocks = e.vector(e.object);
    result.photos = e.vector(e.object);
    result.documents = e.vector(e.object);
    return result;
  },
  1981030077: function (e) {
    var result = { _: `communityPeer` };
    var t = e.uint();
    result.flags = t;
    result.canViewHistory = !!(t & 4);
    if (t & 1) {
      result.visible = e.object();
    }
    result.peer = e.object();
    return result;
  },
  2078997125: function (e) {
    var result = { _: `communityPeerRequest` };
    var t = e.uint();
    result.flags = t;
    result.visible = !!(t & 1);
    result.peer = e.object();
    result.requestedBy = e.long();
    result.date = e.int();
    return result;
  },
  574926765: function (e) {
    var result = { _: `communities.peerLinkRequests` };
    var t = e.uint();
    result.flags = t;
    result.totalCount = e.int();
    result.requests = e.vector(e.object);
    if (t & 1) {
      result.nextOffset = e.string();
    }
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  3710369513: function (e) {
    var result = { _: `ephemeralMessage` };
    var t = e.uint();
    result.flags = t;
    result.out = !!(t & 1);
    result.welcomeTemplate = !!(t & 32);
    result.invertMedia = !!(t & 128);
    result.noforwards = !!(t & 4096);
    result.id = e.int();
    result.fromId = e.object();
    if (t & 512) {
      result.peerId = e.object();
    }
    result.receiverId = e.long();
    if (t & 2) {
      result.topMsgId = e.int();
    }
    result.date = e.int();
    result.message = e.string();
    if (t & 4) {
      result.entities = e.vector(e.object);
    }
    if (t & 8) {
      result.media = e.object();
    }
    if (t & 16) {
      result.replyMarkup = e.object();
    }
    if (t & 64) {
      result.replyTo = e.object();
    }
    if (t & 256) {
      result.richMessage = e.object();
    }
    if (t & 1024) {
      result.chatInstance = e.long();
    }
    if (t & 2048) {
      result.anchorMsgId = e.int();
    }
    return result;
  },
  2373472554: function (e) {
    var result = { _: `communities.participantJoinedChats` };
    result.creatorChatIds = e.vector(e.long);
    result.joinedChatIds = e.vector(e.long);
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  1107532175: function (e) {
    var result = { _: `messages.translatedRichMessage` };
    result.result = e.vector(e.object);
    return result;
  },
  1279604680: function (e) {
    var result = { _: `messages.composedRichMessageWithAI` };
    result.result = e.object();
    return result;
  },
  3386740969: function (e) {
    var result = { _: `buttonTypeDefault` };
    return result;
  },
  3745330937: function (e) {
    var result = { _: `buttonTypeRequestPhone` };
    return result;
  },
  2616123712: function (e) {
    var result = { _: `buttonTypeRequestGeoLocation` };
    return result;
  },
  2865758084: function (e) {
    var result = { _: `buttonTypeRequestPoll` };
    var t = e.uint();
    result.flags = t;
    if (t & 1) {
      result.quiz = e.object();
    }
    return result;
  },
  1331208759: function (e) {
    var result = { _: `buttonTypeRequestPeer` };
    var t = e.uint();
    result.flags = t;
    result.buttonId = e.int();
    result.peerType = e.object();
    result.maxQuantity = e.int();
    return result;
  },
  1071802622: function (e) {
    var result = { _: `inputButtonTypeRequestPeer` };
    var t = e.uint();
    result.flags = t;
    result.nameRequested = !!(t & 1);
    result.usernameRequested = !!(t & 2);
    result.photoRequested = !!(t & 4);
    result.buttonId = e.int();
    result.peerType = e.object();
    result.maxQuantity = e.int();
    return result;
  },
  3222952314: function (e) {
    var result = { _: `buttonTypeSimpleWebView` };
    result.url = e.string();
    return result;
  },
  3970234580: function (e) {
    var result = { _: `inlineButtonTypeUrl` };
    result.url = e.string();
    return result;
  },
  3218091426: function (e) {
    var result = { _: `inlineButtonTypeUrlAuth` };
    var t = e.uint();
    result.flags = t;
    if (t & 1) {
      result.fwdText = e.string();
    }
    result.url = e.string();
    result.buttonId = e.int();
    return result;
  },
  2573319348: function (e) {
    var result = { _: `inputInlineButtonTypeUrlAuth` };
    var t = e.uint();
    result.flags = t;
    result.requestWriteAccess = !!(t & 1);
    if (t & 2) {
      result.fwdText = e.string();
    }
    result.url = e.string();
    if (t & 4) {
      result.bot = e.object();
    }
    return result;
  },
  1003140532: function (e) {
    var result = { _: `inlineButtonTypeWebView` };
    result.url = e.string();
    return result;
  },
  693484600: function (e) {
    var result = { _: `inlineButtonTypeCallback` };
    var t = e.uint();
    result.flags = t;
    result.requiresPassword = !!(t & 1);
    result.data = e.bytes();
    return result;
  },
  1557360797: function (e) {
    var result = { _: `inlineButtonTypeGame` };
    return result;
  },
  1220204453: function (e) {
    var result = { _: `inlineButtonTypeBuy` };
    return result;
  },
  2474065909: function (e) {
    var result = { _: `inlineButtonTypeSwitchInline` };
    var t = e.uint();
    result.flags = t;
    result.samePeer = !!(t & 1);
    result.query = e.string();
    if (t & 2) {
      result.peerTypes = e.vector(e.object);
    }
    return result;
  },
  1067663311: function (e) {
    var result = { _: `inlineButtonTypeUserProfile` };
    result.userId = e.long();
    return result;
  },
  1408487002: function (e) {
    var result = { _: `inputInlineButtonTypeUserProfile` };
    result.userId = e.object();
    return result;
  },
  3021812338: function (e) {
    var result = { _: `inlineButtonTypeCopy` };
    result.copyText = e.string();
    return result;
  },
  2755158429: function (e) {
    var result = { _: `inlineButtonTypeDisabled` };
    return result;
  },
  297902882: function (e) {
    var result = { _: `keyboardInlineButton` };
    var t = e.uint();
    result.flags = t;
    if (t & 1024) {
      result.style = e.object();
    }
    result.text = e.string();
    result.type = e.object();
    return result;
  },
  423758582: function (e) {
    var result = { _: `keyboardInlineButtonRow` };
    result.buttons = e.vector(e.object);
    return result;
  },
  63312061: function (e) {
    var result = { _: `richButtonStyle` };
    var t = e.uint();
    result.flags = t;
    result.bgPrimary = !!(t & 1);
    result.bgDanger = !!(t & 2);
    result.bgSuccess = !!(t & 4);
    result.link = !!(t & 8);
    return result;
  },
  1764381832: function (e) {
    var result = { _: `pageButton` };
    var t = e.uint();
    result.flags = t;
    result.text = e.object();
    result.type = e.object();
    if (t & 1) {
      result.style = e.object();
    }
    return result;
  },
  1509940017: function (e) {
    var result = { _: `ephemeral.welcomeMessagesNotModified` };
    return result;
  },
  273664114: function (e) {
    var result = { _: `ephemeral.welcomeMessages` };
    result.hash = e.long();
    result.messages = e.vector(e.object);
    return result;
  },
  819557436: function (e) {
    var result = { _: `currencyRate` };
    result.currency = e.string();
    result.rate = e.double();
    return result;
  },
  3150767298: function (e) {
    var result = { _: `payments.currencyRates` };
    result.rates = e.vector(e.object);
    return result;
  },
  2894986777: function (e) {
    var result = { _: `toncenter.apiResponse` };
    result.response = e.object();
    return result;
  },
  428373505: function (e) {
    var result = { _: `toncenter.streamingUrl` };
    result.url = e.string();
    result.expires = e.int();
    return result;
  },
  2663958184: function (e) {
    var result = { _: `onrampMethodAvailability` };
    var t = e.uint();
    result.flags = t;
    result.available = !!(t & 1);
    result.paymentMethod = e.string();
    return result;
  },
  230847874: function (e) {
    var result = { _: `onrampProviderInfo` };
    var t = e.uint();
    result.flags = t;
    result.supportsBaseCurrencies = !!(t & 1);
    result.supportsLimits = !!(t & 2);
    result.supportsQuote = !!(t & 4);
    result.id = e.string();
    result.name = e.string();
    result.cryptoCurrencies = e.vector(e.string);
    return result;
  },
  4190652787: function (e) {
    var result = { _: `onrampAvailability` };
    var t = e.uint();
    result.flags = t;
    result.allowed = !!(t & 1);
    result.buyAllowed = !!(t & 2);
    result.countryCode = e.string();
    if (t & 4) {
      result.state = e.string();
    }
    result.methods = e.vector(e.object);
    return result;
  },
  2078435198: function (e) {
    var result = { _: `onrampLimits` };
    result.baseCurrency = e.string();
    result.baseMinAmount = e.string();
    result.baseMaxAmount = e.string();
    result.cryptoMinAmount = e.string();
    result.cryptoMaxAmount = e.string();
    result.paymentMethod = e.string();
    return result;
  },
  2055213545: function (e) {
    var result = { _: `onrampQuote` };
    result.baseCurrency = e.string();
    result.baseAmount = e.string();
    result.cryptoCurrency = e.string();
    result.cryptoAmount = e.string();
    result.cryptoPrice = e.string();
    result.feeAmount = e.string();
    result.extraFeeAmount = e.string();
    result.networkFeeAmount = e.string();
    result.totalAmount = e.string();
    result.paymentMethod = e.string();
    result.expiresDate = e.int();
    return result;
  },
  3521392164: function (e) {
    var result = { _: `onrampSession` };
    result.provider = e.string();
    result.sessionId = e.string();
    result.url = e.string();
    result.expiresDate = e.int();
    return result;
  },
  2629415660: function (e) {
    var result = { _: `walletStateEmpty` };
    var t = e.uint();
    result.flags = t;
    result.creating = !!(t & 1);
    return result;
  },
  2512729195: function (e) {
    var result = { _: `walletState` };
    var t = e.uint();
    result.flags = t;
    result.backupEnabled = !!(t & 1);
    result.canExportPhrase = !!(t & 2);
    result.canEnableBackup = !!(t & 4);
    result.address = e.string();
    result.publicKey = e.bytes();
    result.balance = e.long();
    return result;
  },
  4269338316: function (e) {
    var result = { _: `walletUserAddress` };
    var t = e.uint();
    result.flags = t;
    if (t & 1) {
      result.userId = e.long();
    }
    result.address = e.string();
    result.publicKey = e.bytes();
    return result;
  },
  2458811221: function (e) {
    var result = { _: `wallet.userAddresses` };
    result.addresses = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  3572133997: function (e) {
    var result = { _: `walletTransactionPeerUser` };
    var t = e.uint();
    result.flags = t;
    result.userId = e.long();
    result.address = e.string();
    if (t & 1) {
      result.domain = e.string();
    }
    return result;
  },
  103596476: function (e) {
    var result = { _: `walletTransactionPeerAddress` };
    var t = e.uint();
    result.flags = t;
    result.address = e.string();
    if (t & 1) {
      result.domain = e.string();
    }
    return result;
  },
  3851753582: function (e) {
    var result = { _: `walletTransactionPeerOnramp` };
    var t = e.uint();
    result.flags = t;
    result.address = e.string();
    if (t & 1) {
      result.domain = e.string();
    }
    result.providerName = e.string();
    return result;
  },
  1921772890: function (e) {
    var result = { _: `walletTransactionPeerUnsupported` };
    return result;
  },
  2502803779: function (e) {
    var result = { _: `walletTransaction` };
    var t = e.uint();
    result.flags = t;
    result.incoming = !!(t & 1);
    result.gasless = !!(t & 2);
    result.failed = !!(t & 4);
    result.keyChange = !!(t & 32);
    result.commentEncrypted = !!(t & 64);
    result.id = e.string();
    result.amount = e.long();
    result.fee = e.long();
    result.date = e.int();
    result.peer = e.object();
    if (t & 8) {
      result.comment = e.string();
    }
    if (t & 16) {
      result.txHash = e.string();
    }
    if (t & 128) {
      result.nft = e.object();
    }
    return result;
  },
  1126356389: function (e) {
    var result = { _: `wallet.transactions` };
    var t = e.uint();
    result.flags = t;
    result.balance = e.long();
    result.transactions = e.vector(e.object);
    if (t & 1) {
      result.nextOffset = e.string();
    }
    result.chats = e.vector(e.object);
    result.users = e.vector(e.object);
    return result;
  },
  3872452353: function (e) {
    var result = { _: `wallet.secretPhraseParts` };
    result.token = e.string();
    result.dcs = e.vector(e.int);
    return result;
  },
  417867063: function (e) {
    var result = { _: `wallet.encryptedSecretPhrasePart` };
    result.data = e.bytes();
    return result;
  },
  4191556335: function (e) {
    var result = { _: `wallet.holderDc` };
    result.dc = e.int();
    result.publicKey = e.bytes();
    return result;
  },
  2581862151: function (e) {
    var result = { _: `wallet.proofChallenge` };
    result.payload = e.string();
    result.expires = e.int();
    result.domain = e.string();
    return result;
  },
  1622985485: function (e) {
    var result = { _: `walletOwnershipProof` };
    result.timestamp = e.int();
    result.signature = e.bytes();
    return result;
  },
  1671708892: function (e) {
    var result = { _: `inputWalletNew` };
    return result;
  },
  1722182203: function (e) {
    var result = { _: `inputWalletImported` };
    var t = e.uint();
    result.flags = t;
    result.publicKey = e.bytes();
    if (t & 1) {
      result.anchorPublicKey = e.bytes();
    }
    result.proof = e.object();
    return result;
  },
  304255588: function (e) {
    var result = { _: `tonConnectManifest` };
    var t = e.uint();
    result.flags = t;
    result.url = e.string();
    result.name = e.string();
    if (t & 1) {
      result.icon = e.object();
    }
    return result;
  },
  308631238: function (e) {
    var result = { _: `tonConnectSession` };
    var t = e.uint();
    result.flags = t;
    result.pending = !!(t & 1);
    result.closing = !!(t & 2);
    result.closed = !!(t & 4);
    result.id = e.long();
    result.dappClientId = e.string();
    if (t & 8) {
      result.clientId = e.string();
    }
    result.nonce = e.bytes();
    if (t & 16) {
      result.manifest = e.object();
    }
    if (t & 32) {
      result.manifestError = e.int();
    }
    result.date = e.int();
    return result;
  },
  1271436947: function (e) {
    var result = { _: `wallet.tonConnectChallenge` };
    result.challenge = e.bytes();
    result.eventId = e.long();
    return result;
  },
  1478780131: function (e) {
    var result = { _: `tonConnectNextEventId` };
    result.eventId = e.long();
    return result;
  },
  2707391763: function (e) {
    var result = { _: `tonConnectRequest` };
    var t = e.uint();
    result.flags = t;
    result.sessionId = e.long();
    result.msgId = e.int();
    result.body = e.bytes();
    result.expires = e.int();
    if (t & 1) {
      result.topic = e.string();
    }
    if (t & 2) {
      result.traceId = e.string();
    }
    return result;
  },
  2244014372: function (e) {
    var result = { _: `wallet.tonConnectPending` };
    result.session = e.object();
    result.requests = e.vector(e.object);
    return result;
  },
  236939414: function (e) {
    var result = { _: `wallet.tonConnectSessions` };
    result.sessions = e.vector(e.object);
    return result;
  },
  3186166413: function (e) {
    var result = { _: `wallet.existingBalance` };
    var t = e.uint();
    result.flags = t;
    result.hasBalance = !!(t & 1);
    result.url = e.string();
    return result;
  },
  1277096206: function (e) {
    var result = { _: `wallet.nftAttribute` };
    result.traitType = e.string();
    result.value = e.string();
    return result;
  },
  876739868: function (e) {
    var result = { _: `wallet.nftItem` };
    var t = e.uint();
    result.flags = t;
    if (t & 1) {
      result.collectionAddress = e.string();
    }
    result.address = e.string();
    result.ownerAddress = e.string();
    result.index = e.string();
    if (t & 2) {
      result.name = e.string();
    }
    if (t & 4) {
      result.description = e.string();
    }
    if (t & 8) {
      result.image = e.object();
    }
    if (t & 16) {
      result.imageSmall = e.object();
    }
    if (t & 32) {
      result.contentUrl = e.object();
    }
    if (t & 64) {
      result.lottie = e.object();
    }
    if (t & 128) {
      result.attributes = e.vector(e.object);
    }
    if (t & 256) {
      result.extra = e.object();
    }
    return result;
  },
  2035107951: function (e) {
    var result = { _: `wallet.nftItems` };
    var t = e.uint();
    result.flags = t;
    result.items = e.vector(e.object);
    if (t & 1) {
      result.nextOffset = e.string();
    }
    return result;
  },
  3747266572: function (e) {
    var result = { _: `auth.firebasePnvIntent` };
    result.nonce = e.string();
    result.digitalCredentialPayload = e.string();
    return result;
  },
  2966251031: function (e) {
    var result = { _: `botVerifierSettings` };
    var t = e.uint();
    result.flags = t;
    result.canModifyCustomDescription = !!(t & 2);
    result.icon = e.long();
    result.company = e.string();
    if (t & 1) {
      result.customDescription = e.string();
    }
    return result;
  },
  4181513308: function (e) {
    var result = { _: `botVerification` };
    result.botId = e.long();
    result.icon = e.long();
    result.description = e.string();
    return result;
  },
  1528613672: function (e) {
    var result = { _: `inputPasskeyCredentialFirebasePNV` };
    result.pnvToken = e.string();
    return result;
  },
  3871544610: function (e) {
    var result = { _: `messageActionStarGiftUnique` };
    var t = e.uint();
    result.flags = t;
    result.upgrade = !!(t & 1);
    result.transferred = !!(t & 2);
    result.saved = !!(t & 4);
    result.refunded = !!(t & 32);
    result.prepaidUpgrade = !!(t & 2048);
    result.assigned = !!(t & 8192);
    result.fromOffer = !!(t & 16384);
    result.craft = !!(t & 65536);
    result.gift = e.object();
    if (t & 8) {
      result.canExportAt = e.int();
    }
    if (t & 16) {
      result.transferStars = e.long();
    }
    if (t & 64) {
      result.fromId = e.object();
    }
    if (t & 128) {
      result.peer = e.object();
    }
    if (t & 128) {
      result.savedId = e.long();
    }
    if (t & 256) {
      result.resaleAmount = e.object();
    }
    if (t & 512) {
      result.canTransferAt = e.int();
    }
    if (t & 1024) {
      result.canResellAt = e.int();
    }
    if (t & 4096) {
      result.dropOriginalDetailsStars = e.long();
    }
    if (t & 32768) {
      result.canCraftAt = e.int();
    }
    return result;
  },
  929929052: function (e) {
    var result = { _: `sendMessageTextDraftAction` };
    result.randomId = e.long();
    result.text = e.object();
    return result;
  },
  3803331409: function (e) {
    var result = { _: `inputSendMessageRichMessageDraftAction` };
    result.randomId = e.long();
    result.richMessage = e.object();
    return result;
  },
  2731222265: function (e) {
    var result = { _: `sendMessageRichMessageDraftAction` };
    result.randomId = e.long();
    result.richMessage = e.object();
    return result;
  },
  2098662655: function (e) {
    var result = { _: `keyboardButton` };
    var t = e.uint();
    result.flags = t;
    if (t & 1024) {
      result.style = e.object();
    }
    result.text = e.string();
    return result;
  },
  3624674796: function (e) {
    var result = { _: `keyboardButtonUrl` };
    var t = e.uint();
    result.flags = t;
    if (t & 1024) {
      result.style = e.object();
    }
    result.text = e.string();
    result.url = e.string();
    return result;
  },
  3861629280: function (e) {
    var result = { _: `keyboardButtonCallback` };
    var t = e.uint();
    result.flags = t;
    result.requiresPassword = !!(t & 1);
    if (t & 1024) {
      result.style = e.object();
    }
    result.text = e.string();
    result.data = e.bytes();
    return result;
  },
  1098841487: function (e) {
    var result = { _: `keyboardButtonRequestPhone` };
    var t = e.uint();
    result.flags = t;
    if (t & 1024) {
      result.style = e.object();
    }
    result.text = e.string();
    return result;
  },
  2856384845: function (e) {
    var result = { _: `keyboardButtonRequestGeoLocation` };
    var t = e.uint();
    result.flags = t;
    if (t & 1024) {
      result.style = e.object();
    }
    result.text = e.string();
    return result;
  },
  2568198652: function (e) {
    var result = { _: `keyboardButtonSwitchInline` };
    var t = e.uint();
    result.flags = t;
    result.samePeer = !!(t & 1);
    if (t & 1024) {
      result.style = e.object();
    }
    result.text = e.string();
    result.query = e.string();
    if (t & 2) {
      result.peerTypes = e.vector(e.object);
    }
    return result;
  },
  2311426297: function (e) {
    var result = { _: `keyboardButtonGame` };
    var t = e.uint();
    result.flags = t;
    if (t & 1024) {
      result.style = e.object();
    }
    result.text = e.string();
    return result;
  },
  1067792645: function (e) {
    var result = { _: `keyboardButtonBuy` };
    var t = e.uint();
    result.flags = t;
    if (t & 1024) {
      result.style = e.object();
    }
    result.text = e.string();
    return result;
  },
  4111468281: function (e) {
    var result = { _: `keyboardButtonUrlAuth` };
    var t = e.uint();
    result.flags = t;
    if (t & 1024) {
      result.style = e.object();
    }
    result.text = e.string();
    if (t & 1) {
      result.fwdText = e.string();
    }
    result.url = e.string();
    result.buttonId = e.int();
    return result;
  },
  1744911986: function (e) {
    var result = { _: `inputKeyboardButtonUrlAuth` };
    var t = e.uint();
    result.flags = t;
    result.requestWriteAccess = !!(t & 1);
    if (t & 1024) {
      result.style = e.object();
    }
    result.text = e.string();
    if (t & 2) {
      result.fwdText = e.string();
    }
    result.url = e.string();
    result.bot = e.object();
    return result;
  },
  2047989634: function (e) {
    var result = { _: `keyboardButtonRequestPoll` };
    var t = e.uint();
    result.flags = t;
    if (t & 1024) {
      result.style = e.object();
    }
    if (t & 1) {
      result.quiz = e.object();
    }
    result.text = e.string();
    return result;
  },
  2103314375: function (e) {
    var result = { _: `inputKeyboardButtonUserProfile` };
    var t = e.uint();
    result.flags = t;
    if (t & 1024) {
      result.style = e.object();
    }
    result.text = e.string();
    result.userId = e.object();
    return result;
  },
  3237829897: function (e) {
    var result = { _: `keyboardButtonUserProfile` };
    var t = e.uint();
    result.flags = t;
    if (t & 1024) {
      result.style = e.object();
    }
    result.text = e.string();
    result.userId = e.long();
    return result;
  },
  3896947104: function (e) {
    var result = { _: `keyboardButtonWebView` };
    var t = e.uint();
    result.flags = t;
    if (t & 1024) {
      result.style = e.object();
    }
    result.text = e.string();
    result.url = e.string();
    return result;
  },
  3780920176: function (e) {
    var result = { _: `keyboardButtonSimpleWebView` };
    var t = e.uint();
    result.flags = t;
    if (t & 1024) {
      result.style = e.object();
    }
    result.text = e.string();
    result.url = e.string();
    return result;
  },
  1527715317: function (e) {
    var result = { _: `keyboardButtonRequestPeer` };
    var t = e.uint();
    result.flags = t;
    if (t & 1024) {
      result.style = e.object();
    }
    result.text = e.string();
    result.buttonId = e.int();
    result.peerType = e.object();
    result.maxQuantity = e.int();
    return result;
  },
  45580630: function (e) {
    var result = { _: `inputKeyboardButtonRequestPeer` };
    var t = e.uint();
    result.flags = t;
    result.nameRequested = !!(t & 1);
    result.usernameRequested = !!(t & 2);
    result.photoRequested = !!(t & 4);
    if (t & 1024) {
      result.style = e.object();
    }
    result.text = e.string();
    result.buttonId = e.int();
    result.peerType = e.object();
    result.maxQuantity = e.int();
    return result;
  },
  3167006480: function (e) {
    var result = { _: `keyboardButtonCopy` };
    var t = e.uint();
    result.flags = t;
    if (t & 1024) {
      result.style = e.object();
    }
    result.text = e.string();
    result.copyText = e.string();
    return result;
  },
  1218642516: function (e) {
    var result = { _: `replyInlineMarkup` };
    result.rows = e.vector(e.object);
    return result;
  },
  641563686: function (e) {
    var result = { _: `pageBlockBlockquote` };
    result.text = e.object();
    result.caption = e.object();
    return result;
  },
  3281998628: function (e) {
    var result = { _: `inputInvoiceStarGiftResale` };
    var t = e.uint();
    result.flags = t;
    result.ton = !!(t & 1);
    result.slug = e.string();
    result.toId = e.object();
    return result;
  },
  3653688346: function (e) {
    var result = { _: `ephemeralMessage` };
    var t = e.uint();
    result.flags = t;
    result.out = !!(t & 1);
    result.id = e.int();
    result.fromId = e.object();
    result.peerId = e.object();
    result.receiverId = e.long();
    if (t & 2) {
      result.topMsgId = e.int();
    }
    result.date = e.int();
    result.message = e.string();
    if (t & 4) {
      result.entities = e.vector(e.object);
    }
    if (t & 8) {
      result.media = e.object();
    }
    if (t & 16) {
      result.replyMarkup = e.object();
    }
    if (t & 64) {
      result.replyTo = e.object();
    }
    return result;
  },
  829899656: function (e) {
    var result = { _: `user` };
    var t = e.uint();
    result.flags = t;
    result.self = !!(t & 1024);
    result.contact = !!(t & 2048);
    result.mutualContact = !!(t & 4096);
    result.deleted = !!(t & 8192);
    result.bot = !!(t & 16384);
    result.botChatHistory = !!(t & 32768);
    result.botNochats = !!(t & 65536);
    result.verified = !!(t & 131072);
    result.restricted = !!(t & 262144);
    result.min = !!(t & 1048576);
    result.botInlineGeo = !!(t & 2097152);
    result.support = !!(t & 8388608);
    result.scam = !!(t & 16777216);
    result.applyMinPhoto = !!(t & 33554432);
    result.fake = !!(t & 67108864);
    result.botAttachMenu = !!(t & 134217728);
    result.premium = !!(t & 268435456);
    result.attachMenuEnabled = !!(t & 536870912);
    var n = e.uint();
    result.flags2 = n;
    result.botCanEdit = !!(n & 2);
    result.closeFriend = !!(n & 4);
    result.storiesHidden = !!(n & 8);
    result.storiesUnavailable = !!(n & 16);
    result.contactRequirePremium = !!(n & 1024);
    result.botBusiness = !!(n & 2048);
    result.botHasMainApp = !!(n & 8192);
    result.botForumView = !!(n & 65536);
    result.botForumCanManageTopics = !!(n & 131072);
    result.botCanManageBots = !!(n & 262144);
    result.botGuestchat = !!(n & 524288);
    result.botGuard = !!(n & 1048576);
    result.id = e.long();
    if (t & 1) {
      result.accessHash = e.long();
    }
    if (t & 2) {
      result.firstName = e.string();
    }
    if (t & 4) {
      result.lastName = e.string();
    }
    if (t & 8) {
      result.username = e.string();
    }
    if (t & 16) {
      result.phone = e.string();
    }
    if (t & 32) {
      result.photo = e.object();
    }
    if (t & 64) {
      result.status = e.object();
    }
    if (t & 16384) {
      result.botInfoVersion = e.int();
    }
    if (t & 262144) {
      result.restrictionReason = e.vector(e.object);
    }
    if (t & 524288) {
      result.botInlinePlaceholder = e.string();
    }
    if (t & 4194304) {
      result.langCode = e.string();
    }
    if (t & 1073741824) {
      result.emojiStatus = e.object();
    }
    if (n & 1) {
      result.usernames = e.vector(e.object);
    }
    if (n & 32) {
      result.storiesMaxId = e.object();
    }
    if (n & 256) {
      result.color = e.object();
    }
    if (n & 512) {
      result.profileColor = e.object();
    }
    if (n & 4096) {
      result.botActiveUsers = e.int();
    }
    if (n & 16384) {
      result.botVerificationIcon = e.long();
    }
    if (n & 32768) {
      result.sendPaidMessagesStars = e.long();
    }
    return result;
  },
  473084188: function (e) {
    var result = { _: `channel` };
    var t = e.uint();
    result.flags = t;
    result.creator = !!(t & 1);
    result.left = !!(t & 4);
    result.broadcast = !!(t & 32);
    result.verified = !!(t & 128);
    result.megagroup = !!(t & 256);
    result.restricted = !!(t & 512);
    result.signatures = !!(t & 2048);
    result.min = !!(t & 4096);
    result.scam = !!(t & 524288);
    result.hasLink = !!(t & 1048576);
    result.hasGeo = !!(t & 2097152);
    result.slowmodeEnabled = !!(t & 4194304);
    result.callActive = !!(t & 8388608);
    result.callNotEmpty = !!(t & 16777216);
    result.fake = !!(t & 33554432);
    result.gigagroup = !!(t & 67108864);
    result.noforwards = !!(t & 134217728);
    result.joinToSend = !!(t & 268435456);
    result.joinRequest = !!(t & 536870912);
    result.forum = !!(t & 1073741824);
    var n = e.uint();
    result.flags2 = n;
    result.storiesHidden = !!(n & 2);
    result.storiesHiddenMin = !!(n & 4);
    result.storiesUnavailable = !!(n & 8);
    result.signatureProfiles = !!(n & 4096);
    result.autotranslation = !!(n & 32768);
    result.broadcastMessagesAllowed = !!(n & 65536);
    result.monoforum = !!(n & 131072);
    result.forumTabs = !!(n & 524288);
    result.id = e.long();
    if (t & 8192) {
      result.accessHash = e.long();
    }
    result.title = e.string();
    if (t & 64) {
      result.username = e.string();
    }
    result.photo = e.object();
    result.date = e.int();
    if (t & 512) {
      result.restrictionReason = e.vector(e.object);
    }
    if (t & 16384) {
      result.adminRights = e.object();
    }
    if (t & 32768) {
      result.bannedRights = e.object();
    }
    if (t & 262144) {
      result.defaultBannedRights = e.object();
    }
    if (t & 131072) {
      result.participantsCount = e.int();
    }
    if (n & 1) {
      result.usernames = e.vector(e.object);
    }
    if (n & 16) {
      result.storiesMaxId = e.object();
    }
    if (n & 128) {
      result.color = e.object();
    }
    if (n & 256) {
      result.profileColor = e.object();
    }
    if (n & 512) {
      result.emojiStatus = e.object();
    }
    if (n & 1024) {
      result.level = e.int();
    }
    if (n & 2048) {
      result.subscriptionUntilDate = e.int();
    }
    if (n & 8192) {
      result.botVerificationIcon = e.long();
    }
    if (n & 16384) {
      result.sendPaidMessagesStars = e.long();
    }
    if (n & 262144) {
      result.linkedMonoforumId = e.long();
    }
    return result;
  },
  3262826695: function (e) {
    var result = { _: `botCommand` };
    result.command = e.string();
    result.description = e.string();
    return result;
  },
  793887543: function (e) {
    var result = { _: `messages.chatInviteJoinResultWebView` };
    result.botId = e.long();
    result.webview = e.object();
    result.users = e.vector(e.object);
    return result;
  },
  3572151633: function (e) {
    var result = { _: `inputRichMessageHTML` };
    var t = e.uint();
    result.flags = t;
    result.rtl = !!(t & 1);
    result.noautolink = !!(t & 2);
    result.html = e.string();
    if (t & 4) {
      result.photos = e.vector(e.object);
    }
    if (t & 8) {
      result.documents = e.vector(e.object);
    }
    if (t & 16) {
      result.users = e.vector(e.object);
    }
    return result;
  },
  162300294: function (e) {
    var result = { _: `inputRichMessageMarkdown` };
    var t = e.uint();
    result.flags = t;
    result.rtl = !!(t & 1);
    result.noautolink = !!(t & 2);
    result.markdown = e.string();
    if (t & 4) {
      result.photos = e.vector(e.object);
    }
    if (t & 8) {
      result.documents = e.vector(e.object);
    }
    if (t & 16) {
      result.users = e.vector(e.object);
    }
    return result;
  },
  3839931037: function (e) {
    var result = { _: `channelFull` };
    var t = e.uint();
    result.flags = t;
    result.canViewParticipants = !!(t & 8);
    result.canSetUsername = !!(t & 64);
    result.canSetStickers = !!(t & 128);
    result.hiddenPrehistory = !!(t & 1024);
    result.canSetLocation = !!(t & 65536);
    result.hasScheduled = !!(t & 524288);
    result.canViewStats = !!(t & 1048576);
    result.blocked = !!(t & 4194304);
    var n = e.uint();
    result.flags2 = n;
    result.canDeleteChannel = !!(n & 1);
    result.antispam = !!(n & 2);
    result.participantsHidden = !!(n & 4);
    result.translationsDisabled = !!(n & 8);
    result.storiesPinnedAvailable = !!(n & 32);
    result.viewForumAsMessages = !!(n & 64);
    result.restrictedSponsored = !!(n & 2048);
    result.canViewRevenue = !!(n & 4096);
    result.paidMediaAllowed = !!(n & 16384);
    result.canViewStarsRevenue = !!(n & 32768);
    result.paidReactionsAvailable = !!(n & 65536);
    result.stargiftsAvailable = !!(n & 524288);
    result.paidMessagesAvailable = !!(n & 1048576);
    result.id = e.long();
    result.about = e.string();
    if (t & 1) {
      result.participantsCount = e.int();
    }
    if (t & 2) {
      result.adminsCount = e.int();
    }
    if (t & 4) {
      result.kickedCount = e.int();
    }
    if (t & 4) {
      result.bannedCount = e.int();
    }
    if (t & 8192) {
      result.onlineCount = e.int();
    }
    result.readInboxMaxId = e.int();
    result.readOutboxMaxId = e.int();
    result.unreadCount = e.int();
    result.chatPhoto = e.object();
    result.notifySettings = e.object();
    if (t & 8388608) {
      result.exportedInvite = e.object();
    }
    result.botInfo = e.vector(e.object);
    if (t & 16) {
      result.migratedFromChatId = e.long();
    }
    if (t & 16) {
      result.migratedFromMaxId = e.int();
    }
    if (t & 32) {
      result.pinnedMsgId = e.int();
    }
    if (t & 256) {
      result.stickerset = e.object();
    }
    if (t & 512) {
      result.availableMinId = e.int();
    }
    if (t & 2048) {
      result.folderId = e.int();
    }
    if (t & 16384) {
      result.linkedChatId = e.long();
    }
    if (t & 32768) {
      result.location = e.object();
    }
    if (t & 131072) {
      result.slowmodeSeconds = e.int();
    }
    if (t & 262144) {
      result.slowmodeNextSendDate = e.int();
    }
    if (t & 4096) {
      result.statsDc = e.int();
    }
    result.pts = e.int();
    if (t & 2097152) {
      result.call = e.object();
    }
    if (t & 16777216) {
      result.ttlPeriod = e.int();
    }
    if (t & 33554432) {
      result.pendingSuggestions = e.vector(e.string);
    }
    if (t & 67108864) {
      result.groupcallDefaultJoinAs = e.object();
    }
    if (t & 134217728) {
      result.themeEmoticon = e.string();
    }
    if (t & 268435456) {
      result.requestsPending = e.int();
    }
    if (t & 268435456) {
      result.recentRequesters = e.vector(e.long);
    }
    if (t & 536870912) {
      result.defaultSendAs = e.object();
    }
    if (t & 1073741824) {
      result.availableReactions = e.object();
    }
    if (n & 8192) {
      result.reactionsLimit = e.int();
    }
    if (n & 16) {
      result.stories = e.object();
    }
    if (n & 128) {
      result.wallpaper = e.object();
    }
    if (n & 256) {
      result.boostsApplied = e.int();
    }
    if (n & 512) {
      result.boostsUnrestrict = e.int();
    }
    if (n & 1024) {
      result.emojiset = e.object();
    }
    if (n & 131072) {
      result.botVerification = e.object();
    }
    if (n & 262144) {
      result.stargiftsCount = e.int();
    }
    if (n & 2097152) {
      result.sendPaidMessagesStars = e.long();
    }
    if (n & 4194304) {
      result.mainTab = e.object();
    }
    return result;
  },
  2515496747: function (e) {
    var result = { _: `message` };
    var t = e.uint();
    result.flags = t;
    result.out = !!(t & 2);
    result.mentioned = !!(t & 16);
    result.mediaUnread = !!(t & 32);
    result.silent = !!(t & 8192);
    result.post = !!(t & 16384);
    result.fromScheduled = !!(t & 262144);
    result.legacy = !!(t & 524288);
    result.editHide = !!(t & 2097152);
    result.pinned = !!(t & 16777216);
    result.noforwards = !!(t & 67108864);
    result.invertMedia = !!(t & 134217728);
    var n = e.uint();
    result.flags2 = n;
    result.offline = !!(n & 2);
    result.videoProcessingPending = !!(n & 16);
    result.paidSuggestedPostStars = !!(n & 256);
    result.paidSuggestedPostTon = !!(n & 512);
    result.id = e.int();
    if (t & 256) {
      result.fromId = e.object();
    }
    if (t & 536870912) {
      result.fromBoostsApplied = e.int();
    }
    if (n & 4096) {
      result.fromRank = e.string();
    }
    result.peerId = e.object();
    if (t & 268435456) {
      result.savedPeerId = e.object();
    }
    if (t & 4) {
      result.fwdFrom = e.object();
    }
    if (t & 2048) {
      result.viaBotId = e.long();
    }
    if (n & 1) {
      result.viaBusinessBotId = e.long();
    }
    if (n & 524288) {
      result.guestchatViaFrom = e.object();
    }
    if (t & 8) {
      result.replyTo = e.object();
    }
    result.date = e.int();
    result.message = e.string();
    if (t & 512) {
      result.media = e.object();
    }
    if (t & 64) {
      result.replyMarkup = e.object();
    }
    if (t & 128) {
      result.entities = e.vector(e.object);
    }
    if (t & 1024) {
      result.views = e.int();
    }
    if (t & 1024) {
      result.forwards = e.int();
    }
    if (t & 8388608) {
      result.replies = e.object();
    }
    if (t & 32768) {
      result.editDate = e.int();
    }
    if (t & 65536) {
      result.postAuthor = e.string();
    }
    if (t & 131072) {
      result.groupedId = e.long();
    }
    if (t & 1048576) {
      result.reactions = e.object();
    }
    if (t & 4194304) {
      result.restrictionReason = e.vector(e.object);
    }
    if (t & 33554432) {
      result.ttlPeriod = e.int();
    }
    if (t & 1073741824) {
      result.quickReplyShortcutId = e.int();
    }
    if (n & 4) {
      result.effect = e.long();
    }
    if (n & 8) {
      result.factcheck = e.object();
    }
    if (n & 32) {
      result.reportDeliveryUntilDate = e.int();
    }
    if (n & 64) {
      result.paidMessageStars = e.long();
    }
    if (n & 128) {
      result.suggestedPost = e.object();
    }
    if (n & 1024) {
      result.scheduleRepeatPeriod = e.int();
    }
    if (n & 2048) {
      result.summaryFromLanguage = e.string();
    }
    return result;
  },
  299870598: function (e) {
    var result = { _: `updateBotChatInviteRequester` };
    result.peer = e.object();
    result.date = e.int();
    result.userId = e.long();
    result.about = e.string();
    result.invite = e.object();
    result.qts = e.int();
    return result;
  },
  2531960299: function (e) {
    var result = { _: `draftMessage` };
    var t = e.uint();
    result.flags = t;
    result.noWebpage = !!(t & 2);
    result.invertMedia = !!(t & 64);
    if (t & 16) {
      result.replyTo = e.object();
    }
    result.message = e.string();
    if (t & 8) {
      result.entities = e.vector(e.object);
    }
    if (t & 32) {
      result.media = e.object();
    }
    result.date = e.int();
    if (t & 128) {
      result.effect = e.long();
    }
    if (t & 256) {
      result.suggestedPost = e.object();
    }
    return result;
  },
  2592793057: function (e) {
    var result = { _: `pageBlockOrderedList` };
    result.items = e.vector(e.object);
    return result;
  },
  3106911949: function (e) {
    var result = { _: `pageListItemText` };
    result.text = e.object();
    return result;
  },
  635466748: function (e) {
    var result = { _: `pageListItemBlocks` };
    result.blocks = e.vector(e.object);
    return result;
  },
  1577484359: function (e) {
    var result = { _: `pageListOrderedItemText` };
    result.num = e.string();
    result.text = e.object();
    return result;
  },
  2564655414: function (e) {
    var result = { _: `pageListOrderedItemBlocks` };
    result.num = e.string();
    result.blocks = e.vector(e.object);
    return result;
  },
  3445908332: function (e) {
    var result = { _: `connectedBot` };
    var t = e.uint();
    result.flags = t;
    result.botId = e.long();
    result.recipients = e.object();
    result.rights = e.object();
    return result;
  },
  988112002: function (e) {
    var t = e.uint(),
      n = e.uint();
    return {
      _: `message`,
      flags: t,
      out: !!(t & 2),
      mentioned: !!(t & 16),
      mediaUnread: !!(t & 32),
      silent: !!(t & 8192),
      post: !!(t & 16384),
      fromScheduled: !!(t & 262144),
      legacy: !!(t & 524288),
      editHide: !!(t & 2097152),
      pinned: !!(t & 16777216),
      noforwards: !!(t & 67108864),
      invertMedia: !!(t & 134217728),
      flags2: n,
      offline: !!(n & 2),
      videoProcessingPending: !!(n & 16),
      paidSuggestedPostStars: !!(n & 256),
      paidSuggestedPostTon: !!(n & 512),
      id: e.int(),
      fromId: t & 256 ? e.object() : void 0,
      fromBoostsApplied: t & 536870912 ? e.int() : void 0,
      fromRank: n & 4096 ? e.string() : void 0,
      peerId: e.object(),
      savedPeerId: t & 268435456 ? e.object() : void 0,
      fwdFrom: t & 4 ? e.object() : void 0,
      viaBotId: t & 2048 ? e.long() : void 0,
      viaBusinessBotId: n & 1 ? e.long() : void 0,
      replyTo: t & 8 ? e.object() : void 0,
      date: e.int(),
      message: e.string(),
      media: t & 512 ? e.object() : void 0,
      replyMarkup: t & 64 ? e.object() : void 0,
      entities: t & 128 ? e.vector(e.object) : void 0,
      views: t & 1024 ? e.int() : void 0,
      forwards: t & 1024 ? e.int() : void 0,
      replies: t & 8388608 ? e.object() : void 0,
      editDate: t & 32768 ? e.int() : void 0,
      postAuthor: t & 65536 ? e.string() : void 0,
      groupedId: t & 131072 ? e.long() : void 0,
      reactions: t & 1048576 ? e.object() : void 0,
      restrictionReason: t & 4194304 ? e.vector(e.object) : void 0,
      ttlPeriod: t & 33554432 ? e.int() : void 0,
      quickReplyShortcutId: t & 1073741824 ? e.int() : void 0,
      effect: n & 4 ? e.long() : void 0,
      factcheck: n & 8 ? e.object() : void 0,
      reportDeliveryUntilDate: n & 32 ? e.int() : void 0,
      paidMessageStars: n & 64 ? e.long() : void 0,
      suggestedPost: n & 128 ? e.object() : void 0,
      scheduleRepeatPeriod: n & 1024 ? e.int() : void 0,
      summaryFromLanguage: n & 2048 ? e.string() : void 0,
    };
  },
  3767884348: function (e) {
    return {
      _: `auth.sentCodePaymentRequired`,
      storeProduct: e.string(),
      phoneCodeHash: e.string(),
      supportEmailAddress: e.string(),
      supportEmailSubject: e.string(),
      currency: e.string(),
      amount: e.long(),
    };
  },
  3091356649: function (e) {
    var t = e.long(),
      n = e.uint();
    return {
      _: `poll`,
      id: t,
      flags: n,
      closed: !!(n & 1),
      publicVoters: !!(n & 2),
      multipleChoice: !!(n & 4),
      quiz: !!(n & 8),
      openAnswers: !!(n & 64),
      revotingDisabled: !!(n & 128),
      shuffleAnswers: !!(n & 256),
      hideResultsUntilClose: !!(n & 512),
      creator: !!(n & 1024),
      question: e.object(),
      answers: e.vector(e.object),
      closePeriod: n & 16 ? e.int() : void 0,
      closeDate: n & 32 ? e.int() : void 0,
      hash: e.long(),
    };
  },
  2612159341: function (e) {
    var t = e.uint();
    return {
      _: `inputStorePaymentAuthCode`,
      flags: t,
      restore: !!(t & 1),
      phoneNumber: e.string(),
      phoneCodeHash: e.string(),
      currency: e.string(),
      amount: e.long(),
    };
  },
  2694004571: function (e) {
    return {
      _: `chatParticipantAdmin`,
      userId: e.int53(),
      inviterId: e.int53(),
      date: e.int(),
    };
  },
  3832270564: function (e) {
    return { _: `chatParticipantCreator`, userId: e.int53() };
  },
  3224190983: function (e) {
    return {
      _: `chatParticipant`,
      userId: e.int53(),
      inviterId: e.int53(),
      date: e.int(),
    };
  },
  2629079273: function (e) {
    var t = e.uint(),
      n = e.uint();
    return {
      _: `message`,
      flags: t,
      out: !!(t & 2),
      mentioned: !!(t & 16),
      mediaUnread: !!(t & 32),
      silent: !!(t & 8192),
      post: !!(t & 16384),
      fromScheduled: !!(t & 262144),
      legacy: !!(t & 524288),
      editHide: !!(t & 2097152),
      pinned: !!(t & 16777216),
      noforwards: !!(t & 67108864),
      invertMedia: !!(t & 134217728),
      flags2: n,
      offline: !!(n & 2),
      videoProcessingPending: !!(n & 16),
      paidSuggestedPostStars: !!(n & 256),
      paidSuggestedPostTon: !!(n & 512),
      id: e.int(),
      fromId: t & 256 ? e.object() : void 0,
      fromBoostsApplied: t & 536870912 ? e.int() : void 0,
      peerId: e.object(),
      savedPeerId: t & 268435456 ? e.object() : void 0,
      fwdFrom: t & 4 ? e.object() : void 0,
      viaBotId: t & 2048 ? e.int53() : void 0,
      viaBusinessBotId: n & 1 ? e.int53() : void 0,
      replyTo: t & 8 ? e.object() : void 0,
      date: e.int(),
      message: e.string(),
      media: t & 512 ? e.object() : void 0,
      replyMarkup: t & 64 ? e.object() : void 0,
      entities: t & 128 ? e.vector(e.object) : void 0,
      views: t & 1024 ? e.int() : void 0,
      forwards: t & 1024 ? e.int() : void 0,
      replies: t & 8388608 ? e.object() : void 0,
      editDate: t & 32768 ? e.int() : void 0,
      postAuthor: t & 65536 ? e.string() : void 0,
      groupedId: t & 131072 ? e.long() : void 0,
      reactions: t & 1048576 ? e.object() : void 0,
      restrictionReason: t & 4194304 ? e.vector(e.object) : void 0,
      ttlPeriod: t & 33554432 ? e.int() : void 0,
      quickReplyShortcutId: t & 1073741824 ? e.int() : void 0,
      effect: n & 4 ? e.long() : void 0,
      factcheck: n & 8 ? e.object() : void 0,
      reportDeliveryUntilDate: n & 32 ? e.int() : void 0,
      paidMessageStars: n & 64 ? e.long() : void 0,
      suggestedPost: n & 128 ? e.object() : void 0,
      scheduleRepeatPeriod: n & 1024 ? e.int() : void 0,
      summaryFromLanguage: n & 2048 ? e.string() : void 0,
    };
  },
  2687222078: function (e) {
    var t = e.uint(),
      n = e.uint();
    return {
      _: `userFull`,
      flags: t,
      blocked: !!(t & 1),
      phoneCallsAvailable: !!(t & 16),
      phoneCallsPrivate: !!(t & 32),
      canPinMessage: !!(t & 128),
      hasScheduled: !!(t & 4096),
      videoCallsAvailable: !!(t & 8192),
      voiceMessagesForbidden: !!(t & 1048576),
      translationsDisabled: !!(t & 8388608),
      storiesPinnedAvailable: !!(t & 67108864),
      blockedMyStoriesFrom: !!(t & 134217728),
      wallpaperOverridden: !!(t & 268435456),
      contactRequirePremium: !!(t & 536870912),
      readDatesPrivate: !!(t & 1073741824),
      flags2: n,
      sponsoredEnabled: !!(n & 128),
      canViewRevenue: !!(n & 512),
      botCanManageEmojiStatus: !!(n & 1024),
      displayGiftsButton: !!(n & 65536),
      noforwardsMyEnabled: !!(n & 8388608),
      noforwardsPeerEnabled: !!(n & 16777216),
      id: e.int53(),
      about: t & 2 ? e.string() : void 0,
      settings: e.object(),
      personalPhoto: t & 2097152 ? e.object() : void 0,
      profilePhoto: t & 4 ? e.object() : void 0,
      fallbackPhoto: t & 4194304 ? e.object() : void 0,
      notifySettings: e.object(),
      botInfo: t & 8 ? e.object() : void 0,
      pinnedMsgId: t & 64 ? e.int() : void 0,
      commonChatsCount: e.int(),
      folderId: t & 2048 ? e.int() : void 0,
      ttlPeriod: t & 16384 ? e.int() : void 0,
      theme: t & 32768 ? e.object() : void 0,
      privateForwardName: t & 65536 ? e.string() : void 0,
      botGroupAdminRights: t & 131072 ? e.object() : void 0,
      botBroadcastAdminRights: t & 262144 ? e.object() : void 0,
      wallpaper: t & 16777216 ? e.object() : void 0,
      stories: t & 33554432 ? e.object() : void 0,
      businessWorkHours: n & 1 ? e.object() : void 0,
      businessLocation: n & 2 ? e.object() : void 0,
      businessGreetingMessage: n & 4 ? e.object() : void 0,
      businessAwayMessage: n & 8 ? e.object() : void 0,
      businessIntro: n & 16 ? e.object() : void 0,
      birthday: n & 32 ? e.object() : void 0,
      personalChannelId: n & 64 ? e.int53() : void 0,
      personalChannelMessage: n & 64 ? e.int() : void 0,
      stargiftsCount: n & 256 ? e.int() : void 0,
      starrefProgram: n & 2048 ? e.object() : void 0,
      botVerification: n & 4096 ? e.object() : void 0,
      sendPaidMessagesStars: n & 16384 ? e.long() : void 0,
      disallowedGifts: n & 32768 ? e.object() : void 0,
      starsRating: n & 131072 ? e.object() : void 0,
      starsMyPendingRating: n & 262144 ? e.object() : void 0,
      starsMyPendingRatingDate: n & 262144 ? e.int() : void 0,
      mainTab: n & 1048576 ? e.object() : void 0,
      savedMusic: n & 2097152 ? e.object() : void 0,
      note: n & 4194304 ? e.object() : void 0,
    };
  },
  3992020209: function (e) {
    var t = e.uint();
    return {
      _: `storyItem`,
      flags: t,
      pinned: !!(t & 32),
      public: !!(t & 128),
      closeFriends: !!(t & 256),
      min: !!(t & 512),
      noforwards: !!(t & 1024),
      edited: !!(t & 2048),
      contacts: !!(t & 4096),
      selectedContacts: !!(t & 8192),
      out: !!(t & 65536),
      id: e.int(),
      date: e.int(),
      fromId: t & 262144 ? e.object() : void 0,
      fwdFrom: t & 131072 ? e.object() : void 0,
      expireDate: e.int(),
      caption: t & 1 ? e.string() : void 0,
      entities: t & 2 ? e.vector(e.object) : void 0,
      media: e.object(),
      mediaAreas: t & 16384 ? e.vector(e.object) : void 0,
      privacy: t & 4 ? e.vector(e.object) : void 0,
      views: t & 8 ? e.object() : void 0,
      sentReaction: t & 32768 ? e.object() : void 0,
      albums: t & 524288 ? e.vector(e.int) : void 0,
    };
  },
  1272375192: function (e) {
    return { _: `messageMediaPoll`, poll: e.object(), results: e.object() };
  },
  2061444128: function (e) {
    var t = e.uint();
    return {
      _: `pollResults`,
      flags: t,
      min: !!(t & 1),
      results: t & 2 ? e.vector(e.object) : void 0,
      totalVoters: t & 4 ? e.int() : void 0,
      recentVoters: t & 8 ? e.vector(e.object) : void 0,
      solution: t & 16 ? e.string() : void 0,
      solutionEntities: t & 16 ? e.vector(e.object) : void 0,
    };
  },
  997055186: function (e) {
    var t = e.uint();
    return {
      _: `pollAnswerVoters`,
      flags: t,
      chosen: !!(t & 1),
      correct: !!(t & 2),
      option: e.bytes(),
      voters: e.int(),
    };
  },
  1484026161: function (e) {
    var t = e.long(),
      n = e.uint();
    return {
      _: `poll`,
      id: t,
      flags: n,
      closed: !!(n & 1),
      publicVoters: !!(n & 2),
      multipleChoice: !!(n & 4),
      quiz: !!(n & 8),
      question: e.object(),
      answers: e.vector(e.object),
      closePeriod: n & 16 ? e.int() : void 0,
      closeDate: n & 32 ? e.int() : void 0,
    };
  },
  4279689930: function (e) {
    return { _: `pollAnswer`, text: e.object(), option: e.bytes() };
  },
  1766936791: function (e) {
    var t = e.uint();
    return {
      _: `messageMediaPhoto`,
      flags: t,
      spoiler: !!(t & 8),
      photo: t & 1 ? e.object() : void 0,
      ttlSeconds: t & 4 ? e.int() : void 0,
    };
  },
  1763137035: function (e) {
    var t = e.uint();
    return {
      _: `messageReplyHeader`,
      flags: t,
      replyToScheduled: !!(t & 4),
      forumTopic: !!(t & 8),
      quote: !!(t & 512),
      replyToMsgId: t & 16 ? e.int() : void 0,
      replyToPeerId: t & 1 ? e.object() : void 0,
      replyFrom: t & 32 ? e.object() : void 0,
      replyMedia: t & 256 ? e.object() : void 0,
      replyToTopId: t & 2 ? e.int() : void 0,
      quoteText: t & 64 ? e.string() : void 0,
      quoteEntities: t & 128 ? e.vector(e.object) : void 0,
      quoteOffset: t & 1024 ? e.int() : void 0,
      todoItemId: t & 2048 ? e.int() : void 0,
    };
  },
};
