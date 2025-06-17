import { useState } from "react";
import { Actor } from "../data/actors";
import { TVMazePerson } from "../services/tvmaze";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Loader2, Star, TrendingUp, Globe, Search, Film } from "lucide-react";
import { Input } from "./ui/input";

interface ActorListProps {
  actors: Actor[];
  selectedActor: Actor | null;
  onActorSelect: (actor: Actor) => void;
  tvmazeResults?: TVMazePerson[];
  isSearchingTVMaze?: boolean;
  isLoadingPopular?: boolean;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export function ActorList({ 
  actors, 
  selectedActor, 
  onActorSelect, 
  tvmazeResults, 
  isSearchingTVMaze,
  isLoadingPopular,
  searchTerm,
  onSearchChange
}: ActorListProps) {
  return (
    <div className="bg-gradient-to-b from-blue-100 via-purple-100 to-pink-100 p-4 h-full overflow-y-auto">
      <h3 className="text-xl font-black text-purple-800 mb-4 text-center">
        🎬 WYBIERZ AKTORA! ⭐
      </h3>
      
      {/* Modern Search Bar */}
      <div className="mb-6">
        <div className="relative">
          {isSearchingTVMaze ? (
            <Loader2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5 animate-spin" />
          ) : (
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          )}
          <Input
            type="text"
            placeholder="Wyszukaj aktora..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-12 pr-4 py-3 w-full bg-gradient-to-r from-white to-blue-50 border-3 border-blue-400 rounded-2xl text-purple-800 font-black placeholder:text-gray-500 placeholder:font-medium focus:border-pink-500 focus:ring-4 focus:ring-pink-200 transition-all shadow-lg"
          />
          {searchTerm.length > 2 && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-black flex items-center">
              <Film className="w-3 h-3 mr-1" />
              LIVE
            </div>
          )}
        </div>
        
        {/* Search Status */}
        {searchTerm.length > 0 && (
          <div className="mt-2 text-center">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-purple-800 px-4 py-2 rounded-lg text-sm font-black shadow-lg inline-block">
              {isSearchingTVMaze ? '🔍 Szukam...' : `🎬 Znaleziono: ${actors.length} aktorów`}
            </div>
          </div>
        )}
      </div>
      
      {/* Loading states */}
      {isSearchingTVMaze && (
        <div className="flex items-center justify-center p-4 mb-4 bg-blue-100 rounded-xl border-3 border-blue-400 shadow-lg">
          <Loader2 className="w-4 h-4 animate-spin text-blue-600 mr-2" />
          <span className="text-blue-800 font-black text-sm">Szukam w TVMaze + Wikipedia...</span>
        </div>
      )}

      {isLoadingPopular && (
        <div className="flex items-center justify-center p-4 mb-4 bg-purple-100 rounded-xl border-3 border-purple-400 shadow-lg">
          <TrendingUp className="w-4 h-4 text-purple-600 mr-2" />
          <span className="text-purple-800 font-black text-sm">Ładuję popularne gwiazdy...</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-3">
        {actors.map((actor) => (
          <button
            key={actor.id}
            onClick={() => onActorSelect(actor)}
            className={`
              relative overflow-hidden rounded-xl border-4 transition-all duration-300 hover:scale-105 bravo-shake group
              ${selectedActor?.id === actor.id 
                ? 'border-pink-500 bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 shadow-2xl ring-4 ring-pink-300' 
                : 'border-yellow-400 bg-gradient-to-br from-white via-yellow-50 to-orange-50 hover:border-pink-400 shadow-lg hover:shadow-xl'
              }
            `}
          >
            <div className="flex items-center space-x-3 p-3">
              <div className="relative w-16 h-20 rounded-xl overflow-hidden border-3 border-yellow-300 shadow-lg group-hover:border-pink-300 transition-colors">
                <ImageWithFallback
                  src={actor.image}
                  alt={actor.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-black text-purple-800 leading-tight">{actor.name}</h4>
                <p className="text-xs text-gray-600 mt-1 font-medium">
                  {actor.age} lat • {actor.birthPlace}
                </p>
                <p className="text-xs text-pink-600 mt-1 font-black leading-tight">
                  {actor.filmography.slice(0, 2).join(" • ")}
                </p>
                <div className="flex items-center mt-2 space-x-1 flex-wrap gap-1">
                  <span className="text-xs bg-gradient-to-r from-yellow-300 to-orange-300 text-purple-800 px-2 py-0.5 rounded-full font-black shadow-sm">
                    🎬 {actor.filmography.length} filmów
                  </span>
                  {actor.music.length > 0 && (
                    <span className="text-xs bg-gradient-to-r from-pink-300 to-red-300 text-purple-800 px-2 py-0.5 rounded-full font-black shadow-sm">
                      🎵 Muzyka
                    </span>
                  )}
                  {actor.id.startsWith('tvmaze-') && (
                    <span className="text-xs bg-gradient-to-r from-blue-300 to-cyan-300 text-blue-800 px-2 py-0.5 rounded-full font-black flex items-center shadow-sm">
                      <Film className="w-2 h-2 mr-1" />
                      LIVE
                    </span>
                  )}
                  {actor.images && actor.images.length > 1 && (
                    <span className="text-xs bg-gradient-to-r from-green-300 to-emerald-300 text-green-800 px-2 py-0.5 rounded-full font-black shadow-sm">
                      🖼️ {actor.images.length} zdjęć
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Selection indicator */}
            {selectedActor?.id === actor.id && (
              <div className="absolute top-2 right-2 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs px-3 py-1 rounded-full font-black animate-bounce shadow-lg">
                ⭐ WYBRANY!
              </div>
            )}
            
            {/* Net worth indicator */}
            <div className="absolute bottom-2 right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2 py-1 rounded-full font-black shadow-lg">
              💰 {actor.netWorth}
            </div>

            {/* Popular/Trending indicator for TVMaze actors */}
            {actor.id.startsWith('tvmaze-') && actors.indexOf(actor) < 5 && (
              <div className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-1 rounded-full font-black flex items-center shadow-lg">
                <Star className="w-2 h-2 mr-1" />
                HOT
              </div>
            )}

            {/* Wikipedia indicator */}
            {actor.wikiData && (
              <div className="absolute bottom-2 left-2 bg-gradient-to-r from-orange-600 to-yellow-600 text-white text-xs px-2 py-1 rounded-full font-black flex items-center shadow-lg">
                <Globe className="w-2 h-2 mr-1" />
                WIKI
              </div>
            )}

            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 to-purple-500/0 group-hover:from-pink-500/10 group-hover:to-purple-500/10 transition-all duration-300 rounded-xl"></div>
          </button>
        ))}
      </div>
      
      {/* Enhanced bottom stats */}
      <div className="mt-6 text-center space-y-3">
        <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white rounded-xl p-4 shadow-xl">
          <p className="font-black text-lg">🎬 {actors.length} AKTORÓW W BAZIE!</p>
          <div className="flex items-center justify-center mt-2 space-x-3">
            <div className="flex items-center bg-white/20 rounded-full px-3 py-1">
              <Film className="w-3 h-3 mr-1" />
              <span className="text-xs font-black">TVMaze</span>
            </div>
            <div className="flex items-center bg-white/20 rounded-full px-3 py-1">
              <Globe className="w-3 h-3 mr-1" />
              <span className="text-xs font-black">Wikipedia</span>
            </div>
            <div className="flex items-center bg-white/20 rounded-full px-3 py-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span className="text-xs font-black">LIVE</span>
            </div>
          </div>
        </div>
        
        {/* Search tip */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-purple-800 rounded-lg p-3 shadow-lg">
          <p className="text-xs font-black">
            💡 TIP: Wyszukaj dowolnego aktora - dane z TVMaze + Wikipedia!
          </p>
        </div>
      </div>
    </div>
  );
}