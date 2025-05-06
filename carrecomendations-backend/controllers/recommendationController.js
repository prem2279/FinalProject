const Car = require('../models/Car');
const { optimizeQuery } = require('../utils/atlasHelper');

exports.getRecommendations = async (req, res) => {
  try {
    const preferences = req.body;

    // Check if we have any preferences
    const hasPreferences = Object.values(preferences).some(
      pref => (Array.isArray(pref) && pref.length > 0) ||
        (typeof pref === 'object' && pref !== null && Object.keys(pref).length > 0)
    );

    let cars;

    if (!hasPreferences) {
      // If no preferences, return a random selection
      cars = await optimizeQuery(
        Car.aggregate([
          { $sample: { size: 12 } },
          { $project: getStandardProjection() }
        ])
      );
    } else {
      // Build the strict matching query
      const query = buildStrictRecommendationQuery(preferences);

      // Get recommendations - only cars that match ALL specified preferences
      cars = await optimizeQuery(
        Car.find(query)
          .select(getStandardSelectFields())
          .limit(12)
          .sort({ price: 1 })
      );
    }
    
    res.json({
      success: true,
      exactMatch: hasPreferences,
      count: cars.length,
      data: cars.map(formatCarResponse)
    });

  } catch (err) {
    console.error('Error getting recommendations:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Helper function for strict matching (ALL preferences must match)
function buildStrictRecommendationQuery(preferences) {
  const query = {};
  const mustMatch = [];

  // Handle bodyStyle (check both possible field names)
  if (preferences.bodyStyle?.length > 0 || preferences.bodyStyles?.length > 0) {
    const bodyStyles = preferences.bodyStyle?.length > 0
      ? preferences.bodyStyle
      : preferences.bodyStyles;
    mustMatch.push({ bodyStyle: { $in: bodyStyles } });
  }

  // Engine Type
  if (preferences.engineType?.length > 0 || preferences.engineTypes?.length > 0) {
    const engineTypes = preferences.engineType?.length > 0
      ? preferences.engineType
      : preferences.engineTypes;
    mustMatch.push({ engineType: { $in: engineTypes } });
  }

  // Exhaust
  if (preferences.exhaust?.length > 0 || preferences.exhaustOptions?.length > 0) {
    const exhaustOptions = preferences.exhaust?.length > 0
      ? preferences.exhaust
      : preferences.exhaustOptions;
    mustMatch.push({ exhaust: { $in: exhaustOptions } });
  }

  // Tyres
  if (preferences.tyres?.length > 0 || preferences.tyreOptions?.length > 0) {
    const tyreOptions = preferences.tyres?.length > 0
      ? preferences.tyres
      : preferences.tyreOptions;
    mustMatch.push({ tyres: { $in: tyreOptions } });
  }

  // Fuel Type
  if (preferences.fuelType?.length > 0 || preferences.fuelTypes?.length > 0) {
    const fuelTypes = preferences.fuelType?.length > 0
      ? preferences.fuelType
      : preferences.fuelTypes;
    mustMatch.push({ fuelType: { $in: fuelTypes } });
  }

  // Transmission
  if (preferences.transmission?.length > 0 || preferences.transmissionOptions?.length > 0) {
    const transmissionOptions = preferences.transmission?.length > 0
      ? preferences.transmission
      : preferences.transmissionOptions;
    mustMatch.push({ transmission: { $in: transmissionOptions } });
  }

  // Seating Capacity
  if (preferences.seatingCapacity?.length > 0 || preferences.seatingCapacities?.length > 0) {
    const capacities = preferences.seatingCapacity?.length > 0
      ? preferences.seatingCapacity.map(Number)
      : preferences.seatingCapacities.map(Number);
    mustMatch.push({ seatingCapacity: { $in: capacities } });
  }

  // Price range filter if provided
  if (preferences.priceRange &&
    (preferences.priceRange.min !== undefined ||
      preferences.priceRange.max !== undefined)) {
    const priceFilter = {};
    if (preferences.priceRange.min !== undefined) {
      priceFilter.$gte = preferences.priceRange.min;
    }
    if (preferences.priceRange.max !== undefined) {
      priceFilter.$lte = preferences.priceRange.max;
    }
    mustMatch.push({ price: priceFilter });
  }

  // Only add $and if we have filters to apply
  if (mustMatch.length > 0) {
    query.$and = mustMatch;
  }

  return query;
}

function getStandardSelectFields() {
  return 'make model year bodyStyle engineType exhaust tyres fuelType transmission seatingCapacity imageUrl price';
}

function getStandardProjection() {
  return {
    make: 1,
    model: 1,
    year: 1,
    bodyStyle: 1,
    engineType: 1,
    exhaust: 1,
    tyres: 1,
    fuelType: 1,
    transmission: 1,
    seatingCapacity: 1,
    imageUrl: 1,
    price: 1
  };
}

function formatCarResponse(car) {
  return {
    id: car._id,
    make: car.make,
    model: car.model,
    year: car.year,
    bodyStyle: car.bodyStyle,
    engineType: car.engineType,
    exhaust: car.exhaust,
    tyres: car.tyres,
    fuelType: car.fuelType,
    transmission: car.transmission,
    seatingCapacity: car.seatingCapacity,
    imageUrl: car.imageUrl,
    price: car.price
  };
}