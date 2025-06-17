export interface ColorScheme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    border: string;
  };
  gradients: {
    overlay: string;
    boxes: string[];
  };
}

export interface Position {
  x: number;
  y: number;
}

export interface DraggableElement {
  id: string;
  position: Position;
  zIndex: number;
}

export const colorSchemes: ColorScheme[] = [
  {
    id: 'classic',
    name: '🔥 Classic BRAVO',
    colors: {
      primary: '#ff1744',
      secondary: '#ff6b9d',
      accent: '#ffeb3b',
      background: '#ffffff',
      text: '#000000',
      border: '#ff1744'
    },
    gradients: {
      overlay: 'from-pink-500/30 via-transparent to-blue-500/30',
      boxes: [
        'from-red-500 to-pink-500',
        'from-blue-500 to-purple-500',
        'from-green-500 to-teal-500',
        'from-yellow-500 to-orange-500'
      ]
    }
  },
  {
    id: 'electric',
    name: '⚡ Electric Pop',
    colors: {
      primary: '#e91e63',
      secondary: '#9c27b0',
      accent: '#00bcd4',
      background: '#ffffff',
      text: '#000000',
      border: '#e91e63'
    },
    gradients: {
      overlay: 'from-purple-500/30 via-transparent to-cyan-500/30',
      boxes: [
        'from-pink-500 to-purple-500',
        'from-purple-500 to-indigo-500',
        'from-cyan-500 to-blue-500',
        'from-orange-500 to-red-500'
      ]
    }
  },
  {
    id: 'neon',
    name: '🌈 Neon Dreams',
    colors: {
      primary: '#00ff00',
      secondary: '#ff00ff',
      accent: '#00ffff',
      background: '#000000',
      text: '#ffffff',
      border: '#00ff00'
    },
    gradients: {
      overlay: 'from-green-500/30 via-transparent to-pink-500/30',
      boxes: [
        'from-green-400 to-cyan-400',
        'from-pink-400 to-purple-400',
        'from-yellow-400 to-red-400',
        'from-blue-400 to-indigo-400'
      ]
    }
  },
  {
    id: 'sunset',
    name: '🌅 Sunset Vibes',
    colors: {
      primary: '#ff5722',
      secondary: '#ff9800',
      accent: '#ffeb3b',
      background: '#fff3e0',
      text: '#bf360c',
      border: '#ff5722'
    },
    gradients: {
      overlay: 'from-orange-500/30 via-transparent to-red-500/30',
      boxes: [
        'from-orange-500 to-red-500',
        'from-yellow-500 to-orange-500',
        'from-red-500 to-pink-500',
        'from-amber-500 to-yellow-500'
      ]
    }
  },
  {
    id: 'ocean',
    name: '🌊 Ocean Blue',
    colors: {
      primary: '#2196f3',
      secondary: '#00bcd4',
      accent: '#4caf50',
      background: '#e3f2fd',
      text: '#0d47a1',
      border: '#2196f3'
    },
    gradients: {
      overlay: 'from-blue-500/30 via-transparent to-teal-500/30',
      boxes: [
        'from-blue-500 to-cyan-500',
        'from-teal-500 to-green-500',
        'from-indigo-500 to-blue-500',
        'from-cyan-500 to-teal-500'
      ]
    }
  }
];

export const stickerEmojis = [
  '⭐', '💫', '✨', '🔥', '💥', '⚡', '🌟', '💖', '💕', '💗',
  '🎉', '🎊', '🎈', '🎯', '🏆', '👑', '💎', '🌈', '☀️', '🌙',
  '🎵', '🎶', '🎸', '🎤', '🎬', '📸', '💿', '🎭', '🎨', '🖌️'
];