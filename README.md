# 📚 Controle de Projetos Escolar

Sistema web para controle de turmas, alunos e projetos escolares, desenvolvido com HTML, CSS e JavaScript, utilizando JSON-server para simular uma API REST.

## 🎯 Objetivo

Facilitar o gerenciamento de projetos escolares em turmas específicas, permitindo o cadastro e organização de alunos e grupos, controle de notas e regras específicas de participação.

---

## 🧰 Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- JSON-server (v0.17)
- Bootstrap 5

---

## 🗃️ Estrutura do Projeto

controle-projetos/ 
├── index.html 
├── css/ 
│ └── estilo.css 
├── js/ 
│ └── scripts.js 
├── db.json 
└── README.md


---

## 🧪 Funcionalidades

### ✅ Lista de Turmas
- Exibe turmas em cards.
- Permite cadastrar, editar e excluir turmas.
- Acesso à página específica da turma.

### ✅ Turma Específica
- Cadastro em lote de alunos.
- Listagem de alunos e projetos.
- Cadastro de novos projetos.
- Exclusão de alunos e projetos.

### ✅ Regras de Negócio
- Alunos podem estar presentes em mais de uma turma.
- Um aluno **não pode** estar em mais de um projeto dentro da mesma turma.

---

## 🧠 Estrutura de Dados

### 🔹 Turma

```json
{
  "id": 1,
  "nome": "Turma A",
  "campus": "Unidade 1",
  "numeroTurma": 101,
  "disciplina": "Projeto Integrador",
  "projetos": [ ... ],
  "alunosTurma": [ ... ],
  "alunosSemProjeto": [ ... ]
}
###🔹 Projeto
{
  "nome": "Sistema de Biblioteca",
  "descricao": "App para gerenciamento de livros.",
  "alunosProjeto": [ ... ],
  "nota1": 8,
  "nota2": 9,
  "media": 8.4
}
### 🔹 Aluno
{
  "id": 1001,
  "ra": "1234567",
  "nomeCompleto": "Maria Souza",
  "nomeSocial": "Maria"
}
```
🧮 Cálculo da Média do Projeto
A média do projeto é calculada de forma ponderada:
Média = (Nota1 * 0.6) + (Nota2 * 0.4)

▶️ Como Executar

1 - Clone o repositório:
git clone https://github.com/seu-usuario/controle-projetos.git

2 - Instale o JSON-server globalmente (caso ainda não tenha):
npm install -g json-server

3 - Inicie o servidor:
json-server --watch db.json
Abra o index.html no navegador.
