import React, { useState } from "react";
import GuitarFretboardWithScaleDisplay, { ScaleNote } from "./GuitarFretboardWithScaleDisplay";

// Define note names in order
const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// Define chord shapes for popular chords
interface ChordDefinition {
  root: string;
  notes: string[];
  type: string;
  symbol: string;
  fretMarkers: {
    string: number;
    fret: number;
    finger?: number;
  }[];
}

const CHORD_DEFINITIONS: Record<string, ChordDefinition> = {
  "C": {
    root: "C",
    notes: ["C", "E", "G"],
    type: "major",
    symbol: "C",
    fretMarkers: [
      { string: 5, fret: 3, finger: 3 },
      { string: 4, fret: 2, finger: 2 },
      { string: 3, fret: 0 },
      { string: 2, fret: 1, finger: 1 },
      { string: 1, fret: 0 }
    ]
  },
  "G": {
    root: "G",
    notes: ["G", "B", "D"],
    type: "major",
    symbol: "G",
    fretMarkers: [
      { string: 6, fret: 3, finger: 3 },
      { string: 5, fret: 2, finger: 2 },
      { string: 4, fret: 0 },
      { string: 3, fret: 0 },
      { string: 2, fret: 0 },
      { string: 1, fret: 3, finger: 4 }
    ]
  },
  "E7": {
    root: "E",
    notes: ["E", "G#", "B", "D"],
    type: "dominant seventh",
    symbol: "E7",
    fretMarkers: [
      { string: 6, fret: 0 },
      { string: 5, fret: 2, finger: 2 },
      { string: 4, fret: 0 },
      { string: 3, fret: 1, finger: 1 },
      { string: 2, fret: 0 },
      { string: 1, fret: 0 }
    ]
  },
  "Am": {
    root: "A",
    notes: ["A", "C", "E"],
    type: "minor",
    symbol: "Am",
    fretMarkers: [
      { string: 5, fret: 0 },
      { string: 4, fret: 2, finger: 2 },
      { string: 3, fret: 2, finger: 3 },
      { string: 2, fret: 1, finger: 1 },
      { string: 1, fret: 0 }
    ]
  }
};

// Define scale definitions
const SCALE_DEFINITIONS: Record<string, { root: string, notes: string[], description: string }> = {
  "E Blues": {
    root: "E",
    notes: ["E", "G", "A", "Bb", "B", "D"],
    description: "Blues Scale"
  },
  "C Major": {
    root: "C",
    notes: ["C", "D", "E", "F", "G", "A", "B"],
    description: "Major Scale"
  },
  "G Mixolydian": {
    root: "G",
    notes: ["G", "A", "B", "C", "D", "E", "F"],
    description: "Mixolydian Mode"
  },
  "A Minor Pentatonic": {
    root: "A",
    notes: ["A", "C", "D", "E", "G"],
    description: "Minor Pentatonic"
  }
};

// Chord progression examples
const PROGRESSIONS = [
  {
    name: "Don't Look Back in Anger - Oasis",
    chords: ["C", "G", "Am", "E7", "G", "C"],
    recommendedScale: "C Major"
  },
  {
    name: "Blues in E",
    chords: ["E7", "E7", "E7", "E7", "A7", "A7", "E7", "E7", "B7", "A7", "E7", "B7"],
    recommendedScale: "E Blues"
  },
  {
    name: "50s Progression",
    chords: ["C", "Am", "F", "G", "C"],
    recommendedScale: "C Major"
  }
];

// Generate fretboard notes for a given chord and scale
const generateFretboardNotes = (
  chordSymbol: string, 
  scaleKey: string
): ScaleNote[] => {
  const chord = CHORD_DEFINITIONS[chordSymbol];
  const scale = SCALE_DEFINITIONS[scaleKey];
  
  if (!chord || !scale) return [];
  
  const notes: ScaleNote[] = [];
  
  // Standard guitar tuning from 6th string (low E) to 1st string (high E)
  const tuning = [4, 11, 7, 2, 9, 4]; // E, A, D, G, B, E (as indices in NOTES array)
  
  // Generate scale notes for each string
  for (let stringNum = 1; stringNum <= 6; stringNum++) {
    const openNoteIndex = tuning[6 - stringNum]; // Convert to 0-based index and invert
    
    // For each fret on the current string (0-15)
    for (let fret = 0; fret <= 15; fret++) {
      // Calculate the note at this position
      const noteIndex = (openNoteIndex + fret) % 12;
      const noteName = NOTES[noteIndex];
      
      // Create a note if it's in the scale
      if (scale.notes.includes(noteName)) {
        notes.push({
          string: stringNum,
          fret: fret,
          isRoot: noteName === scale.root,
          isScaleNote: true,
          // Mark as chord tone if it's in the chord
          isChordTone: chord.notes.includes(noteName)
        });
      }
      // Add chord tones that might not be in the scale
      else if (chord.notes.includes(noteName)) {
        notes.push({
          string: stringNum,
          fret: fret,
          isRoot: noteName === chord.root,
          isChordTone: true
        });
      }
    }
  }
  
  return notes;
};

// Simple chord diagram component
const ChordDiagram: React.FC<{ 
  chordSymbol: string, 
  isHighlighted: boolean, 
  label: string 
}> = ({ chordSymbol, isHighlighted, label }) => {
  if (!CHORD_DEFINITIONS[chordSymbol]) return null;
  
  const chord = CHORD_DEFINITIONS[chordSymbol];
  
  return (
    <div className={`flex flex-col items-center ${isHighlighted ? "border-2 border-orange-500 rounded-lg" : ""}`}>
      <div className="text-center mb-1 text-sm text-gray-400">{label}</div>
      <div className="text-center font-bold text-xl mb-2">{chordSymbol}</div>
      
      <div className="relative w-20 h-24 bg-gray-800 rounded border border-gray-700">
        {/* Frets */}
        {[0, 1, 2, 3, 4].map((fret) => (
          <div 
            key={`fret-${fret}`}
            className="absolute w-full h-px bg-gray-600"
            style={{ top: `${fret * 20 + 20}%` }}
          />
        ))}
        
        {/* Strings */}
        {[0, 1, 2, 3, 4, 5].map((string) => (
          <div 
            key={`string-${string}`}
            className="absolute h-full w-px bg-gray-400"
            style={{ left: `${string * 20 + 10}%` }}
          />
        ))}
        
        {/* Finger positions */}
        {chord.fretMarkers.map((marker, idx) => {
          const stringPos = 6 - marker.string; // Invert string number (6 is leftmost)
          return (
            <div
              key={`marker-${idx}`}
              className="absolute flex items-center justify-center rounded-full bg-orange-400 text-xs text-black font-bold"
              style={{
                width: "16px",
                height: "16px",
                left: `${stringPos * 20 + 2}%`,
                top: marker.fret === 0 
                  ? "5%" 
                  : `${marker.fret * 20 + 10}%`
              }}
            >
              {marker.finger || ""}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ChordProgressionVisualizer: React.FC = () => {
  const [selectedProgression, setSelectedProgression] = useState(0);
  const [currentChordIndex, setCurrentChordIndex] = useState(0);
  
  const progression = PROGRESSIONS[selectedProgression];
  const currentChord = progression.chords[currentChordIndex];
  const prevChord = progression.chords[(currentChordIndex - 1 + progression.chords.length) % progression.chords.length];
  const nextChord = progression.chords[(currentChordIndex + 1) % progression.chords.length];
  
  // Generate fretboard notes for the current chord and scale
  const fretboardNotes = generateFretboardNotes(
    currentChord, 
    progression.recommendedScale
  );
  
  return (
    <div className="bg-sensei-card p-6 rounded-lg">
      
      {/* Full chord progression display */}
      <div className="mb-4 p-3 bg-gray-800 rounded-lg">
        <div className="text-sm text-gray-400 mb-2">전체 코드 진행:</div>
        <div className="flex flex-wrap gap-2">
          {progression.chords.map((chord, idx) => (
            <button
              key={idx}
              className={`px-3 py-1 rounded-full text-sm font-medium 
                ${idx === currentChordIndex 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              onClick={() => setCurrentChordIndex(idx)}
            >
              {chord}
            </button>
          ))}
        </div>
      </div>
      
      {/* Current chord section */}
      <div className="mb-6">
        <div className="flex justify-center mb-4">
          <div className="flex gap-8 items-end">
            <ChordDiagram 
              chordSymbol={prevChord} 
              isHighlighted={false}
              label="이전 코드" 
            />
            <ChordDiagram 
              chordSymbol={currentChord} 
              isHighlighted={true}
              label="현재 코드" 
            />
            <ChordDiagram 
              chordSymbol={nextChord} 
              isHighlighted={false}
              label="다음 코드" 
            />
          </div>
        </div>
        
        <div className="flex justify-center gap-4 mb-4">
          <button 
            className="bg-sensei-secondary hover:bg-sensei-secondary/80 p-2 rounded"
            onClick={() => setCurrentChordIndex((currentChordIndex - 1 + progression.chords.length) % progression.chords.length)}
          >
            이전
          </button>
          <div className="px-4 py-2 bg-gray-800 rounded">
            {currentChordIndex + 1} / {progression.chords.length}
          </div>
          <button 
            className="bg-sensei-secondary hover:bg-sensei-secondary/80 p-2 rounded"
            onClick={() => setCurrentChordIndex((currentChordIndex + 1) % progression.chords.length)}
          >
            다음
          </button>
        </div>
      </div>
      
      <div className="mb-3">
        <div className="flex justify-between mb-2">
          <div className="text-sm text-gray-400">
            현재 코드: <span className="text-white font-medium">{currentChord}</span>
          </div>
          <div className="text-sm text-gray-400">
            추천 스케일: <span className="text-green-400 font-medium">{progression.recommendedScale}</span>
          </div>
        </div>
        
        <div className="h-80 border border-sensei-border rounded-lg">
          <GuitarFretboardWithScaleDisplay 
            notes={fretboardNotes}
            recommendedScale={progression.recommendedScale}
            recommendedChord={currentChord}
          />
        </div>
      </div>
      
      <div className="mt-4 text-sm text-sensei-muted-foreground">
        <p>위의 가상 기타 넥에서 다음을 확인할 수 있습니다:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li><span className="inline-block w-3 h-3 rounded-full bg-sensei-accent mx-1"></span>루트 음: 코드의 기본음</li>
          <li><span className="inline-block w-3 h-3 rounded-full bg-orange-400 mx-1"></span>코드 톤: 현재 코드를 구성하는 음</li>
          <li><span className="inline-block w-3 h-3 rounded-full bg-green-400 mx-1"></span>스케일 음: 추천 스케일에 포함된 음</li>
        </ul>
        <p className="mt-2">
          코드 톤과 스케일 음이 교차되는 부분에서는 코드 톤이 우선적으로 표시됩니다. 
          화살표를 클릭하여 코드 진행을 따라가 보세요.
        </p>
      </div>
    </div>
  );
};

export default ChordProgressionVisualizer; 