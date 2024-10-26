//import { Routes, Route, Link } from 'react-router-dom';
import {Link } from 'react-router-dom';
//
function Page() {
    return (
    <div>
        <a href="/">[ Home ]</a>
        <a href="/alert_dialog" className="ms-2"> [ AlertDialog ]</a>
        <a href="/button" className="ms-2"> [ Button ]</a>
        <a href="/input" className="ms-2"> [ Input ]</a>
        <a href="/card" className="ms-2"> [ Card ]</a>
        <a href="/textarea" className="ms-2"> [ TextArea ]</a>
        <hr />
    </div>
    );
}
export default Page;
/*
*/