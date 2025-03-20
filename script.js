// script.js - Manipulação das turmas e integração com JSON-server

// Função para carregar turmas e exibi-las na tela inicial
async function carregarTurmas() {
    const resposta = await fetch('http://localhost:3000/turmas');
    const turmas = await resposta.json();
    const listaTurmas = document.getElementById('lista-turmas');
    listaTurmas.innerHTML = '';

    turmas.forEach(turma => {
        const card = document.createElement('div');
        card.classList.add('turma-card');
        card.innerHTML = `
            <h3>${turma.nome}</h3>
            <p>Campus: ${turma.campus}</p>
            <p>Disciplina: ${turma.disciplina}</p>
            <p>Semestre: ${turma.semestre}º</p>
            <p>Ano: ${turma.ano}</p>
            <button onclick="abrirModalEditar('${turma.id}')">Editar</button>
            <button onclick="excluirTurma('${turma.id}')">Excluir</button>
            <button onclick="verDetalhesTurma('${turma.id}')">Ver Detalhes</button>
        `;
        listaTurmas.appendChild(card);
    });
}

// Função para abrir o modal de cadastro de turma
function abrirModalCadastro() {
    document.getElementById('cadastroModal').style.display = 'flex';
}

// Função para fechar o modal de cadastro de turma
function fecharModalCadastro() {
    document.getElementById('cadastroModal').style.display = 'none';
}

// Função para excluir turma
async function excluirTurma(id) {
    if (!confirm('Tem certeza que deseja excluir esta turma?')) {
        return;
    }
    try {
        const resposta = await fetch(`http://localhost:3000/turmas/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!resposta.ok) {
            throw new Error(`Erro ao excluir: ${resposta.status} - ${resposta.statusText}`);
        }
        alert('Turma excluída com sucesso!');
        carregarTurmas();
    } catch (erro) {
        console.error('Erro ao excluir turma:', erro);
        alert('Não foi possível excluir a turma. Verifique o servidor JSON.');
    }
}

// Função para gerar um ID string sequencial
async function gerarIdTurma() {
    try {
        const resposta = await fetch('http://localhost:3000/turmas');
        const turmas = await resposta.json();

        if (turmas.length === 0) {
            return "1";
        }

        const maxId = Math.max(...turmas.map(turma => isNaN(Number(turma.id)) ? 0 : Number(turma.id)));
        return String(maxId + 1);
    } catch (erro) {
        console.error('Erro ao gerar ID:', erro);
        return String(Math.floor(Math.random() * 10000) + 1);
    }
}

// Função para adicionar aluno na turma
async function adicionarAlunoTurma(turmaId, aluno) {
    try {
        const respostaTurma = await fetch(`http://localhost:3000/turmas/${turmaId}`);
        const turma = await respostaTurma.json();

        // Garante que esses arrays existam
        turma.alunos = turma.alunos || [];
        turma.alunosSemProjeto = turma.alunosSemProjeto || [];

        turma.alunos.push(aluno);
        turma.alunosSemProjeto.push(aluno);

        await fetch(`http://localhost:3000/turmas/${turmaId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(turma)
        });

        alert('Aluno adicionado com sucesso!');
        verDetalhesTurma(turmaId);
    } catch (erro) {
        console.error('Erro ao adicionar aluno:', erro);
        alert('Erro ao adicionar aluno. Verifique o servidor JSON.');
    }
}

// Função para criar um grupo de projeto na turma
async function adicionarProjetoTurma(turmaId, projeto) {
    try {
        const respostaTurma = await fetch(`http://localhost:3000/turmas/${turmaId}`);
        const turma = await respostaTurma.json();

        // Garante que esse array exista
        turma.projetos = turma.projetos || [];

        turma.projetos.push(projeto);

        await fetch(`http://localhost:3000/turmas/${turmaId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(turma)
        });

        alert('Projeto adicionado com sucesso!');
        verDetalhesTurma(turmaId);
    } catch (erro) {
        console.error('Erro ao adicionar projeto:', erro);
        alert('Erro ao adicionar projeto. Verifique o servidor JSON.');
    }
}


// Função para abrir o modal de cadastro de aluno na turma específica
function abrirModalCadastroAluno(turmaId) {
    // Exemplo simples sem modal estilizado
    // Aqui você pode implementar um modal de verdade
    const ra = prompt('Informe o RA do aluno:');
    const nomeCompleto = prompt('Informe o nome completo do aluno:');
    const nomeSocial = prompt('Informe o nome social (opcional):');

    if (!ra || !nomeCompleto) {
        alert('RA e Nome Completo são obrigatórios.');
        return;
    }

    const novoAluno = {
        id: String(Date.now()),
        ra,
        nomeCompleto,
        nomeSocial
    };

    adicionarAlunoTurma(turmaId, novoAluno);
}

// Função para abrir o modal de cadastro de projeto na turma específica
function abrirModalCadastroProjeto(turmaId) {
    // Exemplo simples sem modal estilizado
    const nomeProjeto = prompt('Informe o nome do projeto:');
    const descricaoProjeto = prompt('Informe a descrição do projeto:');

    if (!nomeProjeto || !descricaoProjeto) {
        alert('Nome e descrição do projeto são obrigatórios.');
        return;
    }

    const novoProjeto = {
        nome: nomeProjeto,
        descricao: descricaoProjeto,
        alunos: [],
        nota1: 0,
        nota2: 0,
        media: 0
    };

    adicionarProjetoTurma(turmaId, novoProjeto);
}

/// Função para visualizar detalhes da turma
async function verDetalhesTurma(id) {
    try {
        const idString = String(id);
        const resposta = await fetch(`http://localhost:3000/turmas/${idString}`);
        if (!resposta.ok) {
            throw new Error(`Erro ao buscar turma: ${resposta.status} ${resposta.statusText}`);
        }
        const turma = await resposta.json();

        turma.alunos = turma.alunos || [];
        turma.projetos = turma.projetos || [];

        // Cria a lista de projetos com os botões para adicionar aluno e notas
        const listaProjetosHTML = turma.projetos.map((projeto, index) => {
            // Monta a lista de alunos do projeto
            const alunosNoProjeto = projeto.alunos && projeto.alunos.length > 0
                ? projeto.alunos.map(a => `• ${a.nomeCompleto} (${a.ra})`).join('<br>')
                : 'Sem alunos neste projeto';
            
            return `
                <li>
                    <strong>${projeto.nome}</strong> - ${projeto.descricao}<br>
                    Alunos no projeto:<br>
                    ${alunosNoProjeto}<br>
                    Notas: [Nota1: ${projeto.nota1 || 0}] [Nota2: ${projeto.nota2 || 0}] 
                    Média: ${projeto.media || 0}
                    <br>
                    <button onclick="abrirModalAdicionarAlunoProjeto('${turma.id}', ${index})">Adicionar Aluno</button>
                    <button onclick="abrirModalNotasProjeto('${turma.id}', ${index})">Adicionar/Editar Notas</button>
                </li>
            `;
        }).join('');

        document.getElementById('turmaDetalhes').innerHTML = `
            <div class="turma-detalhes-container">
                <h2>${turma.nome} - ${turma.disciplina}</h2>
                <p><strong>Campus:</strong> ${turma.campus}</p>
                <p><strong>Semestre:</strong> ${turma.semestre}º</p>
                <p><strong>Ano:</strong> ${turma.ano}</p>
                
                <h3>Alunos da Turma</h3>
                <ul id="listaAlunos">
                    ${
                        turma.alunos.length > 0 
                            ? turma.alunos.map(aluno => `<li>${aluno.nomeCompleto} (${aluno.ra})</li>`).join('')
                            : '<p>Sem alunos cadastrados</p>'
                    }
                </ul>
                <button onclick="abrirModalCadastroAluno('${turma.id}')">Adicionar Aluno</button>

                <h3>Projetos</h3>
                <ul id="listaProjetos">
                    ${
                        turma.projetos.length > 0
                            ? listaProjetosHTML
                            : '<p>Sem projetos cadastrados</p>'
                    }
                </ul>
                <button onclick="abrirModalCadastroProjeto('${turma.id}')">Adicionar Projeto</button>
                <button onclick="voltarParaListaTurmas()">Voltar</button>
            </div>
        `;

        document.getElementById('lista-turmas').style.display = 'none';
        document.getElementById('turmaDetalhes').style.display = 'block';
    } catch (erro) {
        console.error('Erro ao carregar detalhes da turma:', erro);
        alert('Não foi possível carregar os detalhes da turma.');
    }
}

function abrirModalAdicionarAlunoProjeto(turmaId, projetoIndex) {
    // Exemplo usando prompt() apenas para testar
    const ra = prompt('Informe o RA do aluno que já está na turma:');
    if (!ra) {
        alert('RA é obrigatório.');
        return;
    }

    adicionarAlunoProjeto(turmaId, projetoIndex, ra);
}

async function adicionarAlunoProjeto(turmaId, projetoIndex, ra) {
    try {
        // Buscar a turma
        const respostaTurma = await fetch(`http://localhost:3000/turmas/${turmaId}`);
        const turma = await respostaTurma.json();

        turma.projetos = turma.projetos || [];
        const projeto = turma.projetos[projetoIndex];
        if (!projeto) {
            alert('Projeto não encontrado.');
            return;
        }

        // Verifica se o aluno já existe na lista de 'alunos' da turma
        // (Opcionalmente, você pode buscar por RA em 'turma.alunos')
        const alunoEncontrado = turma.alunos.find(al => al.ra === ra);

        if (!alunoEncontrado) {
            alert('Esse RA não foi encontrado na turma. Primeiro cadastre o aluno na turma.');
            return;
        }

        // Regra: não pode estar em 2 projetos
        // Verifica em todos os projetos se esse aluno já está
        const alunoJaEmProjeto = turma.projetos.some(p => 
            p.alunos && p.alunos.some(a => a.ra === ra)
        );
        if (alunoJaEmProjeto) {
            alert('Este aluno já está em outro projeto desta turma!');
            return;
        }

        // Adiciona o aluno no projeto
        projeto.alunos = projeto.alunos || [];
        projeto.alunos.push(alunoEncontrado);

        // Atualizar no JSON-server
        const respostaPUT = await fetch(`http://localhost:3000/turmas/${turmaId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(turma)
        });
        if (!respostaPUT.ok) {
            throw new Error(`Erro ao salvar projeto: ${respostaPUT.status} ${respostaPUT.statusText}`);
        }

        alert('Aluno adicionado ao projeto com sucesso!');
        verDetalhesTurma(turmaId); // re-carrega a tela
    } catch (erro) {
        console.error('Erro ao adicionar aluno ao projeto:', erro);
        alert('Não foi possível adicionar o aluno ao projeto.');
    }
}

function abrirModalNotasProjeto(turmaId, projetoIndex) {
    const nota1Str = prompt('Informe a Nota 1:');
    const nota2Str = prompt('Informe a Nota 2:');

    if (!nota1Str || !nota2Str) {
        alert('Ambas as notas são obrigatórias.');
        return;
    }

    const nota1 = Number(nota1Str);
    const nota2 = Number(nota2Str);
    if (isNaN(nota1) || isNaN(nota2)) {
        alert('Notas inválidas.');
        return;
    }

    adicionarNotasProjeto(turmaId, projetoIndex, nota1, nota2);
}

async function adicionarNotasProjeto(turmaId, projetoIndex, nota1, nota2) {
    try {
        const respostaTurma = await fetch(`http://localhost:3000/turmas/${turmaId}`);
        const turma = await respostaTurma.json();

        turma.projetos = turma.projetos || [];
        const projeto = turma.projetos[projetoIndex];
        if (!projeto) {
            alert('Projeto não encontrado.');
            return;
        }

        // Calculando a média: nota1 (peso 0.6), nota2 (peso 0.4)
        const mediaCalculada = (nota1 * 0.6) + (nota2 * 0.4);

        projeto.nota1 = nota1;
        projeto.nota2 = nota2;
        projeto.media = Number(mediaCalculada.toFixed(2)); // arredonda p/ 2 casas

        // Salva no JSON-server
        const respostaPUT = await fetch(`http://localhost:3000/turmas/${turmaId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(turma)
        });
        if (!respostaPUT.ok) {
            throw new Error(`Erro ao atualizar notas do projeto: ${respostaPUT.status} ${respostaPUT.statusText}`);
        }

        alert('Notas adicionadas/atualizadas com sucesso!');
        verDetalhesTurma(turmaId);
    } catch (erro) {
        console.error('Erro ao adicionar notas no projeto:', erro);
        alert('Não foi possível adicionar/atualizar as notas do projeto.');
    }
}




// Função para voltar à lista de turmas
function voltarParaListaTurmas() {
    document.getElementById('turmaDetalhes').style.display = 'none';
    document.getElementById('lista-turmas').style.display = 'block';
}

// Chamada inicial para carregar turmas ao iniciar a aplicação
document.addEventListener('DOMContentLoaded', carregarTurmas);
