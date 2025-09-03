const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

// Importa as configurações e o conteúdo do novo arquivo
const config = require("./config.js");
const content = require("./content.js");

// Inicializa o cliente
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true },
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

  if (msg.body.trim() === "0") {
    sessions[chatId] = { stage: 0, data: {} };
    await client.sendMessage(chatId, content.saudacao.reiniciado);
    return;
  }

  if (!sessions[chatId]) {
    sessions[chatId] = { stage: 0, data: {} };
    await client.sendMessage(chatId, content.saudacao.inicio);
    return;
  }

  const session = sessions[chatId];

  switch (session.stage) {
    case 0:
      session.data.nome = msg.body.trim();
      session.stage = 1;
      await client.sendMessage(chatId, content.pedidos.nome(session.data.nome));
      break;

    case 1:
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(msg.body.trim())) {
        await client.sendMessage(chatId, content.erros.emailInvalido);
        return;
      }
      session.data.email = msg.body.trim();
      session.stage = 2;
      await client.sendMessage(chatId, content.pedidos.email);
      break;

    case 2:
      session.data.endereco = msg.body.trim();
      session.stage = 3;
      await client.sendMessage(chatId, content.pedidos.endereco);
      break;

    case 3:
      if (!["1", "2", "3"].includes(msg.body.trim())) {
        await client.sendMessage(
          chatId,
          content.erros.opcaoInvalida(content.opcoes.modelo)
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
      await client.sendMessage(chatId, content.pedidos.ano);
      break;

    case 4:
      const ano = parseInt(msg.body.trim());
      if (isNaN(ano) || ano < 2007 || ano > 2015) {
        await client.sendMessage(chatId, content.erros.anoInvalido);
        return;
      }
      session.data.ano = ano;

      if (ano === 2015) {
        session.stage = 41;
        await client.sendMessage(chatId, content.pedidos.avisoAno2015);
      } else {
        session.stage = 5;
        await client.sendMessage(chatId, content.pedidos.armazenamento);
      }
      break;

    case 41:
      if (msg.body.trim() === "1") {
        session.stage = 5;
        await client.sendMessage(chatId, content.pedidos.armazenamento);
      } else {
        await client.sendMessage(chatId, content.saudacao.finalizado);
        delete sessions[chatId];
      }
      break;

    case 5:
      if (!["1", "2", "3", "4"].includes(msg.body.trim())) {
        await client.sendMessage(
          chatId,
          content.erros.opcaoInvalida(content.opcoes.armazenamento)
        );
        return;
      }

      if (msg.body.trim() === "4") {
        session.data.armazenamento = "Não possui";
        session.stage = 51;
        await client.sendMessage(chatId, content.pedidos.avisoSemArmazenamento);
        return;
      }

      session.data.armazenamento =
        msg.body.trim() === "1"
          ? "HD interno"
          : msg.body.trim() === "2"
          ? "HD externo"
          : "Pendrive 16GB+";
      session.stage = 6;

      let listaJogos = "";
      for (const key in config.jogos) {
        listaJogos += `${key}️⃣ ${config.jogos[key]}\n`;
      }
      await client.sendMessage(
        chatId,
        `🎮 Escolha até *3 jogos* (digite os números separados por vírgula):\n${listaJogos}(Se quiser reiniciar, digite 0️⃣)`
      );
      break;

    case 51:
      if (msg.body.trim() === "1") {
        session.data.tipoServico = "Somente desbloqueio";
        session.stage = 7;
        await client.sendMessage(chatId, content.pedidos.localizacao);
      } else {
        await client.sendMessage(chatId, content.saudacao.finalizado);
        delete sessions[chatId];
      }
      break;

    case 6:
      const jogosOpcoes = config.jogos;
      let numerosEscolhidos = msg.body.split(",").map((n) => n.trim());

      if (numerosEscolhidos.length === 0 || numerosEscolhidos.length > 3) {
        await client.sendMessage(chatId, content.erros.jogosInvalidos);
        return;
      }

      const todosValidos = numerosEscolhidos.every((n) => jogosOpcoes[n]);
      if (!todosValidos) {
        await client.sendMessage(
          chatId,
          `${content.erros.jogosNumerosInvalidos} ${Object.keys(
            jogosOpcoes
          ).join(", ")}.`
        );
        return;
      }

      let jogosSelecionados = numerosEscolhidos.map((n) => jogosOpcoes[n]);

      session.data.jogos = jogosSelecionados;
      session.stage = 7;
      await client.sendMessage(chatId, content.pedidos.localizacao);
      break;

    case 7:
      if (!["1", "2"].includes(msg.body.trim())) {
        await client.sendMessage(chatId, content.erros.simNaoInvalido);
        return;
      }

      let tipoServico;
      const ano_data = session.data.ano;
      const armazenamento = session.data.armazenamento;

      if (ano_data === 2015 && armazenamento !== "Não possui") {
        tipoServico = "Copiar jogos";
      } else if (ano_data !== 2015 && armazenamento === "Não possui") {
        tipoServico = "Somente desbloqueio";
      } else if (ano_data !== 2015 && armazenamento !== "Não possui") {
        tipoServico = "Desbloqueio + jogos";
      } else {
        tipoServico = "Serviço não definido";
      }
      session.data.tipoServico = tipoServico;

      let resumo = `
*📋 Resumo do Pedido:*
👤 Nome: ${session.data.nome}
📧 Email: ${session.data.email}
🏠 Endereço: ${session.data.endereco}
🎮 Modelo: ${session.data.modelo}
📅 Ano: ${session.data.ano}
💾 Armazenamento: ${session.data.armazenamento}
🛠️ Serviço: ${session.data.tipoServico}`;

      if (session.data.jogos) {
        resumo += `\n🎮 Jogos:`;
        session.data.jogos.forEach((jogo, index) => {
          resumo += `\n${index + 1}️⃣ ${jogo}`;
        });
      }

      await client.sendMessage(chatId, resumo);

      if (msg.body.trim() === "1") {
        await client.sendMessage(
          chatId,
          `📍 Localização: ${config.localizacao}`
        );
      }

      await client.sendMessage(
        chatId,
        content.pedidos.concluido(session.data.nome)
      );
      delete sessions[chatId];
      break;
  }
});

client.initialize();
