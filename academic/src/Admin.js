import React from 'react';
import {Card} from "./components/Card";

import './styles/Content.css';

const Admin = () =>{
  return (
    <div id="content-container">
      <h1 className='content-title'>Página do admin</h1>
      <div className='optionsAvailable'>
        <Card props={{functionName: "Abrir lancamento de nota"}}></Card>
        <Card props={{functionName: "Inserir Professor"}}></Card>
        <Card props={{functionName: "Inserir Aluno"}}></Card>
        <Card props={{functionName: "Inserir Disciplina"}}></Card>
      </div>
    </div>
  );
}

export default Admin;