export type CurrentWeather = {
  temperature: number;
  humidity: number;
  condition: string;
  precipitation: number;
  time: string;
};

const getWeatherCondition = (code: number): string => {
  switch (code) {
    case 0:
      return "Céu limpo";

    case 1:
    case 2:
      return "Parcialmente nublado";

    case 3:
      return "Nublado";

    case 45:
    case 48:
      return "Neblina";

    case 51:
    case 53:
    case 55:
      return "Garoa";

    case 61:
    case 63:
    case 65:
      return "Chuva";

    case 71:
    case 73:
    case 75:
    case 77:
      return "Neve";

    case 80:
    case 81:
    case 82:
      return "Pancadas de chuva";

    case 85:
    case 86:
      return "Pancadas de neve";

    case 95:
      return "Trovoada";

    case 96:
    case 99:
      return "Trovoada com granizo";

    default:
      return "Condição desconhecida";
  }
};

export const getCurrentWeather = async (
  latitude: number,
  longitude: number,
): Promise<CurrentWeather> => {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${latitude}` +
    `&longitude=${longitude}` +
    `&current=temperature_2m,relative_humidity_2m,weather_code,precipitation` +
    `&temperature_unit=celsius` +
    `&timezone=auto`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Não foi possível consultar o clima.");
  }

  const data = await response.json();

  return {
    temperature: data.current.temperature_2m,
    humidity: data.current.relative_humidity_2m,
    condition: getWeatherCondition(data.current.weather_code),
    precipitation: data.current.precipitation,
    time: data.current.time,
  };
};
