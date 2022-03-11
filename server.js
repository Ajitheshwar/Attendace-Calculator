const exp = require("express")
const app = exp()

require("dotenv").config()

//assign port
const port = process.env.PORT
app.listen(port,()=>{console.log(`App is listening on port no. : ${port}`)})

//middlewares
app.use(exp.json())
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs");
const expressAysncHandler = require("express-async-handler")
const path = require("path")
app.use(exp.static(path.join(__dirname,"dist/attendance-calculator")))

const mc = require("mongodb").MongoClient
const dburl = `mongodb+srv://${process.env.DBUsername}:${process.env.DBPassword}@cluster1.d7mdp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

let usersObj
mc.connect(dburl,{useNewUrlParser:true, useUnifiedTopology:true})
.then( client=>{
    
    //get db
    dbObj=client.db("attendance-calculator")

    //get collection object 
    usersObj=dbObj.collection("users")

    app.set("usersObj",usersObj)

    console.log("Connected with Database Succesfully")
})
.catch(err=>{console.log("error in connecting to database : ",err)})



app.post('/login',expressAysncHandler(async(req,res,next)=>{
    
    let obj = req.body;
    if(!obj.newUser)
    {
        let userOfDB = await usersObj.findOne({username : obj.username})
        if(userOfDB!=null){

            let result = await bcrypt.compare(obj.password,userOfDB.password)

            if(!result){
                res.send({message : "Password is incorrect !!!"})
            }
            else{
                let signedtoken = await jwt.sign({username : obj.username},process.env.SecretKey)
                
                res.send({message : "Logged In Successfully",id :userOfDB._id,token : signedtoken})
            }
        }
        else{
            res.send({message : "Username doen't exists!!!"})
        }
    }
    else{
        let userOfDB = await usersObj.findOne({username : obj.username})
        if(userOfDB!=null){
            res.send({message : `User with Username ${obj.username} already exists!!!`})
        }
        else{
            let hashedPwd = await bcrypt.hash(obj.password,6)

            obj1 = {username : obj.username, password : hashedPwd, subjects : [],timetable : [],history : [],marks : [], semester : []}
            usersObj.insertOne(obj1)
            res.send({message : "User created successfully!!!"})
        }
    }
}))

const userApiRoute = require('./apis/userAPI')
app.use("/user",userApiRoute)