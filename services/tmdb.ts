const TMDB_API_KEY = 'n2YTb81rl9eHhlBhIOukHERrc9cvrRQj';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export interface TMDBPerson {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
  known_for: Array<{
    title?: string;
    name?: string;
    media_type: string;
    release_date?: string;
    first_air_date?: string;
    vote_average?: number;
  }>;
  popularity: number;
}

export interface TMDBPersonDetails {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  known_for_department: string;
  also_known_as: string[];
  external_ids: {
    instagram_id: string | null;
    twitter_id: string | null;
    facebook_id: string | null;
  };
}

export interface TMDBCredits {
  cast: Array<{
    title?: string;
    name?: string;
    character: string;
    release_date?: string;
    first_air_date?: string;
    vote_average: number;
    media_type: string;
  }>;
}

class TMDBService {
  private async fetchFromTMDB(endpoint: string) {
    try {
      const url = `${TMDB_BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${TMDB_API_KEY}`;
      console.log('TMDB API call:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching from TMDB:', error);
      throw error;
    }
  }

  async searchPeople(query: string): Promise<TMDBPerson[]> {
    try {
      const response = await this.fetchFromTMDB(`/search/person?query=${encodeURIComponent(query)}&include_adult=false`);
      return response?.results || [];
    } catch (error) {
      console.error('Error searching TMDB:', error);
      return [];
    }
  }

  async getPersonDetails(personId: number): Promise<TMDBPersonDetails | null> {
    try {
      const [details, externalIds] = await Promise.all([
        this.fetchFromTMDB(`/person/${personId}`),
        this.fetchFromTMDB(`/person/${personId}/external_ids`)
      ]);
      
      return {
        ...details,
        external_ids: externalIds
      };
    } catch (error) {
      console.error('Error fetching person details:', error);
      return null;
    }
  }

  async getPersonCredits(personId: number): Promise<TMDBCredits | null> {
    try {
      return await this.fetchFromTMDB(`/person/${personId}/combined_credits`);
    } catch (error) {
      console.error('Error fetching credits:', error);
      return null;
    }
  }

  getImageUrl(path: string | null): string {
    if (!path) return 'https://images.unsplash.com/photo-1494790108755-2616c96f29f5?w=400&h=600&fit=crop';
    return `${TMDB_IMAGE_BASE_URL}${path}`;
  }

  private calculateAge(birthday: string | null): number {
    if (!birthday) return Math.floor(Math.random() * 30) + 25; // Random age if unknown
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  private generateFunFacts(person: TMDBPerson, details?: TMDBPersonDetails): string[] {
    const facts: string[] = [];
    
    // Popularity fact
    if (person.popularity > 50) {
      facts.push(`🔥 Popularność: ${person.popularity.toFixed(1)} - MEGA GWIAZDA!`);
    } else if (person.popularity > 20) {
      facts.push(`⭐ Popularność: ${person.popularity.toFixed(1)} - Rosnąca gwiazda!`);
    } else {
      facts.push(`💫 Popularność: ${person.popularity.toFixed(1)} - Ukryty talent!`);
    }

    // Known for department
    if (person.known_for_department === 'Acting') {
      facts.push('🎭 Profesjonalny aktor/aktorka');
    } else if (person.known_for_department === 'Directing') {
      facts.push('🎬 Utalentowany reżyser');
    } else {
      facts.push(`🎨 Specjalista: ${person.known_for_department}`);
    }

    // Movies count
    const movieCount = person.known_for?.length || 0;
    if (movieCount > 5) {
      facts.push(`🎥 ${movieCount}+ znanych produkcji!`);
    } else if (movieCount > 0) {
      facts.push(`🌟 ${movieCount} hitów w portfolio`);
    }

    // Biography fact
    if (details?.biography && details.biography.length > 100) {
      facts.push('📚 Bogata historia kariery');
    }

    // Birth place fact
    if (details?.place_of_birth) {
      const birthPlace = details.place_of_birth.split(',').pop()?.trim() || details.place_of_birth;
      facts.push(`🌍 Pochodzenie: ${birthPlace}`);
    }

    // Social media fact
    if (details?.external_ids?.instagram_id) {
      facts.push('📱 Aktywny na Instagramie!');
    }

    // Add some random BRAVO-style facts if we need more
    const bravoFacts = [
      '✨ Styl życia gwiazdy!',
      '🎪 Zawsze w centrum uwagi',
      '💎 Luksusowy lifestyle',
      '🌈 Ikona popkultury',
      '🔥 Wzbudza kontrowersje',
      '💯 Numer 1 w sercach fanów'
    ];

    while (facts.length < 5) {
      const randomFact = bravoFacts[Math.floor(Math.random() * bravoFacts.length)];
      if (!facts.includes(randomFact)) {
        facts.push(randomFact);
      }
    }

    return facts.slice(0, 5);
  }

  private generateQuotes(person: TMDBPerson, details?: TMDBPersonDetails): string[] {
    // Generic inspiring quotes for when we don't have real ones
    const genericQuotes = [
      "Aktorstwo to moja pasja i sposób na życie",
      "Każda rola to nowe wyzwanie",
      "Kino zmienia świat, jeden film na raz",
      "Praca z publicznością to niesamowite doświadczenie",
      "Sztuka łączy ludzi na całym świecie",
      "Marzenia się spełniają, gdy się nie poddaje",
      "Każdy dzień przynosi nowe możliwości"
    ];

    return [genericQuotes[Math.floor(Math.random() * genericQuotes.length)]];
  }

  private generateAwards(person: TMDBPerson, details?: TMDBPersonDetails): string[] {
    const awards: string[] = [];
    
    if (person.popularity > 80) {
      awards.push('🏆 TMDB Most Popular Star');
      awards.push('⭐ Global Recognition Award');
    } else if (person.popularity > 50) {
      awards.push('🌟 TMDB Rising Star');
      awards.push('🎭 Outstanding Performance');
    } else if (person.popularity > 20) {
      awards.push('💫 TMDB Talent Award');
    }

    // Add department-specific awards
    if (person.known_for_department === 'Acting') {
      awards.push('🎬 Best Actor/Actress Nominee');
    } else if (person.known_for_department === 'Directing') {
      awards.push('🎥 Excellence in Directing');
    }

    // Check for high-rated movies
    const highRatedMovies = person.known_for?.filter(movie => (movie.vote_average || 0) > 8) || [];
    if (highRatedMovies.length > 0) {
      awards.push('🏅 Critics Choice Recognition');
    }

    return awards.length > 0 ? awards : ['🎭 Industry Professional'];
  }

  transformToActor(person: TMDBPerson, details?: TMDBPersonDetails, credits?: TMDBCredits): any {
    const age = this.calculateAge(details?.birthday || null);
    
    // Extract filmography from known_for and credits
    const knownForTitles = person.known_for?.map(item => item.title || item.name || 'Unknown').filter(Boolean) || [];
    const creditTitles = credits?.cast?.slice(0, 15)
      .map(item => item.title || item.name || 'Unknown')
      .filter(Boolean) || [];
    
    // Combine and deduplicate
    const allTitles = [...new Set([...knownForTitles, ...creditTitles])];
    
    // Extract social media
    const socialMedia: string[] = [];
    if (details?.external_ids?.instagram_id) {
      socialMedia.push(`@${details.external_ids.instagram_id}`);
    }
    if (details?.external_ids?.twitter_id) {
      socialMedia.push(`@${details.external_ids.twitter_id}`);
    }
    if (socialMedia.length === 0) {
      socialMedia.push('Prywatne konta');
    }

    // Generate upcoming projects based on recent work
    const upcomingProjects = [
      'Nowe projekty w produkcji',
      'Tajemniczy film 2024',
      'Współpraca z top reżyserami'
    ];

    // Generate net worth estimate based on popularity
    let netWorth = '$1-5 milionów';
    if (person.popularity > 80) {
      netWorth = '$50+ milionów';
    } else if (person.popularity > 50) {
      netWorth = '$10-50 milionów';
    } else if (person.popularity > 20) {
      netWorth = '$5-10 milionów';
    }

    return {
      id: `tmdb-${person.id}`,
      name: person.name,
      age,
      birthPlace: details?.place_of_birth || "Nieznane miejsce",
      image: this.getImageUrl(person.profile_path),
      filmography: allTitles.slice(0, 12),
      music: person.known_for_department === 'Sound' ? ['Soundtrack work', 'Music production'] : [],
      books: [],
      awards: this.generateAwards(person, details),
      trivia: [
        details?.biography?.substring(0, 150) + '...' || `Specjalizuje się w: ${person.known_for_department}`,
        `Popularność w bazach: ${person.popularity.toFixed(1)}/100`,
        details?.also_known_as?.length ? `Znany także jako: ${details.also_known_as[0]}` : 'Jedna z najbardziej rozpoznawalnych twarzy'
      ],
      funFacts: this.generateFunFacts(person, details),
      relationships: details?.deathday ? ['Zmarł/a'] : ['Życie prywatne chronione'],
      netWorth,
      hobbies: ['Aktorstwo', 'Podróże', 'Sztuka'],
      socialMedia,
      upcomingProjects,
      controversies: ['Brak większych skandali', 'Profesjonalna kariera'],
      quotes: this.generateQuotes(person, details)
    };
  }

  // Method to get trending people
  async getTrendingPeople(): Promise<TMDBPerson[]> {
    try {
      const response = await this.fetchFromTMDB('/trending/person/week');
      return response?.results?.slice(0, 10) || [];
    } catch (error) {
      console.error('Error fetching trending people:', error);
      return [];
    }
  }

  // Method to get popular people
  async getPopularPeople(page: number = 1): Promise<TMDBPerson[]> {
    try {
      const response = await this.fetchFromTMDB(`/person/popular?page=${page}`);
      return response?.results || [];
    } catch (error) {
      console.error('Error fetching popular people:', error);
      return [];
    }
  }
}

export const tmdbService = new TMDBService();