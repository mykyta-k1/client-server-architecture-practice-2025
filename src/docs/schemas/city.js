/** @type {Docs.JsonSchemaWithId} */
module.exports.citySchema = {
  $id: 'City',
  type: 'object',
  required: ['name', 'country'],
  properties: {
    name: { type: 'string' },
    country: { type: 'string' },
    population: { type: 'number' },
    numberOfSearches: { type: 'number' },
  },
};
