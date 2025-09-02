const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

// Inicializa o cliente
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true }, // pode colocar false para ver o navegador
});

// Armazena o estado das conversas
let sessions = {};

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("🤖 CHATBOT DA HORA GAMES está online!");
});

client.on("message", async (msg) => {
  const chatId = msg.from;

  // Reiniciar fluxo em qualquer etapa
  if (msg.body.trim() === "0") {
    sessions[chatId] = { stage: 0, data: {} };
    await client.sendMessage(
      chatId,
      `🔄 Fluxo reiniciado!\n\n👋 Olá! Bem-vindo ao *CHATBOT DA HORA GAMES*! \n\nQual é o seu *nome*?`
    );
    return;
  }

  // Se não existir sessão, cria
  if (!sessions[chatId]) {
    sessions[chatId] = { stage: 0, data: {} };
    await client.sendMessage(
      chatId,
      `👋 Olá! Bem-vindo ao *CHATBOT DA HORA GAMES*! \n\nQual é o seu *nome*?`
    );
    return;
  }

  const session = sessions[chatId];

  switch (session.stage) {
    case 0:
      session.data.nome = msg.body.trim();
      session.stage = 1;
      await client.sendMessage(
        chatId,
        `✅ Obrigado, ${session.data.nome}!\n\n📧 Agora, informe o seu *email*:\n(Se quiser reiniciar, digite 0️⃣)`
      );
      break;

    case 1:
      session.data.email = msg.body.trim();
      session.stage = 2;
      await client.sendMessage(
        chatId,
        `🏠 Informe o seu *endereço*:\n(Se quiser reiniciar, digite 0️⃣)`
      );
      break;

    case 2:
      session.data.endereco = msg.body.trim();
      session.stage = 3;
      await client.sendMessage(
        chatId,
        `🎮 Qual o modelo do seu Xbox?\n\n1️⃣ Fat\n2️⃣ Slim\n3️⃣ Super Slim\n\n(Se quiser reiniciar, digite 0️⃣)`
      );
      break;

    case 3:
      if (!["1", "2", "3"].includes(msg.body.trim())) {
        await client.sendMessage(
          chatId,
          `❌ Opção inválida. Escolha:\n1️⃣ Fat\n2️⃣ Slim\n3️⃣ Super Slim`
        );
        return;
      }
      session.data.modelo =
        msg.body.trim() === "1"
          ? "Fat"
          : msg.body.trim() === "2"
          ? "Slim"
          : "Super Slim";
      session.stage = 4;
      await client.sendMessage(
        chatId,
        `📅 Informe o *ano* do console [2007 - 2015]:\n(Se quiser reiniciar, digite 0️⃣)`
      );
      break;

    case 4:
      const ano = parseInt(msg.body.trim());
      if (isNaN(ano) || ano < 2007 || ano > 2015) {
        await client.sendMessage(
          chatId,
          `❌ Ano inválido. Digite entre 2007 e 2015`
        );
        return;
      }
      session.data.ano = ano;

      if (ano === 2015) {
        session.stage = 41;
        await client.sendMessage(
          chatId,
          `⚠️ Aparelhos de *2015 não podem ser desbloqueados definitivamente*.\nDeseja continuar?\n1️⃣ Sim\n2️⃣ Não\n(Se quiser reiniciar, digite 0️⃣)`
        );
      } else {
        session.stage = 5;
        await client.sendMessage(
          chatId,
          `💾 Possui armazenamento?\n1️⃣ HD interno\n2️⃣ HD externo\n3️⃣ Pendrive 16GB+\n4️⃣ Não tenho\n(Se quiser reiniciar, digite 0️⃣)`
        );
      }
      break;

    case 41:
      if (msg.body.trim() === "1") {
        session.stage = 5;
        await client.sendMessage(
          chatId,
          `💾 Possui armazenamento?\n1️⃣ HD interno\n2️⃣ HD externo\n3️⃣ Pendrive 16GB+\n4️⃣ Não tenho\n(Se quiser reiniciar, digite 0️⃣)`
        );
      } else {
        await client.sendMessage(
          chatId,
          `🚫 Atendimento finalizado. Obrigado! 🙏`
        );
        delete sessions[chatId];
      }
      break;

    case 5:
      if (!["1", "2", "3", "4"].includes(msg.body.trim())) {
        await client.sendMessage(
          chatId,
          `❌ Opção inválida. Escolha:\n1️⃣ HD interno\n2️⃣ HD externo\n3️⃣ Pendrive 16GB+\n4️⃣ Não tenho`
        );
        return;
      }

      if (msg.body.trim() === "4") {
        session.data.armazenamento = "Não possui";
        session.stage = 51;
        await client.sendMessage(
          chatId,
          `⚠️ Sem armazenamento não será possível jogar nem copiar jogos.\nDeseja:\n1️⃣ Continuar apenas com desbloqueio\n2️⃣ Finalizar\n(Se quiser reiniciar, digite 0️⃣)`
        );
        return;
      }

      session.data.armazenamento =
        msg.body.trim() === "1"
          ? "HD interno"
          : msg.body.trim() === "2"
          ? "HD externo"
          : "Pendrive 16GB+";
      session.stage = 6;
      await client.sendMessage(
        chatId,
        `🎮 Escolha até *3 jogos* (digite os números separados por vírgula):\n1️⃣ GTA\n2️⃣ NFS\n3️⃣ FIFA 19\n4️⃣ PES 2018\n(Se quiser reiniciar, digite 0️⃣)`
      );
      break;

    case 51:
      if (msg.body.trim() === "1") {
        session.data.tipoServico = "Somente desbloqueio";
        session.stage = 7;
        await client.sendMessage(
          chatId,
          `📍 Deseja receber o link da localização?\n1️⃣ Sim\n2️⃣ Não\n(Se quiser reiniciar, digite 0️⃣)`
        );
      } else {
        await client.sendMessage(
          chatId,
          `🚫 Atendimento finalizado. Obrigado! 🙏`
        );
        delete sessions[chatId];
      }
      break;

    case 6:
      const jogosOpcoes = { 1: "GTA", 2: "NFS", 3: "FIFA 19", 4: "PES 2018" };
      let escolhidos = msg.body.split(",").map((j) => j.trim());
      let jogosSelecionados = escolhidos
        .map((j) => jogosOpcoes[j])
        .filter(Boolean);
      if (jogosSelecionados.length === 0 || jogosSelecionados.length > 3) {
        await client.sendMessage(
          chatId,
          `❌ Escolha até *3 jogos* válidos usando os números. Exemplo: 1,2,3`
        );
        return;
      }
      session.data.jogos = jogosSelecionados;
      session.stage = 7;
      await client.sendMessage(
        chatId,
        `📍 Deseja receber o link da localização?\n1️⃣ Sim\n2️⃣ Não\n(Se quiser reiniciar, digite 0️⃣)`
      );
      break;

    case 7:
      if (!["1", "2"].includes(msg.body.trim())) {
        await client.sendMessage(
          chatId,
          `❌ Opção inválida. Responda:\n1️⃣ Sim\n2️⃣ Não`
        );
        return;
      }

      // Tipo de serviço
      if (
        session.data.ano === 2015 &&
        session.data.armazenamento !== "Não possui"
      ) {
        session.data.tipoServico = "Copiar jogos";
      } else if (
        session.data.ano !== 2015 &&
        session.data.armazenamento === "Não possui"
      ) {
        session.data.tipoServico = "Somente desbloqueio";
      } else if (
        session.data.ano !== 2015 &&
        session.data.armazenamento !== "Não possui"
      ) {
        session.data.tipoServico = "Desbloqueio + jogos";
      }

      // Montar resumo
      let resumo =
        `📋 *Resumo do Pedido*:\n\n` +
        `👤 Nome: ${session.data.nome}\n` +
        `📧 Email: ${session.data.email}\n` +
        `🏠 Endereço: ${session.data.endereco}\n` +
        `🎮 Modelo: ${session.data.modelo}\n` +
        `📅 Ano: ${session.data.ano}\n` +
        `💾 Armazenamento: ${session.data.armazenamento}\n` +
        `🛠️ Tipo de Serviço: ${session.data.tipoServico}\n`;

      if (session.data.jogos) {
        resumo += `🎮 Jogos:\n`;
        session.data.jogos.forEach((jogo, index) => {
          resumo += `${index + 1}️⃣ ${jogo}\n`;
        });
      }

      await client.sendMessage(chatId, resumo);

      if (msg.body.trim() === "1") {
        await client.sendMessage(
          chatId,
          `📍 Localização: https://maps.google.com`
        );
      }

      await client.sendMessage(
        chatId,
        `✅ Atendimento concluído! Obrigado ${session.data.nome}, até breve! 🙏\n\nSe quiser reiniciar, digite 0️⃣`
      );

      delete sessions[chatId];
      break;
  }
});

client.initialize();
