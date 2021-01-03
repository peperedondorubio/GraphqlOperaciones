const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');

const typeDefs = gql`
  type Query {
    me: User,
    meo: User,
    busca: Persona,
  }

  type User @key(fields: "id") {
    id: ID!
    username: String
  }

  type Persona {
      nombre: String
  }
`;

const resolvers = {
    Query: {
        me() {
            return { id: "1", username: "@ava" }
        },
        meo() {
            return { id: "2", username: "@aivo" }
        },
        busca() {
            return { nombre: "casa" }
        }
    },

    Persona: {
        __resolveType(obj, context, info) {
            return "Persona";
        }
    },

    User: {
        __resolveReference(user, { fetchUserById }) {
            return fetchUserById(user.id)
        }
    }
}

const server = new ApolloServer({
    schema: buildFederatedSchema([{ typeDefs, resolvers }])
});

server.listen(4001).then(({ url }) => {
    console.log(`🚀 Servidor accounts en ${url}`);
});
