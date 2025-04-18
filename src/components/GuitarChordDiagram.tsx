import React from "react";

export interface ChordFret {
  string: number; // 1-6 (1=high E, 6=low E)
  fret: number;   // 0-24 (0=open string, X=muted)
  finger?: number; // 1-4 representing fingers (1=index, 4=pinky)
  isRoot?: boolean;
}

interface GuitarChordDiagramProps {
  chordName: string;
  positions: ChordFret[];
  compact?: boolean; // Add compact mode option
}

const GuitarChordDiagram: React.FC<GuitarChordDiagramProps> = ({ 
  chordName, 
  positions,
  compact = false
}) => {
  const strings = 6;
  const frets = 5;  // Show 5 frets in the diagram
  const startFret = positions.length > 0 ? 
    Math.max(1, Math.min(...positions.filter(p => p.fret > 0).map(p => p.fret))) : 1;
  
  // Find the highest displayed fret
  const endFret = Math.min(startFret + frets - 1, 
    positions.length > 0 ? 
      Math.max(...positions.map(p => p.fret)) : startFret + frets - 1);
  
  // Adjust dimensions for compact mode
  const width = compact ? 50 : 80;
  const height = compact ? 60 : 100;
  const fretSpacing = compact ? 12 : 20;
  const stringSpacing = compact ? 10 : 16;
  const dotSize = compact ? 8 : 12;
  
  return (
    <div className={`guitar-chord-diagram flex flex-col items-center ${compact ? 'scale-90' : ''}`}>
      {!compact && <div className="text-lg font-bold mb-4">{chordName}</div>}
      <div className="relative" style={{ 
        width: `${width}px`, 
        height: `${height}px`, 
        marginTop: compact ? '10px' : '20px' 
      }}>
        {/* Chord position indicator (if starting above 1st fret) */}
        {startFret > 1 && (
          <div className={`absolute text-xs text-gray-400 left-[-${compact ? 15 : 20}px] top-[10px]`}>
            {startFret}
          </div>
        )}
        
        {/* Horizontal fret lines */}
        {Array.from({ length: frets }, (_, i) => (
          <div 
            key={`fret-${i}`}
            className={`absolute w-full h-[1px] bg-gray-400`}
            style={{ top: `${fretSpacing * i}px` }}
          ></div>
        ))}
        
        {/* Vertical string lines */}
        {Array.from({ length: strings }, (_, i) => (
          <div 
            key={`string-${i}`}
            className="absolute w-[1px] bg-gray-400"
            style={{ 
              left: `${stringSpacing * i}px`, 
              top: '0px',
              height: `${height - 20}px`
            }}
          ></div>
        ))}
        
        {/* String status at nut (open, muted) */}
        {Array.from({ length: strings }, (_, i) => {
          const stringNum = strings - i;
          const pos = positions.find(p => p.string === stringNum);
          
          // Skip if the position is fretted (not open or muted)
          if (pos && pos.fret > 0) return null;
          
          // Determine if string is muted or open
          const isMuted = pos && pos.fret === -1;
          const isOpen = pos && pos.fret === 0;
          
          return (
            <div 
              key={`nut-${i}`}
              className="absolute flex items-center justify-center text-sm"
              style={{ 
                left: `${stringSpacing * i - (compact ? 4 : 6)}px`, 
                top: '-15px',
                width: compact ? '8px' : '12px',
                height: compact ? '8px' : '12px'
              }}
            >
              {isMuted && <span className={`text-gray-400 ${compact ? 'text-xs' : 'text-sm'}`}>✕</span>}
              {isOpen && <div className={`rounded-full border-2 border-gray-400`} style={{
                width: compact ? '8px' : '16px',
                height: compact ? '8px' : '16px'
              }}></div>}
            </div>
          );
        })}
        
        {/* Finger positions */}
        {positions.filter(p => p.fret > 0).map((pos, i) => {
          const stringIdx = strings - pos.string;
          const relFret = pos.fret - startFret;
          
          // Skip if the fret is outside our display range
          if (relFret < 0 || relFret >= frets) return null;
          
          return (
            <div 
              key={`dot-${i}`}
              className={`absolute flex items-center justify-center rounded-full 
                ${pos.isRoot ? 'bg-sensei-accent' : 'bg-gray-300'} ${compact ? 'text-[8px]' : 'text-xs'} font-medium text-black`}
              style={{ 
                width: compact ? '10px' : '16px',
                height: compact ? '10px' : '16px',
                left: `${stringSpacing * stringIdx - (compact ? 5 : 8)}px`, 
                top: `${fretSpacing * relFret - (compact ? 5 : 10)}px`,
              }}
            >
              {pos.finger && pos.finger}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GuitarChordDiagram; 