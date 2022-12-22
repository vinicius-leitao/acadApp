import React from 'react';
import { Card } from "./components/Card";
import { ethers } from "ethers";
import { useEffect, useState } from 'react';

import './styles/Content.css';

const AcademicAbi = require("./artifacts/contracts/Academic.sol/Academic.json").abi;

const Admin = () => {

  const AcademicAddr = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

  const [signer, setSigner] = useState()
  const [signerAddress, setSignerAddress] = useState();
  const [contract, setContract] = useState();

  useEffect(() => {

    async function connect() {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.send("eth_requestAccounts", []);
      const signer2 = provider.getSigner()
      setSigner(signer2);
      setSignerAddress(await signer2.getAddress())
      const academicContract = new ethers.Contract(AcademicAddr, AcademicAbi, provider);
      setContract(academicContract.connect(signer2));
      
    }

    connect();
  }, [signer, signerAddress]);

  const abrirLancamentoNotas = async (e) => {
    e.preventDefault();
    const resultAbrirLancamentoNota = await contract.abrirLancamentoNota();
    resultAbrirLancamentoNota.wait(1);
    console.log(resultAbrirLancamentoNota);
  }

  const inserirProfessor = async (e) => {
    e.preventDefault();
    const input = document.getElementsByClassName('card-input')[0]
    const data = input.value
    const [idProfessor, nomeProfessor] = data.split(',')
    if(idProfessor != "" && nomeProfessor != ""){
      const resultInserirProfessor = await contract.inserirProfessor(parseInt(idProfessor), nomeProfessor);
      const result = resultInserirProfessor.wait(1);
      console.log(result);
    }
  }

  const inserirAluno = async (e) => {
    e.preventDefault();
    const input = document.getElementsByClassName('card-input')[1]
    const data = input.value
    const [idAluno, nomeAluno] = data.split(',')
    if(idAluno != "" && nomeAluno != ""){
      const resultInserirAluno = await contract.inserirAluno(parseInt(idAluno), nomeAluno);
      resultInserirAluno.wait(1);
      console.log(resultInserirAluno);
    }
    
  }

  const inserirDisciplina = async (e) => {
    e.preventDefault();
    const input = document.getElementsByClassName('card-input')[2]
    const data = input.value
    const [idDisciplina, nomeDisciplina, addressProfessor, idProfessor] = data.split(',')
    if(idDisciplina != "" && nomeDisciplina != "" && addressProfessor != "" && idProfessor != ""){
      const resultInserirDisciplina = await contract.inserirDisciplina(parseInt(idDisciplina), nomeDisciplina, addressProfessor, parseInt(idProfessor));
      resultInserirDisciplina.wait(1);
      console.log(resultInserirDisciplina);
    }
    
  }

  if (signerAddress != 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266)
    return (<h1 className='content-title'>You're not allowed to see this page.</h1>)
  else {
    return (
      <div id="content-container">
        <h1 className='content-title'>Página do admin</h1>
        <div className='optionsAvailable'>
          <Card props={{ functionName: "Abrir lançamento de notas" }} action={abrirLancamentoNotas} type="button"></Card>
          <Card props={{ functionName: "Inserir Professor" }} action={inserirProfessor} type="input"></Card>
          <Card props={{ functionName: "Inserir Aluno" }} action={inserirAluno} type="input"></Card>
          <Card props={{ functionName: "Inserir Disciplina" }} action={inserirDisciplina} type="input"></Card>
        </div>
      </div>
    );
  }
}

export default Admin;