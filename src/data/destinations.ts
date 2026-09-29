import { Destination } from "../types/destination";

export const destinations: Destination[] = [
  {
    id: "curitiba",
    name: "Curitiba",
    country: "Brasil",
    state: "Paraná",
    continent: "América do Sul",
    latitude: -25.4278,
    longitude: -49.2731,
    image: require("../../assets/imgs/Curitiba/pexels-natalierodrigues-38921374.jpg"),
    description:
      "Curitiba combina natureza, cultura e inovação, com parques, museus, arquitetura e diversas experiências de lazer.",
    bestTimeToVisit: "Abril a Junho",
    toVisitDesc:
      "O período de abril a junho costuma ter clima mais ameno e estável, sendo uma boa época para aproveitar caminhadas, parques e eventos culturais. Ainda assim, cada estação oferece experiências diferentes de clima, eventos e paisagens, e a melhor escolha depende do que você deseja vivenciar em Curitiba.",
    weather: {
      temperature: 0,
      condition: "Indisponível",
      humidity: 0,
    },
  },

  {
    id: "foz-do-iguacu",
    name: "Foz do Iguaçu",
    country: "Brasil",
    state: "Paraná",
    continent: "América do Sul",
    latitude: -25.5478,
    longitude: -54.5881,
    image: require("../../assets/imgs/FozdoIguacu/pexels-rodrigo-menezes-363900771-31833569.jpg"),
    description:
      "Foz do Iguaçu combina natureza, cultura e experiências únicas, com as famosas Cataratas do Iguaçu como um de seus principais atrativos.",
    bestTimeToVisit: "Março a junho e setembro a novembro",
    toVisitDesc:
      "Outono e primavera oferecem temperaturas mais agradáveis, entre 18 °C e 27 °C, e condições favoráveis para caminhadas e atividades ao ar livre. No verão, as Cataratas costumam apresentar maior volume de água, enquanto o inverno tem clima mais ameno e seco.",
    weather: {
      temperature: 0,
      condition: "Indisponível",
      humidity: 0,
    },
  },

  {
    id: "sao-paulo",
    name: "São Paulo",
    country: "Brasil",
    state: "São Paulo",
    continent: "América do Sul",
    latitude: -23.5475,
    longitude: -46.6361,
    image: require("../../assets/imgs/SaoPaulo/pexels-chris-flxxx-1711952-35699522.jpg"),
    description:
      "São Paulo combina cultura, gastronomia, arte, entretenimento e uma grande variedade de experiências em uma das cidades mais dinâmicas do Brasil.",
    bestTimeToVisit: "Março a maio e agosto a outubro",
    toVisitDesc:
      "Março a maio e agosto a outubro costumam ter temperaturas agradáveis e menos chuva, favorecendo caminhadas e atividades ao ar livre. A cidade, porém, pode ser visitada durante todo o ano, com eventos e atrações em diferentes épocas.",
    weather: {
      temperature: 0,
      condition: "Indisponível",
      humidity: 0,
    },
  },

  {
    id: "campos-do-jordao",
    name: "Campos do Jordão",
    country: "Brasil",
    state: "São Paulo",
    continent: "América do Sul",
    latitude: -22.7394,
    longitude: -45.5914,
    image: require("../../assets/imgs/CamposDoJordao/pexels-nei-macedo-1849975483-28530398.jpg"),
    description:
      "Campos do Jordão é um charmoso destino de inverno na Serra da Mantiqueira, conhecido pelo estilo europeu, gastronomia e paisagens de montanha.",
    bestTimeToVisit: "Junho a agosto",
    toVisitDesc:
      "O inverno é a época mais procurada para conhecer Campos do Jordão, especialmente durante o Festival de Inverno. A cidade também oferece restaurantes, trilhas, áreas verdes e atividades para diferentes perfis de viajantes.",
    weather: {
      temperature: 0,
      condition: "Indisponível",
      humidity: 0,
    },
  },

  {
    id: "rio-de-janeiro",
    name: "Rio de Janeiro",
    country: "Brasil",
    state: "Rio de Janeiro",
    continent: "América do Sul",
    latitude: -22.9068,
    longitude: -43.1729,
    image: require("../../assets/imgs/RioDeJaneiro/pexels-pedro-spinillo-30667713-31194159.jpg"),
    description:
      "Rio de Janeiro combina praias, natureza, cultura e alguns dos cartões-postais mais conhecidos do Brasil.",
    bestTimeToVisit: "Abril a junho e agosto a novembro",
    toVisitDesc:
      "Abril a junho e agosto a novembro costumam ter clima agradável e menos turistas. O verão é mais quente e movimentado, sendo uma boa época para aproveitar as praias.",
    weather: {
      temperature: 0,
      condition: "Indisponível",
      humidity: 0,
    },
  },

  {
    id: "florianopolis",
    name: "Florianópolis",
    country: "Brasil",
    state: "Santa Catarina",
    continent: "América do Sul",
    latitude: -27.5949,
    longitude: -48.5482,
    image: require("../../assets/imgs/Florianopolis/pexels-eumarcosgabriel-7899731.jpg"),
    description:
      "Florianópolis combina praias, lagoas, natureza e atividades ao ar livre em uma cidade marcada pela paisagem litorânea.",
    bestTimeToVisit: "Abril a novembro",
    toVisitDesc:
      "De abril a novembro, as temperaturas ficam mais amenas e a chuva tende a ser menor do que no verão. O período é favorável para conhecer praias, lagoas, trilhas e outras atrações ao ar livre. O verão continua sendo uma opção para quem busca dias mais quentes e atividades de praia.",
    weather: {
      temperature: 0,
      condition: "Indisponível",
      humidity: 0,
    },
  },

  {
    id: "salvador",
    name: "Salvador",
    country: "Brasil",
    state: "Bahia",
    continent: "América do Sul",
    latitude: -12.9777,
    longitude: -38.5016,
    image: require("../../assets/imgs/salvador/pexels-leonardodourado-16842380.jpg"),
    description:
      "Salvador reúne história, cultura, gastronomia, música, festas populares e um importante patrimônio arquitetônico.",
    bestTimeToVisit: "Agosto a dezembro",
    toVisitDesc:
      "De agosto a dezembro, Salvador costuma apresentar uma combinação mais favorável de temperaturas agradáveis e menor volume de chuva. A cidade, porém, recebe visitantes durante todo o ano e possui eventos e atrações em diferentes períodos.",
    weather: {
      temperature: 0,
      condition: "Indisponível",
      humidity: 0,
    },
  },

  {
    id: "recife",
    name: "Recife",
    country: "Brasil",
    state: "Pernambuco",
    continent: "América do Sul",
    latitude: -8.0476,
    longitude: -34.877,
    image: require("../../assets/imgs/recife/pexels-monica-rodrigues-97165652-29694588.jpg"),
    description:
      "Recife combina praias, rios, história, cultura e áreas naturais em uma cidade marcada por pontes e pelo litoral.",
    bestTimeToVisit: "Outubro a janeiro",
    toVisitDesc:
      "Entre outubro e janeiro, Recife costuma apresentar menor volume de chuvas e mais períodos de sol. A cidade pode ser visitada durante grande parte do ano, mas junho, julho e agosto concentram os maiores volumes de chuva.",
    weather: {
      temperature: 0,
      condition: "Indisponível",
      humidity: 0,
    },
  },
];
