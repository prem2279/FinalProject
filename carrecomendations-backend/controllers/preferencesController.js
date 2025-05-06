const Car = require('../models/Car');
const { optimizeQuery, handleConnectionError } = require('../utils/atlasHelper');

exports.getPreferenceOptions = async (req, res) => {
  try {
    const [
      bodyStyle,
      engineType,
      exhaust,
      tyres,
      fuelType,
      transmission,
      seatingCapacity
    ] = await Promise.all([
      Car.distinct('bodyStyle').maxTimeMS(5000),
      Car.distinct('engineType').maxTimeMS(5000),
      Car.distinct('exhaust').maxTimeMS(5000),
      Car.distinct('tyres').maxTimeMS(5000),
      Car.distinct('fuelType').maxTimeMS(5000),
      Car.distinct('transmission').maxTimeMS(5000),
      Car.distinct('seatingCapacity').maxTimeMS(5000)
    ]);

    res.json({
      success: true,
      data: {
        bodyStyle,
        engineType,
        exhaust,
        tyres,
        fuelType,
        transmission,
        seatingCapacity
      }
    });
  } catch (err) {
    handleConnectionError(err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};