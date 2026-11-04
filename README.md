# Projeto Loja

Aplicação de loja com frontend em React, backend em Java com Spring Boot e banco de dados H2.

## Pré-requisitos

Antes de executar o projeto, instale:

- Java 17 ou superior
- Maven
- Node.js
- npm

## Como executar o backend

Abra o terminal na pasta do projeto e execute:

```bash
cd backend
mvn spring-boot:run
```

O backend iniciará em:

```text
http://localhost:8080
```

## Como executar o frontend

Em outro terminal, na pasta do projeto, execute:

```bash
cd frontend
npm install
npm run dev
```

O frontend iniciará em:

```text
http://localhost:5173
```

## Login de teste

Utilize os dados abaixo para acessar o sistema:

```text
E-mail: cliente@hotmail.com
Senha: 123
```

## Banco de dados H2

Com o backend em execução, acesse:

```text
http://localhost:8080/h2-console
```

Preencha os dados de conexão:

```text
JDBC URL: jdbc:h2:file:./data/projetoed
Usuário: sa
Senha: deixe em branco
```

## Estrutura do projeto

```text
frontend/  Interface desenvolvida em React.
backend/   API desenvolvida em Java com Spring Boot.
```

## Funcionalidades

- Login do cliente.
- Listagem de produtos.
- Consulta dos detalhes do produto.
- Visualização de produtos relacionados.
- Navegação entre páginas.
- Registro de compras.
- Histórico de navegação com pilha.
- Pedidos organizados com fila.

## Encerrando o projeto

Pressione `Ctrl + C` nos terminais do frontend e do backend.
