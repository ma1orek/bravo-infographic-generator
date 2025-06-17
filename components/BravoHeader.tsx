import { Tv, Globe, Database, AlertCircle, CheckCircle } from "lucide-react";

export function BravoHeader() {
  return (
    <header className="bg-gradient-to-r from-white via-yellow-50 to-pink-50 border-b-4 border-pink-500 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className="text-5xl font-black text-red-500 drop-shadow-lg">B</span>
            <span className="text-5xl font-black text-blue-500 drop-shadow-lg">R</span>
            <span className="text-5xl font-black text-green-500 drop-shadow-lg">A</span>
            <span className="text-5xl font-black text-yellow-500 drop-shadow-lg">V</span>
            <span className="text-5xl font-black text-purple-500 drop-shadow-lg">O</span>
          </div>
          <div className="ml-6">
            <span className="text-2xl font-black text-gray-800 drop-shadow-md">INFOGRAPHIC</span>
            <br />
            <span className="text-2xl font-black text-pink-500 drop-shadow-md">GENERATOR</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Enhanced multi-source indicator with status */}
          <div className="flex space-x-2">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-black flex items-center shadow-lg">
              <Tv className="w-4 h-4 mr-2" />
              TVMaze
              <CheckCircle className="w-3 h-3 ml-1" />
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-full text-sm font-black flex items-center shadow-lg">
              <Database className="w-4 h-4 mr-2" />
              TheTVDB
              <AlertCircle className="w-3 h-3 ml-1" />
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-black flex items-center shadow-lg">
              <Globe className="w-4 h-4 mr-2" />
              Wikipedia
              <CheckCircle className="w-3 h-3 ml-1" />
            </div>
          </div>
          
          {/* Status indicator */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-black shadow-lg">
            ✅ RESILIENT DESIGN
          </div>
        </div>
      </div>
    </header>
  );
}