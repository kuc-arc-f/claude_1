import express from 'express';
const router = express.Router();
//require('dotenv').config();
import axios from 'axios';
import todoData from './todoData';

/**
* 
* @param
*
* @return
*/ 
router.post('/create', async function(req: any, res: any) {
  const retObj = {ret: 500 , message: "" }
  try {
    if(!req.body){
      throw new Error("nothing, body");
    }
    const body = req.body;
console.log(body);
    const url = process.env.EXTERNAL_API_URL; 
    const path = "/api/ai_table1/create";	
console.log("path=", url + path);
    //return res.json(retObj);
    const response = await axios.post(url + path, body, 
    {headers: { 'Content-Type': 'application/json'}
    });
console.log(response.data);
    retObj.ret = 200;
    retObj.data = response.data.data;
    return res.json(retObj);
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
  const retObj = {ret: 500 , message: "" }
  //
  try {
    const url = process.env.EXTERNAL_API_URL; 
    const path = "/api/ai_table1/get_list";	
console.log("path=", url + path);
    const response = await axios.post(url + path, req.body, 
      {headers: { 'Content-Type': 'application/json'}
    });
    //console.log(response.data);
    retObj.ret = 200;
    retObj.data = response.data.data;
    //const out  = todoData.convertTextArray(retObj.data);
    //console.log(out);
    //retObj.data = out;
    return res.json(retObj);
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
    const items = todoData.getItem(req.body);
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
  const retObj = {ret: 500 , message: "" };
  try {
    if(!req.body){
      throw new Error("nothing, body");
    }
console.log(req.body);
    const url = process.env.EXTERNAL_API_URL; 
    const path = "/api/ai_table1/delete";	
console.log("path=", url + path);
    //return res.json(retObj);
    const response = await axios.post(url + path, req.body, 
      {headers: { 'Content-Type': 'application/json'}
    });
    //console.log(response.data);
    retObj.ret = 200;
    retObj.data = response.data.data;
    //console.log(items);
    return res.json(retObj);
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
  const retObj = {ret: 500 , message: "" };
  try {
    if(!req.body){
      throw new Error("nothing, body");
    }
    const body = req.body;
console.log(body);
    const url = process.env.EXTERNAL_API_URL; 
    const path = "/api/ai_table1/update";	
console.log("path=", url + path);
    const response = await axios.post(url + path, req.body, 
      {headers: { 'Content-Type': 'application/json'}
    });
    //console.log(response.data);
    retObj.ret = 200;
    retObj.data = response.data.data;
    //console.log(items);
    return res.json(retObj);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }  
});
export default router;
