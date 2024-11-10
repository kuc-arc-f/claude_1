import HttpCommon from "../lib/HttpCommon";

const CrudIndex = {
  /**
  * 
  * @param
  *
  * @return
  */ 
  create:  async function(values: any) {
    try{
//console.log("#getList");
      let item  = values;     
//return;
      const json = await HttpCommon.post(item, "/api/plan/create");
      let items = json;
//      const out = [];
      const out = this.convertDateArray(items);
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
      const json = await HttpCommon.post(item, "/api/plan/update");
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
      const json = await HttpCommon.post(item, "/api/plan/get_list");
      let items = json;
      const out = this.convertDateArray(items);
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
      const json = await HttpCommon.post(item, "/api/plan/get");
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
      const json = await HttpCommon.post(item, "/api/plan/delete");
      let items = json;
      console.log(json);
      return items;
    } catch (e) {
      console.error(e);
    } 
  }, 
  
}
export default CrudIndex;