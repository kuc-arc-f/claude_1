//import { Routes, Route, Link } from 'react-router-dom';
import {Link } from 'react-router-dom';
//
function Page() {
    return (
    <div>
        <a href="/">[ Home ]</a>
        <a href="/chat" className="ms-2"> [ chat ]</a>
        <a href="/plan" className="ms-2"> [ plan ]</a>
        <a href="/todo" className="ms-2"> [ todo ]</a>
        <a href="/bookmark" className="ms-2"> [ bookmark ]</a>
        <a href="/cms" className="ms-2"> [ cms ]</a>
        <a href="/form_test1" className="ms-2"> [ Form1 ]</a>
        <a href="/form_test3" className="ms-2"> [ Form3 ]</a>
        <a href="/form_test4" className="ms-2"> [ Form4 ]</a>
        <a href="/form_test5" className="ms-2"> [ Form5 ]</a>
        <a href="/form_test6" className="ms-2"> [ Form6 ]</a>
        <br />
    </div>
    );
}
export default Page;
//<a href="/test1" className="ms-2"> [ Test1 ]</a>