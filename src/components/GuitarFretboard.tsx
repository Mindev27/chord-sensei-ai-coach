import { useState } from "react";

export interface FretboardNote {
  string: number; // 1-6 (6 is low E)
  fret: number;   // 0-15 (0 is open string)
  finger?: number; // 1-4 representing fingers (1=index, 4=pinky)
  isRoot?: boolean;
  isHighlighted?: boolean;
  duration?: number; // For animated solo playback
}

interface GuitarFretboardProps {
  notes: FretboardNote[];
  onClick?: (string: number, fret: number) => void;
}

const GuitarFretboard = ({ notes = [], onClick }: GuitarFretboardProps) => {
  const [hoveredPosition, setHoveredPosition] = useState<{ string: number; fret: number } | null>(null);
  
  // Guitar tuning (standard)
  const strings = ["E", "B", "G", "D", "A", "E"];
  
  // Number of frets to display
  const fretCount = 15;
  
  // Calculate fretboard dimensions
  const stringSpacing = 30; // px
  const fretSpacing = 60;   // px
  const fretboardHeight = stringSpacing * (strings.length - 1);
  const fretboardWidth = fretSpacing * fretCount;
  
  // Special fret markers (inlays)
  const markerPositions = [3, 5, 7, 9, 12];
  
  // Generate string positions (y-coordinates)
  const stringPositions = strings.map((_, index) => index * stringSpacing);
  
  // Generate fret positions (x-coordinates)
  const fretPositions = Array.from({ length: fretCount + 1 }, (_, index) => index * fretSpacing);
  
  // Handle click on fretboard position
  const handleClick = (stringIndex: number, fret: number) => {
    if (onClick) {
      // Convert to 1-indexed string numbers (1=high E, 6=low E)
      onClick(strings.length - stringIndex, fret);
    }
  };
  
  // Get note information at a specific position
  const getNoteAtPosition = (stringIndex: number, fret: number) => {
    // Convert to 1-indexed string numbers (1=high E, 6=low E)
    const stringNumber = strings.length - stringIndex;
    return notes.find(note => note.string === stringNumber && note.fret === fret);
  };
  
  // Get marker color based on note properties
  const getMarkerColor = (note: FretboardNote | undefined) => {
    if (!note) return "bg-gray-700";
    if (note.isRoot) return "bg-sensei-accent";
    if (note.isHighlighted) return "bg-blue-500";
    return "bg-gray-300";
  };

  return (
    <div className="w-full h-full bg-gray-900 overflow-auto p-4">
      <div className="flex items-center mb-4">
        <h3 className="text-lg font-medium">Guitar</h3>
        <div className="ml-auto flex gap-2 text-xs text-gray-400">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-sensei-accent mr-1"></div>
            <span>Root</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-gray-300 mr-1"></div>
            <span>Chord Tone</span>
          </div>
        </div>
      </div>
      
      <div className="relative" style={{ height: fretboardHeight, width: fretboardWidth + 40 }}>
        {/* Nut */}
        <div 
          className="absolute left-[40px] top-0 w-[4px] h-full bg-gray-400 z-20"
        ></div>
        
        {/* Strings */}
        {stringPositions.map((yPos, stringIndex) => (
          <div
            key={`string-${stringIndex}`}
            className="fretboard-string"
            style={{ 
              top: `${yPos}px`, 
              left: '40px',
              height: stringIndex === 0 || stringIndex === strings.length - 1 ? '1px' : '2px',
              opacity: 1 - stringIndex * 0.1
            }}
          ></div>
        ))}
        
        {/* Frets */}
        {fretPositions.map((xPos, fretIndex) => (
          <div
            key={`fret-${fretIndex}`}
            className="fretboard-fret"
            style={{ 
              left: `${xPos + 40}px`,
              display: fretIndex === 0 ? 'none' : 'block'
            }}
          ></div>
        ))}
        
        {/* Fret markers (inlays) */}
        {markerPositions.map(fret => (
          <div
            key={`marker-${fret}`}
            className="absolute bg-gray-700 rounded-full"
            style={{
              width: fret === 12 ? '24px' : '12px',
              height: fret === 12 ? '24px' : '12px',
              left: `${40 + fretSpacing * fret - fretSpacing / 2}px`,
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {fret === 12 && (
              <div className="absolute bg-gray-700 rounded-full" style={{width: '12px', height: '12px', top: '-20px'}}></div>
            )}
          </div>
        ))}
        
        {/* String labels */}
        {strings.map((note, stringIndex) => (
          <div
            key={`label-${stringIndex}`}
            className="absolute font-mono text-xs text-gray-400"
            style={{
              left: '15px',
              top: `${stringIndex * stringSpacing - 8}px`,
            }}
          >
            {note}
          </div>
        ))}
        
        {/* Fret numbers */}
        {Array.from({ length: fretCount }, (_, i) => i + 1).map(fretNum => (
          <div
            key={`fretnum-${fretNum}`}
            className="absolute font-mono text-xs text-gray-500"
            style={{
              left: `${40 + fretSpacing * fretNum - fretSpacing / 2}px`,
              top: `${fretboardHeight + 8}px`,
              transform: 'translateX(-50%)'
            }}
          >
            {fretNum}
          </div>
        ))}
        
        {/* Note markers */}
        {stringPositions.map((yPos, stringIndex) => (
          Array.from({ length: fretCount + 1 }, (_, fretIndex) => {
            const note = getNoteAtPosition(stringIndex, fretIndex);
            if (!note) return null;
            
            const xPos = fretIndex === 0 
              ? 30 // Open string position
              : 40 + fretSpacing * fretIndex - fretSpacing / 2; // Fretted position
            
            return (
              <div
                key={`note-${stringIndex}-${fretIndex}`}
                className={`fretboard-dot ${getMarkerColor(note)} text-black`}
                style={{
                  left: `${xPos}px`,
                  top: `${yPos - 12}px`,
                }}
                onClick={() => handleClick(stringIndex, fretIndex)}
                onMouseEnter={() => setHoveredPosition({ string: stringIndex, fret: fretIndex })}
                onMouseLeave={() => setHoveredPosition(null)}
              >
                {note.finger && <span>{note.finger}</span>}
              </div>
            );
          })
        ))}
      </div>
    </div>
  );
};

export default GuitarFretboard;
