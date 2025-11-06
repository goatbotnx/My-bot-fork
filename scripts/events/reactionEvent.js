module.exports = {
  config: {
    name: "mirrorReaction",
    version: "1.0",
    author: "xalman",
    eventType: ["message_reaction"],
    description: "Bot reacts back with the same emoji when someone reacts",
  },

  onReaction: async function({ event, api }) {
    try {
      // ইউজারের রিয়্যাক্ট ইমোজি বের করা
      const userReact = event.reaction;

      // কেউ রিয়্যাক্ট দিলে বটও সেই একই ইমোজি দিয়ে রিয়্যাক্ট করবে
      if (userReact) {
        api.setMessageReaction(userReact, event.messageID, () => {}, true);
      }
    } catch (err) {
      console.log("Mirror Reaction Error:", err);
    }
  }
};
