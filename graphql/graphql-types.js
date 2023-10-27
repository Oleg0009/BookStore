const { gql } = require('apollo-server-express');

const authorTypeDefs = gql`
  type Author {
    _id: ID!
    name: String!
    overview: String
    coverImage: String # Assuming you store the image path as a URL
    coverImageType: String
  }

  type Query {
    author(id: ID!): Author
    authors: [Author]
  }

  type Mutation {
    createAuthor(name: String!, overview: String, coverImage: String, coverImageType: String): Author
    updateAuthor(id: ID!, name: String!, overview: String, coverImage: String, coverImageType: String): Author
    deleteAuthor(id: ID!): Author
  }
  type AuthorAdded {
    author: Author
  }

  type Subscription {
    authorAdded: AuthorAdded
  }
`;

module.exports = authorTypeDefs;