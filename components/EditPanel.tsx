import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Download, Palette, Type, Image, Sparkles, RefreshCw, RotateCcw, Film, Globe, Layout } from "lucide-react";
import { ColorScheme } from "../types/themes";

interface EditPanelProps {
  onExportPdf: () => void;
  onExportPng: () => void;
  colorSchemes: ColorScheme[];
  currentColorScheme: ColorScheme;
  onColorSchemeChange: (scheme: ColorScheme) => void;
  onRandomColors: () => void;
  onAddSticker: () => void;
  onShuffleLayout: () => void;
  onReset: () => void;
  actorCount: number;
  currentLayout?: number;
  totalLayouts?: number;
}

export function EditPanel({ 
  onExportPdf, 
  onExportPng, 
  colorSchemes,
  currentColorScheme,
  onColorSchemeChange,
  onRandomColors,
  onAddSticker,
  onShuffleLayout,
  onReset,
  actorCount,
  currentLayout = 1,
  totalLayouts = 8
}: EditPanelProps) {
  return (
    <div className="bg-gradient-to-b from-yellow-100 via-orange-100 to-red-100 p-4 h-full overflow-y-auto">
      <h3 className="text-lg font-black text-orange-800 mb-4 text-center">
        🎨 EDYTOR BRAVO! 🎨
      </h3>

      <div className="space-y-4">
        {/* Export section */}
        <Card className="p-4 border-4 border-orange-400 bg-gradient-to-br from-orange-50 to-red-50 shadow-xl">
          <h4 className="font-black text-orange-700 mb-3 flex items-center">
            <Download className="w-5 h-5 mr-2" />
            📥 POBIERZ INFOGRAFIKĘ
          </h4>
          <div className="space-y-3">
            <Button 
              onClick={onExportPdf}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-black transform hover:scale-105 transition-all shadow-lg"
            >
              📄 Pobierz PDF (A4)
            </Button>
            <Button 
              onClick={onExportPng}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-black transform hover:scale-105 transition-all shadow-lg"
            >
              🖼️ Pobierz PNG (HD)
            </Button>
          </div>
          <p className="text-xs text-orange-600 mt-3 text-center font-black bg-yellow-100 rounded-lg p-2">
            💡 Gotowe do druku lub udostępnienia w social media!
          </p>
        </Card>

        {/* Enhanced layout section with 8 layouts */}
        <Card className="p-4 border-4 border-blue-400 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl">
          <h4 className="font-black text-blue-700 mb-3 flex items-center">
            <Layout className="w-5 h-5 mr-2" />
            🎯 UKŁADY ELEMENTÓW
          </h4>
          <div className="text-center mb-3">
            <div className="bg-blue-100 rounded-lg p-2 mb-2">
              <span className="text-blue-800 font-black">
                Układ {currentLayout} z {totalLayouts}
              </span>
              <div className="text-xs text-blue-600 mt-1">
                {currentLayout === 1 && "Classic BRAVO"}
                {currentLayout === 2 && "Asymmetric Creative"}
                {currentLayout === 3 && "Balanced Magazine"}
                {currentLayout === 4 && "Dynamic Diagonal"}
                {currentLayout === 5 && "Vertical Flow"}
                {currentLayout === 6 && "Clustered Left"}
                {currentLayout === 7 && "Clustered Right"}
                {currentLayout === 8 && "Scattered Balanced"}
              </div>
            </div>
            <Button 
              onClick={onShuffleLayout}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-black text-sm transform hover:scale-105 transition-all shadow-lg"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Następny Układ ({currentLayout === totalLayouts ? 1 : currentLayout + 1})
            </Button>
          </div>
          <p className="text-xs text-blue-600 text-center bg-blue-50 rounded-lg p-2">
            🎨 8 profesjonalnych układów! Każdy element pozostaje w obszarze widocznym!
          </p>
        </Card>

        {/* Enhanced color scheme selection */}
        <Card className="p-4 border-4 border-pink-400 bg-gradient-to-br from-pink-50 to-purple-50 shadow-xl">
          <h4 className="font-black text-pink-700 mb-3 flex items-center">
            <Palette className="w-5 h-5 mr-2" />
            🎨 SCHEMATY KOLORÓW
          </h4>
          <div className="space-y-2 mb-4">
            {colorSchemes.map((scheme) => (
              <button
                key={scheme.id}
                onClick={() => onColorSchemeChange(scheme)}
                className={`w-full p-3 rounded-xl border-3 text-left font-black text-sm transition-all hover:scale-105 shadow-md ${
                  currentColorScheme.id === scheme.id
                    ? 'border-pink-500 bg-gradient-to-r from-pink-200 to-purple-200 shadow-xl ring-2 ring-pink-300'
                    : 'border-gray-300 bg-white hover:border-pink-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1">
                    {scheme.gradients.boxes.slice(0, 4).map((gradient, index) => (
                      <div
                        key={index}
                        className={`w-4 h-4 rounded-full bg-gradient-to-r ${gradient} shadow-sm border border-white`}
                      />
                    ))}
                  </div>
                  <span className="flex-1">{scheme.name}</span>
                  {currentColorScheme.id === scheme.id && (
                    <span className="text-pink-600">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>
          <Button 
            onClick={onRandomColors}
            className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-black text-sm transform hover:scale-105 transition-all shadow-lg"
          >
            🎲 Losowy Schemat Kolorów
          </Button>
        </Card>

        {/* Enhanced quick actions */}
        <Card className="p-4 border-4 border-purple-400 bg-gradient-to-br from-purple-50 to-pink-50 shadow-xl">
          <h4 className="font-black text-purple-700 mb-3 flex items-center">
            <Sparkles className="w-5 h-5 mr-2" />
            ⚡ SZYBKIE AKCJE
          </h4>
          <div className="space-y-3">
            <Button 
              onClick={onAddSticker}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-black text-sm transform hover:scale-105 transition-all shadow-lg"
            >
              🎊 Dodaj Naklejkę
            </Button>
            <Button 
              onClick={onReset}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-black text-sm transform hover:scale-105 transition-all shadow-lg"
            >
              <RotateCcw className="w-3 h-3 mr-2" />
              🔄 Reset Wszystko
            </Button>
          </div>
        </Card>

        {/* Enhanced text editing tips - NO DRAGGING, only editing */}
        <Card className="p-4 border-4 border-green-400 bg-gradient-to-br from-green-50 to-blue-50 shadow-xl">
          <h4 className="font-black text-green-700 mb-3 flex items-center">
            <Type className="w-5 h-5 mr-2" />
            ✏️ EDYCJA TEKSTÓW
          </h4>
          <div className="text-sm text-green-800 space-y-2">
            <div className="bg-green-100 rounded-lg p-2">
              <p><strong>💡 Kliknij</strong> dowolny tekst aby go edytować</p>
            </div>
            <div className="bg-blue-100 rounded-lg p-2">
              <p><strong>✋ Przeciągnij</strong> kolorowe boksy aby je przesunąć</p>
            </div>
            <div className="bg-purple-100 rounded-lg p-2">
              <p><strong>🎯 Przesuń</strong> naklejki emoji</p>
            </div>
            <div className="bg-yellow-100 rounded-lg p-2">
              <p><strong>📏</strong> Wszystko zostaje w obszarze widocznym</p>
            </div>
          </div>
          <div className="mt-3">
            <div className="bg-gradient-to-r from-yellow-200 to-orange-200 p-3 rounded-lg border-2 border-yellow-400">
              <p className="text-xs font-black text-purple-800 text-center">
                🎯 Rachel Zegler ma 23 lata i jest gwiazdą "West Side Story"!
              </p>
            </div>
          </div>
        </Card>

        {/* Rachel Zegler highlight */}
        <Card className="p-4 border-4 border-red-400 bg-gradient-to-br from-red-50 to-pink-50 shadow-xl">
          <h4 className="font-black text-red-700 mb-3 text-center">
            🌟 RACHEL ZEGLER - NOWA GWIAZDA!
          </h4>
          <div className="text-center space-y-2">
            <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-3 py-2 rounded-full text-xs font-black shadow-lg">
              🏆 Złoty Glob w wieku 20 lat!
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-2 rounded-full text-xs font-black shadow-lg">
              👑 Śnieżka Disney 2025
            </div>
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-2 rounded-full text-xs font-black shadow-lg">
              🎭 Od YouTube do Hollywood
            </div>
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-2 rounded-full text-xs font-black shadow-lg">
              🌍 Polsko-kolumbijskie korzenie
            </div>
          </div>
          <p className="text-xs text-red-600 text-center mt-3 bg-red-50 rounded-lg p-2">
            💡 Wyszukaj "Rachel Zegler" aby zobaczyć wszystkie ciekawostki!
          </p>
        </Card>

        {/* Enhanced live stats */}
        <Card className="p-4 border-4 border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 shadow-xl">
          <h4 className="font-black text-yellow-700 mb-3 text-center">
            📊 LIVE STATYSTYKI
          </h4>
          <div className="text-center space-y-3">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-black shadow-lg">
              🎬 {actorCount} AKTORÓW W BAZIE
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-2 rounded-full text-xs font-black flex items-center justify-center shadow-lg">
                <Film className="w-3 h-3 mr-1" />
                TVMaze
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-2 rounded-full text-xs font-black flex items-center justify-center shadow-lg">
                <Globe className="w-3 h-3 mr-1" />
                Wikipedia
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-black shadow-lg">
              🎨 {colorSchemes.length} SCHEMATÓW KOLORÓW
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-black shadow-lg">
              🎯 8 UKŁADÓW ELEMENTÓW
            </div>
          </div>
        </Card>

        {/* Netlify deployment info */}
        <Card className="p-4 border-4 border-emerald-400 bg-gradient-to-br from-emerald-50 to-green-50 shadow-xl">
          <h4 className="font-black text-emerald-700 mb-3 text-center">
            🚀 NETLIFY DEPLOYMENT
          </h4>
          <div className="space-y-2 text-xs text-emerald-800">
            <div className="bg-emerald-100 rounded-lg p-2">
              <p><strong>1.</strong> Push kod do GitHub/GitLab</p>
            </div>
            <div className="bg-blue-100 rounded-lg p-2">
              <p><strong>2.</strong> Połącz z Netlify</p>
            </div>
            <div className="bg-purple-100 rounded-lg p-2">
              <p><strong>3.</strong> Auto-deploy z netlify.toml</p>
            </div>
            <div className="bg-pink-100 rounded-lg p-2">
              <p><strong>4.</strong> Własna domena .netlify.app</p>
            </div>
          </div>
          <div className="mt-3 bg-gradient-to-r from-emerald-400 to-green-400 text-white p-2 rounded-lg text-center">
            <p className="text-xs font-black">
              ✅ Gotowe do wdrożenia!
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}