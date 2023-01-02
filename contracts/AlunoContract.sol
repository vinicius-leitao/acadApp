// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./AcademicTypes.sol";
import "./Academic.sol";
import "./IAlunoContract.sol";


contract AlunoContract is IAlunoContract{

    mapping(uint => Aluno) alunoById;

    address owner;
    address private _academicContractAddr;

    modifier onlyOwner(){
       require(msg.sender == owner, "Nao autorizado. Apenas o Aluno pode concluir essa operacao.");
       _;
    }

    modifier onlyAdmin(){
       require(address(msg.sender) == address(Academic(_academicContractAddr).owner()), "Nao autorizado. Apenas o Admin pode realizar concluir essa operacao");
       _;
    }

    constructor(address academicContractAddr){
       _academicContractAddr = academicContractAddr;
       owner = msg.sender;
    }

    function getAlunoById(uint id) public view override returns (Aluno memory){
        return alunoById[id];
    }

    function inserirAluno(uint id, string memory nome) onlyAdmin public override {
       require(Academic(_academicContractAddr).etapa() == Periodo.INSCRICAO_ALUNOS_E_PROFESSORES, "Fora do periodo de inscricao de aluno/professores");
       require(id != 0, "Necessario um id de aluno");
       alunoById[id] = Aluno(id, nome);
    }

    function setAluno(uint id, Aluno memory aluno) onlyAdmin public override {
        alunoById[id] = aluno;
    } 
    
}

