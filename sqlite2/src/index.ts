import fs from 'node:fs/promises'
import express from "express";
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');

import { renderToString } from 'react-dom/server';
import cookieParser from "cookie-parser";
import session from "express-session";

import Top from './pages/App';
import About from './pages/about';
//
const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));
console.log("env= ", process.env.NODE_ENV);
//

// バリデーションスキーマ
const TodoSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  content: z.string().min(1, "内容は必須です"),
  public: z.boolean(),
  foodOrange: z.boolean(),
  foodApple: z.boolean(),
  foodBanana: z.boolean(),
  pubDate: z.string(),
  qty1: z.string().min(1, "数量1は必須です"),
  qty2: z.string().min(1, "数量2は必須です"),
  qty3: z.string().min(1, "数量3は必須です"),
});


// 全件取得
app.get('/api/todos', async (req, res) => {
  const { search } = req.query;
  try {
    const todos = await prisma.todo.findMany({
      where: search 
        ? {
            OR: [
              { title: { contains: String(search) } },
              { content: { contains: String(search) } },
            ],
          }
        : undefined,
    });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'エラーが発生しました' });
  }
});

// 新規作成
app.post('/api/todos', async (req, res) => {
  try {
    const validatedData = TodoSchema.parse(req.body);
    let pubDateValue = null;
    if(!validatedData.pubDate) { validatedData.pubDate = pubDateValue; }
    //console.log(validatedData);
    const todo = await prisma.todo.create({
      data: {
        ...validatedData,
        pubDate: new Date(validatedData.pubDate),
      },
    });
    res.json(todo);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: 'エラーが発生しました' });
    }
  }
});

// 更新
app.put('/api/todos/:id', async (req, res) => {
  try {
    const validatedData = TodoSchema.parse(req.body);
    const todo = await prisma.todo.update({
      where: { id: Number(req.params.id) },
      data: {
        ...validatedData,
        pubDate: new Date(validatedData.pubDate),
      },
    });
    res.json(todo);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: 'エラーが発生しました' });
    }
  }
});

// 削除
app.delete('/api/todos/:id', async (req, res) => {
  try {
    await prisma.todo.delete({
      where: { id: Number(req.params.id) },
    });
    res.json({ message: '削除成功' });
  } catch (error) {
    res.status(500).json({ error: 'エラーが発生しました' });
  }
});

// エラーハンドリング
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});
//
const errorObj = {ret: "NG", messase: "Error"};

app.get("/*", (req, res) => {
  res.send(renderToString(Top()));
});
//start
const port = 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
  