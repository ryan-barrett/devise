import { buildSchema }         from 'graphql';
import { customFormatErrorFn } from '../errors';
import {
  getUser,
  createUser,
  updateUser,
  getBoard,
  createBoard,
  updateBoard,
  getTicket,
  getTickets,
  createTicket,
  updateTicket
}                              from './resolvers';

export default () => {
  const schema = buildSchema(`
type User {
  id: ID!
  userName: String
  email: String
  boards: [String]
}

input userInput {
  id: String
  userName: String
  email: String
  boards: [String]
}

type Board {
  id: String!
  name: String!
  dateCreated: String
  lastUpdated: String
  tickets: [Ticket]
}

input boardInput {
  id: String
  name: String
}

type Ticket {
  id: String!
  user: String
  assignee: String
  status: String
  boardId: String
  title: String
  estimate: String
  description: String
  dateCreated: String
  lastUpdated: String
}

input ticketInput {
  id: String
  user: String
  status: String
  boardId: String
  title: String
  estimate: String
  description: String
}

type Query {
  getUser(userId: String!): User
  getBoard(input: String!): Board
  getTicket(input: String!): Ticket
  getTickets(input: [String!]): [Ticket] 
}

type Mutation {
  createUser(input: userInput): User
  updateUser(input: userInput): User
  createBoard(input: boardInput): Board
  updateBoard(input: boardInput): Board
  createTicket(input: ticketInput): Ticket
  updateTicket(input: ticketInput): Ticket
}
`);

  return {
    schema: schema,
    rootValue: {
      getUser,
      createUser,
      updateUser,
      getBoard,
      createBoard,
      updateBoard,
      getTicket,
      getTickets,
      createTicket,
      updateTicket
    },
    graphiql: true,
    customFormatErrorFn,
  };
};
