const express= require("express");
const app=express();
const book= require("./model/book");
const mongoose=require("mongoose");
const { db } = require( "./model/book" );
const { ObjectId } = require( "mongodb" );


app.use(express.json());


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


mongoose.connect("mongodb://localhost:27017",()=>{
    console.log("db connected");
    app.listen(5000,()=>{
        console.log("Listening at port no. 5000");
    });
})
