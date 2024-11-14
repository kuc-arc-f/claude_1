import HttpCommon from "../lib/HttpCommon";
import LibConfig from "../../lib/LibConfig";

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
        dt_type: LibConfig.dt_type.dt_type8,
        content: JSON.stringify(values),
    }     
//return;
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
  update:  async function(values: any, id: number) {
    try{
      //let item  = values; 
      const postItem = {
        id: id,
        userId: 0,
        dt_type: LibConfig.dt_type.dt_type8,
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
      const postItem = {
        dt_type: LibConfig.dt_type.dt_type8,
      }
      console.log(postItem);     
      const json = await HttpCommon.post(postItem, "/api/common/get_list");
      if(json.ret !== 200){
        throw new Error("Error, ret <> 200");
      }
      //console.log(json);
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