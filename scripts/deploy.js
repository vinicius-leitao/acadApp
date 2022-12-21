// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const Academic = await hre.ethers.getContractFactory("Academic");
  const academic = await Academic.deploy();
  await academic.deployed();

  console.log(`Academic contract deployed to ${academic.address}`);

  const AlunoContract = await hre.ethers.getContractFactory("AlunoContract");
  const alunoContract = await AlunoContract.deploy(academic.address);
  await alunoContract.deployed();
  console.log(`AlunoContract contract deployed to ${alunoContract.address}`);

  const resultAluno = await academic.setAlunoContractAddress(
    alunoContract.address
  );
  await resultAluno.wait(1);

  const DisciplinaContract = await hre.ethers.getContractFactory(
    "DisciplinaContract"
  );
  const disciplinaContract = await DisciplinaContract.deploy(academic.address);
  await disciplinaContract.deployed();
  console.log(
    `DisciplinaContract contract deployed to ${disciplinaContract.address}`
  );

  const resultDisciplina = await academic.setDisciplinaContractAddress(
    disciplinaContract.address
  );
  await resultDisciplina.wait(1);

  const ProfessorContract = await hre.ethers.getContractFactory(
    "ProfessorContract"
  );
  const professorContract = await ProfessorContract.deploy(academic.address, alunoContract.address, disciplinaContract.address);
  await professorContract.deployed();
  console.log(
    `ProfessorContract contract deployed to ${professorContract.address}`
  );

  const resultProfessor = await academic.setProfessorContractAddress(
    professorContract.address
  );
  await resultProfessor.wait(1);

  const AcademicToken = await hre.ethers.getContractFactory("AcademicToken");
  const academicToken = await AcademicToken.deploy();
  await academicToken.deployed();
  console.log(`Academic token deployed to ${academicToken.address}!`);

  const AcademicCertificate = await hre.ethers.getContractFactory(
    "AcademicCertificate"
  );
  const academicCertificate = await AcademicCertificate.deploy();
  await academicCertificate.deployed();
  console.log(
    `Academic certificate contract deployed to ${academicCertificate.address}!`
  );

  console.log(`Deploy finished with success!`);

  const resultInserirProfessor = await academic.inserirProfessor(
    1,
    "Diogo"
  );
  await resultInserirProfessor.wait(1);
  const resultInserirProfessor2 = await academic.inserirProfessor(
    2,
    "Myrna"
  );
  await resultInserirProfessor2.wait(1);
  console.log(await academic.getProfessorById(1));
  console.log(await academic.getProfessorById(2));

  const resultInserirDisciplina = await disciplinaContract.inserirDisciplina(
    1,
    "Blockchain",
    "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
    1
  );
  await resultInserirDisciplina.wait(1);
  console.log(await disciplinaContract.getDisciplinaById(1));

  const resultInserirDisciplina2 = await disciplinaContract.inserirDisciplina(
    2,
    "EDA",
    "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
    2
  );
  await resultInserirDisciplina2.wait(1);
  console.log(await disciplinaContract.getDisciplinaById(2));

  const resultInserirAluno = await alunoContract.inserirAluno(1, "Vinícius");
  await resultInserirAluno.wait(1);
  console.log(await alunoContract.getAlunoById(1));

  const resultInserirAluno2 = await alunoContract.inserirAluno(2, "Lucas");
  await resultInserirAluno2.wait(1);
  console.log(await alunoContract.getAlunoById(2));

  const resultAbrirNotas = await academic.abrirLancamentoNota();
  await resultAbrirNotas.wait(1);

  const resultInserirNota = await professorContract.inserirNota(1, 1, 5);
  await resultInserirNota.wait(1);
  console.log(resultInserirNota);

  const resultInserirNota2 = await professorContract.inserirNota(2, 1, 7);
  await resultInserirNota2.wait(1);
  console.log(resultInserirNota2);

  const resultListarNotas = await professorContract.listarNotasDisciplina(1);
  console.log(resultListarNotas);
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
