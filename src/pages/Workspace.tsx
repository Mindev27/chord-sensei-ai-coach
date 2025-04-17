
import { useState } from "react";
import TransportControls from "@/components/TransportControls";
import ChordGrid from "@/components/ChordGrid";
import GuitarFretboard from "@/components/GuitarFretboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, Save, Share2 } from "lucide-react";

// Mock data for "Don't Look Back in Anger" C Major chord on the fretboard
const cMajorChordNotes = [
  { string: 5, fret: 3, finger: 3, isRoot: true },  // C (root)
  { string: 4, fret: 2, finger: 2 },                // E
  { string: 3, fret: 0 },                           // G
  { string: 2, fret: 1, finger: 1 },                // C
  { string: 1, fret: 0 },                           // E
];

// Mock data for E7 chord (chromatic mediant in the song)
const e7ChordNotes = [
  { string: 6, fret: 0, isRoot: true },            // E (root)
  { string: 5, fret: 2, finger: 2 },               // B
  { string: 4, fret: 0 },                          // E
  { string: 3, fret: 1, finger: 1 },               // G#
  { string: 2, fret: 0 },                          // B
  { string: 1, fret: 0 },                          // E
];

const Workspace = () => {
  const [selectedInstrument, setSelectedInstrument] = useState("guitar");
  const [currentChord, setCurrentChord] = useState("C");
  const [fretboardNotes, setFretboardNotes] = useState(cMajorChordNotes);
  
  // Toggle between different chord voicings
  const handleChordToggle = () => {
    if (currentChord === "C") {
      setCurrentChord("E7");
      setFretboardNotes(e7ChordNotes);
    } else {
      setCurrentChord("C");
      setFretboardNotes(cMajorChordNotes);
    }
  };
  
  return (
    <div className="min-h-screen bg-sensei-background flex">
      {/* Left Panel (Transport Controls) */}
      <div className="w-60 border-r border-gray-800 flex flex-col">
        <TransportControls />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header with song info */}
        <div className="bg-gray-900 border-b border-gray-800 p-4 flex items-center">
          <div>
            <h1 className="text-xl font-bold">Don't Look Back in Anger</h1>
            <p className="text-gray-400 text-sm">Oasis - 4:48</p>
          </div>
          
          <div className="ml-auto flex gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1 bg-transparent border-gray-700 hover:bg-gray-800">
              <Save className="h-4 w-4" />
              Save
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1 bg-transparent border-gray-700 hover:bg-gray-800">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1 bg-transparent border-gray-700 hover:bg-gray-800">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
        
        {/* Chord Grid Area */}
        <div className="flex-1 overflow-auto">
          <ChordGrid />
        </div>
        
        {/* Bottom Instrument Panel */}
        <div className="h-52 border-t border-gray-800 bg-gray-900">
          <Tabs defaultValue="guitar" className="w-full h-full">
            <div className="flex border-b border-gray-800">
              <TabsList className="bg-gray-900 h-12 px-4">
                <TabsTrigger 
                  value="sheet" 
                  className="data-[state=active]:bg-gray-800 data-[state=active]:text-white"
                >
                  Staff Notation
                </TabsTrigger>
                <TabsTrigger 
                  value="keyboard" 
                  className="data-[state=active]:bg-gray-800 data-[state=active]:text-white"
                >
                  Keyboard
                </TabsTrigger>
                <TabsTrigger 
                  value="guitar" 
                  className="data-[state=active]:bg-gray-800 data-[state=active]:text-white"
                >
                  Guitar
                </TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center pr-4">
                <Button 
                  onClick={handleChordToggle}
                  variant="outline" 
                  size="sm"
                  className="bg-transparent border-gray-700 hover:bg-gray-800"
                >
                  Show {currentChord === "C" ? "E7" : "C"} Voicing
                </Button>
              </div>
            </div>
            
            <TabsContent value="sheet" className="h-full">
              <div className="flex items-center justify-center h-full text-gray-400">
                <p>Staff notation will be displayed here</p>
              </div>
            </TabsContent>
            
            <TabsContent value="keyboard" className="h-full">
              <div className="flex items-center justify-center h-full text-gray-400">
                <p>Keyboard visualization will be displayed here</p>
              </div>
            </TabsContent>
            
            <TabsContent value="guitar" className="h-full">
              <GuitarFretboard notes={fretboardNotes} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Workspace;
