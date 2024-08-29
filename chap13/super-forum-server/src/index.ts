import express from 'express';
import session from 'express-session';
import connectRedis from 'connect-redis';
import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();
console.log(process.env.NODE_ENV);

declare module "express-session" {
  interface SessionData {
    userid: string;
    loadedCount: number
  }
}

const app = express();
const router = express.Router();

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
  const session = req.session;
  if (!session.userid) {
    session.userid = JSON.stringify(req.query.userid);
    console.log("Userid is set");
    session.loadedCount = 0;
  } else {
    session.loadedCount = (session.loadedCount || 0) + 1;
  }

  res.send(
    `userid: ${req.session!.userid}, loadedCount: ${req.session!.loadedCount}`
  );
});

app.listen({port: process.env.SERVER_PORT}, () => {
  console.log(`Server ready on port ${process.env.SERVER_PORT}`)
});
