require("dotenv").config();
const { OpenAI } = require("openai");

const client = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

/**
 * Classifica a mensagem como:
 *  - "faq"      → vai para o menu de dúvidas
 *  - "cadastro" → inicia o fluxo de pedido
 *  - "neutro"   → segue o fluxo padrão
 */
async function classificarMensagemIA(texto) {
  try {
    const resposta = await client.chat.completions.create({
      model: "gemini-1.5-flash",
      messages: [
        {
          role: "system",
          content:
            "Você é um classificador de intenções do chatbot Da Hora Games. " +
            "Responda APENAS com uma das opções: faq, cadastro ou neutro.",
        },
        { role: "user", content: texto },
      ],
      max_tokens: 10,
      temperature: 0,
    });

    // Verifica se a resposta existe
    const saida =
      resposta.choices?.[0]?.message?.content?.trim()?.toLowerCase() ||
      "neutro";

    if (saida.includes("faq")) return "faq";
    if (saida.includes("cadastro")) return "cadastro";
    return "neutro";
  } catch (err) {
    console.error("⚠️ Erro ao classificar com Gemini:");
    console.error("Mensagem que estava sendo classificada:", texto);

    // Exibe detalhes se disponíveis
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Data:", err.response.data);
    }
    if (err.code) {
      console.error("Código de erro:", err.code);
    }
    console.error("Mensagem do erro:", err.message);

    return "neutro";
  }
}

module.exports = { classificarMensagemIA };
