import { Routes, Route } from 'react-router-dom';

//
import Home from './client/home';
import BookMark from './client/BookMark';
import Chat from './client/Chat';
import Cms from './client/Cms';
import FormTest1 from './client/FormTest1';
import FormTest3 from './client/FormTest3';
import Plan from './client/Plan';
import Todo from './client/Todo';
/*
*/
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
        <Route path="/plan" element={<Plan />} />
        <Route path="/todo" element={<Todo />} />
      </Routes>
    </div>
    )
}
/*
*/