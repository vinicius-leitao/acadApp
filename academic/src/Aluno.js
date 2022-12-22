import React from 'react';
import {Card} from "./components/Card";

import './styles/Content.css';

const Aluno = () =>{
  return (
    <div id="content-container">
      <h1 className='content-title'>Página do aluno</h1>
      <div className='optionsAvailable'>
        <Card props={{functionName: "Função aluno"}}></Card>
      </div>
    </div>
  );
}

export default Aluno;