
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
  chordTones: ChordToneInfo;
  alternateNames: string[];
}

// Mock data for the chord grid
const generateMockChords = (): Chord[] => {
  const chords = [];
  const chordNames = ["C", "Am", "F", "G", "Dm7", "G7", "Cmaj7", "Em"];
  const confidenceLevels = [95, 90, 85, 75, 65, 60, 50, 85];
  
  for (let bar = 1; bar <= 8; bar++) {
    for (let beat = 1; beat <= 4; beat++) {
      const randomIndex = Math.floor(Math.random() * chordNames.length);
      const chord = chordNames[randomIndex];
      
      // Generate random chord tones based on the chord name
      const chordTones: ChordToneInfo = {
        root: chord[0],
        third: chord.includes("m") ? "♭3" : "3",
        fifth: "5",
        seventh: chord.includes("7") ? (chord.includes("maj7") ? "7" : "♭7") : undefined,
        extensions: chord.includes("9") ? ["9"] : undefined
      };
      
      chords.push({
        id: `${bar}-${beat}`,
        name: chord,
        confidence: confidenceLevels[randomIndex],
        beat,
        bar,
        chordTones,
        alternateNames: ["slash chord", "alt name"]
      });
    }
  }
  
  return chords;
};

const ChordGrid = () => {
  const [chords, setChords] = useState<Chord[]>(generateMockChords());
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
  
  // Group chords by bar
  const groupedChords = chords.reduce((acc, chord) => {
    const bar = chord.bar;
    if (!acc[bar]) {
      acc[bar] = [];
    }
    acc[bar].push(chord);
    return acc;
  }, {} as Record<number, Chord[]>);
  
  return (
    <div className="p-4 overflow-auto h-full">
      <div className="grid gap-2">
        {Object.entries(groupedChords).map(([bar, barChords]) => (
          <div key={bar} className="mb-4">
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
                  <SelectItem value="Cmaj7">Cmaj7</SelectItem>
                  <SelectItem value="C7">C7</SelectItem>
                  <SelectItem value="Cm7">Cm7</SelectItem>
                  <SelectItem value="Am">Am</SelectItem>
                  <SelectItem value="Am7">Am7</SelectItem>
                  <SelectItem value="F">F</SelectItem>
                  <SelectItem value="Fmaj7">Fmaj7</SelectItem>
                  <SelectItem value="G">G</SelectItem>
                  <SelectItem value="G7">G7</SelectItem>
                  <SelectItem value="Dm7">Dm7</SelectItem>
                  <SelectItem value="Em">Em</SelectItem>
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
