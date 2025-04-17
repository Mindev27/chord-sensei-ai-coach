import React, { useState } from "react";
import GuitarFretboardWithScaleDisplay, { FretboardNote } from "./GuitarFretboardWithScaleDisplay";

// Example scales and their notes on the fretboard
const SCALES = {
  "A Minor Pentatonic": [
    // Root notes (A)
    { string: 6, fret: 5, isRoot: true, isScaleNote: true },
    { string: 5, fret: 0, isRoot: true, isScaleNote: true },
    { string: 4, fret: 7, isRoot: true, isScaleNote: true },
    { string: 3, fret: 2, isRoot: true, isScaleNote: true },
    { string: 2, fret: 10, isRoot: true, isScaleNote: true },
    { string: 1, fret: 5, isRoot: true, isScaleNote: true },
    // Scale notes (C)
    { string: 6, fret: 8, isScaleNote: true },
    { string: 5, fret: 3, isScaleNote: true },
    { string: 4, fret: 10, isScaleNote: true },
    { string: 3, fret: 5, isScaleNote: true },
    { string: 2, fret: 1, isScaleNote: true },
    { string: 1, fret: 8, isScaleNote: true },
    // Scale notes (D)
    { string: 6, fret: 10, isScaleNote: true },
    { string: 5, fret: 5, isScaleNote: true },
    { string: 4, fret: 0, isScaleNote: true },
    { string: 3, fret: 7, isScaleNote: true },
    { string: 2, fret: 3, isScaleNote: true },
    { string: 1, fret: 10, isScaleNote: true },
    // Scale notes (E)
    { string: 6, fret: 0, isScaleNote: true },
    { string: 5, fret: 7, isScaleNote: true },
    { string: 4, fret: 2, isScaleNote: true },
    { string: 3, fret: 9, isScaleNote: true },
    { string: 2, fret: 5, isScaleNote: true },
    { string: 1, fret: 0, isScaleNote: true },
    // Scale notes (G)
    { string: 6, fret: 3, isScaleNote: true },
    { string: 5, fret: 10, isScaleNote: true },
    { string: 4, fret: 5, isScaleNote: true },
    { string: 3, fret: 0, isScaleNote: true },
    { string: 2, fret: 8, isScaleNote: true },
    { string: 1, fret: 3, isScaleNote: true },
  ],
  
  "E Blues": [
    // Root notes (E)
    { string: 6, fret: 0, isRoot: true, isScaleNote: true },
    { string: 5, fret: 7, isRoot: true, isScaleNote: true },
    { string: 4, fret: 2, isRoot: true, isScaleNote: true },
    { string: 3, fret: 9, isRoot: true, isScaleNote: true },
    { string: 2, fret: 5, isRoot: true, isScaleNote: true },
    { string: 1, fret: 0, isRoot: true, isScaleNote: true },
    // Scale notes (G)
    { string: 6, fret: 3, isScaleNote: true },
    { string: 5, fret: 10, isScaleNote: true },
    { string: 4, fret: 5, isScaleNote: true },
    { string: 3, fret: 0, isScaleNote: true },
    { string: 2, fret: 8, isScaleNote: true },
    { string: 1, fret: 3, isScaleNote: true },
    // Scale notes (A)
    { string: 6, fret: 5, isScaleNote: true },
    { string: 5, fret: 0, isScaleNote: true },
    { string: 4, fret: 7, isScaleNote: true },
    { string: 3, fret: 2, isScaleNote: true },
    { string: 2, fret: 10, isScaleNote: true },
    { string: 1, fret: 5, isScaleNote: true },
    // Scale notes (Bb - blues note)
    { string: 6, fret: 6, isScaleNote: true },
    { string: 5, fret: 1, isScaleNote: true },
    { string: 4, fret: 8, isScaleNote: true },
    { string: 3, fret: 3, isScaleNote: true },
    { string: 2, fret: 11, isScaleNote: true },
    { string: 1, fret: 6, isScaleNote: true },
    // Scale notes (B)
    { string: 6, fret: 7, isScaleNote: true },
    { string: 5, fret: 2, isScaleNote: true },
    { string: 4, fret: 9, isScaleNote: true },
    { string: 3, fret: 4, isScaleNote: true },
    { string: 2, fret: 0, isScaleNote: true },
    { string: 1, fret: 7, isScaleNote: true },
    // Scale notes (D)
    { string: 6, fret: 10, isScaleNote: true },
    { string: 5, fret: 5, isScaleNote: true },
    { string: 4, fret: 0, isScaleNote: true },
    { string: 3, fret: 7, isScaleNote: true },
    { string: 2, fret: 3, isScaleNote: true },
    { string: 1, fret: 10, isScaleNote: true },
  ]
};

// Example chords and their tones
const CHORDS = {
  "Am7": [
    // Root notes (A)
    { string: 5, fret: 0, isRoot: true, isChordTone: true },
    // Chord tones (C - minor third)
    { string: 3, fret: 5, isChordTone: true },
    // Chord tones (E - fifth)
    { string: 4, fret: 2, isChordTone: true },
    // Chord tones (G - minor seventh)
    { string: 6, fret: 3, isChordTone: true },
  ],
  
  "E7": [
    // Root notes (E)
    { string: 6, fret: 0, isRoot: true, isChordTone: true },
    // Chord tones (G# - major third)
    { string: 5, fret: 11, isChordTone: true },
    // Chord tones (B - fifth)
    { string: 5, fret: 2, isChordTone: true },
    // Chord tones (D - minor seventh)
    { string: 4, fret: 0, isChordTone: true },
  ]
};

const GuitarScaleDemo: React.FC = () => {
  const [selectedScale, setSelectedScale] = useState<string>("A Minor Pentatonic");
  const [selectedChord, setSelectedChord] = useState<string>("Am7");
  
  // Combine scale and chord notes to display on the fretboard
  const displayNotes: FretboardNote[] = [
    ...SCALES[selectedScale as keyof typeof SCALES],
    ...CHORDS[selectedChord as keyof typeof CHORDS]
  ];

  const handleFretboardClick = (string: number, fret: number) => {
    console.log(`Clicked on string ${string}, fret ${fret}`);
  };

  return (
    <div className="bg-sensei-card p-4 rounded-lg flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Guitar Scale & Chord Visualization</h2>
      
      <div className="flex gap-4 mb-4">
        <div>
          <label className="block text-sm mb-1">Select Scale:</label>
          <select 
            className="bg-sensei-secondary rounded p-2"
            value={selectedScale}
            onChange={(e) => setSelectedScale(e.target.value)}
          >
            {Object.keys(SCALES).map(scale => (
              <option key={scale} value={scale}>{scale}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm mb-1">Select Chord:</label>
          <select 
            className="bg-sensei-secondary rounded p-2"
            value={selectedChord}
            onChange={(e) => setSelectedChord(e.target.value)}
          >
            {Object.keys(CHORDS).map(chord => (
              <option key={chord} value={chord}>{chord}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="h-80 border border-sensei-border rounded-lg">
        <GuitarFretboardWithScaleDisplay 
          notes={displayNotes}
          onClick={handleFretboardClick}
          recommendedScale={selectedScale}
          recommendedChord={selectedChord}
        />
      </div>
      
      <div className="mt-4 text-sm text-sensei-muted-foreground">
        <p>This visualization shows how scales and chord tones work together on the guitar fretboard.</p>
        <p>• Green dots represent scale notes</p>
        <p>• Orange dots represent chord tones</p>
        <p>• Bright dots represent root notes</p>
        <p>Notice how the chord tones are part of the scale, making them harmonically compatible.</p>
      </div>
    </div>
  );
};

export default GuitarScaleDemo; 