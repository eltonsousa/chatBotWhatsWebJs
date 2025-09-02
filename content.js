// content.js

module.exports = {
  saudacao: {
    inicio:
      "👋 Olá! Seja bem-vindo ao *CHATBOT DA HORA GAMES*! \n\nPara darmos início me diga o seu *nome* e *sobrenome*?",
    reiniciado:
      "🔄 Fluxo reiniciado!\n\n👋 👋 Olá! Seja bem-vindo ao *CHATBOT DA HORA GAMES*! \n\nQual é o seu *nome*?",
    finalizado: "🚫 Atendimento finalizado. Obrigado! 🙏",
  },
  pedidos: {
    nome: (nome) =>
      `✅ Obrigado, ${nome}!\n\n📧 Agora, informe o seu *email*:\n(_Se quiser reiniciar, digite_ 0️⃣)`,
    email: "🏠 Informe o seu *endereço*:\n(_Se quiser reiniciar, digite_ 0️⃣)",
    endereco:
      "🎮 Qual o modelo do seu Xbox?\n\n1️⃣ Fat\n2️⃣ Slim\n3️⃣ Super Slim\n\n(_Se quiser reiniciar, digite_ 0️⃣)",
    ano: "📅 Informe o *ano* do console [2007 - 2015]:\n(_Se quiser reiniciar, digite_ 0️⃣)",
    armazenamento:
      "💾 Possui armazenamento?\n1️⃣ HD interno\n2️⃣ HD externo\n3️⃣ Pendrive 16GB+\n4️⃣ Não tenho\n(_Se quiser reiniciar, digite_ 0️⃣)",
    localizacao:
      "📍 Deseja receber o link da nossa localização?\n1️⃣ Sim\n2️⃣ Não\n(_Se quiser reiniciar, digite_ 0️⃣)",
    concluido: (nome) =>
      `✅ Atendimento concluído! Obrigado ${nome}, até breve! 🙏\n\nSe quiser reiniciar, digite_ 0️⃣`,
    avisoAno2015: `⚠️ Aparelhos de *2015 não podem ser desbloqueados definitivamente!*.\nDeseja continuar?\n1️⃣ Sim\n2️⃣ Não\n(_Se quiser reiniciar, digite_ 0️⃣)`,
    avisoSemArmazenamento: `⚠️ Sem armazenamento não será possível jogar nem copiar jogos!\nO que vc deseja:\n1️⃣ Continuar apenas com desbloqueio\n2️⃣ Finalizar\n(_Se quiser reiniciar, digite_ 0️⃣)`,
  },
  erros: {
    opcaoInvalida: "❌ Opção inválida. Escolha:",
    anoInvalido: "❌ Ano inválido. Digite entre 2007 e 2015",
    jogosInvalidos:
      "❌ Escolha no mínimo 1 e no máximo 3 jogos. Exemplo: 1,2,3",
    jogosNumerosInvalidos:
      "❌ Por favor, escolha apenas números de jogos válidos.",
    simNaoInvalido: "❌ Opção inválida. Responda:\n1️⃣ Sim\n2️⃣ Não",
  },
};
