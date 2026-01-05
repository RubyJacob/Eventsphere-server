const jwt = require('jsonwebtoken')

const adminMiddleware = (req,res,next)=>{
    console.log("Inside adminMiddleware"); 
    //logic to verify token
    //get token - req header
    //console.log("Headers:", req.headers);
    const token = req.headers['authorization'].split(" ")[1]
    console.log(token);
    //verify token
    if(token){
     try{
        const jwtResponse = jwt.verify(token,process.env.JWTSECRET)
        console.log(jwtResponse); 
        req.payload = jwtResponse.usermail
        req.role = jwtResponse.role
        if(jwtResponse.role == "admin"){
            next()    
        }
        else{
            res.status(401).json("Authorization failed !! Invalid User")
        }        
       }
    catch(error){
        res.status(401).json("Authorization failed  !! Invalid Token")
     }
    }
    else{
        res.status(401).json("Authorization failed  !! Missing Token") 
    }

}

module.exports = adminMiddleware