const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
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
// Logs personalizados

// Importa as configurações e o conteúdo
const config = require("./config.js");
const content = require("./content.js");

// Configura o cliente Supabase usando as variáveis de ambiente
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Inicializa o cliente do WhatsApp
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true },
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

// client.on("ready", () => {
//   console.log("🤖 CHATBOT DA HORA GAMES está online!");
// });

logInfo("🤖 CHATBOT está online!");

client.on("message", async (msg) => {
  const chatId = msg.from;

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

  // Se a mensagem for '0', reinicia a sessão
  if (msg.body.trim() === "0") {
    if (session) {
      await supabase.from("sessions").delete().eq("chatId", chatId);
    }
    await client.sendMessage(chatId, content.saudacao.reiniciado);
    return;
  }

  // Se a mensagem for '9', encerra a sessão
  if (msg.body.trim() === "9") {
    if (session) {
      await supabase.from("sessions").delete().eq("chatId", chatId);
    }
    await client.sendMessage(chatId, content.saudacao.encerrado);
    return;
  }

  // Se a sessão não existir, cria uma nova no banco de dados
  if (!session) {
    const { error: insertError } = await supabase.from("sessions").insert([
      {
        chatId: chatId,
        stage: 0,
        data: {},
      },
    ]);
    if (insertError) {
      console.error("Erro ao criar nova sessão:", insertError);
      return;
    }
    // Busca a nova sessão para continuar o fluxo
    const { data: newSession, error: fetchError } = await supabase
      .from("sessions")
      .select("*")
      .eq("chatId", chatId)
      .single();
    if (fetchError) {
      console.error("Erro ao buscar a sessão recém-criada:", fetchError);
      return;
    }
    session = newSession;
    await client.sendMessage(chatId, content.saudacao.inicio);
    return;
  }

  // O restante da sua lógica 'switch'
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
        break; // Use break para continuar na mesma etapa
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
        break;
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
        break;
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
        await supabase.from("sessions").delete().eq("chatId", chatId);
      }
      break;

    case 5:
      if (!["1", "2", "3", "4"].includes(msg.body.trim())) {
        await client.sendMessage(
          chatId,
          content.erros.opcaoInvalida(content.opcoes.armazenamento)
        );
        break;
      }

      if (msg.body.trim() === "4") {
        session.data.armazenamento = "Não possui";
        session.stage = 51;
        await client.sendMessage(chatId, content.pedidos.avisoSemArmazenamento);
        break;
      }

      session.data.armazenamento =
        msg.body.trim() === "1"
          ? "HD interno"
          : msg.body.trim() === "2"
          ? "HD externo"
          : "Pendrive 16GB+";
      session.stage = 6;

      let listaJogos = "";
      const limiteJogos = 15; // Define o limite de jogos aqui
      for (const key in config.jogos) {
        listaJogos += `${key}. ${config.jogos[key]}\n`;
      }
      await client.sendMessage(
        chatId,
        `${content.pedidos.escolherJogos(limiteJogos)}\n${listaJogos}${
          content.instrucoesReiniciarOuEncerrar
        }`
      );
      break;

    case 51:
      if (msg.body.trim() === "1") {
        session.data.tipo_servico = "Somente desbloqueio";
        session.stage = 7;
        await client.sendMessage(chatId, content.pedidos.localizacao);
      } else {
        await client.sendMessage(chatId, content.saudacao.finalizado);
        await supabase.from("sessions").delete().eq("chatId", chatId);
      }
      break;

    case 6:
      const jogosOpcoes = config.jogos;
      let numerosEscolhidos = msg.body.split(",").map((n) => n.trim());

      if (numerosEscolhidos.length === 0 || numerosEscolhidos.length > 15) {
        await client.sendMessage(chatId, content.erros.jogosInvalidos);
        break;
      }

      const todosValidos = numerosEscolhidos.every((n) => jogosOpcoes[n]);
      if (!todosValidos) {
        await client.sendMessage(
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
      await client.sendMessage(chatId, content.pedidos.localizacao);
      break;

    case 7:
      if (!["1", "2"].includes(msg.body.trim())) {
        await client.sendMessage(chatId, content.erros.simNaoInvalido);
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
*📋 Resumo do Pedido:*
👤 Nome: ${session.data.nome}
📧 Email: ${session.data.email}
🏠 Endereço: ${session.data.endereco}
🎮 Modelo: ${session.data.modelo}
📅 Ano: ${session.data.ano}
💾 Armazenamento: ${session.data.armazenamento}
🛠️ Serviço: ${session.data.tipo_servico}`;

      if (session.data.jogos) {
        resumo += `\n🎮 Jogos:`;
        session.data.jogos.forEach((jogo, index) => {
          resumo += `\n${index + 1}. ${jogo}`;
        });
      }

      await client.sendMessage(chatId, resumo);

      if (msg.body.trim() === "1") {
        await client.sendMessage(
          chatId,
          `📍 Localização: ${config.localizacao}`
        );
      }

      // 💾 LÓGICA PARA SALVAR OS DADOS NO SUPABASE 💾
      const { data, error } = await supabase.from("pedidos").insert([
        {
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

      // Deleta a sessão 'sessions' após o pedido finalizado
      await supabase.from("sessions").delete().eq("chatId", chatId);
      await client.sendMessage(
        chatId,
        content.pedidos.concluido(session.data.nome)
      );
      break;
  }

  // Atualiza o estado da sessão no banco de dados após cada etapa
  const { error: updateError } = await supabase
    .from("sessions")
    .update(session)
    .eq("chatId", chatId);
  if (updateError) {
    console.error("Erro ao atualizar a sessão:", updateError);
  }
});

client.initialize();
