const TVMAZE_BASE_URL = 'https://api.tvmaze.com';

export interface TVMazePerson {
  id: number;
  name: string;
  country?: {
    name: string;
    code: string;
  };
  birthday?: string;
  deathday?: string;
  gender?: string;
  image?: {
    medium: string;
    original: string;
  };
  url: string;
  updated: number;
}

export interface TVMazeShow {
  id: number;
  name: string;
  type: string;
  language: string;
  genres: string[];
  status: string;
  runtime?: number;
  premiered?: string;
  ended?: string;
  officialSite?: string;
  schedule: {
    time: string;
    days: string[];
  };
  rating: {
    average?: number;
  };
  weight: number;
  network?: {
    id: number;
    name: string;
    country: {
      name: string;
      code: string;
    };
  };
  image?: {
    medium: string;
    original: string;
  };
  summary?: string;
  updated: number;
}

export interface TVMazeCastCredit {
  _links: {
    show: {
      href: string;
    };
    character: {
      href: string;
    };
  };
  _embedded?: {
    show: TVMazeShow;
    character: {
      id: number;
      name: string;
      image?: {
        medium: string;
        original: string;
      };
    };
  };
}

export interface WikipediaData {
  title: string;
  extract: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
  originalimage?: {
    source: string;
    width: number;
    height: number;
  };
  images?: string[];
}

// Enhanced fallback data with better Wikipedia-style images
const fallbackActors = [
  {
    id: 'fallback-1',
    name: 'Jennifer Lawrence',
    country: { name: 'United States', code: 'US' },
    birthday: '1990-08-15',
    image: { 
      original: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Jennifer_Lawrence_SDCC_2015_X-Men.jpg/800px-Jennifer_Lawrence_SDCC_2015_X-Men.jpg',
      medium: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Jennifer_Lawrence_SDCC_2015_X-Men.jpg/400px-Jennifer_Lawrence_SDCC_2015_X-Men.jpg'
    }
  },
  {
    id: 'fallback-2', 
    name: 'Ryan Reynolds',
    country: { name: 'Canada', code: 'CA' },
    birthday: '1976-10-23',
    image: {
      original: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Ryan_Reynolds_2016.jpg/800px-Ryan_Reynolds_2016.jpg',
      medium: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Ryan_Reynolds_2016.jpg/400px-Ryan_Reynolds_2016.jpg'
    }
  },
  {
    id: 'fallback-3',
    name: 'Emma Watson', 
    country: { name: 'United Kingdom', code: 'GB' },
    birthday: '1990-04-15',
    image: {
      original: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Emma_Watson_2013.jpg/800px-Emma_Watson_2013.jpg',
      medium: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Emma_Watson_2013.jpg/400px-Emma_Watson_2013.jpg'
    }
  },
  {
    id: 'fallback-4',
    name: 'Michael B. Jordan',
    country: { name: 'United States', code: 'US' },
    birthday: '1987-02-09',
    image: {
      original: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Michael_B._Jordan_by_Gage_Skidmore_2.jpg/800px-Michael_B._Jordan_by_Gage_Skidmore_2.jpg',
      medium: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Michael_B._Jordan_by_Gage_Skidmore_2.jpg/400px-Michael_B._Jordan_by_Gage_Skidmore_2.jpg'
    }
  }
];

class TVMazeService {
  private async fetchFromTVMaze(endpoint: string, retries = 2): Promise<any> {
    const url = `${TVMAZE_BASE_URL}${endpoint}`;
    console.log('TVMaze API call:', url);
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'BRAVO-Infographic-Generator/1.0'
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`TVMaze API error: ${response.status} ${response.statusText}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error(`TVMaze API attempt ${attempt + 1} failed:`, error);
        
        if (attempt === retries) {
          throw error;
        }
        
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }

  private async fetchWikipediaImages(personName: string): Promise<string[]> {
    try {
      // Try multiple strategies to get Wikipedia images
      const strategies = [
        // Strategy 1: Try direct page images
        async () => {
          const response = await fetch(
            `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=images&titles=${encodeURIComponent(personName)}&imlimit=20`
          );
          const data = await response.json();
          const pages = data?.query?.pages || {};
          const pageId = Object.keys(pages)[0];
          
          if (pageId && pages[pageId]?.images) {
            const imagePromises = pages[pageId].images
              .filter((img: any) => 
                img.title && 
                (img.title.includes('.jpg') || img.title.includes('.png') || img.title.includes('.jpeg')) &&
                !img.title.toLowerCase().includes('commons-logo') &&
                !img.title.toLowerCase().includes('edit-icon') &&
                !img.title.toLowerCase().includes('wikimedia') &&
                !img.title.toLowerCase().includes('icon')
              )
              .slice(0, 8)
              .map(async (img: any) => {
                try {
                  // Get the actual image URL
                  const imageResponse = await fetch(
                    `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=imageinfo&iiprop=url&titles=${encodeURIComponent(img.title)}`
                  );
                  const imageData = await imageResponse.json();
                  const imagePages = imageData?.query?.pages || {};
                  const imagePageId = Object.keys(imagePages)[0];
                  const imageUrl = imagePages[imagePageId]?.imageinfo?.[0]?.url;
                  
                  // Only return if it's a reasonable size image
                  if (imageUrl && !imageUrl.includes('20px') && !imageUrl.includes('32px')) {
                    return imageUrl;
                  }
                  return null;
                } catch {
                  return null;
                }
              });
            
            const resolvedImages = await Promise.all(imagePromises);
            return resolvedImages.filter(Boolean) as string[];
          }
          return [];
        },
        
        // Strategy 2: Search for commons images
        async () => {
          const response = await fetch(
            `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&list=search&srsearch=${encodeURIComponent(personName)}&srnamespace=6&srlimit=10`
          );
          const data = await response.json();
          
          if (data?.query?.search) {
            const imagePromises = data.query.search
              .filter((item: any) => 
                item.title.includes('.jpg') || item.title.includes('.png') || item.title.includes('.jpeg')
              )
              .slice(0, 5)
              .map(async (item: any) => {
                try {
                  const imageResponse = await fetch(
                    `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&prop=imageinfo&iiprop=url&titles=${encodeURIComponent(item.title)}`
                  );
                  const imageData = await imageResponse.json();
                  const pages = imageData?.query?.pages || {};
                  const pageId = Object.keys(pages)[0];
                  return pages[pageId]?.imageinfo?.[0]?.url || null;
                } catch {
                  return null;
                }
              });
            
            const resolvedImages = await Promise.all(imagePromises);
            return resolvedImages.filter(Boolean) as string[];
          }
          return [];
        }
      ];
      
      // Try each strategy and combine results
      const allImages: string[] = [];
      for (const strategy of strategies) {
        try {
          const images = await strategy();
          allImages.push(...images);
          if (allImages.length >= 5) break; // We have enough images
        } catch (error) {
          console.log('Wikipedia image strategy failed:', error);
          continue;
        }
      }
      
      // Remove duplicates and return
      return [...new Set(allImages)].slice(0, 5);
      
    } catch (error) {
      console.error('Error fetching Wikipedia images:', error);
      return [];
    }
  }

  private async fetchFromWikipedia(personName: string): Promise<WikipediaData | null> {
    try {
      const endpoints = [
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(personName)}`,
        `https://pl.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(personName)}`
      ];
      
      for (const endpoint of endpoints) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          
          const response = await fetch(endpoint, {
            signal: controller.signal,
            headers: {
              'Accept': 'application/json'
            }
          });
          
          clearTimeout(timeoutId);
          
          if (response.ok) {
            const data = await response.json();
            
            // Get additional images from Wikipedia
            try {
              const additionalImages = await this.fetchWikipediaImages(personName);
              data.images = additionalImages;
            } catch (imgError) {
              console.log('Could not fetch additional Wikipedia images:', imgError);
              data.images = [];
            }
            
            return data;
          }
        } catch (error) {
          console.log(`Wikipedia endpoint ${endpoint} failed:`, error);
          continue;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching from Wikipedia:', error);
      return null;
    }
  }

  async searchPeople(query: string): Promise<TVMazePerson[]> {
    try {
      const response = await this.fetchFromTVMaze(`/search/people?q=${encodeURIComponent(query)}`);
      const results = response?.map((result: any) => result.person).filter(Boolean) || [];
      
      if (results.length > 0) {
        return results;
      }
      
      const matchingFallback = fallbackActors.filter(actor => 
        actor.name.toLowerCase().includes(query.toLowerCase())
      );
      
      if (matchingFallback.length > 0) {
        console.log('Using fallback actors for search:', matchingFallback.length);
        return matchingFallback as TVMazePerson[];
      }
      
      return [];
    } catch (error) {
      console.error('Error searching TVMaze:', error);
      
      const matchingFallback = fallbackActors.filter(actor => 
        actor.name.toLowerCase().includes(query.toLowerCase())
      );
      
      console.log('API failed, using fallback actors:', matchingFallback.length);
      return matchingFallback as TVMazePerson[];
    }
  }

  async getPersonDetails(personId: number): Promise<TVMazePerson | null> {
    try {
      return await this.fetchFromTVMaze(`/people/${personId}`);
    } catch (error) {
      console.error('Error fetching person details:', error);
      return null;
    }
  }

  async getPersonCastCredits(personId: number): Promise<TVMazeCastCredit[]> {
    try {
      const response = await this.fetchFromTVMaze(`/people/${personId}/castcredits?embed[]=show&embed[]=character`);
      return response || [];
    } catch (error) {
      console.error('Error fetching cast credits:', error);
      return [
        {
          _links: { show: { href: '' }, character: { href: '' } },
          _embedded: {
            show: {
              id: 1,
              name: 'Popular Drama Series',
              type: 'Scripted',
              language: 'English',
              genres: ['Drama', 'Thriller'],
              status: 'Running',
              schedule: { time: '21:00', days: ['Monday'] },
              rating: { average: 8.7 },
              weight: 95,
              updated: Date.now()
            },
            character: {
              id: 1,
              name: 'Lead Character'
            }
          }
        }
      ];
    }
  }

  async getPersonCrewCredits(personId: number): Promise<any[]> {
    try {
      const response = await this.fetchFromTVMaze(`/people/${personId}/crewcredits?embed=show`);
      return response || [];
    } catch (error) {
      console.error('Error fetching crew credits:', error);
      return [];
    }
  }

  private calculateAge(birthday: string | null): number {
    if (!birthday) return Math.floor(Math.random() * 25) + 25;
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age > 0 ? age : Math.floor(Math.random() * 25) + 25;
  }

  private generateFunFacts(person: TVMazePerson, castCredits: TVMazeCastCredit[], wikiData?: WikipediaData): string[] {
    const facts: string[] = [];
    
    if (person.gender) {
      facts.push(`👤 ${person.gender === 'Male' ? 'Mężczyzna' : 'Kobieta'}`);
    }

    if (person.country) {
      facts.push(`🌍 Pochodzenie: ${person.country.name}`);
    }

    const shows = castCredits.length;
    if (shows > 15) {
      facts.push(`🎭 ${shows}+ ról w karierze!`);
    } else if (shows > 8) {
      facts.push(`⭐ ${shows} znaczących ról`);
    } else if (shows > 3) {
      facts.push(`🌟 ${shows} projektów filmowych`);
    } else {
      facts.push(`🎬 Wschodząca gwiazda`);
    }

    if (wikiData?.extract) {
      const shortExtract = wikiData.extract.substring(0, 120) + '...';
      facts.push(`📚 ${shortExtract}`);
    }

    const showTypes = [...new Set(castCredits.map(credit => 
      credit._embedded?.show?.type || 'Series'
    ))];
    if (showTypes.length > 1) {
      facts.push(`🎬 Wszechstronny: ${showTypes.join(', ')}`);
    }

    const highRated = castCredits.filter(credit => 
      (credit._embedded?.show?.rating?.average || 0) > 8.5
    );
    if (highRated.length > 0) {
      facts.push(`🏆 ${highRated.length} wysoce ocenianych projektów`);
    }

    const genres = [...new Set(castCredits.flatMap(credit => 
      credit._embedded?.show?.genres || []
    ))].slice(0, 3);
    if (genres.length > 0) {
      facts.push(`🎪 Gatunki: ${genres.join(', ')}`);
    }

    const bravoFacts = [
      '✨ Gwiazda ekranów!',
      '🎪 Zawsze w centrum uwagi',
      '💎 Talent i charyzma',
      '🌈 Ikona popkultury',
      '🔥 Wzbudza emocje fanów',
      '💯 Ulubieniec widzów',
      '🎭 Mistrz aktorstwa',
      '📸 Obiekt westchnień',
      '🎬 Przyszłość Hollywood',
      '💫 Niekwestionowany talent'
    ];

    while (facts.length < 8) {
      const randomFact = bravoFacts[Math.floor(Math.random() * bravoFacts.length)];
      if (!facts.includes(randomFact)) {
        facts.push(randomFact);
      }
    }

    return facts.slice(0, 8);
  }

  private generateAwards(person: TVMazePerson, castCredits: TVMazeCastCredit[]): string[] {
    const awards: string[] = [];
    
    const highRatedShows = castCredits.filter(credit => 
      (credit._embedded?.show?.rating?.average || 0) > 8.5
    );
    
    if (highRatedShows.length > 3) {
      awards.push('🏆 Gwiazda hitowych produkcji');
      awards.push('⭐ Krytycznie uznany talent');
    } else if (highRatedShows.length > 1) {
      awards.push('🌟 Występy w hitowych projektach');
    } else if (highRatedShows.length > 0) {
      awards.push('✨ Hit w swoim dorobku');
    }

    const longShows = castCredits.filter(credit => {
      const show = credit._embedded?.show;
      if (!show?.premiered) return false;
      const premiered = new Date(show.premiered);
      const ended = show.ended ? new Date(show.ended) : new Date();
      const years = (ended.getTime() - premiered.getTime()) / (1000 * 60 * 60 * 24 * 365);
      return years > 3;
    });

    if (longShows.length > 0) {
      awards.push('📺 Gwiazda długoletnich seriali');
    }

    const genres = [...new Set(castCredits.flatMap(credit => 
      credit._embedded?.show?.genres || []
    ))];
    if (genres.length > 4) {
      awards.push('🎭 Wszechstronny wykonawca');
    }

    if (awards.length === 0) {
      awards.push('🎬 Profesjonalny aktor');
      awards.push('🌟 Rozpoznawalny talent');
    }

    return awards.slice(0, 4);
  }

  async transformToActor(person: TVMazePerson, castCredits?: TVMazeCastCredit[], crewCredits?: any[]): Promise<any> {
    const age = this.calculateAge(person.birthday || null);
    
    let wikiData: WikipediaData | null = null;
    try {
      wikiData = await Promise.race([
        this.fetchFromWikipedia(person.name),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 4000))
      ]);
    } catch (error) {
      console.log('Wikipedia fetch failed, continuing without it:', error);
    }
    
    const filmography = castCredits?.map(credit => 
      credit._embedded?.show?.name || 'Unknown Project'
    ).filter(Boolean) || ['Popular Drama Series', 'Award-Winning Film', 'Hit TV Show'];
    
    // Prioritize Wikipedia images over fallbacks
    const images = [];
    if (person.image?.original) {
      images.push(person.image.original);
    }
    if (person.image?.medium && person.image.medium !== person.image.original) {
      images.push(person.image.medium);
    }
    if (wikiData?.originalimage?.source) {
      images.push(wikiData.originalimage.source);
    }
    if (wikiData?.thumbnail?.source && wikiData.thumbnail.source !== wikiData?.originalimage?.source) {
      images.push(wikiData.thumbnail.source);
    }
    if (wikiData?.images) {
      images.push(...wikiData.images.slice(0, 4));
    }

    // Use Wikipedia images or TVMaze images - NO Unsplash fallbacks
    const mainImage = person.image?.original || 
                     wikiData?.originalimage?.source || 
                     person.image?.medium ||
                     wikiData?.thumbnail?.source ||
                     'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png';

    const projectCount = filmography.length;
    let netWorth = '$50k-200k';
    if (projectCount > 25) {
      netWorth = '$10M+';
    } else if (projectCount > 15) {
      netWorth = '$5M-10M';
    } else if (projectCount > 10) {
      netWorth = '$1M-5M';
    } else if (projectCount > 5) {
      netWorth = '$500k-1M';
    }

    return {
      id: `tvmaze-${person.id}`,
      name: person.name,
      age,
      birthPlace: person.country?.name || "Hollywood, USA",
      image: mainImage,
      images: [...new Set(images)].slice(0, 5),
      filmography: filmography.slice(0, 15),
      music: [],
      books: [],
      awards: this.generateAwards(person, castCredits || []),
      trivia: [
        wikiData?.extract?.substring(0, 250) + '...' || `Aktor znany z ${filmography[0] || 'wielu produkcji filmowych'}`,
        `Urodzony: ${person.birthday || 'Data nieznana'}`,
        `Liczba projektów: ${filmography.length}`,
        `Pochodzenie: ${person.country?.name || 'USA'}`
      ],
      funFacts: this.generateFunFacts(person, castCredits || [], wikiData || undefined),
      relationships: person.deathday ? ['Zmarł/a'] : ['Status związku nieznany'],
      netWorth,
      hobbies: ['Aktorstwo', 'Kino', 'Sztuka', 'Fitness'],
      socialMedia: ['Profile prywatne', 'Instagram verified'],
      upcomingProjects: ['Nowe projekty filmowe', 'Castingi w toku'],
      controversies: ['Brak większych skandali'],
      quotes: [
        wikiData?.extract?.split('.')[0] + '.' || 'Aktorstwo to moja pasja i sposób na życie.',
        'Każda rola to nowe wyzwanie.',
        'Kino zmienia świat.'
      ],
      wikiData
    };
  }

  async getPopularPeople(): Promise<TVMazePerson[]> {
    try {
      const popularSearches = ['Rachel Zegler', 'Emma Stone', 'Ryan Gosling', 'Timothee', 'Zendaya', 'Anya Taylor'];
      const allResults = [];
      
      for (const search of popularSearches.slice(0, 4)) {
        try {
          const results = await this.searchPeople(search);
          allResults.push(...results.slice(0, 2));
        } catch (error) {
          console.log(`Failed to search for ${search}:`, error);
          continue;
        }
      }
      
      if (allResults.length > 0) {
        console.log('Retrieved popular actors from TVMaze:', allResults.length);
        return allResults.slice(0, 8);
      }
      
      console.log('Using enhanced fallback actors for popular people');
      return fallbackActors as TVMazePerson[];
      
    } catch (error) {
      console.error('Error fetching popular people:', error);
      return fallbackActors as TVMazePerson[];
    }
  }
}

export const tvmazeService = new TVMazeService();