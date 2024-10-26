import express from 'express';
const router = express.Router();
//require('dotenv').config();
import axios from 'axios';
import bookmarkData from './bookmarkData';

/**
* 
* @param
*
* @return
*/ 
router.post('/create', async function(req: any, res: any) {
  try {
    if(!req.body){
      throw new Error("nothing, body");
    }
console.log(req.body);
    const items = bookmarkData.create(req.body);
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
    const items = bookmarkData.getList();
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
    const items = bookmarkData.getItem(req.body);
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
    const items = bookmarkData.delete(req.body);
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
    const items = bookmarkData.update(req.body);
    //console.log(items);
    return res.json(items);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});
export default router;
