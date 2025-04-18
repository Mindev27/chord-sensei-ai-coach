// Basic chord position type
export interface ChordPosition {
  frets: number[];  // 6 strings from low E to high E
  fingers: number[]; // finger numbers (1-4) or 0 for open strings
  baseFret: number;  // starting fret position
  barres?: number[]; // fret numbers where a barre chord is applied
}

// Library of chord positions by difficulty
const CHORD_LIBRARY: Record<string, {
  easy: ChordPosition[],
  medium: ChordPosition[],
  hard: ChordPosition[]
}> = {
  // Major chords
  "C": {
    easy: [{ 
      frets: [0, 1, 0, 2, 3, -1], 
      fingers: [0, 1, 0, 2, 3, 0], 
      baseFret: 1 
    }],
    medium: [{ 
      frets: [3, 3, 5, 5, 5, 3], 
      fingers: [1, 1, 3, 3, 3, 1], 
      baseFret: 8,
      barres: [3] 
    }],
    hard: [{ 
      frets: [1, 3, 3, 2, 1, 1], 
      fingers: [1, 4, 3, 2, 1, 1], 
      baseFret: 3,
      barres: [1] 
    }]
  },
  "G": {
    easy: [{ 
      frets: [3, 2, 0, 0, 0, 3], 
      fingers: [2, 1, 0, 0, 0, 3], 
      baseFret: 1 
    }],
    medium: [{ 
      frets: [3, 3, 0, 0, 2, 3], 
      fingers: [3, 2, 0, 0, 1, 4], 
      baseFret: 1 
    }],
    hard: [{ 
      frets: [1, 3, 3, 3, 3, 1], 
      fingers: [1, 3, 3, 3, 3, 1], 
      baseFret: 3,
      barres: [1, 3] 
    }]
  },
  "D": {
    easy: [{ 
      frets: [-1, -1, 0, 2, 3, 2], 
      fingers: [0, 0, 0, 2, 3, 1], 
      baseFret: 1 
    }],
    medium: [{ 
      frets: [-1, 5, 7, 7, 7, 5], 
      fingers: [0, 1, 3, 3, 3, 1], 
      baseFret: 5,
      barres: [5, 7] 
    }],
    hard: [{ 
      frets: [1, 3, 3, 2, 1, 1], 
      fingers: [1, 4, 3, 2, 1, 1], 
      baseFret: 10,
      barres: [1] 
    }]
  },
  "A": {
    easy: [{ 
      frets: [-1, 0, 2, 2, 2, 0], 
      fingers: [0, 0, 3, 2, 1, 0], 
      baseFret: 1 
    }],
    medium: [{ 
      frets: [-1, 0, 2, 2, 2, 0], 
      fingers: [0, 0, 4, 3, 2, 0], 
      baseFret: 1 
    }],
    hard: [{ 
      frets: [1, 3, 3, 2, 1, 1], 
      fingers: [1, 4, 3, 2, 1, 1], 
      baseFret: 5,
      barres: [1] 
    }]
  },
  "E": {
    easy: [{ 
      frets: [0, 2, 2, 1, 0, 0], 
      fingers: [0, 3, 2, 1, 0, 0], 
      baseFret: 1 
    }],
    medium: [{ 
      frets: [1, 3, 3, 2, 1, 1], 
      fingers: [1, 4, 3, 2, 1, 1], 
      baseFret: 7,
      barres: [1] 
    }],
    hard: [{ 
      frets: [4, 6, 6, 5, 4, 4], 
      fingers: [1, 4, 3, 2, 1, 1], 
      baseFret: 1,
      barres: [4] 
    }]
  },
  "F": {
    easy: [{ 
      frets: [1, 3, 3, 2, 1, 1], 
      fingers: [1, 4, 3, 2, 1, 1], 
      baseFret: 1,
      barres: [1] 
    }],
    medium: [{ 
      frets: [-1, -1, 3, 2, 1, 1], 
      fingers: [0, 0, 3, 2, 1, 1], 
      baseFret: 1,
      barres: [1] 
    }],
    hard: [{ 
      frets: [1, 3, 3, 2, 1, 1], 
      fingers: [1, 4, 3, 2, 1, 1], 
      baseFret: 1,
      barres: [1] 
    }]
  },
  
  // Minor chords
  "Am": {
    easy: [{ 
      frets: [-1, 0, 2, 2, 1, 0], 
      fingers: [0, 0, 3, 2, 1, 0], 
      baseFret: 1 
    }],
    medium: [{ 
      frets: [1, 3, 3, 1, 1, 1], 
      fingers: [1, 3, 4, 1, 1, 1], 
      baseFret: 5,
      barres: [1] 
    }],
    hard: [{ 
      frets: [1, 3, 3, 1, 1, 1], 
      fingers: [1, 3, 4, 1, 1, 1], 
      baseFret: 5,
      barres: [1] 
    }]
  },
  "Em": {
    easy: [{ 
      frets: [0, 2, 2, 0, 0, 0], 
      fingers: [0, 2, 1, 0, 0, 0], 
      baseFret: 1 
    }],
    medium: [{ 
      frets: [0, 2, 2, 0, 0, 0], 
      fingers: [0, 2, 1, 0, 0, 0], 
      baseFret: 1 
    }],
    hard: [{ 
      frets: [1, 3, 3, 1, 1, 1], 
      fingers: [1, 3, 4, 1, 1, 1], 
      baseFret: 7,
      barres: [1] 
    }]
  },
  
  // Dominant 7th chords
  "E7": {
    easy: [{ 
      frets: [0, 2, 0, 1, 0, 0], 
      fingers: [0, 2, 0, 1, 0, 0], 
      baseFret: 1 
    }],
    medium: [{ 
      frets: [0, 2, 2, 1, 3, 0], 
      fingers: [0, 2, 3, 1, 4, 0], 
      baseFret: 1 
    }],
    hard: [{ 
      frets: [1, 3, 1, 2, 1, 1], 
      fingers: [1, 3, 1, 2, 1, 1], 
      baseFret: 7,
      barres: [1] 
    }]
  },
  "G7": {
    easy: [{ 
      frets: [3, 2, 0, 0, 0, 1], 
      fingers: [3, 2, 0, 0, 0, 1], 
      baseFret: 1 
    }],
    medium: [{ 
      frets: [1, 3, 1, 2, 1, 1], 
      fingers: [1, 3, 1, 2, 1, 1], 
      baseFret: 3,
      barres: [1] 
    }],
    hard: [{ 
      frets: [1, 3, 1, 3, 3, 1], 
      fingers: [1, 3, 1, 3, 4, 1], 
      baseFret: 3,
      barres: [1, 3] 
    }]
  },
  "D7": {
    easy: [{ 
      frets: [-1, -1, 0, 2, 1, 2], 
      fingers: [0, 0, 0, 3, 1, 2], 
      baseFret: 1 
    }],
    medium: [{ 
      frets: [1, 3, 1, 2, 1, 1], 
      fingers: [1, 3, 1, 2, 1, 1], 
      baseFret: 10,
      barres: [1] 
    }],
    hard: [{ 
      frets: [5, 5, 5, 6, 5, 5], 
      fingers: [1, 1, 1, 2, 1, 1], 
      baseFret: 5,
      barres: [5] 
    }]
  },
};

/**
 * Get chord positions by difficulty level
 * @param chordName The chord name (e.g., "C", "Am", "G7")
 * @param difficultyLevel The difficulty level ("상" = hard, "중" = medium, "하" = easy)
 * @returns Array of chord positions
 */
export const getChordPositionsByDifficulty = (
  chordName: string, 
  difficultyLevel: "상" | "중" | "하" = "중"
): ChordPosition[] => {
  // Map Korean difficulty levels to English
  const difficultyMap: Record<string, string> = {
    "상": "hard",
    "중": "medium",
    "하": "easy"
  };
  
  const difficulty = difficultyMap[difficultyLevel] || "medium";
  
  // Get chord data if it exists
  const chordData = CHORD_LIBRARY[chordName];
  
  if (!chordData) {
    // Return a default position if chord not found
    return [{ 
      frets: [0, 0, 0, 0, 0, 0], 
      fingers: [0, 0, 0, 0, 0, 0], 
      baseFret: 1 
    }];
  }
  
  return chordData[difficulty as keyof typeof chordData] || chordData.medium;
};

export default {
  getChordPositionsByDifficulty
}; 