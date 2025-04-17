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
}

const GuitarChordDiagram: React.FC<GuitarChordDiagramProps> = ({ 
  chordName, 
  positions 
}) => {
  const strings = 6;
  const frets = 5;  // Show 5 frets in the diagram
  const startFret = positions.length > 0 ? 
    Math.max(1, Math.min(...positions.filter(p => p.fret > 0).map(p => p.fret))) : 1;
  
  // Find the highest displayed fret
  const endFret = Math.min(startFret + frets - 1, 
    positions.length > 0 ? 
      Math.max(...positions.map(p => p.fret)) : startFret + frets - 1);
  
  return (
    <div className="guitar-chord-diagram flex flex-col items-center">
      <div className="text-lg font-bold mb-4">{chordName}</div>
      <div className="relative" style={{ width: '80px', height: '100px', marginTop: '20px' }}>
        {/* Chord position indicator (if starting above 1st fret) */}
        {startFret > 1 && (
          <div className="absolute text-xs text-gray-400 left-[-20px] top-[10px]">
            {startFret}
          </div>
        )}
        
        {/* Horizontal fret lines */}
        {Array.from({ length: frets }, (_, i) => (
          <div 
            key={`fret-${i}`}
            className={`absolute w-full h-[1px] bg-gray-400`}
            style={{ top: `${20 * i}px` }}
          ></div>
        ))}
        
        {/* Vertical string lines */}
        {Array.from({ length: strings }, (_, i) => (
          <div 
            key={`string-${i}`}
            className="absolute h-[80px] w-[1px] bg-gray-400"
            style={{ left: `${16 * i}px`, top: '0px' }}
          ></div>
        ))}
        
        {/* String status at nut (open, muted) */}
        {Array.from({ length: strings }, (_, i) => {
          // 문자열 번호를 반전시킴 (6부터 1까지)
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
                left: `${16 * i - 6}px`, 
                top: '-20px',
                width: '12px',
                height: '12px'
              }}
            >
              {isMuted && <span className="text-gray-400">✕</span>}
              {isOpen && <div className="w-4 h-4 rounded-full border-2 border-gray-400"></div>}
            </div>
          );
        })}
        
        {/* Finger positions */}
        {positions.filter(p => p.fret > 0).map((pos, i) => {
          // 문자열 인덱스를 반전시켜 좌우 방향을 올바르게 표시
          const stringIdx = strings - pos.string;
          const relFret = pos.fret - startFret;
          
          // Skip if the fret is outside our display range
          if (relFret < 0 || relFret >= frets) return null;
          
          return (
            <div 
              key={`dot-${i}`}
              className={`absolute flex items-center justify-center w-4 h-4 rounded-full 
                ${pos.isRoot ? 'bg-sensei-accent' : 'bg-gray-300'} text-xs font-medium text-black`}
              style={{ 
                left: `${16 * stringIdx - 8}px`, 
                top: `${20 * relFret - 10}px`,
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