const jwt = require('jsonwebtoken')

const jwtMiddleware = (req,res,next)=>{
    console.log("Inside jwtMiddleware");
    //logic to verify token
    const token = req.headers['authorization'].split(" ")[1]
    //console.log(token);
      if(token){
     try{
        const jwtResponse = jwt.verify(token,process.env.JWTSECRET)
        //console.log(jwtResponse); 
        req.payload = jwtResponse
        //console.log(req.payload);
        next()    
       }
    catch(error){
        res.status(401).json("Authorization failed  !! Invalid Token")
     }
    }
    else{
        res.status(401).json("Authorization failed  !! Missing Token") 
    }
    
}

module.exports = jwtMiddleware