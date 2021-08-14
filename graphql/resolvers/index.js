const postsResolvers = require("./posts");
const userResolvers = require("./users");
const commentResolvers = require("./comments");
const messageResolvers = require("./messages");

module.exports = {
  Post: {
    likeCount: (parent) => {
      return parent.likes.length;
    },
    commentCount: (parent) => parent.comments.length,
  },
  Query: {
    ...postsResolvers.Query,
    ...messageResolvers.Query,
    ...userResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postsResolvers.Mutation,
    ...commentResolvers.Mutation,
    ...messageResolvers.Mutation,
  },
  Subscription: {
    ...postsResolvers.Subscription,
  },
};
