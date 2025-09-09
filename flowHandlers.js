// flowHandlers.js
const { v4: uuidv4 } = require("uuid");
const config = require("./config.js");
const content = require("./content.js");
const { sendWithTypingDelay, logInfo, logError } = require("./utils.js");

// Mapa de handlers para cada estágio do fluxo de atendimento
const attendantFlowMap = {
  0: async (userMessage, session, supabase, client) => {
    session.data.nome = userMessage;
    session.stage = 1;
    await sendWithTypingDelay(
      client,
      session.chatId,
      content.pedidos.nome(session.data.nome)
    );
  },
  1: async (userMessage, session, supabase, client) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userMessage)) {
      await sendWithTypingDelay(
        client,
        session.chatId,
        content.erros.emailInvalido
      );
      return;
    }
    session.data.email = userMessage;
    session.stage = 2;
    await sendWithTypingDelay(client, session.chatId, content.pedidos.email);
  },
  2: async (userMessage, session, supabase, client) => {
    session.data.endereco = userMessage;
    session.stage = 3;
    await sendWithTypingDelay(client, session.chatId, content.pedidos.endereco);
  },
  3: async (userMessage, session, supabase, client) => {
    if (!["1", "2", "3"].includes(userMessage)) {
      await sendWithTypingDelay(
        client,
        session.chatId,
        content.erros.opcaoInvalida(content.opcoes.modelo)
      );
      return;
    }
    session.data.modelo =
      userMessage === "1" ? "Fat" : userMessage === "2" ? "Slim" : "Super Slim";
    session.stage = 4;
    await sendWithTypingDelay(client, session.chatId, content.pedidos.ano);
  },
  4: async (userMessage, session, supabase, client) => {
    const ano = parseInt(userMessage);
    if (isNaN(ano) || ano < 2007 || ano > 2015) {
      await sendWithTypingDelay(
        client,
        session.chatId,
        content.erros.anoInvalido
      );
      return;
    }
    session.data.ano = ano;

    if (ano === 2015) {
      session.stage = 41;
      await sendWithTypingDelay(
        client,
        session.chatId,
        content.pedidos.avisoAno2015
      );
    } else {
      session.stage = 5;
      await sendWithTypingDelay(
        client,
        session.chatId,
        content.pedidos.armazenamento
      );
    }
  },
  41: async (userMessage, session, supabase, client) => {
    if (userMessage === "1") {
      session.stage = 5;
      await sendWithTypingDelay(
        client,
        session.chatId,
        content.pedidos.armazenamento
      );
    } else {
      session.stage = 9; // Vai para o estágio finalizado
      await sendWithTypingDelay(
        client,
        session.chatId,
        content.saudacao.finalizado
      );
    }
  },
  5: async (userMessage, session, supabase, client) => {
    if (!["1", "2", "3", "4"].includes(userMessage)) {
      await sendWithTypingDelay(
        client,
        session.chatId,
        content.erros.opcaoInvalida(content.opcoes.armazenamento)
      );
      return;
    }

    if (userMessage === "4") {
      session.data.armazenamento = "Não possui";
      session.stage = 51;
      await sendWithTypingDelay(
        client,
        session.chatId,
        content.pedidos.avisoSemArmazenamento
      );
      return;
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
      client,
      session.chatId,
      `${content.pedidos.escolherJogos(limiteJogos)}\n${listaJogos}${
        content.instrucoesReiniciarOuEncerrar
      }`
    );
  },
  51: async (userMessage, session, supabase, client) => {
    if (userMessage === "1") {
      session.data.tipo_servico = "Somente desbloqueio";
      session.stage = 7;
      await sendWithTypingDelay(
        client,
        session.chatId,
        content.pedidos.localizacao
      );
    } else {
      session.stage = 9; // Vai para o estágio finalizado
      await sendWithTypingDelay(
        client,
        session.chatId,
        content.saudacao.finalizado
      );
    }
  },
  6: async (userMessage, session, supabase, client) => {
    const jogosOpcoes = config.jogos;
    let numerosEscolhidos = userMessage
      .split(",")
      .map((n) => n.trim())
      .filter((n) => n !== "");

    if (numerosEscolhidos.length === 0 || numerosEscolhidos.length > 15) {
      await sendWithTypingDelay(
        client,
        session.chatId,
        content.erros.jogosInvalidos
      );
      return;
    }

    const todosValidos = numerosEscolhidos.every((n) => jogosOpcoes[n]);
    if (!todosValidos) {
      await sendWithTypingDelay(
        client,
        session.chatId,
        `${content.erros.jogosNumerosInvalidos} ${Object.keys(jogosOpcoes).join(
          ", "
        )}.`
      );
      return;
    }

    let jogosSelecionados = numerosEscolhidos.map((n) => jogosOpcoes[n]);
    session.data.jogos = jogosSelecionados;
    session.stage = 7;
    await sendWithTypingDelay(
      client,
      session.chatId,
      content.pedidos.localizacao
    );
  },
  7: async (userMessage, session, supabase, client) => {
    if (!["1", "2"].includes(userMessage)) {
      await sendWithTypingDelay(
        client,
        session.chatId,
        content.erros.simNaoInvalido
      );
      return;
    }

    const { ano, armazenamento, jogos, ...pedidoData } = session.data;
    let tipo_servico;

    if (ano === 2015 && armazenamento !== "Não possui") {
      tipo_servico = "Copiar jogos";
    } else if (ano !== 2015 && armazenamento === "Não possui") {
      tipo_servico = "Somente desbloqueio";
    } else if (ano !== 2015 && armazenamento !== "Não possui") {
      tipo_servico = "Desbloqueio + jogos";
    } else {
      tipo_servico = "Serviço não definido";
    }
    session.data.tipo_servico = tipo_servico;

    let resumo = `
*🆔 ID DO SERVIÇO:* _${session.data.serviceId}_
*📋 RESUMO DO PEDIDO:*
👤 NOME: _${session.data.nome}_
📧 EMAIL: _${session.data.email}_
🏠 ENDEREÇO: _${session.data.endereco}_
🎮 MODELO: _${session.data.modelo}_
📅 ANO: _${session.data.ano}_
💾 ARMAZENAMENTO: _${session.data.armazenamento}_
🛠️ SERVIÇO: _${session.data.tipo_servico}_`;

    if (session.data.jogos) {
      resumo += `\n🎮 JOGOS:`;
      session.data.jogos.forEach((jogo, index) => {
        resumo += `\n_${index + 1}._ _${jogo}_`;
      });
    }

    await sendWithTypingDelay(client, session.chatId, resumo);

    if (userMessage === "1") {
      await sendWithTypingDelay(
        client,
        session.chatId,
        `📍 Localização: ${config.localizacao}`
      );
    }

    const { error } = await supabase.from("pedidos").insert([
      {
        service_id: session.data.serviceId,
        nome: session.data.nome,
        email: session.data.email,
        endereco: session.data.endereco,
        modelo: session.data.modelo,
        ano: session.data.ano,
        armazenamento: session.data.armazenamento,
        tipo_servico: tipo_servico,
        jogos: jogos,
      },
    ]);

    if (error) {
      logError("Erro ao salvar os dados no Supabase", error, session);
    } else {
      logInfo("Dados do pedido salvos com sucesso", session);
    }

    session.stage = 8;
    await sendWithTypingDelay(
      client,
      session.chatId,
      content.pedidos.concluido(session.data.nome)
    );
    await new Promise((resolve) => setTimeout(resolve, 1500));
  },
  8: async (userMessage, session, supabase, client) => {
    // 🔹 Novo comportamento: ao retornar, mostra saudação com nome se não digitou opção válida
    if (!userMessage || !["1", "2", "9"].includes(userMessage)) {
      await sendWithTypingDelay(
        client,
        session.chatId,
        content.saudacao.retorno(session.data.nome)
      );
      return;
    }

    if (userMessage === "1") {
      // Opção 1: Ver resumo do último pedido
      const { data: pedido, error: pedidoError } = await supabase
        .from("pedidos")
        .select("*")
        .eq("service_id", session.data.serviceId)
        .single();

      if (pedidoError || !pedido) {
        await sendWithTypingDelay(
          client,
          session.chatId,
          "⚠️ Não foi possível encontrar seu último pedido. Por favor, inicie um novo atendimento."
        );
        session.stage = -1;
        session.data = {};
        return;
      }

      let resumo = `
*📋 RESUMO DO SEU ÚLTIMO PEDIDO:*
🆔 ID DO SERVIÇO: _${pedido.service_id}_
👤 NOME: _${pedido.nome}_
📧 EMAIL: _${pedido.email}_
🏠 ENDEREÇO: _${pedido.endereco}_
🎮 MODELO: _${pedido.modelo}_
📅 ANO: _${pedido.ano}_
💾 ARMAZENAMENTO: _${pedido.armazenamento}_
🛠️ SERVIÇO: _${pedido.tipo_servico}_`;

      if (pedido.jogos) {
        resumo += `\n🎮 JOGOS:`;
        pedido.jogos.forEach((jogo, index) => {
          resumo += `\n_${index + 1}._ _${jogo}_`;
        });
      }

      await sendWithTypingDelay(client, session.chatId, resumo);
      await sendWithTypingDelay(
        client,
        session.chatId,
        content.saudacao.retornoAposResumo
      );
      return;
    } else if (userMessage === "2") {
      // Opção 2: Iniciar um novo pedido
      session.stage = -1;
      session.data = {};
      await sendWithTypingDelay(
        client,
        session.chatId,
        content.saudacao.faqReiniciado + content.faq.menu
      );
      return;
    } else if (userMessage === "9") {
      // Encerrar atendimento
      await supabase.from("sessions").delete().eq("chatId", session.chatId);
      session.stage = -1;
      session.data = {};
      await sendWithTypingDelay(
        client,
        session.chatId,
        content.saudacao.finalizado
      );
      return;
    }
  },
  9: async (userMessage, session, supabase, client) => {
    await supabase.from("sessions").delete().eq("chatId", session.chatId);
    session.stage = -1;
    session.data = {};
    await sendWithTypingDelay(
      client,
      session.chatId,
      content.saudacao.finalizado
    );
  },
};

// Funções para gerenciar o fluxo principal
async function handleFaqMenu(userMessage, session, supabase, client) {
  const isValidFaqOption = ["1", "2", "3", "4", "5", "6", "7", "8"].includes(
    userMessage
  );

  if (!isValidFaqOption) {
    await sendWithTypingDelay(
      client,
      session.chatId,
      content.saudacao.faqInicio + content.faq.menu
    );
    return;
  }

  if (userMessage === "3") {
    let listaJogos = "";
    for (const key in config.jogos) {
      listaJogos += `*${key}.* ${config.jogos[key]}\n`;
    }
    const mensagemCompleta = `${content.faq.opcoes[userMessage]}\n\n${listaJogos}${content.instrucoesVoltarAoMenu}`;
    await sendWithTypingDelay(client, session.chatId, mensagemCompleta);
    session.stage = -2;
  } else if (userMessage in content.faq.opcoes) {
    await sendWithTypingDelay(
      client,
      session.chatId,
      content.faq.opcoes[userMessage]
    );
    session.stage = -2;
  } else if (userMessage === "7") {
    session.stage = 0;
    const serviceId = `OS-${uuidv4().substring(0, 8).toUpperCase()}`;
    session.data.serviceId = serviceId;
    await sendWithTypingDelay(client, session.chatId, content.saudacao.inicio);
  } else if (userMessage === "8") {
    await supabase.from("sessions").delete().eq("chatId", session.chatId);
    await sendWithTypingDelay(
      client,
      session.chatId,
      content.saudacao.finalizado
    );
  }
}

async function handleAttendantFlow(userMessage, session, supabase, client) {
  const handler = attendantFlowMap[session.stage];
  if (handler) {
    await handler(userMessage, session, supabase, client);
  }
}

async function handleMessage(userMessage, session, supabase, client) {
  if (userMessage === "9") {
    await attendantFlowMap[9](userMessage, session, supabase, client);
    return;
  }

  if (userMessage === "0") {
    session.stage = -1;
    session.data = {};
    await sendWithTypingDelay(
      client,
      session.chatId,
      content.saudacao.faqReiniciado + content.faq.menu
    );
    return;
  }

  if (session.stage === -2) {
    if (userMessage !== "0") {
      await sendWithTypingDelay(
        client,
        session.chatId,
        content.erros.faqNaoZero
      );
      return;
    }
    session.stage = -1;
    await sendWithTypingDelay(
      client,
      session.chatId,
      content.saudacao.faqReiniciado + content.faq.menu
    );
    return;
  }

  if (session.stage < 0) {
    await handleFaqMenu(userMessage, session, supabase, client);
  } else {
    await handleAttendantFlow(userMessage, session, supabase, client);
  }
}

module.exports = {
  handleFaqMenu,
  handleAttendantFlow,
  handleMessage,
};
