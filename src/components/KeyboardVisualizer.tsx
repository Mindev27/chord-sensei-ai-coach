import React from 'react';

interface KeyboardVisualizerProps {
  notes: string[];
  rootNote: string;
  chordNotes: string[];
}

const KeyboardVisualizer: React.FC<KeyboardVisualizerProps> = ({ 
  notes = [], 
  rootNote = "", 
  chordNotes = []
}) => {
  // Piano keys - standard 2 octave (24 keys)
  const whiteKeyNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const blackKeyNames = ['C#', 'D#', '', 'F#', 'G#', 'A#', '', 'C#', 'D#', '', 'F#', 'G#', 'A#', ''];
  
  // 불협화음 목록 (현재 코드에 따라 다르게 설정할 수 있음)
  // 일반적으로 주요 7도, 증4도/감5도 등이 불협화음으로 간주됨
  const dissonantNotes: Record<string, string[]> = {
    'C': ['F#', 'B'],
    'D': ['G#', 'C#'],
    'E': ['A#', 'D#'],
    'F': ['B', 'E'],
    'G': ['C#', 'F#'],
    'A': ['D#', 'G#'],
    'B': ['F', 'A#'],
    'C#': ['G', 'C'],
    'D#': ['A', 'D'],
    'E#': ['B', 'E'],
    'F#': ['C', 'F'],
    'G#': ['D', 'G'],
    'A#': ['E', 'A']
  };
  
  // 현재 루트에 따른 불협화음 가져오기
  const currentDissonantNotes = dissonantNotes[rootNote] || [];
  
  // Check if a note belongs to scale or chord, but not dissonant
  const isInScale = (note: string) => notes.includes(note) && !currentDissonantNotes.includes(note);
  const isInChord = (note: string) => chordNotes.includes(note);
  const isRoot = (note: string) => note === rootNote;
  
  // Get key color based on note properties
  const getKeyColor = (note: string) => {
    if (isRoot(note)) return "bg-sensei-accent"; // Root note
    if (isInChord(note)) return "bg-orange-400"; // Chord tone
    if (isInScale(note)) return "bg-green-400"; // Scale note (excluding dissonant notes)
    return ""; // Default color
  };

  return (
    <div className="w-full h-full bg-gray-900 p-4">
      <div className="flex items-center mb-4">
        <h3 className="text-lg font-medium">Piano</h3>
        
        <div className="ml-auto flex gap-2 text-xs text-gray-400">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-sensei-accent mr-1"></div>
            <span>루트</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-orange-400 mr-1"></div>
            <span>코드 톤</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-400 mr-1"></div>
            <span>협화음</span>
          </div>
        </div>
      </div>
      
      <div className="relative w-full h-48">
        <div className="absolute inset-0 flex">
          {/* White keys */}
          {whiteKeyNames.map((noteName, index) => (
            <div
              key={`white-key-${index}`}
              className={`flex-1 border border-gray-700 rounded-b-md flex flex-col justify-end items-center pb-2 ${
                getKeyColor(noteName) || "bg-white text-black hover:bg-gray-100"
              }`}
            >
              <span className={`text-xs ${getKeyColor(noteName) ? "text-white" : "text-black"}`}>{noteName}</span>
            </div>
          ))}
        </div>
        
        {/* Black keys */}
        <div className="absolute inset-0 flex">
          {blackKeyNames.map((noteName, index) => (
            noteName !== "" && (
              <div
                key={`black-key-${index}`}
                className={`absolute h-3/5 w-8 rounded-b-md z-10 ${
                  getKeyColor(noteName) || "bg-black hover:bg-gray-800"
                }`}
                style={{ 
                  left: `calc(${(index / blackKeyNames.length) * 100}% + 1.5%)`,
                  marginLeft: index % 7 === 2 || index % 7 === 6 ? "0.6rem" : "0"
                }}
              >
                <span className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-white">
                  {noteName}
                </span>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default KeyboardVisualizer; 