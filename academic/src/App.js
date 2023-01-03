import './App.css';
import {Nav} from './components/Nav';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import Admin from './components/Admin';
import Professor from './components/Professor';
import Aluno from './components/Aluno';



function App() {

  return (
    <Router>
    <div className='container'>
        <Nav/>
        <div className='content'>
          <Routes>
            <Route path="/" element={<Admin/>} exact/>
            <Route path="/professor" element={<Professor/>}/>
            <Route path="/aluno" element={<Aluno/>}/>
          </Routes>
        </div>
    </div>
    </Router>
  );
}

export default App;
