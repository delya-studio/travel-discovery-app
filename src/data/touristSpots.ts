import { TouristSpot } from "../types/touristSpots";

export const touristSpots: TouristSpot[] = [
  // CURITIBA
  {
    id: "1",
    name: "Jardim Botânico",
    destinationId: "1",
    location: "Curitiba — Paraná",
    image: "https://images.unsplash.com/photo-1500534623283-312aade485b7",
    description:
      "Um dos cartões-postais de Curitiba, conhecido pelos jardins e pela famosa estufa de vidro.",
    category: "Natureza",
    openingHours: "06:00 às 20:00",
    price: "Gratuito",
    gallery: [],
    weather: {
      temperature: 22,
      condition: "Parcialmente nublado",
      humidity: 70,
    },
  },

  {
    id: "2",
    name: "Museu Oscar Niemeyer",
    destinationId: "1",
    location: "Curitiba — Paraná",
    image: "https://images.unsplash.com/photo-1564399579883-451a5d44ec08",
    description:
      "Museu dedicado às artes visuais, arquitetura, design e cultura.",
    category: "Cultura",
    openingHours: "10:00 às 18:00",
    price: "A partir de R$ 15",
    gallery: [],
    weather: {
      temperature: 22,
      condition: "Parcialmente nublado",
      humidity: 70,
    },
  },

  {
    id: "3",
    name: "Ópera de Arame",
    destinationId: "1",
    location: "Curitiba — Paraná",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
    description:
      "Espaço cultural cercado pela natureza e conhecido por sua estrutura metálica.",
    category: "Cultura",
    openingHours: "10:00 às 18:00",
    price: "Gratuito",
    gallery: [],
    weather: {
      temperature: 22,
      condition: "Parcialmente nublado",
      humidity: 70,
    },
  },

  // FOZ DO IGUAÇU
  {
    id: "4",
    name: "Cataratas do Iguaçu",
    destinationId: "2",
    location: "Foz do Iguaçu — Paraná",
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5",
    description:
      "Um dos maiores conjuntos de quedas-d'água do mundo, cercado por uma área de preservação.",
    category: "Natureza",
    openingHours: "09:00 às 16:00",
    price: "A partir de R$ 100",
    gallery: [],
    weather: {
      temperature: 25,
      condition: "Ensolarado",
      humidity: 75,
    },
  },

  {
    id: "5",
    name: "Parque das Aves",
    destinationId: "2",
    location: "Foz do Iguaçu — Paraná",
    image: "https://images.unsplash.com/photo-1444464666168-49d633b86797",
    description:
      "Parque dedicado à conservação de aves e à educação ambiental.",
    category: "Natureza",
    openingHours: "08:30 às 16:30",
    price: "A partir de R$ 60",
    gallery: [],
    weather: {
      temperature: 25,
      condition: "Ensolarado",
      humidity: 75,
    },
  },

  // SÃO PAULO
  {
    id: "6",
    name: "Avenida Paulista",
    destinationId: "3",
    location: "São Paulo — São Paulo",
    image: "https://images.unsplash.com/photo-1543059080-f9b1272213d5",
    description:
      "Uma das principais avenidas de São Paulo, cercada por museus, centros culturais, lojas e restaurantes.",
    category: "Cidade",
    openingHours: "Aberto 24 horas",
    price: "Gratuito",
    gallery: [],
    weather: {
      temperature: 24,
      condition: "Ensolarado",
      humidity: 65,
    },
  },

  {
    id: "7",
    name: "Museu de Arte de São Paulo",
    destinationId: "3",
    location: "São Paulo — São Paulo",
    image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912",
    description:
      "Um dos museus de arte mais importantes do Brasil, localizado na Avenida Paulista.",
    category: "Cultura",
    openingHours: "10:00 às 18:00",
    price: "A partir de R$ 30",
    gallery: [],
    weather: {
      temperature: 24,
      condition: "Ensolarado",
      humidity: 65,
    },
  },

  // RIO DE JANEIRO
  {
    id: "8",
    name: "Cristo Redentor",
    destinationId: "4",
    location: "Rio de Janeiro — Rio de Janeiro",
    image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325",
    description:
      "Um dos principais símbolos do Rio de Janeiro, localizado no alto do Morro do Corcovado.",
    category: "Cultura",
    openingHours: "08:00 às 18:00",
    price: "A partir de R$ 90",
    gallery: [],
    weather: {
      temperature: 27,
      condition: "Ensolarado",
      humidity: 70,
    },
  },

  {
    id: "9",
    name: "Pão de Açúcar",
    destinationId: "4",
    location: "Rio de Janeiro — Rio de Janeiro",
    image: "https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f",
    description:
      "Complexo turístico conhecido pelos seus morros e pela vista panorâmica da cidade.",
    category: "Natureza",
    openingHours: "08:00 às 21:00",
    price: "A partir de R$ 185",
    gallery: [],
    weather: {
      temperature: 27,
      condition: "Ensolarado",
      humidity: 70,
    },
  },

  // FLORIANÓPOLIS
  {
    id: "10",
    name: "Praia da Joaquina",
    destinationId: "5",
    location: "Florianópolis — Santa Catarina",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    description:
      "Uma das praias mais conhecidas de Florianópolis, cercada por dunas e natureza.",
    category: "Praia",
    openingHours: "Aberto 24 horas",
    price: "Gratuito",
    gallery: [],
    weather: {
      temperature: 26,
      condition: "Ensolarado",
      humidity: 72,
    },
  },

  {
    id: "11",
    name: "Lagoa da Conceição",
    destinationId: "5",
    location: "Florianópolis — Santa Catarina",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    description:
      "Região conhecida pelas paisagens naturais, restaurantes e atividades ao ar livre.",
    category: "Natureza",
    openingHours: "Aberto 24 horas",
    price: "Gratuito",
    gallery: [],
    weather: {
      temperature: 26,
      condition: "Ensolarado",
      humidity: 72,
    },
  },

  // SALVADOR
  {
    id: "12",
    name: "Pelourinho",
    destinationId: "6",
    location: "Salvador — Bahia",
    image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99",
    description:
      "Centro histórico conhecido pela arquitetura colonial, cultura e importância histórica.",
    category: "Cultura",
    openingHours: "Aberto 24 horas",
    price: "Gratuito",
    gallery: [],
    weather: {
      temperature: 28,
      condition: "Ensolarado",
      humidity: 78,
    },
  },

  {
    id: "13",
    name: "Farol da Barra",
    destinationId: "6",
    location: "Salvador — Bahia",
    image: "https://images.unsplash.com/photo-1596395819057-e37f55a8516a",
    description:
      "Um dos cartões-postais de Salvador, localizado em uma região de praias e belas paisagens.",
    category: "Praia",
    openingHours: "06:00 às 18:00",
    price: "Gratuito",
    gallery: [],
    weather: {
      temperature: 28,
      condition: "Ensolarado",
      humidity: 78,
    },
  },

  // RECIFE
  {
    id: "14",
    name: "Praia de Boa Viagem",
    destinationId: "7",
    location: "Recife — Pernambuco",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    description:
      "Uma das praias mais conhecidas de Recife, com extensa faixa de areia e orla urbana.",
    category: "Praia",
    openingHours: "Aberto 24 horas",
    price: "Gratuito",
    gallery: [],
    weather: {
      temperature: 29,
      condition: "Ensolarado",
      humidity: 75,
    },
  },

  {
    id: "15",
    name: "Marco Zero",
    destinationId: "7",
    location: "Recife — Pernambuco",
    image: "https://images.unsplash.com/photo-1531058020387-3be344556be6",
    description:
      "Um dos principais pontos de encontro do Recife Antigo e referência cultural da cidade.",
    category: "Cultura",
    openingHours: "Aberto 24 horas",
    price: "Gratuito",
    gallery: [],
    weather: {
      temperature: 29,
      condition: "Ensolarado",
      humidity: 75,
    },
  },

  // GRAMADO
  {
    id: "16",
    name: "Lago Negro",
    destinationId: "8",
    location: "Gramado — Rio Grande do Sul",
    image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
    description:
      "Parque cercado por natureza, com lago, árvores e caminhos para passeios.",
    category: "Natureza",
    openingHours: "08:30 às 18:00",
    price: "Gratuito",
    gallery: [],
    weather: {
      temperature: 18,
      condition: "Nublado",
      humidity: 80,
    },
  },

  {
    id: "17",
    name: "Rua Coberta",
    destinationId: "8",
    location: "Gramado — Rio Grande do Sul",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
    description:
      "Um dos locais mais movimentados de Gramado, cercado por restaurantes, lojas e eventos.",
    category: "Cidade",
    openingHours: "Aberto 24 horas",
    price: "Gratuito",
    gallery: [],
    weather: {
      temperature: 18,
      condition: "Nublado",
      humidity: 80,
    },
  },
];
