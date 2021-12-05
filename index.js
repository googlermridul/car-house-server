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
   res.send('CarHouse Serverless!')
})

client.connect(err => {
   const carsCollection = client.db("carHouse").collection("cars");
   const orderCollection = client.db("carHouse").collection("orders");
   const reviewCollection = client.db("carHouse").collection("reviews");
   
   // add a single car by admin
   app.post('/addCar', async(req, res) => {
      const result = await carsCollection.insertOne(req.body);
      res.send(result)
   })

   // load all cars showed in home page
   app.get('/cars', async(req, res) => {
      const result = await carsCollection.find({}).toArray()
      res.send(result)
   })

   // delete package
   app.delete('/deleteCar/:id', async(req, res) => {
      const query = {_id: ObjectId(req.params.id)}
      const result = await carsCollection.deleteOne(query);
      res.send(result)
   })

   // add bookings
   app.post('/addOrder', async(req, res) => {
      const result = await orderCollection.insertOne(req.body);
      res.send(result)
   })

   // load all bookings data
   app.get('/orders', async(req, res) => {
      const result = await orderCollection.find({}).toArray()
      res.send(result)
   })

   // load a specific booking data
   app.get('/orders/:email', async(req, res) => {
      const result = await orderCollection.find({email: req.params.email}).toArray()
      res.send(result)
   })

   // delete booking data
   app.delete('/deleteOrder/:id', async(req, res) => {
      const query = {_id: ObjectId(req.params.id)}
      const result = await orderCollection.deleteOne(query);
      res.send(result)
   })

   // update bookings status
   app.put('/orders/:id', async (req, res) => {
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


   // add review
   app.post('/addReview', async(req, res) => {
      const result = await reviewCollection.insertOne(req.body);
      res.send(result)
   })

   // load all bookings data
   app.get('/reviews', async(req, res) => {
      const result = await reviewCollection.find({}).toArray()
      res.send(result)
   })

});


app.listen(port, () => console.log('listening at', port))