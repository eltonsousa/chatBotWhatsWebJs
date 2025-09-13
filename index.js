// index.js
const express = require("express");
const QRCode = require("qrcode");
const { Client, LocalAuth } = require("whatsapp-web.js");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

// Funções utilitárias
const { logInfo, logError, sendWithTypingDelay } = require("./utils.js");
// OpenAi
const { classificarMensagemIA } = require("./intentAI.js");
const crypto = require("crypto"); // se ainda não estiver importado

// Importação do arquivo de conteúdo
const content = require("./content.js");
const config = require("./config.js");
// Handlers do fluxo de atendimento
const { handleMessage, handleFaqMenu } = require("./flowHandlers.js");

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
const RATE_LIMIT_MS = 1000; // Limite de 1 segundo entre mensagens

// Fluxo de mensagens
client.on("message", async (msg) => {
  const chatId = msg.from;
  const userMessage = msg.body.trim();
  const RATE_LIMIT_MS = 1000;
  const now = Date.now();

  let { data: session, error: selectError } = await supabase
    .from("sessions")
    .select("*")
    .eq("chatId", chatId)
    .single();

  if (selectError && selectError.code !== "PGRST116") {
    logError("Erro ao buscar a sessão", selectError, { chatId, userMessage });
    return;
  }

  if (
    session?.lastMessageTimestamp &&
    now - session.lastMessageTimestamp < RATE_LIMIT_MS
  ) {
    logInfo("Mensagem ignorada devido ao rate limiting", {
      chatId,
      userMessage,
      session,
    });
    return;
  }

  if (!session) {
    session = { chatId, stage: -1, data: {}, lastMessageTimestamp: now };
  }
  session.lastMessageTimestamp = now;

  // 🔹 Chamada da IA GEMINI
  if (!/^\d+$/.test(userMessage)) {
    try {
      const intencao = await classificarMensagemIA(userMessage);

      // LOG detalhado
      console.log("🧠 IA ativada!");
      console.log("ChatId:", chatId);
      console.log("Mensagem do usuário:", userMessage);
      console.log("Intenção detectada:", intencao);

      if (intencao === "faq") {
        const msgLower = userMessage.toLowerCase();

        // 🔹 Mapa de palavras-chave para redirecionamento automático
        const faqKeywordsMap = [
          { op: "1", keywords: ["desbloqueio rgh", "rgh"] },
          { op: "2", keywords: ["o que é preciso", "preciso desbloquear"] },
          {
            op: "3",
            keywords: ["domicílio", "joga", "jogos", "atendimento em casa"],
          },
          { op: "4", keywords: ["online", "jogar online", "multiplayer"] },
          {
            op: "5",
            keywords: [
              "onde fica",
              "loja",
              "onde vc mora",
              "onde voce mora",
              "onde você mora",
              "entrega",
              "localização",
            ],
          },
          { op: "6", keywords: ["2015", "meu xbox é 2015", "xbox 2015"] },
          { op: "7", keywords: ["quanto custa", "preço", "quanto é"] },
          {
            op: "8",
            keywords: ["continuar", "atendimento", "não tenho dúvidas"],
          },
        ];

        let opcaoAutomatica = null;
        for (const item of faqKeywordsMap) {
          if (item.keywords.some((k) => msgLower.includes(k))) {
            opcaoAutomatica = item.op;
            break;
          }
        }

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
          // Caso não encontre correspondência, mostra o menu completo
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

  // Continua para o fluxo normal
  await handleMessage(
    userMessage,
    session,
    supabase,
    client,
    config.limiteJogos
  );

  // Salva/atualiza a sessão
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
