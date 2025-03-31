const jwt=require('jsonwebtoken');
const secret='abhi-dhoni07';
const signToken=(id)=>{
    const payload={id:id};
    const option={expiresIn:"150d"};
    return jwt.sign(payload,secret,option);
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) {
      return res.sendStatus(401);
    }
  
    const result = verifyAccessToken(token);
  
    if (!result.success) {
      return res.status(403).json({ error: result.error });
    }
  
    req.user = result.data;
    next();
  }

const verifyAccessToken=(token)=>{
    try{
        const decoded=jwt.verify(token,secret);
        return{success:true,data:decoded};
    }catch(error){
        return {success:false,error:error.message};
    }
}

module.exports={
    signToken,
    verifyAccessToken,
    authenticateToken,
    
}