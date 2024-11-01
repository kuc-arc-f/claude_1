import express from 'express';
const router = express.Router();
//require('dotenv').config();
import axios from 'axios';
import chatData from './chatData';
import { z } from 'zod';

const FormData = z.object({
  title: z
    .string()
    .min(1, { message: '1文字以上入力してください。' }),
  content: z
    .string()
    .min(1, { message: '1文字以上入力してください。' }),
});

/**
* 
* @param
*
* @return
*/ 
router.post('/create', async function(req: any, res: any) {
  const retObj = {ret: 500, message: "", errors: {}}
  try {
    if(!req.body){
      throw new Error("nothing, body");
    }
console.log(req.body);
    const items = chatData.create(req.body);
    //console.log(items);
    return res.json(items);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});
/**
* 
* @param
*
* @return
*/ 
router.post('/get_list', async function(req: any, res: any) {
  //
  try {
    const items = chatData.getList();
console.log(items);
    return res.json(items);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});
/**
* 
* @param
*
* @return
*/ 
router.post('/get', async function(req: any, res: any) {
  //
  try {
    console.log(req.body);
    const items = chatData.getItem(req.body);
console.log(items);
    return res.json(items);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});
/**
* 
* @param
*
* @return
*/ 
router.post('/delete', async function(req: any, res: any) {
  try {
    if(!req.body){
      throw new Error("nothing, body");
    }
console.log(req.body);
    const items = chatData.delete(req.body);
    //console.log(items);
    return res.json(items);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});
/**
* 
* @param
*
* @return
*/ 
router.post('/update', async function(req: any, res: any) {
  try {
    if(!req.body){
      throw new Error("nothing, body");
    }
console.log(req.body);
    const items = chatData.update(req.body);
    //console.log(items);
    return res.json(items);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});
export default router;
