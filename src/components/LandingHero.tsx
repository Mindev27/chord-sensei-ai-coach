
import { Button } from "@/components/ui/button";
import { ArrowRight, MusicIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LandingHero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full overflow-hidden bg-sensei-background min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-sensei-background to-black opacity-50"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="inline-block bg-sensei-accent p-2 px-4 rounded-full mb-6">
          <p className="text-sm font-medium">Introducing ChordSensei AI</p>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Master Any Song with AI-Powered Chord Analysis
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Upload any song or paste a YouTube link and get real-time chord charts, voicing options, and improvisation coaching — all inside one sleek web app.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            className="bg-sensei-accent hover:bg-sensei-accent/90 text-white font-medium py-6 px-8 text-lg rounded-lg flex items-center gap-2"
            onClick={() => navigate("/upload")}
          >
            <MusicIcon className="h-5 w-5" />
            Analyze Your Song
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
      
      <div className="relative z-10 mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
          <div className="w-12 h-12 bg-sensei-accent/20 rounded-lg flex items-center justify-center mb-4">
            <MusicIcon className="h-6 w-6 text-sensei-accent" />
          </div>
          <h3 className="text-xl font-bold mb-2">Instant Chord Detection</h3>
          <p className="text-gray-400">Our AI analyzes any track and identifies chord progressions with studio-level accuracy.</p>
        </div>
        
        <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
          <div className="w-12 h-12 bg-sensei-accent/20 rounded-lg flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-sensei-accent">
              <circle cx="12" cy="12" r="10" />
              <path d="m7 11 3 3 7-7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Real-Time Coaching</h3>
          <p className="text-gray-400">Practice with interactive feedback that analyzes your playing and suggests improvements.</p>
        </div>
        
        <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
          <div className="w-12 h-12 bg-sensei-accent/20 rounded-lg flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-sensei-accent">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Genre-Aware Insights</h3>
          <p className="text-gray-400">Get tailored playing suggestions based on musical style, from jazz to blues to rock.</p>
        </div>
      </div>
    </div>
  );
};

export default LandingHero;
