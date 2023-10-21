"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = __importDefault(require("./routes/index"));
const connect_1 = require("./db/connect");
const wonder_1 = __importDefault(require("./routes/wonder"));
const user_1 = __importDefault(require("./routes/user"));
const creator_1 = __importDefault(require("./routes/creator"));
const uniqueId_1 = require("./functions/uniqueId");
const express_query_parser_1 = require("express-query-parser");
const me_1 = __importDefault(require("./routes/user/me"));
const middleware_1 = __importDefault(require("./errors/middleware"));
/*** basics ***/
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
/*** middlewares ***/
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_query_parser_1.queryParser)({
    parseNull: true,
    parseUndefined: true,
    parseBoolean: true,
    parseNumber: true,
}));
app.disable("etag");
/*** connect DB ***/
(0, connect_1.connectDB)()
    .then(() => {
    (0, uniqueId_1.initUniqueId)().catch(() => console.log("init unique id failed"));
})
    .catch(() => console.log("DB connection failed"));
/*** routes ***/
app.use("/", index_1.default);
app.use("/user", user_1.default);
app.use("/user/me", me_1.default);
app.use("/wonder", wonder_1.default);
app.use("/creator", creator_1.default);
/*** error handling ***/
app.use(middleware_1.default);
/*** open server ***/
app.listen(port, () => {
    1;
    console.log(`[server]: Server is running at http://localhost:${port !== null && port !== void 0 ? port : "invalid port"}`);
});
/*
import {
  Strategy as NaverStrategy,
  Profile as NaverProfile,
} from "passport-naver-v2";
import axios from "axios";
import { User } from "./model/user";
import errorMapperMiddleware from './middlewares/errorMapper';
*/
/*
passport.use(
  new NaverStrategy(
    {
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: "/login/callback",
    },
    (
      accessToken: string,
      refreshToken: string,
      profile: NaverProfile,
      done: any,
    ) => {
      console.log(accessToken);
      console.log(refreshToken);
      console.log(profile);
      console.log(done);
      done(null, profile);
    },
  ),
);

passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

app.use(passport.initialize());
*/
/*
app.post("/login/naver", async (req, res) => {
  const data = req.body as { code: string };
  try {
    const tokenResponse = await axios.get(
      "https://nid.naver.com/oauth2.0/token",
      {
        params: {
          grant_type: "authorization_code",
          client_id: process.env.NAVER_CLIENT_ID,
          client_secret: process.env.NAVER_CLIENT_SECRET,
          code: data.code,
          state: "naver",
        },
      },
    );
    const tokens = tokenResponse.data as {
      access_token: string;
      refresh_token: string;
    };
    const profileResponse = await axios.get(
      "https://openapi.naver.com/v1/nid/me",
      {
        headers: { Authorization: `bearer ${tokens.access_token}` },
      },
    );
    const { response: profile } = profileResponse.data as {
      response: { id: string; email: string };
    };

    const existingUser = await User.findOne({
      platformId: profile.id,
    });
    if (existingUser) {
      if (existingUser.name && existingUser.phoneNumber) {
        res.json({ user: existingUser, needRegister: false });
      } else {
        res.json({ user: existingUser, needRegister: true });
      }
    } else {
      const date = Date();
      const newUser = await User.create({
        platformType: "naver",
        platformId: profile.id,
        email: profile.email,
        created_at: date,
        last_modified_at: date,
      });
      await newUser.save();
      console.log("new user saved!");
      res.json({ user: newUser, needRegister: true });
    }

    //res.json(profileResponse.data);
  } catch (e) {
    res.json(e);
  }
});

app.post("/register", async (req, res) => {
  const { id, name, phoneNumber } = req.body as {
    id: string;
    name: string;
    phoneNumber: string;
  };
  console.log(id);
  await User.updateOne({ platformId: id }, { name, phoneNumber });
  const existingUser = await User.findOne({ platformId: id });
  console.log(existingUser);
  if (existingUser) {
    res.json(existingUser);
  }
});
*/
