// content.js
module.exports = {
  saudacao: {
    inicio:
      "👋 Olá! Seja bem-vindo ao *CHATBOT DA HORA GAMES*! \n\nPara darmos início, me diga o seu *nome* e *sobrenome*?",
    reiniciado:
      "🔄 Atendimento reiniciado. Vamos começar de novo? Por favor, me diga o seu *nome* e *sobrenome*?",
    finalizado: "🚫 Atendimento finalizado. Obrigado! 🙏",
    encerrado: "👋 Atendimento encerrado. Esperamos te ver em breve! 🙏",
  },
  pedidos: {
    nome: (nome) =>
      `✅ Obrigado, ${nome}!\n\n📧 Agora, informe o seu *email*:\n\n_(digite 0️⃣ para reiniciar, ou 9️⃣ para encerrar)_`,
    email:
      "🏠 Informe o seu *endereço*:\n\n_(digite 0️⃣ para reiniciar, ou 9️⃣ para encerrar)_",
    endereco:
      "🎮 Qual o modelo do seu Xbox?\n\n1️⃣ Fat\n2️⃣ Slim\n3️⃣ Super Slim\n\n_(digite 0️⃣ para reiniciar, ou 9️⃣ para encerrar)_",
    ano: "📅 Informe o *ano* do console [2007 - 2015]:\n\n_(digite 0️⃣ para reiniciar, ou 9️⃣ para encerrar)_",
    armazenamento:
      "💾 Possui armazenamento?\n\n1️⃣ HD interno\n2️⃣ HD externo\n3️⃣ Pendrive 16GB+\n4️⃣ Não tenho\n\n_(digite 0️⃣ para reiniciar, ou 9️⃣ para encerrar)_",
    localizacao:
      "📍 Deseja receber o link da nossa localização?\n\n1️⃣ Sim\n2️⃣ Não\n\n_(digite 0️⃣ para reiniciar, ou 9️⃣ para encerrar)_",
    concluido: (nome) =>
      `✅ Atendimento concluído! Obrigado, ${nome}, até breve! 🙏`,
    avisoAno2015: `⚠️ Aparelhos de *2015 não podem ser desbloqueados definitivamente!*.\n\nDeseja continuar?\n\n1️⃣ Sim\n2️⃣ Não\n\n_(digite 0️⃣ para reiniciar, ou 9️⃣ para encerrar)_`,
    avisoSemArmazenamento: `⚠️ Sem armazenamento não será possível jogar nem copiar jogos!\n\nO que você deseja:\n\n1️⃣ Continuar apenas com desbloqueio\n2️⃣ Finalizar\n\n_(digite 0️⃣ para reiniciar, ou 9️⃣ para encerrar)_`,
  },
  erros: {
    emailInvalido:
      "❌ Formato de email inválido. Por favor, digite um email válido.",
    opcaoInvalida: (opcoes) => `❌ Opção inválida. Escolha:\n${opcoes}`,
    anoInvalido: "❌ Ano inválido. Digite entre 2007 e 2015",
    jogosInvalidos:
      "❌ Escolha no mínimo 1 e no máximo 15 jogos. Exemplo: 1,2,3",
    jogosNumerosInvalidos:
      "❌ Por favor, escolha apenas números de jogos válidos. Opções: ",
    simNaoInvalido: "❌ Opção inválida. Responda:\n\n1️⃣ Sim\n2️⃣ Não",
  },
  opcoes: {
    modelo: "1️⃣ Fat\n2️⃣ Slim\n3️⃣ Super Slim",
    armazenamento:
      "1️⃣ HD interno\n2️⃣ HD externo\n3️⃣ Pendrive 16GB+\n4️⃣ Não tenho",
  },
  pedidos: {
    escolherJogos: (limitJogos) =>
      `🎮 Escolha até *${limitJogos} jogos* (digite os números separados por vírgula):`,
  },
};
