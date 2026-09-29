import { TouristSpot } from "../types/touristSpots";

export const touristSpots: TouristSpot[] = [
  // CURITIBA
  {
    id: "1",
    name: "Jardim Botânico",
    destinationId: "curitiba",
    location: "Curitiba — Paraná",
    image: require("../../assets/imgs/Curitiba/JardimBotanico/pexels-guilherme-stecanella-173739360-20052850.jpg"),
    description:
      "Um dos principais cartões-postais de Curitiba, o Jardim Botânico se destaca pela natureza e pela famosa estufa de ferro e vidro, que abriga espécies vegetais da Mata Atlântica. O espaço também oferece áreas para caminhada e contemplação.",
    category: "Natureza e paisagem",
    openingHours: "06h às 19h30",
    price: "Gratuito",
    duration: "Variável",
    gallery: [
      require("../../assets/imgs/Curitiba/JardimBotanico/pexels-leonardodourado-17081895.jpg"),
      require("../../assets/imgs/Curitiba/JardimBotanico/pexels-lud-araujo-94538248-9200051.jpg"),
      require("../../assets/imgs/Curitiba/JardimBotanico/pexels-viniciusvieirafotografia-34174715.jpg"),
    ],
  },

  {
    id: "2",
    name: "Museu Oscar Niemeyer",
    destinationId: "curitiba",
    location: "Curitiba — Paraná",
    image: require("../../assets/imgs/Curitiba/MuseuOscarNiemeyer/pexels-paulofreitas-12673270.jpg"),
    description:
      "Um dos principais espaços culturais de Curitiba, o Museu Oscar Niemeyer reúne exposições de artes visuais, arquitetura e design. Conhecido como “Museu do Olho”, destaca-se também pela arquitetura do edifício projetado por Oscar Niemeyer.",
    category: "Arte e cultura",
    openingHours: "Terça a domingo, das 10h às 17h30",
    price:
      "R$ 36,00 (inteira) | R$ 18,00 (meia-entrada) \n *Pode variar o valor*",
    duration: "Tempo de visitação de 2 a 3 horas",
    gallery: [
      require("../../assets/imgs/Curitiba/MuseuOscarNiemeyer/pexels-katsuhina-travels-18227517.jpg"),
      require("../../assets/imgs/Curitiba/MuseuOscarNiemeyer/pexels-eliezer-fernandes-515183518-36172452.jpg"),
    ],
  },

  // FOZ DO IGUAÇU
  {
    id: "3",
    name: "Cataratas do Iguaçu",
    destinationId: "foz-do-iguacu",
    location: "Foz do Iguaçu — Paraná",
    image: require("../../assets/imgs/FozdoIguacu/pexels-rodrigo-menezes-363900771-31833569.jpg"),
    description:
      "Uma das principais atrações de Foz do Iguaçu, as Cataratas impressionam pela grandiosidade das quedas da água e pela paisagem natural ao redor. Localizadas no Parque Nacional do Iguaçu, são um dos grandes destaques para quem visita a região.",
    category: "Natureza",
    openingHours:
      "Segunda a sexta - 9h às 16h \n Sábados e domingos - 8h30 às 16h \n Permanência no parque até 17h30",
    price:
      "Ingresso obrigatório — compra antecipada com escolha de dia e horário.",
    duration:
      "Variável — depende do ritmo e das atividades realizadas no parque.",
    gallery: [
      require("../../assets/imgs/FozdoIguacu/pexels-drethousand-8571241.jpg"),
      require("../../assets/imgs/FozdoIguacu/pexels-jairo-beiza-2079653575-29848509.jpg"),
    ],
  },

  {
    id: "4",
    name: "Parque das Aves",
    destinationId: "foz-do-iguacu",
    location: "Foz do Iguaçu — Paraná",
    image: require("../../assets/imgs/FozdoIguacu/pexels-luri-36839858.jpg"),
    description:
      "O Parque das Aves oferece uma experiência imersiva em meio à Mata Atlântica, com viveiros onde é possível observar de perto diversas espécies de aves. O espaço também atua na conservação e no acolhimento de animais resgatados.",
    category: "Natureza e vida selvagem",
    openingHours: "Todos os dias, das 8h30 às 16h30.",
    price:
      "R$ 110,00 — valor informado pela Secretaria de Turismo de Foz do Iguaçu.",
    duration: "Média de 3 horas",
    gallery: [],
  },

  // SÃO PAULO
  {
    id: "5",
    name: "Avenida Paulista",
    destinationId: "sao-paulo",
    location: "São Paulo — São Paulo",
    image: require("../../assets/imgs/SaoPaulo/pexels-lucaspezeta-2592319.jpg"),
    description:
      "Um dos principais símbolos de São Paulo, a Avenida Paulista reúne museus, centros culturais, restaurantes, lojas e espaços de lazer, sendo um dos lugares mais movimentados e diversos da cidade.",
    category: "Cidade, cultura e lazer",
    openingHours: "Aberto 24 horas",
    price: "Gratuito",
    duration: "2 a 4 horas",
    gallery: [],
  },

  // SÃO PAULO CAMPOS DO JORDÃO
  {
    id: "6",
    name: "Capivari",
    destinationId: "campos-do-jordao",
    location: "Campos do Jordão — São Paulo",
    image: require("../../assets/imgs/CamposDoJordao/pexels-manoel-junior-664863191-18030380.jpg"),
    description:
      "O centro turístico de Campos do Jordão, conhecido pelo charme de sua arquitetura em estilo europeu, reúne restaurantes, lojas e diversas opções de lazer. O bairro ganha ainda mais movimento durante o inverno e é um dos principais pontos para conhecer a atmosfera da cidade.",
    category: "Cultura e lazer",
    openingHours: "Consulte no local",
    price: "Variável",
    duration: "Variável",
    gallery: [],
  },

  // RIO DE JANEIRO
  {
    id: "7",
    name: "Pão de Açúcar",
    destinationId: "rio-de-janeiro",
    location: "Urca — Rio de Janeiro",
    image: require("../../assets/imgs/RioDeJaneiro/pexels-rodrigo-menezes-363900771-17218514.jpg"),
    description:
      "Um dos principais cartões-postais do Rio de Janeiro, o Pão de Açúcar oferece uma vista panorâmica da Baía de Guanabara, das praias e de diversos pontos da cidade. A visita inclui o passeio de teleférico entre a Praia Vermelha, o Morro da Urca e o Pão de Açúcar.",
    category: "Natureza e paisagem",
    openingHours: "08:30 às 21:00",
    price: "A partir de R$ 160",
    duration: "2 a 3 horas",
    gallery: [
      require("../../assets/imgs/RioDeJaneiro/pexels-bruno-almeida-1423946545-26589702.jpg"),
    ],
  },

  // FLORIANÓPOLIS
  {
    id: "8",
    name: "Praia da Joaquina",
    destinationId: "florianopolis",
    location: "Joaquina — Florianópolis, Santa Catarina",
    image: require("../../assets/imgs/Florianopolis/pexels-clayton-de-araujo-414048915-15202803.jpg"),
    description:
      "Uma das praias mais conhecidas de Florianópolis, a Joaquina se destaca pelo surfe, pelas dunas e pelas atividades esportivas. O local também é conhecido pelo nascer do sol e possui restaurantes e paradores.",
    category: "Praia e natureza",
    openingHours: "Aberto 24 horas",
    price: "Gratuito",
    duration: "Variável",
    gallery: [],
  },

  {
    id: "9",
    name: "Lagoa da Conceição",
    destinationId: "florianopolis",
    location: "Lagoa da Conceição — Florianópolis, Santa Catarina",
    image: require("../../assets/imgs/Florianopolis/pexels-vivian-venhasque-484321734-35350010.jpg"),
    description:
      "Uma das principais atrações de Florianópolis, a Lagoa da Conceição reúne paisagens naturais, esportes náuticos, trilhas, gastronomia, cultura e música.",
    category: "Natureza e lazer",
    openingHours: "Aberto 24 horas",
    price: "Gratuito",
    duration: "Variável",
    gallery: [
      require("../../assets/imgs/Florianopolis/pexels-matheus-de-moraes-gugelmim-38060312-30182267.jpg"),
      require("../../assets/imgs/Florianopolis/pexels-brnncmps-13424578.jpg"),
    ],
  },

  // SALVADOR
  {
    id: "10",
    name: "Pelourinho",
    destinationId: "salvador",
    location: "Centro Histórico — Salvador, Bahia",
    image: require("../../assets/imgs/salvador/pexels-leonardodourado-12989844.jpg"),
    description:
      "Um dos principais símbolos de Salvador, o Pelourinho reúne patrimônio histórico, manifestações culturais, arte e espaços ligados à história e à cultura afro-brasileira.",
    category: "Cultura e história",
    openingHours: "Todos os dias",
    price: "Gratuito",
    duration: "3 horas",
    gallery: [
      require("../../assets/imgs/salvador/pexels-marcelo-gonzalez-1141370437-31792604.jpg"),
      require("../../assets/imgs/salvador/pexels-matheus-albuquerque-1819283-6472045.jpg"),
    ],
  },

  {
    id: "11",
    name: "Farol da Barra",
    destinationId: "salvador",
    location: "Barra — Salvador, Bahia",
    image: require("../../assets/imgs/salvador/pexels-rodrigo-kokama-538969654-32639802.jpg"),
    description:
      "Um dos principais cartões-postais de Salvador, o Farol da Barra está instalado no histórico Forte de Santo Antônio da Barra. O local abriga o Museu Náutico da Bahia e oferece vista para o Oceano Atlântico e a Baía de Todos os Santos.",
    category: "História e cultura",
    openingHours: "Consulte o horário atualizado",
    price: "R$ 20,00 inteira / R$ 10,00 meia",
    duration: "Variável",
    gallery: [
      require("../../assets/imgs/salvador/pexels-almir-reis-1982745319-29354790.jpg"),
    ],
  },

  // RECIFE
  {
    id: "12",
    name: "Praia de Boa Viagem",
    destinationId: "recife",
    location: "Boa Viagem — Recife, Pernambuco",
    image: require("../../assets/imgs/recife/pexels-vikeph-21314188.jpg"),
    description:
      "Um dos principais cartões-postais do Recife, a Praia de Boa Viagem possui uma extensa orla com piscinas naturais, ciclovia, áreas de lazer, quiosques, hotéis e restaurantes.",
    category: "Praia e lazer",
    openingHours: "Acesso público",
    price: "Gratuito",
    duration: "Variável",
    gallery: [],
  },

  {
    id: "13",
    name: "Marco Zero",
    destinationId: "recife",
    location: "Recife Antigo — Recife, Pernambuco",
    image: require("../../assets/imgs/recife/pexels-vikeph-17488159.jpg"),
    description:
      "Um dos espaços mais simbólicos do Recife e porta de entrada do Recife Antigo, o Marco Zero reúne patrimônio histórico, paisagem urbana, convivência e grandes eventos culturais.",
    category: "Cultura e história",
    openingHours: "Aberto 24 horas",
    price: "Acesso livre",
    duration: "Variável",
    gallery: [require("../../assets/imgs/recife/pexels-japy-16229750.jpg")],
  },
];
