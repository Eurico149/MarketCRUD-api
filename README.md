# MarketCRUD
Um simples CRUD de mercadorias e usuarios, com implementacao voltada para apredizado e portifolio.

## Deploy
O projeto fullstack esta hospedado no meu homelab, e pode ser acessado atraves do seguinte link: [MarketCRUD](https://mc.euricopersonal.info/) <br>
Para mais informacoes sobre o frontend e como rodar fullstack localmente, acesse o repositorio: [MarketCRUD-front](https://github.com/Eurico149/MarketCRUD-front.git)

## Tecnologias 🛠
<ul>
    <li>NodeJS</li>
    <li>MongoDB</li>
    <li>Express</li>
    <li>Docker</li>
    <li>Nginx</li>
    <li>Redis</li>
</ul>

## Funcionalidades 📌
Em resumo MarketCRUD é uma API feita em NodeJs e Express que gerencia Usuarios e suas Mercadorias.
Esse projeto tem forte uso de Docker, contendo Dockers Nginx, Mongo, Redis
e o da propria aplicacao. <br>
O Nginx foi utilizado como proxy reverso para balancear a carga das possiveis instancias da API.
O docker Redis serve para gerenciar o cache do sistema, com o intuito de ter resultados de consultas mais rapido.

## Como Rodar 🚀
```
# Clone o Repositorio
git clone https://github.com/Eurico149/MarketCRUD
cd MarketCRUD

# Inicie os dockers
docker compose up --build --scale app=2
```
<p>Certifique-se de criar um arquivo `.env` na raiz do projeto, com as variaveis de ambiente necessarias.</p>

<p>É possivel tambem testar o projeto utilizando o Insomnia, que ja contem as rotas e exemplos de uso, apenas 
importando o arquivo `Insomnia_workspace.json` no Insomnia.</p>

## Estrutura 📁
```
MarketCRUD/
├─── nginx/
├─── src/
│   ├─── conn/
│   ├─── models/
│   ├─── routes/
│   └─── token/
├── .env
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── index.js
├── Insomnia_workspace.json
├── package.json
├── package-lock.json
└── README.md
```
<hr>
