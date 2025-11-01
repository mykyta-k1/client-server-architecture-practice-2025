const { $cols } = require('@/adapters/mongo');

class ForecastRepository {
  #db;

  constructor() {
    this.#db = $cols.forecasts();
  }

  async create(forecastData) {
    const createdAt = new Date();
    const updatedAt = new Date();
    const result = await this.#db.insertOne({
      ...forecastData,
      updatedAt,
      createdAt,
    });
    return { _id: result.insertedId, ...forecastData, updatedAt, createdAt };
  }

  async findById(id) {
    const forecast = await this.#db.findOne({ _id: id });

    if (!forecast) return null;

    const _forecast = /**
     * @type {Repositories.ForecastDocument|null}
     */ ({ ...forecast, _id: forecast._id });

    return _forecast;
  }

  async findAll(filter = {}) {
    const forecasts = await this.#db.find(filter).toArray();

    const _forecasts = /**
     * @type {Repositories.ForecastDocument[]}
     */ (
      forecasts.map((forecast) => ({
        ...forecast,
        _id: forecast._id,
      }))
    );

    return _forecasts;
  }

  async save(document) {
    const { _id, ...safeDocument } = document;

    const remoteDocument = await this.findById(_id);

    return remoteDocument
      ? this.update(_id, safeDocument)
      : this.create(document);
  }

  async materialize(document) {
    const documentToSave = { ...document, _id: document.city.id };

    delete documentToSave.city.createdAt;
    delete documentToSave.city.updatedAt;

    return await this.save(documentToSave);
  }

  async update(id, forecastData) {
    const result = await this.#db.findOneAndUpdate(
      { _id: id },
      { $set: { ...forecastData, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );

    if (!result) {
      return null;
    }

    return result;
  }

  async delete(id) {
    const result = await this.#db.findOneAndDelete({ _id: id });

    if (!result) {
      return null;
    }

    return result;
  }
}

module.exports.forecastRepository = new ForecastRepository();
