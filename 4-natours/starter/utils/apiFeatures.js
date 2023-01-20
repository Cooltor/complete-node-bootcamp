class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString }; // nous devons structurer et mettre ds un objet
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1.2. Advance filtering

    let queryStr = JSON.stringify(queryObj); // expression régulière pour trouver exactement ces valeurs. le "g" sert à trouver tte les valeurs et pas que la 1ère occurence
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); // ${lavaleur} et rajoute le $ devant

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
      // sort('price ratings')
    } else {
      this.query = this.query.sort('-createdAt'); // tri par défaut par dernier créé
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v'); // - pour exclure une ligne, là __v
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1; // le * 1 : astuce pr transformer str en Num
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
