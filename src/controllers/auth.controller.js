import userModel from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sessionModel from '../models/session.model.js';
import crypto from 'crypto';



async function register(req,res)
 {
     const {username ,email,password}=req.body;

     const hashedpassword =await bcrypt.hash(password,10);
    const user=await userModel.create({
        username:username,
        email:email,
        password:hashedpassword
        
     })

const refreshtoken =jwt.sign({
    id:user._id
},process.env.jwt_secret,{
    expiresIn:'7d'
}   )



const refreshTokenHash = crypto.createHash('sha256').update(refreshtoken).digest('hex');
const session=await sessionModel.create({
    userId:user._id,
    refreshToken:refreshTokenHash,
    ip:req.ip,
    userAgent:req.get('User-Agent'),
    
})

const acesstoken =jwt.sign({
    id:user._id
},process.env.jwt_secret,{
    expiresIn:'1h'
}   )



 res.cookie('refreshtoken',refreshtoken,
    {
        httpOnly:true, 
        secure:false,
        sameSite:'strict',
        maxAge:7*24*60*60*1000      

    }
 )

     res.status(201).json({
        user:{
            username:user.username,
            email:user.email
        },
        token: acesstoken
     }
     )
    

 }
async function refreshToken(req,res)
 {
 const token=req.cookies.refreshtoken;
 if(!token  )
 {
     return res.status(401).json({message:'Unauthorized'});
 }
 const decode =jwt.verify(token,process.env.jwt_secret)

if(!decode )
 {
     return res.status(401).json({message:'Unauthorized'});
 }

 const hashedrefreshToken = crypto.createHash('sha256').update(token).digest('hex');
 const session =await sessionModel.findOne({
    refreshToken:hashedrefreshToken,
    revoked:false
 })
 if(!session)
 {
     return res.status(401).json({message:'Unauthorized'});
 }      

const acesstoken =jwt.sign(
    {
        id:decode.id
    },
    process.env.jwt_secret,
    {
        expiresIn:"1h"
    }

)
res.status(200).json({
    message:"acess. token created successfully",
    acesstoken:acesstoken
})
 }

 async function logout(req,res)
 {
    const token =req.cookies.refreshtoken;
    if(!token)
    {
        return res.status(401).json({message:'Unauthorized'});
    }
if(!token){
        return res.status(401).json({
            message:"unauthorized user"
        })
     }
const refreshTokenHash = crypto.createHash('sha256').update(token).digest('hex');

const session =await sessionModel.findOne({
    refreshToken: refreshTokenHash,
    revoked:false

})
if(!session){
        return res.status(400).json({
            message:"not valid refresh token"
        })
     }

session.revoked=true;
await session.save();
res.clearCookie('refreshtoken')


res.status(200).json({
    message:"logout sucessfully"
})
 }



 
    
 export  {register,refreshToken,logout};
