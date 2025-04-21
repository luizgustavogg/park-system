# 🚗 Sistema de Gerenciamento de Vagas de Estacionamento

Este é um projeto backend simples para gerenciar vagas de estacionamento, feito com **Node.js**, **Express** e **Prisma ORM**.  
Ele permite **preencher** e **liberar** vagas de estacionamento, além de listar todas as vagas disponíveis ou ocupadas.

---

## 💡 Tecnologias Utilizadas

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- Banco de dados: MySQL (ou outro compatível com Prisma)

---

## 🔥 Funcionalidades

- 🗓️ **Listar Vagas**  
Consulta todas as vagas cadastradas no banco, mostrando se estão ocupadas ou livres.

- 🅿️ **Preencher Vaga**  
Vincula um usuário a uma vaga específica, marcando-a como ocupada.

- ❌ **Liberar Vaga**  
Libera uma vaga já preenchida através do CPF do usuário.

---

## 📂 Rotas da API

### GET `/`
Retorna todas as vagas existentes no banco.

**Exemplo de resposta:**
```json
[
  {
    "vacancy_id": 1,
    "vacancy_available": true,
    "user": null
  }
]
```

---

### POST `/fill-vacancy`
Preenche uma vaga com dados do usuário.

**Requisição JSON:**
```json
{
  "user_name": "João da Silva",
  "user_CPF": "12345678900",
  "user_vehicle": "Fiat Uno",
  "vehicle_color": "Vermelho",
  "vacancy_id": 5
}
```

---

### POST `/release-vacancy`
Libera uma vaga previamente preenchida.

**Requisição JSON:**
```json
{
  "user_CPF": "12345678900"
}
```

---

## 📌 Boas Práticas Aplicadas

- ✔️ **Validação de dados**: As rotas verificam campos obrigatórios e limites válidos antes de executar ações no banco.
- 🔒 **Consistência de CPF**: O sistema não permite que o mesmo CPF ocupe mais de uma vaga simultaneamente.
- ⚙️ **Separacão de responsabilidades**: Lógica clara e rotas organizadas.
- 💿 **Uso de ORM (Prisma)**: Facilita manutenção, escalabilidade e integração com banco de dados relacional.

---

## 🚀 Como rodar o projeto

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
```
2. Instale as dependências:
```bash
npm install
```
3. Configure o `.env` com as informações do banco.
4. Execute as migrations:
```bash
npx prisma migrate dev
```
5. Inicie o servidor:
```bash
npm start
```

---

## 🧐 Observação

Esse projeto é ideal para aprendizado e serve como base para sistemas de gestão de vagas em estacionamentos, condomínios ou empresas.

---

## ✨ Autor

Feito com 💻 por [Luiz Gustavo](https://github.com/luizgustavogg)  
Contribuições são sempre bem-vindas!

---

