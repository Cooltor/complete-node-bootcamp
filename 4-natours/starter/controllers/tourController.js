const { json } = require('express');
const Tour = require('./../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {
    // BUILD THE QUERY
    // 1.1. Filtering
    const queryObj = { ...req.query }; // nous devons structurer et mettre ds un objet
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1.2. Advance filtering

    let queryStr = JSON.stringify(queryObj); // expression régulière pour trouver exactement ces valeurs. le "g" sert à trouver tte les valeurs et pas que la 1ère occurence
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); // ${lavaleur} et rajoute le $ devant
    console.log(JSON.parse(queryStr));

    console.log(req.query);

    let query = Tour.find(JSON.parse(queryStr));

    // 2. Sorting

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
      // sort('price ratings')
    } else {
      query = query.sort('-createdAt'); // tri par défaut par dernier créé
    }

    // 3. Field limiting

    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v'); // - pour exclure une ligne, là __v
    }

    // 4. Pagination

    const page = req.query.page * 1 || 1; // le * 1 : astuce pr transformer str en Num
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('This page does not exist');
    }

    // EXECUTE THE QUERY
    const tours = await query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'succes',
      results: tours.length,
      data: {
        tours: tours,
      },

      // query.sort().select().skip().limit()

      //const query = Tour.find()
      // .where('duration')
      //.equals(5)
      //.where('difficulty')
      //.equals('easy');
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // Tour.findOne({_id: req.params.id})   ==> méthode pour find 1 seul doc : équivalent a findById
    res.status(200).json({
      status: 'succes',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    //const newTour = new Tour({});
    //newTour.save();

    const newTour = await Tour.create(req.body); //voir pages

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  // voir docs et traduire
  // patch méthod n'écrase pas entièrement l'ancien objet
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour, //: tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
