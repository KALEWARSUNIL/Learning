import  express from 'express';
const router = express.Router();
import { register,refreshToken,logout,login,logoutall}  from '../controllers/auth.controller.js';


router.post("/register",register);
router.post("/refreshToken",refreshToken);
router.get("/logout",logout); 
 router.post("/login",login);
router.get("/logoutall",logoutall);
       

export default router