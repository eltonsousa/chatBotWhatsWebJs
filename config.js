require("dotenv").config();

module.exports = {
  // Opções de jogos disponíveis
  jogos: [
    "Angry Birds Trilogy",
    "Assassin's Creed II",
    "Brazucas 23 (PES 2013)",
    "Call of Duty: Advanced Warfare",
    "Call of Duty: Black Ops II",
    "Call of Duty: Ghosts",
    "Call of Duty 2",
    "Crysis 2",
    "Dante's Inferno",
    "Disney Universe",
    "Far Cry 3",
    "FIFA 19",
    "Forza Horizon",
    "GTA V",
    "Halo 4",
    "Metal Slug 3",
    "Metal Slug X",
    "Metro 2033",
    "Mortal Kombat",
    "Need for Speed: Most Wanted",
    "Pac-Man",
    "PES 2018",
    "Resident Evil 4",
    "Sonic & Sega All-Stars Racing",
    "Spider-Man: Shattered Dimensions",
    "Super Street Fighter IV",
    "Emulador Super Nitendo",
    "Black",
  ],
  // Localização da loja
  localizacao: process.env.LOCALIZACAO_LOJA,

  // Adicione seu número de celular para receber notificações do bot
  numeroAtendente: process.env.NUMERO_ATENDENTE,

  // Garante que o valor seja um número, com 15 como padrão.
  limiteJogos: parseInt(process.env.LIMITE_JOGOS) || 15,
};
