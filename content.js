// content.js
const instrucoesReiniciarOuEncerrar = `_(digite 0️⃣ para reiniciar, ou 9️⃣ para encerrar)_`;

module.exports = {
  instrucoesReiniciarOuEncerrar,
  saudacao: {
    inicio:
      "👋 Olá! Seja bem-vindo ao *CHATBOT DA HORA GAMES*! \n\nPara darmos início, me diga o seu *nome* e *sobrenome*?",
    reiniciado:
      "🔄 Fluxo reiniciado! \n\n👋 Olá! Seja bem-vindo ao *CHATBOT DA HORA GAMES*! \n\nPara darmos início, me diga o seu *nome* e *sobrenome*?",
    finalizado: "🚫 Atendimento finalizado. Obrigado! 🙏",
    encerrado: "👋 Atendimento encerrado. Esperamos te ver em breve! 🙏",
    retorno: (nome) =>
      `👋 Olá novamente, ${nome}! O que você gostaria de fazer?\n\n1️⃣ Ver resumo do último pedido\n2️⃣ Iniciar um novo pedido\n\n_(digite 9️⃣ para encerrar)_`,
    retornoAposResumo: `Você gostaria de:\n\n2️⃣ Iniciar um novo pedido\n9️⃣ Encerrar o atendimento`,
  },
  pedidos: {
    nome: (nome) =>
      `✅ Obrigado, ${nome}!\n\n📧 Agora, informe o seu *email*:\n\n${instrucoesReiniciarOuEncerrar}`,
    email: `🏠 Informe o seu *endereço*:\n\n${instrucoesReiniciarOuEncerrar}`,
    endereco: `🎮 Qual o modelo do seu Xbox?\n\n1️⃣ Fat\n2️⃣ Slim\n3️⃣ Super Slim\n\n${instrucoesReiniciarOuEncerrar}`,
    ano: `📅 Informe o *ano* do console [2007 - 2015]:\n\n${instrucoesReiniciarOuEncerrar}`,
    armazenamento: `💾 Possui armazenamento?\n\n1️⃣ HD interno\n2️⃣ HD externo\n3️⃣ Pendrive 16GB+\n4️⃣ Não tenho\n\n${instrucoesReiniciarOuEncerrar}`,
    localizacao: `📍 Deseja receber o link da nossa localização?\n\n1️⃣ Sim\n2️⃣ Não\n\n${instrucoesReiniciarOuEncerrar}`,
    concluido: (nome) =>
      `✅ Atendimento concluído! Obrigado, ${nome}, até breve! 🙏`,
    avisoAno2015: `⚠️ Aparelhos de *2015 não podem ser desbloqueados definitivamente!*.\n\nDeseja continuar?\n\n1️⃣ Sim\n2️⃣ Não\n\n${instrucoesReiniciarOuEncerrar}`,
    avisoSemArmazenamento: `⚠️ Sem armazenamento não será possível jogar nem copiar jogos!\n\nO que você deseja:\n\n1️⃣ Continuar apenas com desbloqueio\n2️⃣ Finalizar\n\n${instrucoesReiniciarOuEncerrar}`,
    escolherJogos: (limiteJogos) =>
      `🎮 Escolha até *${limiteJogos} jogos* (digite os números separados por vírgula):`,
  },
  erros: {
    emailInvalido:
      "❌ Formato de email inválido. Por favor, digite um email válido.",
    opcaoInvalida: (opcoes) => `❌ Opção inválida. Escolha:\n${opcoes}`,
    anoInvalido: "❌ Ano inválido. Digite entre 2007 e 2015.",
    jogosInvalidos:
      "❌ Escolha no mínimo 1 e no máximo 15 jogos. Exemplo: 1,2,3",
    jogosNumerosInvalidos:
      "❌ Um ou mais números de jogos são inválidos. Escolha entre:",
    simNaoInvalido: "❌ Opção inválida. Responda:\n\n1️⃣ Sim\n2️⃣ Não",
    opcaoRetornoInvalida:
      "❌ Opção inválida. Escolha:\n\n1️⃣ Ver resumo\n2️⃣ Iniciar um novo pedido",
  },
  opcoes: {
    modelo: "1️⃣ Fat\n2️⃣ Slim\n3️⃣ Super Slim",
    armazenamento:
      "1️⃣ HD interno\n2️⃣ HD externo\n3️⃣ Pendrive 16GB+\n4️⃣ Não tenho",
  },
};
