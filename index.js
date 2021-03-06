const { ApolloServer } = require("apollo-server");
const { PubSub } = require("graphql-subscriptions");

const mongoose = require("mongoose");
const { MONGODB } = require("./config.js");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const pubsub = new PubSub();
const PORT = process.env.PORT || 5000
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub }),
});
try {
  mongoose
    .connect(MONGODB, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => {
      console.log("MongoDB connected");
      return server.listen({ port: PORT });
    })
    .then((res) => {
      console.log(`Server running at ${res.url}`);
    })
    .catch((err) => console.log(err));
} catch (error) {
  console.log(error);
}
