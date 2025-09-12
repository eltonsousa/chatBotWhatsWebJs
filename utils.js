// utils.js
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

module.exports = {
  logInfo,
  logError,
  sendWithTypingDelay,
};
