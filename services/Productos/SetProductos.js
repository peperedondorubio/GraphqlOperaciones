
const redis = require('redis');
const DataLoader = require('dataloader');
const client = redis.createClient();

client.connect()

client.on('error', (err) => console.log('Redis Client Error', err));

console.log("Eeeempezamos")


const start = async function() 
{
    console.log("Eeeempezamos en start")
    
    s = client.set("Productos", JSON.stringify(productos));

    await s.then(data => {
        console.log(data)
      })
      .catch(err => {
        console.log(err)
      })

/*+++++++++++++++++++++++++++++++++++++++*/

    var recojoProductos = JSON.parse( await client.get('Productos') )
    console.log(recojoProductos)


    process.exit(0)
}


// Array de Productos
const productos = [
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


  // Llamada al arranque
  start();

  