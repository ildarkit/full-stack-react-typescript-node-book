import express from 'express';
import session from 'express-session';
import connectRedis from 'connect-redis';
import Redis from 'ioredis';
import dotenv from 'dotenv';
import {createConnection} from 'typeorm';
import {ApolloServer} from '@apollo/server';
import {expressMiddleware} from '@apollo/server/express4';
import {ApolloServerPluginDrainHttpServer} from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import cors from 'cors';
import typeDefs from './gql/typeDefs';
import resolvers from './gql/resolvers';
import {register, login, logout} from './repo/UserRepo';
import {createThread, getThreadsByCategoryId, getThreadById} from './repo/ThreadRepo';
import {createThreadItem, getThreadItemsByThreadId} from './repo/ThreadItemRepo';
import 'reflect-metadata';

dotenv.config();

declare module "express-session" {
  interface SessionData {
    test: string;
    userID: string | undefined | null,
  }
}

const main = async () => {
  const app = express();
  const httpServer = http.createServer(app);
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({httpServer})],
  });

  await apolloServer.start();

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

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
    express.urlencoded({extended: true}), 
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
    } as any),
    expressMiddleware(apolloServer, {
      context: async ({req, res, pubsub}: any) => ({req, res, pubsub}),
    }),
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

  router.post("/logout", async (req, res, next) => {
    try {
      console.log("params", req.body);
      const msg = await logout(req.body.userName);
      if (msg) {
        req.session!.userID = null;
        res.send(msg);
      } else {
        next();
      }
    } catch (ex) {
      console.log(ex);
      res.send(ex.message);
    }
  });

  router.post("/createthread", async (req, res, next) => {
    try {
      console.log("userId", req.session!.userID);
      console.log("body", req.body);
      const msg = await createThread(
        req.session!.userID,
        req.body.categoryId,
        req.body.title,
        req.body.body,
      );
      res.send(msg);
    } catch (ex) {
      console.log(ex);
      res.send(ex.message);
    }
  });

  router.post("/threadsbycategory", async (req, res, next) => {
    try {
      const threadResult = await getThreadsByCategoryId(req.body.categoryId);
      if (threadResult && threadResult.entities) {
        let items = "";
        threadResult.entities.forEach((th) => {
          items += th.title + ", ";
        });
        res.send(items);
      } else if (threadResult && threadResult.messages) {
        res.send(threadResult.messages[0]);
      }
    } catch (ex) {
      console.log(ex);
      res.send(ex.message);
    }
  });

  router.post("/thread", async (req, res, next) => {
    try {
      const threadResult = await getThreadById(req.body.threadId);
      if (threadResult && threadResult.entity) { 
        res.send(threadResult.entity.title);
      } else if (threadResult && threadResult.messages) {
        res.send(threadResult.messages[0]);
      }
    } catch (ex) {
      console.log(ex);
      res.send(ex.message);
    }
  });
  
  router.post("/createthreaditem", async(req, res, next) => {
    try {
      const msg = await createThreadItem(
        req.session!.userID,
        req.body.threadId,
        req.body.body
      );
      res.send(msg);
    } catch (ex) {
      console.log(ex);
      res.send(ex.message);
    }
  });

  router.post("/threaditemsbythread", async (req, res, next) => {
    try {
      const threadItemResult = await getThreadItemsByThreadId(
        req.body.threadId
      );
      if (threadItemResult && threadItemResult.entities) {
        let items = "";
        threadItemResult.entities.forEach((ti) => {
          items += ti.body + ", ";
        });
        res.send(items);
      } else if (threadItemResult && threadItemResult.messages)
        res.send(threadItemResult.messages[0]);
    } catch (ex) {
      console.log(ex);
      res.send(ex.message);
    }
  });

  await new Promise<void>(
    resolve => httpServer.listen({port: process.env.SERVER_PORT}, resolve)
  );
  console.log(`Server ready on port ${process.env.SERVER_PORT}`);
};
main();

