const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hwqvi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
   res.send('CarHouse Server!')
})

client.connect(err => {
   const packageCollection = client.db("yatra").collection("packages");
   const orderCollection = client.db("yatra").collection("bookings");
   
   // add a single package
   app.post('/addPackage', async(req, res) => {
      const result = await packageCollection.insertOne(req.body);
      res.send(result)
   })

   // load all packages
   app.get('/packages', async(req, res) => {
      const result = await packageCollection.find({}).toArray()
      res.send(result)
   })

   // delete package
   app.delete('/deletePackage/:id', async(req, res) => {
      const query = {_id: ObjectId(req.params.id)}
      const result = await packageCollection.deleteOne(query);
      res.send(result)
   })

   // add bookings
   app.post('/addBooking', async(req, res) => {
      const result = await orderCollection.insertOne(req.body);
      res.send(result)
   })

   // load all bookings data
   app.get('/bookings', async(req, res) => {
      const result = await orderCollection.find({}).toArray()
      res.send(result)
   })

   // load a specific booking data
   app.get('/bookings/:email', async(req, res) => {
      const result = await orderCollection.find({email: req.params.email}).toArray()
      res.send(result)
   })

   // delete booking data
   app.delete('/deleteBooking/:id', async(req, res) => {
      const query = {_id: ObjectId(req.params.id)}
      const result = await orderCollection.deleteOne(query);
      res.send(result)
   })

   // update bookings status
   app.put('/bookings/:id', async (req, res) => {
      const filter = {_id: ObjectId(req.params.id) }
      const options = { upsert: true };
      const updateDoc = {
         $set: {
            status: "Approved"
         },
      };
      const result = await orderCollection.updateOne(filter, updateDoc, options);
      res.send(result)
   })

});


app.listen(port, () => console.log('listening at', port))