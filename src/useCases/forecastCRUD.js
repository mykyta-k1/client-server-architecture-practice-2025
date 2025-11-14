const { forecastRepository } = require('@/repositories/forecasts');

const createForecast = async (forecastData) => {
  return await forecastRepository.create(forecastData);
};

const readForecast = async (forecastId) => {
  return await forecastRepository.findById(forecastId);
};

const updateForecast = async (forecastId, forecastData) => {
  return await forecastRepository.update(forecastId, forecastData);
};

const deleteForecast = async (forecastId) => {
  return await forecastRepository.delete(forecastId);
};

module.exports = {
  createForecast,
  readForecast,
  updateForecast,
  deleteForecast,
};
