import  express from 'express';
const router = express.Router();
import { register,refreshToken,logout}  from '../controllers/auth.controller.js';


router.post("/register",register);
router.post("/refreshToken",refreshToken);
router.get("/logout",logout); 

       

export default router