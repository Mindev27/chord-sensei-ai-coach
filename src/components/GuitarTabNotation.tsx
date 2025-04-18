import React from 'react';

export interface TabNote {
  string: number; // 1-6 (1 is high E, 6 is low E)
  fret: number;   // 0-24 (0 is open string)
  position: number; // Position in the sequence (horizontal position)
  duration?: number; // Duration of the note in beats
  technique?: string; // e.g., "bend", "slide", "hammer-on", "pull-off", "vibrato", etc.
  bendValue?: number; // How much to bend (e.g., 1 = full step, 0.5 = half step)
  slideTarget?: number; // Target fret for slides
}

export interface GuitarTabNotationProps {
  notes: TabNote[];
  title?: string;
  bpm?: number;
  timeSignature?: string;
  width?: number;
  height?: number;
}

const GuitarTabNotation: React.FC<GuitarTabNotationProps> = ({
  notes = [],
  title = '',
  bpm = 120,
  timeSignature = '4/4',
  width = 800,
  height = 200,
}) => {
  // Sort notes by position
  const sortedNotes = [...notes].sort((a, b) => a.position - b.position);
  
  // Find the maximum position to determine the width of the tab
  const maxPosition = sortedNotes.length > 0
    ? Math.max(...sortedNotes.map(note => note.position))
    : 20; // Default minimum width
  
  // Column width for each position
  const colWidth = 30;
  
  // Calculate the required width
  const tabWidth = Math.max(width, (maxPosition + 5) * colWidth);
  
  // Guitar strings (standard tuning)
  const strings = ['e', 'B', 'G', 'D', 'A', 'E']; // Displayed from top to bottom
  
  // Get technique symbol
  const getTechniqueSymbol = (technique?: string, bendValue?: number): string => {
    if (!technique) return '';
    
    switch (technique.toLowerCase()) {
      case 'bend':
        return `b${bendValue ? bendValue : ''}`;
      case 'release':
        return 'r';
      case 'hammer-on':
        return 'h';
      case 'pull-off':
        return 'p';
      case 'slide-up':
        return '/';
      case 'slide-down':
        return '\\';
      case 'vibrato':
        return '~';
      default:
        return '';
    }
  };

  // Format fret number with technique
  const formatFretWithTechnique = (note: TabNote): string => {
    const fretStr = note.fret.toString().padStart(2, ' ').slice(-2);
    const technique = getTechniqueSymbol(note.technique, note.bendValue);
    return `${fretStr}${technique}`;
  };
  
  return (
    <div className="w-full overflow-auto">
      <div style={{ width: tabWidth, minHeight: height }} className="font-mono text-sm">
        {/* Tab header */}
        <div className="mb-2">
          {title && <div className="text-center font-bold mb-1">{title}</div>}
          <div className="text-xs text-gray-400 flex gap-4 justify-center">
            {bpm && <span>BPM: {bpm}</span>}
            {timeSignature && <span>Time: {timeSignature}</span>}
          </div>
        </div>
        
        {/* Tab notation */}
        <div className="bg-gray-800 rounded-md p-4">
          {/* String labels and tab lines */}
          <div className="relative border-l-2 border-gray-600">
            {strings.map((string, index) => (
              <div key={`string-${index}`} className="flex">
                {/* String label */}
                <div className="w-8 text-right pr-2 text-gray-400">{string}</div>
                
                {/* Tab line */}
                <div className="flex-1 relative border-b border-gray-500 h-6">
                  {/* Add notes for this string */}
                  {sortedNotes
                    .filter(note => note.string === index + 1)
                    .map((note, noteIndex) => (
                      <div 
                        key={`note-${index}-${noteIndex}`}
                        className="absolute text-sensei-accent"
                        style={{ 
                          left: `${note.position * colWidth}px`,
                          top: '-8px',
                        }}
                      >
                        {formatFretWithTechnique(note)}
                      </div>
                    ))}
                </div>
              </div>
            ))}
            
            {/* Measure lines */}
            {Array.from({ length: Math.ceil((maxPosition + 1) / 4) }).map((_, i) => (
              <div
                key={`measure-${i}`}
                className="absolute h-full border-l border-gray-600"
                style={{ left: `${(i + 1) * 4 * colWidth + 32}px` }}
              ></div>
            ))}
          </div>
          
          {/* Position numbers */}
          <div className="ml-8 flex text-xs text-gray-500 mt-1">
            {Array.from({ length: Math.ceil((maxPosition + 1) / 4) }).map((_, i) => (
              <div 
                key={`pos-${i}`} 
                style={{ width: `${4 * colWidth}px` }}
                className="text-center"
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuitarTabNotation; 