import { ChordFret } from "@/components/GuitarChordDiagram";

// Define common chord positions
export const chordPositions: Record<string, ChordFret[]> = {
  // Major chords
  "C": [
    { string: 1, fret: 0 },
    { string: 2, fret: 1, finger: 1 },
    { string: 3, fret: 0 },
    { string: 4, fret: 2, finger: 2 },
    { string: 5, fret: 3, finger: 3, isRoot: true },
    { string: 6, fret: -1 } // Muted
  ],
  "D": [
    { string: 1, fret: 2, finger: 2 },
    { string: 2, fret: 3, finger: 3 },
    { string: 3, fret: 2, finger: 1 },
    { string: 4, fret: 0 },
    { string: 5, fret: -1 }, // Muted
    { string: 6, fret: -1 }  // Muted
  ],
  "E": [
    { string: 1, fret: 0 },
    { string: 2, fret: 0 },
    { string: 3, fret: 1, finger: 1 },
    { string: 4, fret: 2, finger: 2 },
    { string: 5, fret: 2, finger: 3 },
    { string: 6, fret: 0, isRoot: true }
  ],
  "F": [
    { string: 1, fret: 1, finger: 1 },
    { string: 2, fret: 1, finger: 1 },
    { string: 3, fret: 2, finger: 2 },
    { string: 4, fret: 3, finger: 3 },
    { string: 5, fret: 3, finger: 4 },
    { string: 6, fret: 1, finger: 1, isRoot: true }
  ],
  "G": [
    { string: 1, fret: 3, finger: 4 },
    { string: 2, fret: 0 },
    { string: 3, fret: 0 },
    { string: 4, fret: 0 },
    { string: 5, fret: 2, finger: 2 },
    { string: 6, fret: 3, finger: 3, isRoot: true }
  ],
  "A": [
    { string: 1, fret: 0 },
    { string: 2, fret: 2, finger: 3 },
    { string: 3, fret: 2, finger: 2 },
    { string: 4, fret: 2, finger: 1 },
    { string: 5, fret: 0, isRoot: true },
    { string: 6, fret: -1 }  // Muted
  ],
  "B": [
    { string: 1, fret: 2, finger: 1 },
    { string: 2, fret: 4, finger: 4 },
    { string: 3, fret: 4, finger: 3 },
    { string: 4, fret: 4, finger: 2 },
    { string: 5, fret: 2, finger: 1, isRoot: true },
    { string: 6, fret: -1 }  // Muted
  ],
  
  // Minor chords
  "Am": [
    { string: 1, fret: 0 },
    { string: 2, fret: 1, finger: 1 },
    { string: 3, fret: 2, finger: 2 },
    { string: 4, fret: 2, finger: 3 },
    { string: 5, fret: 0, isRoot: true },
    { string: 6, fret: -1 }  // Muted
  ],
  "Bm": [
    { string: 1, fret: 2, finger: 2 },
    { string: 2, fret: 3, finger: 3 },
    { string: 3, fret: 4, finger: 4 },
    { string: 4, fret: 4, finger: 4 },
    { string: 5, fret: 2, finger: 1, isRoot: true },
    { string: 6, fret: -1 }  // Muted
  ],
  "Cm": [
    { string: 1, fret: 3, finger: 3 },
    { string: 2, fret: 4, finger: 4 },
    { string: 3, fret: 5, finger: 2 },
    { string: 4, fret: 5, finger: 1 },
    { string: 5, fret: 3, finger: 1, isRoot: true },
    { string: 6, fret: -1 }  // Muted
  ],
  "Dm": [
    { string: 1, fret: 1, finger: 1 },
    { string: 2, fret: 3, finger: 3 },
    { string: 3, fret: 2, finger: 2 },
    { string: 4, fret: 0 },
    { string: 5, fret: -1 },  // Muted
    { string: 6, fret: -1 }   // Muted
  ],
  "Em": [
    { string: 1, fret: 0 },
    { string: 2, fret: 0 },
    { string: 3, fret: 0 },
    { string: 4, fret: 2, finger: 2 },
    { string: 5, fret: 2, finger: 3 },
    { string: 6, fret: 0, isRoot: true }
  ],
  "Fm": [
    { string: 1, fret: 1, finger: 1 },
    { string: 2, fret: 1, finger: 1 },
    { string: 3, fret: 1, finger: 1 },
    { string: 4, fret: 3, finger: 3 },
    { string: 5, fret: 3, finger: 4 },
    { string: 6, fret: 1, finger: 1, isRoot: true }
  ],
  "Gm": [
    { string: 1, fret: 3, finger: 3 },
    { string: 2, fret: 3, finger: 4 },
    { string: 3, fret: 3, finger: 2 },
    { string: 4, fret: 5, finger: 1 },
    { string: 5, fret: 5, finger: 1 },
    { string: 6, fret: 3, finger: 1, isRoot: true }
  ],
  
  // 7th chords
  "E7": [
    { string: 1, fret: 0 },
    { string: 2, fret: 0 },
    { string: 3, fret: 1, finger: 1 },
    { string: 4, fret: 0 },
    { string: 5, fret: 2, finger: 2 },
    { string: 6, fret: 0, isRoot: true }
  ],
  "A7": [
    { string: 1, fret: 0 },
    { string: 2, fret: 2, finger: 2 },
    { string: 3, fret: 0 },
    { string: 4, fret: 2, finger: 3 },
    { string: 5, fret: 0, isRoot: true },
    { string: 6, fret: -1 }  // Muted
  ],
  "D7": [
    { string: 1, fret: 2, finger: 2 },
    { string: 2, fret: 1, finger: 1 },
    { string: 3, fret: 2, finger: 3 },
    { string: 4, fret: 0 },
    { string: 5, fret: -1 },  // Muted
    { string: 6, fret: -1 }   // Muted
  ],
  "G7": [
    { string: 1, fret: 1, finger: 1 },
    { string: 2, fret: 0 },
    { string: 3, fret: 0 },
    { string: 4, fret: 0 },
    { string: 5, fret: 2, finger: 2 },
    { string: 6, fret: 3, finger: 3, isRoot: true }
  ],
  
  // Add additional chords as needed
};

// Helper function to get chord positions or fallback to a default
export const getChordPositions = (chordName: string): ChordFret[] => {
  // Try to find exact match
  if (chordPositions[chordName]) {
    return chordPositions[chordName];
  }
  
  // Handle basic chord name without alterations (e.g., for C#, try C)
  const basicChordName = chordName.replace(/[♯♭]/, '');
  if (chordPositions[basicChordName]) {
    return chordPositions[basicChordName];
  }
  
  // Default fallback to E chord if nothing matches
  return chordPositions["E"];
}; 