import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import session from "cookie-session";
import { config } from "./config/app.config";
import connectDatabase from "./config/database.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import multer from "multer";

import "./config/passport.config";
import passport from "passport";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import isAuthenticated from "./middlewares/isAuthenticated.middleware";
import workspaceRoutes from "./routes/workspace.route";
import memberRoutes from "./routes/member.route";
import projectRoutes from "./routes/project.route";
import taskRoutes from "./routes/task.route";
import farmerRoutes from "./routes/farmer.route";
import { uploadDocument } from "./uploadthing";
import { deleteDocument, getDocuments } from "./controllers/document.controller";

const app = express();
const BASE_PATH = config.BASE_PATH;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: "session",
    keys: [config.SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 1000,
    secure: config.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: config.FRONTEND_ORIGIN,
    credentials: true,
  })
);

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/user`, isAuthenticated, userRoutes);
app.use(`${BASE_PATH}/workspace`, isAuthenticated, workspaceRoutes);
app.use(`${BASE_PATH}/member`, isAuthenticated, memberRoutes);
app.use(`${BASE_PATH}/project`, isAuthenticated, projectRoutes);
app.use(`${BASE_PATH}/task`, isAuthenticated, taskRoutes);
app.use(`${BASE_PATH}/farmer`, isAuthenticated, farmerRoutes);
const upload = multer({ storage: multer.memoryStorage() });
app.use(`${BASE_PATH}/upload`, upload.single("file"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    await uploadDocument(req, res, next);
  } catch (error) {
    next(error);
  }
});
app.post(
  `${BASE_PATH}/documents`,
  async (req, res, next) => {
    try {
      await getDocuments(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

app.delete(
  `${BASE_PATH}/delete-file`,
  async (req, res, next) => {
    try {
      await deleteDocument(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);
app.use(errorHandler);

app.get("/",(request,response)=>{
  ///server to client
  response.json({
      message : "Server is running " + config.PORT
  })
})
connectDatabase().then(()=>{
  app.listen(config.PORT,()=>{
      console.log("Server is live",config.PORT)
  })
})

