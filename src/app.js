import express from 'express';
import authRoute from './routes/auth.route.js';
import dotenv from "dotenv";
import cookieparser from "cookie-parser"
dotenv.config();
 const app=express();

 app.use(express.json());
  app.use(cookieparser());
 app.use("/auth",authRoute)


 export default app;