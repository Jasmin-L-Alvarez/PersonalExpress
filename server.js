const express = require('express')// import express 
const app = express()// initalise app with express 
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient


var db, collection;

//mongo url is different and delete password for that demo cluster 

const url="mongodb+srv://savage:123@cluster0.gfz1v.mongodb.net/demo?retryWrites=true&w=majority"
const dbName = "movieDb"; 

// start the server on port 4040
app.listen(4040, () => {
  // connecting to mongo DB
    MongoClient.connect(url, 
      { useNewUrlParser: true, 
        useUnifiedTopology: true }, 
      (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  //console.log(db)
  db.collection('movie').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {movie: result})
  })
})

app.post('/movie', (req, res) => {
  db.collection('movie').save({name: req.body.name, heart: 0,}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/movie', (req, res) => {
  db.collection('movie')
  .findOneAndUpdate({name: req.body.name}, {
    //https://docs.mongodb.com/manual/reference/operator/update/inc/
    $inc: {
      heart:req.body.heart + 1
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/movie', (req, res) => {
  db.collection('movie').findOneAndDelete({name: req.body.name}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('movie deleted!')
  })
})