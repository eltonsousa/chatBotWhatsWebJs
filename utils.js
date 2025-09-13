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

// Função para simular a digitação e enviar a mensagem
async function sendWithTypingDelay(client, chatId, message, delayMs = 1500) {
  const chat = await client.getChatById(chatId);
  await chat.sendStateTyping();
  await new Promise((resolve) => setTimeout(resolve, delayMs));
  await client.sendMessage(chatId, message);
}

function formatarListaDeJogos(jogosArray) {
  // Cria uma cópia do array e o ordena em ordem alfabética
  const jogosOrdenados = [...jogosArray].sort((a, b) => a.localeCompare(b));

  // Mapeia o array ordenado para uma string com numeração (1., 2., 3., etc.)
  return jogosOrdenados
    .map((jogo, index) => `${index + 1}. ${jogo}`)
    .join("\n");
}

module.exports = {
  logInfo,
  logError,
  sendWithTypingDelay,
  formatarListaDeJogos,
};
