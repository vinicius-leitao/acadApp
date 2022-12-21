// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./AcademicTypes.sol";

interface IDisciplinaContract{

    function inserirDisciplina(uint id, string memory nome, address professor, uint idProfessor) external;

    function setDisciplina(uint id, Disciplina memory disciplina) external;

    function getDisciplinaById(uint id) external view returns (Disciplina memory);
}
