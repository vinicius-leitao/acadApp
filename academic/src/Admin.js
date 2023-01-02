import React from 'react';
import { Card } from "./components/Card";
import { ethers } from "ethers";
import { useEffect, useState } from 'react';
import contractAddrs from './contractsAddrs.json'

import './styles/Content.css';


const AcademicAbi = require("./artifacts/contracts/Academic.sol/Academic.json").abi;
const AlunoAbi = require("./artifacts/contracts/AlunoContract.sol/AlunoContract.json").abi;
const ProfessorAbi = require("./artifacts/contracts/ProfessorContract.sol/ProfessorContract.json").abi;
const DisciplinaAbi = require("./artifacts/contracts/DisciplinaContract.sol/DisciplinaContract.json").abi;


const Admin = () => {

  const [signer, setSigner] = useState()
  const [academicContract, setAcademicContract] = useState()
  const [alunoContract, setAlunoContract] = useState()
  const [professorContract, setProfessorContract] = useState()
  const [disciplinaContract, setDisciplinaContract] = useState()

  useEffect(() => {

    const {AcademicAddr, alunoContractAddr, professorContractAddr, disciplinaContractAddr} = contractAddrs

    async function connect() {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.send("eth_requestAccounts", []);
      const currentSigner = provider.getSigner()
      setSigner(currentSigner);
      const academicContractInstance = new ethers.Contract(AcademicAddr, AcademicAbi, provider)
      setAcademicContract(academicContractInstance);
      const AlunoContractInstance = new ethers.Contract(alunoContractAddr, AlunoAbi, provider)
      setAlunoContract(AlunoContractInstance);
      const ProfessorContractInstance = new ethers.Contract(professorContractAddr, ProfessorAbi, provider)
      setProfessorContract(ProfessorContractInstance);
      const DisciplinaContractInstance = new ethers.Contract(disciplinaContractAddr, DisciplinaAbi, provider)
      setDisciplinaContract(DisciplinaContractInstance);
    }

    connect();

  }, []);

  const abrirLancamentoNotas = async (e) => {
    e.preventDefault();
    const resultAbrirLancamentoNota = await academicContract.abrirLancamentoNota();
    resultAbrirLancamentoNota.wait(1);
    console.log(resultAbrirLancamentoNota);
  }

  const inserirProfessor = async (e) => {
    e.preventDefault();
    const connectToProfessorContract = await professorContract.connect('0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199')
    const input = document.getElementsByClassName('card-input')[0]
    const data = input.value
    const [idProfessor, nomeProfessor] = data.split(',')
    if(idProfessor != "" && nomeProfessor != ""){
      const resultInserirProfessor = await connectToProfessorContract.inserirProfessor(parseInt(idProfessor), nomeProfessor);
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
      const resultInserirAluno = await alunoContract.inserirAluno(parseInt(idAluno), nomeAluno);
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
      const resultInserirDisciplina = await disciplinaContract.inserirDisciplina(parseInt(idDisciplina), nomeDisciplina, addressProfessor, parseInt(idProfessor));
      resultInserirDisciplina.wait(1);
      console.log(resultInserirDisciplina);
    }
    
  }
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

export default Admin;