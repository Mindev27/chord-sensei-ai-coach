import React from 'react';

export interface ScaleNote {
  string: number; // 1-6 (1 = high E, 6 = low E)
  fret: number;   // fret number
  noteFunction?: string; // 'R' for root, '3' for third, '5' for fifth, etc.
  noteColor?: string; // CSS color string
  isRoot?: boolean;
  isChordTone?: boolean;
  isScaleNote?: boolean;
}

interface GuitarFretboardWithScaleDisplayProps {
  scaleName?: string;
  scaleNotes?: ScaleNote[];
  notes?: ScaleNote[];
  recommendedScale?: string;
  recommendedChord?: string;
  showLabels?: boolean;
  maxFrets?: number;
}

const GuitarFretboardWithScaleDisplay: React.FC<GuitarFretboardWithScaleDisplayProps> = ({
  scaleName,
  scaleNotes = [],
  notes = [],
  recommendedScale,
  recommendedChord,
  showLabels = true,
  maxFrets = 15
}) => {
  // Number of strings in a guitar (6 by default)
  const numStrings = 6;
  // Note names for standard tuning
  const openStringNotes = ['E', 'B', 'G', 'D', 'A', 'E']; // high to low
  
  // Use notes if provided, otherwise use scaleNotes
  const displayNotes = notes.length > 0 ? notes : scaleNotes;
  
  // Display scale name from props or from recommendedScale
  const displayScaleName = scaleName || recommendedScale || '';
  
  // Create fretboard
  const renderFretboard = () => {
    return (
      <div className="fretboard w-full overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="grid grid-cols-16" style={{ gridTemplateColumns: `30px repeat(${maxFrets}, 1fr)` }}>
            {/* Fret numbers */}
            <div className="text-center"></div>
            {Array.from({ length: maxFrets }).map((_, i) => (
              <div 
                key={`fret-${i}`} 
                className={`text-center text-xs text-gray-400 ${i === 0 ? 'font-bold' : ''}`}
              >
                {i}
              </div>
            ))}
            
            {/* Strings and frets */}
            {Array.from({ length: numStrings }).map((_, stringIndex) => (
              <React.Fragment key={`string-${stringIndex}`}>
                {/* String label */}
                <div className="text-center text-xs text-gray-400 py-2">
                  {showLabels && openStringNotes[stringIndex]}
                </div>
                
                {/* Frets for this string */}
                {Array.from({ length: maxFrets }).map((_, fretIndex) => {
                  // Find if there's a scale note at this position
                  const note = displayNotes.find(
                    note => note.string === (stringIndex + 1) && note.fret === fretIndex
                  );
                  
                  return (
                    <div 
                      key={`string-${stringIndex}-fret-${fretIndex}`}
                      className={`
                        relative py-2 border-b border-gray-600
                        ${fretIndex === 0 ? 'border-r-2 border-r-gray-300' : 'border-r border-r-gray-600'}
                        ${[3, 5, 7, 9, 12, 15, 17, 19, 21, 24].includes(fretIndex) ? 'bg-gray-700' : ''}
                      `}
                    >
                      {note && (
                        <div 
                          className={`
                            absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                            w-5 h-5 rounded-full flex items-center justify-center
                            ${note.noteColor || 
                              (note.isRoot || note.noteFunction === 'R' 
                                ? 'bg-sensei-accent text-white' 
                                : note.isChordTone
                                  ? 'bg-orange-400 text-white'
                                  : note.isScaleNote
                                    ? 'bg-green-400 text-white'
                                    : 'bg-gray-600 text-white')}
                          `}
                        >
                          <span className="text-xs">
                            {note.noteFunction || ''}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="guitar-fretboard-scale-display bg-gray-800 p-4 rounded-md">
      <h3 className="text-sm font-medium text-gray-400 mb-2">
        {recommendedChord && `코드: ${recommendedChord} / `}
        스케일: {displayScaleName}
      </h3>
      {renderFretboard()}
    </div>
  );
};

export default GuitarFretboardWithScaleDisplay; 