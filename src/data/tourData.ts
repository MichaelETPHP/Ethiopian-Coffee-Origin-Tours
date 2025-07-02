export interface ItineraryDay {
  day: number;
  date: string;
  title: string;
  location: string;
  description: string;
  activities: string[];
  image: string;
  highlights: string[];
  accommodation: string;
}

export interface TourPackage {
  id: string;
  name: string;
  dates: string;
  regions: string[];
  startEnd: string;
  duration: string;
  groupSize: string;
  price: string;
  includes: string;
  description: string;
  overview: string;
  itinerary: ItineraryDay[];
}

export const tourPackages: Record<string, TourPackage> = {
  'southern-ethiopia': {
    id: 'southern-ethiopia',
    name: 'Southern Ethiopian Coffee Origin Trip 2025',
    dates: 'November 26 – December 2, 2025',
    regions: ['Sidama', 'Yirgacheffe', 'Guji', 'Addis Ababa'],
    startEnd: 'Addis Ababa',
    duration: '7 Days',
    groupSize: '8-15 People',
    price: '$1,850 USD',
    includes: 'All local travel (including flights within Ethiopia), meals and drinks, lodging, marketing support: professional content creation to enhance your coffee storytelling',
    description: 'Step into the birthplace of Arabica coffee. This 7-day immersive journey takes you deep into Ethiopia\'s iconic coffee-producing regions—connecting you with the people, places, and processes behind the beans.',
    overview: 'From heirloom varieties grown in misty highlands to cooperative-led traceability systems and forest-grown naturals, you\'ll gain firsthand insight into what makes Ethiopian coffee legendary. Whether you\'re a roaster, café owner, importer, green buyer, or passionate coffee explorer, this trip offers exclusive access to top producers, cuppings at origin, and relationship-driven sourcing opportunities.',
    itinerary: [
      {
        day: 1,
        date: "November 26",
        title: "Addis Ababa ➝ Sidama",
        location: "Sidama Region",
        description: "Begin your Ethiopian coffee journey with a scenic journey to Sidama, one of Ethiopia's most renowned coffee regions. Meet cooperative leaders and experience your first taste of authentic Ethiopian coffee culture.",
        activities: [
          "Morning flight or scenic drive to Hawassa",
          "Welcome reception with Sidama cooperative and union leaders",
          "Visits to farms and washing stations",
          "Orientation on Sidama heirloom varieties and processing systems",
          "Connection Session: Roundtable with local farmers and cooperatives",
          "Group dinner featuring traditional Ethiopian cuisine"
        ],
        image: "https://images.pexels.com/photos/4021521/pexels-photo-4021521.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
        highlights: ["Sidama cooperatives", "Heirloom varieties", "Traditional processing"],
        accommodation: "Sidama eco-lodge or guesthouse"
      },
      {
        day: 2,
        date: "November 27",
        title: "Sidama Coffee Immersion",
        location: "Sidama Highlands",
        description: "Dive deep into Sidama's coffee culture with hands-on farm experiences, processing demonstrations, and cupping sessions that showcase the region's distinctive flavor profiles.",
        activities: [
          "Early morning farm visits in the highlands",
          "Hands-on coffee picking experience",
          "Traditional and modern processing demonstrations",
          "Cupping session with local coffee experts",
          "Visit to Sidama Coffee Farmers Cooperative Union",
          "Evening cultural performance and coffee ceremony"
        ],
        image: "https://images.pexels.com/photos/4349775/pexels-photo-4349775.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
        highlights: ["Coffee picking", "Processing methods", "Cultural ceremony"],
        accommodation: "Sidama eco-lodge or guesthouse"
      },
      {
        day: 3,
        date: "November 28",
        title: "Journey to Yirgacheffe",
        location: "Yirgacheffe Region",
        description: "Travel to the legendary Yirgacheffe region, famous for producing some of the world's most distinctive and floral coffee profiles. Experience the unique terroir that makes Yirgacheffe coffee so special.",
        activities: [
          "Scenic drive through Ethiopian highlands to Yirgacheffe",
          "Visit to famous Yirgacheffe washing stations",
          "Meet local farmers and learn about traditional cultivation",
          "Explore the unique microclimate and soil conditions",
          "Afternoon cupping of various Yirgacheffe lots",
          "Sunset viewing from coffee plantation hills"
        ],
        image: "https://images.pexels.com/photos/4109743/pexels-photo-4109743.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
        highlights: ["Yirgacheffe terroir", "Floral profiles", "Washing stations"],
        accommodation: "Yirgacheffe mountain lodge"
      },
      {
        day: 4,
        date: "November 29",
        title: "Yirgacheffe Deep Dive",
        location: "Yirgacheffe Cooperatives",
        description: "Spend a full day exploring Yirgacheffe's renowned cooperatives and processing facilities. Learn about the meticulous care that goes into producing these world-famous coffees.",
        activities: [
          "Visit to Yirgacheffe Coffee Farmers Cooperative Union",
          "Tour of natural and washed processing facilities",
          "Meet with cooperative managers and quality control experts",
          "Participate in green coffee grading and sorting",
          "Exclusive cupping of competition-grade lots",
          "Direct trade discussion and sourcing opportunities"
        ],
        image: "https://images.pexels.com/photos/1251175/pexels-photo-1251175.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
        highlights: ["Cooperative systems", "Quality grading", "Direct trade"],
        accommodation: "Yirgacheffe mountain lodge"
      },
      {
        day: 5,
        date: "November 30",
        title: "Guji Region Exploration",
        location: "Guji Zone",
        description: "Journey to the Guji region, known for its fruity, wine-like coffee characteristics. Meet innovative producers who are pushing the boundaries of Ethiopian coffee processing.",
        activities: [
          "Travel to Guji zone through scenic mountain roads",
          "Visit to innovative processing facilities",
          "Meet renowned Guji coffee producers",
          "Experience experimental fermentation techniques",
          "Taste distinctive Guji flavor profiles",
          "Learn about altitude's impact on coffee development"
        ],
        image: "https://images.pexels.com/photos/1002703/pexels-photo-1002703.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
        highlights: ["Guji terroir", "Innovation techniques", "Altitude effects"],
        accommodation: "Guji highland guesthouse"
      },
      {
        day: 6,
        date: "December 1",
        title: "Guji Processing Innovation",
        location: "Guji Processing Centers",
        description: "Explore cutting-edge processing methods in Guji, including anaerobic fermentation and extended drying techniques that create unique flavor profiles.",
        activities: [
          "Visit to advanced processing facilities",
          "Learn about anaerobic and carbonic maceration",
          "Hands-on experience with drying bed management",
          "Quality control and moisture content testing",
          "Cupping of experimental lots",
          "Farewell dinner with Guji producers"
        ],
        image: "https://images.pexels.com/photos/2373201/pexels-photo-2373201.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
        highlights: ["Processing innovation", "Quality control", "Producer relationships"],
        accommodation: "Guji highland guesthouse"
      },
      {
        day: 7,
        date: "December 2",
        title: "Return to Addis Ababa",
        location: "Addis Ababa",
        description: "Return to Addis Ababa for final cuppings, reflection on your journey, and opportunities to finalize any direct trade relationships established during the trip.",
        activities: [
          "Return journey to Addis Ababa",
          "Comprehensive cupping session of all regions visited",
          "Final discussions on sourcing and direct trade",
          "Visit to Addis Ababa coffee roasters and cafes",
          "Trip reflection and feedback session",
          "Farewell dinner and cultural celebration"
        ],
        image: "https://images.pexels.com/photos/4349775/pexels-photo-4349775.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
        highlights: ["Final cupping", "Trade finalization", "Cultural celebration"],
        accommodation: "Addis Ababa hotel (departure day)"
      }
    ]
  },
  'western-ethiopia': {
    id: 'western-ethiopia',
    name: 'Western Ethiopian Coffee Origin Trip 2025',
    dates: 'December 1 – December 6, 2025',
    regions: ['Jimma', 'Kaffa', 'Bebeka', 'Addis Ababa'],
    startEnd: 'Addis Ababa',
    duration: '6 Days',
    groupSize: '8-12 People',
    price: '$1,650 USD',
    includes: 'All local travel (including flights within Ethiopia), meals and drinks, lodging, marketing support: professional content creation to enhance your coffee storytelling',
    description: 'Journey to the birthplace of coffee in Western Ethiopia. Explore wild coffee forests, visit historical sites, and experience the origins of coffee culture.',
    overview: 'Discover where coffee began in the wild forests of Kaffa, explore traditional processing in Jimma, and witness large-scale sustainable production at Bebeka Estate. This adventure takes you off the beaten path to coffee\'s most authentic origins.',
    itinerary: [
      {
        day: 1,
        date: "December 1",
        title: "Addis Ababa ➝ Jimma",
        location: "Jimma Region",
        description: "Begin your western Ethiopia adventure with a journey to Jimma, one of Ethiopia's most important historical coffee centers. Discover traditional farming methods and the deep cultural significance of coffee.",
        activities: [
          "Morning departure from Addis Ababa to Jimma",
          "Visit to traditional coffee farms",
          "Meet local coffee farming families",
          "Learn about historical coffee trade routes",
          "Traditional coffee ceremony experience",
          "Welcome dinner with local community leaders"
        ],
        image: "https://images.pexels.com/photos/2373201/pexels-photo-2373201.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
        highlights: ["Historical significance", "Traditional methods", "Cultural heritage"],
        accommodation: "Jimma heritage lodge"
      },
      {
        day: 2,
        date: "December 2",
        title: "Jimma Coffee Heritage",
        location: "Jimma Highlands",
        description: "Explore Jimma's rich coffee heritage with visits to traditional processing sites and meetings with multi-generational coffee families who have preserved ancient techniques.",
        activities: [
          "Visit to traditional sun-drying facilities",
          "Meet multi-generational coffee families",
          "Learn about indigenous processing techniques",
          "Explore local coffee markets and trading",
          "Hands-on traditional processing experience",
          "Evening storytelling session about coffee history"
        ],
        image: "https://images.pexels.com/photos/4021521/pexels-photo-4021521.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
        highlights: ["Traditional processing", "Family heritage", "Ancient techniques"],
        accommodation: "Jimma heritage lodge"
      },
      {
        day: 3,
        date: "December 3",
        title: "Journey to Kaffa - Coffee's Birthplace",
        location: "Kaffa Region",
        description: "Travel to the legendary Kaffa region, widely regarded as the birthplace of Arabica coffee. Discover wild coffee forests and learn about the origin story of coffee discovery.",
        activities: [
          "Scenic journey to Kaffa region",
          "Visit to wild coffee forests",
          "Learn about coffee origin legends and folklore",
          "Meet indigenous coffee communities",
          "Forest conservation education and initiatives",
          "Traditional forest coffee ceremony"
        ],
        image: "https://images.pexels.com/photos/4349775/pexels-photo-4349775.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
        highlights: ["Coffee birthplace", "Wild forests", "Origin legends"],
        accommodation: "Kaffa forest eco-lodge"
      },
      {
        day: 4,
        date: "December 4",
        title: "Kaffa Forest Immersion",
        location: "Kaffa Wild Coffee Forests",
        description: "Spend a full day immersed in Kaffa's wild coffee forests, where Arabica coffee grows naturally. Experience the pristine environment where coffee first evolved.",
        activities: [
          "Guided forest trek to wild coffee groves",
          "Learn about coffee's natural evolution",
          "Meet forest conservation experts",
          "Participate in sustainable harvesting practices",
          "Wild coffee tasting and comparison",
          "Cultural exchange with forest communities"
        ],
        image: "https://images.pexels.com/photos/1002703/pexels-photo-1002703.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
        highlights: ["Wild coffee", "Conservation", "Natural evolution"],
        accommodation: "Kaffa forest eco-lodge"
      },
      {
        day: 5,
        date: "December 5",
        title: "Bebeka Coffee Estate",
        location: "Bebeka Estate",
        description: "Visit Ethiopia's largest and oldest coffee estate at Bebeka. Experience large-scale coffee production while maintaining traditional Ethiopian coffee values and sustainable practices.",
        activities: [
          "Comprehensive tour of Bebeka Coffee Estate",
          "Learn about large-scale sustainable production",
          "Meet estate managers and quality control teams",
          "Observe modern processing and quality systems",
          "Cupping session of estate coffees",
          "Sustainability and social impact presentation"
        ],
        image: "https://images.pexels.com/photos/4109743/pexels-photo-4109743.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
        highlights: ["Largest estate", "Sustainability focus", "Quality systems"],
        accommodation: "Bebeka estate guesthouse"
      },
      {
        day: 6,
        date: "December 6",
        title: "Return to Addis Ababa",
        location: "Addis Ababa",
        description: "Return to Addis Ababa for final reflections on your western Ethiopia coffee journey and opportunities to explore the capital's vibrant coffee scene.",
        activities: [
          "Return journey to Addis Ababa",
          "Visit to Addis Ababa's historic coffee houses",
          "Final cupping session comparing all regions",
          "Shopping for coffee and cultural souvenirs",
          "Trip reflection and group discussion",
          "Farewell dinner and cultural show"
        ],
        image: "https://images.pexels.com/photos/2373201/pexels-photo-2373201.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
        highlights: ["Capital exploration", "Final cupping", "Cultural farewell"],
        accommodation: "Addis Ababa hotel (departure day)"
      }
    ]
  },
  'complete-ethiopia': {
    id: 'complete-ethiopia',
    name: 'Complete Ethiopian Coffee Origin Trip 2025',
    dates: 'November 26 – December 6, 2025',
    regions: ['Sidama', 'Yirgacheffe', 'Guji', 'Jimma', 'Kaffa', 'Bebeka', 'Addis Ababa'],
    startEnd: 'Addis Ababa',
    duration: '11 Days',
    groupSize: '10-18 People',
    price: '$2,850 USD',
    includes: 'All local travel (including flights within Ethiopia), meals and drinks, lodging, marketing support: professional content creation to enhance your coffee storytelling',
    description: 'The ultimate Ethiopian coffee experience. Combine both Southern and Western regions for a comprehensive journey through all major coffee-producing areas of Ethiopia.',
    overview: 'This comprehensive journey covers every major coffee region in Ethiopia, from the floral highlands of Yirgacheffe to the wild forests of Kaffa. Experience the complete story of Ethiopian coffee, from its ancient origins to modern innovations, with exclusive access to top producers and processing facilities.',
    itinerary: [
      {
        day: 1,
        date: "November 26",
        title: "Arrival & Addis Ababa Orientation",
        location: "Addis Ababa",
        description: "Welcome to Ethiopia! Begin your comprehensive coffee journey with an orientation to Ethiopian coffee culture and history in the capital city.",
        activities: [
          "Airport pickup and hotel check-in",
          "Ethiopian coffee culture orientation",
          "Visit to National Coffee Museum",
          "Traditional Ethiopian coffee ceremony",
          "Welcome dinner with coffee experts",
          "Trip briefing and preparation"
        ],
        image: "https://images.pexels.com/photos/4349775/pexels-photo-4349775.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
        highlights: ["Cultural orientation", "Coffee ceremony", "Expert briefing"],
        accommodation: "Addis Ababa luxury hotel"
      },
      {
        day: 2,
        date: "November 27",
        title: "Addis Ababa ➝ Sidama",
        location: "Sidama Region",
        description: "Journey to Sidama, one of Ethiopia's most renowned coffee regions, and begin your immersion into cooperative-based coffee production.",
        activities: [
          "Morning flight to Hawassa",
          "Welcome reception with Sidama cooperative leaders",
          "First farm visits and washing station tours",
          "Introduction to Sidama heirloom varieties",
          "Cooperative structure education",
          "Traditional dinner with farming families"
        ],
        image: "https://images.pexels.com/photos/4021521/pexels-photo-4021521.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
        highlights: ["Sidama cooperatives", "Heirloom varieties", "Farm immersion"],
        accommodation: "Sidama eco-lodge"
      },
      {
        day: 3,
        date: "November 28",
        title: "Sidama to Yirgacheffe",
        location: "Yirgacheffe Region",
        description: "Travel to the legendary Yirgacheffe region and experience the unique terroir that produces the world's most distinctive coffee flavors.",
        activities: [
          "Scenic drive through coffee highlands",
          "Visit famous Yirgacheffe washing stations",
          "Meet local farmers and cooperative members",
          "Learn about microclimate and soil conditions",
          "Cupping session of various Yirgacheffe lots",
          "Sunset viewing from plantation hills"
        ],
        image: "https://images.pexels.com/photos/4109743/pexels-photo-4109743.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
        highlights: ["Yirgacheffe terroir", "Floral profiles", "Washing stations"],
        accommodation: "Yirgacheffe mountain lodge"
      },
      {
        day: 4,
        date: "November 29",
        title: "Yirgacheffe Deep Dive",
        location: "Yirgacheffe Cooperatives",
        description: "Spend a full day exploring Yirgacheffe's processing facilities and learning about the meticulous care behind these world-famous coffees.",
        activities: [
          "Comprehensive cooperative union visit",
          "Natural and washed processing facility tours",
          "Quality control and grading participation",
          "Competition-grade coffee cupping",
          "Direct trade discussions",
          "Producer relationship building"
        ],
        image: "https://images.pexels.com/photos/1251175/pexels-photo-1251175.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
        highlights: ["Processing mastery", "Quality systems", "Direct trade"],
        accommodation: "Yirgacheffe mountain lodge"
      },
      {
        day: 5,
        date: "November 30",
        title: "Journey to Guji",
        location: "Guji Zone",
        description: "Explore the innovative Guji region, known for experimental processing and distinctive fruity, wine-like coffee characteristics.",
        activities: [
          "Travel to Guji through mountain landscapes",
          "Visit innovative processing facilities",
          "Meet pioneering Guji producers",
          "Experience experimental fermentation techniques",
          "Taste distinctive Guji flavor profiles",
          "Learn about altitude's impact on development"
        ],
        image: "https://images.pexels.com/photos/1002703/pexels-photo-1002703.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
        highlights: ["Innovation hub", "Experimental processing", "Unique terroir"],
        accommodation: "Guji highland guesthouse"
      },
      {
        day: 6,
        date: "December 1",
        title: "Guji to Jimma Transition",
        location: "Jimma Region",
        description: "Transition from southern to western Ethiopia, arriving in Jimma to explore traditional coffee heritage and historical significance.",
        activities: [
          "Journey from Guji to Jimma region",
          "Introduction to western Ethiopia coffee culture",
          "Visit traditional coffee farms",
          "Meet historical coffee families",
          "Learn about ancient trade routes",
          "Traditional processing demonstrations"
        ],
        image: "https://images.pexels.com/photos/2373201/pexels-photo-2373201.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
        highlights: ["Regional transition", "Historical heritage", "Traditional methods"],
        accommodation: "Jimma heritage lodge"
      },
      {
        day: 7,
        date: "December 2",
        title: "Jimma Heritage Exploration",
        location: "Jimma Highlands",
        description: "Deep dive into Jimma's coffee heritage with traditional processing experiences and multi-generational family meetings.",
        activities: [
          "Traditional sun-drying facility visits",
          "Multi-generational family meetings",
          "Indigenous processing technique learning",
          "Local market and trading exploration",
          "Hands-on traditional processing",
          "Historical storytelling sessions"
        ],
        image: "https://images.pexels.com/photos/4021521/pexels-photo-4021521.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
        highlights: ["Family heritage", "Traditional processing", "Cultural stories"],
        accommodation: "Jimma heritage lodge"
      },
      {
        day: 8,
        date: "December 3",
        title: "Kaffa - Coffee's Birthplace",
        location: "Kaffa Region",
        description: "Journey to Kaffa, the legendary birthplace of coffee, to explore wild coffee forests and learn about coffee's origin story.",
        activities: [
          "Travel to sacred Kaffa region",
          "Wild coffee forest exploration",
          "Origin legends and folklore learning",
          "Indigenous community meetings",
          "Forest conservation education",
          "Traditional forest coffee ceremony"
        ],
        image: "https://images.pexels.com/photos/4349775/pexels-photo-4349775.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
        highlights: ["Coffee birthplace", "Wild forests", "Origin stories"],
        accommodation: "Kaffa forest eco-lodge"
      },
      {
        day: 9,
        date: "December 4",
        title: "Kaffa Forest Immersion",
        location: "Wild Coffee Forests",
        description: "Full immersion in Kaffa's pristine wild coffee forests where Arabica coffee grows in its natural habitat.",
        activities: [
          "Guided forest treks to wild coffee groves",
          "Natural coffee evolution education",
          "Conservation expert meetings",
          "Sustainable harvesting participation",
          "Wild coffee tasting experiences",
          "Forest community cultural exchange"
        ],
        image: "https://images.pexels.com/photos/1002703/pexels-photo-1002703.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
        highlights: ["Wild coffee", "Conservation", "Natural habitat"],
        accommodation: "Kaffa forest eco-lodge"
      },
      {
        day: 10,
        date: "December 5",
        title: "Bebeka Estate Experience",
        location: "Bebeka Coffee Estate",
        description: "Visit Ethiopia's largest coffee estate to understand large-scale sustainable production and modern quality systems.",
        activities: [
          "Comprehensive Bebeka estate tour",
          "Large-scale production system learning",
          "Quality control and processing observation",
          "Sustainability initiative exploration",
          "Estate coffee cupping session",
          "Social impact program visits"
        ],
        image: "https://images.pexels.com/photos/4109743/pexels-photo-4109743.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
        highlights: ["Large-scale production", "Sustainability", "Quality systems"],
        accommodation: "Bebeka estate guesthouse"
      },
      {
        day: 11,
        date: "December 6",
        title: "Return & Celebration",
        location: "Addis Ababa",
        description: "Return to Addis Ababa for final celebrations, comprehensive cupping, and reflection on your complete Ethiopian coffee journey.",
        activities: [
          "Return journey to Addis Ababa",
          "Comprehensive cupping of all regions",
          "Final sourcing and trade discussions",
          "Capital city coffee scene exploration",
          "Trip reflection and group sharing",
          "Grand farewell dinner and cultural celebration"
        ],
        image: "https://images.pexels.com/photos/2373201/pexels-photo-2373201.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
        highlights: ["Complete cupping", "Final celebration", "Journey reflection"],
        accommodation: "Addis Ababa luxury hotel (departure day)"
      }
    ]
  }
};

export const getTourPackage = (tourId: string | undefined): TourPackage => {
  if (!tourId || !tourPackages[tourId]) {
    return tourPackages['southern-ethiopia']; // Default fallback
  }
  return tourPackages[tourId];
};