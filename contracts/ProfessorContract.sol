// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./IProfessorContract.sol";
import "./IAlunoContract.sol";
import "./IDisciplinaContract.sol";
import "./AcademicTypes.sol";
import "./Academic.sol";
import "hardhat/console.sol";

contract ProfessorContract is IProfessorContract {
    mapping(uint256 => Professor) professorById;
    mapping(uint256 => mapping(uint256 => uint8)) alunoIdToDisciplinaIdToNota;
    mapping(uint256 => Disciplina) disciplinaById;
    mapping(uint256 => uint256[]) alunosByDisciplina;

    address owner;

    address private _academicContractAddr;
    address private _alunoContractAddr;
    address private _disciplinaContractAddr;

    modifier onlyOwner() {
        require(msg.sender == owner, "Nao autorizado");
        _;
    }

    modifier onlyProfessor(uint256 disciplinaId) {
        require(
            address(
                IDisciplinaContract(_disciplinaContractAddr)
                    .getDisciplinaById(disciplinaId)
                    .professor
            ) != address(0),
            "Disciplina sem professor"
        );
        _;
    }

    constructor(
        address academicContractAddr,
        address alunoContractAddr,
        address disciplinaContractAddr
    ) {
        _academicContractAddr = academicContractAddr;
        _alunoContractAddr = alunoContractAddr;
        _disciplinaContractAddr = disciplinaContractAddr;
        owner = msg.sender;
    }


    function setProfessor(uint256 id, Professor memory professor)
        public
        override
        onlyOwner
    {
        professorById[id] = professor;
    }

    function inserirNota(
        uint256 alunoId,
        uint256 disciplinaId,
        uint8 nota
    ) public override onlyProfessor(disciplinaId) {
        require(
            bytes(IAlunoContract(_alunoContractAddr).getAlunoById(alunoId).nome)
                .length != 0,
            "Aluno nao existente!"
        );
         require(
            bytes(IDisciplinaContract(_disciplinaContractAddr).getDisciplinaById(disciplinaId).nome)
                .length != 0,
            "Disciplina nao existente!"
        );
        require(
            Academic(_academicContractAddr).etapa() == Periodo.LANCAMENTO_NOTAS,
            "Fora do periodo de lancamento de notas!"
        );

        alunoIdToDisciplinaIdToNota[alunoId][disciplinaId] = nota;
        alunosByDisciplina[disciplinaId].push(alunoId);
    }

    function listarNotasDisciplina(uint256 disciplinaId)
        public
        view
        override
        returns (Aluno[] memory, uint8[] memory)
    {
        uint256 numAlunos = alunosByDisciplina[disciplinaId].length;

        Aluno[] memory alunos = new Aluno[](numAlunos);
        uint8[] memory notas = new uint8[](numAlunos);

        for (uint256 i = 0; i < numAlunos; i++) {
            uint256 alunoId = alunosByDisciplina[disciplinaId][i];

            alunos[i] = IAlunoContract(_alunoContractAddr).getAlunoById(
                alunoId
            );
            notas[i] = alunoIdToDisciplinaIdToNota[alunoId][disciplinaId];
        }
        return (alunos, notas);
    }
}
