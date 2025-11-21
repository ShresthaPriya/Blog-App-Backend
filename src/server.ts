import express from 'express';
import "dotenv/config";

import "./config/dBConfig.js";
import routes from './routes/index.js';


const PORT = process.env.PORT || 3000;

//middleware
const app = express();
app.use(express.json());

app.use("/api/v1", routes);
app.use("/uploads", express.static("uploads"));

// http:localhost:4000/blog
app.listen(PORT, ()=>{
    console.log(` Server running on http:localhost:${PORT}`);
})



