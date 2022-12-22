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

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
