var express=require('express')
const req = require('express/lib/request')
const { sendFile } = require('express/lib/response')

var mongoClient=require('mongodb').MongoClient

var app=express()


app.use(express.json())
mongoClient.connect("mongodb://localhost:27017",(err,client)=>{
    if(err){
        console.log(err)
    }
    else{
        db=client.db('empdb')
    }
})


app.get('/emps',(req,res)=>{
    db.collection('emp').find().toArray((err,items)=>{
        res.write(JSON.stringify(items))
        res.end()
    })
})

app.post('/addemp',(req,res)=>{
    db.collection('emp').insertOne(req.body)
    res.end("Inserted")
})

app.put('/updateemp/:id',(req,res)=>{
    var id=req.params.id
    db.collection('emp').updateOne({"_id":id},{$set:{age:req.body.age}})
    res.end("updated")
})

app.delete('/deleteemp/:id',(req,res)=>{
    var id=req.params.id
    db.collection('emp').deleteOne({"_id":id})
    res.send("Deleted")
})
app.get('/emp/:id',(req,res)=>{
    
    var id=parseInt(req.params.id)
    console.log(id)    
db.collection('emp').find({"_id":id}).toArray((err,items)=>{
    res.json(items)
    res.end()
})
})

app.get('/main.html',(req,res)=>{
    res.sendFile('main.html',{root:__dirname})
})
app.listen(2000,()=>{
    console.log("Server started")
})

