export interface Actor {
  id: string;
  name: string;
  age: number;
  birthPlace: string;
  image: string;
  images?: string[];
  filmography: string[];
  music: string[];
  books: string[];
  awards: string[];
  trivia: string[];
  funFacts: string[];
  relationships: string[];
  netWorth: string;
  hobbies: string[];
  socialMedia: string[];
  upcomingProjects: string[];
  controversies: string[];
  quotes: string[];
  wikiData?: any;
}

export const actors: Actor[] = [
  // Rachel Zegler - detailed Wikipedia data as requested
  {
    id: "rachel-zegler",
    name: "Rachel Zegler",
    age: 23,
    birthPlace: "Hackensack, New Jersey",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Rachel_Zegler_by_Gage_Skidmore.jpg/800px-Rachel_Zegler_by_Gage_Skidmore.jpg",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Rachel_Zegler_by_Gage_Skidmore.jpg/800px-Rachel_Zegler_by_Gage_Skidmore.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Rachel_Zegler_2022.jpg/600px-Rachel_Zegler_2022.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Rachel_Zegler_West_Side_Story_premiere.jpg/600px-Rachel_Zegler_West_Side_Story_premiere.jpg"
    ],
    filmography: [
      "West Side Story (2021)",
      "Shazam! Fury of the Gods (2023)", 
      "The Hunger Games: The Ballad of Songbirds & Snakes (2023)",
      "Snow White (2025)"
    ],
    music: [
      "West Side Story Soundtrack",
      "Hunger Games: Ballada Soundtrack", 
      "Covers na YouTube",
      "Disney Snow White Songs"
    ],
    books: [],
    awards: [
      "Złoty Glob 2022 - Najlepsza Aktorka w Musicalu",
      "Satellite Award - Najlepsza Aktorka",
      "Critics Choice Award - Nominacja",
      "BAFTA - Nominacja"
    ],
    trivia: [
      "Nazwana na cześć Rachel Green z serialu 'Przyjaciele'",
      "Matka Kolumbijka z Barranquilla, ojciec polskiego pochodzenia", 
      "Odkryta przez Stevena Spielberga na castingu online",
      "Pierwsza Latynaska w roli María w filmie 'West Side Story'"
    ],
    funFacts: [
      "📺 Pełne imię: Rachel Anne Zegler - nazwana na cześć Rachel Green!",
      "🇨🇴 Pochodzenie: Matka Kolumbijka, ojciec Polak - międzynarodowa gwiazda!",
      "🎬 Debiut u Spielberga: Zagrała Maríę w 'West Side Story' (2021)",
      "🏆 Złoty Glob w wieku 20 lat za rolę w musicalu!",
      "🎤 Inspiruje się Babrą Streisand - wielką legendą!",
      "💕 Z Joshem Andrés Riverą od 2019 - poznali się na planie!",
      "👑 Śnieżka 2025: Nowa interpretacja klasycznej baśni Disney!",
      "🌍 Aktywistka: Wspiera Palestynę, podpisała list do Bidena",
      "🎭 Od covers na YouTube do Hollywood w kilka lat!"
    ],
    relationships: [
      "Josh Andrés Rivera (od stycznia 2019)",
      "Poznali się na planie 'West Side Story'",
      "Para wspiera się nawzajem w karierze"
    ],
    netWorth: "$2M-5M",
    hobbies: [
      "Śpiew i muzyka",
      "Aktywizm społeczny", 
      "Media społecznościowe",
      "Taniec"
    ],
    socialMedia: [
      "@rachelzegler - 2M+ obserwujących",
      "TikTok viral videos", 
      "Instagram verified",
      "YouTube covers"
    ],
    upcomingProjects: [
      "Snow White (2025) - Tytułowa rola",
      "Nowe projekty muzyczne",
      "Potencjalne sequele",
      "Współprace z Disney"
    ],
    controversies: [
      "Kontrowersje wokół 'Snow White' - nowa interpretacja",
      "Aktywizm palestyński - Artists4Ceasefire", 
      "Debaty o obsadzie Disney",
      "Komentarze polityczne w social media"
    ],
    quotes: [
      "Marzenia się spełniają, jeśli się nie poddaje",
      "Reprezentuję młode Latynoski w Hollywood",
      "Sztuka może zmieniać świat i serca ludzi",
      "Barbra Streisand to moja największa inspiracja"
    ],
    wikiData: {
      title: "Rachel Zegler",
      extract: "Rachel Anne Zegler (ur. 3 maja 2001) to amerykańska aktorka i piosenkarka. Zdobyła rozgłos dzięki roli Maríi w filmie muzycznym Stevena Spielberga 'West Side Story' (2021), za którą otrzymała Złoty Glob dla najlepszej aktorki w filmie komediowym lub musicalu."
    }
  },
  {
    id: "timothee-chalamet",
    name: "Timothée Chalamet",
    age: 28,
    birthPlace: "New York City, USA",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&face=center",
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&face=center",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop&face=center"
    ],
    filmography: [
      "Call Me by Your Name (2017)",
      "Lady Bird (2017)", 
      "Dune (2021)",
      "Wonka (2023)",
      "Dune: Part Two (2024)"
    ],
    music: ["Wonka Soundtrack"],
    books: [],
    awards: [
      "Oscar Nomination - Best Actor",
      "Golden Globe Nomination",
      "BAFTA Nomination", 
      "Critics Choice Award"
    ],
    trivia: [
      "Najmłodszy aktor nominowany do Oscara w kategorii Najlepszy Aktor od 1939 roku",
      "Ma francusko-amerykańskie obywatelstwo",
      "Studiował w LaGuardia High School"
    ],
    funFacts: [
      "🎭 Najmłodszy nominowany do Oscara od 80 lat!",
      "🇫🇷 Dwujęzyczny - mówi płynnie po francusku",
      "🎬 Przełom w 'Call Me by Your Name'",
      "👑 Król Diuny - Paul Atreides", 
      "🍫 Willy Wonka w najnowszym filmie"
    ],
    relationships: ["Prywatne życie"],
    netWorth: "$25M+",
    hobbies: ["Kino niezależne", "Moda", "Muzyka"],
    socialMedia: ["Instagram verified", "Rzadkie posty"],
    upcomingProjects: ["Dune 3", "Nowe projekty indie"],
    controversies: ["Brak większych skandali"],
    quotes: ["Aktorstwo to forma sztuki", "Cenię sobie prywatność"]
  },
  {
    id: "zendaya",
    name: "Zendaya",
    age: 27,
    birthPlace: "Oakland, California",
    image: "https://images.unsplash.com/photo-1494790108755-2616c96f29f5?w=400&h=600&fit=crop&face=center",
    images: [
      "https://images.unsplash.com/photo-1494790108755-2616c96f29f5?w=400&h=600&fit=crop&face=center",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop&face=center"
    ],
    filmography: [
      "Spider-Man: Homecoming (2017)",
      "The Greatest Showman (2017)",
      "Euphoria (2019-2022)",
      "Dune (2021)",
      "Spider-Man: No Way Home (2021)",
      "Challengers (2024)"
    ],
    music: [
      "Replay (2013)",
      "Rewrite the Stars - The Greatest Showman"
    ],
    books: [],
    awards: [
      "Emmy Award - Outstanding Lead Actress",
      "Critics Choice Award",
      "Teen Choice Awards",
      "NAACP Image Awards"
    ],
    trivia: [
      "Rozpoczęła karierę w Disney Channel",
      "Pierwsza czarnoskóra kobieta, która wygrała Emmy za główną rolę dramatyczną od 24 lat",
      "Była tancerką od małego"
    ],
    funFacts: [
      "🕷️ MJ w filmach Spider-Man!",
      "🏆 Emmy za 'Euphoria' - historyczne zwycięstwo",
      "🎪 Gwiazda 'The Greatest Showman'", 
      "👑 Chani w 'Diunie'",
      "🎭 Od Disney Channel do Hollywood A-list"
    ],
    relationships: ["Tom Holland (potwierdzone 2021)"],
    netWorth: "$20M+",
    hobbies: ["Taniec", "Moda", "Aktywizm"],
    socialMedia: ["@zendaya - 180M+ obserwujących", "Fashion icon"],
    upcomingProjects: ["Euphoria S3", "Dune 3", "Challengers promo"],
    controversies: ["Brak większych skandali"],
    quotes: ["Reprezentacja ma znaczenie", "Kocham swoich fanów"]
  },
  {
    id: "anya-taylor-joy",
    name: "Anya Taylor-Joy",
    age: 28,
    birthPlace: "Miami, Florida / Buenos Aires",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop&face=center",
    images: [
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop&face=center"
    ],
    filmography: [
      "The Witch (2015)",
      "Split (2016)",
      "The Queen's Gambit (2020)",
      "The Menu (2022)",
      "Amsterdam (2022)",
      "Furiosa (2024)"
    ],
    music: [],
    books: [],
    awards: [
      "Golden Globe - Best Actress (The Queen's Gambit)",
      "Screen Actors Guild Award",
      "Critics Choice Award",
      "Emmy Nomination"
    ],
    trivia: [
      "Urodzona w Miami, wychowana w Buenos Aires i Londynie",
      "Mówi po hiszpańsku, angielsku i trochę po francusku",
      "Odkryta w Harrods w wieku 16 lat"
    ],
    funFacts: [
      "♟️ Królowa szachów w 'The Queen's Gambit'!",
      "🌍 Międzynarodowa: USA, Argentyna, Wielka Brytania",
      "🎭 Odkryta przypadkowo w sklepie!",
      "👑 Złoty Glob za debiut w głównej roli TV",
      "🎬 Od horroru do dramatów psychologicznych"
    ],
    relationships: ["Malcolm McRae (mąż od 2022)"],
    netWorth: "$7M+",
    hobbies: ["Szachy", "Podróże", "Języki obce"],
    socialMedia: ["Instagram 8M+", "Rzadkie posty"],
    upcomingProjects: ["Furiosa sequel", "Nowe projekty Netflix"],
    controversies: ["Brak większych skandali"],
    quotes: ["Szachy nauczyły mnie strategii", "Kocham różnorodne role"]
  },
  {
    id: "tom-holland",
    name: "Tom Holland",
    age: 28,
    birthPlace: "Kingston upon Thames, England",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&face=center",
    images: [
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&face=center"
    ],
    filmography: [
      "The Impossible (2012)",
      "Spider-Man: Homecoming (2017)",
      "Avengers: Infinity War (2018)",
      "Spider-Man: Far From Home (2019)",
      "Spider-Man: No Way Home (2021)",
      "Uncharted (2022)"
    ],
    music: ["Umbrella - Lip Sync Battle"],
    books: [],
    awards: [
      "Teen Choice Awards",
      "Saturn Award",
      "Hollywood Walk of Fame",
      "BAFTA Rising Star Nomination"
    ],
    trivia: [
      "Rozpoczął karierę jako tancerz",
      "Znany z przypadkowego spoilerowania filmów Marvela",
      "Ma trzech młodszych braci"
    ],
    funFacts: [
      "🕷️ Najmłodszy Spider-Man w historii kina!",
      "💃 Tancerz baletowy zanim został aktorem",
      "🤐 Król spoilerów Marvel - nie można mu ufać!",
      "🎭 Odkryty podczas występu w 'Billy Elliot'",
      "🎮 Nathan Drake w 'Uncharted'"
    ],
    relationships: ["Zendaya (potwierdzone 2021)"],
    netWorth: "$25M+",
    hobbies: ["Taniec", "Golf", "Gimnastyka"],
    socialMedia: ["@tomholland2013 - 7M+ obserwujących"],
    upcomingProjects: ["Spider-Man 4", "Nowe projekty Sony"],
    controversies: ["Spoilery filmów Marvel"],
    quotes: ["Z wielką mocą...", "Kocham być Spider-Manem"]
  },
  {
    id: "florence-pugh",
    name: "Florence Pugh",
    age: 28,
    birthPlace: "Oxford, England",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=600&fit=crop&face=center",
    images: [
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=600&fit=crop&face=center"
    ],
    filmography: [
      "Lady Macbeth (2016)",
      "Midsommar (2019)",
      "Little Women (2019)",
      "Black Widow (2021)",
      "Don't Worry Darling (2022)",
      "Oppenheimer (2023)"
    ],
    music: ["Cooking videos soundtracks"],
    books: [],
    awards: [
      "Oscar Nomination - Best Supporting Actress",
      "BAFTA Rising Star Award",
      "Critics Choice Award Nomination"
    ],
    trivia: [
      "Znana z gotowania i zabawnych filmików kulinarnych",
      "Była w związku z Zachem Braffem przez 3 lata",
      "Ma naturalnie brązowe włosy"
    ],
    funFacts: [
      "🍳 Królowa gotowania na Instagramie!",
      "🌻 Niezapomniana w horrorze 'Midsommar'",
      "👸 Amy March w 'Little Women'",
      "🎭 Nominacja do Oscara przed 25. urodzinami",
      "💪 Yelena Belova - siostra Black Widow"
    ],
    relationships: ["Charlie Gooch (obecny związek)"],
    netWorth: "$8M+",
    hobbies: ["Gotowanie", "Instagram cooking", "Podróże"],
    socialMedia: ["@florencepugh - 8M+", "Cooking content"],
    upcomingProjects: ["Dune: Part Three", "Marvel projects"],
    controversies: ["Drama wokół 'Don't Worry Darling'"],
    quotes: ["Jedzenie łączy ludzi", "Kocham autentyczne role"]
  }
];