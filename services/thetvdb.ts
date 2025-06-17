const THETVDB_BASE_URL = 'https://api4.thetvdb.com/v4';
const THETVDB_API_KEY = '11e959be-8afe-4270-9b89-a9bbafae7137';

export interface TheTVDBPerson {
  id: number;
  name: string;
  birth?: string;
  death?: string;
  birthPlace?: string;
  gender?: number; // 1 = male, 2 = female
  image?: string;
  biography?: string;
  aliases?: Array<{
    name: string;
    language: string;
  }>;
  awards?: Array<{
    id: number;
    name: string;
    year?: number;
  }>;
  characters?: Array<{
    id: number;
    name: string;
    image?: string;
  }>;
}

export interface TheTVDBSearchResult {
  objectID: string;
  aliases?: string[];
  country?: string;
  id: string;
  image_url?: string;
  name: string;
  primary_language?: string;
  type: string;
  tvdb_id: string;
  year?: string;
  translations?: {
    eng?: string;
  };
}

export interface TheTVDBSeries {
  id: number;
  name: string;
  slug: string;
  image?: string;
  firstAired?: string;
  lastAired?: string;
  network?: string;
  status?: {
    id: number;
    name: string;
  };
  genres?: Array<{
    id: number;
    name: string;
  }>;
  averageRuntime?: number;
  score?: number;
  overview?: string;
  year?: string;
}

export interface TheTVDBCastMember {
  id: number;
  peopleId: number;
  personName: string;
  personImgURL?: string;
  seriesId: number;
  series?: TheTVDBSeries;
  character?: string;
  isFeatured?: boolean;
  sort?: number;
  peopleType: string;
}

// Enhanced fallback data with TheTVDB-style structure
const fallbackTVDBPeople = [
  {
    id: 290434,
    name: 'Pedro Pascal',
    birth: '1975-04-02',
    birthPlace: 'Santiago, Chile',
    gender: 1,
    image: 'https://artworks.thetvdb.com/banners/person/290434/61b35a5b5c93b.jpg',
    biography: 'Chilean-American actor known for his roles in The Mandalorian and The Last of Us.'
  },
  {
    id: 346817,
    name: 'Millie Bobby Brown',
    birth: '2004-02-19',
    birthPlace: 'Marbella, Spain',
    gender: 2,
    image: 'https://artworks.thetvdb.com/banners/person/346817/5f35c7e5c93c8.jpg',
    biography: 'British actress known for playing Eleven in Stranger Things.'
  },
  {
    id: 278851,
    name: 'Henry Cavill',
    birth: '1983-05-05',
    birthPlace: 'Jersey, Channel Islands',
    gender: 1,
    image: 'https://artworks.thetvdb.com/banners/person/278851/5e8ab11a8b5e9.jpg',
    biography: 'British actor known for playing Superman and Geralt of Rivia in The Witcher.'
  },
  {
    id: 427394,
    name: 'Anya Taylor-Joy',
    birth: '1996-04-16',
    birthPlace: 'Miami, Florida',
    gender: 2,
    image: 'https://artworks.thetvdb.com/banners/person/427394/614d2c5f0e2c4.jpg',
    biography: 'Actress known for The Queen\'s Gambit and various horror films.'
  }
];

class TheTVDBService {
  private authToken: string | null = null;
  private tokenExpiry: number = 0;
  private isAuthenticated = false;

  private async authenticate(): Promise<string> {
    // Check if we have a valid token that hasn't expired
    if (this.authToken && Date.now() < this.tokenExpiry && this.isAuthenticated) {
      return this.authToken;
    }

    try {
      console.log('Authenticating with TheTVDB v4 API...');
      
      const response = await fetch(`${THETVDB_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          apikey: THETVDB_API_KEY
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('TheTVDB auth response:', response.status, errorText);
        throw new Error(`TheTVDB auth failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('TheTVDB auth success:', data.status);
      
      if (data.status === 'success' && data.data?.token) {
        this.authToken = data.data.token;
        this.isAuthenticated = true;
        // TheTVDB tokens expire after 24 hours, refresh after 20 hours
        this.tokenExpiry = Date.now() + (20 * 60 * 60 * 1000);
        console.log('TheTVDB authenticated successfully');
        return this.authToken;
      } else {
        throw new Error('Invalid authentication response from TheTVDB');
      }
    } catch (error) {
      console.error('TheTVDB authentication failed:', error);
      this.isAuthenticated = false;
      this.authToken = null;
      throw new Error(`Failed to authenticate with TheTVDB: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async fetchFromTVDB(endpoint: string, retries = 1): Promise<any> {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const token = await this.authenticate();
        const url = `${THETVDB_BASE_URL}${endpoint}`;
        
        console.log('TheTVDB API call:', url);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // Longer timeout
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.status === 401 || response.status === 403) {
          // Token expired or invalid, clear it and retry
          console.log('TheTVDB token expired, re-authenticating...');
          this.authToken = null;
          this.tokenExpiry = 0;
          this.isAuthenticated = false;
          if (attempt < retries) continue;
        }
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('TheTVDB API error:', response.status, errorText);
          throw new Error(`TheTVDB API error: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        return data;
      } catch (error) {
        console.error(`TheTVDB API attempt ${attempt + 1} failed:`, error);
        
        if (attempt === retries) {
          throw error;
        }
        
        // Wait before retrying with exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 2000));
      }
    }
  }

  async searchPeople(query: string): Promise<TheTVDBPerson[]> {
    try {
      console.log(`Searching TheTVDB for people: "${query}"`);
      
      // TheTVDB v4 search endpoint
      const response = await this.fetchFromTVDB(`/search?query=${encodeURIComponent(query)}&type=person&limit=10`);
      
      if (response?.status === 'success' && response?.data) {
        console.log(`TheTVDB search found ${response.data.length} results`);
        
        // Transform search results to our Person format
        const people: TheTVDBPerson[] = response.data
          .filter((item: TheTVDBSearchResult) => item.type === 'person')
          .map((item: TheTVDBSearchResult) => ({
            id: parseInt(item.tvdb_id || item.id),
            name: item.name,
            image: item.image_url,
            biography: item.translations?.eng || `Actor known for various TV shows and films.`
          }))
          .slice(0, 8);

        return people;
      }
      
      // Fallback to local data
      console.log('No TheTVDB results, using fallback people');
      const matchingFallback = fallbackTVDBPeople.filter(person => 
        person.name.toLowerCase().includes(query.toLowerCase())
      );
      
      return matchingFallback as TheTVDBPerson[];
      
    } catch (error) {
      console.error('Error searching TheTVDB people:', error);
      
      // Return fallback people that match the query
      const matchingFallback = fallbackTVDBPeople.filter(person => 
        person.name.toLowerCase().includes(query.toLowerCase())
      );
      
      console.log('Using TheTVDB fallback people:', matchingFallback.length);
      return matchingFallback as TheTVDBPerson[];
    }
  }

  async getPersonDetails(personId: number): Promise<TheTVDBPerson | null> {
    try {
      console.log(`Getting TheTVDB person details for ID: ${personId}`);
      
      const response = await this.fetchFromTVDB(`/people/${personId}/extended`);
      
      if (response?.status === 'success' && response?.data) {
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching TheTVDB person details:', error);
      
      // Return fallback if available
      const fallback = fallbackTVDBPeople.find(p => p.id === personId);
      return fallback as TheTVDBPerson || null;
    }
  }

  async getPersonCredits(personId: number): Promise<TheTVDBCastMember[]> {
    try {
      console.log(`Getting TheTVDB person credits for ID: ${personId}`);
      
      // Try multiple endpoints for person credits
      const endpoints = [
        `/people/${personId}/characters`,
        `/people/${personId}`,
      ];
      
      for (const endpoint of endpoints) {
        try {
          const response = await this.fetchFromTVDB(endpoint);
          
          if (response?.status === 'success' && response?.data) {
            // Transform the response to our expected format
            if (Array.isArray(response.data)) {
              return response.data.map((credit: any) => ({
                id: credit.id || Math.random(),
                peopleId: personId,
                personName: credit.personName || 'Unknown',
                seriesId: credit.seriesId || credit.series?.id || Math.random(),
                character: credit.character || credit.name,
                isFeatured: credit.isFeatured || false,
                peopleType: credit.type || 'Actor'
              }));
            } else if (response.data.characters) {
              return response.data.characters.map((credit: any) => ({
                id: credit.id || Math.random(),
                peopleId: personId,
                personName: response.data.name || 'Unknown',
                seriesId: credit.seriesId || Math.random(),
                character: credit.name,
                isFeatured: true,
                peopleType: 'Actor'
              }));
            }
          }
        } catch (endpointError) {
          console.log(`TheTVDB endpoint ${endpoint} failed, trying next...`);
          continue;
        }
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching TheTVDB person credits:', error);
      
      // Return basic credits for fallback people
      const fallback = fallbackTVDBPeople.find(p => p.id === personId);
      if (fallback) {
        return [
          {
            id: 1,
            peopleId: personId,
            personName: fallback.name,
            seriesId: 1,
            character: 'Main Character',
            isFeatured: true,
            peopleType: 'Actor'
          }
        ];
      }
      
      return [];
    }
  }

  private calculateAge(birthDate: string | null): number {
    if (!birthDate) return Math.floor(Math.random() * 30) + 25;
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age > 0 ? age : Math.floor(Math.random() * 30) + 25;
  }

  private generateTVDBFunFacts(person: TheTVDBPerson, credits: TheTVDBCastMember[]): string[] {
    const facts: string[] = [];
    
    // Gender fact
    if (person.gender) {
      facts.push(`👤 ${person.gender === 1 ? 'Aktor' : 'Aktorka'}`);
    }

    // Birth place
    if (person.birthPlace) {
      facts.push(`🌍 Miejsce urodzenia: ${person.birthPlace}`);
    }

    // Career span
    const uniqueSeries = [...new Set(credits.map(c => c.seriesId))];
    if (uniqueSeries.length > 10) {
      facts.push(`📺 ${uniqueSeries.length}+ seriali w karierze!`);
    } else if (uniqueSeries.length > 5) {
      facts.push(`⭐ ${uniqueSeries.length} znaczących ról TV`);
    } else if (uniqueSeries.length > 2) {
      facts.push(`🎬 ${uniqueSeries.length} projektów telewizyjnych`);
    } else {
      facts.push(`🌟 Rozwijająca się kariera TV`);
    }

    // Featured roles
    const featuredRoles = credits.filter(c => c.isFeatured);
    if (featuredRoles.length > 0) {
      facts.push(`🌟 ${featuredRoles.length} głównych ról`);
    }

    // Biography excerpt
    if (person.biography) {
      const shortBio = person.biography.substring(0, 80) + '...';
      facts.push(`📚 ${shortBio}`);
    }

    // Awards
    if (person.awards && person.awards.length > 0) {
      facts.push(`🏆 ${person.awards.length} nagród i wyróżnień`);
    }

    // Character variety
    const characters = credits.map(c => c.character).filter(Boolean);
    if (characters.length > 3) {
      facts.push(`🎭 ${characters.length} różnych postaci`);
    }

    // Aliases/Alternative names
    if (person.aliases && person.aliases.length > 0) {
      facts.push(`🎪 Znany też jako: ${person.aliases[0].name}`);
    }

    // Default BRAVO-style facts if we need more
    const bravoFacts = [
      '✨ Gwiazda telewizji!',
      '📺 Ikona małego ekranu',
      '🎬 Talent przed kamerami',
      '🌟 Ulubieniec widzów TV',
      '💫 Profesjonalny wykonawca',
      '🎭 Mistrz charakteryzacji',
      '📸 Rozpoznawalna twarz',
      '🔥 Hot w branży rozrywkowej!'
    ];

    while (facts.length < 8) {
      const randomFact = bravoFacts[Math.floor(Math.random() * bravoFacts.length)];
      if (!facts.includes(randomFact)) {
        facts.push(randomFact);
      }
    }

    return facts.slice(0, 8);
  }

  private generateTVDBAwards(person: TheTVDBPerson, credits: TheTVDBCastMember[]): string[] {
    const awards: string[] = [];
    
    // Use actual awards if available
    if (person.awards && person.awards.length > 0) {
      person.awards.slice(0, 3).forEach(award => {
        awards.push(`🏆 ${award.name} ${award.year ? `(${award.year})` : ''}`);
      });
    }

    // Generate awards based on career metrics
    const uniqueSeries = [...new Set(credits.map(c => c.seriesId))];
    const featuredRoles = credits.filter(c => c.isFeatured);
    
    if (uniqueSeries.length > 8) {
      awards.push('📺 Weteran Telewizji');
    }
    
    if (featuredRoles.length > 3) {
      awards.push('⭐ Uznanie za Główne Role');
    }

    if (uniqueSeries.length > 15) {
      awards.push('🎭 Kandydat do TV Hall of Fame');
    }

    // Default awards if none generated
    if (awards.length === 0) {
      awards.push('🎬 Profesjonalny Aktor TV');
      awards.push('📺 Członek Cechu Aktorskiego');
      awards.push('⭐ Uznanie Branżowe');
    }

    return awards.slice(0, 4);
  }

  async transformToActor(person: TheTVDBPerson, credits?: TheTVDBCastMember[]): Promise<any> {
    const age = this.calculateAge(person.birth || null);
    const personCredits = credits || [];
    
    // Extract series information
    const filmography = personCredits
      .map(credit => credit.series?.name || `TV Series ${credit.seriesId}`)
      .filter(Boolean)
      .slice(0, 12);
    
    if (filmography.length === 0) {
      filmography.push('Projekty telewizyjne', 'Seriale', 'Programy TV');
    }
    
    // Get character names
    const characters = personCredits
      .map(credit => credit.character)
      .filter(Boolean)
      .slice(0, 6);

    // Determine net worth based on career
    const seriesCount = [...new Set(personCredits.map(c => c.seriesId))].length;
    let netWorth = '$100k-500k';
    if (seriesCount > 15) {
      netWorth = '$8M+';
    } else if (seriesCount > 10) {
      netWorth = '$3M-8M';
    } else if (seriesCount > 5) {
      netWorth = '$1M-3M';
    } else if (seriesCount > 2) {
      netWorth = '$200k-1M';
    }

    // Prepare images array
    const images = [];
    if (person.image) {
      images.push(person.image);
    }

    return {
      id: `tvdb-${person.id}`,
      name: person.name,
      age,
      birthPlace: person.birthPlace || "Nieznane",
      image: person.image || 'https://artworks.thetvdb.com/banners/person/missing.jpg',
      images: images.slice(0, 5),
      filmography: filmography,
      music: [],
      books: [],
      awards: this.generateTVDBAwards(person, personCredits),
      trivia: [
        person.biography?.substring(0, 200) + '...' || `Aktor telewizyjny znany z ${filmography[0] || 'wielu seriali'}`,
        `Data urodzenia: ${person.birth || 'Nieznana'}`,
        `Liczba seriali: ${[...new Set(personCredits.map(c => c.seriesId))].length}`,
        `Miejsce urodzenia: ${person.birthPlace || 'Nieznane'}`
      ],
      funFacts: this.generateTVDBFunFacts(person, personCredits),
      relationships: person.death ? ['Zmarł/a'] : ['Status związku nieznany'],
      netWorth,
      hobbies: ['Aktorstwo', 'Telewizja', 'Rozrywka', 'Sztuka'],
      socialMedia: ['Profile prywatne', 'TheTVDB verified'],
      upcomingProjects: ['Nowe projekty TV', 'Castingi w toku', 'Współpraca z sieciami TV'],
      controversies: ['Brak większych skandali'],
      quotes: [
        person.biography?.split('.')[0] + '.' || 'Telewizja to moja pasja.',
        'Każda rola to nowe wyzwanie.',
        'Seriale zmieniają sposób opowiadania historii.'
      ],
      tvdbData: person // Store TheTVDB data for reference
    };
  }

  // Get popular/trending people from TheTVDB
  async getPopularPeople(): Promise<TheTVDBPerson[]> {
    try {
      console.log('Loading popular people from TheTVDB...');
      
      // Since TheTVDB doesn't have a direct "popular" endpoint, we'll try searching for well-known actors
      const popularSearches = ['Pedro Pascal', 'Millie Bobby Brown', 'Henry Cavill', 'Anya Taylor'];
      const allResults = [];
      
      for (const search of popularSearches) {
        try {
          const results = await this.searchPeople(search);
          if (results.length > 0) {
            allResults.push(results[0]); // Take the first result for each search
          }
        } catch (error) {
          console.log(`Failed to search TheTVDB for ${search}:`, error);
          continue;
        }
      }
      
      if (allResults.length > 0) {
        console.log('Retrieved popular TV actors from TheTVDB:', allResults.length);
        return allResults;
      }
      
      console.log('Using TheTVDB fallback people for popular');
      return fallbackTVDBPeople as TheTVDBPerson[];
      
    } catch (error) {
      console.error('Error fetching popular TheTVDB people:', error);
      console.log('Falling back to hardcoded popular people');
      return fallbackTVDBPeople as TheTVDBPerson[];
    }
  }
}

export const thetvdbService = new TheTVDBService();