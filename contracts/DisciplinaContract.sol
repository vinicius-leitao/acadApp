// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./AcademicTypes.sol";
import "./Academic.sol";
import "./IDisciplinaContract.sol";
import "./ProfessorContract.sol";

contract DisciplinaContract is IDisciplinaContract{

    mapping(uint => Disciplina) disciplinaById;

    address public owner;

    address _academicContractAddr;
    address _alunoContractAddr;
    address _professorContractAddr;


    modifier onlyAdmin(){
       require(address(msg.sender) == address(owner), "Nao autorizado. Apenas o Admin pode realizar concluir essa operacao. Transacao revertida.");
       _;
    }

    constructor(address academicContractAddr){
       _academicContractAddr = academicContractAddr;
       owner = msg.sender;
    }

    function getDisciplinaById(uint id) public view override returns (Disciplina memory){
        return disciplinaById[id];
    }

    function inserirDisciplina(uint id, string memory nome, address professor, uint idProfessor) onlyAdmin public override {
       require(Academic(_academicContractAddr).etapa() == Periodo.INSCRICAO_ALUNOS_E_PROFESSORES, "Fora do periodo de inscricao de aluno");
       require(bytes(IProfessorContract(_professorContractAddr).getProfessorById(idProfessor).nome).length != 0, "Professor nao existente");
       require(address(IProfessorContract(_professorContractAddr).getProfessorById(idProfessor).professorAddr) == address(professor), "O endereco do professor vinculado ao id de professor fornecido nao bate. Transacao revertida");
       
        disciplinaById[id] = Disciplina(id, nome, professor, idProfessor);
    }

    function setDisciplina(uint id, Disciplina memory disciplina) onlyAdmin public override {
        disciplinaById[id] = disciplina;
    } 

     function setAlunoContractAddress(address alunoContractAddr)
        public
        onlyAdmin
    {
        _alunoContractAddr = alunoContractAddr;
    }

    function setProfessorContractAddress(address professorContractAddr)
        public
        onlyAdmin
    {
        _professorContractAddr = professorContractAddr;
    }
}
