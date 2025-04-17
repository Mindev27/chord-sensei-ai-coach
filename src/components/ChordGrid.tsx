
import { useState } from "react";
import ChordTile, { ChordToneInfo } from "./ChordTile";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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

const ChordGrid = () => {
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
                <div className="grid grid-cols-4 gap-2">
                  {barChords.sort((a, b) => a.beat - b.beat).map((chord) => (
                    <ChordTile 
                      key={chord.id}
                      chord={chord.name}
                      confidence={chord.confidence}
                      beat={chord.beat}
                      chordTones={chord.chordTones}
                      alternateNames={chord.alternateNames}
                      onClick={() => handleChordClick(chord)}
                    />
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
