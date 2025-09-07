////////////////////////////////////////////////////////////////////////////////
// index.js
////////////////////////////////////////////////////////////////////////////////
const express = require("express");
const QRCode = require("qrcode");

const { v4: uuidv4 } = require("uuid"); // Gera ID
const { Client, LocalAuth } = require("whatsapp-web.js");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

// Logs personalizados
function logInfo(message, session) {
  const nome = session?.data?.nome || "Usuário desconhecido";
  const chatId = session?.chatId || "ChatId desconhecido";
  console.log(`[${new Date().toISOString()}] [${chatId}] [${nome}] ${message}`);
}

function logError(message, error, session) {
  const nome = session?.data?.nome || "Usuário desconhecido";
  const chatId = session?.chatId || "ChatId desconhecido";
  console.error(
    `[${new Date().toISOString()}] [${chatId}] [${nome}] ${message}`,
    error
  );
}
// Fim logs personalizados

// Função para simular a digitação e enviar a mensagem
async function sendWithTypingDelay(chatId, message, delayMs = 1500) {
  const chat = await client.getChatById(chatId);

  // ⏳ Inicia a animação de "digitando..."
  await chat.sendStateTyping();

  // ⏸️ Espera pelo tempo de atraso (1.5 segundos por padrão)
  await new Promise((resolve) => setTimeout(resolve, delayMs));

  // 💬 Envia a mensagem (a animação de "digitando" para automaticamente)
  await client.sendMessage(chatId, message);
}
// Fim função para simular a digitação e enviar a mensagem

// Importa as configurações e o conteúdo
const config = require("./config.js");
const content = require("./content.js");

// Configura o cliente Supabase usando as variáveis de ambiente
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

////////////////////////////////////////////////////////////////////////////////
// Inicializa o cliente do WhatsApp
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--single-process",
      "--disable-gpu",
    ],
  },
});

// Log quando o bot estiver pronto
client.on("ready", () => {
  logInfo("🤖 CHATBOT está online!");
});

// Rota para exibir QR Code
let latestQR = null;
client.on("qr", (qr) => {
  latestQR = qr;
  console.log("⚡ Novo QR gerado. Acesse /qr para escanear.");
});

////////////////////////////////////////////////////////////////////////////////
// Servidor Express
const app = express();

// rota de healthcheck
app.get("/", (req, res) => {
  res.send("OK");
});

// rota do QR Code
app.get("/qr", async (req, res) => {
  if (!latestQR) {
    return res.send("Nenhum QR disponível. Aguarde o bot gerar um novo.");
  }
  const qrImage = await QRCode.toDataURL(latestQR);
  res.type("html");
  res.send(
    `<h2>Escaneie o QR Code abaixo com seu WhatsApp:</h2><br><img src="${qrImage}" />`
  );
});

// 🚀 Usa a porta definida pelo Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌍 Servidor rodando na porta ${PORT}`);
});
////////////////////////////////////////////////////////////////////////////////

// Fluxo de mensagens
client.on("message", async (msg) => {
  const chatId = msg.from;
  const userMessage = msg.body.trim();

  // Busca a sessão do usuário no Supabase
  let { data: session, error: selectError } = await supabase
    .from("sessions")
    .select("*")
    .eq("chatId", chatId)
    .single();

  if (selectError && selectError.code !== "PGRST116") {
    logError("Erro ao buscar a sessão", selectError);
    return;
  }

  // --- Lógica de encerramento e reinício no topo ---
  if (userMessage === "9") {
    if (session) {
      await supabase.from("sessions").delete().eq("chatId", chatId);
    }
    await sendWithTypingDelay(chatId, content.saudacao.encerrado);
    return;
  }

  if (userMessage === "0") {
    if (session) {
      session.stage = -1;
      session.data = {}; // Limpa os dados da sessão anterior
      await supabase.from("sessions").update(session).eq("chatId", chatId);
    }
    await sendWithTypingDelay(
      chatId,
      content.saudacao.faqReiniciado + content.faq.menu
    );
    return;
  }
  // --- FIM DA LÓGICA DE ENCERRAMENTO E REINÍCIO ---

  // Se a sessão existir e estiver no estágio final (8)
  if (session && session.stage === 8) {
    if (userMessage === "1") {
      // Opção 1: Ver resumo do último pedido
      const { data: pedido, error: pedidoError } = await supabase
        .from("pedidos")
        .select("*")
        .eq("service_id", session.data.serviceId)
        .single();

      if (pedidoError || !pedido) {
        await sendWithTypingDelay(
          chatId,
          "⚠️ Não foi possível encontrar seu último pedido. Por favor, inicie um novo atendimento."
        );
        session.stage = -1;
        session.data = {};
        await supabase.from("sessions").update(session).eq("chatId", chatId);
        await sendWithTypingDelay(
          chatId,
          content.saudacao.faqInicio + content.faq.menu
        );
        return;
      }

      let resumo = `
*📋 RESUMO DO SEU ÚLTIMO PEDIDO:*
🆔 ID DO SERVIÇO: ${pedido.service_id}
👤 NOME: ${pedido.nome}
📧 EMAIL: ${pedido.email}
🏠 ENDEREÇO: ${pedido.endereco}
🎮 MODELO: ${pedido.modelo}
📅 ANO: ${pedido.ano}
💾 ARMAZENAMENTO: ${pedido.armazenamento}
🛠️ SERVIÇO: ${pedido.tipo_servico}`;

      if (pedido.jogos) {
        resumo += `\n🎮 JOGOS:`;
        pedido.jogos.forEach((jogo, index) => {
          resumo += `\n${index + 1}. ${jogo}`;
        });
      }

      await sendWithTypingDelay(chatId, resumo);

      // NOVO: Envia o novo menu simplificado após o resumo
      await sendWithTypingDelay(chatId, content.saudacao.retornoAposResumo);
      return;
    } else if (userMessage === "2") {
      // Opção 2: Iniciar um novo pedido
      session.stage = -1;
      session.data = {}; // Limpa os dados da sessão anterior
      await sendWithTypingDelay(
        chatId,
        content.saudacao.faqReiniciado + content.faq.menu
      );
      await supabase.from("sessions").update(session).eq("chatId", chatId);
      return;
    } else {
      // Se o usuário digitar qualquer outra coisa (como 'oi' ou 'ola')
      await sendWithTypingDelay(
        chatId,
        content.saudacao.retorno(session.data.nome)
      );
      return;
    }
  }

  // Se a sessão não existir, cria uma nova no banco de dados com o stage -1 (FAQ)
  if (!session) {
    const { data: newSession, error: insertError } = await supabase
      .from("sessions")
      .insert([
        {
          chatId: chatId,
          stage: -1, // Novo estágio inicial para o FAQ
          data: {},
        },
      ])
      .select()
      .single();
    if (insertError) {
      console.error("Erro ao criar nova sessão:", insertError);
      return;
    }
    session = newSession;
    await sendWithTypingDelay(chatId, content.saudacao.faqInicio);
    await sendWithTypingDelay(chatId, content.faq.menu);
    return;
  }

  // --- LÓGICA DO FLUXO PRINCIPAL ---
  switch (session.stage) {
    case -1: // Estágio do menu principal do FAQ
      if (userMessage === "0") {
        await sendWithTypingDelay(chatId, content.faq.menu);
      } else if (userMessage === "3") {
        let listaJogos = "";
        for (const key in config.jogos) {
          listaJogos += `*${key}.* ${config.jogos[key]}\n`;
        }
        const mensagemCompleta = `${content.faq.opcoes[userMessage]}\n${listaJogos}`;
        await sendWithTypingDelay(chatId, mensagemCompleta);
        session.stage = -2; // Move para o novo estágio de espera
      } else if (userMessage in content.faq.opcoes) {
        // Entra neste bloco para respostas do FAQ (opções 1, 2, 4, 5, 6)
        await sendWithTypingDelay(chatId, content.faq.opcoes[userMessage]);
        session.stage = -2; // Move para o novo estágio de espera
      } else if (userMessage === "7") {
        session.stage = 0; // Inicia o fluxo principal
        const serviceId = `OS-${uuidv4().substring(0, 8).toUpperCase()}`;
        session.data.serviceId = serviceId; // Gera um novo ID
        await sendWithTypingDelay(chatId, content.saudacao.inicio); // Mensagem que pede o nome
      } else if (userMessage === "8") {
        await supabase.from("sessions").delete().eq("chatId", chatId);
        await sendWithTypingDelay(chatId, content.saudacao.finalizado);
      } else {
        await sendWithTypingDelay(chatId, content.erros.opcaoFaqInvalida);
      }
      break;

    case -2: // Novo estágio para quando uma resposta do FAQ é exibida
      if (userMessage === "0") {
        session.stage = -1; // Retorna ao menu do FAQ
        await sendWithTypingDelay(chatId, content.faq.menu);
      } else {
        await sendWithTypingDelay(chatId, content.erros.faqNaoZero);
      }
      break;

    case 0: // Pedir o nome
      session.data.nome = userMessage;
      session.stage = 1;
      await sendWithTypingDelay(
        chatId,
        content.pedidos.nome(session.data.nome)
      );
      break;

    case 1: // Pedir e-mail
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userMessage)) {
        await sendWithTypingDelay(chatId, content.erros.emailInvalido);
        break;
      }
      session.data.email = userMessage;
      session.stage = 2;
      await sendWithTypingDelay(chatId, content.pedidos.email);
      break;

    case 2: // Pedir endereço
      session.data.endereco = userMessage;
      session.stage = 3;
      await sendWithTypingDelay(chatId, content.pedidos.endereco);
      break;

    case 3: // Pedir modelo
      if (!["1", "2", "3"].includes(userMessage)) {
        await sendWithTypingDelay(
          chatId,
          content.erros.opcaoInvalida(content.opcoes.modelo)
        );
        break;
      }
      session.data.modelo =
        userMessage === "1"
          ? "Fat"
          : userMessage === "2"
          ? "Slim"
          : "Super Slim";
      session.stage = 4;
      await sendWithTypingDelay(chatId, content.pedidos.ano);
      break;

    case 4: // Pedir ano
      const ano = parseInt(userMessage);
      if (isNaN(ano) || ano < 2007 || ano > 2015) {
        await sendWithTypingDelay(chatId, content.erros.anoInvalido);
        break;
      }
      session.data.ano = ano;

      if (ano === 2015) {
        session.stage = 41;
        await sendWithTypingDelay(chatId, content.pedidos.avisoAno2015);
      } else {
        session.stage = 5;
        await sendWithTypingDelay(chatId, content.pedidos.armazenamento);
      }
      break;

    case 41: // Confirmação do ano 2015
      if (userMessage === "1") {
        session.stage = 5;
        await sendWithTypingDelay(chatId, content.pedidos.armazenamento);
      } else {
        await sendWithTypingDelay(chatId, content.saudacao.finalizado);
        await supabase.from("sessions").delete().eq("chatId", chatId);
      }
      break;

    case 5: // Pedir armazenamento
      if (!["1", "2", "3", "4"].includes(userMessage)) {
        await sendWithTypingDelay(
          chatId,
          content.erros.opcaoInvalida(content.opcoes.armazenamento)
        );
        break;
      }

      if (userMessage === "4") {
        session.data.armazenamento = "Não possui";
        session.stage = 51;
        await sendWithTypingDelay(
          chatId,
          content.pedidos.avisoSemArmazenamento
        );
        break;
      }

      session.data.armazenamento =
        userMessage === "1"
          ? "HD interno"
          : userMessage === "2"
          ? "HD externo"
          : "Pendrive 16GB+";
      session.stage = 6;

      let listaJogos = "";
      const limiteJogos = 15;
      for (const key in config.jogos) {
        listaJogos += `${key}. ${config.jogos[key]}\n`;
      }
      await sendWithTypingDelay(
        chatId,
        `${content.pedidos.escolherJogos(limiteJogos)}\n${listaJogos}${
          content.instrucoesReiniciarOuEncerrar
        }`
      );
      break;

    case 51: // Confirmação de sem armazenamento
      if (userMessage === "1") {
        session.data.tipo_servico = "Somente desbloqueio";
        session.stage = 7;
        await sendWithTypingDelay(chatId, content.pedidos.localizacao);
      } else {
        await sendWithTypingDelay(chatId, content.saudacao.finalizado);
        await supabase.from("sessions").delete().eq("chatId", chatId);
      }
      break;

    case 6: // Escolher jogos
      const jogosOpcoes = config.jogos;
      let numerosEscolhidos = userMessage
        .split(",")
        .map((n) => n.trim())
        .filter((n) => n !== "");

      if (numerosEscolhidos.length === 0 || numerosEscolhidos.length > 15) {
        await sendWithTypingDelay(chatId, content.erros.jogosInvalidos);
        break;
      }

      const todosValidos = numerosEscolhidos.every((n) => jogosOpcoes[n]);
      if (!todosValidos) {
        await sendWithTypingDelay(
          chatId,
          `${content.erros.jogosNumerosInvalidos} ${Object.keys(
            jogosOpcoes
          ).join(", ")}.`
        );
        break;
      }

      let jogosSelecionados = numerosEscolhidos.map((n) => jogosOpcoes[n]);
      session.data.jogos = jogosSelecionados;
      session.stage = 7;
      await sendWithTypingDelay(chatId, content.pedidos.localizacao);
      break;

    case 7: // Confirmação e resumo
      if (!["1", "2"].includes(userMessage)) {
        await sendWithTypingDelay(chatId, content.erros.simNaoInvalido);
        break;
      }

      const ano_data = session.data.ano;
      const armazenamento = session.data.armazenamento;
      let tipo_servico;

      if (ano_data === 2015 && armazenamento !== "Não possui") {
        tipo_servico = "Copiar jogos";
      } else if (ano_data !== 2015 && armazenamento === "Não possui") {
        tipo_servico = "Somente desbloqueio";
      } else if (ano_data !== 2015 && armazenamento !== "Não possui") {
        tipo_servico = "Desbloqueio + jogos";
      } else {
        tipo_servico = "Serviço não definido";
      }
      session.data.tipo_servico = tipo_servico;

      let resumo = `
*🆔 ID DO SERVIÇO:* ${session.data.serviceId}
*📋 RESUMO DO PEDIDO:*
👤 NOME: ${session.data.nome}
📧 EMAIL: ${session.data.email}
🏠 ENDEREÇO: ${session.data.endereco}
🎮 MODELO: ${session.data.modelo}
📅 ANO: ${session.data.ano}
💾 ARMAZENAMENTO: ${session.data.armazenamento}
🛠️ SERVIÇO: ${session.data.tipo_servico}`;

      if (session.data.jogos) {
        resumo += `\n🎮 JOGOS:`;
        session.data.jogos.forEach((jogo, index) => {
          resumo += `\n${index + 1}. ${jogo}`;
        });
      }

      await sendWithTypingDelay(chatId, resumo);

      if (userMessage === "1") {
        await sendWithTypingDelay(
          chatId,
          `📍 Localização: ${config.localizacao}`
        );
      }

      const { data, error } = await supabase.from("pedidos").insert([
        {
          service_id: session.data.serviceId,
          nome: session.data.nome,
          email: session.data.email,
          endereco: session.data.endereco,
          modelo: session.data.modelo,
          ano: session.data.ano,
          armazenamento: session.data.armazenamento,
          tipo_servico: session.data.tipo_servico,
          jogos: session.data.jogos,
        },
      ]);

      if (error) {
        logError("Erro ao salvar os dados no Supabase", error, session);
      } else {
        logInfo("Dados do pedido salvos com sucesso", session);
      }

      session.stage = 8;
      await sendWithTypingDelay(
        chatId,
        content.pedidos.concluido(session.data.nome)
      );
      await new Promise((resolve) => setTimeout(resolve, 1500));
      break;
  }

  const { error: updateError } = await supabase
    .from("sessions")
    .update(session)
    .eq("chatId", chatId);
  if (updateError) {
    console.error("Erro ao atualizar a sessão:", updateError);
  }
});

client.initialize();
