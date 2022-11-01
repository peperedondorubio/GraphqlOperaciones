const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
//var miCartera;

const typeDefs = gql`
  extend type Query {
    GetOperacion(identificador: Int!): Operacion
    GetDeltaCartera: Float
    GetNombreCartera: String
    GetOperaciones: [Operacion]
  }

  type Operacion @key(fields: "id") {
    id: ID!
    nombre: String
    contrapartida: String
    fechaValor: String
  }

  type Cartera @key(fields: "nombre") {
    nombre: String!
    delta: Float
    operaciones: [Operacion]
  }

`;

const resolvers = {
  Query: {
    GetOperacion(_, { identificador } ) {
      return miCartera.operaciones.find(Operacion => Operacion.id === identificador);
    },
    GetNombreCartera() {
      return miCartera.nombre
    },
    GetDeltaCartera(){
      return miCartera.delta
    },
    GetOperaciones(){
      return miCartera.operaciones
    },
  },

  Operacion: {
    __resolveReference(object) {
      return miCartera.operaciones.find(Operacion => Operacion.id === object.id);
    }
  },

  Cartera: {
    __resolveReference(object) {
      return miCartera.find(Cartera => Cartera.nombre === object.nombre);
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

server.listen({ port: 4001 }).then(({ url }) => {
  console.log(`🚀 Operaciones y Cartera activos en: ${url}`);
});





//
// Datos
//

/*

const cadConex = 'mongodb+srv://dbGraphQL:sabbath@pepeclustermongodb.njocn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority&useUnifiedTopology=true';
const nombreBaseDatos = 'DemoGraphQL';
const nombreColeccion = "Operaciones";

var miCartera;

const { MongoClient } = require('mongodb');

const client = new MongoClient(cadConex, {useUnifiedTopology: true});


const conectarse  = async () => {

  await client.connect();
  db = client.db(nombreBaseDatos);
  var cursor = db.collection(nombreColeccion).find();   // Cursor 

  cursor.each(function(err,doc) {       // Me muevo por la colección
      if (err)
          throw err;
          
      if(doc != null)
      {
          miCartera = doc  // Recojo los datos en json
          // console.log(miCartera)  
      }
  });

};


const init = async () => {

  await conectarse(); // obtenemos la conexión

  server.listen({ port: 4001 }).then(({ url }) => {
    console.log(`🚀 Operaciones y Cartera activos en: ${url}`);
  });

};

init();

*/

const miCartera = {
  "nombre": "Largo Plazo",
  "delta": 134.5,
  "operaciones": [
    {
      "id": 1,
      "nombre": "Op1",
      "contrapartida": "Telefónica",
      "fechaValor": "10/10/2020"
    },
    {
      "id": 2,
      "nombre": "Op2",
      "contrapartida": "Repsol",
      "fechaValor": "15/12/2020"
    },
    {
      "id": 3,
      "nombre": "Op3",
      "contrapartida": "JPMorgan",
      "fechaValor": "22/05/2019"
    }
  ]};


/*   
{
  GetOperacion(identificador: 2)
  {
    nombre
    contrapartida
  },
  GetOperaciones
  {
    nombre
    fechaValor
  }
  GetDeltaCartera
  GetNombreCartera
} */