class CityNotFoundError extends Error {
  constructor(message = 'City not found') {
    super(message);
    this.name = 'CityNotFoundError';
    this.status = 404;
  }
}

module.exports = CityNotFoundError;
