import express from 'express';
import morgan from 'morgan';
import {config} from '../config.js';

let server;

const app = express()
  // Log requests to make debugging easier.
  .use(morgan('dev'))
  // Serve all requests from the `/responsive-components` directory.
  .use('/responsive-components', express.static('./responsive-components'))


export function startServer() {
  const port = 8080;
  const url = `http://localhost:${port}${config.publicPath}`;

  server = app.listen(port);
  console.log(`Server started: ${url}`);
}
