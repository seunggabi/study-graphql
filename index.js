const {ApolloServer} = require("apollo-server-express");
const express = require("express")
const {GraphQLScalarType} = require("graphql/type");
const expressPlayground = require("graphql-playground-middleware-express").default
const {MongoClient} = require("mongodb")
require("dotenv").config()

const typeDefs = `
  scalar DateTime
  
  enum PhotoCategory {
    SELFIE
    PORTRAIT
    ACTION
    LANDSCAPE
    GRAPHIC
  }
  
  type User {
    githubLogin: ID!
    name: String
    avatar: String
    postedPhotos: [Photo!]!
    inPhotos: [Photo!]!
  }
  
  type Query {
    totalPhotos: Int!
    allPhotos: [Photo!]!
    totalUsers: Int!
    allUsers: [User!]!
  }

  type Mutation {
    postPhoto(input: PostPhotoInput!): Photo!
  }
  
  type Photo {
    id: ID!
    url: String!
    name: String!
    description: String
    category: PhotoCategory!
    postedBy: User!
    taggedUsers: [User!]!
    created: DateTime!
  }
  
  input PostPhotoInput {
    name: String!
    category: PhotoCategory=PORTRAIT
    description: String
  }
`;

let _id = 0;
const users = [
  {
    githubLogin: "mHattrup",
    name: "Mike Hattrup"
  },
  {
    githubLogin: "gPlake",
    name: "Glen Plake"
  },
  {
    githubLogin: "sSchmidt",
    name: "Scot Schmidt"
  },
];
const photos = [
  {
    id: "1",
    name: "Dropping the Heart Chute",
    description: "The heart chute is one of my favorite chutes",
    category: "ACTION",
    githubUser: "gPlake",
    created: "3-28-1977"
  },
  {
    id: "2",
    name: "Enjoying the sunshine",
    category: "SELFIE",
    githubUser: "sSchmidt",
    created: "1-2-1985"
  },
  {
    id: "3",
    name: "Gunbarrel 25",
    deescription: "25 laps on gunbarrel today",
    category: "LANDSCAPE",
    githubUser: "sSchmidt",
    created: "2018-04-15T19:07:57.308Z"
  },
];
const tags = [
  {
    photoID: "1",
    userID: "gPlake"
  },
  {
    photoID: "2",
    userID: "sSchmidt"
  },
  {
    photoID: "2",
    userID: "mHattrup"
  },
  {
    photoID: "2",
    userID: "gPlake"
  },
];

const resolvers = {
  Query: {
    totalPhotos: (parent, args, {db}) =>
      db.collection("photos")
        .estimatedDocumentCount(),
    allPhotos: (parent, args, {db}) =>
      db.collection("photos")
        .find()
        .toArray(),
    totalUsers: (parent, args, {db}) =>
      db.collections("users")
        .estimatedDocumentCount(),
    allUsers: (parent, args, {db}) =>
      db.collections("users")
        .find()
        .toArray()
  },

  Mutation: {
    postPhoto(parent, args) {
      const photo = {
        id: _id++,
        ...args.input,
        created: new Date()
      };

      photos.push(photo);

      return photo;
    },
  },

  Photo: {
    url: (parent) => `http://yoursite.com/img/${parent.id}.png`,
    postedBy: parent => {
      return users.find(u => u.githubLogin === parent.githubUser)
    },
    taggedUsers: parent => tags
      .filter(tag => tag.photoID === parent.id)
      .map(tag => tag.userID)
      .map(userID => users.find(u => u.githubLogin === userID))
  },

  User: {
    postedPhotos: parent => {
      return photos.filter(p => p.githubUser === parent.githubLogin)
    },
    inPhotos: parent => tags
      .filter(tag => tag.userID === parent.id)
      .map(tag => tag.userID)
      .map(photoID => photos.find(p => p.id === photoID))
  },

  DateTime: new GraphQLScalarType({
    name: "DateTime",
    description: "A valid date time value.",
    parseValue: value => new Date(value),
    serialize: value => new Date(value).toISOString(),
    parseLiteral: ast => ast.value
  })
};

const start = async () => {
  const app = express();
  const DB = process.env.DB_HOST
  const PORT = 4000;

  const client = await MongoClient.connect(
    DB,
    {
      useNewUrlParser: true
    }
  )
  const db = client.db()
  const context = {db}

  const server = new ApolloServer({typeDefs, resolvers, context});
  await server.start();
  server.applyMiddleware({app});

  app
    .get("/", (req, res) => {
      return res.send("<h1>WELCOME to PhotoShare API</h1>");
    })
    .get("/playground", expressPlayground({endpoint: "/graphql"}))

  app.listen(PORT, () => {
    console.log(
      `GraphQL Server running @ http://localhost:${PORT}${server.graphqlPath}`
    );
  });
};

start();