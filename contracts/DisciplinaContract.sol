// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./AcademicTypes.sol";
import "./Academic.sol";
import "./IDisciplinaContract.sol";
import "./ProfessorContract.sol";

contract DisciplinaContract is IDisciplinaContract{

    mapping(uint => Disciplina) disciplinaById;

    address owner;

    address private _academicContractAddr;


    modifier onlyOwner(){
       require(msg.sender == owner, "Nao autorizado");
       _;
    }

    constructor(address academicContractAddr){
       _academicContractAddr = academicContractAddr;
       owner = msg.sender;
    }

    function getDisciplinaById(uint id) public view override returns (Disciplina memory){
        return disciplinaById[id];
    }

    function inserirDisciplina(uint id, string memory nome, address professor, uint idProfessor) onlyOwner public override {
       require(Academic(_academicContractAddr).etapa() == Periodo.INSCRICAO_ALUNOS_E_PROFESSORES, "Fora do periodo de inscricao de aluno");
       require(bytes(Academic(_academicContractAddr).getProfessorById(idProfessor).nome).length != 0, "Professor nao existente");
       
       disciplinaById[id] = Disciplina(id, nome, professor, idProfessor);
    }

    function setDisciplina(uint id, Disciplina memory disciplina) onlyOwner public override {
        disciplinaById[id] = disciplina;
    } 

}
