const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  extend type Query {
    ProductosMasUsados(first: Int = 5): [Producto]
  }

  type Producto @key(fields: "id") {
    id: ID!
    nombre: String
    tipo: String
  }
`;

const resolvers = {
  Producto: {
    __resolveReference(object) {
      return productos.find(Producto => Producto.id === object.id);
    }
  },
  Query: {
    ProductosMasUsados(_, args) {
      return productos.slice(0, args.first);
    }
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ])
});

server.listen({ port: 4003 }).then(({ url }) => {
  console.log(`🚀 Servidor de Productos activo en: ${url}`);
});

const productos = [
  {
    id: 1,
    nombre: "Swap",
    tipo: "Derivado"
  },
  {
    id: 2,
    nombre: "Bono",
    tipo: "Cash"
  },
  {
    id: 3,
    nombre: "CDS",
    tipo: "Derivado"
  }
];

/* 
{
  ProductosMasUsados(first: 1)
  {
    id
    nombre
  }
} */