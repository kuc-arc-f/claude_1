import HttpCommon from "../lib/HttpCommon";
import LibConfig from "../../lib/LibConfig";

const DT_TYPE = LibConfig.dt_type.dt_type10;

const CrudIndex = {
  /**
  * 
  * @param
  *
  * @return
  */ 
  create:  async function(values: any) {
    try{
      const postItem = {
        userId: 0,
        dt_type: DT_TYPE,
        content: JSON.stringify(values),
    }     
    const json = await HttpCommon.post(postItem, "/api/common/create");
    if(json.ret !== 200){
      throw new Error("Error, ret <> 200");
    }
console.log(json);
      return json.data;
    } catch (e) {
      console.error(e);
    } 
  }, 
  /**
  * 
  * @param
  *
  * @return
  */ 
  convertDateArray:  function(items: any) : any[]
  {
    try{
  //console.log("#getList");
      const out = [];
      items.forEach((row) => {
        let date = new Date(row.date);
        //console.log(date);
        row.date = date;
        out.push(row);
      });
      return out;
    } catch (e) {
      console.error(e);
    } 
  },  
  /**
  * 
  * @param
  *
  * @return
  */ 
  update:  async function(values: any, id: number) {
    try{
//console.log("#getList");
      const postItem = {
        id: id,
        userId: 0,
        dt_type: DT_TYPE,
        content: JSON.stringify(values),
      }      
      const json = await HttpCommon.post(postItem, "/api/common/update");
      let items = json;
      console.log(json);
      return items;
    } catch (e) {
      console.error(e);
    } 
  },  

  /**
  * 
  * @param
  *
  * @return
  */ 
  getList:  async function() {
    try{
//console.log("#getList");
      //let item  = {}      
      const postItem = {
        dt_type: DT_TYPE,
      }
      console.log(postItem);  
      const json = await HttpCommon.post(postItem, "/api/common/get_list");
      if(json.ret !== 200){
        throw new Error("Error, ret <> 200");
      }
      let items: any[] = [];
      items = json.data;
      const out: any[] = [];
      items.forEach((row: any) => {
        if(row.content) {
          let target = JSON.parse(row.content);
          target.id = row.id;
          target.createdAt = row.createdAt;
          target.userId = row.userId;
          out.push(target);
        }
      });
      //console.log(json);
      return out;
    } catch (e) {
      console.error(e);
    } 
  },
    /*
  * 
  * @param
  *
  * @return
  */ 
  getItem:  async function(id: number) {
    try{
      let item  = {
        id: id
      }      
      const json = await HttpCommon.post(item, "/api/common/get");
      let items = json;
      //console.log(json);
      return items;
    } catch (e) {
      console.error(e);
    } 
  },    
  /**
  * 
  * @param
  *
  * @return
  */ 
  delete:  async function(id : string) {
    try{
//console.log("#getList");
      let item  = {
        id: id
      }      
      const json = await HttpCommon.post(item, "/api/common/delete");
      let items = json;
      console.log(json);
      return items;
    } catch (e) {
      console.error(e);
    } 
  }, 
  
}
export default CrudIndex;