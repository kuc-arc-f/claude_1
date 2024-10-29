import { Routes, Route } from 'react-router-dom';

//
import Home from './client/home';
import BookMark from './client/BookMark';
import Chat from './client/Chat';
import Cms from './client/Cms';
import FormTest1 from './client/FormTest1';
import FormTest3 from './client/FormTest3';
import FormTest4 from './client/FormTest4';
import FormTest5 from './client/FormTest5';
import FormTest6 from './client/FormTest6';
import FormTest6crate from './client/FormTest6/Create';
import FormTest6edit from './client/FormTest6/Edit';

import Plan from './client/Plan';
import Todo from './client/Todo';
//
import Test1 from './client/Test1';
//
export default function App(){
    return(
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
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
        <Route path="/plan" element={<Plan />} />
        <Route path="/todo" element={<Todo />} />
        <Route path="/test1" element={<Test1 />} />
      </Routes>
    </div>
    )
}
/*
<Route path="/test3" element={<Test3 />} />
<Route path="/test4" element={<Test4 />} />
<Route path="/datatable" element={<DataTable />} />
*/