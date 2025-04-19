# MarketCRUD
Um simples CRUD de mercadorias e usuarios, com implementacao voltada para apredizado e portifolio.
<hr>

## Tecnologias 🛠
<ul>
    <li>NodeJS</li>
    <li>MongoDB</li>
    <li>Express</li>
    <li>Docker</li>
    <li>Nginx</li>
    <li>Redis</li>
</ul>
<hr>

## Funcionalidades 📌
Em resumo MarketCRUD é uma API feita em NodeJs e Express que gerencia Usuarios e suas Mercadorias.
Esse projeto tem forte uso de Docker, contendo Dockers Nginx, Mongo, Redis
e o da propria aplicacao.
O Nginx foi utilizado como proxy reverso para balancear a carga em duas instancias da API,
no qual por meio de um escalonador round-robin é distribuido as requisicoes nas duas instancias.
O docker Redis serve para gerenciar o cache do sistema, com o intuito de ter resultados de consultas mais rapido.
<hr>

## Como Rodar 🚀
```
# Clone o Repositorio
git clone https://github.com/Eurico149/MarketCRUD
cd MarketCRUD

# Inicie os dockers
sudo docker compose up --scale app=2
```
<hr>

## Estrutura 📁
```
MarketCRUD/
├─── nginx/
├─── testeNginx/
├─── src/
│   ├─── conn/
│   ├─── models/
│   ├─── routes/
│   └─── token/
├── .env
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── LICENSE
├── index.js
├── package.json
├── package-lock.json
└── README.md
```
<hr>

## Licença 📝
Este projeto está licenciado sob [MIT License]()