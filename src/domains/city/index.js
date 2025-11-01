const { plainToInstance, Expose } = require('class-transformer');

/**
 * @implements {Domain.City}
 */
class City {
  @Expose()
  coord;
  @Expose()
  timezone;
  @Expose()
  sunrise;
  @Expose()
  sunset;

  @Expose()
  id;
  @Expose()
  name;
  @Expose()
  country;
  @Expose()
  population = 0;
  @Expose()
  numberOfSearches = 0;
  @Expose()
  createdAt;
  @Expose()
  updatedAt;

  // Removed field 'id' from api response
  static fromApi(apiData) {
    const { id, ...rest } = apiData;
    return plainToInstance(City, rest, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  static fromDb(dbData) {
    return plainToInstance(City, dbData, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }
}

module.exports = { City };
