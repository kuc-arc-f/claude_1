import fs from 'node:fs/promises'
import express from "express";
import { renderToString } from 'react-dom/server';

import Top from './pages/App';
import About from './pages/about';
import Test3 from './pages/Test3';
import MermaidShow from './pages/MermaidShow';
import MermaidCrudIndex from './pages/MermaidShow/CrudIndex';

import bookmarkRouter from './routes/bookmarkRouter';
import chatRouter from './routes/chatRouter';
import planRouter from './routes/planRouter';
import todoRouter from './routes/todoRouter';
import cmsRouter from './routes/cmsRouter';
import mermaidRouter from './routes/mermaidRouter';
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
app.use('/api/mermaid', mermaidRouter);
//
const errorObj = {ret: "NG", messase: "Error"};
//MPA 
app.get("/test3", (req, res) => {
  res.send(renderToString(Test3()));
});
app.get('/mermaidshow/:id', async (req: any, res: any) => {
  console.log("id=", req.params.id  );
  try {
    const item = await MermaidCrudIndex.get(Number(req.params.id));
console.log(item);
    res.send(renderToString(MermaidShow(item)));
  } catch (error) { res.sendStatus(500);}
});
app.get("/*", (req, res) => {
  res.send(renderToString(Top()));
});
//start
const port = 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
  