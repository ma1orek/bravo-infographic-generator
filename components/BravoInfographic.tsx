import { useDrag, useDrop } from 'react-dnd';
import { Actor } from "../data/actors";
import { ColorScheme, DraggableElement } from "../types/themes";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Star, Music, BookOpen, Zap, Heart, Award, DollarSign, Calendar, Tv, Globe } from "lucide-react";

interface BravoInfographicProps {
  actor: Actor;
  editableTexts: Record<string, string>;
  onTextEdit: (key: string, value: string) => void;
  colorScheme: ColorScheme;
  draggableElements: Record<string, DraggableElement>;
  onElementDrag: (elementId: string, x: number, y: number) => void;
  stickers: Array<{id: string, emoji: string, x: number, y: number}>;
  onStickerMove: (id: string, x: number, y: number) => void;
}

// Fixed positioning system - elements stay in their designated zones
const getElementPosition = (elementId: string, draggableElements: Record<string, DraggableElement>) => {
  const element = draggableElements[elementId];
  if (element?.position) {
    // Constrain to safe zones
    const x = Math.max(-150, Math.min(150, element.position.x));
    const y = Math.max(-200, Math.min(200, element.position.y));
    return { x, y };
  }
  
  // Default positions that don't overlap
  const defaultPositions: Record<string, { x: number; y: number }> = {
    'top-banner': { x: 0, y: -180 },
    'celebrity-name': { x: 0, y: -140 },
    'fun-facts': { x: -120, y: -60 },
    'awards': { x: 120, y: -60 },
    'movies': { x: -120, y: 20 },
    'personal': { x: 120, y: 20 },
    'photo-gallery': { x: -120, y: 100 },
    'social-media': { x: -120, y: 160 },
    'quote': { x: 120, y: 160 }
  };
  
  return defaultPositions[elementId] || { x: 0, y: 0 };
};

const DraggableBox = ({ 
  id, 
  children, 
  className = "", 
  position, 
  onDrag 
}: { 
  id: string;
  children: React.ReactNode;
  className?: string;
  position: { x: number; y: number };
  onDrag: (x: number, y: number) => void;
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'box',
    item: { id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop(() => ({
    accept: 'box',
    drop: (item: { id: string }, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (delta && item.id === id) {
        // Constrain movement to prevent overlapping
        const newX = Math.max(-150, Math.min(150, position.x + delta.x));
        const newY = Math.max(-200, Math.min(200, position.y + delta.y));
        onDrag(newX, newY);
      }
    },
  }));

  const style = {
    transform: `translate(${position.x}px, ${position.y}px)`,
    position: 'absolute' as const,
    zIndex: isDragging ? 1000 : 10,
  };

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`${className} ${isDragging ? 'opacity-80 cursor-grabbing scale-105' : 'cursor-grab'} transition-all duration-200`}
      style={style}
    >
      {children}
    </div>
  );
};

const DraggableSticker = ({ 
  sticker, 
  onMove 
}: { 
  sticker: {id: string, emoji: string, x: number, y: number};
  onMove: (x: number, y: number) => void;
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'sticker',
    item: { id: sticker.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop(() => ({
    accept: 'sticker',
    drop: (item: { id: string }, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (delta && item.id === sticker.id) {
        // Keep stickers within safe bounds
        const newX = Math.max(10, Math.min(380, sticker.x + delta.x));
        const newY = Math.max(10, Math.min(580, sticker.y + delta.y));
        onMove(newX, newY);
      }
    },
  }));

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`absolute text-4xl cursor-grab select-none hover:scale-125 transition-all duration-300 ${
        isDragging ? 'opacity-60 cursor-grabbing scale-150 z-50' : 'z-30'
      }`}
      style={{
        left: sticker.x,
        top: sticker.y,
        filter: 'drop-shadow(3px 3px 6px rgba(0,0,0,0.6))'
      }}
    >
      {sticker.emoji}
    </div>
  );
};

export function BravoInfographic({ 
  actor, 
  editableTexts, 
  onTextEdit, 
  colorScheme,
  draggableElements,
  onElementDrag,
  stickers,
  onStickerMove
}: BravoInfographicProps) {
  const [, drop] = useDrop(() => ({
    accept: ['box', 'sticker'],
    drop: () => ({ name: 'infographic' }),
  }));

  // Non-draggable text editing
  const EditableText = ({ textKey, defaultText, className = "" }: { textKey: string; defaultText: string; className?: string }) => (
    <div
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => onTextEdit(textKey, e.currentTarget.textContent || defaultText)}
      className={`outline-none cursor-text hover:bg-yellow-200 hover:bg-opacity-50 rounded-lg px-2 py-1 transition-all duration-200 ${className}`}
      dangerouslySetInnerHTML={{ __html: editableTexts[textKey] || defaultText }}
    />
  );

  const getBoxGradient = (index: number) => {
    return colorScheme.gradients.boxes[index % colorScheme.gradients.boxes.length];
  };

  return (
    <div 
      ref={drop}
      className="bg-white w-full h-full relative overflow-hidden shadow-2xl" 
      style={{ aspectRatio: '210/297' }}
    >
      {/* Enhanced full cover background image - FIXED */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src={actor.image}
          alt={actor.name}
          className="w-full h-full object-cover object-center"
          style={{
            minWidth: '100%',
            minHeight: '100%',
            maxWidth: 'none',
            maxHeight: 'none'
          }}
        />
        {/* Enhanced overlay system with no oklch colors */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40"></div>
        {/* Colorful BRAVO overlay - using standard gradients */}
        <div className={`absolute inset-0 bg-gradient-to-br ${colorScheme.gradients.overlay} opacity-70`}></div>
        {/* Additional texture overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/15 via-transparent to-blue-500/15"></div>
      </div>

      {/* Container for all draggable elements */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="relative w-full h-full max-w-lg">
          
          {/* Draggable stickers */}
          {stickers.map((sticker) => (
            <DraggableSticker
              key={sticker.id}
              sticker={sticker}
              onMove={(x, y) => onStickerMove(sticker.id, x, y)}
            />
          ))}

          {/* Top banner */}
          <DraggableBox
            id="top-banner"
            position={getElementPosition('top-banner', draggableElements)}
            onDrag={(x, y) => onElementDrag('top-banner', x, y)}
            className="flex justify-center"
          >
            <div className={`bg-gradient-to-r ${getBoxGradient(0)} text-white px-8 py-3 rounded-full border-4 border-yellow-400 transform rotate-2 shadow-2xl relative overflow-hidden max-w-sm`}>
              <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-white/10"></div>
              <EditableText
                textKey="top-banner"
                defaultText="⭐ EKSKLUZYWNIE W BRAVO! ⭐"
                className="font-black text-base relative z-10 drop-shadow-lg text-center"
              />
            </div>
          </DraggableBox>

          {/* Celebrity name */}
          <DraggableBox
            id="celebrity-name"
            position={getElementPosition('celebrity-name', draggableElements)}
            onDrag={(x, y) => onElementDrag('celebrity-name', x, y)}
            className="flex flex-col items-center"
          >
            <div className="relative max-w-md mx-auto text-center">
              <EditableText
                textKey="celebrity-name"
                defaultText={actor.name.toUpperCase()}
                className="text-4xl md:text-5xl font-black text-white leading-none drop-shadow-2xl relative z-10"
                style={{
                  textShadow: '4px 4px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000',
                  WebkitTextStroke: '2px #000'
                }}
              />
            </div>
            <div className="flex justify-center mt-3 space-x-3">
              <div className={`bg-gradient-to-r ${getBoxGradient(1)} text-white px-4 py-2 rounded-full transform -rotate-3 shadow-xl border-3 border-white/50`}>
                <EditableText
                  textKey="age-info"
                  defaultText={`${actor.age} LAT`}
                  className="font-black text-sm drop-shadow-md"
                />
              </div>
              <div className={`bg-gradient-to-r ${getBoxGradient(2)} text-white px-4 py-2 rounded-full transform rotate-3 shadow-xl border-3 border-white/50`}>
                <EditableText
                  textKey="location"
                  defaultText={actor.birthPlace.split(',')[0]}
                  className="font-black text-sm drop-shadow-md"
                />
              </div>
            </div>
          </DraggableBox>

          {/* Fun facts */}
          <DraggableBox
            id="fun-facts"
            position={getElementPosition('fun-facts', draggableElements)}
            onDrag={(x, y) => onElementDrag('fun-facts', x, y)}
            className=""
          >
            <div className="bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-400 border-4 border-red-500 rounded-2xl p-3 transform -rotate-2 shadow-2xl relative overflow-hidden w-56">
              <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-white/25"></div>
              <div className="relative z-10">
                <h3 className="font-black text-red-600 text-lg mb-3 text-center drop-shadow-lg">🔥 HOT FAKTY!</h3>
                {actor.funFacts.slice(0, 5).map((fact, index) => (
                  <div key={index} className="mb-2 bg-white/40 rounded-lg p-2">
                    <EditableText
                      textKey={`fun-fact-${index}`}
                      defaultText={fact}
                      className="text-sm font-black text-purple-800 leading-tight drop-shadow-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          </DraggableBox>

          {/* Awards */}
          <DraggableBox
            id="awards"
            position={getElementPosition('awards', draggableElements)}
            onDrag={(x, y) => onElementDrag('awards', x, y)}
            className=""
          >
            <div className={`bg-gradient-to-br ${getBoxGradient(3)} border-4 border-yellow-400 rounded-2xl p-3 transform rotate-2 shadow-2xl relative overflow-hidden w-56`}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-white/15"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-3">
                  <Award className="w-6 h-6 text-yellow-300 mr-2 drop-shadow-lg" />
                  <EditableText
                    textKey="awards-title"
                    defaultText="NAGRODY!"
                    className="font-black text-white text-lg drop-shadow-lg"
                  />
                </div>
                {actor.awards.slice(0, 4).map((award, index) => (
                  <div key={index} className="mb-2 bg-white/30 rounded-lg p-2">
                    <EditableText
                      textKey={`award-${index}`}
                      defaultText={`🏆 ${award}`}
                      className="text-sm font-black text-yellow-300 leading-tight drop-shadow-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          </DraggableBox>

          {/* Movies grid */}
          <DraggableBox
            id="movies"
            position={getElementPosition('movies', draggableElements)}
            onDrag={(x, y) => onElementDrag('movies', x, y)}
            className=""
          >
            <div className="bg-gradient-to-br from-blue-400 via-blue-500 to-purple-500 border-4 border-white rounded-2xl p-3 transform -rotate-1 shadow-2xl relative overflow-hidden w-60">
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-white/15"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-3">
                  <Star className="w-6 h-6 text-yellow-300 mr-2 drop-shadow-lg" />
                  <EditableText
                    textKey="movies-title"
                    defaultText="TOP FILMY!"
                    className="font-black text-white text-lg drop-shadow-lg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {actor.filmography.slice(0, 6).map((show, index) => (
                    <div key={index} className="bg-white/90 rounded-lg p-2 shadow-lg hover:scale-105 transition-transform">
                      <EditableText
                        textKey={`movie-${index}`}
                        defaultText={show.length > 15 ? show.substring(0, 15) + '...' : show}
                        className="text-xs font-black text-blue-800 leading-tight text-center"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DraggableBox>

          {/* Personal info */}
          <DraggableBox
            id="personal"
            position={getElementPosition('personal', draggableElements)}
            onDrag={(x, y) => onElementDrag('personal', x, y)}
            className=""
          >
            <div className={`bg-gradient-to-br ${getBoxGradient(0)} border-4 border-pink-500 rounded-2xl p-3 transform rotate-1 shadow-2xl relative overflow-hidden w-60`}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-white/15"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-3">
                  <Heart className="w-6 h-6 text-pink-300 mr-2 drop-shadow-lg" />
                  <EditableText
                    textKey="personal-title"
                    defaultText="ŻYCIE PRYWATNE!"
                    className="font-black text-white text-lg drop-shadow-lg"
                  />
                </div>
                <div className="space-y-2">
                  <div className="bg-white/30 rounded-lg p-2">
                    <EditableText
                      textKey="relationship-status"
                      defaultText={`💕 ${actor.relationships[0] || 'Status nieznany'}`}
                      className="text-sm font-black text-white leading-tight drop-shadow-sm"
                    />
                  </div>
                  <div className="bg-white/30 rounded-lg p-2">
                    <EditableText
                      textKey="net-worth"
                      defaultText={`💰 ${actor.netWorth}`}
                      className="text-sm font-black text-white leading-tight drop-shadow-sm"
                    />
                  </div>
                  <div className="bg-white/30 rounded-lg p-2">
                    <EditableText
                      textKey="hobbies"
                      defaultText={`🎯 ${actor.hobbies.slice(0, 2).join(', ')}`}
                      className="text-sm font-black text-white leading-tight drop-shadow-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </DraggableBox>

          {/* Photo gallery */}
          {actor.images && actor.images.length > 1 && (
            <DraggableBox
              id="photo-gallery"
              position={getElementPosition('photo-gallery', draggableElements)}
              onDrag={(x, y) => onElementDrag('photo-gallery', x, y)}
              className=""
            >
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 border-4 border-white rounded-2xl p-3 transform rotate-2 shadow-2xl w-52">
                <h4 className="font-black text-white text-center mb-2 drop-shadow-lg text-base">📸 GALERIA!</h4>
                <div className="grid grid-cols-3 gap-2">
                  {actor.images.slice(1, 4).map((image, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden border-2 border-white/50">
                      <ImageWithFallback
                        src={image}
                        alt={`${actor.name} ${index + 2}`}
                        className="w-full h-full object-cover hover:scale-110 transition-transform"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </DraggableBox>
          )}

          {/* Social media */}
          <DraggableBox
            id="social-media"
            position={getElementPosition('social-media', draggableElements)}
            onDrag={(x, y) => onElementDrag('social-media', x, y)}
            className=""
          >
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 border-4 border-white rounded-xl p-3 shadow-2xl w-52">
              <EditableText
                textKey="social-media"
                defaultText={`📱 ${actor.socialMedia[0] || 'Instagram @verified'}`}
                className="text-sm font-black text-white text-center drop-shadow-lg"
              />
            </div>
          </DraggableBox>

          {/* Quote */}
          <DraggableBox
            id="quote"
            position={getElementPosition('quote', draggableElements)}
            onDrag={(x, y) => onElementDrag('quote', x, y)}
            className=""
          >
            <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 border-4 border-white rounded-xl p-3 shadow-2xl w-60">
              <EditableText
                textKey="quote"
                defaultText={`💬 "${actor.quotes[0]?.substring(0, 60) || 'Aktorstwo to moja pasja i życie'}..."`}
                className="text-sm font-black text-purple-800 text-center leading-tight drop-shadow-lg"
              />
            </div>
          </DraggableBox>

        </div>
      </div>

      {/* Enhanced corner decorations - FIXED POSITIONS */}
      <div className="absolute top-6 left-6 text-5xl opacity-90 text-yellow-300 transform rotate-12 drop-shadow-lg animate-pulse z-20">★</div>
      <div className="absolute top-6 right-6 text-4xl opacity-90 text-pink-400 transform -rotate-12 drop-shadow-lg z-20">♥</div>
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-3xl opacity-90 text-blue-400 drop-shadow-lg z-20">♪</div>
      
      {/* Enhanced BRAVO elements - FIXED POSITIONS */}
      <div className="absolute top-40 right-8 transform rotate-45 z-20">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-800 px-3 py-2 rounded-full border-3 border-purple-800 shadow-xl">
          <span className="text-sm font-black drop-shadow-lg">WOW!</span>
        </div>
      </div>
      
      <div className="absolute top-80 left-8 transform -rotate-12 z-20">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-2 rounded-full border-3 border-white shadow-xl">
          <span className="text-sm font-black drop-shadow-lg">SZOK!</span>
        </div>
      </div>

      {/* Data source indicators */}
      <div className="absolute top-2 right-2 flex space-x-1 z-30">
        <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-black">
          <Star className="w-3 h-3 inline mr-1" />
          LIVE
        </div>
        {actor.wikiData && (
          <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-black">
            <Globe className="w-3 h-3 inline mr-1" />
            WIKI
          </div>
        )}
      </div>

      {/* Enhanced bottom info bar */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-30">
        <div className="bg-gradient-to-r from-black via-gray-800 to-black text-white px-4 py-2 rounded-full border-3 border-yellow-400 shadow-2xl">
          <EditableText
            textKey="bottom-info"
            defaultText={`${actor.age} lat • ${actor.netWorth} • ${actor.filmography.length} projektów`}
            className="text-sm font-black drop-shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}