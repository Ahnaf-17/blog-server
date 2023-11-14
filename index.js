const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors())
app.use(express.json())


// console.log(process.env.DB_PASS)


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fz8oxax.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();

    const blogCollection = client.db('blogDB').collection('blogInfo');
    const wishlistCollection = client.db('blogDB').collection('wishlist');
    const commentCollection = client.db('blogDB').collection('comment'); 

    // blog 
    app.get('/blogs', async(req,res)=>{
        const cursor = blogCollection.find();
        const result = await cursor.toArray()
        res.send(result)
    })


    app.post('/blogs',async(req,res)=>{
        const newBlog = req.body;
        console.log(newBlog)
        const result = await blogCollection.insertOne(newBlog);
        res.send(result)
    })

    // update blog 
    app.get('/blogs/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await blogCollection.findOne(query)
        res.send(result)
    })



    app.put('/blogs/:id',async(req,res)=>{
        const updatedBlog = req.body;
        console.log(updatedBlog);
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)}
        const options = {upsert: true}
        const updateBlog = req.body;
        const blog = {
            $set: {
                title : updateBlog.title,
                category : updateBlog.category,
                image : updateBlog.image,
                short_description : updateBlog.short_description,
                long_description : updateBlog.long_description,
                datetime : updateBlog.datetime
            }
            
        }
        const result = await blogCollection.updateOne(filter,blog,options)
        res.send(result)
    })

    // wishlist 

    app.post('/wishlist', async(req,res)=>{
        const wishlistBlog = req.body;
        const result = await wishlistCollection.insertOne(wishlistBlog);
        res.send(result)
    })

    app.get('/wishlist/:email',async(req,res)=>{
        const email = req.params.email;
        const query = {'user.email':email};
        const cursor = wishlistCollection.find(query);
        const result = await cursor.toArray();
        res.send(result)
    })

    app.delete('/wishlist/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await wishlistCollection.deleteOne(query)
        res.send(result)
    })

    // comment 
    app.post('/comment', async(req,res)=>{
        // const comment = req.body;
        console.log(comment)
        const result = await commentCollection.insertOne(comment);
        res.send(result)

    })
    app.get('/comment', async(req,res)=>{
        const cursor = commentCollection.find();
        const result = await cursor.toArray()
        res.send(result)
    })


    // app.get('/comment/:id',async(req,res)=>{
    //     const id = req.params.id;
    //     const query = {'user.id':id};
    //     const cursor = commentCollection.find(query);
    //     const result = await cursor.toArray();
    //     console.log('result :',result)
    //     res.send(result)
    // })



    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/',(req,res)=>{
    res.send('Blog server running')
})
app.listen(port, ()=>{
    console.log(`server is running on port :${port}`)
})