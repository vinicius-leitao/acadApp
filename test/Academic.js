const { expect, assert } = require("chai");
const {
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");

describe("Academic", function () {

    async function deployContracts() {
        const AcademicUtils = await hre.ethers.getContractFactory("AcademicUtils");
        const academicUtils = await AcademicUtils.deploy();
        await academicUtils.deployed();
        console.log(
            `AcademicUtils contract deployed to ${academicUtils.address}`
        );

        const Academic = await hre.ethers.getContractFactory("Academic"
        // , {
        //         libraries: {
        //         AcademicUtils: academicUtils.address,
        //         },
        //     }
        );
        const academic = await Academic.deploy();
        await academic.deployed();

        console.log(
            `Academic contract deployed to ${academic.address}`
        );

        const AlunoContract = await hre.ethers.getContractFactory("AlunoContract");
        const alunoContract = await AlunoContract.deploy(academic.address);
        await alunoContract.deployed();
        console.log(
            `AlunoContract contract deployed to ${alunoContract.address}`
        );

        const DisciplinaContract = await hre.ethers.getContractFactory("DisciplinaContract");
        const disciplinaContract = await DisciplinaContract.deploy(academic.address);
        await disciplinaContract.deployed();
        console.log(
            `DisciplinaContract contract deployed to ${disciplinaContract.address}`
        );

        const ProfessorContract = await hre.ethers.getContractFactory("ProfessorContract");
        const professorContract = await ProfessorContract.deploy(academic.address, alunoContract.address, disciplinaContract.address);
        await professorContract.deployed();
        console.log(
            `ProfessorContract contract deployed to ${professorContract.address}`
        );

        const AcademicToken = await hre.ethers.getContractFactory("AcademicToken");
        const academicToken = await AcademicToken.deploy();
        await academicToken.deployed();
        console.log(
            `AcademicToken contract deployed to ${academicToken.address}`
        );

        const AcademicCertificate = await hre.ethers.getContractFactory("AcademicCertificate");
        const academicCertificate = await AcademicCertificate.deploy();
        await academicCertificate.deployed();
        console.log(
            `AcademicCertificate contract deployed to ${academicCertificate.address}`
        );

        const result = await academic.setAlunoContractAddress(alunoContract.address);
        await result.wait(1);
        console.log(
            `Changed AlunoContract address in Academic with success!`
        );

        const resultDisciplina = await academic.setDisciplinaContractAddress(disciplinaContract.address);
        await resultDisciplina.wait(1);
        console.log(
            `Changed DisciplinaContract address in Academic with success!`
        );

        const resultProfessor = await academic.setProfessorContractAddress(professorContract.address);
        await resultProfessor.wait(1);
        console.log(
            `Changed ProfessorContract address in Academic with success!`
        );

        console.log(
            `Deploy finished with success!`
        );

        return {academic, alunoContract, professorContract, disciplinaContract, academicUtils, academicToken, academicCertificate};
    }

    describe("Aluno Contract", function () {

        it("Should register and get a valid student", async function () {
            const { alunoContract } = await loadFixture(deployContracts);

            await alunoContract.inserirAluno(1, "Diogo");
            const aluno = await alunoContract.getAlunoById(1);
            expect(aluno.nome).to.equal("Diogo");
            expect(aluno.id).to.equal(1)
        });

        it("Should not register a student, when is out of registration period", async function () {
            const { academic, alunoContract } = await loadFixture(deployContracts);
            await academic.abrirLancamentoNota();
            await expect(alunoContract.inserirAluno(1, "Diogo")).to.be.revertedWith('Fora do periodo de inscricao de aluno/professores');
        });

        it("Should not register a student with invalid id", async function () {
            const { alunoContract } = await loadFixture(deployContracts);
            await expect(alunoContract.inserirAluno(0, "Diogo")).to.be.revertedWith('Necessario um id de aluno');
        });

        it("Should set a valid student", async function () {
            const { alunoContract } = await loadFixture(deployContracts);

            const newStudent = {id: 2, nome: "Vini"}
            await alunoContract.setAluno(2, newStudent);
            const aluno = await alunoContract.getAlunoById(2);
            expect(aluno.nome).to.equal("Vini");
            expect(aluno.id).to.equal(2)
        });

    });

    describe("Disciplina Contract", function () {

        it("Should register and get a valid discipline", async function () {
            const { academic, disciplinaContract } = await loadFixture(deployContracts);
            const [professor] = await hre.ethers.getSigners();
            
            await academic.inserirProfessor(1, "Diogo");
            await disciplinaContract.inserirDisciplina(1, "Blockchain", professor.address, 1);
            const disciplina = await disciplinaContract.getDisciplinaById(1);
            
            expect(disciplina.id).to.equal(1)
            expect(disciplina.nome).to.equal("Blockchain");
            expect(disciplina.professor).to.equal(professor.address)
            expect(disciplina.idProfessor).to.equal(1);
        });

        it("Should not register a discipline, when is out of registration period", async function () {
            const { academic, disciplinaContract } = await loadFixture(deployContracts);
            const [professor] = await hre.ethers.getSigners();
            await academic.inserirProfessor(1, "Diogo");

            await academic.abrirLancamentoNota();
            await expect(disciplinaContract.inserirDisciplina(1, "Blockchain", professor.address, 1)).to.be.revertedWith('Fora do periodo de inscricao de aluno');
        });

        it("Should not register a discipline, when professor is invalid", async function () {
            const { disciplinaContract } = await loadFixture(deployContracts);
            const [professor] = await hre.ethers.getSigners();

            await expect(disciplinaContract.inserirDisciplina(1, "Blockchain", professor.address, 1)).to.be.revertedWith('Professor nao existente');
        });

        it("Should set a valid discipline", async function () {
            const { disciplinaContract } = await loadFixture(deployContracts);
            const [professor] = await hre.ethers.getSigners();

            const newDiscipline = {id: 1, nome: "Blockchain", professor: professor.address, idProfessor: 1 }
            await disciplinaContract.setDisciplina(2, newDiscipline);
            const disciplina = await disciplinaContract.getDisciplinaById(2);
            expect(disciplina.nome).to.equal("Blockchain");
            expect(disciplina.id).to.equal(1)
        });

    });


    describe("Professor Contract", function () {

        it("Should a professor be able to insert a grade", async function () {

            const { academic, professorContract } = await loadFixture(deployContracts);
            const [professor] = await hre.ethers.getSigners();

            await academic.inserirProfessor(1, "Diogo");
            await academic.inserirAluno(1, "Vini");
            await academic.inserirAluno(2, "Lucas");
            
            await academic.inserirDisciplina(1, "Blockchain", professor.address, 1);
            await academic.abrirLancamentoNota();

            await professorContract.inserirNota(1, 1, 8);
            await professorContract.inserirNota(2, 1, 6);

            const [alunos, notas] = await professorContract.listarNotasDisciplina(1);
            
            expect(alunos[0].nome).to.equal("");
            expect(notas[0]).to.equal(8);
            expect(alunos[1].nome).to.equal("");
            expect(notas[1]).to.equal(6);
        });

        it("Should set a valid professor", async function () {
            const { professorContract } = await loadFixture(deployContracts);

            const newProfessor = {id: 1, nome: "Diogo"}
            await professorContract.setProfessor(1, newProfessor);
            const result = await professorContract.getProfessor(1);
            
            expect(result.nome).to.equal(newProfessor.nome);
            expect(result.id).to.equal(newProfessor.id)
        });


    });



    describe("AcademicUtils library", function () {

        it("Should sum correctly", async function () {
            const { academicUtils } = await loadFixture(deployContracts);
            const result = await academicUtils.soma(1, 3);
            expect(result).to.equal(4);
        });

    });


    describe("AcademicCertificate contract", function () {

        it("Should award certificate", async function () {
            const { academicCertificate } = await loadFixture(deployContracts);
            const [aluno] = await hre.ethers.getSigners();

            const result = await academicCertificate.awardCertificate(aluno.address, "http://www.colegio.com");
            expect(result).to.exist;
        });

    });

});