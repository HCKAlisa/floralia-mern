// @ts-ignore
import express from "express";
import mongoose from "mongoose";
// @ts-ignore
import dotenv from "dotenv";
const port = 5000;

dotenv.config();

const app = express();

mongoose.connect(process.env.MONGODB)
    .then(()=> {
        console.log("MongoDB Connected Successfully!");
    }).catch(err=>{
        console.log(err);
});

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})