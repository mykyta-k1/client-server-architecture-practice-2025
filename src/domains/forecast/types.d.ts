namespace Domain {
  export interface Wind {
    speed: number;
    deg: number;
    gust: number;
  }

  export interface Weather {
    main: string;
    description: string;
    icon: string;
  }

  export interface WeatherMetric {
    temp: number;
    feelsLike: number;
    tempMin: number;
    tempMax: number;
    pressure: number;
    seaLevel: number;
    grndLevel: number;
    humidity: number;
    tempKf: number;
  }

  export interface ForecastEntry {
    forecastTime: Date;
    main: WeatherMetric;
    weather: Weather;
    clouds: { all: number };
    wind: Wind;
    visibility: number;
    pop: number;
    sys: { pod: string };
    dtTxt: string;
  }

  export interface Forecast {
    _id: string;
    city: City;
    list: ForecastEntry[];
  }
}
