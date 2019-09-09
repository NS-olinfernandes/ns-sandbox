import sirv from "sirv";
import morgan from "morgan";
import express from "express";
// import expresSSL from 'express-enforces-ssl';
import helmet from "helmet";
import compression from "compression";
import * as sapper from "@sapper/server";

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === "development";
express()
  .use(
    morgan("dev"),
    helmet(),
    compression({ threshold: 0 }),
    sirv("static", { dev }),
    express.json(),
    sapper.middleware()
  )
  .listen(PORT, err => {
    if (err) console.log("error", err);
  });
// const credentials = {
//   key: fs.readFileSync('./key.pem'),
//   cert: fs.readFileSync('./cert.pem'),
//   passphrase: 'ninestack'
// }
// https.createServer(credentials,
//   express()
//     .use(
//       morgan("dev"),
//       helmet(),
//       expresSSL(),
//       compression({ threshold: 0 }),
//       sirv("static", { dev }),
//       express.json(),
//       sapper.middleware()
//     )
// )
//   .listen(PORT, err => {
//     if (err) console.log("error", err);
//   });
