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