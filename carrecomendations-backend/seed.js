const mongoose = require('mongoose');
require('dotenv').config();
const { optimizeQuery } = require('./utils/atlasHelper');
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const Car = require('./models/Car'); // Assuming you've moved the schema to a separate file

const sampleCars = [
  {
    "make": "Ford",
    "model": "Explorer",
    "year": 2022,
    "bodyStyle": "suv",
    "engineType": "6 cylinder",
    "exhaust": "dual",
    "tyres": "all-season",
    "fuelType": "petrol",
    "transmission": "automatic",
    "seatingCapacity": 7,
    "price": 47000,
    "imageUrl": "https://motorweek.org/wp-content/uploads/2024/02/ford-explorer-receives-2025-update-6-862x490.jpghttps://motorweek.org/wp-content/uploads/2024/02/ford-explorer-receives-2025-update-6-862x490.jpg",
    "features": [
      "tri-zone climate control",
      "power-folding third row",
      "blind spot monitor",
      "Apple CarPlay & Android Auto",
      "terrain management system"
    ]
  },
  {
    "make": "Jeep",
    "model": "Compass Limited",
    "year": 2024,
    "bodyStyle": "suv",
    "engineType": "4 cylinder",
    "exhaust": "single",
    "tyres": "all-terrain",
    "fuelType": "petrol",
    "transmission": "automatic",
    "seatingCapacity": 5,
    "price": 37000,
    "imageUrl": "https://www.darcarscjdofsilverspring.com/static/dealer-17136/darcars_cdjr-silver-springs_update-hvp-2025-ls6_2X.jpg",
    "features": [
      "leather-trimmed seats",
      "adaptive cruise control",
      "10.1-inch touchscreen",
      "lane keep assist",
      "remote start"
    ]
  },
  {
    "make": "BMW",
    "model": "X3",
    "year": 2023,
    "bodyStyle": "suv",
    "engineType": "4 cylinder",
    "exhaust": "dual",
    "tyres": "all-season",
    "fuelType": "petrol",
    "transmission": "automatic",
    "seatingCapacity": 5,
    "price": 47000,
    "imageUrl": "https://hips.hearstapps.com/hmg-prod/amv-prod-cad-assets/images/media/672264/2018-bmw-x3-in-depth-model-review-car-and-driver-photo-704240-s-original.jpg",
    "features": [
      "panoramic sunroof",
      "parking assist",
      "blind spot monitoring",
      "gesture control",
      "wireless charging"
    ]
  },
  {
    "make": "BMW",
    "model": "Z4",
    "year": 2021,
    "bodyStyle": "coupe",
    "engineType": "4 cylinder",
    "exhaust": "dual",
    "tyres": "performance",
    "fuelType": "petrol",
    "transmission": "automatic",
    "seatingCapacity": 2,
    "price": 49900,
    "imageUrl": "https://images.prismic.io/carwow/33b4298c-a942-411e-8535-827bdd34a43e_2023+BMW+Z4+front+quarter+moving+2.jpg",
    "features": [
      "convertible soft top",
      "adaptive suspension",
      "lane departure warning",
      "wireless Apple CarPlay",
      "sport seats"
    ]
  },
  {
    "make": "Porsche",
    "model": "718 Boxster",
    "year": 2021,
    "bodyStyle": "convertible",
    "engineType": "4 cylinder",
    "exhaust": "dual",
    "tyres": "performance",
    "fuelType": "petrol",
    "transmission": "manual",
    "seatingCapacity": 2,
    "price": 62900,
    "imageUrl": "https://tse2.mm.bing.net/th/id/OIP.porsche718boxster_placeholder_image?pid=Api",
    "features": [
      "power folding soft top",
      "Porsche Active Suspension Management (PASM)",
      "rear-wheel drive",
      "Apple CarPlay",
      "sport seats with Alcantara trim"
    ]
  },
  {
    "make": "Toyota",
    "model": "Camry Hybrid",
    "year": 2025,
    "bodyStyle": "sedan",
    "engineType": "4 cylinder",
    "exhaust": "single",
    "tyres": "all-season",
    "fuelType": "hybrid",
    "transmission": "CVT",
    "seatingCapacity": 5,
    "price": 29500,
    "imageUrl": "https://www.355toyota.com/blogs/3663/wp-content/uploads/2022/02/2021-Toyota-Camry-Hybrid-in-Rockville-MD.png",
    "features": [
      "Toyota Safety Sense 3.0",
      "EV drive mode",
      "adaptive cruise control",
      "wireless Apple CarPlay and Android Auto",
      "smart key system with push-button start"
    ]
  },
  {
    "make": "BMW",
    "model": "330i",
    "year": 2025,
    "bodyStyle": "sedan",
    "engineType": "4 cylinder",
    "exhaust": "dual",
    "tyres": "performance",
    "fuelType": "petrol",
    "transmission": "automatic",
    "seatingCapacity": 5,
    "price": 44500,
    "imageUrl": "https://car-images.bauersecure.com/wp-images/12809/063-bmw-330e.jpg",
    "features": [
      "Live Cockpit Plus with iDrive 8",
      "sport seats with memory",
      "Apple CarPlay and Android Auto",
      "lane departure warning",
      "adaptive cruise control"
    ]
  },
  {
    "make": "Nissan",
    "model": "Altima SR",
    "year": 2025,
    "bodyStyle": "sedan",
    "engineType": "4 cylinder",
    "exhaust": "dual",
    "tyres": "performance",
    "fuelType": "petrol",
    "transmission": "CVT",
    "seatingCapacity": 5,
    "price": 30000,
    "imageUrl": "https://di-uploads-pod5.dealerinspire.com/nissanofturnersville/uploads/2025/02/2025-Nissan-Altima-SR.jpg",
    "features": [
      "sport-tuned suspension",
      "Nissan Safety Shield 360",
      "Apple CarPlay and Android Auto",
      "remote start system",
      "dual-zone automatic climate control"
    ]
  },
  {
    "make": "Ford",
    "model": "Mustang GT",
    "year": 2025,
    "bodyStyle": "coupe",
    "engineType": "8 cylinder",
    "exhaust": "dual",
    "tyres": "performance",
    "fuelType": "petrol",
    "transmission": "manual",
    "seatingCapacity": 4,
    "price": 45000,
    "imageUrl": "https://www.motortrend.com/uploads/2022/09/2024_Ford_Mustang_GT500_White_1.jpg",
    "features": [
      "Magnetic Ride Control",
      "SYNC 4 with 12-inch screen",
      "Apple CarPlay and Android Auto",
      "limited-slip rear differential",
      "performance sport seats"
    ]
  },
  {
    "make": "Ferrari",
    "model": "488 Pista",
    "year": 2020,
    "bodyStyle": "coupe",
    "engineType": "8 cylinder",
    "exhaust": "dual",
    "tyres": "performance",
    "fuelType": "petrol",
    "transmission": "automatic",
    "seatingCapacity": 2,
    "price": 330000,
    "imageUrl": "https://issimi-vehicles-cdn.b-cdn.net/publicamlvehiclemanagement/VehicleDetails/496/timestamped-1707481260143-2019Ferrari488-1.jpg",
    "features": [
      "carbon fiber interior and exterior components",
      "Side Slip Angle Control (SSC)",
      "lightweight forged wheels",
      "Ferrari Dynamic Enhancer (FDE)",
      "track-tuned suspension"
    ]
  },
  {
    "make": "Chevrolet",
    "model": "Camaro",
    "year": 2024,
    "bodyStyle": "coupe",
    "engineType": "8 cylinder",
    "exhaust": "dual",
    "tyres": "performance",
    "fuelType": "petrol",
    "transmission": "manual",
    "seatingCapacity": 4,
    "price": 42000,
    "imageUrl": "https://hips.hearstapps.com/autoweek/assets/s3fs-public/2018-chevrolet-camaro-zl1-1le-001-1.jpg",
    "features": [
      "Magnetic Ride Control (SS only)",
      "Chevrolet Infotainment 3 system",
      "Apple CarPlay and Android Auto",
      "rear vision camera",
      "Brembo performance brakes"
    ]
  },
  {
    "make": "Toyota",
    "model": "Sienna",
    "year": 2024,
    "bodyStyle": "minivan",
    "engineType": "4 cylinder",
    "exhaust": "single",
    "tyres": "all-season",
    "fuelType": "hybrid",
    "transmission": "CVT",
    "seatingCapacity": 7,
    "price": 38500,
    "imageUrl": "https://media.ed.edmunds-media.com/toyota/sienna/2025/oem/2025_toyota_sienna_passenger-minivan_platinum-7-passenger_fq_oem_1_600.jpg",
    "features": [
      "Toyota Safety Sense 2.0",
      "power sliding side doors",
      "Apple CarPlay and Android Auto",
      "tri-zone automatic climate control",
      "second-row captain's chairs with long-slide function"
    ]
  },
  {
    "make": "Honda",
    "model": "Odyssey",
    "year": 2024,
    "bodyStyle": "minivan",
    "engineType": "6 cylinder",
    "exhaust": "dual",
    "tyres": "all-season",
    "fuelType": "petrol",
    "transmission": "automatic",
    "seatingCapacity": 7,
    "price": 40000,
    "imageUrl": "https://www.automoblog.com/wp-content/uploads/2024/07/2025-Honda-Odyssey-19-1024x682.jpg",
    "features": [
      "Honda Sensing suite",
      "Magic Slide second-row seats",
      "Apple CarPlay and Android Auto",
      "power tailgate",
      "tri-zone automatic climate control"
    ]
  },
  {
    "make": "Dodge",
    "model": "Grand Caravan",
    "year": 2020,
    "bodyStyle": "minivan",
    "engineType": "6 cylinder",
    "exhaust": "single",
    "tyres": "all-season",
    "fuelType": "petrol",
    "transmission": "automatic",
    "seatingCapacity": 7,
    "price": 29000,
    "imageUrl": "https://zubie.com/wp-content/uploads/2021/04/Dodge-Grand-Caravan1-1.jpg",
    "features": [
      "Stow 'n Go seating and storage",
      "rearview camera",
      "power sliding doors",
      "tri-zone manual climate control",
      "Uconnect infotainment with 6.5-inch touchscreen"
    ]
  },
  {
    "make": "Mercedes-Benz",
    "model": "SLC 43 AMG",
    "year": 2021,
    "bodyStyle": "convertible",
    "engineType": "6 cylinder",
    "exhaust": "dual",
    "tyres": "performance",
    "fuelType": "petrol",
    "transmission": "automatic",
    "seatingCapacity": 2,
    "price": 64250,
    "imageUrl": "https://i.ytimg.com/vi/sKIW5y7HU5Q/maxresdefault.jpg",
    "features": [
      "retractable hardtop",
      "AMG sport suspension",
      "adaptive braking technology",
      "Apple CarPlay and Android Auto",
      "AMG performance seats"
    ]
  }
];

const seedDatabase = async () => {
  // try {
  //   await Car.deleteMany({});
  //   await Car.insertMany(sampleCars);
  //   console.log('Database seeded successfully');
  //   process.exit(0);
  // } catch (error) {
  //   console.error('Error seeding database:', error);
  //   process.exit(1);
  // }
  const preferences = {
    "bodyStyle": [
      "coupe"
    ],
    "engineType": [],
    "exhaust": [],
    "tyres": [],
    "fuelType": [],
    "transmission": [],
    "seatingCapacity": [],
    "priceRange": {
      "min": 0,
      "max": 100000
    }
  }
  const query = buildStrictRecommendationQuery(preferences);
  let cars;
  // Get recommendations - only cars that match ALL specified preferences
  cars = await optimizeQuery(
    Car.find(query)
      .select(getStandardSelectFields())
      .limit(12)
      .sort({ price: 1 })
  );
  console.log(cars,"fd")
  const ferrari = await Car.findOne({ make: "Ferrari" });
  console.log(JSON.stringify(ferrari.bodyStyle)); // Look for extra charac
};
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

seedDatabase();