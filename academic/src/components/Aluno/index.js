import React from "react";
import { Card } from "../Card";
import { ethers } from "ethers";
import { useEffect, useState } from 'react';
import contractAddrs from '../../contractsAddrs.json'
import '../Content.css';

const AlunoAbi = require("../../artifacts/contracts/AlunoContract.sol/AlunoContract.json").abi;

const Aluno = () =>{
  const {AcademicAddr, AlunoContractAddr, ProfessorContractAddr, DisciplinaContractAddr} = contractAddrs
  const [signer, setSigner] = useState()
  const [signerAddress, setSignerAdress] = useState()
  const [alunoContract, setAlunoContract] = useState()


  useEffect(() => {

    async function connect() {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.send("eth_requestAccounts", []);
      const currentSigner = provider.getSigner()
      setSigner(currentSigner)
      const signerAddress = await currentSigner.getAddress()
      setSignerAdress(signerAddress);
      const AlunoContractInstance = new ethers.Contract(AlunoContractAddr, AlunoAbi, currentSigner)
      setAlunoContract(AlunoContractInstance);
    }

    connect();

  }, [signer, signerAddress]);

  const inscreverDisciplina = async (e) =>{
    const input = document.getElementsByClassName('card-input')[0]
    const data = input.value
    const [idAluno, idDisciplina] = data.split(',')
    if(idAluno != "" && idDisciplina != ""){
      const resultInscreverDisciplina = await alunoContract.inscreverDisciplina(parseInt(idAluno), parseInt(idDisciplina));
      resultInscreverDisciplina.wait(1);
      console.log(resultInscreverDisciplina);
    }
    else{
      alert("Please provide a non-blank/valid input information.")
    }
  }

  return (
    <div id="content-container">
      <h1 className='content-title'>Página do aluno</h1>
      <div className='optionsAvailable'>
        <Card props={{functionName: "Inscrever-se em disciplina"}} type="input" action={inscreverDisciplina}></Card>
      </div>
    </div>
  );
}

export default Aluno;