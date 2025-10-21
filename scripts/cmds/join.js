const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");

module.exports = {
  config: {
    name: "join",
    version: "2.1",
    author: "Kshitiz & Modified by Xalman",
    countDown: 5,
    role: 0,
    shortDescription: "Join any group the bot is in",
    longDescription: "Shows all group chats and lets you join one by replying with its number.",
    category: "owner",
    guide: {
      en: "{p}{n}"
    },
  },

  onStart: async function ({ api, event }) {
    try {
      // Fetch up to 100 threads (maximum supported by API)
      const groupList = await api.getThreadList(100, null, ['INBOX']);

      // Filter only groups with valid names
      const filteredList = groupList.filter(group => group.isGroup && group.threadName);

      if (filteredList.length === 0) {
        return api.sendMessage('No group chats found.', event.threadID);
      }

      // Format list
      const formattedList = filteredList.map((group, index) =>
        `│${index + 1}. ${group.threadName}\n│𝐓𝐈𝐃: ${group.threadID}\n│𝐌𝐞𝐦𝐛𝐞𝐫𝐬: ${group.participantIDs.length}\n│`
      );

      const message = 
`╭─╮
│ 𝐋𝐢𝐬𝐭 𝐨𝐟 𝐆𝐫𝐨𝐮𝐩𝐬:
${formattedList.join("\n")}
╰───────────ꔪ
Reply with the group number you want to join.`;

      const sentMessage = await api.sendMessage(message, event.threadID);
      global.GoatBot.onReply.set(sentMessage.messageID, {
        commandName: 'join',
        messageID: sentMessage.messageID,
        author: event.senderID,
      });

    } catch (error) {
      console.error("Error listing group chats", error);
      api.sendMessage('⚠️ An error occurred while listing group chats.', event.threadID);
    }
  },

  onReply: async function ({ api, event, Reply, args }) {
    const { author } = Reply;

    if (event.senderID !== author) return;

    const groupIndex = parseInt(args[0], 10);
    if (isNaN(groupIndex) || groupIndex <= 0) {
      return api.sendMessage('⚠️ Invalid input. Please provide a valid number.', event.threadID, event.messageID);
    }

    try {
      const groupList = await api.getThreadList(100, null, ['INBOX']);
      const filteredList = groupList.filter(group => group.isGroup && group.threadName);

      if (groupIndex > filteredList.length) {
        return api.sendMessage('⚠️ Invalid group number. Please choose a valid one.', event.threadID, event.messageID);
      }

      const selectedGroup = filteredList[groupIndex - 1];
      const groupID = selectedGroup.threadID;

      const info = await api.getThreadInfo(groupID);

      if (info.participantIDs.includes(event.senderID)) {
        return api.sendMessage(`✅ You are already in "${selectedGroup.threadName}"`, event.threadID, event.messageID);
      }

      if (info.participantIDs.length >= 250) {
        return api.sendMessage(`❌ Can't join, the group "${selectedGroup.threadName}" is full.`, event.threadID, event.messageID);
      }

      await api.addUserToGroup(event.senderID, groupID);
      api.sendMessage(`🎉 Successfully added you to "${selectedGroup.threadName}"`, event.threadID, event.messageID);

    } catch (error) {
      console.error("Error joining group chat", error);
      api.sendMessage('⚠️ Error while joining the group. Please try again later.', event.threadID, event.messageID);
    } finally {
      global.GoatBot.onReply.delete(event.messageID);
    }
  },
};
