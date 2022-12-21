import React from 'react';
import {Card} from "./components/Card";

import './styles/Content.css';

const Professor = () =>{
  return (
    <div id="content-container">
    <h1 className='content-title'>Página do professor</h1>
    <div className='optionsAvailable'>
      <Card props={{functionName: "Inserir nota"}}></Card>
      <Card props={{functionName: "Listar notas"}}></Card>
    </div>
  </div>
  );
}

export default Professor;