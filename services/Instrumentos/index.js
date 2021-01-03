const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  
  type Instrumento @key(fields: "id"){
    id: ID!
    idOp: ID!
    liquidado: Boolean
    enPlazo:Boolean
  }

  extend type Producto{
    id: ID! @external
    nombre: String @external
  }
    
  extend type Operacion @key(fields: "id") {
    id: ID! @external
    fechaValor: String @external
    liquidada: Boolean
    instrumentos: [Instrumento]
    enPlazo: Boolean @requires(fields: "fechaValor")
    productoOperacion: Producto @provides(fields: "nombre") 
  }

  extend type Query {
    getInstrumentos (idOperacion: ID!): [Instrumento]
  }

`;

const resolvers = {

  Query:{
    getInstrumentos(idOperacion) {
      return misInstrumentos.filter(op => op.idOp == idOperacion);
    }
  },

  Operacion: {
    __resolveReference(object) {
      return {
        ...object,
        ...extOperaciones.find(operacion => operacion.id == object.id),
        ...misInstrumentos.filter(op => op.idOp == object.id)
      };
    },

    enPlazo(object) {
      let now = new Date();
      return (object.fechaValor < now);
    },

    productoOperacion (operacion){
      return {
        __typename: "Producto",
        id: operacion.idProdOp,
      };
    },

    instrumentos(operacion){
      return misInstrumentos.filter(op => op.idOp == operacion.id);
    },

    liquidada(operacion){
      const filtrado = misInstrumentos.filter(op => op.idOp == operacion.id)
      const encontrado = filtrado.find(inst => inst.liquidado == false);
      return (encontrado == null) ; // Si no encuentro uno lo liquidado la operacion está liquidada
    }

  },

  Instrumento: {
    __resolveReference(object) {
      return misInstrumentos.filter(instrumento => instrumento.id == object.id);
    }
  },

  Producto: {
      __resolveReference(object) {
      return filter(producto => producto.id == object.id);
    }, 

    nombre(producto) {
      const encontrado = nombresProducto.find(nombre => nombre.id == producto.id);
      return encontrado ? encontrado.nombre : null;
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

server.listen({ port: 4004 }).then(({ url }) => {
  console.log(`🚀 Los instrumentos están activos en: ${url}`);
});

//
// Datos
//

const extOperaciones = [
  { 
    id: 1, 
    liquidada: true,
    idProdOp: 1
   },
  { 
    id: 2, 
    liquidada: false,
    idProdOp: 1
   },
  { 
    id: 3, 
    liquidada: true,
    idProdOp: 2 
  }
];

const nombresProducto = [
  {id: 1, nombre: "Swap"},
  {id: 2, nombre: "Bono"}
]

const misInstrumentos = [
  {
    id: 1,
    idOp: 2,
    liquidado: true,
    enPlazo: false
  },
  {
    id: 2,
    idOp:1,
    liquidado: false,
    enPlazo: true
  },
  {
    id: 3,
    idOp: 1,
    liquidado: true,
    enPlazo: false
  },
  {
    id: 4,
    idOp: 3,
    liquidado: true,
    enPlazo: false
  },
  {
    id: 5,
    idOp: 3,
    liquidado: false,
    enPlazo: true
  },
  {
    id: 6,
    idOp: 2,
    liquidado: true,
    enPlazo: true
  }
];


/* 
{
  GetOperacion(identificador: 2)
  {
    nombre
    contrapartida
    liquidada
    instrumentos{
      id
      idOp
      liquidado
      enPlazo
    }
    productoOperacion{
      id
      nombre
      tipo
    }
  },
  GetOperaciones
  {
    nombre
    fechaValor
    liquidada
  }
  GetDeltaCartera
  GetNombreCartera
}  */
