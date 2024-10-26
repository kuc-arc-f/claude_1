import fs from 'node:fs/promises'
import express from "express";
import { renderToString } from 'react-dom/server';

import Top from './pages/App';
import About from './pages/about';
import bookmarkRouter from './routes/bookmarkRouter';
import chatRouter from './routes/chatRouter';
import planRouter from './routes/planRouter';
import todoRouter from './routes/todoRouter';
import cmsRouter from './routes/cmsRouter';
//
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
console.log("env= ", process.env.NODE_ENV);
//
app.use('/api/bookmark', bookmarkRouter);
app.use('/api/chat', chatRouter);
app.use('/api/cms', cmsRouter);
app.use('/api/plan', planRouter);
app.use('/api/todo', todoRouter);
//
const errorObj = {ret: "NG", messase: "Error"};
//MPA 
app.get("/*", (req, res) => {
  res.send(renderToString(Top()));
});
//start
const port = 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
  