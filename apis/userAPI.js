const exp = require("express")
const userAPIRoute = exp.Router()

userAPIRoute.use(exp.json())
const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")
const { ObjectId } = require("mongodb")


const verifyToken=(req,res,next)=>{

    //get token from header of request object
    let tokenwithBearer=req.header("Authorization")
    //console.log(tokenwithBearer)

    //If token doesn't exists
    if(tokenwithBearer==undefined){
        return res.send({message : "Login to Continue!!!"})
    }

    //if token exists
    if(tokenwithBearer.startsWith('Bearer ')){

        let token=tokenwithBearer.slice(7,tokenwithBearer.length);

        //verify the token (validation of token before expire)
        jwt.verify(token,process.env.SecretKey,(err,decoded)=>{
            if(err){
                return res.send({message : "Login to Continue!!!"})
            }
            else{
                next()
            }
        })
    }    
}

userAPIRoute.use(verifyToken)

userAPIRoute.put("/:uid/profile",asyncHandler(async ( req,res,next)=>{
    let id = req.params.uid

    let usersObj = req.app.get("usersObj")
    let dataOfDB = await usersObj.findOne({_id : ObjectId(id)})
    let obj = req.body

    if(obj.edit)
    {
        if(obj.data.name=="")
        {
            obj.data.name = dataOfDB.userDetails.name
        }
        if(obj.data.college=="")
        {
            obj.data.college = dataOfDB.userDetails.college
        }
        if(obj.data.bio  == "")
        {
            obj.data.bio = dataOfDB.userDetails.bio
        }
        if(obj.data.rollno=="")
        {
            obj.data.rollno = dataOfDB.userDetails.rollno
        }
        await usersObj.updateOne({_id : ObjectId(id)},{$set : {userDetails : obj.data}})
        res.send({message : "Details Succesfully updated",data : obj.data})
    }
    else
    {
        if(obj.isLink)
        {
            if(obj.delete)
            {
                dataOfDB.links.splice(obj.index,1)
                await usersObj.updateOne({_id : ObjectId(id)},{$set : {links : dataOfDB.links}})
                res.send({message : "Link Deleted Successfully",data : dataOfDB.links})
            }
            else
            {
                let obj1 = {name : obj.data.name, url : obj.data.URL}
                dataOfDB.links.push(obj1)
                await usersObj.updateOne({_id : ObjectId(id)},{$set : {links : dataOfDB.links}})
                res.send({message : "Link added successfully", data : dataOfDB.links})
            }
        }
        else
        {
            if(obj.delete)
            {
                dataOfDB.notes.splice(obj.index,1)
                await usersObj.updateOne({_id : ObjectId(id)},{$set : {notes : dataOfDB.notes}})
                res.send({message : "Note Deleted Successfully",data : dataOfDB.notes})
            }
            else
            {
                dataOfDB.notes.push(obj.data.note)
                await usersObj.updateOne({_id : ObjectId(id)},{$set : {notes : dataOfDB.notes}})
                res.send({message : "Note added successfully", data : dataOfDB.notes})
            }
        }
    }
}))
userAPIRoute.get("/:uid",asyncHandler(async(req,res,next)=>{

    let usersObj = req.app.get("usersObj")

    let id = (req.params.uid)
    //console.log(id)

    let userObjOfDB = await usersObj.findOne({_id : ObjectId(id)})
    res.send({message : userObjOfDB})
    
}))


userAPIRoute.put("/:uid/attendance/timetable/addTimeTable",asyncHandler(async(req,res,next)=>{
    let usersObj = req.app.get("usersObj")
    let uid = (req.params.uid)
    let obj = req.body
    //console.log("timetable  "+uid)

    await usersObj.updateOne({_id : ObjectId(uid)},{$set : {timetable : obj.timetable, subjects : obj.subjects}})

    res.send({message : "Time Table Succesfully Updated"})
}))

userAPIRoute.put("/:uid/attendance/postAttendance",asyncHandler(async(req,res,next)=>{
    let usersObj = req.app.get("usersObj")
    let uid = (req.params.uid)
    let obj = req.body

    let attendance = await usersObj.findOne({_id : ObjectId(uid)},{_id : 0, subjects : 1, history : 1})
    //console.log(attendance)

    for(let x of attendance.subjects)
    {
        for(let y of obj.attendance)
        {
            if(x.subject==y.subject)
            {
                y.subjectAttended=x.attended
                y.subjectTotal = x.total
                x.attended += y.attended
                x.total += y.total
                if(x.attended<0)
                    x.attended=0
                if(x.total<0)
                    x.total = 0
                break;
            }
        }
    }
    let obj1 = {date : obj.date, attendance : obj.attendance}
    attendance.history.push(obj1)
    //console.log(attendance)
    await usersObj.updateOne({_id : ObjectId(uid)},{$set : {subjects : attendance.subjects, history : attendance.history}})

    res.send({message : "Attendace Posted Successfully", data : attendance})
}))

userAPIRoute.put("/:uid/marks",asyncHandler(async(req,res,next)=>{
    uid = (req.params.uid)
    obj = req.body
    usersObj = req.app.get("usersObj")
    //console.log(obj)

    marks = await usersObj.findOne({_id : ObjectId(uid)},{_id : 0, semester : 1, marks : 1})
    if(obj.varSemester)
    {
        //console.log(marks.semester)
        marks.semester.splice(obj.index,1)
        //console.log(marks.semester)
        await usersObj.updateOne({_id : ObjectId(uid)},{$set : {semester : marks.semester}})
        res.send({message : "Semester Marks Deleted Successfully", data : marks.semester,varSemester : obj.varSemester})
    }
    else
    {
        marks.marks.splice(obj.index,1)
        await usersObj.updateOne({_id : ObjectId(uid)},{$set : {marks : marks.marks}})
        res.send({message : "Marks Deleted Successfully", data : marks.marks,varSemester : obj.varSemester})
    }
}))

userAPIRoute.put("/:uid/marks/addMarks",asyncHandler(async(req,res,next)=>{
    let usersObj = req.app.get("usersObj")
    let uid = (req.params.uid)
    let obj = req.body
    
    let dataOfDB = await usersObj.findOne({_id : ObjectId(uid)})
    //console.log(dataOfDB)

    if(!obj.semester)
    {   
        //console.log(dataOfDB.marks)
        let obj1 = {title : obj.title, marks : obj.marks}

        dataOfDB.marks.push(obj1)
        await usersObj.updateOne({_id : ObjectId(uid)},{$set : {marks : dataOfDB.marks}})

        res.send({message : "Marks updated succesfully",data : dataOfDB.marks, var : obj.semester})
    }
    else
    {
        //console.log(dataOfDB.semester)
        let obj1 = {title : obj.title, marks : obj.marks, SGPA : obj.SGPA}

        dataOfDB.semester.push(obj1)
        await usersObj.updateOne({_id : ObjectId(uid)},{$set : {semester : dataOfDB.semester}})

        res.send({message : "Marks updated succesfully",data : dataOfDB.semester,var : obj.semester})
    }
}))


userAPIRoute.put("/:uid/attendance/history",asyncHandler(async(req,res,next)=>{
    let uid = (req.params.uid)
    let usersObj = req.app.get("usersObj")

    await usersObj.updateOne({_id : ObjectId(uid)},{$set : {history : []}})
    res.send({message : "History cleared successfully!!!"})
}))

module.exports = userAPIRoute