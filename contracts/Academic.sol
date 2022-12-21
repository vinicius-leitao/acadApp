// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./AcademicTypes.sol";
import "./IAlunoContract.sol";
import "./IDisciplinaContract.sol";

import "hardhat/console.sol";

/**
 * @title Academic
 * @dev Academic system contract
 */
contract Academic {
    Periodo public etapa;

    mapping(uint256 => mapping(uint256 => uint8)) alunoIdToDisciplinaIdToNota;
    mapping(uint256 => Disciplina) disciplinaById;
    mapping(uint256 => uint256[]) alunosByDisciplina;
    mapping(uint256 => Professor) professorById;
    mapping(uint => Aluno) alunoById;

    address owner;
    address _alunoContractAddr;
    address _disciplinaContractAddr;
    address _professorContractAddr;

    constructor() {
        etapa = Periodo.INSCRICAO_ALUNOS_E_PROFESSORES;
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Nao autorizado");
        _;
    }

    function setAlunoContractAddress(address alunoContractAddr)
        public
        onlyOwner
    {
        _alunoContractAddr = alunoContractAddr;
    }

    function setDisciplinaContractAddress(address disciplinaContractAddr)
        public
        onlyOwner
    {
        _disciplinaContractAddr = disciplinaContractAddr;
    }

    function setProfessorContractAddress(address professorContractAddr)
        public
        onlyOwner
    {
        _professorContractAddr = professorContractAddr;
    }

    function inserirProfessor(uint256 id, string memory nome)
        public
        onlyOwner
    {
        require(
            etapa == Periodo.INSCRICAO_ALUNOS_E_PROFESSORES,
            "Fora do periodo de inscricao de alunos/professores!"
        );
        professorById[id] = Professor(id, nome);
    }
    
    function getProfessorById(uint256 id)
        public
        view
        returns (Professor memory)
    {
        return professorById[id];
    }

    function getDisciplinaById(uint id) public view returns (Disciplina memory){
        return disciplinaById[id];
    }

    function inserirDisciplina(uint id, string memory nome, address professor, uint idProfessor) onlyOwner public {
       require(etapa == Periodo.INSCRICAO_ALUNOS_E_PROFESSORES, "Fora do periodo de inscricao de aluno");
       require(bytes(getProfessorById(idProfessor).nome).length != 0, "Professor nao existente");
       
       disciplinaById[id] = Disciplina(id, nome, professor, idProfessor);
    }

    function getAlunoById(uint id) public view returns (Aluno memory){
        return alunoById[id];
    }

    function inserirAluno(uint id, string memory nome) onlyOwner public  {
       require(etapa == Periodo.INSCRICAO_ALUNOS_E_PROFESSORES, "Fora do periodo de inscricao de aluno/professores");
       require(id != 0, "Necessario um id de aluno");
       alunoById[id] = Aluno(id, nome);
    }

    function abrirLancamentoNota() public onlyOwner {
        etapa = Periodo.LANCAMENTO_NOTAS;
    }
}
