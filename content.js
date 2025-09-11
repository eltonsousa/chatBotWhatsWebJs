const { localizacao } = require("./config");
const limiteJogos = parseInt(process.env.LIMITE_JOGOS);
const instrucoesReiniciarOuEncerrar = `_(digite 0️⃣ para reiniciar, ou 9️⃣ para encerrar)_`;
const instrucoesVoltarAoMenu = `\n\n_(digite 0️⃣ para voltar ao menu)_`;

module.exports = {
  instrucoesReiniciarOuEncerrar,
  instrucoesVoltarAoMenu,
  saudacao: {
    inicio:
      "👋 Olá! Seja bem-vindo(a) ao *CHATBOT DA HORA GAMES*! \n\nPara darmos início, me diga o seu *Nome* e *Sobrenome*?",
    reiniciado:
      "🔄 Fluxo reiniciado! \n\n👋 Olá! Seja bem-vindo(a) ao *CHATBOT DA HORA GAMES*! \n\nPara darmos início, me diga o seu *Nome* e *Sobrenome*?",
    faqInicio:
      "👋 Olá! Seja bem-vindo(a) ao *CHATBOT DA HORA GAMES*! \n\nPara iniciarmos, escolha uma das opções abaixo:\n",
    faqReiniciado:
      "🔄 Fluxo reiniciado! \n\n👋 Olá! Seja bem-vindo(a) ao *CHATBOT DA HORA GAMES*! \n\nPara iniciarmos, escolha uma das opções abaixo:\n",
    finalizado: "🚫 Atendimento finalizado. Obrigado! 🙏",
    encerrado: "👋 Atendimento encerrado. Esperamos te ver em breve! 🙏",
    retorno: (nome) =>
      `👋 Olá novamente, *${nome}!* O que gostaria de fazer?\n\n1️⃣ Ver resumo do último pedido\n2️⃣ Iniciar um novo pedido\n\n_(digite 9️⃣ para encerrar)_`,
    retornoAposResumo: `Você gostaria de:\n\n2️⃣ Iniciar um novo pedido\n9️⃣ Encerrar o atendimento`,
  },
  faq: {
    menu: `
*🟢 Dúvidas frequentes:*

_1️⃣ ❓ O que é desbloqueio RGH 3.0?_
_2️⃣ ⚙️ O que é preciso para desbloquear?_
_3️⃣ 🎮 Vc atende a domicílio? Quais são os jogos?_
_4️⃣ 🌐 Posso jogar online?_
_5️⃣ 🚚 Onde fica? entrega na hora?_
_6️⃣ 🛠️ O meu Xbox é um 2015, dá para desbloquear?_
_7️⃣ 💰 Quanto custa?_

*📌 Não tenho dúvidas e quero:*

*8️⃣ Continuar para atendimento*
_9️⃣ Encerrar atendimento_
`,
    opcoes: {
      1: `_🔧 O desbloqueio *RGH 3.0* permite rodar jogos direto do HD interno ou externo, sem precisar *comprar* jogos originais._

*Com ele você também pode:*

* Jogar emuladores
* Instalar apps e homebrews
* Personalizar o console
* Aproveitar muito mais recursos!${instrucoesVoltarAoMenu}`,
      2: `*_⚙️ Para fazer o desbloqueio, é necessário:_*

* Ter um Xbox 360 com fabricacão até 2014
* Um HD interno, externo ou pendrive de pelo menos 32gb ou +

_⚠️ Sem armazenamento não é possível copiar e nem jogar os games._${instrucoesVoltarAoMenu}`,
      3: `*🚚 Não atendemos a domicílio!*\n\n📍 _O cliente deve trazer o console no meu endereço._\n\n🎮 _Aqui está minha lista de jogos:_`,
      4: `_🌐 Há possibilidade usando servidores furtivos (pesquise no Youtube). O Xbox perde o acesso a Xbox Live para evitar banimento da sua conta._
🚫 O desbloqueio é ideal para jogar offline e aproveitar jogos direto do HD.${instrucoesVoltarAoMenu}`,
      5: `📍 Estamos localizados na Rua Malvino Reis Neto\n(antiga São Miguel), 10 - Bairro Novo israel.
Aqui está nossa localização:\n\n${localizacao}\n\n⏱️ O prazo de entrega é em média 24 horas.${instrucoesVoltarAoMenu}`,
      6: `🛠️ Os modelos fabricados a partir de 2015 não aceitam desbloqueio definitivo RGH 3.0.\n\n💾 Porém, existe um método alternativo via *Pendrive*, onde é necessário realizar um procedimento toda vez que ligar o Xbox.\nEstá em desenvolvimento mas é bastante utilizado.\n\n*⚠️ ATENÇÃO: ⚠️*\n_O mau uso pode danificar permanentemente seu Xbox._\n_*USE POR SUA CONTA EM RISCO!!!*_${instrucoesVoltarAoMenu}`,

      7: `_💰 O desbloqueio *RGH 3.0* custa *R$ 150,00*_

O valor já inclui:

✅ Limpeza interna
✅ Troca da pasta térmica
✅ Instalação de *${limiteJogos}* jogos da minha lista${instrucoesVoltarAoMenu}`,
    },
  },
  pedidos: {
    nome: (nome) =>
      `✅ Obrigado, *${nome}!*\n\n📧 Agora, informe o seu *email*:\n\n${instrucoesReiniciarOuEncerrar}`,
    email: `🏠 Informe o seu *endereço*:\n\n${instrucoesReiniciarOuEncerrar}`,
    endereco: `🎮 Qual o modelo do seu Xbox?\n\n1️⃣ Fat\n2️⃣ Slim\n3️⃣ Super Slim\n\n${instrucoesReiniciarOuEncerrar}`,
    ano: `📅 Informe o *ano* do console.
Anos aceitos: [2007 - 2015]:\n\n${instrucoesReiniciarOuEncerrar}`,
    armazenamento: `💾 Possui armazenamento?\n\n1️⃣ HD interno\n2️⃣ HD externo\n3️⃣ Pendrive 16GB+\n4️⃣ Não tenho\n\n${instrucoesReiniciarOuEncerrar}`,
    localizacao: `📍 Deseja receber o link da nossa localização?\n\n1️⃣ Sim\n2️⃣ Não\n\n${instrucoesReiniciarOuEncerrar}`,
    concluido: (nome) =>
      `✅ Atendimento concluído! Obrigado *${nome}*, até breve! 🙏`,
    avisoAno2015: `⚠️ Aparelhos de *2015 não podem ser desbloqueados definitivamente!*.\n\nDeseja continuar?\n\n1️⃣ Sim\n2️⃣ Não\n\n${instrucoesReiniciarOuEncerrar}`,
    avisoSemArmazenamento: `⚠️ Sem armazenamento não será possível jogar nem copiar jogos!\n\nO que você deseja:\n\n1️⃣ Continuar apenas com desbloqueio\n2️⃣ Finalizar\n\n${instrucoesReiniciarOuEncerrar}`,
    escolherJogos: (limiteJogos) =>
      `🎮 Escolha até *${limiteJogos} jogos* (digite os números separados por vírgula):`,
  },
  erros: {
    emailInvalido: `❌ Formato de email inválido! 
      Por favor, digite um email válido.
      Ex.:_seuemail@gmail.com_`,
    opcaoInvalida: (opcoes) => `❌ Opção inválida. Escolha:\n${opcoes}`,
    anoInvalido: "❌ Ano inválido! Digite o ano de 2007 a 2015.",
    jogosInvalidos: (limiteJogos) =>
      `❌ Escolha no mínimo 1 e no máximo *${limiteJogos} jogos*. Exemplo: 1,2,3`,
    jogosNumerosInvalidos:
      "❌ Um ou mais números de jogos são inválidos. Escolha entre:",
    simNaoInvalido: "❌ Opção inválida. Responda:\n\n1️⃣ Sim\n2️⃣ Não",
    opcaoRetornoInvalida:
      "❌ Opção inválida. Escolha:\n\n1️⃣ Ver resumo\n2️⃣ Iniciar um novo pedido",
    opcaoFaqInvalida:
      "❌ Opção inválida. Escolha entre 1️⃣ e 9️⃣, 8️⃣ para continuar, ou 0️⃣ para reiniciar o menu.",
    faqNaoZero: "❌ Por favor, digite 0️⃣ para voltar ao menu.",
  },
  opcoes: {
    modelo: "1️⃣ Fat\n2️⃣ Slim\n3️⃣ Super Slim",
    armazenamento:
      "1️⃣ HD interno\n2️⃣ HD externo\n3️⃣ Pendrive 16GB+\n4️⃣ Não tenho",
  },
};
