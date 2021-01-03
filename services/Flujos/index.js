const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`

  interface Flujo {
    id: ID!
    instruccionLiquidacion: String
  }

  type FlujoCash implements Flujo {
    id: ID!
    instruccionLiquidacion: String
    cash: Float
  }

  type FlujoTitulo implements Flujo {
    id: ID!
    instruccionLiquidacion: String
    titulo: String
  }

  extend type Query {
    GetTipo(idFlujo: ID): String
    GetFlujos: [Flujo]
  }

`;

const resolvers = {
  Query: {
    
    GetTipo(_, { idFlujo })
    {
      flujo = misFlujos.find(Flujo => Flujo.id == idFlujo)

      if (!flujo) 
        return "No encontrado tipo"

      if (flujo.cash)
        return "FlujoCash";
      else
        return "FlujoTitulo"
    },

    GetFlujos()
    {
      return misFlujos;
    }

  },
    
  Flujo: {
    __resolveType(obj, context, info) {
      if (obj.cash) 
        return "FlujoCash";
      else  
        return "FlujoTitulo"
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

server.listen({ port: 4002 }).then(({ url }) => {
  console.log(`🚀 Los flujos activos en: ${url}`);
});


//
// Datos
// 

const misFlujos = [
  {
    id: 1,
    instruccionesLiquidacion: "IL de la uno",
    cash: 1234
  },
  {
    id: 2,
    instruccionesLiquidacion: "IL de la dos",
    titulo: "Bono"
  },
  {
    id: 3,
    instruccionesLiquidacion: "IL de la tres",
    cash: 45.7
  },
  {
    id: 4,
    instruccionesLiquidacion: "IL de la cuatro",
    titulo: "Swap"
  }
];

/* 
{
  GetFlujos
  {
    id
    ...on FlujoCash{
      cash
    }
    ...on FlujoTitulo{
      titulo
    }
  }
  GetTipo(idFlujo : 3)
} */