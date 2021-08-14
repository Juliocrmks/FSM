const checkAuth = require("../../utils/checkAuth");
const { AuthenticationError, UserInputError } = require("apollo-server");
const User = require("../../models/User");
const Message = require("../../models/Message");

module.exports = {
  Mutation: {
    sendMessage: async (parent, { to, content }, context) => {
      try {
        const user = checkAuth(context);
        if (!user) throw new AuthenticationError("Unauthenticated");
        const recipient = await User.findOne({ username: to });
        if (!recipient) {
          throw new UserInputError("User not found");
        } else if (recipient.username === user.username) {
          throw new UserInputError("You cant message youself");
        }
        if (content.trim() === "") {
          throw new UserInputError("Message is empty");
        }

        const message = new Message({
          from: user.username,
          to,
          content,
          createdAt: new Date().toISOString(),
        });
        message.save();
        return message;
      } catch (error) {
        console.log("err", error);
      }
    },
  },
  Query: {
    getMessages: async (parent, { from }, context) => {
      try {
        const user = checkAuth(context);
        if (!user) throw new AuthenticationError("Unauthenticated");
        const otherUser = await User.findOne({ username: from });
        if (!otherUser) throw new UserInputError("User not found");
        const messages = await Message.find({
          to: [from, user.username],
          from: [from, user.username],
        }).sort({ createdAt: -1 });
        console.log(messages);
        return messages;
      } catch (error) {
        console.log(error);
        throw new error();
      }
    },
    
  },
};
