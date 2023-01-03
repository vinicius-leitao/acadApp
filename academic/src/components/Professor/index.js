import React from "react";
import { Card } from "../Card";
import { ethers } from "ethers";
import { useEffect, useState } from 'react';

import '../Content.css';

const ProfessorAbi = require("../../artifacts/contracts/ProfessorContract.sol/ProfessorContract.json").abi;

const Professor = () => {
  const ProfessorAddr = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";

  const [signer, setSigner] = useState();
  const [signerAddress, setSignerAddress] = useState();
  const [contract, setContract] = useState();

  useEffect(() => {
    async function connect() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer2 = provider.getSigner();
      setSigner(signer2);
      setSignerAddress(await signer2.getAddress());
      const professorContract = new ethers.Contract(
        ProfessorAddr,
        ProfessorAbi,
        provider
      );
      setContract(professorContract.connect(signer2));
    }
    connect();
  }, [signer]);

  const inserirNota = async (e) => {
    const input = document.getElementsByClassName('card-input')[0]
    const data = input.value
    const [idAluno, idDisciplina, nota] = data.split(',')
    if(idAluno != "" && idDisciplina != "" && nota != ""){
      const resultInserirNota = await contract.inserirNota(parseInt(idAluno), parseInt(idDisciplina), parseInt(nota));
      resultInserirNota.wait(1);
      console.log(resultInserirNota);
    }
  }

  const listarNotas = async (e) => {
    const input = document.getElementsByClassName('card-input')[1]
    const data = input.value
    const idDisciplina = data
    if(idDisciplina != ""){
      
      const resultListarNotas = await contract.listarNotasDisciplina(parseInt(idDisciplina));
      resultListarNotas.wait(1);
      console.log(resultListarNotas);
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
