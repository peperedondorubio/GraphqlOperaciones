const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const redis = require('redis');
const DataLoader = require('dataloader');

var productos;
var redisLoader;
var promesaCarga;

const typeDefs = gql`
  extend type Query {
    ProductosMasUsados(first: Int = 5): [Producto]
    GetProducto (identificador: Int): Producto
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
      console.log("Producto: ", object)
      return productos.find(Producto => Producto.id === object.id);
    }
  },
  Query: {
    
    ProductosMasUsados(_, args) {
      console.log("PMU: ", args)
      return productos.slice(0, args.first);
    },

    GetProducto (_, {identificador}) {
      return productos.find(Producto => Producto.id === identificador)
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

const prometoCargarRedis = async function() 
{
  const client = redis.createClient();
  client.connect();
  
  const prm = keys => new Promise( (resolve, reject) => 
  {
    p1 = client.mGet(keys) ;
    console.log("Leo de Redis: ", keys)
    resolve (p1);

  })

  redisLoader = new DataLoader(prm);
  return prm
}

const cargaRedis =  async function() 
{
  const carga = await redisLoader.loadMany(['Productos'])
  productos = await JSON.parse(carga[0])
  console.log(productos)
}

promesaCarga = prometoCargarRedis ();

promesaCarga.then(() => {
  cargaRedis(); 
  console.log("GetProducto: ", productos)
})

/* 
{
  ProductosMasUsados(first: 1)
  {
    id
    nombre
  }
} */


/* const productos = [
  {
    "id": 1,
    "nombre": "Swap",
    "tipo": "Derivado"
  },
  {
    "id": 2,
    "nombre": "Bono",
    "tipo": "Cash"
  },
  {
    "id": 3,
    "nombre": "CDS",
    "tipo": "Derivado"
  }
];
*/ 