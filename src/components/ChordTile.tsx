
import { useState } from "react";
import { cn } from "@/lib/utils";

export interface ChordToneInfo {
  root: string;
  third?: string;
  fifth?: string;
  seventh?: string;
  extensions?: string[];
}

export interface ChordTileProps {
  chord: string;
  confidence: number; // 0-100
  beat: number;
  chordTones?: ChordToneInfo;
  alternateNames?: string[];
  onClick?: () => void;
}

const ChordTile = ({
  chord,
  confidence,
  beat,
  chordTones,
  alternateNames,
  onClick
}: ChordTileProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Determine color based on confidence
  const getConfidenceStyle = () => {
    if (confidence >= 80) return "chord-tile-good";
    if (confidence >= 60) return "chord-tile-warn";
    return "chord-tile-bad";
  };

  return (
    <div
      className={cn(
        "chord-tile",
        getConfidenceStyle()
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="font-bold text-center text-white">
        {chord}
      </div>
      
      {isHovered && chordTones && (
        <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-full mt-[-8px] z-10 bg-gray-900 border border-gray-700 rounded-lg p-3 w-48 shadow-lg">
          <div className="font-mono text-xs mb-2 text-gray-400">Chord tones:</div>
          <div className="grid grid-cols-4 gap-1 mb-2">
            {chordTones.root && (
              <div className="bg-sensei-accent/20 rounded px-2 py-1 text-center text-xs font-mono">
                R: {chordTones.root}
              </div>
            )}
            {chordTones.third && (
              <div className="bg-gray-800 rounded px-2 py-1 text-center text-xs font-mono">
                3: {chordTones.third}
              </div>
            )}
            {chordTones.fifth && (
              <div className="bg-gray-800 rounded px-2 py-1 text-center text-xs font-mono">
                5: {chordTones.fifth}
              </div>
            )}
            {chordTones.seventh && (
              <div className="bg-gray-800 rounded px-2 py-1 text-center text-xs font-mono">
                7: {chordTones.seventh}
              </div>
            )}
          </div>
          
          {chordTones.extensions && chordTones.extensions.length > 0 && (
            <div>
              <div className="font-mono text-xs mb-1 text-gray-400">Extensions:</div>
              <div className="flex flex-wrap gap-1">
                {chordTones.extensions.map((ext, i) => (
                  <div key={i} className="bg-gray-800 rounded px-2 py-1 text-center text-xs font-mono">
                    {ext}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {alternateNames && alternateNames.length > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-700">
              <div className="font-mono text-xs text-gray-400">Alt names:</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {alternateNames.map((name, i) => (
                  <div key={i} className="text-xs font-mono">{name}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChordTile;
