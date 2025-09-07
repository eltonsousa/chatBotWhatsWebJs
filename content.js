// content.js
const instrucoesVoltarAoMenu = `_(digite 0️⃣ para voltar ao menu)_`;
const instrucoesReiniciarOuEncerrar = `_(digite 0️⃣ para reiniciar, ou 9️⃣ para encerrar)_`;

module.exports = {
  instrucoesReiniciarOuEncerrar,
  saudacao: {
    inicio:
      "👋 Olá! Seja bem-vindo ao *CHATBOT DA HORA GAMES*! \n\nPara darmos início, me diga o seu *nome* e *sobrenome*?",
    reiniciado:
      "🔄 Fluxo reiniciado! \n\n👋 Olá! Seja bem-vindo ao *CHATBOT DA HORA GAMES*! \n\nPara darmos início, me diga o seu *nome* e *sobrenome*?",
    faqInicio:
      "👋 Olá! Bem-vindo à *Da Hora Games*! \n\nPara começarmos, escolha uma das opções abaixo para tirar suas dúvidas:",
    faqReiniciado:
      "🔄 Fluxo reiniciado! \n\n👋 Olá! Bem-vindo à *Da Hora Games*! \n\nPara começarmos, escolha uma das opções abaixo para tirar suas dúvidas:",
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
    opcaoFaqInvalida:
      "❌ Opção inválida. Escolha entre 1️⃣ e 8️⃣ ou 0️⃣ para voltar.",
    faqNaoZero: "❌ Por favor, digite 0️⃣ para voltar ao menu.",
  },
  opcoes: {
    modelo: "1️⃣ Fat\n2️⃣ Slim\n3️⃣ Super Slim",
    armazenamento:
      "1️⃣ HD interno\n2️⃣ HD externo\n3️⃣ Pendrive 16GB+\n4️⃣ Não tenho",
  },

  faq: {
    menu: `
*🟢 Menu de Dúvidas - Xbox 360 (RGH3)*
1️⃣ ❓ O que é RGH3?
2️⃣ ⚙️ Requisitos
3️⃣ 🎮 Lista de jogos
4️⃣ 🌐 Jogar online
5️⃣ 🚚 Atendimento / Prazo
6️⃣ 💰 Valor do serviço

*📌 Opções extras:*
7️⃣ Continuar para atendimento
8️⃣ Encerrar atendimento
`,
    opcoes: {
      1: "🔧 O desbloqueio RGH3 permite rodar jogos direto do HD interno ou externo, sem precisar comprar jogos originais.\nCom ele você também pode:\n\n* Jogar emuladores\n* Instalar apps e homebrews\n* Personalizar o console\n* Aproveitar muito mais recursos!\n\n${instrucoesVoltarAoMenu}",
      2: "⚙️ Para fazer o desbloqueio, é necessário:\n\n* Ter um Xbox 360 fabricado até 2014\n* Um HD interno, externo ou pendrive de pelo menos 16GB\n\n⚠️ Sem armazenamento não é possível copiar e nem jogar os games.\n\n${instrucoesVoltarAoMenu}",
      // Removida a instrução daqui para que seja adicionada no final da lista de jogos
      3: "🎮 Tenho uma lista atualizada de jogos para instalação:",
      4: "🌐 Não é recomendado jogar online com Xbox desbloqueado, pois existe risco de banimento da Xbox Live.\n🚫 O desbloqueio é ideal para jogar offline e aproveitar jogos direto do HD.\n\n${instrucoesVoltarAoMenu}",
      5: "🚚 Não atendo a domicílio.\n📍 O cliente deve trazer o console no meu endereço.\n\n⏱️ O prazo de entrega é em média 24 horas.\n\n${instrucoesVoltarAoMenu}",
      6: "💰 O desbloqueio RGH3 custa R$ 150,00.\nO valor já inclui:\n\n✅ Limpeza interna\n✅ Troca da pasta térmica\n✅ Instalação de 15 jogos da minha lista\n\n${instrucoesVoltarAoMenu}",
    },
  },
};
