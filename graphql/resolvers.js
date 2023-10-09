const Author = require('../models/authors');

const resolvers = {
  Query: {
    author: (parent, args) => {
      return Author.findById(args.id);
    },
    authors: () => {
      return Author.find({});
    },
  },
};

module.export = resolvers