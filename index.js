const express= require("express");
const app=express();
// schema used when  creating documents
const book= require("./model/book");
const mongoose=require("mongoose");
const { db } = require( "./model/book" );
const { ObjectId } = require( "mongodb" );
const User=require('./model/user');
const dotenv=require('dotenv');
dotenv.config({path: './config.env'});
const Database=process.env.DaTABASE;
const Port=process.env.PORT;
app.use(require('./router/auth'));
// console.log(db);
// console.log(book);

app.use(express.json());    

// book.create({
//     "title": "hume",
//     "author": "Frank Herbert",
//     "pages": 500,
//     "genres": [
//         "sci-fi",
//         "dystopian"
//     ],
//     "rating": 10
// })

app.get("/",(req,res)=>{
    res.send("Welcome to home page");
})


app.get("/books",async (req,res)=>{
    //  pagination
    const page=req.query.pno;
    const booksPerPage=3;
    let books=[];
    await db.collection('books').find().sort({author: 1})
    .skip(page*booksPerPage)
    .limit(booksPerPage)
    .forEach(book=>books.push(book))
    .then(()=>{
        res.status(200).json(books)
    })
    .catch(()=>{
        res.status(500).json({error: "Could not fetch the documents"})
    })
})


app.get('/books/:id',(req,res)=>{
    if(ObjectId.isValid(req.params.id)){
    db.collection('books').findOne({_id: ObjectId(req.params.id)})
    .then(doc=>{
        res.status(200).json(doc);
    })
    .catch(err =>{
        res.status(500).json({error: "Could not fetch the document"});
    })
   }
   else{
     res.status(500).json({error: "Invalid doc id"});
   }
})


app.post('/books',(req,res)=>{
    const book = req.body;
    db.collection('books').insertOne(book).then(result=>{
        res.status(201).json(result);
    })
    .catch(err=>{
        res.status(500).json({ err: 'Could not create a new document'});
    })
})


app.delete('/books/:id',(req,res)=>{
    if(ObjectId.isValid(req.params.id)){
    db.collection('books').deleteOne({_id: ObjectId(req.params.id)})
    .then(result=>{
        res.status(200).json(result);
    })
    .catch(err =>{
        res.status(500).json({error: "Could not delete the document"});
    })
   }
   else{
     res.status(500).json({error: "Invalid doc id"});
   }
})


app.patch('/books/:id',(req,res)=>{
    const updates=req.body;
    if(ObjectId.isValid(req.params.id)){
    db.collection('books').updateOne({_id: ObjectId(req.params.id)},{$set: updates})
    .then(result=>{
        res.status(200).json(result);
    })
    .catch(err =>{
        res.status(500).json({error: "Could not update the document"});
    })
   }
   else{
     res.status(500).json({error: "Invalid doc id"});
   }
})


mongoose.connect(Database,()=>{
    console.log("db connected");
    app.listen(Port,()=>{
        console.log(`Listening at port no. ${Port}`);
    });
})
