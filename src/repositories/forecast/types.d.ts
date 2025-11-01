declare namespace Repositories {
  export type ForecastDocument = Domain.Forecast & {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
  };

  export interface ForecastRepository {
    create(forecastData: Domain.Forecast): Promise<ForecastDocument>;

    findById(id: string): Promise<ForecastDocument | null>;
  }
}
