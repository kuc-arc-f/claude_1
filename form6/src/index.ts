import fs from 'node:fs/promises'
import express from "express";
import { renderToString } from 'react-dom/server';
import cookieParser from "cookie-parser";
import session from "express-session";

import Common from './lib/Common';
import Login from './client/login';
import Top from './pages/App';
import About from './pages/about';
//import Test3 from './pages/Test3';
import MermaidShow from './pages/MermaidShow';
import MermaidCrudIndex from './pages/MermaidShow/CrudIndex';
import TaskItemGantt from './pages/TaskItemGantt';
import TaskItemCrudIndex from './pages/TaskItem/CrudIndex';
//
import userRouter from './routes/userRouter';
import bookmarkRouter from './routes/bookmarkRouter';
import commonRouter from './routes/commonRouter';
import chatRouter from './routes/chatRouter';
import planRouter from './routes/planRouter';
import todoRouter from './routes/todoRouter';
import cmsRouter from './routes/cmsRouter';
import mermaidRouter from './routes/mermaidRouter';
//
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));
console.log("env= ", process.env.NODE_ENV);
//
app.use('/api/user', userRouter);
app.use('/api/bookmark', bookmarkRouter);
app.use('/api/common', commonRouter);
app.use('/api/chat', chatRouter);
app.use('/api/cms', cmsRouter);
app.use('/api/plan', planRouter);
app.use('/api/todo', todoRouter);
app.use('/api/mermaid', mermaidRouter);
// Session
app.use(session({
  secret: 'secret key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * Number(process.env.AUTH_EXPIRED_TIME),  // クッキーの有効期限をn-minに設定(msec * sec * min)
    //httpsを使用しない
    secure: false
  }
}));
//
const errorObj = {ret: "NG", messase: "Error"};
//middleware
app.use(async function(req: any, res: any, next: any){
  const valid = await Common.validUser(req, res);
  if(!valid) {
    console.log("nothing, user-session");
    res.redirect('/login');
  } else {
    next();
  }
});
//MPA 
//app.get("/test93", (req, res) => {
//  res.send(renderToString(Test3()));
//});
app.get('/mermaidshow/:id', async (req: any, res: any) => {
  console.log("id=", req.params.id  );
  try {
    const item = await MermaidCrudIndex.get(Number(req.params.id));
console.log(item);
    res.send(renderToString(MermaidShow(item)));
  } catch (error) { res.sendStatus(500);}
});
app.get('/task_item_gantt/:id', async (req: any, res: any) => {
  console.log("id=", req.params.id  );
  try {
    const item = await TaskItemCrudIndex.get(Number(req.params.id));
    //console.log(item);
    res.send(renderToString(TaskItemGantt({item: item, id: Number(req.params.id)})));
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
  