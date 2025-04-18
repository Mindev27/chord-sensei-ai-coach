import React from "react";

export interface ChordPosition {
  frets: number[];  // 6 strings from low E to high E
  fingers: number[]; // finger numbers (1-4) or 0 for open strings
  baseFret: number;  // starting fret position
  barres?: number[]; // fret numbers where a barre chord is applied
}

// ChordFret 인터페이스 추가
export interface ChordFret {
  string: number; // 1-6 (1=high E, 6=low E)
  fret: number;   // 0-24 (0=open string, X=muted)
  finger?: number; // 1-4 representing fingers (1=index, 4=pinky)
  isRoot?: boolean;
}

interface GuitarChordDiagramProps {
  chordName: string;
  positions: ChordPosition[];
}

const GuitarChordDiagram: React.FC<GuitarChordDiagramProps> = ({ chordName, positions }) => {
  // Use the first position if available
  const position = positions && positions.length > 0 ? positions[0] : null;
  
  if (!position) {
    return <div className="text-center text-gray-400">No chord data</div>;
  }
  
  const { frets, fingers, baseFret, barres = [] } = position;
  
  // Number of frets to display (usually 4 or 5)
  const numFrets = 5;
  // Number of strings (standard guitar has 6)
  const numStrings = 6;
  
  return (
    <div className="guitar-chord-diagram flex flex-col items-center">
      <div className="text-center text-sm font-medium mb-1">{chordName}</div>
      
      <div className="relative w-24 h-28">
        {/* Fret board background */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {/* Fret lines */}
          {Array.from({ length: numFrets }).map((_, i) => (
            <div 
              key={`fret-${i}`} 
              className={`w-full h-px bg-gray-500 ${i === 0 && baseFret === 1 ? 'h-1 bg-gray-300' : ''}`} 
            />
          ))}
        </div>
        
        {/* String lines */}
        <div className="absolute inset-0 flex justify-between">
          {Array.from({ length: numStrings }).map((_, i) => (
            <div key={`string-${i}`} className="h-full w-px bg-gray-500" />
          ))}
        </div>
        
        {/* Finger positions */}
        <div className="absolute inset-0 grid grid-cols-6 grid-rows-5 gap-0">
          {frets.map((fret, stringIndex) => {
            // Skip if string is not played (X)
            if (fret === -1) return null;
            
            // Position in the diagram
            const row = fret === 0 ? 0 : (fret - baseFret + 1);
            const col = stringIndex;
            
            if (row < 0 || row >= numFrets) return null;
            
            return (
              <div 
                key={`finger-${stringIndex}`}
                className="relative flex items-center justify-center"
                style={{
                  gridColumn: col + 1,
                  gridRow: row + 1,
                }}
              >
                <div className="absolute w-5 h-5 bg-sensei-accent rounded-full flex items-center justify-center">
                  <span className="text-xs text-white">{fingers[stringIndex] || ''}</span>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* String labels (X or O for open strings) */}
        <div className="absolute top-0 transform -translate-y-6 w-full flex justify-between px-1">
          {frets.map((fret, index) => (
            <div key={`label-${index}`} className="text-xs">
              {fret === -1 ? 'X' : fret === 0 ? 'O' : ''}
            </div>
          ))}
        </div>
        
        {/* Base fret label */}
        {baseFret > 1 && (
          <div className="absolute left-0 top-2 transform -translate-x-5 text-xs">
            {baseFret}fr
          </div>
        )}
      </div>
    </div>
  );
};

export default GuitarChordDiagram; 