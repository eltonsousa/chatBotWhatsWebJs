# 🤖 CHATBOT DA HORA GAMES

**Descrição:**  
Chatbot para WhatsApp que auxilia clientes no desbloqueio e cópia de jogos para Xbox de forma simples, com fluxo guiado e resumo final detalhado.

---

## ⚡ Funcionalidades

- **Fluxo completo de atendimento:**
  - 👤 Coleta **nome** e **e-mail**
  - 🏠 Coleta **endereço**
  - 🎮 Seleção de **modelo do Xbox**: Fat, Slim ou Super Slim
  - 📅 Informar **ano do console** (2007–2015) com alerta especial para 2015
  - 💾 Escolha de **armazenamento**: HD interno, HD externo, Pendrive 16GB+, ou nenhum
  - 🕹 Escolha de até **3 jogos** numerados: GTA, NFS, FIFA 19, PES 2018
  - 📍 Opção de receber **link de localização**
- 🔄 **Reiniciar atendimento** a qualquer momento digitando `0️⃣`
- 📝 **Resumo final do pedido** exibindo:
  - Nome, e-mail e endereço
  - Modelo e ano do console
  - Tipo de armazenamento
  - Lista de jogos em **lista numerada com emojis**
  - Tipo de serviço calculado automaticamente:
    - `Copiar jogos` → aparelho 2015 com armazenamento
    - `Somente desbloqueio` → aparelho sem armazenamento
    - `Desbloqueio + jogos` → aparelho não 2015 com armazenamento

---

## 🛠 Tecnologias

- Node.js
- [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js)
- Puppeteer
- LocalAuth (sessão persistente)

---

## 📂 Estrutura Git

- `.gitignore` configurado para ignorar:
  - `node_modules/`
  - Sessão e cache do WhatsApp: `.wwebjs_auth/`, `.wwebjs_cache/`
  - Logs e arquivos temporários: `npm-debug.log*`, `.env`, `.vscode/`

---

## ✅ Como Usar

1. Clone o repositório:

   ```bash
   git clone <URL_DO_REPOSITORIO>

   ```

2. Instale as dependências:

   ```bash
   npm install

   ```

3. Rode o bot:

   ```bash
   node index.js

   ```

4. Escaneie o QR Code exibido no terminal e siga as instruções do chatbot.
