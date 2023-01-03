import React from 'react';
import { Card } from "../Card";
import { ethers } from "ethers";
import { useEffect, useState } from 'react';
import contractAddrs from '../../contractsAddrs.json'

import '../Content.css';

const AcademicAbi = require("../../artifacts/contracts/Academic.sol/Academic.json").abi;
const AlunoAbi = require("../../artifacts/contracts/AlunoContract.sol/AlunoContract.json").abi;
const ProfessorAbi = require("../../artifacts/contracts/ProfessorContract.sol/ProfessorContract.json").abi;
const DisciplinaAbi = require("../../artifacts/contracts/DisciplinaContract.sol/DisciplinaContract.json").abi;


const Admin = () => {

  const {AcademicAddr, AlunoContractAddr, ProfessorContractAddr, DisciplinaContractAddr} = contractAddrs
  const [signer, setSigner] = useState()
  const [signerAddress, setSignerAdress] = useState()
  const [academicContract, setAcademicContract] = useState()
  const [alunoContract, setAlunoContract] = useState()
  const [professorContract, setProfessorContract] = useState()
  const [disciplinaContract, setDisciplinaContract] = useState()

  useEffect(() => {

    async function connect() {

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.send("eth_requestAccounts", []);
      const currentSigner = provider.getSigner()
      setSigner(currentSigner)
      const signerAddress = await currentSigner.getAddress()
      setSignerAdress(signerAddress);
      const academicContractInstance = new ethers.Contract(AcademicAddr, AcademicAbi, currentSigner)
      setAcademicContract(academicContractInstance);
      const AlunoContractInstance = new ethers.Contract(AlunoContractAddr, AlunoAbi, currentSigner)
      setAlunoContract(AlunoContractInstance);
      const ProfessorContractInstance = new ethers.Contract(ProfessorContractAddr, ProfessorAbi, currentSigner)
      setProfessorContract(ProfessorContractInstance);
      const DisciplinaContractInstance = new ethers.Contract(DisciplinaContractAddr, DisciplinaAbi, currentSigner)
      setDisciplinaContract(DisciplinaContractInstance);
    }

    connect();

  }, [signer, signerAddress]);

  
  const inserirProfessor = async (e) => {
    const input = document.getElementsByClassName('card-input')[0]
    const data = input.value
    const [idProfessor, nomeProfessor, enderecoProfessor] = data.split(',')
    if(idProfessor !== "" && nomeProfessor !== ""){
      const resultInserirProfessor = await professorContract.inserirProfessor(parseInt(idProfessor), nomeProfessor, enderecoProfessor);
      resultInserirProfessor.wait(1);
      console.log(resultInserirProfessor);
    }
    else{
      alert("Please provide a non-blank/valid input information.")
    }
  }
  
  const inserirAluno = async (e) => {
    const input = document.getElementsByClassName('card-input')[1]
    const data = input.value
    const [idAluno, nomeAluno, enderecoAluno] = data.split(',')
    if(idAluno !== "" && nomeAluno !== ""){
      const resultInserirAluno = await alunoContract.inserirAluno(parseInt(idAluno), nomeAluno, enderecoAluno);
      resultInserirAluno.wait(1);
      console.log(resultInserirAluno);
    }
    else{
      alert("Please provide a non-blank/valid input information.")
    }
    
  }
  
  const inserirDisciplina = async (e) => {
    const input = document.getElementsByClassName('card-input')[2]
    const data = input.value
    const [idDisciplina, nomeDisciplina, addressProfessor, idProfessor] = data.split(',')
    if(idDisciplina != "" && nomeDisciplina != "" && addressProfessor != "" && idProfessor != ""){
      const resultInserirDisciplina = await disciplinaContract.inserirDisciplina(parseInt(idDisciplina), nomeDisciplina, addressProfessor, parseInt(idProfessor));
      resultInserirDisciplina.wait(1);
      console.log(resultInserirDisciplina);
    }
    else{
      alert("Please provide a non-blank/valid input information.")
    }
  }

  const abrirInscricoes = async (e) => {
    const resultAbrirInscricoes = await academicContract.abrirInscricoes()
    resultAbrirInscricoes.wait(1);
    console.log(resultAbrirInscricoes);
  }
  
  const abrirLancamentoNotas = async (e) => {
    const resultAbrirLancamentoNotaWithSigner = await academicContract.abrirLancamentoNota()
    resultAbrirLancamentoNotaWithSigner.wait(1);
    console.log(resultAbrirLancamentoNotaWithSigner)
  }
  const fecharPeriodo = async (e) => {
    const resultFecharPeriodo = await academicContract.fecharPeriodo()
    resultFecharPeriodo.wait(1);
    console.log(resultFecharPeriodo);
  }
  
    return (
      <div id="content-container">
        <h1 className='content-title'>Página do admin</h1>
        <div className='optionsAvailable'>
          <Card props={{ functionName: "Abrir lançamento de notas" }} action={abrirLancamentoNotas} type="button"></Card>
          <Card props={{ functionName: "Abrir inscrições" }} action={abrirInscricoes} type="button"></Card>
          <Card props={{ functionName: "Fechar periodo" }} action={fecharPeriodo} type="button"></Card>
          <Card props={{ functionName: "Inserir Professor" }} action={inserirProfessor} type="input"></Card>
          <Card props={{ functionName: "Inserir Aluno" }} action={inserirAluno} type="input"></Card>
          <Card props={{ functionName: "Inserir Disciplina" }} action={inserirDisciplina} type="input"></Card>
        </div>
      </div>
    );
}

export default Admin;