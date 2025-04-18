import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, ChevronRight, Music, Radio } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import GuitarChordDiagram from "./GuitarChordDiagram";
import GuitarFretboardWithScaleDisplay, { FretboardNote } from "./GuitarFretboardWithScaleDisplay";
import KeyboardVisualizer from "./KeyboardVisualizer";
import { getChordPositions } from "@/lib/chordPositions";
import GuitarTabNotation, { TabNote } from "./GuitarTabNotation";

// Define note names in order
const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// Chord types definitions
const CHORD_TYPES: Record<string, { root: string; notes: string[]; description: string }> = {
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
  },
  "C": {
    root: "C",
    notes: ["C", "E", "G"],
    description: "C Major"
  },
  "G": {
    root: "G",
    notes: ["G", "B", "D"],
    description: "G Major"
  },
  "Am": {
    root: "A",
    notes: ["A", "C", "E"],
    description: "A Minor"
  },
  "E": {
    root: "E",
    notes: ["E", "G#", "B"],
    description: "E Major"
  }
};

// Scale definitions with chord compatibility
const SCALE_DEFINITIONS: Record<string, { 
  root: string, 
  notes: string[], 
  description: string,
  compatibleChords: string[]  // Add compatible chords to each scale
}> = {
  "E Mixolydian": {
    root: "E",
    notes: ["E", "F#", "G#", "A", "B", "C#", "D"],
    description: "Dominant 7th 코드에 적합",
    compatibleChords: ["E7", "A", "Bm", "C#m", "D"]
  },
  "E Blues": {
    root: "E",
    notes: ["E", "G", "A", "Bb", "B", "D"],
    description: "블루스 느낌",
    compatibleChords: ["E7", "E", "A7", "B7"]
  },
  "A Minor Pentatonic": {
    root: "A",
    notes: ["A", "C", "D", "E", "G"],
    description: "마이너 펜타토닉",
    compatibleChords: ["Am", "Am7", "C", "D", "E", "E7", "G"]
  },
  "C Major": {
    root: "C",
    notes: ["C", "D", "E", "F", "G", "A", "B"],
    description: "메이저 스케일",
    compatibleChords: ["C", "Dm", "Em", "F", "G", "Am", "Bdim"]
  },
  "G Mixolydian": {
    root: "G",
    notes: ["G", "A", "B", "C", "D", "E", "F"],
    description: "G7 코드에 적합",
    compatibleChords: ["G7", "G", "C", "Dm", "Em"]
  }
};

// Chord definitions
const CHORD_DEFINITIONS: Record<string, { 
  root: string, 
  notes: string[],
  recommendedScales: string[]  // Add recommended scales for each chord
}> = {
  "E7": { 
    root: "E", 
    notes: ["E", "G#", "B", "D"],
    recommendedScales: ["E Mixolydian", "E Blues", "A Minor Pentatonic"] 
  },
  "A7": { 
    root: "A", 
    notes: ["A", "C#", "E", "G"],
    recommendedScales: ["A Mixolydian", "E Blues", "D Major"] 
  },
  "G": { 
    root: "G", 
    notes: ["G", "B", "D"],
    recommendedScales: ["G Major", "E Minor Pentatonic", "C Major"] 
  },
  "C": { 
    root: "C", 
    notes: ["C", "E", "G"],
    recommendedScales: ["C Major", "G Mixolydian", "A Minor Pentatonic"] 
  },
  "Am": { 
    root: "A", 
    notes: ["A", "C", "E"],
    recommendedScales: ["A Minor Pentatonic", "C Major", "A Minor"] 
  }
};

// Function to get recommended scales based on chord
const getRecommendedScales = (chordName: string): { name: string, notes: string, confidence: number }[] => {
  // Default scales if chord not found
  if (!CHORD_DEFINITIONS[chordName]) {
    return [
      { name: "E Mixolydian", notes: "E F# G# A B C# D", confidence: 90 },
      { name: "E Blues", notes: "E G A Bb B D", confidence: 85 },
      { name: "A Minor Pentatonic", notes: "A C D E G", confidence: 75 },
    ];
  }
  
  // Get recommended scales for this chord
  const chord = CHORD_DEFINITIONS[chordName];
  const recommendations: { name: string, notes: string, confidence: number }[] = [];
  
  // Generate recommendations with confidence levels
  chord.recommendedScales.forEach((scaleName, index) => {
    // Check if we have this scale defined
    const scaleInfo = SCALE_DEFINITIONS[scaleName];
    if (scaleInfo) {
      // Convert confidence based on position (first is highest)
      const confidence = 95 - (index * 10);
      recommendations.push({
        name: scaleName,
        notes: scaleInfo.notes.join(' '),
        confidence: confidence
      });
    }
  });
  
  // If empty, add default
  if (recommendations.length === 0) {
    recommendations.push({
      name: "E Mixolydian",
      notes: "E F# G# A B C# D",
      confidence: 90
    });
  }
  
  return recommendations;
};

// Generate fretboard notes for a given chord and scale
const generateFretboardNotes = (
  chordName: string, 
  scaleName: string
): FretboardNote[] => {
  // Fallback chord and scale if not found
  const chord = CHORD_DEFINITIONS[chordName] || { 
    root: "E", 
    notes: ["E", "G#", "B", "D"],
    recommendedScales: [] 
  };
  
  const scale = SCALE_DEFINITIONS[scaleName] || SCALE_DEFINITIONS["E Mixolydian"];
  
  const notes: FretboardNote[] = [];
  
  // Standard guitar tuning from 6th string (low E) to 1st string (high E)
  const tuning = [4, 11, 7, 2, 9, 4]; // E, A, D, G, B, E (as indices in NOTES array)
  
  // Generate scale notes for each string
  for (let stringNum = 1; stringNum <= 6; stringNum++) {
    const openNoteIndex = tuning[6 - stringNum]; // Convert to 0-based index and invert
    
    // For each fret on the current string (0-15)
    for (let fret = 0; fret <= 15; fret++) {
      // Calculate the note at this position
      const noteIndex = (openNoteIndex + fret) % 12;
      const noteName = NOTES[noteIndex];
      
      // Create a note if it's in the scale
      if (scale.notes.includes(noteName)) {
        notes.push({
          string: stringNum,
          fret: fret,
          isRoot: noteName === chord.root,
          isScaleNote: true,
          // Mark as chord tone if it's in the chord
          isChordTone: chord.notes.includes(noteName)
        });
      }
      // Add chord tones that might not be in the scale
      else if (chord.notes.includes(noteName)) {
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

interface ScaleRecommendation {
  name: string;
  notes: string;
  confidence: number;
}

interface SoloAnalysisProps {
  currentChord: string;
  feedback: string;
  scaleRecommendations: ScaleRecommendation[];
  playbackTime: number;
  previousChord?: string;
  nextChord?: string;
}

// Keep track of chord changes with this global variable
let chordChangeCount = 0;
let lastSeenChord = "";

const SoloAnalysis = ({ 
  currentChord, 
  feedback, 
  scaleRecommendations: initialScaleRecommendations,
  playbackTime,
  previousChord,
  nextChord
}: SoloAnalysisProps) => {
  // State for chord-specific scale recommendations
  const [scaleRecommendations, setScaleRecommendations] = useState<ScaleRecommendation[]>(
    initialScaleRecommendations || []
  );
  
  // State to store the current recommended lick
  const [currentRecommendedLick, setCurrentRecommendedLick] = useState<{
    name: string;
    description: string;
    level: string;
    tabNotes: TabNote[];
    forChord: string;
  } | null>(null);
  
  // All possible licks organized by chord
  const licksByChord: Record<string, {
    name: string;
    description: string;
    level: string;
    tabNotes: TabNote[];
  }[]> = {
    "E7": [
      {
        name: "BBKing 벤딩 스타일",
        description: "BBKing 스타일의 단음 벤딩으로 강한 표현력을 더함",
        level: "초급",
        tabNotes: [
          { string: 2, fret: 8, position: 0 },
          { string: 2, fret: 10, position: 2 },
          { string: 2, fret: 8, position: 4, technique: "bend", bendValue: 0.5 },
          { string: 2, fret: 8, position: 6 },
          { string: 1, fret: 8, position: 8 },
          { string: 1, fret: 10, position: 10 },
          { string: 1, fret: 8, position: 12, technique: "bend", bendValue: 1 },
          { string: 1, fret: 8, position: 14 },
        ]
      }
    ],
    "Am": [
      {
        name: "John Mayer 스타일 더블스탑",
        description: "Slow Dancing의 더블스탑 벤딩을 활용한 표현",
        level: "중급",
        tabNotes: [
          { string: 2, fret: 10, position: 0 },
          { string: 1, fret: 8, position: 0 },
          { string: 2, fret: 10, position: 2, technique: "bend", bendValue: 0.5 },
          { string: 1, fret: 8, position: 2, technique: "bend", bendValue: 0.5 },
          { string: 2, fret: 10, position: 4, technique: "bend", bendValue: 1 },
          { string: 1, fret: 8, position: 4, technique: "bend", bendValue: 1 },
          { string: 2, fret: 10, position: 6, technique: "release" },
          { string: 1, fret: 8, position: 6, technique: "release" },
          { string: 2, fret: 8, position: 8 },
          { string: 3, fret: 9, position: 10 },
          { string: 3, fret: 7, position: 12, technique: "hammer-on" },
          { string: 3, fret: 9, position: 14, technique: "pull-off" },
        ]
      }
    ],
    "G": [
      {
        name: "SRV 블루스 터닝 포인트",
        description: "텍사스 블루스의 전형적인 포지션 전환 패턴",
        level: "고급",
        tabNotes: [
          { string: 3, fret: 7, position: 0 },
          { string: 3, fret: 9, position: 1 },
          { string: 3, fret: 7, position: 2, technique: "hammer-on" },
          { string: 3, fret: 9, position: 3, technique: "pull-off" },
          { string: 3, fret: 7, position: 4 },
          { string: 4, fret: 9, position: 5 },
          { string: 4, fret: 7, position: 6, technique: "slide-down" },
          { string: 4, fret: 5, position: 7 },
          { string: 5, fret: 7, position: 8 },
          { string: 5, fret: 5, position: 9, technique: "slide-up" },
          { string: 5, fret: 7, position: 10 },
          { string: 4, fret: 5, position: 11 },
          { string: 4, fret: 7, position: 12, technique: "bend", bendValue: 1.5 },
          { string: 4, fret: 7, position: 14, technique: "vibrato" },
        ]
      }
    ],
    "C": [
      {
        name: "캄핑 스타일 아르페지오",
        description: "C 메이저에서 순차적인 아르페지오 패턴",
        level: "중급",
        tabNotes: [
          { string: 5, fret: 3, position: 0 },
          { string: 4, fret: 2, position: 1 },
          { string: 3, fret: 0, position: 2 },
          { string: 2, fret: 1, position: 3 },
          { string: 1, fret: 0, position: 4 },
          { string: 2, fret: 1, position: 5 },
          { string: 3, fret: 0, position: 6 },
          { string: 4, fret: 2, position: 7 },
          { string: 5, fret: 3, position: 8 },
          { string: 4, fret: 2, position: 9 },
          { string: 3, fret: 0, position: 10 },
          { string: 2, fret: 1, position: 11 },
        ]
      }
    ],
    "A7": [
      {
        name: "A7 블루지 패턴",
        description: "A7에서 미소리디안 모드를 활용한 블루스 패턴",
        level: "초급",
        tabNotes: [
          { string: 3, fret: 6, position: 0 },
          { string: 3, fret: 9, position: 1 },
          { string: 3, fret: 7, position: 2 },
          { string: 3, fret: 6, position: 3 },
          { string: 2, fret: 8, position: 4 },
          { string: 2, fret: 7, position: 5, technique: "bend", bendValue: 0.5 },
          { string: 2, fret: 5, position: 6 },
          { string: 3, fret: 7, position: 7 },
          { string: 3, fret: 6, position: 8, technique: "vibrato" },
        ]
      }
    ]
  };
  
  // Default lick for any chord that doesn't have a specific recommendation
  const defaultLick = {
    name: "유니버설 포지션 패턴",
    description: "어떤 코드에서도 활용 가능한 기본 포지션 패턴",
    level: "초급",
    tabNotes: [
      { string: 3, fret: 4, position: 0 },
      { string: 3, fret: 6, position: 1 },
      { string: 3, fret: 7, position: 2 },
      { string: 2, fret: 5, position: 3 },
      { string: 2, fret: 7, position: 4 },
      { string: 1, fret: 5, position: 5 },
      { string: 1, fret: 7, position: 6 },
      { string: 1, fret: 5, position: 7, technique: "bend", bendValue: 0.5 },
    ]
  };
  
  // Update recommendations when chord changes
  useEffect(() => {
    // Generate fresh chord-specific recommendations
    const newRecommendations = getRecommendedScales(currentChord);
    setScaleRecommendations(newRecommendations);
    
    // Update chord change counter and lick if needed
    if (currentChord !== lastSeenChord) {
      lastSeenChord = currentChord;
      chordChangeCount++;
      
      // Only update the lick every 2 chord changes
      if (chordChangeCount % 2 === 0) {
        const lick = licksByChord[currentChord]?.[0] || defaultLick;
        setCurrentRecommendedLick({
          ...lick,
          forChord: currentChord
        });
      } else if (!currentRecommendedLick) {
        // Initialize the lick if it's null
        const lick = licksByChord[currentChord]?.[0] || defaultLick;
        setCurrentRecommendedLick({
          ...lick,
          forChord: currentChord
        });
      }
    }
  }, [currentChord, currentRecommendedLick, licksByChord, defaultLick]);
  
  // Use the top recommended scale from the new recommendations
  const topRecommendedScale = scaleRecommendations.length > 0 
    ? scaleRecommendations[0].name 
    : "E Mixolydian";
  
  // State to store fretboard notes
  const [fretboardNotes, setFretboardNotes] = useState<FretboardNote[]>([]);
  
  // Add instrument selection state
  const [selectedInstrument, setSelectedInstrument] = useState<"guitar" | "piano">("guitar");
  
  // Update fretboard notes when chord or scale changes
  useEffect(() => {
    const notes = generateFretboardNotes(currentChord, topRecommendedScale);
    setFretboardNotes(notes);
  }, [currentChord, topRecommendedScale]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-4 h-full overflow-auto">
      {/* Chord progression display with diagrams */}
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-3">코드 진행</h3>
        <div className="flex flex-wrap gap-4 justify-center">
          {previousChord && (
            <div className="chord-display bg-gray-800 p-3 rounded-lg opacity-70">
              <div className="text-sm text-gray-400 text-center mb-1">이전 코드</div>
              <GuitarChordDiagram 
                chordName={previousChord} 
                positions={getChordPositions(previousChord)} 
              />
            </div>
          )}
          
          <div className="chord-display bg-gray-800 p-3 rounded-lg border-2 border-sensei-accent">
            <div className="text-sm text-sensei-accent text-center mb-1">현재 코드</div>
            <GuitarChordDiagram 
              chordName={currentChord} 
              positions={getChordPositions(currentChord)} 
            />
          </div>
          
          {nextChord && (
            <div className="chord-display bg-gray-800 p-3 rounded-lg opacity-70">
              <div className="text-sm text-gray-400 text-center mb-1">다음 코드</div>
              <GuitarChordDiagram 
                chordName={nextChord} 
                positions={getChordPositions(nextChord)} 
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Fretboard visualization showing scale and chord tones */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-400">
              코드 톤 & 스케일 시각화 • <span className="text-sensei-accent">{currentChord}</span> + <span className="text-green-400">{topRecommendedScale}</span>
            </div>
            <div className="flex bg-gray-800 rounded-md p-1">
              <button 
                className={`text-xs px-2 py-1 rounded ${selectedInstrument === "guitar" ? "bg-sensei-accent text-white" : "text-gray-400"}`}
                onClick={() => setSelectedInstrument("guitar")}
              >
                기타
              </button>
              <button 
                className={`text-xs px-2 py-1 rounded ${selectedInstrument === "piano" ? "bg-sensei-accent text-white" : "text-gray-400"}`}
                onClick={() => setSelectedInstrument("piano")}
              >
                피아노
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-sensei-accent mr-1"></div>
              <span className="text-xs text-gray-400">루트</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-orange-400 mr-1"></div>
              <span className="text-xs text-gray-400">코드 톤</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-400 mr-1"></div>
              <span className="text-xs text-gray-400">
                {selectedInstrument === "guitar" ? "스케일 음" : "협화음"}
              </span>
            </div>
          </div>
        </div>
        
        <div className="h-72 border border-sensei-border rounded-lg">
          {selectedInstrument === "guitar" ? (
            <GuitarFretboardWithScaleDisplay 
              key={`guitar-${currentChord}-${topRecommendedScale}`}
              notes={fretboardNotes}
              recommendedScale={topRecommendedScale}
              recommendedChord={currentChord}
            />
          ) : (
            <KeyboardVisualizer 
              key={`piano-${currentChord}-${topRecommendedScale}`}
              notes={
                SCALE_DEFINITIONS[topRecommendedScale]?.notes || []
              }
              rootNote={
                SCALE_DEFINITIONS[topRecommendedScale]?.root || ""
              }
              chordNotes={
                CHORD_TYPES[currentChord]?.notes || []
              }
            />
          )}
        </div>
      </div>

      <div className="flex mb-4 space-x-2">
        <div className="bg-gray-800 text-gray-200 px-3 py-1 rounded-md flex items-center gap-2 text-sm">
          <span>현재 코드:</span>
          <Badge className="bg-sensei-accent">{currentChord}</Badge>
        </div>
        <div className="bg-gray-800 text-gray-200 px-3 py-1 rounded-md flex items-center gap-2 text-sm">
          <span>재생 시간:</span>
          <span className="font-mono">{formatTime(playbackTime)}</span>
        </div>
        <div className="bg-gray-800 text-gray-200 px-3 py-1 rounded-md flex items-center gap-2 text-sm">
          <span>난이도:</span>
          <span className="text-yellow-400">중급</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 연주 피드백 */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Radio className="mr-2 h-5 w-5 text-sensei-accent" />
              실시간 피드백
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-fade-in">
              <p className="text-gray-200">{feedback}</p>
              
              <div className="mt-4 space-y-3">
                <h4 className="text-sm font-medium text-gray-300">현재 연주 분석</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <ChevronRight className="h-4 w-4 text-sensei-accent mr-1 mt-0.5 flex-shrink-0" />
                    <span>{currentChord} 코드의 특성음을 강조하는 연주가 긍정적입니다.</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-4 w-4 text-sensei-accent mr-1 mt-0.5 flex-shrink-0" />
                    <span>12~15프렛 구간에서 {topRecommendedScale}을 활용하고 있습니다.</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-4 w-4 text-yellow-500 mr-1 mt-0.5 flex-shrink-0" />
                    <span>F#음이 {currentChord} 코드에서 불협화음을 발생시킵니다. 코드 톤으로 대체하세요.</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* 추천 스케일 */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Music className="mr-2 h-5 w-5 text-sensei-accent" />
              {currentChord} 추천 스케일
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scaleRecommendations.map((scale, index) => (
                <div key={index} className="bg-gray-700 p-3 rounded-md">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{scale.name}</h3>
                    <Badge className={`
                      ${scale.confidence > 90 ? 'bg-green-600' : 
                        scale.confidence > 80 ? 'bg-yellow-600' : 
                        'bg-orange-600'}`
                      }
                    >
                      {scale.confidence}%
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-300 font-mono mt-1">{scale.notes}</p>
                  <div className="mt-2 flex gap-2">
                    {index === 0 && (
                      <span className="text-xs px-2 py-0.5 bg-sensei-accent/20 text-sensei-accent rounded">현재 코드 {currentChord}에 최적</span>
                    )}
                    {index === 1 && (
                      <span className="text-xs px-2 py-0.5 bg-blue-600/20 text-blue-400 rounded">대체 접근법</span>
                    )}
                    {index === 2 && (
                      <span className="text-xs px-2 py-0.5 bg-purple-600/20 text-purple-400 rounded">창의적 접근법</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* 추천 릭 */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <BarChart className="mr-2 h-5 w-5 text-sensei-accent" />
              추천 릭
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {currentRecommendedLick && (
                <div className="bg-gray-700 p-3 rounded-md">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{currentRecommendedLick.name}</h3>
                    <Badge className={`
                      ${currentRecommendedLick.level === "초급" ? "bg-green-600" : 
                        currentRecommendedLick.level === "중급" ? "bg-yellow-600" : 
                        "bg-red-600"}
                    `}>
                      {currentRecommendedLick.level}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-300 mt-1 mb-2">
                    {currentRecommendedLick.description}
                    <span className="ml-2 text-xs text-sensei-accent">
                      추천 코드: {currentRecommendedLick.forChord}
                    </span>
                  </p>
                  
                  {/* Tab notation display */}
                  <div className="mt-3 mb-3">
                    <GuitarTabNotation 
                      notes={currentRecommendedLick.tabNotes} 
                      width={500}
                      height={150}
                    />
                  </div>
                  
                  <button className="mt-2 text-xs text-sensei-accent flex items-center">
                    릭 연습하기
                    <ChevronRight className="h-3 w-3 ml-1" />
                  </button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SoloAnalysis;
