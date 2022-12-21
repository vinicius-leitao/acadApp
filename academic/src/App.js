import './App.css';
import { ethers } from "ethers";
import { useEffect, useState } from 'react';
import {Nav} from './components/Nav';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import Admin from './Admin';
import Professor from './Professor';
import Aluno from './Aluno';

function App() {
  const AcademicTokenAddr = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"
  const AcademicTokenAbi = require('./AcademicToken.json')
  console.log(`Abi do Academic Token: `);
  console.log(AcademicTokenAbi.abi);
  const [signer, setSigner] = useState()

  useEffect(() => {

    async function connect() {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.send("eth_requestAccounts", []);
      const signer2 = provider.getSigner()
      console.log(`Conteúdo do signer`)
      console.log(signer2)

      const bn = await provider.getBlockNumber()
      console.log(`Número do bloco ${bn}`);

      // The Contract object
      const academicContract = new ethers.Contract(AcademicTokenAddr, AcademicTokenAbi.abi, provider);
      console.log('--------------');
      const academicContractWithSigner = academicContract.connect(signer2);
      console.log(`Log da transação:`);
      console.log(await academicContractWithSigner.transfer(`0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`, 10000))
      console.log('--------------');
      setSigner(signer2);
    }
  
    connect();
  }, [])

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
