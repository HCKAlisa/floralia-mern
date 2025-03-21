import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
const port = 8080;
import path from "path";

import type { Request, Response, NextFunction } from "express";

import userRoutes from "./src/routes/user.routes.ts";
import authRoutes from "./src/routes/auth.route.ts";

dotenv.config();

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGODB!)
    .then(()=> {
        console.log("MongoDB Connected Successfully!");

        app.listen(port, () => {
            console.log(`App listening on port ${port}`)
        })

    }).catch((err: any)=>{
    console.log(err);
});

const __dirname = path.resolve();


app.get('/', (_req: Request, res: Response) => {
    res.send('Hello World!')
})

app.use("/api/user", (userRoutes));
app.use("/api/auth", (authRoutes));

app.use(express.static(path.join(__dirname, '/client/dist')));
app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})

//error middleware
app.use((err: any, req: Request, res: Response, next: NextFunction)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});
