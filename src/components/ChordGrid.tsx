import { useState } from "react";
import ChordTile, { ChordToneInfo } from "./ChordTile";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import GuitarChordDiagram, { ChordPosition, ChordFret } from "./GuitarChordDiagram";
import { getChordPositions } from "@/lib/chordPositions";

// 난이도별 코드 포지션 정의
const simplifiedChords: Record<string, ChordFret[]> = {
  // 간소화된 코드들 (난이도: 하)
  "C": [
    { string: 3, fret: 0 },
    { string: 2, fret: 1, finger: 1 },
    { string: 1, fret: 0 }
  ],
  "G": [
    { string: 6, fret: 3, finger: 3, isRoot: true },
    { string: 5, fret: 2, finger: 2 },
    { string: 1, fret: 3, finger: 4 }
  ],
  "Am": [
    { string: 5, fret: 0, isRoot: true },
    { string: 3, fret: 2, finger: 2 },
    { string: 2, fret: 1, finger: 1 }
  ],
  "E7": [
    { string: 6, fret: 0, isRoot: true },
    { string: 4, fret: 0 },
    { string: 3, fret: 1, finger: 1 }
  ],
  "F": [
    { string: 4, fret: 3, finger: 3 },
    { string: 3, fret: 2, finger: 2 },
    { string: 2, fret: 1, finger: 1 },
    { string: 1, fret: 1, finger: 1 }
  ],
  "Fm": [
    { string: 4, fret: 3, finger: 3 },
    { string: 3, fret: 1, finger: 1 },
    { string: 2, fret: 1, finger: 1 },
    { string: 1, fret: 1, finger: 1 }
  ],
  "G♯dim": [
    { string: 4, fret: 4, finger: 4 },
    { string: 3, fret: 2, finger: 2 },
    { string: 2, fret: 3, finger: 3 },
    { string: 1, fret: 2, finger: 1 }
  ]
};

const advancedChords: Record<string, ChordFret[]> = {
  // 고급 코드들 (난이도: 상)
  "C": [
    { string: 6, fret: 8, finger: 1, isRoot: true },  // 바레 코드 폼
    { string: 5, fret: 10, finger: 3 },
    { string: 4, fret: 10, finger: 4 },
    { string: 3, fret: 9, finger: 2 },
    { string: 2, fret: 8, finger: 1 },
    { string: 1, fret: 8, finger: 1 }
  ],
  "G": [
    { string: 6, fret: 3, finger: 3, isRoot: true },
    { string: 5, fret: 2, finger: 2 },
    { string: 4, fret: 0 },
    { string: 3, fret: 0 },
    { string: 2, fret: 3, finger: 4 },
    { string: 1, fret: 3, finger: 4 }
  ],
  "Am": [
    { string: 6, fret: 5, finger: 1, isRoot: true },  // 바레 코드 폼
    { string: 5, fret: 7, finger: 3 },
    { string: 4, fret: 7, finger: 4 },
    { string: 3, fret: 5, finger: 1 },
    { string: 2, fret: 5, finger: 1 },
    { string: 1, fret: 5, finger: 1 }
  ],
  "E7": [
    { string: 6, fret: 0, isRoot: true },
    { string: 5, fret: 2, finger: 2 },
    { string: 4, fret: 0 },
    { string: 3, fret: 1, finger: 1 },
    { string: 2, fret: 3, finger: 3 },  // 확장된 보이싱
    { string: 1, fret: 0 }
  ],
  "F": [
    { string: 6, fret: 1, finger: 1, isRoot: true }, // 바레 코드 폼 
    { string: 5, fret: 3, finger: 3 },
    { string: 4, fret: 3, finger: 4 },
    { string: 3, fret: 2, finger: 2 },
    { string: 2, fret: 1, finger: 1 },
    { string: 1, fret: 1, finger: 1 }
  ],
  "Fm": [
    { string: 6, fret: 1, finger: 1, isRoot: true }, // 바레 코드 폼
    { string: 5, fret: 3, finger: 3 },
    { string: 4, fret: 3, finger: 4 },
    { string: 3, fret: 1, finger: 1 },
    { string: 2, fret: 1, finger: 1 },
    { string: 1, fret: 1, finger: 1 }
  ],
  "G♯dim": [
    { string: 6, fret: 4, finger: 1, isRoot: true }, // 고급 포지션
    { string: 5, fret: 5, finger: 2 },
    { string: 4, fret: 4, finger: 1 },
    { string: 3, fret: 5, finger: 3 },
    { string: 2, fret: 4, finger: 1 },
    { string: 1, fret: 5, finger: 4 }
  ]
};

// 난이도에 따른 코드 포지션 반환 함수
const getChordPositionsByDifficulty = (chordName: string, difficultyLevel: "상" | "중" | "하"): ChordPosition[] => {
  let chordFrets: ChordFret[];
  
  // 난이도 '하': 간소화된 코드 포지션
  if (difficultyLevel === "하" && simplifiedChords[chordName]) {
    chordFrets = simplifiedChords[chordName];
  }
  // 난이도 '상': 고급 코드 포지션
  else if (difficultyLevel === "상" && advancedChords[chordName]) {
    chordFrets = advancedChords[chordName];
  }
  // 난이도 '중' 또는 기본값: 기본 코드 포지션
  else {
    chordFrets = getChordPositions(chordName);
  }
  
  // ChordFret[] 를 ChordPosition[] 형식으로 변환
  return [{
    frets: [-1, -1, -1, -1, -1, -1].map((_, stringIndex) => {
      const chordFret = chordFrets.find(cf => 6 - cf.string === stringIndex);
      return chordFret ? chordFret.fret : -1;
    }),
    fingers: [0, 0, 0, 0, 0, 0].map((_, stringIndex) => {
      const chordFret = chordFrets.find(cf => 6 - cf.string === stringIndex);
      return chordFret?.finger || 0;
    }),
    baseFret: 1  // 기본 baseFret 값
  }];
};

interface Chord {
  id: string;
  name: string;
  confidence: number;
  beat: number;
  bar: number;
  section?: string;
  chordTones: ChordToneInfo;
  alternateNames: string[];
}

// 난이도 props 추가
interface ChordGridProps {
  difficultyLevel?: "상" | "중" | "하";
}

// Mock data for "Don't Look Back in Anger" by Oasis
const generateOasisChords = (): Chord[] => {
  const chords: Chord[] = [];
  
  // Intro section
  const introProgression = ["C", "F", "C", "F"];
  const introConfidence = [95, 90, 95, 90];
  
  for (let bar = 1; bar <= 1; bar++) {
    for (let beat = 1; beat <= 4; beat++) {
      const chordIndex = beat - 1;
      const chord = introProgression[chordIndex];
      
      // Generate chord tones based on the chord name
      const chordTones: ChordToneInfo = generateChordTones(chord);
      
      chords.push({
        id: `intro-${bar}-${beat}`,
        name: chord,
        confidence: introConfidence[chordIndex],
        beat,
        bar,
        section: "Intro",
        chordTones,
        alternateNames: getAlternateNames(chord)
      });
    }
  }
  
  // Verse (A Part)
  const verseProgression = ["C", "G", "Am", "E7", "F", "G", "C", "Am", "G"];
  const verseConfidence = [95, 92, 90, 85, 92, 94, 95, 90, 94];
  
  let barCounter = 2;
  let beatCounter = 1;
  
  for (let i = 0; i < verseProgression.length; i++) {
    const chord = verseProgression[i];
    const chordTones: ChordToneInfo = generateChordTones(chord);
    
    chords.push({
      id: `verse-${barCounter}-${beatCounter}`,
      name: chord,
      confidence: verseConfidence[i],
      beat: beatCounter,
      bar: barCounter,
      section: "Verse (A)",
      chordTones,
      alternateNames: getAlternateNames(chord)
    });
    
    beatCounter++;
    if (beatCounter > 4) {
      beatCounter = 1;
      barCounter++;
    }
  }
  
  // Pre-Chorus / Bridge (B Part)
  const preChorusProgression = ["F", "Fm", "C", "F", "Fm", "C", "G", "G♯dim", "Am", "G", "F", "G"];
  const preChorusConfidence = [90, 80, 95, 90, 80, 95, 92, 75, 85, 92, 90, 92];
  
  // Continue from where verse ended
  beatCounter = 1;
  
  for (let i = 0; i < preChorusProgression.length; i++) {
    const chord = preChorusProgression[i];
    const chordTones: ChordToneInfo = generateChordTones(chord);
    
    chords.push({
      id: `pre-chorus-${barCounter}-${beatCounter}`,
      name: chord,
      confidence: preChorusConfidence[i],
      beat: beatCounter,
      bar: barCounter,
      section: "Pre-Chorus (B)",
      chordTones,
      alternateNames: getAlternateNames(chord)
    });
    
    beatCounter++;
    if (beatCounter > 4) {
      beatCounter = 1;
      barCounter++;
    }
  }
  
  // Chorus (A' Part) - Same as verse with slight variations
  const chorusProgression = ["C", "G", "Am", "E7", "F", "G", "C", "Am", "G"];
  const chorusConfidence = [95, 92, 90, 85, 92, 94, 95, 90, 94];
  
  for (let i = 0; i < chorusProgression.length; i++) {
    const chord = chorusProgression[i];
    const chordTones: ChordToneInfo = generateChordTones(chord);
    
    chords.push({
      id: `chorus-${barCounter}-${beatCounter}`,
      name: chord,
      confidence: chorusConfidence[i],
      beat: beatCounter,
      bar: barCounter,
      section: "Chorus (A')",
      chordTones,
      alternateNames: getAlternateNames(chord)
    });
    
    beatCounter++;
    if (beatCounter > 4) {
      beatCounter = 1;
      barCounter++;
    }
  }
  
  return chords;
};

// Helper function to generate chord tones based on chord name
const generateChordTones = (chordName: string): ChordToneInfo => {
  // Basic parsing of chord name
  let root = chordName[0];
  let chordType = chordName.slice(1);
  
  // Handle flats, sharps, and diminished in the root
  if (chordName.includes('♯')) {
    root = chordName.substring(0, 2);
    chordType = chordName.slice(2);
  } else if (chordName.includes('♭')) {
    root = chordName.substring(0, 2);
    chordType = chordName.slice(2);
  }
  
  // Default values for major chord
  let third = "3";
  let fifth = "5";
  let seventh = undefined;
  let extensions = undefined;
  
  // Modify based on chord type
  if (chordType.includes('m') && !chordType.includes('maj')) {
    third = "♭3";
  }
  
  if (chordType.includes('dim')) {
    third = "♭3";
    fifth = "♭5";
  }
  
  if (chordType.includes('7')) {
    if (chordType.includes('maj7')) {
      seventh = "7";
    } else {
      seventh = "♭7";
    }
  }
  
  // For E7 specially highlight it as the chromatic mediant
  if (chordName === "E7") {
    extensions = ["Chromatic Mediant"];
  }
  
  // For Fm highlight it as modal mixture
  if (chordName === "Fm") {
    extensions = ["Modal Mixture"];
  }
  
  // For G♯dim highlight it as secondary leading-tone
  if (chordName === "G♯dim") {
    extensions = ["Secondary Leading-Tone"];
  }
  
  return {
    root,
    third,
    fifth,
    seventh,
    extensions
  };
};

// Helper function to get alternate names
const getAlternateNames = (chordName: string): string[] => {
  switch (chordName) {
    case "C":
      return ["I in C major", "Cmaj"];
    case "G":
      return ["V in C major", "G major"];
    case "Am":
      return ["vi in C major", "A minor"];
    case "F":
      return ["IV in C major", "F major"];
    case "E7":
      return ["III7 (chromatic)", "V7/vi"];
    case "Fm":
      return ["iv (modal mixture)", "F minor"];
    case "G♯dim":
      return ["vii°/vi", "G# diminished"];
    default:
      return [];
  }
};

const ChordGrid = ({ difficultyLevel = "중" }: ChordGridProps) => {
  const [chords, setChords] = useState<Chord[]>(generateOasisChords());
  const [selectedChord, setSelectedChord] = useState<Chord | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editedChordName, setEditedChordName] = useState("");
  
  const handleChordClick = (chord: Chord) => {
    setSelectedChord(chord);
    setEditedChordName(chord.name);
    setIsDialogOpen(true);
  };
  
  const handleSaveChord = () => {
    if (selectedChord && editedChordName) {
      // Update the chord name in the chords array
      const updatedChords = chords.map(chord => {
        if (chord.id === selectedChord.id) {
          return { ...chord, name: editedChordName };
        }
        return chord;
      });
      
      setChords(updatedChords);
      setIsDialogOpen(false);
    }
  };
  
  // Group chords by section and bar
  const groupedChords = chords.reduce((acc, chord) => {
    const section = chord.section || 'Unknown';
    if (!acc[section]) {
      acc[section] = {};
    }
    
    const bar = chord.bar;
    if (!acc[section][bar]) {
      acc[section][bar] = [];
    }
    
    acc[section][bar].push(chord);
    return acc;
  }, {} as Record<string, Record<number, Chord[]>>);
  
  return (
    <div className="p-4 overflow-auto h-full">
      {/* 현재 난이도 표시 */}
      <div className="mb-4 flex justify-end">
        <div className="flex items-center text-xs text-gray-400">
          <span className="mr-2">현재 난이도:</span>
          <span className={`px-2 py-1 rounded
            ${difficultyLevel === "하" ? "bg-green-500/70 text-white" : 
             difficultyLevel === "중" ? "bg-yellow-500/70 text-white" : 
             "bg-red-500/70 text-white"}`
          }>
            {difficultyLevel}
          </span>
          <span className="ml-2">
            {difficultyLevel === "하" ? "(간소화된 코드)" : 
             difficultyLevel === "중" ? "(기본 코드)" : 
             "(고급 코드)"}
          </span>
        </div>
      </div>

      <div className="grid gap-6">
        {Object.entries(groupedChords).map(([section, sectionBars]) => (
          <div key={section} className="mb-6">
            <div className="bg-gray-800 p-2 rounded-lg mb-4">
              <h3 className="text-lg font-medium text-sensei-accent">{section}</h3>
              <p className="text-xs text-gray-400">
                {section === "Intro" && "I–IV alternating pattern setting the tone"}
                {section === "Verse (A)" && "I–V–vi pattern with chromatic E7"}
                {section === "Pre-Chorus (B)" && "Modal mixture with IV–iv–I progression"}
                {section === "Chorus (A')" && "Similar to verse with E7→F hook"}
              </p>
            </div>
            
            {Object.entries(sectionBars).map(([bar, barChords]) => (
              <div key={`${section}-${bar}`} className="mb-4">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center font-mono text-gray-300 mr-3">
                    {bar}
                  </div>
                  <div className="h-[1px] flex-grow bg-gray-800"></div>
                </div>
                <div className="grid grid-cols-4 gap-4 mb-8">
                  {barChords.sort((a, b) => a.beat - b.beat).map((chord) => (
                    <div key={chord.id} className="flex flex-col bg-gray-800/30 p-2 rounded-lg">
                      <ChordTile 
                        chord={chord.name}
                        confidence={chord.confidence}
                        beat={chord.beat}
                        chordTones={chord.chordTones}
                        alternateNames={chord.alternateNames}
                        onClick={() => handleChordClick(chord)}
                      />
                      <div className="mt-3 flex justify-center pb-1">
                        <div className="w-16 h-20">
                          <GuitarChordDiagram 
                            chordName={chord.name}
                            positions={getChordPositionsByDifficulty(chord.name, difficultyLevel)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle>Edit Chord</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="chord-name">Chord Name</Label>
              <Select 
                value={editedChordName} 
                onValueChange={setEditedChordName}
              >
                <SelectTrigger id="chord-name" className="bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Select chord name" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-800">
                  <SelectItem value="C">C</SelectItem>
                  <SelectItem value="F">F</SelectItem>
                  <SelectItem value="G">G</SelectItem>
                  <SelectItem value="Am">Am</SelectItem>
                  <SelectItem value="E7">E7</SelectItem>
                  <SelectItem value="Fm">Fm</SelectItem>
                  <SelectItem value="G♯dim">G♯dim</SelectItem>
                  <SelectItem value="Cmaj7">Cmaj7</SelectItem>
                  <SelectItem value="Fmaj7">Fmaj7</SelectItem>
                  <SelectItem value="G7">G7</SelectItem>
                  <SelectItem value="Am7">Am7</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label>Alternative Notations</Label>
              <div className="flex flex-wrap gap-2 text-sm">
                {selectedChord?.alternateNames.map((name, i) => (
                  <div key={i} className="bg-gray-800 rounded-md px-3 py-1">{name}</div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              className="bg-transparent border-gray-700 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveChord}
              className="bg-sensei-accent hover:bg-sensei-accent/90"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChordGrid;
