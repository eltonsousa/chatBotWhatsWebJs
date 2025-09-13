// index.js
const express = require("express");
const QRCode = require("qrcode");
const { Client, LocalAuth } = require("whatsapp-web.js");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const crypto = require("crypto");
const { logInfo, logError, sendWithTypingDelay } = require("./utils.js");
const { classificarMensagemIA } = require("./intentAI.js");
const { handleMessage, handleFaqMenu } = require("./flowHandlers.js");
const content = require("./content.js");
const config = require("./config.js");
const faqKeywordsMap = require("./faqKeywords.js");

// Configura Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Inicializa cliente WhatsApp
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

client.on("ready", () => logInfo("🤖 CHATBOT está online!"));

// QR Code
let latestQR = null;
client.on("qr", (qr) => {
  latestQR = qr;
  console.log("⚡ Novo QR gerado. Acesse /qr para escanear.");
});

// Express server
const app = express();
app.get("/", (req, res) => res.send("OK"));
app.get("/qr", async (req, res) => {
  if (!latestQR)
    return res.send("Nenhum QR disponível. Aguarde o bot gerar um novo.");
  const qrImage = await QRCode.toDataURL(latestQR);
  res
    .type("html")
    .send(
      `<h2>Escaneie o QR Code abaixo com seu WhatsApp:</h2><br><img src="${qrImage}" />`
    );
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌍 Servidor rodando na porta ${PORT}`));

// Função para encontrar a opção FAQ
function encontrarOpcaoFAQ(msg) {
  const msgLower = msg.toLowerCase();
  for (const item of faqKeywordsMap) {
    if (item.keywords.some((k) => msgLower.includes(k))) {
      return item.op;
    }
  }
  return null;
}

const RATE_LIMIT_MS = 1000;

client.on("message", async (msg) => {
  const chatId = msg.from;
  const userMessage = msg.body.trim();
  const now = Date.now();

  // Busca sessão
  let { data: session, error: selectError } = await supabase
    .from("sessions")
    .select("*")
    .eq("chatId", chatId)
    .single();

  if (selectError && selectError.code !== "PGRST116") {
    logError("Erro ao buscar a sessão", selectError, { chatId, userMessage });
    return;
  }

  if (!session) {
    session = { chatId, stage: -1, data: {}, lastMessageTimestamp: 0 };
  }

  // Rate limiting
  if (now - (session.lastMessageTimestamp || 0) < RATE_LIMIT_MS) {
    logInfo("Mensagem ignorada devido ao rate limiting", {
      chatId,
      userMessage,
      session,
    });
    return;
  }
  session.lastMessageTimestamp = now;

  // 🔹 IA Gemini - só se a sessão estiver fora do fluxo de cadastro (stage < 0)
  if (!/^\d+$/.test(userMessage) && session.stage < 0) {
    try {
      const intencao = await classificarMensagemIA(userMessage);

      console.log("🧠 IA ativada!");
      console.log("ChatId:", chatId);
      console.log("Mensagem do usuário:", userMessage);
      console.log("Intenção detectada:", intencao);

      if (intencao === "faq") {
        const opcaoAutomatica = encontrarOpcaoFAQ(userMessage);

        if (opcaoAutomatica) {
          console.log(
            "📌 Redirecionando automaticamente para a opção do FAQ:",
            opcaoAutomatica
          );
          await handleFaqMenu(
            opcaoAutomatica,
            session,
            supabase,
            client,
            config.limiteJogos
          );
        } else {
          await sendWithTypingDelay(
            client,
            chatId,
            content.saudacao.faqInicio + content.faq.menu
          );
          session.stage = -1;
          await supabase.from("sessions").upsert(session);
        }
        return;
      }

      if (intencao === "cadastro") {
        const serviceId = `OS-${crypto
          .randomUUID()
          .substring(0, 8)
          .toUpperCase()}`;
        session.stage = 0;
        session.data = { ...session.data, serviceId };
        await supabase.from("sessions").upsert(session);
        await sendWithTypingDelay(client, chatId, content.saudacao.inicio);
        return;
      }
    } catch (err) {
      console.error("⚠️ Erro ao classificar mensagem com Gemini:", err);
    }
  }

  // Fluxo normal
  await handleMessage(
    userMessage,
    session,
    supabase,
    client,
    config.limiteJogos
  );

  // Salva sessão
  const { error: upsertError } = await supabase
    .from("sessions")
    .upsert(session);
  if (upsertError) {
    logError("Erro ao salvar/atualizar a sessão:", upsertError, {
      chatId,
      userMessage,
      session,
    });
    await sendWithTypingDelay(
      client,
      chatId,
      "Desculpe, ocorreu um problema ao processar seu pedido. Por favor, tente novamente ou digite '9' para encerrar o atendimento."
    );
  } else {
    logInfo("Sessão salva/atualizada com sucesso", {
      chatId,
      userMessage,
      session,
    });
  }
});

client.initialize();
