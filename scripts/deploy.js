// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
  const Academic = await hre.ethers.getContractFactory("Academic", await ethers.getSigner('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'));
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
  const professorContract = await ProfessorContract.deploy(academic.address);
  await professorContract.deployed();
  console.log(
    `ProfessorContract contract deployed to ${professorContract.address}`
  );

  const resultProfessorAluno = await professorContract.setAlunoContractAddress(alunoContract.address)
  await resultProfessorAluno.wait(1)

  const resultProfessorDisciplina = await professorContract.setDisciplinaContractAddress(disciplinaContract.address)
  await resultProfessorDisciplina.wait(1)

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

  const resultAlunoDisciplina = await alunoContract.setDisciplinaContractAddress(disciplinaContract.address);
  await resultAlunoDisciplina.wait(1);
  
  const resultDisciplinaProfessor = await disciplinaContract.setProfessorContractAddress(professorContract.address)
  await resultDisciplinaProfessor.wait(1)

  const resultDisciplinaAluno = await disciplinaContract.setAlunoContractAddress(alunoContract.address)
  await resultDisciplinaAluno.wait(1)

  // const resultInserirAluno = await alunoContract.inserirAluno(1, "Vinicius", '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E');

  // const resultInserirProfessor = await professorContract.inserirProfessor(1, 'Diogo', '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65')
  // await professorContract.inserirProfessor(2, 'Myrna', '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc')
  // console.log(resultInserirProfessor)

  // const resultGetProfessor = await professorContract.getProfessorById(1);
  // console.log(await resultGetProfessor)

  
  // const contratoDisciplina1 = disciplinaContract.inserirDisciplina(1, 'Blockchain', '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65', 1)
  
  // const resultAbrirNotas = academic.abrirLancamentoNota();

  // const newAddressSigner = await ethers.getSigner('0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65')
  // const contratoProfessor1 = professorContract.connect(newAddressSigner)
  // // console.log(await contratoProfessor1.inserirNota(1, 1, 5))

  // const contratoDisciplina1 = disciplinaContract.connect(newAddressSigner)
  // console.log(await contratoDisciplina1.inserirDisciplina(1, 'Blockchain', '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199', 1))

  // const inscreverDisciplina = await alunoContract.inscreverDisciplina(1, 1);
  // console.log(await inscreverDisciplina);

  // console.log(await disciplinaContract.getAlunosByDisciplina(1));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
