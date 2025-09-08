// index.js
const express = require("express");
const QRCode = require("qrcode");
const { Client, LocalAuth } = require("whatsapp-web.js");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

// Funções utilitárias
const { logInfo, logError, sendWithTypingDelay } = require("./utils.js");

// Handlers do fluxo de atendimento
const {
  handleInitialMessage,
  handleFaqMenu,
  handleAttendantFlow,
} = require("./flowHandlers.js");

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
    logError("Erro ao buscar a sessão", selectError, session);
    return;
  }

  // Lógica de encerramento e reinício no topo
  if (userMessage === "9") {
    if (session) {
      await supabase.from("sessions").delete().eq("chatId", chatId);
    }
    await sendWithTypingDelay(client, chatId, content.saudacao.encerrado);
    return;
  }

  if (userMessage === "0") {
    if (session) {
      session.stage = -1;
      session.data = {};
      await supabase.from("sessions").update(session).eq("chatId", chatId);
    }
    await sendWithTypingDelay(
      client,
      chatId,
      content.saudacao.faqReiniciado + content.faq.menu
    );
    return;
  }

  // Se a sessão não existir, cria uma nova ou redireciona para o handler inicial
  if (!session) {
    session = await handleInitialMessage(chatId, supabase, client);
    return;
  }

  // Direciona para o handler de FAQ ou para o fluxo de atendimento
  if (session.stage < 0) {
    await handleFaqMenu(userMessage, session, supabase, client);
  } else {
    await handleAttendantFlow(userMessage, session, supabase, client);
  }

  // Atualiza a sessão no banco de dados
  const { error: updateError } = await supabase
    .from("sessions")
    .update(session)
    .eq("chatId", chatId);
  if (updateError) {
    logError("Erro ao atualizar a sessão:", updateError, session);
  }
});

client.initialize();
