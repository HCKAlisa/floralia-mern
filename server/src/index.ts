import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
const port = 5000;

import type { Request, Response } from "express";

import userRoutes from "./routes/user.routes.ts";
import authRoutes from "./routes/auth.route.ts";

dotenv.config();

const app = express();

app.use(express.json());

if (process.env.MONGODB !== undefined) {
    mongoose.connect(process.env.MONGODB)
        .then(()=> {
            console.log("MongoDB Connected Successfully!");

            app.listen(port, () => {
                console.log(`App listening on port ${port}`)
            })

        }).catch((err: any)=>{
        console.log(err);
    });
}



app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})

app.use("/api/user", (userRoutes));
app.use("/api/auth", (authRoutes));

