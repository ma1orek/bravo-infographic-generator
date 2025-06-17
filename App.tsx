import { useState, useRef, useCallback, useEffect } from "react";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { actors, Actor } from "./data/actors";
import { tvmazeService, TVMazePerson } from "./services/tvmaze";
import { thetvdbService, TheTVDBPerson } from "./services/thetvdb";
import { colorSchemes, ColorScheme, DraggableElement, stickerEmojis } from "./types/themes";
import { BravoHeader } from "./components/BravoHeader";
import { ActorList } from "./components/ActorList";
import { BravoInfographic } from "./components/BravoInfographic";
import { EditPanel } from "./components/EditPanel";

// 8 Predefined layouts with proper spacing to prevent overlapping
const PREDEFINED_LAYOUTS = [
  // Layout 1: Classic BRAVO style - well spaced
  {
    'fun-facts': { x: -120, y: -60 },
    'awards': { x: 120, y: -60 },
    'movies': { x: -120, y: 20 },
    'personal': { x: 120, y: 20 },
    'photo-gallery': { x: -120, y: 100 },
    'social-media': { x: -120, y: 160 },
    'quote': { x: 120, y: 160 }
  },
  // Layout 2: Asymmetric creative - diagonal spread
  {
    'fun-facts': { x: 130, y: -80 },
    'awards': { x: -130, y: -40 },
    'movies': { x: 100, y: 0 },
    'personal': { x: -100, y: 40 },
    'photo-gallery': { x: 80, y: 80 },
    'social-media': { x: 130, y: 140 },
    'quote': { x: -120, y: 160 }
  },
  // Layout 3: Balanced magazine - symmetrical
  {
    'fun-facts': { x: -110, y: -40 },
    'awards': { x: 110, y: -80 },
    'movies': { x: -90, y: 40 },
    'personal': { x: 90, y: 0 },
    'photo-gallery': { x: 0, y: 120 },
    'social-media': { x: -110, y: 160 },
    'quote': { x: 110, y: 160 }
  },
  // Layout 4: Dynamic diagonal - scattered
  {
    'fun-facts': { x: -140, y: -60 },
    'awards': { x: 140, y: -100 },
    'movies': { x: 120, y: -20 },
    'personal': { x: -120, y: 20 },
    'photo-gallery': { x: -80, y: 100 },
    'social-media': { x: 80, y: 140 },
    'quote': { x: 0, y: 160 }
  },
  // Layout 5: Vertical flow - column style
  {
    'fun-facts': { x: -80, y: -80 },
    'awards': { x: 80, y: -80 },
    'movies': { x: -80, y: -20 },
    'personal': { x: 80, y: -20 },
    'photo-gallery': { x: -80, y: 60 },
    'social-media': { x: 80, y: 120 },
    'quote': { x: 0, y: 160 }
  },
  // Layout 6: Clustered left - grouped arrangement
  {
    'fun-facts': { x: -130, y: -80 },
    'awards': { x: -90, y: -120 },
    'movies': { x: -110, y: -20 },
    'personal': { x: 100, y: -40 },
    'photo-gallery': { x: 120, y: 20 },
    'social-media': { x: -80, y: 140 },
    'quote': { x: 90, y: 160 }
  },
  // Layout 7: Clustered right - mirrored grouping
  {
    'fun-facts': { x: 100, y: -120 },
    'awards': { x: 130, y: -80 },
    'movies': { x: 110, y: -20 },
    'personal': { x: -100, y: -40 },
    'photo-gallery': { x: -120, y: 20 },
    'social-media': { x: 90, y: 140 },
    'quote': { x: -80, y: 160 }
  },
  // Layout 8: Scattered balanced - random but balanced
  {
    'fun-facts': { x: -60, y: -100 },
    'awards': { x: 60, y: -60 },
    'movies': { x: -100, y: 0 },
    'personal': { x: 100, y: 40 },
    'photo-gallery': { x: 40, y: 100 },
    'social-media': { x: -90, y: 160 },
    'quote': { x: 90, y: 160 }
  }
];

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedActor, setSelectedActor] = useState<Actor | null>(null);
  const [editableTexts, setEditableTexts] = useState<Record<string, string>>({});
  const [currentColorScheme, setCurrentColorScheme] = useState<ColorScheme>(colorSchemes[0]);
  const [draggableElements, setDraggableElements] = useState<Record<string, DraggableElement>>({});
  const [tvmazeResults, setTvmazeResults] = useState<TVMazePerson[]>([]);
  const [tvdbResults, setTvdbResults] = useState<TheTVDBPerson[]>([]);
  const [isSearchingAPIs, setIsSearchingAPIs] = useState(false);
  const [stickers, setStickers] = useState<Array<{id: string, emoji: string, x: number, y: number}>>([]);
  const [isLoadingPopular, setIsLoadingPopular] = useState(false);
  const [apiStatus, setApiStatus] = useState<{
    tvmaze: 'online' | 'offline' | 'unknown';
    tvdb: 'online' | 'offline' | 'unknown';
  }>({ tvmaze: 'unknown', tvdb: 'unknown' });
  const [currentLayoutIndex, setCurrentLayoutIndex] = useState(0);
  
  const infographicRef = useRef<HTMLDivElement>(null);
  const [allActors, setAllActors] = useState<Actor[]>(actors);

  // Load popular actors from all sources on mount
  useEffect(() => {
    const loadPopularActors = async () => {
      setIsLoadingPopular(true);
      const popularActors = [];
      
      try {
        // Load from TVMaze
        try {
          console.log('Loading popular actors from TVMaze...');
          const tvmazePopular = await tvmazeService.getPopularPeople();
          if (tvmazePopular.length > 0) {
            const tvmazeActors = await Promise.all(
              tvmazePopular.slice(0, 4).map(async (person) => {
                try {
                  const castCredits = await tvmazeService.getPersonCastCredits(person.id);
                  return await tvmazeService.transformToActor(person, castCredits);
                } catch (error) {
                  console.error(`Error loading TVMaze details for ${person.name}:`, error);
                  return await tvmazeService.transformToActor(person);
                }
              })
            );
            popularActors.push(...tvmazeActors);
            setApiStatus(prev => ({ ...prev, tvmaze: 'online' }));
            console.log('TVMaze loaded successfully:', tvmazeActors.length, 'actors');
          } else {
            setApiStatus(prev => ({ ...prev, tvmaze: 'offline' }));
          }
        } catch (error) {
          console.error('TVMaze popular loading failed:', error);
          setApiStatus(prev => ({ ...prev, tvmaze: 'offline' }));
        }

        // Load from TheTVDB (with better error handling)
        try {
          console.log('Loading popular actors from TheTVDB...');
          const tvdbPopular = await thetvdbService.getPopularPeople();
          if (tvdbPopular.length > 0) {
            const tvdbActors = await Promise.all(
              tvdbPopular.slice(0, 4).map(async (person) => {
                try {
                  const credits = await thetvdbService.getPersonCredits(person.id);
                  return await thetvdbService.transformToActor(person, credits);
                } catch (error) {
                  console.error(`Error loading TheTVDB details for ${person.name}:`, error);
                  return await thetvdbService.transformToActor(person);
                }
              })
            );
            popularActors.push(...tvdbActors);
            setApiStatus(prev => ({ ...prev, tvdb: 'online' }));
            console.log('TheTVDB loaded successfully:', tvdbActors.length, 'actors');
          } else {
            setApiStatus(prev => ({ ...prev, tvdb: 'offline' }));
          }
        } catch (error) {
          console.error('TheTVDB popular loading failed:', error);
          setApiStatus(prev => ({ ...prev, tvdb: 'offline' }));
          // Don't let TheTVDB failures break the app
          console.log('Continuing without TheTVDB data...');
        }

        if (popularActors.length > 0) {
          console.log('Loaded total popular actors:', popularActors.length);
          setAllActors([...popularActors, ...actors]);
        }
        
      } catch (error) {
        console.error('Error loading popular actors:', error);
        setApiStatus({ tvmaze: 'offline', tvdb: 'offline' });
      } finally {
        setIsLoadingPopular(false);
      }
    };

    loadPopularActors();
  }, []);

  const filteredActors = allActors.filter(actor =>
    actor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = useCallback(async (term: string) => {
    setSearchTerm(term);
    
    if (term.length > 2) {
      setIsSearchingAPIs(true);
      const newActors = [];
      
      try {
        // Search TVMaze (primary)
        try {
          console.log('Searching TVMaze for:', term);
          const tvmazeResults = await tvmazeService.searchPeople(term);
          setTvmazeResults(tvmazeResults);
          
          if (tvmazeResults.length > 0) {
            const tvmazeActors = await Promise.all(
              tvmazeResults.slice(0, 6).map(async (person) => {
                try {
                  const castCredits = await tvmazeService.getPersonCastCredits(person.id);
                  return await tvmazeService.transformToActor(person, castCredits);
                } catch (error) {
                  console.error(`Error loading TVMaze details for ${person.name}:`, error);
                  return await tvmazeService.transformToActor(person);
                }
              })
            );
            newActors.push(...tvmazeActors);
            setApiStatus(prev => ({ ...prev, tvmaze: 'online' }));
            console.log('TVMaze search successful:', tvmazeActors.length, 'results');
          }
        } catch (error) {
          console.error('TVMaze search failed:', error);
          setApiStatus(prev => ({ ...prev, tvmaze: 'offline' }));
        }

        // Search TheTVDB (secondary, don't let it break the app)
        try {
          console.log('Searching TheTVDB for:', term);
          const tvdbResults = await thetvdbService.searchPeople(term);
          setTvdbResults(tvdbResults);
          
          if (tvdbResults.length > 0) {
            const tvdbActors = await Promise.all(
              tvdbResults.slice(0, 4).map(async (person) => {
                try {
                  const credits = await thetvdbService.getPersonCredits(person.id);
                  return await thetvdbService.transformToActor(person, credits);
                } catch (error) {
                  console.error(`Error loading TheTVDB details for ${person.name}:`, error);
                  return await thetvdbService.transformToActor(person);
                }
              })
            );
            newActors.push(...tvdbActors);
            setApiStatus(prev => ({ ...prev, tvdb: 'online' }));
            console.log('TheTVDB search successful:', tvdbActors.length, 'results');
          }
        } catch (error) {
          console.error('TheTVDB search failed:', error);
          setApiStatus(prev => ({ ...prev, tvdb: 'offline' }));
          // Continue without TheTVDB results - don't break the app
          console.log('Continuing search without TheTVDB...');
        }

        // Merge with existing actors, avoiding duplicates
        if (newActors.length > 0) {
          const existingIds = new Set(actors.map(a => a.id));
          const uniqueNewActors = newActors.filter(actor => !existingIds.has(actor.id));
          setAllActors([...actors, ...uniqueNewActors]);
          console.log('Added', uniqueNewActors.length, 'new unique actors');
        }
        
      } catch (error) {
        console.error('Error searching APIs:', error);
        setApiStatus({ tvmaze: 'offline', tvdb: 'offline' });
        if (navigator.onLine) {
          // Don't show alert, just log - let user continue with offline data
          console.log('APIs temporarily unavailable, using offline data');
        }
      } finally {
        setIsSearchingAPIs(false);
      }
    } else {
      setTvmazeResults([]);
      setTvdbResults([]);
      // Reset to original actors + any previously loaded popular actors
      const popularActors = allActors.filter(actor => 
        actor.id.startsWith('tvmaze-') || actor.id.startsWith('tvdb-')
      );
      setAllActors([...popularActors, ...actors]);
    }
  }, [allActors]);

  const handleTextEdit = (key: string, value: string) => {
    setEditableTexts(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleElementDrag = (elementId: string, x: number, y: number) => {
    setDraggableElements(prev => ({
      ...prev,
      [elementId]: {
        id: elementId,
        position: { x, y },
        zIndex: prev[elementId]?.zIndex || 1
      }
    }));
  };

  const handleColorSchemeChange = (scheme: ColorScheme) => {
    setCurrentColorScheme(scheme);
  };

  const handleRandomColors = () => {
    const randomScheme = colorSchemes[Math.floor(Math.random() * colorSchemes.length)];
    setCurrentColorScheme(randomScheme);
  };

  const handleAddSticker = () => {
    const randomEmoji = stickerEmojis[Math.floor(Math.random() * stickerEmojis.length)];
    const newSticker = {
      id: `sticker-${Date.now()}`,
      emoji: randomEmoji,
      x: Math.random() * 300 + 50,
      y: Math.random() * 400 + 100
    };
    setStickers(prev => [...prev, newSticker]);
  };

  const handleShuffleLayout = () => {
    // Use predefined layouts instead of random
    const nextLayoutIndex = (currentLayoutIndex + 1) % PREDEFINED_LAYOUTS.length;
    const selectedLayout = PREDEFINED_LAYOUTS[nextLayoutIndex];
    
    const newPositions: Record<string, DraggableElement> = {};
    
    Object.entries(selectedLayout).forEach(([elementId, position]) => {
      newPositions[elementId] = {
        id: elementId,
        position,
        zIndex: Math.floor(Math.random() * 5) + 1
      };
    });
    
    setDraggableElements(newPositions);
    setCurrentLayoutIndex(nextLayoutIndex);
    
    // Also shuffle stickers within bounds
    setStickers(prev => prev.map(sticker => ({
      ...sticker,
      x: Math.random() * 300 + 50,
      y: Math.random() * 400 + 100
    })));
  };

  const handleReset = () => {
    setEditableTexts({});
    setDraggableElements({});
    setStickers([]);
    setCurrentColorScheme(colorSchemes[0]);
    setCurrentLayoutIndex(0);
  };

  const handleExportPdf = async () => {
    if (!infographicRef.current || !selectedActor) return;
    
    const showToast = (message: string, type: 'loading' | 'success' | 'error') => {
      const existingToast = document.getElementById('export-toast');
      if (existingToast) existingToast.remove();
      
      const toast = document.createElement('div');
      toast.id = 'export-toast';
      toast.textContent = message;
      toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        font-weight: bold;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transition: all 0.3s ease;
        background: ${type === 'loading' ? 'linear-gradient(45deg, #3b82f6, #8b5cf6)' : 
                    type === 'success' ? 'linear-gradient(45deg, #10b981, #059669)' : 
                    'linear-gradient(45deg, #ef4444, #dc2626)'};
        color: white;
      `;
      document.body.appendChild(toast);
      
      if (type !== 'loading') {
        setTimeout(() => {
          if (document.getElementById('export-toast')) {
            document.body.removeChild(toast);
          }
        }, 4000);
      }
      
      return toast;
    };
    
    showToast('📄 Generuję PDF...', 'loading');
    
    try {
      // Add export-ready class for compatibility
      infographicRef.current.classList.add('export-ready');
      
      // Wait for styles to apply and images to load
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dynamic imports
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf')
      ]);
      
      const canvas = await html2canvas(infographicRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: infographicRef.current.offsetWidth,
        height: infographicRef.current.offsetHeight,
        imageTimeout: 30000,
        onclone: (clonedDoc) => {
          // Remove any problematic styles in the clone
          const clonedElement = clonedDoc.querySelector('.export-ready');
          if (clonedElement) {
            (clonedElement as HTMLElement).style.transform = 'none';
            (clonedElement as HTMLElement).style.position = 'relative';
            
            // Fix any remaining problematic CSS
            const allElements = clonedElement.querySelectorAll('*');
            allElements.forEach(el => {
              const element = el as HTMLElement;
              if (element.style.color && element.style.color.includes('oklch')) {
                element.style.color = '#000000';
              }
              if (element.style.backgroundColor && element.style.backgroundColor.includes('oklch')) {
                element.style.backgroundColor = '#ffffff';
              }
            });
          }
        }
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.92);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Calculate dimensions to fit A4 properly
      const pdfWidth = 210;
      const pdfHeight = 297;
      const canvasAspect = canvas.width / canvas.height;
      const a4Aspect = pdfWidth / pdfHeight;
      
      let imgWidth, imgHeight, xOffset, yOffset;
      
      if (canvasAspect > a4Aspect) {
        imgWidth = pdfWidth;
        imgHeight = pdfWidth / canvasAspect;
        xOffset = 0;
        yOffset = (pdfHeight - imgHeight) / 2;
      } else {
        imgHeight = pdfHeight;
        imgWidth = pdfHeight * canvasAspect;
        yOffset = 0;
        xOffset = (pdfWidth - imgWidth) / 2;
      }
      
      pdf.addImage(imgData, 'JPEG', xOffset, yOffset, imgWidth, imgHeight);
      pdf.save(`bravo-${selectedActor.name.replace(/\s+/g, '-').toLowerCase()}-infographic.pdf`);
      
      showToast('✅ PDF wygenerowany pomyślnie!', 'success');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      showToast('❌ Błąd podczas generowania PDF', 'error');
      
      setTimeout(() => {
        alert(`Wystąpił błąd podczas generowania PDF:\n${error instanceof Error ? error.message : 'Nieznany błąd'}\n\nSpróbuj ponownie za chwilę.`);
      }, 1000);
    } finally {
      infographicRef.current?.classList.remove('export-ready');
    }
  };

  const handleExportPng = async () => {
    if (!infographicRef.current || !selectedActor) return;
    
    const showToast = (message: string, type: 'loading' | 'success' | 'error') => {
      const existingToast = document.getElementById('export-toast');
      if (existingToast) existingToast.remove();
      
      const toast = document.createElement('div');
      toast.id = 'export-toast';
      toast.textContent = message;
      toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        font-weight: bold;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transition: all 0.3s ease;
        background: ${type === 'loading' ? 'linear-gradient(45deg, #8b5cf6, #a855f7)' : 
                    type === 'success' ? 'linear-gradient(45deg, #10b981, #059669)' : 
                    'linear-gradient(45deg, #ef4444, #dc2626)'};
        color: white;
      `;
      document.body.appendChild(toast);
      
      if (type !== 'loading') {
        setTimeout(() => {
          if (document.getElementById('export-toast')) {
            document.body.removeChild(toast);
          }
        }, 4000);
      }
      
      return toast;
    };
    
    showToast('🖼️ Generuję PNG...', 'loading');
    
    try {
      infographicRef.current.classList.add('export-ready');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { default: html2canvas } = await import('html2canvas');
      
      const canvas = await html2canvas(infographicRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: infographicRef.current.offsetWidth,
        height: infographicRef.current.offsetHeight,
        imageTimeout: 30000,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector('.export-ready');
          if (clonedElement) {
            (clonedElement as HTMLElement).style.transform = 'none';
            (clonedElement as HTMLElement).style.position = 'relative';
            
            // Fix any oklch colors
            const allElements = clonedElement.querySelectorAll('*');
            allElements.forEach(el => {
              const element = el as HTMLElement;
              if (element.style.color && element.style.color.includes('oklch')) {
                element.style.color = '#000000';
              }
              if (element.style.backgroundColor && element.style.backgroundColor.includes('oklch')) {
                element.style.backgroundColor = '#ffffff';
              }
            });
          }
        }
      });
      
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `bravo-${selectedActor.name.replace(/\s+/g, '-').toLowerCase()}-infographic.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          showToast('✅ PNG wygenerowany pomyślnie!', 'success');
        } else {
          throw new Error('Failed to create blob from canvas');
        }
      }, 'image/png', 1.0);
      
    } catch (error) {
      console.error('Error generating PNG:', error);
      showToast('❌ Błąd podczas generowania PNG', 'error');
      
      setTimeout(() => {
        alert(`Wystąpił błąd podczas generowania PNG:\n${error instanceof Error ? error.message : 'Nieznany błąd'}\n\nSpróbuj ponownie za chwilę.`);
      }, 1000);
    } finally {
      infographicRef.current?.classList.remove('export-ready');
    }
  };

  // Calculate overall API status
  const overallApiStatus = apiStatus.tvmaze === 'online' || apiStatus.tvdb === 'online' ? 'online' : 
                          apiStatus.tvmaze === 'offline' && apiStatus.tvdb === 'offline' ? 'offline' : 'unknown';

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 via-blue-50 to-pink-50">
        <BravoHeader />
        
        <div className="flex-1 flex overflow-hidden">
          {/* Left sidebar - Actor selection with integrated search */}
          <div className="w-80 border-r-4 border-pink-400">
            <ActorList
              actors={filteredActors}
              selectedActor={selectedActor}
              onActorSelect={setSelectedActor}
              tvmazeResults={tvmazeResults}
              isSearchingTVMaze={isSearchingAPIs}
              isLoadingPopular={isLoadingPopular}
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
            />
          </div>

          {/* Main content area */}
          <div className="flex-1 flex">
            {/* Infographic canvas */}
            <div className="flex-1 p-8 bg-gradient-to-br from-gray-100 via-blue-50 to-purple-50 flex items-center justify-center overflow-auto">
              {selectedActor ? (
                <div 
                  ref={infographicRef}
                  className="w-full max-w-2xl mx-auto shadow-2xl relative bg-white rounded-lg overflow-hidden"
                  style={{ aspectRatio: '210/297' }}
                >
                  <BravoInfographic
                    actor={selectedActor}
                    editableTexts={editableTexts}
                    onTextEdit={handleTextEdit}
                    colorScheme={currentColorScheme}
                    draggableElements={draggableElements}
                    onElementDrag={handleElementDrag}
                    stickers={stickers}
                    onStickerMove={(id, x, y) => {
                      setStickers(prev => prev.map(s => 
                        s.id === id ? {...s, x, y} : s
                      ));
                    }}
                  />
                </div>
              ) : (
                <div className="text-center p-8">
                  <h2 className="text-4xl font-black text-gray-400 mb-6">
                    WYBIERZ AKTORA!
                  </h2>
                  <p className="text-xl text-gray-500 mb-6">
                    Użyj wyszukiwarki po lewej stronie aby znaleźć aktora
                  </p>
                  <p className="text-lg text-gray-500 mb-4">
                    lub kliknij na jedną z dostępnych gwiazd
                  </p>
                  
                  {/* Enhanced API Status indicator */}
                  <div className="mb-4 space-y-2">
                    {overallApiStatus === 'online' && (
                      <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-bold inline-block">
                        🟢 Multi-API Online - {apiStatus.tvmaze === 'online' ? 'TVMaze' : ''} {apiStatus.tvdb === 'online' ? 'TheTVDB' : ''} + Wikipedia
                      </div>
                    )}
                    {overallApiStatus === 'offline' && (
                      <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg text-sm font-bold inline-block">
                        🟡 Tryb Offline - Podstawowe dane + Rachel Zegler
                      </div>
                    )}
                    
                    {/* Individual API status */}
                    <div className="flex justify-center space-x-2 text-xs">
                      <span className={`px-2 py-1 rounded-full font-bold ${
                        apiStatus.tvmaze === 'online' ? 'bg-green-500 text-white' : 
                        apiStatus.tvmaze === 'offline' ? 'bg-red-500 text-white' : 'bg-gray-500 text-white'
                      }`}>
                        TVMaze: {apiStatus.tvmaze}
                      </span>
                      <span className={`px-2 py-1 rounded-full font-bold ${
                        apiStatus.tvdb === 'online' ? 'bg-green-500 text-white' : 
                        apiStatus.tvdb === 'offline' ? 'bg-red-500 text-white' : 'bg-gray-500 text-white'
                      }`}>
                        TheTVDB: {apiStatus.tvdb}
                      </span>
                    </div>
                  </div>
                  
                  {isSearchingAPIs && (
                    <p className="text-blue-500 animate-pulse mb-2 text-lg">
                      🔍 Szukam w dostępnych bazach danych...
                    </p>
                  )}
                  {isLoadingPopular && (
                    <p className="text-green-500 animate-pulse mb-2 text-lg">
                      📺 Ładuję popularne gwiazdy...
                    </p>
                  )}
                  <div className="mt-12 text-8xl opacity-20">
                    <span className="text-red-500">B</span>
                    <span className="text-blue-500">R</span>
                    <span className="text-green-500">A</span>
                    <span className="text-yellow-500">V</span>
                    <span className="text-purple-500">O</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-6">
                    🎬 Powered by TVMaze + TheTVDB + Wikipedia • Comprehensive celebrity database
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    ⭐ Featured: Rachel Zegler with complete Wikipedia data!
                  </p>
                </div>
              )}
            </div>

            {/* Right sidebar - Edit panel */}
            {selectedActor && (
              <div className="w-80 border-l-4 border-orange-400">
                <EditPanel
                  onExportPdf={handleExportPdf}
                  onExportPng={handleExportPng}
                  colorSchemes={colorSchemes}
                  currentColorScheme={currentColorScheme}
                  onColorSchemeChange={handleColorSchemeChange}
                  onRandomColors={handleRandomColors}
                  onAddSticker={handleAddSticker}
                  onShuffleLayout={handleShuffleLayout}
                  onReset={handleReset}
                  actorCount={allActors.length}
                  currentLayout={currentLayoutIndex + 1}
                  totalLayouts={PREDEFINED_LAYOUTS.length}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}