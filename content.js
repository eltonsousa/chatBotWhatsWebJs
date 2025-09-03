// content.js
module.exports = {
  saudacao: {
    inicio:
      "👋 Olá! Seja bem-vindo ao *CHATBOT DA HORA GAMES*! \n\nPara darmos início, me diga o seu *nome* e *sobrenome*?",
    reiniciado:
      "🔄 Fluxo reiniciado!\n\n👋 Olá! Seja bem-vindo ao *CHATBOT DA HORA GAMES*! \n\nPara darmos início, me diga o seu *nome* e *sobrenome*?",
    finalizado: "🚫 Atendimento finalizado. Obrigado! 🙏",
    encerrado: "👋 Atendimento encerrado. Esperamos te ver em breve! 🙏",
  },
  pedidos: {
    nome: (nome) =>
      `✅ Obrigado, ${nome}!\n\n📧 Agora, informe o seu *email*:\n(Se quiser reiniciar, digite 0️⃣ ou encerrar, digite 9️⃣)`,
    email:
      "🏠 Informe o seu *endereço*:\n(Se quiser reiniciar, digite 0️⃣ ou encerrar, digite 9️⃣)",
    endereco:
      "🎮 Qual o modelo do seu Xbox?\n\n1️⃣ Fat\n2️⃣ Slim\n3️⃣ Super Slim\n\n(Se quiser reiniciar, digite 0️⃣ ou encerrar, digite 9️⃣)",
    ano: "📅 Informe o *ano* do console [2007 - 2015]:\n(Se quiser reiniciar, digite 0️⃣ ou encerrar, digite 9️⃣)",
    armazenamento:
      "💾 Possui armazenamento?\n1️⃣ HD interno\n2️⃣ HD externo\n3️⃣ Pendrive 16GB+\n4️⃣ Não tenho\n(Se quiser reiniciar, digite 0️⃣ ou encerrar, digite 9️⃣)",
    localizacao:
      "📍 Deseja receber o link da nossa localização?\n1️⃣ Sim\n2️⃣ Não\n(Se quiser reiniciar, digite 0️⃣ ou encerrar, digite 9️⃣)",
    concluido: (nome) =>
      `✅ Atendimento concluído! Obrigado, ${nome}, até breve! 🙏\n\n(Se quiser reiniciar, digite 0️⃣)`,
    avisoAno2015: `⚠️ Aparelhos de *2015 não podem ser desbloqueados definitivamente!*.\nDeseja continuar?\n1️⃣ Sim\n2️⃣ Não\n(Se quiser reiniciar, digite 0️⃣ ou encerrar, digite 9️⃣)`,
    avisoSemArmazenamento: `⚠️ Sem armazenamento não será possível jogar nem copiar jogos!\nO que você deseja:\n1️⃣ Continuar apenas com desbloqueio\n2️⃣ Finalizar\n(Se quiser reiniciar, digite 0️⃣ ou encerrar, digite 9️⃣)`,
  },
  erros: {
    emailInvalido:
      "❌ Formato de email inválido. Por favor, digite um email válido.",
    opcaoInvalida: (opcoes) => `❌ Opção inválida. Escolha:\n${opcoes}`,
    anoInvalido: "❌ Ano inválido. Digite entre 2007 e 2015",
    jogosInvalidos:
      "❌ Escolha no mínimo 1 e no máximo 3 jogos. Exemplo: 1,2,3",
    jogosNumerosInvalidos:
      "❌ Por favor, escolha apenas números de jogos válidos. Opções: ",
    simNaoInvalido: "❌ Opção inválida. Responda:\n1️⃣ Sim\n2️⃣ Não",
  },
  opcoes: {
    modelo: "1️⃣ Fat\n2️⃣ Slim\n3️⃣ Super Slim",
    armazenamento:
      "1️⃣ HD interno\n2️⃣ HD externo\n3️⃣ Pendrive 16GB+\n4️⃣ Não tenho",
  },
};
