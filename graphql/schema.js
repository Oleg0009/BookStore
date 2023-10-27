const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLSchema
} = require('graphql');

const Author = require('../models/authors');

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    overview: { type: GraphQLString },
    coverImage: { type: GraphQLString }
  }),
});





const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // Implement a resolver to fetch an author by ID from MongoDB
        return Author.findById(args.id);
      },
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        // Implement a resolver to fetch all authors from MongoDB
        return Author.find({});
      },
    },
  },
});

const RootSubscription = new GraphQLObjectType({
  name: 'Subscription',
  fields: {
    authorAdded: {
      type: AuthorType, // The type of data being sent to clients when a new author is added
      resolve: (payload) => {
        
        return payload
      }, // The resolver to extract the author data
      subscribe: () => pubsub.asyncIterator(['AUTHOR_ADDED']), // Subscription event name
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  subscription: RootSubscription,
});