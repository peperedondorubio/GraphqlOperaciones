const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');

const typeDefs = gql`
    extend type Query {
        topProducts(first: Int = 5): [Product]
    }

    type Product @key(fields: "upc") {
        upc: String!
        name: String!
        price: Int
    }
`;

const resolvers = {
    Query: {
        buscaProducto() {
            return { id: "1", username: "@ava" }
        },

    },
}

const server = new ApolloServer({
    schema: buildFederatedSchema([{ typeDefs, resolvers }])
});

server.listen(4002).then(({ url }) => {
    console.log(`🚀 Servidor Products en ${url}`);
});
