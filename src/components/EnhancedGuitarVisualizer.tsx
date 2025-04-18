import React, { useState } from "react";
import GuitarFretboardWithScaleDisplay, { ScaleNote } from "./GuitarFretboardWithScaleDisplay";

// Define note names in order
const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// Chord definitions
const CHORD_TYPES = {
  "E7": {
    root: "E",
    notes: ["E", "G#", "B", "D"],
    description: "E Dominant 7th (E7)"
  },
  "Am7": {
    root: "A",
    notes: ["A", "C", "E", "G"],
    description: "A Minor 7th (Am7)"
  },
  "Cmaj7": {
    root: "C",
    notes: ["C", "E", "G", "B"],
    description: "C Major 7th (Cmaj7)"
  },
  "G7": {
    root: "G",
    notes: ["G", "B", "D", "F"],
    description: "G Dominant 7th (G7)"
  },
  "Dm7": {
    root: "D",
    notes: ["D", "F", "A", "C"],
    description: "D Minor 7th (Dm7)"
  }
};

// Scale definitions
const SCALE_TYPES = {
  "E Blues": {
    root: "E",
    notes: ["E", "G", "A", "Bb", "B", "D"],
    description: "E Blues Scale"
  },
  "A Minor Pentatonic": {
    root: "A",
    notes: ["A", "C", "D", "E", "G"],
    description: "A Minor Pentatonic Scale"
  },
  "C Major": {
    root: "C",
    notes: ["C", "D", "E", "F", "G", "A", "B"],
    description: "C Major Scale"
  },
  "G Mixolydian": {
    root: "G",
    notes: ["G", "A", "B", "C", "D", "E", "F"],
    description: "G Mixolydian Mode"
  },
  "D Dorian": {
    root: "D",
    notes: ["D", "E", "F", "G", "A", "B", "C"],
    description: "D Dorian Mode"
  }
};

// Generate fretboard notes for a given chord
const generateChordNotes = (chordType: string): ScaleNote[] => {
  if (!CHORD_TYPES[chordType as keyof typeof CHORD_TYPES]) return [];
  
  const chord = CHORD_TYPES[chordType as keyof typeof CHORD_TYPES];
  const notes: ScaleNote[] = [];
  
  // Standard guitar tuning from 6th string (low E) to 1st string (high E)
  const tuning = [4, 11, 7, 2, 9, 4]; // E, A, D, G, B, E (as indices in NOTES array)
  
  // Generate notes for each string
  for (let stringNum = 1; stringNum <= 6; stringNum++) {
    const stringIndex = stringNum - 1;
    const openNoteIndex = tuning[6 - stringNum]; // Convert to 0-based index and invert
    
    // For each fret on the current string
    for (let fret = 0; fret <= 15; fret++) {
      // Calculate the note at this position
      const noteIndex = (openNoteIndex + fret) % 12;
      const noteName = NOTES[noteIndex];
      
      // Check if this note is part of the chord
      if (chord.notes.includes(noteName)) {
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

// Generate fretboard notes for a given scale
const generateScaleNotes = (scaleType: string): ScaleNote[] => {
  if (!SCALE_TYPES[scaleType as keyof typeof SCALE_TYPES]) return [];
  
  const scale = SCALE_TYPES[scaleType as keyof typeof SCALE_TYPES];
  const notes: ScaleNote[] = [];
  
  // Standard guitar tuning from 6th string (low E) to 1st string (high E)
  const tuning = [4, 11, 7, 2, 9, 4]; // E, A, D, G, B, E (as indices in NOTES array)
  
  // Generate notes for each string
  for (let stringNum = 1; stringNum <= 6; stringNum++) {
    const stringIndex = stringNum - 1;
    const openNoteIndex = tuning[6 - stringNum]; // Convert to 0-based index and invert
    
    // For each fret on the current string
    for (let fret = 0; fret <= 15; fret++) {
      // Calculate the note at this position
      const noteIndex = (openNoteIndex + fret) % 12;
      const noteName = NOTES[noteIndex];
      
      // Check if this note is part of the scale
      if (scale.notes.includes(noteName)) {
        notes.push({
          string: stringNum,
          fret: fret,
          isRoot: noteName === scale.root,
          isScaleNote: true
        });
      }
    }
  }
  
  return notes;
};

// Simple music staff visualization component
const StaffNotation: React.FC<{ notes: string[], rootNote: string }> = ({ notes, rootNote }) => {
  return (
    <div className="mt-4 p-4 bg-white text-black rounded-lg">
      <h3 className="text-center font-bold mb-2">Staff Notation</h3>
      <div className="relative h-32 border-t border-b border-black">
        {/* Staff lines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <div 
            key={`line-${i}`} 
            className="absolute w-full h-px bg-black"
            style={{ top: `${20 + i * 10}px` }}
          />
        ))}
        
        {/* Notes representation - simplified */}
        <div className="flex justify-around pt-10">
          {notes.map((note, i) => (
            <div 
              key={`note-${i}`} 
              className={`w-8 h-8 rounded-full flex items-center justify-center
                ${note === rootNote ? 'bg-orange-500' : 'bg-black'} text-white font-bold`}
            >
              {note}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Simple keyboard visualization component
const KeyboardVisualizer: React.FC<{ notes: string[], rootNote: string }> = ({ notes, rootNote }) => {
  // One octave of piano keys
  const keys = [
    { note: "C", type: "white" },
    { note: "C#", type: "black" },
    { note: "D", type: "white" },
    { note: "D#", type: "black" },
    { note: "E", type: "white" },
    { note: "F", type: "white" },
    { note: "F#", type: "black" },
    { note: "G", type: "white" },
    { note: "G#", type: "black" },
    { note: "A", type: "white" },
    { note: "A#", type: "black" },
    { note: "B", type: "white" }
  ];
  
  return (
    <div className="mt-4 p-4 bg-gray-800 rounded-lg">
      <h3 className="text-center font-bold mb-2">Keyboard</h3>
      <div className="relative h-40">
        <div className="flex h-full">
          {/* White keys */}
          {keys.filter(key => key.type === "white").map((key, i) => (
            <div 
              key={`white-${i}`}
              className={`relative flex-1 border border-gray-600 
                ${notes.includes(key.note) 
                  ? (key.note === rootNote 
                    ? 'bg-orange-500' 
                    : 'bg-green-400') 
                  : 'bg-white'}`}
            >
              <div className="absolute bottom-2 w-full text-center text-xs font-bold 
                  ${notes.includes(key.note) && key.note !== rootNote ? 'text-white' : 'text-black'}">
                {key.note}
              </div>
            </div>
          ))}
          
          {/* Black keys */}
          <div className="absolute top-0 left-0 w-full h-24 flex">
            {keys.map((key, i) => {
              if (key.type === "black") {
                // Find position relative to white keys
                const whiteKeysBeforeThis = keys.slice(0, i).filter(k => k.type === "white").length;
                const offset = whiteKeysBeforeThis + 0.65;
                const width = 0.7;
                
                return (
                  <div
                    key={`black-${i}`}
                    className={`absolute h-full border border-gray-700 
                      ${notes.includes(key.note) 
                        ? (key.note === rootNote 
                          ? 'bg-orange-500' 
                          : 'bg-green-400') 
                        : 'bg-black'}`}
                    style={{
                      left: `${offset * (100 / 7)}%`,
                      width: `${width * (100 / 7)}%`
                    }}
                  >
                    <div className="absolute bottom-2 w-full text-center text-xs font-bold text-white">
                      {key.note}
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const EnhancedGuitarVisualizer: React.FC = () => {
  const [selectedChord, setSelectedChord] = useState<string>("E7");
  const [selectedScale, setSelectedScale] = useState<string>("E Blues");
  const [displayMode, setDisplayMode] = useState<"all" | "chord" | "scale">("all");
  
  // Get current chord and scale data
  const currentChord = CHORD_TYPES[selectedChord as keyof typeof CHORD_TYPES];
  const currentScale = SCALE_TYPES[selectedScale as keyof typeof SCALE_TYPES];
  
  // Generate notes for display
  const chordNotes = generateChordNotes(selectedChord);
  const scaleNotes = generateScaleNotes(selectedScale);
  
  // Combine notes based on display mode
  let displayNotes: ScaleNote[] = [];
  if (displayMode === "all") {
    displayNotes = [...scaleNotes, ...chordNotes];
  } else if (displayMode === "chord") {
    displayNotes = chordNotes;
  } else {
    displayNotes = scaleNotes;
  }

  return (
    <div className="bg-sensei-card p-6 rounded-lg flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">음악 시각화 도구</h2>
        <div className="flex flex-wrap gap-4 mb-4">
          <div>
            <label className="block text-sm mb-1">코드 선택:</label>
            <select 
              className="bg-sensei-secondary rounded p-2 min-w-[120px]"
              value={selectedChord}
              onChange={(e) => setSelectedChord(e.target.value)}
            >
              {Object.keys(CHORD_TYPES).map(chord => (
                <option key={chord} value={chord}>{chord}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm mb-1">스케일 선택:</label>
            <select 
              className="bg-sensei-secondary rounded p-2 min-w-[120px]"
              value={selectedScale}
              onChange={(e) => setSelectedScale(e.target.value)}
            >
              {Object.keys(SCALE_TYPES).map(scale => (
                <option key={scale} value={scale}>{scale}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm mb-1">표시 모드:</label>
            <select 
              className="bg-sensei-secondary rounded p-2"
              value={displayMode}
              onChange={(e) => setDisplayMode(e.target.value as "all" | "chord" | "scale")}
            >
              <option value="all">코드 + 스케일</option>
              <option value="chord">코드만</option>
              <option value="scale">스케일만</option>
            </select>
          </div>
        </div>

        {/* Current selections info */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="bg-gray-800 p-3 rounded-lg flex-1">
            <h3 className="font-medium text-orange-400 mb-1">선택된 코드: {currentChord.description}</h3>
            <div className="flex gap-2">
              {currentChord.notes.map((note, i) => (
                <span 
                  key={`chord-note-${i}`} 
                  className={`px-2 py-1 rounded ${note === currentChord.root ? 'bg-orange-500' : 'bg-orange-400/70'}`}
                >
                  {note}
                </span>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-800 p-3 rounded-lg flex-1">
            <h3 className="font-medium text-green-400 mb-1">선택된 스케일: {currentScale.description}</h3>
            <div className="flex flex-wrap gap-2">
              {currentScale.notes.map((note, i) => (
                <span 
                  key={`scale-note-${i}`} 
                  className={`px-2 py-1 rounded ${note === currentScale.root ? 'bg-green-500' : 'bg-green-400/70'}`}
                >
                  {note}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Fretboard visualization */}
      <div className="h-80 border border-sensei-border rounded-lg">
        <GuitarFretboardWithScaleDisplay 
          notes={displayNotes}
          recommendedScale={selectedScale}
          recommendedChord={selectedChord}
          maxFrets={15}
          showLabels={true}
        />
      </div>
      
      {/* Additional visualizations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StaffNotation 
          notes={displayMode === "chord" ? currentChord.notes : 
                 displayMode === "scale" ? currentScale.notes : 
                 [...new Set([...currentChord.notes, ...currentScale.notes])]}
          rootNote={displayMode === "chord" ? currentChord.root : 
                    displayMode === "scale" ? currentScale.root :
                    currentChord.root}
        />
        
        <KeyboardVisualizer 
          notes={displayMode === "chord" ? currentChord.notes : 
                 displayMode === "scale" ? currentScale.notes : 
                 [...new Set([...currentChord.notes, ...currentScale.notes])]}
          rootNote={displayMode === "chord" ? currentChord.root : 
                    displayMode === "scale" ? currentScale.root :
                    currentChord.root}
        />
      </div>
      
      <div className="mt-2 text-sm text-sensei-muted-foreground">
        <h3 className="font-medium mb-1">범례:</h3>
        <div className="flex gap-4">
          <p className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-sensei-accent mr-1"></span>
            루트 음
          </p>
          <p className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-orange-400 mr-1"></span>
            코드 톤
          </p>
          <p className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-green-400 mr-1"></span>
            스케일 음
          </p>
        </div>
        <p className="mt-2">코드와 스케일이 어떻게 연관되는지 볼 수 있습니다. 특히 E7 코드와 E Blues 스케일이 함께 사용될 때 어떤 사운드를 만들어내는지 살펴보세요.</p>
      </div>
    </div>
  );
};

export default EnhancedGuitarVisualizer; 