# Jokenpo Online - Multiplayer em Tempo Real

Este é um projeto de Jokenpo (Pedra, Papel e Tesoura) desenvolvido para aplicar conceitos de comunicação bidirecional em tempo real utilizando WebSockets. O foco principal foi a construção de um servidor robusto capaz de gerenciar múltiplos estados de jogo simultaneamente.

> **Status do Projeto:** Concluído / Em manutenção para melhorias de UI.

---

## Demonstração
Você pode testar a aplicação rodando em tempo real aqui: [Link do Render](https://jokenpo-frontend-wj14.onrender.com)

---

## Tecnologias Utilizadas

### **Backend**
* **Node.js**: Ambiente de execução.
* **TypeScript**: Tipagem estática para maior segurança e manutenibilidade.
* **Socket.io**: Biblioteca principal para comunicação via WebSockets.
* **Express**: Gerenciamento de rotas e middleware.

### **Frontend**
* **React**: Construção da interface de usuário.
* **Vite**: Ferramenta de build rápida.
* **Tailwind CSS**: Estilização moderna e responsiva.

---

## Desafios e Aprendizados

Durante o desenvolvimento deste projeto, foquei em resolver problemas comuns de aplicações em tempo real:

1.  **Gerenciamento de Salas (Rooms):** Implementei a lógica de criação e entrada em salas para permitir que diferentes pares de jogadores joguem ao mesmo tempo sem interferência.
2.  **Sincronização de Estado:** Garanti que ambos os jogadores recebam a atualização do resultado da rodada exatamente ao mesmo tempo, tratando latências de rede.
3.  **Lógica de Negócio no Server-side:** Toda a validação de quem ganhou a rodada é feita no backend para garantir a integridade das partidas.
4.  **Arquitetura Baseada em Eventos:** Estruturação do fluxo de dados utilizando eventos específicos (join_room, make_move, receive_result).

---

## Como rodar o projeto localmente

### Pré-requisitos
* Node.js instalado (v18 ou superior)
* npm ou yarn

### Passo a passo
1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/VictorGebeluca/Jokenpo-Online.git](https://github.com/VictorGebeluca/Jokenpo-Online.git)
    cd Jokenpo-Online
    ```

2.  **Configuração do Backend:**
    ```bash
    cd backend
    npm install
    npm run dev
    ```

3.  **Configuração do Frontend:**
    ```bash
    cd ../frontend
    npm install
    npm run dev
    ```

---

## Contato

Victor Gebeluca – [LinkedIn](https://www.linkedin.com/in/victor-miguel-2847ba267) – victormiguel01@gmail.com

---
Desenvolvido por Victor Gebeluca.