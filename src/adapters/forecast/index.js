const { env } = require('@/config');
const { Forecast } = require('@/domains/forecast');
const { logger } = require('@/logger');

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
  },
};

const API_KEY = env.FORECAST_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

class WeatherApiAdapter {
  fetchForecast = async (cityName) => {
    const rawJson = await this.fetchForecastData(cityName);
    return Forecast.fromApi(rawJson);
  };

  fetchForecastData = async (cityName) => {
    if (!API_KEY) {
      throw new Error('Weather API key is not configured.');
    }

    const encodedCityName = encodeURIComponent(cityName);
    const queryParam = `/forecast?q=${encodedCityName}&units=metric&lang=en&appid=${API_KEY}`;
    const endpoint = `${BASE_URL}${queryParam}`;

    try {
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(
          `External API returned status ${response.status}: ${errorBody.message}`
        );
      }

      return response.json();
    } catch (error) {
      logger.error(error, `❌ Failed to fetch forecast for ${cityName}:`);
      throw new Error('Failed to retrieve forecast data.');
    }
  };
}

module.exports.WeatherApiAdapter = new WeatherApiAdapter();
