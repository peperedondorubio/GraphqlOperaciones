const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');

const typeDefs = gql`

    type Review {
        body: String
        product: Product
    }

    extend type User @key(fields: "id") {
        id: ID! @external
        reviews: [Review]
    }

    extend type Product @key(fields: "upc") {
        upc: String! @external
        reviews: [Review]
    }
`;

const resolvers = {
    Query: {
        buscaReview() {
            return { }
        },

    },
}

const server = new ApolloServer({
    schema: buildFederatedSchema([{ typeDefs, resolvers }])
});

server.listen(4003).then(({ url }) => {
    console.log(`🚀 Servidor Reviews en ${url}`);
});



/* author: User @provides(fields: "username") */