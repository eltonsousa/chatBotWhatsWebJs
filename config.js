require("dotenv").config();

module.exports = {
  // Opções de jogos disponíveis
  jogos: {
    1: "Angry Birds Trilogy",
    2: "Assassin's Creed II",
    3: "Brazucas 23 (PES 2013)",
    4: "Call of Duty: Advanced Warfare",
    5: "Call of Duty: Black Ops II",
    6: "Call of Duty: Ghosts",
    7: "Call of Duty 2",
    8: "Crysis 2",
    9: "Dante's Inferno",
    10: "Disney Universe",
    11: "Far Cry 3",
    12: "FIFA 19",
    13: "Forza Horizon",
    14: "GTA V",
    15: "Halo 4",
    16: "Metal Slug 3",
    17: "Metal Slug X",
    18: "Metro 2033",
    19: "Mortal Kombat",
    20: "Need for Speed: Most Wanted",
    21: "Pac-Man",
    22: "PES 2018",
    23: "Resident Evil 4",
    24: "Sonic & Sega All-Stars Racing",
    25: "Spider-Man: Shattered Dimensions",
    26: "Super Street Fighter IV",
  },
  // Localização da loja
  localizacao: process.env.LOCALIZACAO_LOJA,
};
