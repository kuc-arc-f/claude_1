import axios from 'axios';
import LibConfig from "../../lib/LibConfig";
//
const CrudIndex = {
  /**
  * 
  * @param
  *
  * @return
  */ 
  getList: async function() : Promise<any>
  {
    try {
      const url = process.env.EXTERNAL_API_URL; 
      const path = "/test/get_list";	
      console.log("path=", url + path);
      const item  = {
        "userId": 0,
      } 
      const response = await axios.post(url + path, item, 
        {headers: { 'Content-Type': 'application/json'}
      });
      const data = response.data;
//console.log(data.ret);
      //@ts-ignore
      return data.data;
    } catch (error) {
      console.error(error);
      throw new Error('Error , getList');
    }
  },
  /**
  * 
  * @param
  *
  * @return
  */ 
  get: async function(id : number) : Promise<any>
  {
    try {
      let ret = {};
      const postItem = {
        dt_type: LibConfig.dt_type.dt_type7,
      }
      const url = process.env.EXTERNAL_API_URL; 
      const path = "/api/ai_table1/get_list";	
  console.log("path=", url + path);
      const response = await axios.post(url + path, postItem, 
        {headers: { 'Content-Type': 'application/json'}
      });
      if(response.data.data.length > 0){
        let target = response.data.data.filter((todo) => todo.id === Number(id) );
        //console.log(target);
        let row = target[0];
        let out = JSON.parse(row.content);
        out.id = row.id;
        out.createdAt = row.createdAt;
        out.userId = row.userId;
        ret = out;
      }
      //console.log(response.data);
      return ret;
    } catch (error) {
      console.error(error);
      throw new Error('Error , get');
    }
  },  
}
export default CrudIndex;