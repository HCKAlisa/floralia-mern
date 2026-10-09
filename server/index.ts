import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
const port = process.env.PORT || 8080;
import path from "path";
import cookieParser from 'cookie-parser';

import type { ConnectOptions } from "mongoose";
import type { Request, Response, NextFunction } from "express";

import userRoutes from "./src/routes/user.routes.ts";
import authRoutes from "./src/routes/auth.routes.ts";
import gameRoutes from "./src/routes/game.routes.ts";
import { createLocalizationRouter } from "./src/routes/localization.routes.ts";
import { createBugReportRouter } from "./src/routes/bug-report.routes.ts";

dotenv.config();

const app = express();

app.use(cookieParser());
app.use("/api/bug-reports", createBugReportRouter());
app.use(express.json());

const uri = process.env.MONGODB || 'default-connection-string';


mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as ConnectOptions)
    .then(()=> {
        console.log("MongoDB Connected Successfully!");

        app.listen(port, () => {
            console.log(`App listening on port ${port}`)
        })

    }).catch((err: any)=>{
    console.log(err);
});

const __dirname = path.resolve();
const __parentDir = path.resolve(__dirname, '..');
//console.log(__parentDir)


// app.get('/', (_req: Request, res: Response) => {
//     res.send('Hello World!')
// })

app.use("/api/user", (userRoutes));
app.use("/api/auth", (authRoutes));
app.use("/api/game", (gameRoutes));

app.use('/localization', createLocalizationRouter({
    firebaseProjectId: process.env.FIREBASE_PROJECT_ID || 'mern-web-a3109',
    jwtSecret: process.env.JWT_SECRET,
    allowedEmails: () => process.env.LOCALIZATION_ALLOWED_EMAILS,
    clientDirectory: path.join(__parentDir, 'client', 'dist'),
    webglDirectory: process.env.LOCALIZATION_WEBGL_DIR,
}));

app.use(express.static(path.join(__parentDir, '/client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__parentDir, 'client', 'dist', 'index.html'));
});

//error middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});
