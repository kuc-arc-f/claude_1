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
      let ret = [];
      const postItem = {
        dt_type: LibConfig.dt_type.dt_type9,
      }
      const url = process.env.EXTERNAL_API_URL; 
      const path = "/api/ai_table1/get_list";	
  console.log("path=", url + path);
      const response = await axios.post(url + path, postItem, 
        {headers: { 'Content-Type': 'application/json'}
      });
      //console.log(response.data.data);
      if(response.data.data.length > 0){
        const target = [];
        response.data.data.forEach((element) => {
          //console.log(element)
          let row = JSON.parse(element.content);
          row.id = element.id;
          row.createdAt = element.createdAt;
          row.userId = element.userId;
          target.push(row);
        });
        console.log("len=", target.length)
        let out = target.filter((todo) => todo.projectId === Number(id) );
        console.log(out)
        ret= out;
      }
      return ret;
    } catch (error) {
      console.error(error);
      throw new Error('Error , get');
    }
  },  
}
export default CrudIndex;