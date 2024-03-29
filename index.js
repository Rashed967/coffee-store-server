const express = require('express')
const cors = require('cors')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// coffeServer
// ydDuknimP7xq6Igi

console.log(process.env.DB_PASSWORD)
console.log(process.env.DB_USER)


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kt6fwyn.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri)

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("coffeDB");
    const coffesCollection = database.collection("coffes");

    app.get('/coffee', async(req, res) => {
        const cursor = coffesCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })

    app.get('/coffee/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id : new ObjectId(id)}
        const result = await coffesCollection.findOne(query)
        res.send(result)
      })

    app.post('/coffee', async (req, res) => {
        const newCoffee = req.body;
        const result = await coffesCollection.insertOne(newCoffee)
        res.send(result)
    })

    app.delete('/coffee/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id : new ObjectId(id)}
        const result = await coffesCollection.deleteOne(query)
        res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send("hello express")
})

app.listen(port, () => {
    console.log(`server is runnnig on port ${port}`)
})