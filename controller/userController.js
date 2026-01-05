const users = require('../models/userModel')
const jwt = require('jsonwebtoken')

//register request
exports.registerController = async(req,res)=>{
    console.log("Inside registerController");
    console.log(req.body);
    const {username,email,password} = req.body 
    try{
        const existingUser = await users.findOne({email})
        if(existingUser){
            res.status(409).json("User Already exists !! Please Login")
        }
        else{
            const newUser = new users({
                username,
                email,
                password,
            })
            await newUser.save()
            res.status(200).json(newUser)
        }
    }
    catch(error){
        console.log(error);
        res.status(500).json(error)
        
    }
    //res.status(200).json("Request Received")
}

//login request
exports.loginController = async(req,res)=>{
    console.log("Inside loginController");
    console.log(req.body);
    const {email,password} = req.body 
    try{
        const existingUser = await users.findOne({email})
        if(existingUser){
            if(password == existingUser.password){
                //create token
                const token = jwt.sign({usermail:existingUser.email,role:existingUser.role},process.env.JWTSECRET)
                res.status(200).json({user:existingUser,token})
            }
            else{
                res.status(401).json("Incorrect email/password")
            }
        }
        else{
            res.status(404).json("Account Does not Exist..")
        }
    }
    catch(error){
        console.log(error);
        res.status(500).json(error)           
      }
}
