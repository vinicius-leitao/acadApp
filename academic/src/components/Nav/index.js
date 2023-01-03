import './Nav.css';
import { Link, NavLink } from 'react-router-dom';

export function Nav(){
    return (
        <nav id="nav-container">
            <NavLink id="navlink">
                <Link className="nav-tab" to="/">Admin</Link>
                <Link className="nav-tab" to="/professor">Professor</Link>
                <Link className="nav-tab" to="/aluno">Aluno</Link>
            </NavLink>

            <div id="appname">
                <img src='assets/blockchain.png' alt="Logo" />
                <span id="appspan">AcadApp</span>
            </div>
        </nav>
    )
}