# Jokenpo Online - Multiplayer em Tempo Real

Este é um projeto de Jokenpo (Pedra, Papel e Tesoura) desenvolvido para aplicar conceitos de comunicação bidirecional em tempo real utilizando WebSockets. O foco principal foi a construção de um servidor robusto capaz de gerenciar múltiplos estados de jogo simultaneamente.

> **Status do Projeto:** Concluído / Em manutenção.

---

## Demonstração
Você pode testar a aplicação rodando em tempo real aqui: [Link do Render](https://jokenpo-frontend-wj14.onrender.com)

---

## Tecnologias Utilizadas

### **Backend**
* **Node.js**: Ambiente de execução.
* **TypeScript**: Tipagem estática para maior segurança e manutenibilidade.
* **Express**: Framework para gerenciamento do servidor HTTP.
* **Socket.io**: Biblioteca principal para comunicação via WebSockets.

### **Frontend**
* **React**: Biblioteca para construção da interface de usuário.
* **Vite**: Ferramenta de build rápida.
* **CSS Nativo**: Estilização personalizada para a interface.

---

## Desafios e Aprendizados

Durante o desenvolvimento deste projeto, foquei em resolver problemas comuns de aplicações em tempo real:

1.  **Gerenciamento de Salas (Rooms):** Implementação de lógica para isolar partidas em salas, permitindo que vários pares joguem simultaneamente.
2.  **Sincronização de Estado:** Garantia de que ambos os jogadores recebam atualizações de jogadas e resultados em tempo real.
3.  **Lógica de Negócio no Server-side:** Toda a validação de vitória/derrota é processada no backend para garantir a integridade das partidas.
4.  **Arquitetura Baseada em Eventos:** Estruturação do fluxo de dados utilizando eventos específicos do Socket.io (join_room, make_move, receive_result).

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