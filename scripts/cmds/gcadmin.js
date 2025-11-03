module.exports = {
  config: {
    name: "admin",
    aliases: [],
    version: "1.0",
    author: "〲T A N J I L ツ",
    role: 1,
    shortDescription: {
      en: "Make or remove someone as admin"
    },
    longDescription: {
      en: "Only the owner, bot admin or group admin can make or remove someone as admin"
    },
    category: "Group",
    guide: {
      en: "/admin add [mention/reply/uid] or /admin remove [mention/reply/uid]"
    }
  },

  onStart: async function ({ api, event, args }) {
    const ownerUIDs = ["61582662637419", "100081088184521"]; // ✅ Multiple owner IDs
    const senderID = event.senderID;

    // Get thread info
    const threadInfo = await api.getThreadInfo(event.threadID);

    // Check admin status
    const isGroupAdmin = threadInfo.adminIDs.some(ad => ad.id === senderID);
    const isBotAdmin = threadInfo.adminIDs.some(ad => ad.id === api.getCurrentUserID());

    // Check permissions
    if (!ownerUIDs.includes(senderID) && !isGroupAdmin && !isBotAdmin) {
      return api.sendMessage("❌ You are not authorized to use this command.", event.threadID);
    }

    // Validate command
    const action = args[0];
    if (!["add", "remove"].includes(action)) {
      return api.sendMessage("❌ Invalid command.\nUse: /admin add [mention/reply/uid] or /admin remove [mention/reply/uid]", event.threadID);
    }

    let uid;

    // Get target UID
    if (event.messageReply) {
      uid = event.messageReply.senderID;
    } else if (Object.keys(event.mentions).length > 0) {
      uid = Object.keys(event.mentions)[0];
    } else if (args[1]) {
      uid = args[1];
    } else {
      return api.sendMessage("❌ Please mention, reply, or provide a UID.", event.threadID);
    }

    try {
      if (action === "add") {
        await api.changeAdminStatus(event.threadID, uid, true);
        api.sendMessage("✅ Successfully made admin.", event.threadID);
      } else {
        await api.changeAdminStatus(event.threadID, uid, false);
        api.sendMessage("✅ Successfully removed admin status.", event.threadID);
      }
    } catch (err) {
      api.sendMessage("❌ Failed. Make sure the bot is an admin in the group.", event.threadID);
      console.error(err);
    }
  }
};
