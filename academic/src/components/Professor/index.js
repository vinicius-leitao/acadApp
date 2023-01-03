import React from "react";
import { Card } from "../Card";
import { ethers } from "ethers";
import { useEffect, useState } from 'react';
import contractAddrs from '../../contractsAddrs.json'
import '../Content.css';

const ProfessorAbi = require("../../artifacts/contracts/ProfessorContract.sol/ProfessorContract.json").abi;

const Professor = () => {

  const {AcademicAddr, AlunoContractAddr, ProfessorContractAddr, DisciplinaContractAddr} = contractAddrs
  const [signer, setSigner] = useState()
  const [signerAddress, setSignerAdress] = useState()
  const [professorContract, setProfessorContract] = useState()


  useEffect(() => {

    async function connect() {

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.send("eth_requestAccounts", []);
      const currentSigner = provider.getSigner()
      setSigner(currentSigner)
      const signerAddress = await currentSigner.getAddress()
      setSignerAdress(signerAddress);
      const ProfessorContractInstance = new ethers.Contract(ProfessorContractAddr, ProfessorAbi, currentSigner)
      setProfessorContract(ProfessorContractInstance);
    }

    connect();

  }, [signer, signerAddress]);

  const inserirNota = async (e) => {
    const input = document.getElementsByClassName('card-input')[0]
    const data = input.value
    const [idAluno, idDisciplina, nota] = data.split(',')
    if(idAluno != "" && idDisciplina != "" && nota != ""){
      const resultInserirNota = await professorContract.inserirNota(parseInt(idAluno), parseInt(idDisciplina), parseInt(nota));
      resultInserirNota.wait(1);
      console.log(resultInserirNota);
    }
    else{
      alert("Please provide a non-blank/valid input information.")
    }
  }

  const listarNotas = async (e) => {
    const input = document.getElementsByClassName('card-input')[1]
    const data = input.value
    const idDisciplina = data
    if(idDisciplina != ""){
      const resultListarNotas = await professorContract.listarNotasDisciplina(parseInt(idDisciplina));
      console.log(resultListarNotas);
    }
    else{
      alert("Please provide a non-blank/valid input information.")
    }
  }
    return (
      <div id="content-container">
        <h1 className="content-title">Página do professor</h1>
        <div className="optionsAvailable">
          <Card props={{ functionName: "Inserir nota" }} action={inserirNota} type="input"></Card>
          <Card props={{ functionName: "Listar notas" }} action={listarNotas} type="input"></Card>
        </div>
      </div>
    );
};

export default Professor;
