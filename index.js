// index.js
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: false },
});

client.on("qr", (qr) => qrcode.generate(qr, { small: true }));
client.on("ready", () => console.log("🤖 CHATBOT DA HORA GAMES online!"));

const sessions = {};
function initSession(user) {
  sessions[user] = { step: 1, data: {} };
}

function isValidNumber(input, min, max) {
  const n = parseInt(input);
  return !isNaN(n) && n >= min && n <= max;
}

client.on("message", async (message) => {
  const user = message.from;
  const text = message.body.trim();

  if (!sessions[user]) {
    initSession(user);
    await message.reply(
      "👋 Olá! Bem-vindo ao *CHATBOT DA HORA GAMES* 🎮\n\nQual é o seu *nome*?"
    );
    return;
  }

  const session = sessions[user];

  switch (session.step) {
    case 1:
      if (text.length < 2) {
        await message.reply("❌ Nome inválido. Digite seu nome completo.");
        return;
      }
      session.data.nome = text;
      session.step = 2;
      await message.reply("📧 Agora, por favor informe o seu *email*:");
      break;

    case 2:
      if (!text.includes("@") || !text.includes(".")) {
        await message.reply("❌ Email inválido. Digite um email válido:");
        return;
      }
      session.data.email = text;
      session.step = 3;
      await message.reply("🏠 Informe o seu *endereço*:");
      break;

    case 3:
      if (text.length < 5) {
        await message.reply("❌ Endereço inválido. Digite novamente:");
        return;
      }
      session.data.endereco = text;
      session.step = 4;
      await message.reply(
        "💻 Qual o modelo do seu Xbox?\n1️⃣ Fat\n2️⃣ Slim\n3️⃣ Super Slim\nDigite o número da opção:"
      );
      break;

    case 4:
      if (!["1", "2", "3"].includes(text)) {
        await message.reply("❌ Opção inválida. Digite 1, 2 ou 3.");
        return;
      }
      const mapModelo = { 1: "Fat", 2: "Slim", 3: "Super Slim" };
      session.data.modelo = mapModelo[text];
      session.step = 5;
      await message.reply("📅 Informe o *ano do console* [2007 - 2015]:");
      break;

    case 5:
      if (!isValidNumber(text, 2007, 2015)) {
        await message.reply(
          "❌ Ano inválido. Digite um ano entre 2007 e 2015:"
        );
        return;
      }
      session.data.ano = text;
      if (text === "2015") {
        session.step = 5.1;
        await message.reply(
          "⚠️ Esse modelo não pode ser desbloqueado definitivamente.\nDeseja continuar?\n1️⃣ Sim\n2️⃣ Não"
        );
      } else {
        session.step = 6;
        await message.reply(
          "💾 Possui armazenamento?\n1️⃣ HD Interno\n2️⃣ HD Externo\n3️⃣ Pendrive 16GB+\n4️⃣ Não tenho"
        );
      }
      break;

    case 5.1:
      if (!["1", "2"].includes(text)) {
        await message.reply("❌ Opção inválida. Digite 1 (Sim) ou 2 (Não).");
        return;
      }
      if (text === "2") {
        await message.reply(
          "❌ Processo encerrado. Obrigado por entrar em contato!"
        );
        delete sessions[user];
        return;
      }
      session.step = 6;
      await message.reply(
        "💾 Possui armazenamento?\n1️⃣ HD Interno\n2️⃣ HD Externo\n3️⃣ Pendrive 16GB+\n4️⃣ Não tenho"
      );
      break;

    case 6:
      if (!["1", "2", "3", "4"].includes(text)) {
        await message.reply("❌ Opção inválida. Digite 1, 2, 3 ou 4.");
        return;
      }
      const mapArmazenamento = {
        1: "HD Interno",
        2: "HD Externo",
        3: "Pendrive 16GB+",
        4: "Não tenho",
      };
      session.data.armazenamento = mapArmazenamento[text];

      if (text === "4") {
        session.step = 6.1;
        await message.reply(
          "⚠️ Sem armazenamento não será possível jogar nem copiar jogos.\nDeseja continuar desbloqueio ou finalizar?\n1️⃣ Continuar\n2️⃣ Finalizar"
        );
      } else {
        session.step = 7;
        await message.reply(
          "🎮 Escolha até *3 jogos* (digite números separados por vírgula):\n1️⃣ GTA\n2️⃣ NFS\n3️⃣ FIFA 19\n4️⃣ PES 2018"
        );
      }
      break;

    case 6.1:
      if (!["1", "2"].includes(text)) {
        await message.reply("❌ Opção inválida. Digite 1 ou 2.");
        return;
      }
      if (text === "2") {
        await message.reply(
          "❌ Processo encerrado. Obrigado por entrar em contato!"
        );
        delete sessions[user];
        return;
      }
      // Continuar desbloqueio, pular etapa de jogos
      session.step = 8;
      await message.reply(
        "📍 Deseja receber o link da localização?\n1️⃣ Sim\n2️⃣ Não"
      );
      break;

    case 7:
      const mapJogos = { 1: "GTA", 2: "NFS", 3: "FIFA 19", 4: "PES 2018" };
      const numeros = text.split(",").map((n) => n.trim());
      const jogos = numeros
        .map((n) => mapJogos[n])
        .filter((j) => j !== undefined)
        .slice(0, 3); // Limitar a 3 jogos

      if (jogos.length === 0) {
        await message.reply(
          "❌ Nenhum jogo válido selecionado. Escolha até 3 jogos da lista usando números separados por vírgula."
        );
        return;
      }

      session.data.jogos = jogos;
      session.step = 8;
      await message.reply(
        "📍 Deseja receber o link da localização?\n1️⃣ Sim\n2️⃣ Não"
      );
      break;

    case 8:
      if (!["1", "2"].includes(text)) {
        await message.reply("❌ Opção inválida. Digite 1 ou 2.");
        return;
      }
      session.data.localizacao = text === "1" ? "Sim" : "Não";

      // Montar resumo
      let resumo = `📋 *Resumo do seu pedido:*\n\n`;
      resumo += `👤 Nome: ${session.data.nome}\n`;
      resumo += `📧 Email: ${session.data.email}\n`;
      resumo += `🏠 Endereço: ${session.data.endereco}\n`;
      resumo += `🎮 Modelo Xbox: ${session.data.modelo}\n`;
      resumo += `📅 Ano: ${session.data.ano}\n`;
      resumo += `💾 Armazenamento: ${session.data.armazenamento}\n`;
      if (session.data.jogos) {
        resumo += `🕹 Jogos:\n`;
        session.data.jogos.forEach((jogo) => (resumo += `- ${jogo}\n`));
      }

      // Tipo de Serviço
      let tipoServico = "";
      if (
        session.data.ano === "2015" &&
        session.data.armazenamento !== "Não tenho"
      ) {
        tipoServico = "Copiar jogos";
      } else if (
        session.data.ano !== "2015" &&
        session.data.armazenamento === "Não tenho"
      ) {
        tipoServico = "Somente desbloqueio";
      } else if (
        session.data.ano !== "2015" &&
        session.data.armazenamento !== "Não tenho"
      ) {
        tipoServico = "Desbloqueio+jogos";
      }
      resumo += `🛠 Tipo de Serviço: ${tipoServico}\n`;

      await message.reply(resumo);

      if (session.data.localizacao === "Sim") {
        await message.reply(
          "🌍 Link da localização: https://goo.gl/maps/xxxxx"
        );
      }

      await message.reply(
        "✅ Obrigado por usar o *CHATBOT DA HORA GAMES*! Até mais! 👋"
      );
      delete sessions[user];
      break;
  }
});

client.initialize();
