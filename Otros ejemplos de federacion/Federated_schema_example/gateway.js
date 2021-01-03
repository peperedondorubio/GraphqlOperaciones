const { ApolloServer } = require('apollo-server');
const { ApolloGateway } = require('@apollo/gateway');

// Initialize an ApolloGateway instance and pass it an array of
// your implementing service names and URLs
const gateway = new ApolloGateway({
    serviceList: [
        { name: 'accounts', url: 'http://localhost:4001' },
        { name: 'products', url: 'http://localhost:4002' },
        { name: 'reviews', url: 'http://localhost:4003' }
    ],
});

// Pass the ApolloGateway to the ApolloServer constructor
const server = new ApolloServer({
    gateway,

    // Disable subscriptions (not currently supported with ApolloGateway)
    subscriptions: false,
});

server.listen(3000).then(({ url }) => {
    console.log(`🚀 Gateway activo en: ${url}`);
});