var express=require('express')
var jwt=require("jsonwebtoken")
var mongoClient=require('mongodb').MongoClient
var cors=require('cors')
var axios=require('axios')
var app=express()
app.use(cors())
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
    var id=parseInt(req.params.id)
    db.collection('emp').updateOne({"_id":id},{$set:{age:req.body.age}})
    res.end("updated")
})

app.delete('/deleteemp/:id',(req,res)=>{
    var id=(req.params.id)
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

app.get('/login.html',(req,res)=>{
    res.sendFile('login.html',{root:__dirname})
})
app.get('/index.html',(req,res)=>{
    res.sendFile('index.html',{root:__dirname})
})

app.post('/login',(req,res)=>{
    username=req.body.username
    pwd=req.body.password
    db.collection("users").findOne({"username":username,"pwd":pwd})
    .then((item)=>{
         if(item){
            const token=jwt.sign({"username":username},"cvrcollege");
            res.json({success:true,message:"authentication successful",token:token});
            res.end();
        }
        else{
            const token=jwt.sign({"username":username},"cvrcollege");
            res.json({success:false,message:"No username and password"});
            res.end()
        }
    })
    .catch((err)=>{
    console.log("error",err)
    })
})

function verifyToken(req,res,next){
    let token=req.headers['authorization']
    if(token){
        token=token.split(' ')[1]
        console.log(token)
        jwt.verify(token,"cvrcollege",(err,decoded)=>{
            if(err){
                return res.json({success:false,message:'Token not valid'});
            }
            else{
                next();
            }
        })
    }
    else{
        return res.json({success:false,message:"A token is required for Authorization"});
    }
}

app.listen(2000,()=>{
    console.log("Server started")
})

