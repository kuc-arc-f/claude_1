import { Routes, Route } from 'react-router-dom';

//
import Login from './client/login';
import Home from './client/home';
import About from './client/about';
import BookMark from './client/BookMark';
import Chat from './client/Chat';
import Cms from './client/Cms';
import FormTest1 from './client/FormTest1';
import FormTest3 from './client/FormTest3';
import FormTest4 from './client/FormTest4';
import FormTest5 from './client/FormTest5';
import FormTest6 from './client/FormTest6';
import FormTest6crate from './client/FormTest6create';
import FormTest6edit from './client/FormTest6edit';
import FormTest7 from './client/FormTest7';

import Mermaid from './client/Mermaid';
import Plan from './client/Plan';
import Plan4 from './client/Plan4';
import TaskProject from './client/TaskProject';
import TaskItem from './client/TaskItem';
import TaskManage1 from './client/TaskManage1';
import TaskManage2 from './client/TaskManage2';

import Todo from './client/Todo';
//
import Test1 from './client/Test1';
import Test2 from './client/Test2'; 
//
export default function App(){
    return(
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/cms" element={<Cms />} />
        <Route path="/bookmark" element={<BookMark />} />
        <Route path="/form_test1" element={<FormTest1 />} />
        <Route path="/form_test3" element={<FormTest3 />} />
        <Route path="/form_test4" element={<FormTest4 />} />
        <Route path="/form_test5" element={<FormTest5 />} />
        <Route path="/form_test6" element={<FormTest6 />} />
        <Route path="/form_test6create" element={<FormTest6crate />} />
        <Route path="/form_test6edit" element={<FormTest6edit />} />
        <Route path="/form_test7" element={<FormTest7 />} />
        <Route path="/mermaid" element={<Mermaid />} />
        <Route path="/plan" element={<Plan />} />
        <Route path="/plan4" element={<Plan4 />} />
        <Route path="/task_manage1" element={<TaskManage1 />} />
        <Route path="/task_manage2" element={<TaskManage2 />} />
        <Route path="/task_project" element={<TaskProject />} />
        <Route path="/task_item" element={<TaskItem />} />
        <Route path="/todo" element={<Todo />} />
        <Route path="/test1" element={<Test1 />} />
        <Route path="/test2" element={<Test2 />} />
      </Routes>
    </div>
    )
}
/*
<Route path="/test3" element={<Test3 />} />
<Route path="/test4" element={<Test4 />} />
<Route path="/datatable" element={<DataTable />} />
*/