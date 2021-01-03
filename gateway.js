const { ApolloServer } = require("apollo-server");
const { ApolloGateway } = require("@apollo/gateway");

const gateway = new ApolloGateway({
  
  serviceList: [
    { name: "operaciones", url: "http://localhost:4001/graphql" },
    { name: "instrmentos", url: "http://localhost:4002/graphql" },
    { name: "flujos",      url: "http://localhost:4003/graphql" },
    { name: "productos",   url: "http://localhost:4004/graphql" }
  ],

  __exposeQueryPlanExperimental: false,
});

(async () => {
  const server = new ApolloServer({
    gateway,
    engine: false,
    subscriptions: false,
  });

  server.listen(4000).then(({ url }) => {
    console.log(`Gateway activo en: ${url}`);
  });
})();
