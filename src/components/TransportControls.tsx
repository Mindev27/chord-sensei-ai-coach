
import { useState, useEffect } from "react";
import { 
  SkipBack, 
  Play, 
  Pause, 
  SkipForward, 
  Volume2, 
  Clock, 
  BarChart3,
  Music 
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

interface TransportControlsProps {
  duration?: number; // in seconds
  isPlaybackAvailable?: boolean;
}

const TransportControls = ({ 
  duration = 240, 
  isPlaybackAvailable = true 
}: TransportControlsProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [tempo, setTempo] = useState(100);
  const [transpose, setTranspose] = useState(0);
  const [melodySuppressionEnabled, setMelodySuppressionEnabled] = useState(false);
  
  // Format time as MM:SS
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Simulate playback progress
  useEffect(() => {
    let interval: number | undefined;
    
    if (isPlaying && currentTime < duration) {
      interval = window.setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentTime, duration]);
  
  const togglePlayback = () => {
    if (!isPlaybackAvailable) return;
    setIsPlaying(prev => !prev);
  };
  
  const handleSkipBack = () => {
    setCurrentTime(0);
  };
  
  const handleSkipForward = () => {
    setCurrentTime(duration);
    setIsPlaying(false);
  };

  return (
    <div className="w-full h-full bg-black p-4 flex flex-col">
      <div className="mb-6 space-y-4">
        <div className="flex justify-center space-x-2">
          <button className="transport-button" onClick={handleSkipBack}>
            <SkipBack className="h-6 w-6 text-gray-300" />
          </button>
          
          <button 
            className="transport-button bg-sensei-accent hover:bg-sensei-accent/90 rounded-full p-3"
            onClick={togglePlayback}
            disabled={!isPlaybackAvailable}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6 text-white" />
            ) : (
              <Play className="h-6 w-6 text-white" />
            )}
          </button>
          
          <button className="transport-button" onClick={handleSkipForward}>
            <SkipForward className="h-6 w-6 text-gray-300" />
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="text-xs font-mono text-gray-400">
            {formatTime(currentTime)}
          </div>
          
          <div className="relative flex-grow h-3">
            {/* Custom waveform-like progress bar */}
            <div className="absolute inset-0 bg-gray-800 rounded-full overflow-hidden">
              <div className="absolute inset-y-0 left-0 bg-gray-700 rounded-full"
                   style={{ width: `${(currentTime / duration) * 100}%` }}>
                <div className="flex items-center h-full">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-[2px] w-[3px] bg-sensei-accent mx-[1px]"
                      style={{
                        height: `${Math.random() * 100}%`,
                        minHeight: '20%',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-xs font-mono text-gray-400">
            {formatTime(duration)}
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Volume2 className="h-4 w-4 text-gray-400" />
          <div className="flex-grow">
            <Slider
              value={[volume]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => setVolume(value[0])}
              className="sensei-slider"
            />
          </div>
          <span className="text-xs font-mono text-gray-400 w-8">{volume}%</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <div className="flex-grow">
            <Slider
              value={[tempo]}
              min={50}
              max={150}
              step={1}
              onValueChange={(value) => setTempo(value[0])}
              className="sensei-slider"
            />
          </div>
          <span className="text-xs font-mono text-gray-400 w-8">{tempo}%</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-4 w-4 text-gray-400" />
          <div className="flex-grow">
            <Slider
              value={[transpose + 12]}
              min={0}
              max={24}
              step={1}
              onValueChange={(value) => setTranspose(value[0] - 12)}
              className="sensei-slider"
            />
          </div>
          <span className="text-xs font-mono text-gray-400 w-8">{transpose >= 0 ? `+${transpose}` : transpose}</span>
        </div>
        
        <div className="flex items-center justify-between pt-2 mt-2 border-t border-gray-800">
          <div className="flex items-center space-x-2">
            <Music className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-300">Melody Suppressor</span>
          </div>
          <Switch
            checked={melodySuppressionEnabled}
            onCheckedChange={setMelodySuppressionEnabled}
            className="data-[state=checked]:bg-sensei-accent"
          />
        </div>
      </div>
      
      <div className="mt-auto pt-4">
        <Button
          className="w-full bg-sensei-accent hover:bg-sensei-accent/90 py-6 font-medium"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="mr-2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
          Play & Coach
        </Button>
      </div>
    </div>
  );
};

export default TransportControls;
