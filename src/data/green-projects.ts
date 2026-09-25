// Copied from jbproperties.my (Johor-Investment-Platform---Green/src/data/projects.ts) so this site can show the same photos and facts and link to the official listing there. Re-copy when Green updates.
// Automatically generated on 2026-09-25T05:37:01.661Z
/** Shape of a listing on jbproperties.my (its own Project type, arrays where this site's type has strings). */
export interface GreenListing {
  project_name: string; developer: string; area: string; state: string; address: string; coordinate: string;
  project_type: string; tenure: string; land_title: string; land_size: string; completion_status: string;
  completion_year: string; construction_period: string; total_units: string; total_floors: string;
  units_per_floor: string; lift_per_floor: string; built_up_min: string; built_up_max: string; bedrooms: string;
  bathrooms: string; layouts: string; price_min: string; price_max: string; price_psf: string; maintenance_fee: string;
  car_park: string; facilities: string[]; nearby: string[]; transportation: string[]; education: string[];
  shopping: string[]; hospital: string[]; key_features: string[]; description: string; developer_description: string;
  seo_title: string; seo_description: string;
  images: { hero: string; facade: string[]; layout: string[]; facility: string[]; location: string[]; gallery: string[]; facilities_plans?: string[] };
}

export const fallbackProjects: GreenListing[] = [
  {
    "project_name": "Aethera Residences",
    "developer": "UOA Group (UOA Development Bhd)",
    "area": "Ibrahim International Business District (IIBD)",
    "state": "Johor",
    "address": "Lot PTB 24456, Jalan Tun Abdul Razak 1/1, Mukim Bandar Johor Bahru, 80000 Johor Bahru, Johor",
    "coordinate": "1.467804, 103.758962",
    "project_type": "Serviced Apartment",
    "tenure": "Freehold",
    "land_title": "Commercial under HDA",
    "land_size": "1.215 acres",
    "completion_status": "Under Construction",
    "completion_year": "2029",
    "construction_period": "54 months",
    "total_units": "786",
    "total_floors": "52",
    "units_per_floor": "21",
    "lift_per_floor": "4",
    "built_up_min": "650",
    "built_up_max": "2,594",
    "bedrooms": "1-4",
    "bathrooms": "1-4",
    "layouts": "Type A (650 sqft), Type A1 (650 sqft), Type B (693 sqft), Type C (904 sqft), Type D (1033 sqft), Type D1 (1033 sqft) Dual-Key, Type E (1315 sqft), Type F Duplex (2358 sqft), Type G (2547 sqft) Duplex",
    "price_min": "RM1,200,000",
    "price_max": "RM5,000,000",
    "price_psf": "RM1,846",
    "maintenance_fee": "RM0.45",
    "car_park": "1 to 2",
    "facilities": [
      "Sky Infinity Pool",
      "Wading Cove",
      "Sky Deck",
      "Tree Promenade",
      "Sky Heated Pool",
      "BBQ Sky Deck",
      "Sun Deck",
      "Energy Lab",
      "Social Chamber",
      "Karaoke Suites"
    ],
    "nearby": [
      "Komtar JBCC",
      "Johor Bahru City Square",
      "KSL City Mall",
      "R&F Mall"
    ],
    "transportation": [
      "Bukit Chagar RTS Station",
      "Johor Bahru CIQ Complex"
    ],
    "education": [
      "Sultan Ibrahim Secondary School",
      "Hilltop Private School",
      "Foon Yew High School"
    ],
    "shopping": [
      "Komtar JBCC",
      "Johor Bahru City Square",
      "R&F Mall",
      "KSL City Mall"
    ],
    "hospital": [
      "Maria Hospital",
      "TMC Fertility Centre",
      "Landmark Medical Centre"
    ],
    "key_features": [
      "Direct 400m covered walkway to Bukit Chagar RTS Station",
      "Freehold tenure in IIBD zone"
    ],
    "description": "Rising above Johor Bahru's skyline, Aethera Residences blends contemporary design with everyday convenience.",
    "developer_description": "UOA Group is one of Malaysia's leading property developers, renowned for track record in premier commercial and residential developments.",
    "seo_title": "Aethera Residences JB by UOA - Luxury RTS Linked Apartments",
    "seo_description": "Discover Aethera Residences by UOA in JB City Centre. Freehold serviced apartments with direct covered link to Bukit Chagar RTS Station.",
    "images": {
      "hero": "https://lh3.googleusercontent.com/d/1j18QOgL-Bha727OihaC5-58guduylh7g",
      "facade": [
        "https://lh3.googleusercontent.com/d/1j18QOgL-Bha727OihaC5-58guduylh7g",
        "https://lh3.googleusercontent.com/d/127foWOn41j7e3YvAvedPoF-cm04bTACJ"
      ],
      "layout": [
        "https://lh3.googleusercontent.com/d/1hb7m3wKJmbWERMDnnBqWfrQApHUqKCoD",
        "https://lh3.googleusercontent.com/d/1wEODtGUFOY_5eZgNlZlEmFo_Blg6nJDA",
        "https://lh3.googleusercontent.com/d/1bqkKgYNe2BVN-Ae31ar416u0XaiUQwSE",
        "https://lh3.googleusercontent.com/d/113rRi19ybslabsR2TzDMZZhWFovBTRLE",
        "https://lh3.googleusercontent.com/d/1pCEcAGvmLAreSJBOUl_iWhGyvpTzXMd5",
        "https://lh3.googleusercontent.com/d/1KHYBELe4wma4z68MjlUf_gpggYaQZqQa",
        "https://lh3.googleusercontent.com/d/1GWTg8B54I-t5HdHoqqIFmidsdZqAFMSt",
        "https://lh3.googleusercontent.com/d/1Hr_v4B0t7qlsG_td393rDqqR5uahvHED",
        "https://lh3.googleusercontent.com/d/1DjgZKvf5xIH30U0ULcqQp1xjnus51yKS"
      ],
      "facility": [
        "https://lh3.googleusercontent.com/d/1iKnL03U6XOr-GmeRV6X5rJbVpd2LBtWA",
        "https://lh3.googleusercontent.com/d/1yqsgBNUqdRNoA9MC41s9OtCvvuTn5GpK",
        "https://lh3.googleusercontent.com/d/1LcUPkIJQMWQGdswVoHk0vnak6cBR36Rb",
        "https://lh3.googleusercontent.com/d/1NDEJN6Uc40hnwXg04X521VlquaoXmt_l"
      ],
      "location": [
        "https://lh3.googleusercontent.com/d/1Z0GHtEV-PkCC8E1LccdLXdfCF5yF2gl6"
      ],
      "gallery": [
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80"
      ],
      "facilities_plans": [
        "https://lh3.googleusercontent.com/d/1wav_X67M93vijNLuQmgI1BN2jK5e1F2Q",
        "https://lh3.googleusercontent.com/d/1CuTSn32JIHjFA33tUyLuM2HehtoTtXK4"
      ]
    }
  },
  {
    "project_name": "Causewayz Square (Axis Tower - Tower A)",
    "developer": "EXSIM Group",
    "area": "JBCC CIQ (Lumba Kuda)",
    "state": "Johor",
    "address": "Lumba Kuda, Bukit Chagar, 80300 Johor Bahru, Johor",
    "coordinate": "1.463260, 103.769424",
    "project_type": "Serviced Apartment (Short-Term/Airbnb)",
    "tenure": "Freehold",
    "land_title": "Commercial under HDA",
    "land_size": "7.7 acres",
    "completion_status": "Under Construction",
    "completion_year": "2029",
    "construction_period": "48 months",
    "total_units": "1,100",
    "total_floors": "60",
    "units_per_floor": "18",
    "lift_per_floor": "6",
    "built_up_min": "366",
    "built_up_max": "592",
    "bedrooms": "Studio-2",
    "bathrooms": "1-2",
    "layouts": "Axis Type A, Axis Type B",
    "price_min": "RM580,300",
    "price_max": "RM954,500",
    "price_psf": "RM1,532",
    "maintenance_fee": "RM0.36 psf (incl. sinking fund)",
    "car_park": "1",
    "facilities": [
      "Exclusive Tower A Sky Pool",
      "Shared Retail Podium",
      "Smart Lock Infrastructure",
      "Co-working Hub",
      "Short-Term Operator Management Lobby",
      "Gym"
    ],
    "nearby": [
      "Komtar JBCC",
      "JB City Square",
      "R&F Mall",
      "Jalan Wong Ah Fook"
    ],
    "transportation": [
      "600m Direct Sheltered Covered Link Bridge to CIQ & RTS Bukit Chagar"
    ],
    "education": [
      "SJK(C) Foon Yew 1",
      "Sri Utama School"
    ],
    "shopping": [
      "Komtar JBCC",
      "City Square",
      "Mid Valley Southkey",
      "KSL City Mall"
    ],
    "hospital": [
      "KPJ Puteri Specialist Hospital",
      "Columbia Asia Hospital"
    ],
    "key_features": [
      "Airbnb-friendly short-term rental positioning managed by Mana Mana hospitality",
      "zoned separately from own-stay towers",
      "speed ramp car park"
    ],
    "description": "An integrated large-scale mixed development by EXSIM spanning 7.7 acres. Tower A is explicitly targeted for highly lucrative short-term rental returns.",
    "developer_description": "EXSIM Group is a leading premium Malaysian real estate developer celebrated for iconic lifestyle concepts such as The Rainz and Millerz Square.",
    "seo_title": "Exsim Causewayz Square Axis Tower JBCC | Short-Term Rental Investment",
    "seo_description": "Invest in Exsim's Causewayz Square Axis Tower. Premium freehold Airbnb-friendly studio and dual-key units with a sheltered bridge direct to JB CIQ.",
    "images": {
      "hero": "https://lh3.googleusercontent.com/d/1H2xx_8G4fZUM6qec6qW0jNUZZMpFT7NK",
      "facade": [
        "https://lh3.googleusercontent.com/d/1H2xx_8G4fZUM6qec6qW0jNUZZMpFT7NK"
      ],
      "layout": [
        "https://lh3.googleusercontent.com/d/1lwM-Xw1ZOSLPw1YzQOfyi8zZGt_hvwR1",
        "https://lh3.googleusercontent.com/d/13SVmGBg9H6W6mGTzJlWUMxaffNV74PBu"
      ],
      "facility": [
        "https://lh3.googleusercontent.com/d/1WTkkx0S5CrkwEEdEwr-J5yxm4wZj2gla",
        "https://lh3.googleusercontent.com/d/1iHHQSzUBYRO4-yHbYhrH0s9VQ1nMQvB3",
        "https://lh3.googleusercontent.com/d/1UrdtZRvGXl3vzSUKT4HZEzX_jUE5j8cP"
      ],
      "location": [
        "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80"
      ],
      "gallery": [
        "https://lh3.googleusercontent.com/d/1FnMD2VjHH7Kz6sSU7wQ2kuEJA-X4C9Um",
        "https://lh3.googleusercontent.com/d/15EMdJXBc6iLJw9goGylhRGL-lg7WzlSQ",
        "https://lh3.googleusercontent.com/d/19Ga1B55ZDzh4RCeE3J5I4Ijn6IXDoDAW",
        "https://lh3.googleusercontent.com/d/1GlJhtn-W73C_779swiqlf9IHMeMKvYBv",
        "https://lh3.googleusercontent.com/d/1YYYIM7V_iV9wyDqexPiR_JdB5zKxK-k7",
        "https://lh3.googleusercontent.com/d/1TbBEpHezTItp9HyJyJ20S2hbycXsiQoN",
        "https://lh3.googleusercontent.com/d/1Tf-TXd-3pxP9B19lPcthHexxMFkV_MVj",
        "https://lh3.googleusercontent.com/d/11tB-sAN1SGJQxL6mkQx9FrvOlX4i0F2w",
        "https://lh3.googleusercontent.com/d/1wm3_ndsEIrM_vt_ZlUEgASCG5RRGVmZL",
        "https://lh3.googleusercontent.com/d/1-ynuCS4PunyasP4tqGkCuGn25XANPeJe",
        "https://lh3.googleusercontent.com/d/1jq6vY0gvVsdvgJnrYYIMgHB_lfucSgkf"
      ],
      "facilities_plans": []
    }
  },
  {
    "project_name": "Causewayz Square (Brixton Tower - Tower B)",
    "developer": "EXSIM Group",
    "area": "JBCC CIQ (Lumba Kuda)",
    "state": "Johor",
    "address": "Lumba Kuda, Bukit Chagar, 80300 Johor Bahru, Johor",
    "coordinate": "1.462977, 103.768988",
    "project_type": "Serviced Apartment (Residential/Own-Stay)",
    "tenure": "Freehold",
    "land_title": "Commercial under HDA",
    "land_size": "7.7 acres",
    "completion_status": "Under Construction",
    "completion_year": "2029",
    "construction_period": "48 months",
    "total_units": "1,200",
    "total_floors": "60",
    "units_per_floor": "16",
    "lift_per_floor": "7",
    "built_up_min": "474",
    "built_up_max": "850",
    "bedrooms": "1-3",
    "bathrooms": "1-2",
    "layouts": "Brixton Type C, Brixton Type D1, Brixton Type D2, Brixton Type E, Brixton Type F",
    "price_min": "RM691,000",
    "price_max": "RM1,237,000",
    "price_psf": "RM1,376",
    "maintenance_fee": "RM0.36 psf (incl. sinking fund)",
    "car_park": "1 to 2",
    "facilities": [
      "Forest Concept Wellness Deck",
      "Infinity Lap Pool",
      "Resident Lounge",
      "Gym Room",
      "Kids Water Play Area"
    ],
    "nearby": [
      "Komtar JBCC",
      "JB City Square",
      "R&F Mall",
      "Jalan Wong Ah Fook"
    ],
    "transportation": [
      "600m Direct Sheltered Covered Link Bridge to CIQ & RTS Bukit Chagar"
    ],
    "education": [
      "SJK(C) Foon Yew 1",
      "Sri Utama School"
    ],
    "shopping": [
      "Komtar JBCC",
      "City Square",
      "Mid Valley Southkey",
      "KSL City Mall"
    ],
    "hospital": [
      "KPJ Puteri Specialist Hospital",
      "Columbia Asia Hospital"
    ],
    "key_features": [
      "Strict residential zoning banning transient Airbnb guests from accessing amenities",
      "15-acre commercial podium"
    ],
    "description": "Part of EXSIM's 7.7-acre masterplan, Brixton Tower offers premium lifestyle layouts crafted strictly for long-term dwellers.",
    "developer_description": "EXSIM Group is a leading premium Malaysian real estate developer celebrated for iconic lifestyle concepts such as The Rainz and Millerz Square.",
    "seo_title": "Exsim Causewayz Square Brixton Tower JB | Residential Freehold",
    "seo_description": "Explore Brixton Tower at Causewayz Square by EXSIM. Freehold 1 to 3-bedroom own-stay apartments with zero transient guest disruption.",
    "images": {
      "hero": "https://lh3.googleusercontent.com/d/1JiPtQRcjAo_dE2qCwWXIYxNcN4JZsWst",
      "facade": [
        "https://lh3.googleusercontent.com/d/1JiPtQRcjAo_dE2qCwWXIYxNcN4JZsWst"
      ],
      "layout": [
        "https://lh3.googleusercontent.com/d/1Dv_POkSqHgljTlaPcS5mtvg6qwJdRqno",
        "https://lh3.googleusercontent.com/d/1cfQ7Zgo7mW42vaQPw-NIoWgG-cab6vWm",
        "https://lh3.googleusercontent.com/d/1zosFRIXwi3cnDRczjdhZ8MYQu3eWEa0s",
        "https://lh3.googleusercontent.com/d/1_vZ4e947X3lCz6FE0P0sbfdZcwKOuaSs",
        "https://lh3.googleusercontent.com/d/1ah4kCEqzaNSb6DwAvp0gYxOZvOy2AKJ6"
      ],
      "facility": [
        "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80"
      ],
      "location": [
        "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80"
      ],
      "gallery": [
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80"
      ],
      "facilities_plans": []
    }
  },
  {
    "project_name": "Causewayz Square (Dover Tower - Tower D)",
    "developer": "EXSIM Group",
    "area": "JBCC CIQ (Lumba Kuda)",
    "state": "Johor",
    "address": "Lumba Kuda, Bukit Chagar, 80300 Johor Bahru, Johor",
    "coordinate": "1.462758, 103.768117",
    "project_type": "Serviced Apartment (Residential/Own-Stay)",
    "tenure": "Freehold",
    "land_title": "Commercial under HDA",
    "land_size": "7.7 acres",
    "completion_status": "Under Construction",
    "completion_year": "2029",
    "construction_period": "48 months",
    "total_units": "1,200",
    "total_floors": "60",
    "units_per_floor": "16",
    "lift_per_floor": "7",
    "built_up_min": "474",
    "built_up_max": "850",
    "bedrooms": "1-3",
    "bathrooms": "1-2",
    "layouts": "Dover Type C, Dover Type D1, Dover Type D2, Dover Type E, Dover Type F",
    "price_min": "RM727500",
    "price_max": "RM1,259,000",
    "price_psf": "RM1,398",
    "maintenance_fee": "RM0.36 psf (incl. sinking fund)",
    "car_park": "1 to 2",
    "facilities": [
      "Rooftop Observatory Deck",
      "Sky Fitness Pavilion",
      "Reading Chamber",
      "Salt Water Swimming Pool",
      "Speed Ramp Car Park Access"
    ],
    "nearby": [
      "Komtar JBCC",
      "JB City Square",
      "R&F Mall",
      "Jalan Wong Ah Fook"
    ],
    "transportation": [
      "600m Direct Sheltered Covered Link Bridge to CIQ & RTS Bukit Chagar"
    ],
    "education": [
      "SJK(C) Foon Yew 1",
      "Sri Utama School"
    ],
    "shopping": [
      "Komtar JBCC",
      "City Square",
      "Mid Valley Southkey",
      "KSL City Mall"
    ],
    "hospital": [
      "KPJ Puteri Specialist Hospital",
      "Columbia Asia Hospital"
    ],
    "key_features": [
      "Premium insulated glazing panels",
      "split block design",
      "complete zoning separation keeping short-term traffic entirely restricted"
    ],
    "description": "Dover Tower pairs EXSIM's distinctive high-spec green construction practices with supreme cross-border efficiency.",
    "developer_description": "EXSIM Group is a leading premium Malaysian real estate developer celebrated for iconic lifestyle concepts such as The Rainz and Millerz Square.",
    "seo_title": "Exsim Causewayz Square Dover Tower | Premium Cross-Border Living",
    "seo_description": "Discover Dover Tower inside Causewayz Square by EXSIM. Highly practical 1-3 bed residential formats featuring robust eco-infrastructure.",
    "images": {
      "hero": "https://lh3.googleusercontent.com/d/1XJjLSM_C7uj2o2eZPZfaqdvSaxpR-31d",
      "facade": [
        "https://lh3.googleusercontent.com/d/1XJjLSM_C7uj2o2eZPZfaqdvSaxpR-31d"
      ],
      "layout": [
        "https://lh3.googleusercontent.com/d/1YrirGroLVcrZuGl1pH18ZY8J4QFZWbNK",
        "https://lh3.googleusercontent.com/d/1jVl7MjVfT8bBYPTy24njUb-H27LsGDvs",
        "https://lh3.googleusercontent.com/d/1cFyfF4H2uaTqKTkFXrZjGdniRk2uu9zS",
        "https://lh3.googleusercontent.com/d/1eFwPOOwo4qy-xUmStYvsRRmjYCdWdvhn",
        "https://lh3.googleusercontent.com/d/1DpNubsM1JIKvUkkXeg0gs6F3cXAKFods"
      ],
      "facility": [
        "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80"
      ],
      "location": [
        "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80"
      ],
      "gallery": [
        "https://lh3.googleusercontent.com/d/1AtFyxyJPjZvBs8b2_1i2n1PBjtDTVGPO"
      ],
      "facilities_plans": []
    }
  },
  {
    "project_name": "Coronade Twins",
    "developer": "Coronade Properties Sdn Bhd",
    "area": "Ibrahim International Business District (IIBD)",
    "state": "Johor",
    "address": "Jalan Trus, Bandar Johor Bahru, 80000 Johor Bahru, Johor",
    "coordinate": "1.463912, 103.760087",
    "project_type": "Serviced Apartment",
    "tenure": "Freehold",
    "land_title": "Commercial under HDA",
    "land_size": "2.1 acres",
    "completion_status": "Under Construction",
    "completion_year": "2030",
    "construction_period": "48 months",
    "total_units": "539",
    "total_floors": "41",
    "units_per_floor": "20",
    "lift_per_floor": "4",
    "built_up_min": "280",
    "built_up_max": "1,230",
    "bedrooms": "1-3",
    "bathrooms": "1-2",
    "layouts": "Type A1 (280 sqft), Type B 1+1 Bed (511 sqft), Type C 2+1 Bed (705 sqft), Type D 3+1 Bed (1230 sqft)",
    "price_min": "RM476,000",
    "price_max": "RM1,808,000",
    "price_psf": "RM1,450",
    "maintenance_fee": "RM0.60",
    "car_park": "1",
    "facilities": [
      "Swimming Pool",
      "Gymnasium",
      "Concierge Lounge",
      "Sky Deck",
      "Yoga Deck",
      "Multi-tier Security"
    ],
    "nearby": [
      "Komtar JBCC",
      "City Square",
      "Persada Johor",
      "UTC Johor"
    ],
    "transportation": [
      "RTS Link Bukit Chagar",
      "Linked Sky Bridge to CIQ",
      "Jalan Wong Ah Fook"
    ],
    "education": [
      "Foon Yew High School",
      "St. Joseph School"
    ],
    "shopping": [
      "City Square",
      "Komtar JBCC",
      "Zenith Mall"
    ],
    "hospital": [
      "KPJ Johor Specialist Hospital",
      "Sultanah Aminah Hospital"
    ],
    "key_features": [
      "Direct linked pedestrian access bridge to CIQ & RTS",
      "part of Coronation Square financial hub"
    ],
    "description": "Coronade Twins features signature landmark high-rise towers designed to seamlessly integrate medical, banking, and luxury retail.",
    "developer_description": "Prominent real estate development firm spearheading landmark mega financial masterplans within Southern Malaysia.",
    "seo_title": "Coronade Twins Coronation Square Johor Bahru | RTS Linked",
    "seo_description": "Get complete verified details on Coronade Twins at Coronation Square JB. Freehold premium serviced suites linked directly to the RTS terminal corridor.",
    "images": {
      "hero": "https://lh3.googleusercontent.com/d/1GFizRbf_vkA0m8GMRQr4plq1scxyfJhJ",
      "facade": [
        "https://lh3.googleusercontent.com/d/1GFizRbf_vkA0m8GMRQr4plq1scxyfJhJ"
      ],
      "layout": [
        "https://lh3.googleusercontent.com/d/18ZgFEo3AO_OwgpFlavQLfX09AcxF5Q4Y",
        "https://lh3.googleusercontent.com/d/1y9im1I91oYh93ApoaAXKnJX2nfn8URO_",
        "https://lh3.googleusercontent.com/d/1tfL_9BoG76VK8BtqG7Yo7wOAf1uIWA7K",
        "https://lh3.googleusercontent.com/d/1hiZ6ERP1pfbR2pBpmNLigra9dzlCEK_Y"
      ],
      "facility": [
        "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80"
      ],
      "location": [
        "https://lh3.googleusercontent.com/d/1_9Vq_4TnkYf03QkSgnnjo1jc6rzs9wh-"
      ],
      "gallery": [
        "https://lh3.googleusercontent.com/d/1DarFjouwsouA6lfr2l4u_ihWgk64dumb",
        "https://lh3.googleusercontent.com/d/165c_zMwO_VT1lZxgOWG7ew8zNM9ml61U",
        "https://lh3.googleusercontent.com/d/1vOWkEkHOesA_GGv3fOF3HElat4M_dPLj",
        "https://lh3.googleusercontent.com/d/1FSmhlh1S-2mHKWrNwSOkh0ErANfxVpHz",
        "https://lh3.googleusercontent.com/d/18C2TXJLGSrWkiSqmnwDsys8eUfEgtwut",
        "https://lh3.googleusercontent.com/d/1RSr-Wb8kvzZ8jYT58dltgNwGqSTEZJY3",
        "https://lh3.googleusercontent.com/d/1hxisY9EOJqOk82DSzAWjUmEmQFFnlzrw"
      ],
      "facilities_plans": []
    }
  },
  {
    "project_name": "Gen Sphere",
    "developer": "Majestic Gen Sdn Bhd",
    "area": "Taman Sri Tebrau / Serampang",
    "state": "Johor",
    "address": "23 & 25, Jalan Serampang, Taman Sri Tebrau, 80050 Johor Bahru, Johor",
    "coordinate": "1.461163, 103.767715",
    "project_type": "Serviced Apartment",
    "tenure": "Freehold",
    "land_title": "Commercial under HDA",
    "land_size": "1.42 acres",
    "completion_status": "Under Construction",
    "completion_year": "2029",
    "construction_period": "54 months",
    "total_units": "996",
    "total_floors": "50",
    "units_per_floor": "28",
    "lift_per_floor": "8",
    "built_up_min": "459",
    "built_up_max": "755",
    "bedrooms": "Studio-3",
    "bathrooms": "1-2",
    "layouts": "Type A (495 sqft) 1 Bed 2 Bath, Type B (551 sqft) 1 Bed 2 Bath, Type C (652 sqft) 3 Bed 2 Bath, Type D (755 sqft) 3 Bed 2 Bath, Type E (700 sqft) 1 Bed 2 Bath",
    "price_min": "RM550,000",
    "price_max": "RM1,000,000",
    "price_psf": "RM1,250-RM1,392",
    "maintenance_fee": "RM0.35",
    "car_park": "1",
    "facilities": [
      "3 Tiers Security",
      "Smart Access Systems",
      "Communal Lounge",
      "Gym",
      "Pool Deck",
      "Wellness Gardens"
    ],
    "nearby": [
      "Plaza Pelangi",
      "Mid Valley Southkey",
      "KSL City Mall"
    ],
    "transportation": [
      "KSL Bus stops",
      "Tebrau Highway access",
      "EDL Express Link"
    ],
    "education": [
      "Foon Yew High School",
      "Sri Utama Schools"
    ],
    "shopping": [
      "Mid Valley Southkey",
      "KSL City Mall",
      "Plaza Pelangi"
    ],
    "hospital": [
      "Columbia Asia Hospital Tebrau",
      "KPJ Johor Specialist"
    ],
    "key_features": [
      "Dual-key flexible configurations across all primary typical layouts",
      "partially furnished premium fittings"
    ],
    "description": "Gen Sphere by Majestic Gen introduces compact highly versatile dual-key units within the high-demand residential commercial hub.",
    "developer_description": "Majestic Gen is an emerging boutique developer focused on hyper-connected high-efficiency urban architectural designs.",
    "seo_title": "Gen Sphere Johor Bahru by Majestic Gen",
    "seo_description": "Explore Gen Sphere at Jalan Serampang JB. Freehold versatile dual-key apartments starting from RM550k.",
    "images": {
      "hero": "https://lh3.googleusercontent.com/d/1IKd_70pU4RmUgRY-IOxsKKP3ss8iqUdQ",
      "facade": [
        "https://lh3.googleusercontent.com/d/1IKd_70pU4RmUgRY-IOxsKKP3ss8iqUdQ"
      ],
      "layout": [
        "https://lh3.googleusercontent.com/d/1GBjoHcBIjdGjIt83BI4h9M8JhB21c9Hv",
        "https://lh3.googleusercontent.com/d/1rs2YKcKk7NGJsHo9hfhVa5AeMzo13rFL",
        "https://lh3.googleusercontent.com/d/1OJ0E6-fUafLNqgk9CDcwqFhEbmv5F8dI",
        "https://lh3.googleusercontent.com/d/1x9Xhz72ExeezMjphI-sX47msPYv3W5am",
        "https://lh3.googleusercontent.com/d/1-KcEeO2kvSwq2c1d3Y-OWpEw7ubQyLpL"
      ],
      "facility": [
        "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80"
      ],
      "location": [
        "https://lh3.googleusercontent.com/d/1j7iBQzMRwodw2DWHfZLq2Ru1N9xImu3X"
      ],
      "gallery": [
        "https://lh3.googleusercontent.com/d/1MUmp-6JARGUUbUPs5Fp-mD3_toDAmEv_",
        "https://lh3.googleusercontent.com/d/1hI_iq7AjvdWAQ0HREreOKm4ZMe6pVDDZ",
        "https://lh3.googleusercontent.com/d/11NJHvs-M7clvPap24TQy1dUQqQbzpVEl"
      ],
      "facilities_plans": []
    }
  },
  {
    "project_name": "M Grand Minori",
    "developer": "Mah Sing Group Bhd",
    "area": "Taman Pelangi",
    "state": "Johor",
    "address": "Jalan Austin Perdana, Taman Austin Perdana, 81100 Johor Bahru, Johor",
    "coordinate": "1.478763, 103.773228",
    "project_type": "Serviced Apartment",
    "tenure": "Freehold",
    "land_title": "Commercial under HDA",
    "land_size": "3.8 acres",
    "completion_status": "Under Construction",
    "completion_year": "2030",
    "construction_period": "54 months",
    "total_units": "1,733",
    "total_floors": "59",
    "units_per_floor": "32",
    "lift_per_floor": "8",
    "built_up_min": "403",
    "built_up_max": "835",
    "bedrooms": "Studio-3 (dual key)",
    "bathrooms": "1-2",
    "layouts": "Type A, Type B, Type C, Type D, Type D1, Type E",
    "price_min": "RM300,000",
    "price_max": "RM800,000",
    "price_psf": "RM750-RM870",
    "maintenance_fee": "RM0.40 exclude sinking fund",
    "car_park": "1-2",
    "facilities": [
      "Japanese-themed Gardens",
      "Infinity Pool",
      "Gym",
      "Zen Lounge",
      "Hot Spring Spa Simulation"
    ],
    "nearby": [
      "Austin Heights Water Park",
      "IKEA Tebrau",
      "Toppen Shopping Centre"
    ],
    "transportation": [
      "Pasir Gudang Highway",
      "North-South Expressway",
      "Dedicated Shuttle Bus to CIQ"
    ],
    "education": [
      "Austin Heights International School",
      "Sunway College JB"
    ],
    "shopping": [
      "AEON Tebrau City",
      "IKEA Tebrau",
      "Toppen Shopping Centre"
    ],
    "hospital": [
      "Sultan Ismail Hospital"
    ],
    "key_features": [
      "Immersive Japanese minimalist inspired living environments",
      "1.9-acre Sky Lifestyle Deck"
    ],
    "description": "M Grand Minori brings transit-friendly, lifestyle-centric affordable luxury units with peaceful Japanese landscaping.",
    "developer_description": "Mah Sing Group is one of Malaysia's top premier multi-award winning developers specializing in high-demand prime housing.",
    "seo_title": "M Grand Minori Austin Perdana Mah Sing",
    "seo_description": "Discover M Grand Minori in Mount Austin JB. Freehold Japanese concept apartments with luxury community features.",
    "images": {
      "hero": "https://lh3.googleusercontent.com/d/1ZnsexyKQpEmg0x45RsMuBJYfIiz340ON",
      "facade": [
        "https://lh3.googleusercontent.com/d/1ZnsexyKQpEmg0x45RsMuBJYfIiz340ON"
      ],
      "layout": [
        "https://lh3.googleusercontent.com/d/1yr5vhlvrJo23fkhucEwipEVMB5GinXxO",
        "https://lh3.googleusercontent.com/d/1hFQ5l7nSOIHR1TyOzAMn7uME3aLBTENM",
        "https://lh3.googleusercontent.com/d/1g47_DEIuJhj-_C4304Wxpkpl-wWoAwQO",
        "https://lh3.googleusercontent.com/d/1wSqI_mHPUt8KRTHt0uZD-jG9iAyNDEUN",
        "https://lh3.googleusercontent.com/d/1fDeM_bNVgE-3RRNB21LCtVy5tV_ZgCMX",
        "https://lh3.googleusercontent.com/d/1SKPNHYaOxwPN6qoaf-QLY32cZXCiFVvF"
      ],
      "facility": [
        "https://lh3.googleusercontent.com/d/1WZ4uIz4xJEkh6PNS-8Z64bgyS-9br_63",
        "https://lh3.googleusercontent.com/d/1YTqy6-zJm0EgCGoSfeXuHFifndedlsSm",
        "https://lh3.googleusercontent.com/d/1bq8Qlfp14GM-RgAVrMXvGinYQA5jbhOZ"
      ],
      "location": [
        "https://lh3.googleusercontent.com/d/1Jc0MjcvOPTThaQqgPndGKwx_c6BCxb45"
      ],
      "gallery": [
        "https://lh3.googleusercontent.com/d/1bwvRffSaVFia0OxteEtWY6qkTVo7alpq",
        "https://lh3.googleusercontent.com/d/1DOBwhvbWCPM83iHhdK7XFFmOldSGXXBn",
        "https://lh3.googleusercontent.com/d/1PM15_CgrK3bC9Un37vx9GUnv4VarYwFI",
        "https://lh3.googleusercontent.com/d/1wJ4M_Uhoj2gZClVdsi2dg0MfJkshpddX",
        "https://lh3.googleusercontent.com/d/10IFmMt2QDyz-x59oK7ET5_5b4eCzUvGG"
      ],
      "facilities_plans": [
        "https://lh3.googleusercontent.com/d/1yENhncoHGZDKPjBJfUGroGPJiLOKcZZT",
        "https://lh3.googleusercontent.com/d/1bwO3z4fQK2ogcPN8fyDJzbOqGS3OScqM"
      ]
    }
  },
  {
    "project_name": "Princess Cove RNF Phase 2",
    "developer": "R&F Development Sdn Bhd",
    "area": "Tanjung Puteri Waterfront",
    "state": "Johor",
    "address": "Jalan Tanjung Puteri 1, R&F Tanjung Puteri, 80300 Johor Bahru, Johor",
    "coordinate": "1.458005, 103.771117",
    "project_type": "Serviced Apartment",
    "tenure": "Freehold",
    "land_title": "Commercial under HDA",
    "land_size": "116 acres",
    "completion_status": "Completed",
    "completion_year": "2023",
    "construction_period": "48 months",
    "total_units": "3,724",
    "total_floors": "50",
    "units_per_floor": "6",
    "lift_per_floor": "4",
    "built_up_min": "471",
    "built_up_max": "1,471",
    "bedrooms": "Studio-4",
    "bathrooms": "1-3",
    "layouts": "Type A 3 Rooms (1180 sqft), Type D (471 sqft) Studio, Type E Dual-Key (2+1) (1317 sqft), Type G (933 sqft), Type H1 (1471 sqft) 4 Rooms, Type M1 (sub2) 3 Rooms (1105 sqft), Type M1 (1135 sqft) 3 Rooms, Type N 2 Rooms (834 sqft), Type U1 2 Rooms (838 sqft), Type V5 2 Bed (828 sqft), Type V6 1 Room (544 sqft), Type V7 (798 sqft) 2 Rooms, Type V7m (767 sqft) 2 Rooms",
    "price_min": "RM690,000",
    "price_max": "RM3,400,000",
    "price_psf": "RM1,400-RM2,300",
    "maintenance_fee": "RM0.42",
    "car_park": "1",
    "facilities": [
      "Level 8 Marina Clubhouse",
      "Swimming pool",
      "Kids playground",
      "Comprehensive Gym",
      "Opera House"
    ],
    "nearby": [
      "R&F Mall",
      "Johor Bahru City Square",
      "Komtar JBCC"
    ],
    "transportation": [
      "650m Direct Link Bridge to JB Sentral CIQ & Bukit Chagar RTS Station"
    ],
    "education": [
      "Foon Yew High School",
      "Repton International School"
    ],
    "shopping": [
      "R&F Mall (Integrated)",
      "City Square",
      "Komtar JBCC"
    ],
    "hospital": [
      "Hospital Sultanah Aminah",
      "Columbia Asia Hospital"
    ],
    "key_features": [
      "Phase 2 Seine Region",
      "directly features signature waterfront lifestyle promenade"
    ],
    "description": "R&F Princess Cove Phase 2 represents a highly sought-after tier of the HOPSCA marina master development.",
    "developer_description": "R&F Properties is a global top-tier multi-disciplinary developer with dominant presence in mega waterfront lifestyle townships.",
    "seo_title": "R&F Princess Cove Phase 2 Seine Region",
    "seo_description": "View available units in completed R&F Princess Cove Phase 2 Seine Region. Freehold premium sea view units.",
    "images": {
      "hero": "https://lh3.googleusercontent.com/d/1jZxjEJT5dO2l1iWeVVkNN8x_ysYOBB3D",
      "facade": [
        "https://lh3.googleusercontent.com/d/1jZxjEJT5dO2l1iWeVVkNN8x_ysYOBB3D"
      ],
      "layout": [
        "https://lh3.googleusercontent.com/d/1tInFGIpDAkMvGWrG4kqz7K_-ZaHADdi3",
        "https://lh3.googleusercontent.com/d/1w_qIALtmqPTnT16sZjtyGLKgkF6raxdf",
        "https://lh3.googleusercontent.com/d/1PaOcxunYGGiEQQrv6yLOdhF02_iWiz6B",
        "https://lh3.googleusercontent.com/d/1eYTOAStCGjb0mXD247gvFVSADPRvpOKN",
        "https://lh3.googleusercontent.com/d/1f9AeGgLdbYRcB2ldacD__EkL8BcUbaJI",
        "https://lh3.googleusercontent.com/d/11ZrEPpgkudpd2-TOiEsXoH-1Nx3VcKg5",
        "https://lh3.googleusercontent.com/d/1Ov0i3B4IJVa_S0ryTG-imcrgFHkMyfNp",
        "https://lh3.googleusercontent.com/d/10UffmJdmpM6KNi3ce0_HVudR9Zt85M9Z",
        "https://lh3.googleusercontent.com/d/1e6dHDFHIcKUqpCX5ZLCKndvOsmeOxg6l",
        "https://lh3.googleusercontent.com/d/1Fk5ChTgJ6O0Tg95wUAF0XAllMd1yNnV_",
        "https://lh3.googleusercontent.com/d/178icqHZHEoEwI5A7-6pCwuXlbIaCSNP-",
        "https://lh3.googleusercontent.com/d/1mNs1Bnfr2PzBduwEFsfudfAEf2iwdrXW",
        "https://lh3.googleusercontent.com/d/1zwoUWCm2rkzalJW5GAwOE_uTYZfBT-zI"
      ],
      "facility": [
        "https://lh3.googleusercontent.com/d/1EtZixYbvT-34KYucTMDakQeiqh5JdEDo",
        "https://lh3.googleusercontent.com/d/1DQ2vijh9lJxxHtQ1-SiqZy7hwo1j_vZf",
        "https://lh3.googleusercontent.com/d/1HFXQ1Q4nI4xnQ-LCXDwN49rtWobn9Fr0",
        "https://lh3.googleusercontent.com/d/13gM7cGXP_U9wAc7qfrYgC1-OkoVQnKgB",
        "https://lh3.googleusercontent.com/d/1I3XUXBSB4JEVi9HqBNenasD3dWZYBreF",
        "https://lh3.googleusercontent.com/d/1vpdfv9w43B27gefn7zeiiSMq4La_AItS"
      ],
      "location": [
        "https://lh3.googleusercontent.com/d/1DM0rt04AJ5QYmkQEJg04P_5QDEd8CaLu"
      ],
      "gallery": [
        "https://lh3.googleusercontent.com/d/1F2fBfoaKc68Szx4tYLnf6LiXO_yJl-pK",
        "https://lh3.googleusercontent.com/d/1xQ5Afu4voBu6NMcFjzFfwhzsvJj87ZwL",
        "https://lh3.googleusercontent.com/d/1Dn292u0cFowdA_esZcQ78-wL-TMTytWP",
        "https://lh3.googleusercontent.com/d/1PceoajfSn4UEtvMFGyZPFDVvyI0jU6-a",
        "https://lh3.googleusercontent.com/d/1Oqpy7wL61a1Hb50X-XTmmUfdWj5BQsGU",
        "https://lh3.googleusercontent.com/d/1pIRdRpmIpW3OqN3IyTYeBXqiZWusH-6z"
      ],
      "facilities_plans": [
        "https://lh3.googleusercontent.com/d/1B3Rp-z3i-aC_Sq10tYLHBqCfntWVxGhZ"
      ]
    }
  },
  {
    "project_name": "Princess Cove RNF Phase 3",
    "developer": "R&F Development Sdn Bhd",
    "area": "Tanjung Puteri Waterfront",
    "state": "Johor",
    "address": "Jalan Tanjung Puteri 1, R&F Tanjung Puteri, 80300 Johor Bahru, Johor",
    "coordinate": "1.461113, 103.770557",
    "project_type": "Serviced Apartment",
    "tenure": "Freehold",
    "land_title": "Commercial under HDA",
    "land_size": "116 acres",
    "completion_status": "Under Construction",
    "completion_year": "2027",
    "construction_period": "48 months",
    "total_units": "4,385",
    "total_floors": "56",
    "units_per_floor": "8",
    "lift_per_floor": "4",
    "built_up_min": "314",
    "built_up_max": "1,556",
    "bedrooms": "Studio-5",
    "bathrooms": "1-6",
    "layouts": "R\\u0026f Type A, R\\u0026f Type B1(m), R\\u0026f Type B1a(m), R\\u0026f Type B1b, R\\u0026f Type B2(m), R\\u0026f Type B3(m), R\\u0026f Type B3a(m), R\\u0026f Type B3b(m), R\\u0026f Type B3c, R\\u0026f Type C(m), R\\u0026f Type C1(m), R\\u0026f Type C3(m), R\\u0026f Type C3a(m), R\\u0026f Type C3b, R\\u0026f Type C4, R\\u0026f Type C4a, R\\u0026f Type C4b, R\\u0026f Type C4c, R\\u0026f Type C5, R\\u0026f Type D1(m), R\\u0026f Type D2(m), R\\u0026f Type D3(m), R\\u0026f Type D3a, R\\u0026f Type E(m)",
    "price_min": "RM720,000",
    "price_max": "RM3,100,000",
    "price_psf": "RM1,600",
    "maintenance_fee": "RM0.42",
    "car_park": "1",
    "facilities": [
      "Sky Deck Pool",
      "Central Landscaped Podium",
      "Modern Interactive Gym",
      "Panoramic Observation Lounges"
    ],
    "nearby": [
      "R&F Mall",
      "Permaisuri Zarith Sofiah Opera House",
      "Marina Promenade"
    ],
    "transportation": [
      "Link bridge walkway connection to RTS and Customs Checkpoint"
    ],
    "education": [
      "Foon Yew High School",
      "Stellar Playschool"
    ],
    "shopping": [
      "R&F Mall retail corridors",
      "City Square"
    ],
    "hospital": [
      "Hospital Sultanah Aminah"
    ],
    "key_features": [
      "Latest high-rise addition to the premium international marina masterplan framework"
    ],
    "description": "The upcoming next-tier phase of R&F Princess Cove extending the landmark waterfront HOPSCA footprint.",
    "developer_description": "R&F Properties is a global top-tier multi-disciplinary developer with dominant presence in mega waterfront lifestyle townships.",
    "seo_title": "R&F Princess Cove Phase 3 New Launch",
    "seo_description": "Get early bird registration data and updates for R&F Princess Cove Phase 3.",
    "images": {
      "hero": "https://lh3.googleusercontent.com/d/15ZHwJA3I2W-xZyek1wxWYazE226ox9mK",
      "facade": [
        "https://lh3.googleusercontent.com/d/1LGQNJd0leDzUWEkZ8WJ1TjrWwnbu2QlV"
      ],
      "layout": [
        "https://lh3.googleusercontent.com/d/1emvXigql078jHii1X-WpONk0ON_1ylm4",
        "https://lh3.googleusercontent.com/d/13ks26wJJ0fkQ7uIveW16xKFFrwBlWqO8",
        "https://lh3.googleusercontent.com/d/1iGwCD-r28w-lGrFTu2MDGreAh7P_y6kN",
        "https://lh3.googleusercontent.com/d/1WqBrnA3F9plYRKxgSNhiOMyAxqNTGkP-",
        "https://lh3.googleusercontent.com/d/1aaUceVc1-kXO9vgjFG2Lhuodap5nOoDz",
        "https://lh3.googleusercontent.com/d/156xmA-X_fyFHGfpWaN5311SC4G2qfrFR",
        "https://lh3.googleusercontent.com/d/1PcENX_L-872rfoCpkDm0ZVNMqt1pxdvS",
        "https://lh3.googleusercontent.com/d/1moK1wP18G_hg0JWFcQFkOkQ0T9d3lWug",
        "https://lh3.googleusercontent.com/d/1MVqOqR1z-S9oNuTWOS0ca2cpoyZsy-JH",
        "https://lh3.googleusercontent.com/d/1pHMCQREJnEm12VM_FZBZ-ggeKn9eZdlE",
        "https://lh3.googleusercontent.com/d/1P9bYiJowJ7yA5A00lzSE-i4sTdoIk0al",
        "https://lh3.googleusercontent.com/d/1jtKMyYr4RCZ2BqaDVQRE902d1o8kRzUa",
        "https://lh3.googleusercontent.com/d/1hgspzZC1ibOHeszjJhKrn8aDuMMAnm-H",
        "https://lh3.googleusercontent.com/d/1VgNyUtEDwryVLGjWl1hGqqxgJMKcywIX",
        "https://lh3.googleusercontent.com/d/1Wx45C5gzJLj_0KgebDX1Zd5CRROk4IQu",
        "https://lh3.googleusercontent.com/d/1pig_azJwTxOILOTC3KObGrcDW5KKIpUZ",
        "https://lh3.googleusercontent.com/d/1SSadZocrQjwOs9We7aien4wux1L3a7On",
        "https://lh3.googleusercontent.com/d/1bPF54f2M9NLRK73YObODh1sroOGgys3K",
        "https://lh3.googleusercontent.com/d/1sfon8PWE35CIg-D_YntH1U5tTAm4-JBS",
        "https://lh3.googleusercontent.com/d/1N1tcLdOJrIPLAyF218uZm6Ywr0MuFtxj",
        "https://lh3.googleusercontent.com/d/1TlQbPi6RGt3fNd0y9waNK6GUYAaRurd4",
        "https://lh3.googleusercontent.com/d/18OQvXFCF19k7yOePmPlVETCdQZOW_DnA",
        "https://lh3.googleusercontent.com/d/1ZNEGDfh1mal2m_ZvqV9eophEWTiTNOmo",
        "https://lh3.googleusercontent.com/d/1KiHp6tKgQS6Z_bub0EE8HwlK-RZOMnb5"
      ],
      "facility": [
        "https://lh3.googleusercontent.com/d/1oxoeKHcYKv_zylr6663BcGKrrq-kFLJF",
        "https://lh3.googleusercontent.com/d/1deM0QwAWaWBK_vRwcPKHCqOhNYkKo-f1"
      ],
      "location": [
        "https://lh3.googleusercontent.com/d/1SD1wiXzHmXr2McXJKkzV9tzj-EkjS1rj"
      ],
      "gallery": [
        "https://lh3.googleusercontent.com/d/1SmCIdmvOEyWAbis0rmW3Y8sr6FO3iyxC",
        "https://lh3.googleusercontent.com/d/15ZHwJA3I2W-xZyek1wxWYazE226ox9mK",
        "https://lh3.googleusercontent.com/d/1Hoo2nbPtGiLPtnSDxZsOe-4HDTl7upnb",
        "https://lh3.googleusercontent.com/d/1s4geKND8rkVK0mgcEGolwvHvRPNnKBeJ",
        "https://lh3.googleusercontent.com/d/1PbT2YkFcB6A2G1vKzSIUaIi_UArdAdNq",
        "https://lh3.googleusercontent.com/d/1BrzEBH3P01mewRsGg2T6CZSzxuNkwRTM",
        "https://lh3.googleusercontent.com/d/1jDJSyywuy-CaLgta1GyOYyVrxr63sAmq"
      ],
      "facilities_plans": []
    }
  }
];
