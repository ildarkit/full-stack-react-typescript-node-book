import express from 'express';
import session from 'express-session';
import connectRedis from 'connect-redis';
import Redis from 'ioredis';
import dotenv from 'dotenv';
import {createConnection} from 'typeorm';
import bodyParser from 'body-parser';
import {register, login} from './repo/UserRepo';

dotenv.config();
console.log(process.env.NODE_ENV);

declare module "express-session" {
  interface SessionData {
    test: string;
    userID: string,
  }
}

const main = async () => {
  const app = express();
  const router = express.Router();

  await createConnection();

  const redis = new Redis({
    port: Number(process.env.REDIS_PORT),
    host: process.env.REDIS_HOST,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
  });

  const RedisStore = connectRedis(session);
  const store = new RedisStore({
    client: redis,
    prefix: "superforum:",
  });

  app.use(bodyParser.json())

  app.use(
    session({
      store,
      name: process.env.COOKIE_NAME,
      sameSite: "Strict",
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        path: "/",
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 24,
      },
    } as any)
  );
  
  app.use(router);

  router.get("/", (req, res, next) => {
    req.session!.test = "hello";
    res.send("hello");
  });

  router.post("/register", async (req, res, next) => {
    try {
      console.log("params", req.body);
      const userResult = await register(
        req.body.email,
        req.body.userName,
        req.body.password
      );
      if (userResult && userResult.user) {
        res.send(`new user created, userId: ${userResult.user.id}`);
      } else if (userResult && userResult.messages) {
        res.send(userResult.messages[0]);
      } else
        next();
    } catch (ex) {
      res.send(ex.message);
    }
  });

  router.post("/login", async (req, res, next) => {
    try {
      console.log("params", req.body);
      const userResult = await login(
        req.body.username,
        req.body.password,
      );
      if (userResult && userResult.user) {
        req.session!.userID = userResult.user!.id;
        res.send(`user logged in, userID: ${req.session!.userID}`);
      } else if (userResult && userResult.messages) {
        res.send(userResult.messages[0]);
      } else {
        next();
      }
    } catch (ex) {
      res.send(ex.message);
    }
  });

  app.listen({port: process.env.SERVER_PORT}, () => {
    console.log(`Server ready on port ${process.env.SERVER_PORT}`)
  });
};
main();

