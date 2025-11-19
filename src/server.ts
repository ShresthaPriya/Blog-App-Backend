import express from 'express';
// import dotenv from "dotenv/config";

import "./config/dBConfig.js";
import blogRoutes from './routes/blogRoutes.js'

import userRoute from './routes/userRoute.js'


const PORT = process.env.PORT || 3000;

//middlewarew


const app = express();
app.use(express.json());

app.use("/blog", blogRoutes);
app.use("/user", userRoute);

app.use("/uploads", express.static("uploads"));

// http:localhost:4000/blog
app.listen(PORT, ()=>{
    console.log(` Server running on http:localhost:${PORT}`);
})



