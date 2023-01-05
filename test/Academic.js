const { expect, assert } = require("chai");
const {
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("hardhat");

describe("Academic", function () {

    async function deployContracts() {
        const Academic = await hre.ethers.getContractFactory("Academic");
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
        const professorContract = await ProfessorContract.deploy(academic.address);
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
        
        const resultProfessorAluno = await professorContract.setAlunoContractAddress(alunoContract.address)
        await resultProfessorAluno.wait(1)

        const resultProfessorDisciplina = await professorContract.setDisciplinaContractAddress(disciplinaContract.address)
        await resultProfessorDisciplina.wait(1)
        
        const resultAlunoDisciplina = await alunoContract.setDisciplinaContractAddress(disciplinaContract.address);
        await resultAlunoDisciplina.wait(1);
        
        const resultDisciplinaProfessor = await disciplinaContract.setProfessorContractAddress(professorContract.address)
        await resultDisciplinaProfessor.wait(1)
      
        const resultDisciplinaAluno = await disciplinaContract.setAlunoContractAddress(alunoContract.address)
        await resultDisciplinaAluno.wait(1)

        console.log(
            `Deploy finished with success!`
        );

        return {academic, alunoContract, professorContract, disciplinaContract, academicToken, academicCertificate};
    }

    describe("Academic Contract", function () {

        it("Should not a non-admin register a student", async function () {
            const { academic, alunoContract, disciplinaContract, professorContract } = await loadFixture(deployContracts);

            const signers = await hre.ethers.getSigners()
            const professorAddr = signers[19].address
            professorSigner = await ethers.getSigner(professorAddr)
            
            await expect(academic.connect(professorSigner).setAlunoContractAddress(alunoContract.address)).to.be.revertedWith('Somente o admin pode concluir essa operacao. Transacao revertida.');
            await expect(academic.connect(professorSigner).setDisciplinaContractAddress(disciplinaContract.address)).to.be.revertedWith('Somente o admin pode concluir essa operacao. Transacao revertida.');
            await expect(academic.connect(professorSigner).setProfessorContractAddress(professorContract.address)).to.be.revertedWith('Somente o admin pode concluir essa operacao. Transacao revertida.');
            await expect(academic.connect(professorSigner).abrirLancamentoNota()).to.be.revertedWith('Somente o admin pode concluir essa operacao. Transacao revertida.');
            await expect(academic.connect(professorSigner).fecharPeriodo()).to.be.revertedWith('Somente o admin pode concluir essa operacao. Transacao revertida.');
            await expect(academic.connect(professorSigner).abrirInscricoes()).to.be.revertedWith('Somente o admin pode concluir essa operacao. Transacao revertida.');
        });

        
    });

    describe("Aluno Contract", function () {

        it("Should register and get a valid student", async function () {
            const { alunoContract } = await loadFixture(deployContracts);

            await alunoContract.inserirAluno(1, "Diogo", '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc');
            const aluno = await alunoContract.getAlunoById(1);
            expect(aluno.nome).to.equal("Diogo");
            expect(aluno.id).to.equal(1)
        });

        it("Should not register a student, when is out of registration period", async function () {
            const { academic, alunoContract } = await loadFixture(deployContracts);
            await academic.abrirLancamentoNota();
            await expect(alunoContract.inserirAluno(1, "Diogo", "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc")).to.be.revertedWith('Fora do periodo de inscricao de aluno/professores. Transacao revertida');
        });

        it("Should not register a student with invalid id", async function () {
            const { alunoContract } = await loadFixture(deployContracts);
            await expect(alunoContract.inserirAluno(0, "Diogo", "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc")).to.be.revertedWith('Necessario um id de aluno');
        });

        it("Should not register a student in discipline, when the signer isn't a student.", async function () {

            const { professorContract, alunoContract, disciplinaContract } = await loadFixture(deployContracts);

            const signers = await hre.ethers.getSigners()
            const professorAddr = signers[19].address
            const aluno1Addr = signers[18].address
            await professorContract.inserirProfessor(1, "Diogo", professorAddr);
            await alunoContract.inserirAluno(1, "Vini", aluno1Addr);
            await disciplinaContract.inserirDisciplina(1, "Blockchain", professorAddr, 1);


            professorSigner = await ethers.getSigner(professorAddr)
            aluno1Signer = await ethers.getSigner(aluno1Addr)
            
            await expect(alunoContract.connect(professorSigner).inscreverDisciplina(1, 1)).to.be.revertedWith('Apenas o proprio aluno pode realizar essa operacao. Transacao revertida');

        });

        it("Should not a non-admin register a student", async function () {
            const { alunoContract } = await loadFixture(deployContracts);

            const signers = await hre.ethers.getSigners()
            const professorAddr = signers[19].address
            professorSigner = await ethers.getSigner(professorAddr)
            await expect(alunoContract.connect(professorSigner).inserirAluno(1, "Diogo", '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc')).to.be.revertedWith('Nao autorizado. Apenas o Admin pode realizar concluir essa operacao. Transacao revertida.');
        });

        it("Should not a student register in an invalid discipline", async function () {
            const { alunoContract } = await loadFixture(deployContracts);

            const signers = await hre.ethers.getSigners()
            const aluno1Addr = signers[18].address
            aluno1Signer = await ethers.getSigner(aluno1Addr)
            await alunoContract.inserirAluno(1, "Diogo", aluno1Addr)
            await expect(alunoContract.connect(aluno1Signer).inscreverDisciplina(1,2)).to.be.revertedWith('Disciplina inexistente. Transacao revertida.');
        });

    });

    describe("Disciplina Contract", function () {

        it("Should register and get a valid discipline", async function () {
            const { disciplinaContract, professorContract } = await loadFixture(deployContracts);
            const signers = await hre.ethers.getSigners()
            const professorAddr = signers[19].address

            
            await professorContract.inserirProfessor(1, "Diogo", professorAddr);
            await disciplinaContract.inserirDisciplina(1, "Blockchain", professorAddr, 1);
            const disciplina = await disciplinaContract.getDisciplinaById(1);
            
            expect(disciplina.id).to.equal(1)
            expect(disciplina.nome).to.equal("Blockchain");
            expect(disciplina.professor).to.equal(professorAddr)
            expect(disciplina.idProfessor).to.equal(1);
        });

        it("Should not register a discipline, when is out of registration period", async function () {
            const { academic, disciplinaContract, professorContract } = await loadFixture(deployContracts);

            const signers = await hre.ethers.getSigners()
            const professorAddr = signers[19].address

            await professorContract.inserirProfessor(1, "Diogo", professorAddr);
            await academic.abrirLancamentoNota();
            await expect(disciplinaContract.inserirDisciplina(1, "Blockchain", professorAddr, 1)).to.be.revertedWith('Fora do periodo de inscricao de aluno');
        });

        it("Should not register a discipline, when professor is invalid", async function () {
            const { disciplinaContract } = await loadFixture(deployContracts);

            const signers = await hre.ethers.getSigners()
            const professorAddr = signers[19].address

            await expect(disciplinaContract.inserirDisciplina(1, "Blockchain", professorAddr, 1)).to.be.revertedWith('Professor nao existente');
        });

        it("Should not a non-admin set discipline contract", async function () {
            const {alunoContract, disciplinaContract} = await loadFixture(deployContracts);

            const signers = await hre.ethers.getSigners()
            const professorAddr = signers[19].address
            professorSigner = await ethers.getSigner(professorAddr)
            
            
            await expect(disciplinaContract.connect(professorSigner).setAlunoContractAddress(alunoContract.address)).to.be.revertedWith('Nao autorizado. Apenas o Admin pode realizar concluir essa operacao. Transacao revertida.');
        });

        it("Should not a non-admin set professor contract", async function () {
            const {professorContract, disciplinaContract} = await loadFixture(deployContracts);

            const signers = await hre.ethers.getSigners()
            const professorAddr = signers[19].address
            professorSigner = await ethers.getSigner(professorAddr)
            
            
            await expect(disciplinaContract.connect(professorSigner).setProfessorContractAddress(professorContract.address)).to.be.revertedWith('Nao autorizado. Apenas o Admin pode realizar concluir essa operacao. Transacao revertida.');
        });

        it("Should not a non-admin insert a discipline", async function () {
            const {professorContract, disciplinaContract} = await loadFixture(deployContracts);

            const signers = await hre.ethers.getSigners()
            const professorAddr = signers[19].address
            professorSigner = await ethers.getSigner(professorAddr)
            
            
            await expect(disciplinaContract.connect(professorSigner).inserirDisciplina(1, 'Blockchain', professorAddr, 1)).to.be.revertedWith('Nao autorizado. Apenas o Admin pode realizar concluir essa operacao. Transacao revertida.');
        });
    

        it("Should not insert a discipline, when the professor address and professor id is not the same professor", async function () {
            const {professorContract, disciplinaContract} = await loadFixture(deployContracts);

            const signers = await hre.ethers.getSigners()
            const professorAddr = signers[19].address
            const professor2Addr = signers[18].address
            await professorContract.inserirProfessor(1, "Diogo", professorAddr)
            professorSigner = await ethers.getSigner(professorAddr)
            
            
            await expect(disciplinaContract.inserirDisciplina(1, 'Blockchain', professor2Addr, 1)).to.be.revertedWith('O endereco do professor vinculado ao id de professor fornecido nao bate. Transacao revertida');
        });

        it("Should not a non-admin insert a discipline", async function () {
            const {professorContract, disciplinaContract, alunoContract} = await loadFixture(deployContracts);

            const signers = await hre.ethers.getSigners()
            const professorAddr = signers[19].address
            const aluno1Addr = signers[18].address
            const aluno2Addr = signers[17].address

            await professorContract.inserirProfessor(1, "Diogo", professorAddr);
            await alunoContract.inserirAluno(1, "Vini", aluno1Addr);
            await alunoContract.inserirAluno(2, "Lucas", aluno2Addr);
    
            await disciplinaContract.inserirDisciplina(1, "Blockchain", professorAddr, 1);

            aluno1Signer = await ethers.getSigner(aluno1Addr)

            await expect(alunoContract.connect(aluno1Signer).inscreverDisciplina(1, 4)).to.be.revertedWith('Disciplina inexistente. Transacao revertida.')
        });

    });


    describe("Professor Contract", function () {

        it("Should a professor be able to insert a grade", async function () {

            const { academic, professorContract, alunoContract, disciplinaContract } = await loadFixture(deployContracts);

            const signers = await hre.ethers.getSigners()
            const professorAddr = signers[19].address
            const aluno1Addr = signers[18].address
            const aluno2Addr = signers[17].address

            await academic.abrirInscricoes()
            await professorContract.inserirProfessor(1, "Diogo", professorAddr);
            await alunoContract.inserirAluno(1, "Vini", aluno1Addr);
            await alunoContract.inserirAluno(2, "Lucas", aluno2Addr);
    
            await disciplinaContract.inserirDisciplina(1, "Blockchain", professorAddr, 1);
            await academic.abrirLancamentoNota();

            professorSigner = await ethers.getSigner(professorAddr)
            aluno1Signer = await ethers.getSigner(aluno1Addr)
            aluno2Signer = await ethers.getSigner(aluno2Addr)

            

            await alunoContract.connect(aluno1Signer).inscreverDisciplina(1, 1);
            await alunoContract.connect(aluno2Signer).inscreverDisciplina(2, 1);

            await professorContract.connect(professorSigner).inserirNota(1, 1, 8);
            await professorContract.connect(professorSigner).inserirNota(2, 1, 6);

            
            const [alunos, notas] = await professorContract.connect(professorSigner).listarNotasDisciplina(1);
            console.log(await professorContract.connect(professorSigner).listarNotasDisciplina(1))

            await academic.fecharPeriodo()
            
            expect(alunos[0].nome).to.equal("Vini");
            expect(notas[0]).to.equal(8);
            expect(alunos[1].nome).to.equal("Lucas");
            expect(notas[1]).to.equal(6);

        });


        it("Should not a non-admin register a professor", async function () {

            const { professorContract } = await loadFixture(deployContracts);

            const signers = await hre.ethers.getSigners()
            const professorAddr = signers[19].address
            const aluno1Addr = signers[18].address
            const aluno2Addr = signers[17].address

            professorSigner = await ethers.getSigner(professorAddr)
            aluno1Signer = await ethers.getSigner(aluno1Addr)
            aluno2Signer = await ethers.getSigner(aluno2Addr)

            await expect(professorContract.connect(professorSigner).inserirProfessor(1, "Diogo", professorAddr)).to.be.revertedWith('Apenas o admin pode realizar essa operacao. Transacao revertida');
        });

        it("Should not a non-professor be able to list a grade", async function () {

            const { academic, professorContract, alunoContract, disciplinaContract } = await loadFixture(deployContracts);

            const signers = await hre.ethers.getSigners()
            const professorAddr = signers[19].address
            const aluno1Addr = signers[18].address
            const aluno2Addr = signers[17].address

            await academic.abrirInscricoes()
            await professorContract.inserirProfessor(1, "Diogo", professorAddr);
            await alunoContract.inserirAluno(1, "Vini", aluno1Addr);
            await alunoContract.inserirAluno(2, "Lucas", aluno2Addr);
    
            await disciplinaContract.inserirDisciplina(1, "Blockchain", professorAddr, 1);
            await academic.abrirLancamentoNota();

            professorSigner = await ethers.getSigner(professorAddr)
            aluno1Signer = await ethers.getSigner(aluno1Addr)
            aluno2Signer = await ethers.getSigner(aluno2Addr)

            

            await alunoContract.connect(aluno1Signer).inscreverDisciplina(1, 1);
            await alunoContract.connect(aluno2Signer).inscreverDisciplina(2, 1);

            await professorContract.connect(professorSigner).inserirNota(1, 1, 8);
            await professorContract.connect(professorSigner).inserirNota(2, 1, 6);

            await expect(professorContract.connect(aluno1Signer).listarNotasDisciplina(1)).to.be.revertedWith('Apenas o professor da disciplina pode realizar essa operacao. Transacao revertida');
        });

        it("Should not a non-professor be able to insert a grade", async function () {

            const { academic, professorContract, alunoContract, disciplinaContract } = await loadFixture(deployContracts);

            const signers = await hre.ethers.getSigners()
            const professorAddr = signers[19].address
            const aluno1Addr = signers[18].address
            const aluno2Addr = signers[17].address

            await academic.abrirInscricoes()
            await professorContract.inserirProfessor(1, "Diogo", professorAddr);
            await alunoContract.inserirAluno(1, "Vini", aluno1Addr);
            await alunoContract.inserirAluno(2, "Lucas", aluno2Addr);
    
            await disciplinaContract.inserirDisciplina(1, "Blockchain", professorAddr, 1);
            await academic.abrirLancamentoNota();

            professorSigner = await ethers.getSigner(professorAddr)
            aluno1Signer = await ethers.getSigner(aluno1Addr)
            aluno2Signer = await ethers.getSigner(aluno2Addr)

            await alunoContract.connect(aluno1Signer).inscreverDisciplina(1, 1);
            await alunoContract.connect(aluno2Signer).inscreverDisciplina(2, 1);

            await expect(professorContract.connect(aluno1Signer).inserirNota(1, 1, 8)).to.be.revertedWith('Apenas o professor da disciplina pode realizar essa operacao. Transacao revertida');
        });

        it("Should not insert a grade of a unexistent student", async function () {
            const { academic, professorContract, alunoContract, disciplinaContract } = await loadFixture(deployContracts);

            const signers = await hre.ethers.getSigners()
            const professorAddr = signers[19].address
            const aluno1Addr = signers[18].address
            await professorContract.inserirProfessor(1, "Diogo", professorAddr);
            await alunoContract.inserirAluno(1, "Vini", aluno1Addr);
    
            await disciplinaContract.inserirDisciplina(1, "Blockchain", professorAddr, 1);
            await academic.abrirLancamentoNota();

            professorSigner = await ethers.getSigner(professorAddr)
            aluno1Signer = await ethers.getSigner(aluno1Addr)

            await alunoContract.connect(aluno1Signer).inscreverDisciplina(1, 1);

            await expect(professorContract.connect(professorSigner).inserirNota(2, 1, 8)).to.be.revertedWith('Aluno nao existente!');
        });
        

        it("Should not insert a grade when period isn't lancamento_notas", async function () {

            const { professorContract, disciplinaContract, alunoContract } = await loadFixture(deployContracts);

            const signers = await hre.ethers.getSigners()
            const professorAddr = signers[19].address
            const alunoAddr = signers[18].address
            await professorContract.inserirProfessor(1, "Diogo", professorAddr);
            await disciplinaContract.inserirDisciplina(1, "Blockchain", professorAddr, 1);
            await alunoContract.inserirAluno(1, "Vinicius", alunoAddr);

            professorSigner = await ethers.getSigner(professorAddr)
            await expect(professorContract.connect(professorSigner).inserirNota(1,1,8)).to.be.revertedWith('Fora do periodo de lancamento de notas!')
        });

        it("Should not register a professor, when is out of register period", async function () {

            const { professorContract, academic } = await loadFixture(deployContracts);

            const signers = await hre.ethers.getSigners()
            const professorAddr = signers[19].address
            const aluno1Addr = signers[18].address
            const aluno2Addr = signers[17].address

            professorSigner = await ethers.getSigner(professorAddr)
            aluno1Signer = await ethers.getSigner(aluno1Addr)
            aluno2Signer = await ethers.getSigner(aluno2Addr)

            await academic.fecharPeriodo()
            await expect(professorContract.inserirProfessor(1, "Diogo", professorAddr)).to.be.revertedWith('Fora do periodo de inscricao de alunos/professores!');
        });

        it("Should not a non-admin set disciplina contract", async function () {
            const {professorContract, disciplinaContract} = await loadFixture(deployContracts);

            const signers = await hre.ethers.getSigners()
            const professorAddr = signers[19].address
            professorSigner = await ethers.getSigner(professorAddr)
            
            
            await expect(professorContract.connect(professorSigner).setDisciplinaContractAddress(disciplinaContract.address)).to.be.revertedWith('Apenas o admin pode realizar essa operacao. Transacao revertida');
        });

        it("Should not a non-admin set aluno contract", async function () {
            const {professorContract, alunoContract} = await loadFixture(deployContracts);

            const signers = await hre.ethers.getSigners()
            const professorAddr = signers[19].address
            professorSigner = await ethers.getSigner(professorAddr)
            
            
            await expect(professorContract.connect(professorSigner).setAlunoContractAddress(alunoContract.address)).to.be.revertedWith('Apenas o admin pode realizar essa operacao. Transacao revertida');
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