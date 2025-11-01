const {
  plainToInstance,
  Expose,
  Transform,
  Type,
} = require('class-transformer');
const { City } = require('../city');

/**
 * @implements {Domain.WeatherMetric}
 */
class WeatherMetric {
  @Expose()
  temp;
  @Expose({ name: 'feels_like' })
  feelsLike;
  @Expose({ name: 'temp_min' })
  tempMin;
  @Expose({ name: 'temp_max' })
  tempMax;
  @Expose()
  pressure;
  @Expose({ name: 'sea_level' })
  seaLevel;
  @Expose({ name: 'grnd_level' })
  grndLevel;
  @Expose()
  humidity;
  @Expose({ name: 'temp_kf' })
  tempKf;
}

/**
 * @implements {Domain.Weather}
 */
class Weather {
  @Expose()
  main;
  @Expose()
  description;
  @Expose()
  icon;
}

/**
 * @implements {Domain.Wind}
 */
class Wind {
  @Expose()
  speed;
  @Expose()
  deg;
  @Expose()
  gust;
}

/**
 * @implements {Domain.ForecastEntry}
 */
class ForecastEntry {
  @Transform(({ value }) => new Date(value * 1000))
  @Expose()
  forecastTime;
  @Type(() => WeatherMetric)
  @Expose()
  main;
  @Transform(({ value }) => (Array.isArray(value) ? value[0] : value))
  @Type(() => Weather)
  @Expose()
  weather;
  @Expose()
  clouds;
  @Type(() => Wind)
  @Expose()
  wind;
  @Expose()
  visibility;
  @Expose()
  pop;
  @Expose()
  sys;
  @Expose({ name: 'dt_txt' })
  dtTxt;
}

/**
 * @implements {Domain.Forecast}
 */
class Forecast {
  @Type(() => City)
  @Expose()
  city;
  @Type(() => ForecastEntry)
  @Expose()
  list;
  @Expose()
  _id;

  static fromDb(dbData) {
    return plainToInstance(Forecast, dbData, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  static fromApi(apiData) {
    return plainToInstance(
      Forecast,
      { ...apiData, city: City.fromApi(apiData.city) },
      {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      }
    );
  }
}

module.exports = { Forecast, ForecastEntry, WeatherMetric, Weather, Wind };
