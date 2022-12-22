const { expect, assert } = require("chai");
const {
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");

describe("Academic", function () {

    // this.beforeEach(() => {
        
    // })
    
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

        return {academic, alunoContract, professorContract, disciplinaContract};
    }



    // describe("Academic Contract", function () {

    //     // it("Inserir Aluno should revert for a discipline without a professor", async function () {
    //     //     const { professorContract } = await loadFixture(deployContracts);

    //     //     await expect(professorContract.inserirNota(0, 0, 0)).to.be.revertedWith(
    //     //         "Disciplina sem professor"
    //     //     );
    //     // });

    //     it("Should a professor be able to insert a grade", async function () {
    //         const { academic, alunoContract, professorContract } = await loadFixture(deployContracts);
    //         const [owner, professor, otherAccount] = await hre.ethers.getSigners();

    //         await academic.inserirProfessor(1, "Diogo");
    //         await alunoContract.inserirAluno(1, "Vini");
    //         await alunoContract.inserirAluno(2, "Lucas");
    //         await academic.inserirDisciplina(1, "Blockchain", professor.address, 1);
    //         await academic.abrirLancamentoNota();

    //         await professorContract.inserirNota(1, 1, 8);
    //         await professorContract.inserirNota(2, 1, 6);

    //         const [alunos, notas] = await professorContract.listarNotasDisciplina(1);
    //         console.log(alunos, notas)
    //         expect(alunos[0].nome).to.equal("Vini");
    //         expect(notas[0]).to.equal(8);
    //         expect(alunos[1].nome).to.equal("Lucas");
    //         expect(notas[1]).to.equal(6);

    //     });
        

    // });

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

            // TODO: Consertar problema de aluno não inserido
            const { academic, alunoContract, professorContract } = await loadFixture(deployContracts);
            const [owner, professor, otherAccount] = await hre.ethers.getSigners();

            await academic.inserirProfessor(1, "Diogo");
            await alunoContract.inserirAluno(1, "Vini");
            await alunoContract.inserirAluno(2, "Lucas");
            console.log(await alunoContract.getAlunoById(1))
            await academic.inserirDisciplina(1, "Blockchain", professor.address, 1);
            await academic.abrirLancamentoNota();

            await professorContract.inserirNota(1, 1, 8);
            await professorContract.inserirNota(2, 1, 6);

            const [alunos, notas] = await professorContract.listarNotasDisciplina(1);
            console.log(alunos, notas)
            expect(alunos[0].nome).to.equal("Vini");
            expect(notas[0]).to.equal(8);
            expect(alunos[1].nome).to.equal("Lucas");
            expect(notas[1]).to.equal(6);
        });

        it("Should set a valid professor", async function () {
            const { academic, professorContract } = await loadFixture(deployContracts);
            const [professor] = await hre.ethers.getSigners();

            const newProfessor = {id: 1, nome: "Diogo"}
            await professorContract.setProfessor(1, newProfessor);
            const result = await professorContract.getProfessor(1);
            
            expect(result.nome).to.equal(newProfessor.nome);
            expect(result.id).to.equal(newProfessor.id)
        });

    });

});