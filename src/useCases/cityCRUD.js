const { cityRepository } = require('@/repositories/city');

const createCity = async (cityData) => {
  return await cityRepository.create(cityData);
};

const readCity = async (cityId) => {
  return await cityRepository.findById(cityId);
};

const updateCity = async (cityId, cityData) => {
  return await cityRepository.update(cityId, cityData);
};

const deleteCity = async (cityId) => {
  return await cityRepository.delete(cityId);
};

module.exports = {
  createCity,
  readCity,
  updateCity,
  deleteCity,
};
