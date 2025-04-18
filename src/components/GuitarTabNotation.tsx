import React from 'react';

export interface TabNote {
  string: number; // 1-6 (1 = high E, 6 = low E)
  fret: number;   // fret number
  duration: number; // in milliseconds
  position: number; // position in sequence
  technique?: string; // e.g., "bend", "slide", "hammer-on", "pull-off", "vibrato", etc.
  bendValue?: number; // How much to bend (e.g., 1 = full step, 0.5 = half step)
  slideTarget?: number; // Target fret for slides
}

interface GuitarTabNotationProps {
  notes: TabNote[];
  showAnimation?: boolean;
  currentPosition?: number;
  width?: number;
  height?: number;
}

const GuitarTabNotation: React.FC<GuitarTabNotationProps> = ({ 
  notes, 
  showAnimation = false,
  currentPosition = 0,
  width,
  height
}) => {
  // Number of strings in a guitar (6 by default)
  const numStrings = 6;
  
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
      case 'slide-down':
        return '/';
      case 'vibrato':
        return '~';
      default:
        return '';
    }
  };
  
  // Create tab staff
  const renderTabStaff = () => {
    return (
      <div className="tab-staff w-full font-mono">
        {Array.from({ length: numStrings }).map((_, stringIndex) => (
          <div key={`string-${stringIndex}`} className="flex items-center">
            <div className="w-8 text-right pr-2 text-gray-400">{`${6 - stringIndex}|`}</div>
            <div className="flex-grow h-px bg-gray-600 relative">
              {/* Notes on this string */}
              {notes
                .filter(note => note.string === (6 - stringIndex))
                .map((note, i) => (
                  <div 
                    key={`note-${i}`}
                    className={`absolute -mt-3 text-center ${
                      showAnimation && note.position === currentPosition 
                        ? 'text-sensei-accent font-bold'
                        : 'text-white'
                    }`}
                    style={{
                      left: `${5 + note.position * 8}%`,
                      width: '24px',
                    }}
                  >
                    {note.fret}{getTechniqueSymbol(note.technique, note.bendValue)}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="guitar-tab-notation bg-gray-800 p-4 rounded-md" style={{width, height}}>
      <h3 className="text-sm font-medium text-gray-400 mb-2">기타 탭 악보</h3>
      {renderTabStaff()}
    </div>
  );
};

export default GuitarTabNotation; 