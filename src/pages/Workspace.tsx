import { useState, useEffect } from "react";
import TransportControls from "@/components/TransportControls";
import ChordGrid from "@/components/ChordGrid";
import GuitarFretboard, { FretboardNote } from "@/components/GuitarFretboard";
import SoloAnalysis from "@/components/SoloAnalysis";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Save, Share2, Volume2, Music2 } from "lucide-react";

// Mock data for "Don't Look Back in Anger" C Major chord on the fretboard
const cMajorChordNotes = [
  { string: 5, fret: 3, finger: 3, isRoot: true },  // C (root)
  { string: 4, fret: 2, finger: 2 },                // E
  { string: 3, fret: 0, finger: 0 },                // G
  { string: 2, fret: 1, finger: 1 },                // C
  { string: 1, fret: 0, finger: 0 },                // E
];

// Mock data for E7 chord (chromatic mediant in the song)
const e7ChordNotes = [
  { string: 6, fret: 0, finger: 0, isRoot: true },  // E (root)
  { string: 5, fret: 2, finger: 2 },                // B
  { string: 4, fret: 0, finger: 0 },                // E
  { string: 3, fret: 1, finger: 1 },                // G#
  { string: 2, fret: 0, finger: 0 },                // B
  { string: 1, fret: 0, finger: 0 },                // E
];

// Solo notes visualization for the mock
const soloNotes = [
  { string: 1, fret: 12, finger: 2, isHighlighted: true, duration: 1000 },
  { string: 1, fret: 15, finger: 4, duration: 800 },
  { string: 2, fret: 13, finger: 1, duration: 600 },
  { string: 2, fret: 15, finger: 3, duration: 400 },
  { string: 1, fret: 12, finger: 1, duration: 1200 },
  { string: 2, fret: 13, finger: 2, isHighlighted: true, duration: 800 }, // Highlight chord tone
  { string: 2, fret: 15, finger: 4, duration: 600 },
  { string: 3, fret: 14, finger: 3, duration: 400 },
  { string: 3, fret: 12, finger: 1, duration: 1000 },
];

// Mock feedback messages for solo playing
const soloFeedback = [
  "G 메이저 펜타토닉 스케일을 2번 폼의 고음현 중심으로 코드톤을 강조한 연주입니다.",
  "플렉싱을 활용하여 블루스 느낌을 더할 수 있습니다.",
  "현재 E7 코드에서 F# 음은 불협화음을 만듭니다. G#으로 대체하세요.",
  "BBKing 스타일의 벤딩을 시도해보세요.",
  "코드톤(E, G#, B)에 집중하세요. 특히 G#은 코드의 특성을 살려줍니다."
];

// Mock scale suggestions
const scaleRecommendations = [
  { name: "E Mixolydian", notes: "E F# G# A B C# D E", confidence: 95 },
  { name: "E Blues", notes: "E G A Bb B D E", confidence: 85 },
  { name: "A Minor Pentatonic", notes: "A C D E G A", confidence: 75 },
];

// Define chord progression for the song
const chordProgression = [
  { id: 1, name: "C", section: "Verse" },
  { id: 2, name: "G", section: "Verse" },
  { id: 3, name: "Am", section: "Verse" },
  { id: 4, name: "E7", section: "Verse" },
  { id: 5, name: "F", section: "Pre-Chorus" },
  { id: 6, name: "Fm", section: "Pre-Chorus" },
  { id: 7, name: "C", section: "Pre-Chorus" },
  { id: 8, name: "G", section: "Chorus" }
];

const Workspace = () => {
  const [selectedInstrument, setSelectedInstrument] = useState("guitar");
  const [currentChord, setCurrentChord] = useState("C");
  const [fretboardNotes, setFretboardNotes] = useState(cMajorChordNotes);
  const [isPlayingSolo, setIsPlayingSolo] = useState(false);
  const [currentSoloNote, setCurrentSoloNote] = useState(0);
  const [visibleNotes, setVisibleNotes] = useState<FretboardNote[]>([]);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [feedbackIndex, setFeedbackIndex] = useState(0);
  const [showSoloAnalysis, setShowSoloAnalysis] = useState(true);
  const [currentChordIndex, setCurrentChordIndex] = useState(0);
  
  // Get previous chord from progression
  const getPreviousChord = () => {
    const prevIndex = (currentChordIndex - 1 + chordProgression.length) % chordProgression.length;
    return chordProgression[prevIndex].name;
  };
  
  // Get next chord from progression
  const getNextChord = () => {
    const nextIndex = (currentChordIndex + 1) % chordProgression.length;
    return chordProgression[nextIndex].name;
  };
  
  // Toggle between different chord voicings
  const handleChordToggle = () => {
    if (currentChord === "C") {
      setCurrentChord("E7");
      setFretboardNotes(e7ChordNotes);
      // Find E7 in chord progression
      const e7Index = chordProgression.findIndex(chord => chord.name === "E7");
      setCurrentChordIndex(e7Index >= 0 ? e7Index : 3); // Default to index 3 if not found
    } else {
      setCurrentChord("C");
      setFretboardNotes(cMajorChordNotes);
      // Find C in chord progression (first occurrence)
      setCurrentChordIndex(0); // Default to first C chord
    }
  };
  
  // Handle play/stop solo
  const toggleSoloPlayback = () => {
    if (isPlayingSolo) {
      setIsPlayingSolo(false);
      setCurrentSoloNote(0);
      setVisibleNotes([]);
    } else {
      setIsPlayingSolo(true);
      setShowSoloAnalysis(true);
    }
  };
  
  // Solo playback effect
  useEffect(() => {
    let interval: number | undefined;
    
    if (isPlayingSolo) {
      interval = window.setInterval(() => {
        setCurrentSoloNote(prev => {
          if (prev >= soloNotes.length - 1) {
            setIsPlayingSolo(false);
            return 0;
          }
          return prev + 1;
        });
        
        setPlaybackTime(prev => prev + soloNotes[currentSoloNote].duration);
        
        // Update displayed notes
        setVisibleNotes(prev => {
          const newNotes = [...prev, soloNotes[currentSoloNote]];
          // Keep only the last 4 notes visible
          if (newNotes.length > 4) {
            return newNotes.slice(1);
          }
          return newNotes;
        });
        
        // Update feedback message
        if (currentSoloNote % 2 === 0) {
          setFeedbackIndex(prev => (prev + 1) % soloFeedback.length);
        }
        
      }, soloNotes[currentSoloNote]?.duration || 800);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlayingSolo, currentSoloNote]);
  
  // Calculate the combined notes (chord + solo)
  const displayedNotes = [...fretboardNotes, ...visibleNotes];
  
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
          {!showSoloAnalysis ? (
            <ChordGrid />
          ) : (
            <SoloAnalysis 
              currentChord={currentChord} 
              feedback={soloFeedback[feedbackIndex]} 
              scaleRecommendations={scaleRecommendations}
              playbackTime={playbackTime}
              previousChord={getPreviousChord()}
              nextChord={getNextChord()}
            />
          )}
        </div>
        
        {/* Toggle button for chord grid / solo analysis */}
        <div className="border-t border-gray-800 bg-gray-900 py-2 px-4 flex justify-between items-center">
          <div className="flex gap-2">
            <Button 
              variant={showSoloAnalysis ? "default" : "outline"}
              size="sm"
              className={`flex items-center gap-1 ${showSoloAnalysis ? "bg-sensei-accent" : "bg-transparent border-gray-700"}`}
              onClick={() => setShowSoloAnalysis(true)}
            >
              <Music2 className="h-4 w-4" />
              솔로 분석
            </Button>
            <Button 
              variant={!showSoloAnalysis ? "default" : "outline"}
              size="sm"
              className={`flex items-center gap-1 ${!showSoloAnalysis ? "bg-sensei-accent" : "bg-transparent border-gray-700"}`}
              onClick={() => setShowSoloAnalysis(false)}
            >
              <Volume2 className="h-4 w-4" />
              코드 진행
            </Button>
          </div>
          
          <Button
            onClick={toggleSoloPlayback}
            variant="default"
            size="sm"
            className={`${isPlayingSolo ? "bg-red-600 hover:bg-red-700" : "bg-sensei-accent hover:bg-sensei-accent/90"}`}
          >
            {isPlayingSolo ? "Stop Solo" : "Play Solo"}
          </Button>
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
                <Badge className="mr-3 bg-sensei-accent/20 text-sensei-accent border border-sensei-accent/30">
                  {currentChord}
                </Badge>
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
              <GuitarFretboard notes={displayedNotes} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Workspace;
