import HttpCommon from "../lib/HttpCommon";
import LibConfig from "../../lib/HttpCommon";

const CrudIndex = {
  /**
  * 
  * @param
  *
  * @return
  */ 
  create:  async function(values: any) {
    try{
//      let item  = values;
      const postItem = {
        userId: 0,
        dt_type: LibConfig.dt_type.dt_type7,
        content: JSON.stringify(values),
    }     
//return;
      const json = await HttpCommon.post(postItem, "/api/mermaid/create");
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
  update:  async function(values: any) {
    try{
//console.log("#getList");
      let item  = values;     
      const json = await HttpCommon.post(item, "/api/mermaid/update");
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
      let item  = {}      
      const json = await HttpCommon.post(item, "/api/mermaid/get_list");
      if(json.ret !== 200){
        throw new Error("Error, ret <> 200");
      }
      console.log(json);
      return json.data;
      //const out = [];
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
      const json = await HttpCommon.post(item, "/api/mermaid/get");
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
      const json = await HttpCommon.post(item, "/api/mermaid/delete");
      let items = json;
      console.log(json);
      return items;
    } catch (e) {
      console.error(e);
    } 
  }, 
  
}
export default CrudIndex;