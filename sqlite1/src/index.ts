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
  title: z.string().min(1, { message: "タイトルは必須です" })
});

// TODOの取得
app.get('/api/todos', async (req, res) => {
  try {
    const searchQuery = req.query.search || '';
    const todos = await prisma.todo.findMany({
      where: {
        title: {
          contains: searchQuery
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// TODOの追加
app.post('/api/todos', async (req, res) => {
  try {
    const { title } = TodoSchema.parse(req.body);
    
    const todo = await prisma.todo.create({
      data: {
        title,
      }
    });
    
    res.json(todo);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// TODOの更新
app.put('/api/todos/:id', async (req, res) => {
  try {
    const { title } = TodoSchema.parse(req.body);
    const id = parseInt(req.params.id);
    
    const todo = await prisma.todo.update({
      where: { id },
      data: { title }
    });
    
    res.json(todo);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// TODOの削除
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    await prisma.todo.delete({
      where: { id }
    });
    
    res.json({ message: "削除しました" });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
  