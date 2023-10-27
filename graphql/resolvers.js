const Author = require('../models/authors');
const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();

const resolvers = {
  Query: {
    author: (parent, args) => {
      return Author.findById(args.id);
    },
    authors: () => {
      return Author.find({});
    },

  },
  Mutation: {
    createAuthor: async (parent, args) => {
      // Add the new author to the database

      const newAuthor = await author.save();

      // Publish a notification about the new author addition
      pubsub.publish('AUTHOR_ADDED', {
        authorAdded: { author: 'author added' },
      });

      return newAuthor;
    },
  },
  Subscription: {
    authorAdded: {
      subscribe: () => pubsub.asyncIterator(['AUTHOR_ADDED']),
    },
  },
};

module.export = resolvers