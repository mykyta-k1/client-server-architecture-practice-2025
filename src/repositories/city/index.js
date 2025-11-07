const { $db, $schemas } = require('@/adapters/postgres');
const { eq, ilike, or } = require('drizzle-orm');

class CityRepository {
  async create(cityData) {
    const syncedTimestamp = new Date();

    const [newCity] = await $db
      .insert($schemas.cities)
      .values({
        ...cityData,
        createdAt: syncedTimestamp,
        updatedAt: syncedTimestamp,
      })
      .returning();

    return newCity;
  }

  async findById(id) {
    if (!id) {
      return null;
    }

    const [city] = await $db
      .select()
      .from($schemas.cities)
      .where(eq($schemas.cities.id, id));

    if (!city) {
      return null;
    }

    return city;
  }

  async findAll(search, page = 1, limit = 10) {
    const _limit = Math.min(50, limit);
    const offset = (Math.max(1, page) - 1) * _limit;

    const condition = search
      ? or(ilike($schemas.cities.name, `${search}%`))
      : undefined;

    return $db
      .select()
      .from($schemas.cities)
      .where(condition)
      .offset(offset)
      .limit(_limit);
  }

  async findByName(name) {
    const [city] = await $db
      .select()
      .from($schemas.cities)
      .where(eq($schemas.cities.name, name));
    return city;
  }

  async update(id, cityData) {
    const [updatedCity] = await $db
      .update($schemas.cities)
      .set({
        ...cityData,
        updatedAt: new Date(),
      })
      .where(eq($schemas.cities.id, id))
      .returning();

    if (!updatedCity) {
      return null;
    }

    return updatedCity;
  }

  async save(record) {
    const name = record.name || null;
    if (name) {
      const city = await this.findByName(name);
      if (city) {
        return await this.update(city.id, record);
      }
      return await this.create(record);
    }
    return null;
  }

  async materialize(entity) {
    return await this.create({
      name: entity.name,
      country: entity.country,
      population: entity.population,
      numberOfSearches: entity.numberOfSearches,
    });
  }

  async delete(id) {
    const [deletedCity] = await $db
      .delete($schemas.cities)
      .where(eq($schemas.cities.id, id))
      .returning();

    if (!deletedCity) {
      return null;
    }

    return deletedCity;
  }
}

module.exports.cityRepository = new CityRepository();
