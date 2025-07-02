export interface ItineraryDay {
  day: number
  date: string
  title: string
  location: string
  description: string
  activities: string[]
  image: string
  highlights: string[]
  accommodation: string
}

export interface TourPackage {
  id: string
  name: string
  dates: string
  regions: string[]
  startEnd: string
  duration: string
  price: string
  includes: string
  description: string
  overview: string[]
  itinerary: ItineraryDay[]
}

export const tourPackages: Record<string, TourPackage> = {
  'southern-ethiopia': {
    id: 'southern-ethiopia',
    name: 'Southern Ethiopian Coffee Origin Trip 2025',
    dates: 'November 26 – December 2, 2025',
    regions: ['Sidama', 'Yirgacheffe', 'Guji', 'Addis Ababa'],
    startEnd: 'Addis Ababa',
    duration: '7 Days',
    price: '$1,850 USD',
    includes:
      'All local travel (including flights within Ethiopia), meals and drinks, lodging, marketing support: professional content creation to enhance your coffee storytelling',
    description:
      "Step into the birthplace of Arabica coffee. This 7-day immersive journey takes you deep into Ethiopia's iconic coffee-producing regions—connecting you with the people, places, and processes behind the beans.",
    overview: [
      "Step into the birthplace of Arabica coffee. This 7-day immersive journey takes you deep into Ethiopia's",
      'iconic coffee-producing regions—Sidama, Yirgacheffe, and Guji—connecting you with the people, places, and processes behind the beans.',
      "From heirloom varieties grown in misty highlands to cooperative-led traceability systems and forest-grown naturals, you'll ",
      'gain firsthand insight into what makes Ethiopian coffee legendary.',
      'Whether youre a roaster, café owner, importer, green buyer, or passionate coffee explorer, this trip offers exclusive access to top producers, cuppings at origin, and relationship-driven sourcing opportunities.',
    ],

    itinerary: [
      {
        day: 1,
        date: 'November 26',
        title: 'Addis Ababa ➝ Sidama',
        location: 'Sidama Region',
        description:
          "Begin your Ethiopian coffee journey with a scenic journey to Sidama, one of Ethiopia's most renowned coffee regions. Meet cooperative leaders and experience your first taste of authentic Ethiopian coffee culture.",
        activities: [
          'Morning flight or scenic drive to Hawassa',
          'Welcome reception with Sidama cooperative and union leaders',
          'Visits to farms and washing stations',
          'Orientation on Sidama heirloom varieties and processing systems',
          'Connection Session: Roundtable with local farmers and cooperatives',
          'Group dinner',
        ],
        image:
          'https://www.konacoffeeandtea.com/cdn/shop/files/farm_planting_photos_2020-38_600x.jpg?v=1689609549',
        highlights: [
          'Sidama cooperatives',
          'Heirloom varieties',
          'Traditional processing',
        ],
        accommodation: 'Sidama (eco-lodge or guesthouse)',
      },
      {
        day: 2,
        date: 'November 27',
        title: 'Sidama ➝ Dilla',
        location: 'Sidama to Dilla',
        description:
          'Experience hands-on coffee harvesting with local farmers and explore both washed and natural processing methods before traveling to Dilla.',
        activities: [
          'Coffee harvesting with local farmers',
          'Visits to washed and natural processing sites',
          'Cupping of Sidama lots with local experts',
          'Community lunch with a Farmer–Buyer Exchange',
          'Scenic drive to Dilla',
        ],

        image:
          'https://www.konacoffeeandtea.com/cdn/shop/files/farm_planting_photos_2020-38_600x.jpg?v=1689609549',
        highlights: [
          'Coffee harvesting',
          'Processing methods',
          'Farmer-Buyer Exchange',
        ],
        accommodation: 'Dilla',
      },
      {
        day: 3,
        date: 'November 28',
        title: 'Yirgacheffe Immersion',
        location: 'Yirgacheffe Region',
        description:
          'Immerse yourself in the legendary Yirgacheffe region, exploring highland heirloom coffee plots and cooperative washing stations.',
        activities: [
          'Visits to highland heirloom coffee plots',
          'Cooperative washing stations and drying beds',
          'Evening cupping session at a local facility',
          'Trade Discussion: Transparency and logistics in cooperative exports',
        ],
        image:
          'https://www.konacoffeeandtea.com/cdn/shop/files/farm_planting_photos_2020-38_600x.jpg?v=1689609549',
        highlights: [
          'Yirgacheffe terroir',
          'Cooperative systems',
          'Trade transparency',
        ],
        accommodation: 'Yirgacheffe',
      },
      {
        day: 4,
        date: 'November 29',
        title: 'Yirgacheffe ➝ Guji',
        location: 'Guji Zone',
        description:
          'Journey to the Guji region to explore forest and semi-forest farms, meet smallholder producers, and experience traditional Ethiopian culture.',
        activities: [
          'Transfer to Guji Zone',
          'Tours of forest and semi-forest farms',
          'Meet smallholder producers and traceability-focused cooperatives',
          'Cupping Guji naturals and experimental micro-lots',
          'Open Trade Dialogue: Sourcing Q&A with local exporters',
          'Cultural experiences: Traditional music, weaving, and Ethiopian coffee ceremony',
        ],
        image:
          'https://www.konacoffeeandtea.com/cdn/shop/files/farm_planting_photos_2020-38_600x.jpg?v=1689609549',
        highlights: [
          'Forest farms',
          'Experimental micro-lots',
          'Cultural experiences',
        ],
        accommodation: 'Guji (eco-lodge or camping)',
      },
      {
        day: 5,
        date: 'November 30',
        title: 'Guji ➝ Addis Ababa',
        location: 'Return to Addis Ababa',
        description:
          "Full-day scenic return journey to Ethiopia's capital city, Addis Ababa.",
        activities: ['Full-day return journey to Addis Ababa'],
        image:
          'https://www.konacoffeeandtea.com/cdn/shop/files/farm_planting_photos_2020-38_600x.jpg?v=1689609549',
        highlights: ['Scenic journey', 'Return to capital'],
        accommodation: 'Addis Ababa (hotel not included)',
      },
      {
        day: 6,
        date: 'December 1',
        title: 'B2B Exporter Forum',
        location: 'Addis Ababa',
        description:
          'Comprehensive business day focused on building direct trade relationships with Ethiopian exporters, unions, and processors.',
        activities: [
          'Business-to-Business Networking Session',
          'Meet top exporters, unions, and processors',
          'Learn about export contracts, traceability, and certifications',

          'Visits to dry mills, quality labs, and export facilities',

          'Farewell dinner with live Ethiopian music',
        ],

        image:
          'https://www.konacoffeeandtea.com/cdn/shop/files/farm_planting_photos_2020-38_600x.jpg?v=1689609549',
        highlights: ['B2B networking', 'Export facilities', 'Direct trade'],
        accommodation: 'Addis Ababa (hotel not included)',
      },
      {
        day: 7,
        date: 'December 2',
        title: 'Departure Day',
        location: 'Addis Ababa',
        description:
          'Final morning in Ethiopia with breakfast and airport transfer for international departures.',
        activities: [
          'Breakfast and check-out',
          'Airport transfer for international departures',
        ],
        image:
          'https://www.konacoffeeandtea.com/cdn/shop/files/farm_planting_photos_2020-38_600x.jpg?v=1689609549',
        highlights: ['Departure', 'Airport transfer'],
        accommodation: 'Departure day',
      },
    ],
  },
  'western-ethiopia': {
    id: 'western-ethiopia',
    name: 'Western Ethiopian Coffee Origin Trip 2025',
    dates: 'December 1 – December 6, 2025',
    regions: ['Jimma', 'Kaffa', 'Bebeka', 'Addis Ababa'],
    startEnd: 'Addis Ababa',
    duration: '6 Days',
    price: '$1,650 USD',
    includes:
      'All local travel (including flights within Ethiopia), meals and drinks, lodging, marketing support: professional content creation to enhance your coffee storytelling',
    description:
      'Journey to the birthplace of coffee in Western Ethiopia. Explore wild coffee forests, visit historical sites, and experience the origins of coffee culture.',
    overview: [
      "Explore the heart of wild Arabica coffee in Ethiopia's lush western highlands. This 6-day curated journey introduces you to the birthplace of wild coffee—Limu, Kaffa, and Gesha—where biodiversity, heritage, and specialty coffee production converge.",
      "Meet conservation-driven producers, cup rare wild-origin lots, and walk through living coffee forests still nurtured by traditional communities. Perfect for those seeking sustainable sourcing relationships and a deeper understanding of Ethiopia's diverse terroirs—including the legendary origin of the Gesha variety.",
    ],

    itinerary: [
      {
        day: 1,
        date: 'December 1',
        title: 'B2B Exporter Forum – Addis Ababa',
        location: 'Addis Ababa',
        description:
          'Start your journey with a comprehensive business day focused on building direct trade relationships with Ethiopian exporters, unions, and processors in the capital city.',
        activities: [
          'Business-to-Business Networking Session',
          'Meet top green coffee exporters, unions, and processors',
          'Gain insights into export contracts, traceability, and long-term sourcing',

          'Guided tours of dry mills, quality labs, and export hubs',

          'Welcome dinner with live Ethiopian music',
        ],

        image:
          'https://www.konacoffeeandtea.com/cdn/shop/files/farm_planting_photos_2020-38_600x.jpg?v=1689609549',
        highlights: [
          'B2B networking',
          'Export facilities',
          'Direct trade relationships',
        ],
        accommodation: 'Addis Ababa',
      },
      {
        day: 2,
        date: 'December 2',
        title: 'Addis Ababa ➝ Jimma',
        location: 'Jimma Region',
        description:
          "Journey to Jimma, one of Ethiopia's major coffee-producing regions, known for its diverse processing methods and rich coffee heritage.",
        activities: [
          'Domestic flight or scenic drive to Jimma, then travel to Limu',
          'Visits to farms, wet mills, and coffee agronomy centers',
          'Cupping session featuring Jimma washed and natural profiles',
          'Buyer–Producer Roundtable with cooperative leaders',
        ],
        image:
          'https://www.konacoffeeandtea.com/cdn/shop/files/farm_planting_photos_2020-38_600x.jpg?v=1689609549',
        highlights: [
          'Jimma coffee profiles',
          'Wet mills',
          'Producer roundtable',
        ],
        accommodation: 'Jimma (eco-lodge or camp)',
      },
      {
        day: 3,
        date: 'December 3',
        title: 'Jimma ➝ Bonga (Kaffa)',
        location: 'Kaffa Biosphere Reserve',
        description:
          'Explore the birthplace of coffee in the Kaffa Biosphere Reserve, where wild coffee still grows in its natural forest habitat.',
        activities: [
          'Journey to the Kaffa Biosphere Reserve',
          'Forest trek and wild coffee harvesting demonstration',
          'Visits to wild-origin coffee tree clusters and traditional agroforestry plots',
          'Meet-the-Producers Session: Conservation and wild-origin sourcing',
        ],
        image:
          'https://www.konacoffeeandtea.com/cdn/shop/files/farm_planting_photos_2020-38_600x.jpg?v=1689609549',
        highlights: [
          'Wild coffee origin',
          'Forest conservation',
          'Traditional agroforestry',
        ],
        accommodation: 'Bonga (lodge or partner camp)',
      },
      {
        day: 4,
        date: 'December 4',
        title: 'Bonga ➝ Gesha (Bench Sheko Zone)',
        location: 'Gesha District',
        description:
          'Visit the legendary Gesha District, home to the wild Gesha coffee variety that has captivated the specialty coffee world.',
        activities: [
          'Travel to Gesha District—home of the legendary wild Gesha coffee variety',
          'Visit forest areas in Gesha and Gori Gesha Forest, where wild Gesha still grows',
          'Meet producers, conservation experts, and farmer groups',
          'Optional visit to Gesha Village Coffee Estate (by special arrangement)',
          'Cupping session: wild and cultivated Gesha coffees, discussion on genetics and flavor',
        ],
        image:
          'https://www.konacoffeeandtea.com/cdn/shop/files/farm_planting_photos_2020-38_600x.jpg?v=1689609549',
        highlights: [
          'Wild Gesha variety',
          'Forest conservation',
          'Genetics and flavor',
        ],
        accommodation: 'Mizan Teferi or Gesha (lodge or partner camp)',
      },
      {
        day: 5,
        date: 'December 5',
        title: 'Return to Addis Ababa',
        location: 'Addis Ababa',
        description:
          "Return journey to Ethiopia's capital with optional time for café visits and souvenir shopping.",
        activities: [
          'Return trip to Jimma and domestic flight to Addis Ababa',
          'Optional café hopping, souvenir shopping, or rest',
        ],
        image:
          'https://www.konacoffeeandtea.com/cdn/shop/files/farm_planting_photos_2020-38_600x.jpg?v=1689609549',
        highlights: ['Return journey', 'Optional activities'],
        accommodation: 'Addis Ababa (hotel not included)',
      },
      {
        day: 6,
        date: 'December 6',
        title: 'Departure Day',
        location: 'Addis Ababa',
        description:
          'Final morning in Ethiopia with breakfast and airport transfer for international departures.',
        activities: [
          'Breakfast and check-out',
          'Airport transfers for international flights',
        ],
        image:
          'https://www.konacoffeeandtea.com/cdn/shop/files/farm_planting_photos_2020-38_600x.jpg?v=1689609549',
        highlights: ['Departure', 'Airport transfer'],
        accommodation: 'Departure day',
      },
    ],
  },
  'complete-ethiopia': {
    id: 'complete-ethiopia',
    name: 'Complete Ethiopian Coffee Origin Trip 2025',
    dates: 'November 26 – December 6, 2025',
    regions: [
      'Sidama',
      'Yirgacheffe',
      'Guji',
      'Jimma',
      'Kaffa',
      'Bebeka',
      'Addis Ababa',
    ],
    startEnd: 'Addis Ababa',
    duration: '11 Days',
    price: '$2,850 USD',
    includes:
      'All local travel (including flights within Ethiopia), meals and drinks, lodging, marketing support: professional content creation to enhance your coffee storytelling',
    description:
      'The ultimate Ethiopian coffee experience. Combine both Southern and Western regions for a comprehensive journey through all major coffee-producing areas of Ethiopia.',
    overview: [
      "Step into the birthplace of Arabica coffee. This 11-day immersive journey connects you to the people, places, and processes behind Ethiopias world-renowned coffees. From the forest origins of wild coffee to progressive cooperatives and highland farms, you'll taste exceptional lots at origin and forge real relationships with producers and exporters.",
      'Whether youre a green buyer, trader, roaster,or passionate enthusiast, this trip offers deep learning, direct trade access, and cultural connection at every stop.',
    ],
    itinerary: [
      {
        day: 1,
        date: 'November 26',
        title: 'Addis Ababa ➝ Sidama',
        location: 'Sidama Region',
        description:
          "Begin your Ethiopian coffee journey with a scenic journey to Sidama, one of Ethiopia's most renowned coffee regions. Meet cooperative leaders and experience your first taste of authentic Ethiopian coffee culture.",
        activities: [
          'Morning flight or scenic drive to Hawassa',
          'Welcome by Sidama cooperative and union leaders',
          'Farm and washing station visits',
          'Orientation on Sidama varieties, elevation, and processing',
          'Connection Session: Roundtable with local farmers and cooperatives',
          'Group dinner',
        ],
        image:
          'https://www.konacoffeeandtea.com/cdn/shop/files/farm_planting_photos_2020-38_600x.jpg?v=1689609549',
        highlights: [
          'Sidama cooperatives',
          'Heirloom varieties',
          'Traditional processing',
        ],
        accommodation: 'Sidama (eco-lodge or guesthouse)',
      },
      {
        day: 2,
        date: 'November 27',
        title: 'Sidama Field Experience ➝ Dilla',
        location: 'Sidama to Dilla',
        description:
          'Experience hands-on coffee harvesting with local farmers and explore both washed and natural processing methods before traveling to Dilla.',
        activities: [
          'Coffee harvesting with smallholder farmers',
          'Visits to washed and natural processing sites',
          'Cupping Sidama lots with local experts',
          'Farmer–Buyer Exchange over community lunch',
          'Scenic transfer to Dilla',
        ],
        image:
          'https://www.konacoffeeandtea.com/cdn/shop/files/farm_planting_photos_2020-38_600x.jpg?v=1689609549',
        highlights: [
          'Coffee harvesting',
          'Processing methods',
          'Farmer-Buyer Exchange',
        ],
        accommodation: 'Dilla',
      },
      {
        day: 3,
        date: 'November 28',
        title: 'Yirgacheffe Immersion',
        location: 'Yirgacheffe Region',
        description:
          'Immerse yourself in the legendary Yirgacheffe region, exploring highland heirloom coffee plots and cooperative washing stations.',
        activities: [
          'Explore highland farms and heirloom coffee plots',
          'Visit cooperative washing stations and drying beds',
          'Evening cupping at Yirgacheffe facility',
          'Trade Discussion: Cooperative transparency & export logistics',
        ],
        image:
          'https://www.konacoffeeandtea.com/cdn/shop/files/farm_planting_photos_2020-38_600x.jpg?v=1689609549',
        highlights: [
          'Yirgacheffe terroir',
          'Cooperative systems',
          'Trade transparency',
        ],
        accommodation: 'Yirgacheffe',
      },
      {
        day: 4,
        date: 'November 29',
        title: 'Yirgacheffe ➝ Guji',
        location: 'Guji Zone',
        description:
          'Journey to the Guji region to explore forest and semi-forest farms, meet smallholder producers, and experience traditional Ethiopian culture.',
        activities: [
          'Travel to Guji Zone',
          'Tour forest and semi-forest coffee farms',
          'Meet smallholder producers and traceability-focused cooperatives',
          'Evening cupping of Guji naturals and experimental lots',
          'Open Trade Dialogue: Sourcing Q&A with producers and exporters',
          'Cultural evening: music, weaving & traditional coffee ceremony',
        ],
        image:
          'https://www.konacoffeeandtea.com/cdn/shop/files/farm_planting_photos_2020-38_600x.jpg?v=1689609549',
        highlights: [
          'Forest farms',
          'Experimental micro-lots',
          'Cultural experiences',
        ],
        accommodation: 'Guji (camping or eco-lodge)',
      },
      {
        day: 5,
        date: 'November 30',
        title: 'Guji ➝ Addis Ababa',
        location: 'Return to Addis Ababa',
        description:
          "Full-day scenic return journey to Ethiopia's capital city, Addis Ababa.",
        activities: ['Full-day return travel to Addis Ababa'],
        image:
          'https://www.konacoffeeandtea.com/cdn/shop/files/farm_planting_photos_2020-38_600x.jpg?v=1689609549',
        highlights: ['Scenic journey', 'Return to capital'],
        accommodation: 'Addis Ababa',
      },
      {
        day: 6,
        date: 'December 1',
        title: 'B2B Exporter Forum – Addis Ababa',
        location: 'Addis Ababa',
        description:
          'Comprehensive business day focused on building direct trade relationships with Ethiopian exporters, unions, and processors.',
        activities: [
          'Business-to-Business Networking Session',
          'Meet top exporters, unions, and processors',
          'Learn about export contracts, traceability, and certifications',
          'Visits to dry mills, quality labs, and export facilities',
          'Farewell dinner with live Ethiopian music',
        ],

        image:
          'https://www.konacoffeeandtea.com/cdn/shop/files/farm_planting_photos_2020-38_600x.jpg?v=1689609549',
        highlights: ['B2B networking', 'Export facilities', 'Direct trade'],
        accommodation: 'Addis Ababa (hotel not included)',
      },
      {
        day: 7,
        date: 'December 2',
        title: 'Addis Ababa ➝ Jimma',
        location: 'Jimma Region',
        description:
          "Journey to Jimma, one of Ethiopia's major coffee-producing regions, known for its diverse processing methods and rich coffee heritage.",
        activities: [
          'Domestic flight or scenic drive to Jimma, then transfer to Limu',
          'Visits to farms, wet mills, and agronomy centers',
          'Cupping session: Jimma washed and natural profiles',
          'Buyer–Producer Roundtable with cooperative leaders',
        ],
        image:
          'https://www.konacoffeeandtea.com/cdn/shop/files/farm_planting_photos_2020-38_600x.jpg?v=1689609549',
        highlights: [
          'Jimma coffee profiles',
          'Wet mills',
          'Producer roundtable',
        ],
        accommodation: 'Jimma (eco-lodge or camp)',
      },
      {
        day: 8,
        date: 'December 3',
        title: 'Jimma ➝ Bonga (Kaffa)',
        location: 'Kaffa Biosphere Reserve',
        description:
          'Explore the birthplace of coffee in the Kaffa Biosphere Reserve, where wild coffee still grows in its natural forest habitat.',
        activities: [
          'Journey to the Kaffa Biosphere Reserve',
          'Forest trek and wild coffee harvesting demonstration',
          'Visits to wild-origin coffee tree clusters and traditional agroforestry plots',
          'Meet-the-Producers Session: Conservation and wild-origin sourcing',
        ],
        image:
          'https://www.konacoffeeandtea.com/cdn/shop/files/farm_planting_photos_2020-38_600x.jpg?v=1689609549',
        highlights: [
          'Wild coffee origin',
          'Forest conservation',
          'Traditional agroforestry',
        ],
        accommodation: 'Bonga (lodge or partner camp)',
      },
      {
        day: 9,
        date: 'December 4',
        title: 'Bonga ➝ Gesha (Bench Sheko Zone)',
        location: 'Gesha District',
        description:
          'Visit the legendary Gesha District, home to the wild Gesha coffee variety that has captivated the specialty coffee world.',
        activities: [
          'Travel to Gesha District, home of the legendary Gesha coffee',
          'Visit to Gori Gesha Forest, where wild Gesha still grows',
          'Meetings with producers, conservationists, and farmer groups',
          'Optional visit to Gesha Village Coffee Estate (by special arrangement)',
          'Cupping of wild and cultivated Gesha coffees',
          'Discussion: Genetics, flavor profiles, and global demand',
        ],
        image:
          'https://www.konacoffeeandtea.com/cdn/shop/files/farm_planting_photos_2020-38_600x.jpg?v=1689609549',
        highlights: [
          'Wild Gesha variety',
          'Forest conservation',
          'Genetics and flavor',
        ],
        accommodation: 'Mizan Teferi or Gesha (lodge or partner camp)',
      },
      {
        day: 10,
        date: 'December 5',
        title: 'Return to Addis Ababa',
        location: 'Addis Ababa',
        description:
          "Return journey to Ethiopia's capital with optional time for café visits and souvenir shopping.",
        activities: [
          'Return trip to Jimma and domestic flight to Addis Ababa',
          'Optional café hopping, souvenir shopping, or rest',
        ],
        image:
          'https://www.konacoffeeandtea.com/cdn/shop/files/farm_planting_photos_2020-38_600x.jpg?v=1689609549',
        highlights: ['Return journey', 'Optional activities'],
        accommodation: 'Addis Ababa (hotel not included)',
      },
      {
        day: 11,
        date: 'December 6',
        title: 'Departure Day',
        location: 'Addis Ababa',
        description:
          'Final morning in Ethiopia with breakfast and airport transfer for international departures.',
        activities: [
          'Breakfast and check-out',
          'Airport transfers for international departures',
        ],
        image:
          'https://www.konacoffeeandtea.com/cdn/shop/files/farm_planting_photos_2020-38_600x.jpg?v=1689609549',
        highlights: ['Departure', 'Airport transfer'],
        accommodation: 'Departure day',
      },
    ],
  },
}

export const getTourPackage = (tourId: string | undefined): TourPackage => {
  if (!tourId || !tourPackages[tourId]) {
    return tourPackages['southern-ethiopia'] // Default fallback
  }
  return tourPackages[tourId]
}
