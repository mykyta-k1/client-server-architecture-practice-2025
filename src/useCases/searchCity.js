const { WeatherApiAdapter } = require('@/adapters/forecast');
const { cityRepository } = require('@/repositories/city');
const { forecastRepository } = require('@/repositories/forecast');

const { Forecast } = require('@/domains/forecast');

const { logger } = require('@/logger');

const loadForecastFromApi = async (cityName) => {
  const apiForecast = await WeatherApiAdapter.fetchForecast(cityName);

  if (!apiForecast || !apiForecast.city) {
    throw new Error('City/Forecast data not found by external API.');
  }

  const savedCity = await cityRepository.save(apiForecast.city);

  const cityMongo = Object.fromEntries(
    Object.entries(apiForecast.city).filter(([key]) => !(key in savedCity))
  );

  const savedForecast = await forecastRepository.save({
    ...apiForecast,
    _id: savedCity.id,
    city: cityMongo,
  });

  return Forecast.fromDb(savedForecast);
};

module.exports.searchCity = async (cityName) => {
  const threeHoursAgo = Date.now() - 3 * 60 * 60 * 1000;

  try {
    const cityRecord = await cityRepository.findByName(cityName);

    /** // TODO: Fix search by city names, if you enter a city whose name is not in English,
    then there will be a problem that although such a city may exist in the database, 
    the program will give an error because it will not be able to translate it to the one in the database. 
    It is recommended to use an endpoint that will correctly "localize" city names: 
    https://api.openweathermap.org/geo/1.0/direct?q=%D1%83%D0%B6%D0%B3%D0%BE%D1%80%D0%BE%D0%B4&limit=5&appid=API_KEY */

    if (!cityRecord) {
      return await loadForecastFromApi(cityName);
    }

    const forecastRecord = await forecastRepository.findById(cityRecord.id);

    if (!forecastRecord || forecastRecord.updatedAt.getTime() < threeHoursAgo) {
      return await loadForecastFromApi(cityName);
    }

    return Forecast.fromDb(forecastRecord);
  } catch (error) {
    logger.error(error, `❌ UseCase Error for searchCity(${cityName}):`);
    throw new Error(`Cannot process search for ${cityName}: ${error.message}`);
  }
};
