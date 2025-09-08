const instrucoesReiniciarOuEncerrar = `_(digite 0️⃣ para reiniciar, ou 9️⃣ para encerrar)_`;
const instrucoesVoltarAoMenu = `\n\n_(digite 0️⃣ para voltar ao menu)_`;

module.exports = {
  instrucoesReiniciarOuEncerrar,
  instrucoesVoltarAoMenu,
  saudacao: {
    inicio:
      "👋 Olá! Seja bem-vindo ao *CHATBOT DA HORA GAMES*! \n\nPara darmos início, me diga o seu *nome* e *sobrenome*?",
    reiniciado:
      "🔄 Fluxo reiniciado! \n\n👋 Olá! Seja bem-vindo ao *CHATBOT DA HORA GAMES*! \n\nPara darmos início, me diga o seu *nome* e *sobrenome*?",
    faqInicio:
      "👋 Olá! Bem-vindo à *Da Hora Games*! \n\nPara iniciarmos, escolha uma das opções abaixo:\n",
    faqReiniciado:
      "🔄 Fluxo reiniciado! \n\n👋 Olá! Bem-vindo à *Da Hora Games*! \n\nPara iniciarmos, escolha uma das opções abaixo:\n",
    finalizado: "🚫 Atendimento finalizado. Obrigado! 🙏",
    encerrado: "👋 Atendimento encerrado. Esperamos te ver em breve! 🙏",
    retorno: (nome) =>
      `👋 Olá novamente, ${nome}! O que você gostaria de fazer?\n\n1️⃣ Ver resumo do último pedido\n2️⃣ Iniciar um novo pedido\n\n_(digite 9️⃣ para encerrar)_`,
    retornoAposResumo: `Você gostaria de:\n\n2️⃣ Iniciar um novo pedido\n9️⃣ Encerrar o atendimento`,
  },
  faq: {
    menu: `
*🟢 Dúvidas sobre desbloqueio Xbox 360*

1️⃣ ❓ O que é desbloqueio RGH 3.0?
2️⃣ ⚙️ Requisitos
3️⃣ 🎮 Lista de jogos
4️⃣ 🌐 Posso jogar online?
5️⃣ 🚚 Atendimento / Prazo
6️⃣ 💰 Valor do serviço

*📌 Não tenho dúvidas e quero...:*
7️⃣ Continuar para atendimento
8️⃣ Encerrar atendimento
`,
    opcoes: {
      1: `🔧 O desbloqueio RGH 3.0 permite rodar jogos direto do HD interno ou externo, sem precisar comprar jogos originais.
Com ele você também pode:

* Jogar emuladores
* Instalar apps e homebrews
* Personalizar o console
* Aproveitar muito mais recursos!${instrucoesVoltarAoMenu}`,
      2: `⚙️ Para fazer o desbloqueio, é necessário:

* Ter um Xbox 360 com fabricacão até 2014
* Um HD interno, externo ou pendrive de pelo menos 32gb ou +

⚠️ Sem armazenamento não é possível copiar e nem jogar os games.${instrucoesVoltarAoMenu}`,
      3: "🎮 Aqui está minha lista de jogos:",
      4: `🌐 Há possibilidade usando servidores furtivos (pesquise no Youtube). O Xbox perde o acesso a Xbox Live para evitar banimento da sua conta.
🚫 O desbloqueio é ideal para jogar offline e aproveitar jogos direto do HD.${instrucoesVoltarAoMenu}`,
      5: `🚚 Não atendemos a domicílio.
📍 O cliente deve trazer o console no meu endereço.

⏱️ O prazo de entrega é em média 24 horas.${instrucoesVoltarAoMenu}`,
      6: `💰 O desbloqueio RGH3 custa R$ 150,00.
O valor já inclui:

✅ Limpeza interna
✅ Troca da pasta térmica
✅ Instalação de 15 jogos da minha lista${instrucoesVoltarAoMenu}`,
    },
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
};
