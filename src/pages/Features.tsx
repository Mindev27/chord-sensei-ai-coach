
import { ArrowRight, Music, Headphones, Wand2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Features = () => {
  const features = [
    {
      title: "Instant Chord Detection",
      description: "Our AI analyzes any track and identifies chord progressions with studio-level accuracy.",
      icon: <Music className="h-12 w-12 text-sensei-accent" />,
      demo: "/assets/chord-detection-demo.png"
    },
    {
      title: "Real-Time Coaching",
      description: "Practice with interactive feedback that analyzes your playing and suggests improvements.",
      icon: <Headphones className="h-12 w-12 text-sensei-accent" />,
      demo: "/assets/coaching-demo.png"
    },
    {
      title: "Genre-Aware Insights",
      description: "Get tailored playing suggestions based on musical style, from jazz to blues to rock.",
      icon: <Wand2 className="h-12 w-12 text-sensei-accent" />,
      demo: "/assets/genre-insights-demo.png"
    }
  ];

  return (
    <div className="min-h-screen bg-sensei-background">
      {/* Header */}
      <header className="bg-black py-6 border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-white">
              ChordSensei<span className="text-sensei-accent">AI</span>
            </Link>
            <div className="flex gap-4">
              <Link to="/upload">
                <Button variant="outline" className="bg-transparent border-gray-700 hover:bg-gray-800">
                  Try Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Advanced Features for Musicians
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            ChordSensei AI combines powerful technology with musical expertise to help you learn and improve faster.
          </p>
        </div>

        {/* Feature Sections */}
        <div className="space-y-24 py-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 items-center`}
            >
              {/* Text Content */}
              <div className="flex-1 space-y-4">
                <div className="bg-gray-900 p-4 rounded-full inline-block mb-2">
                  {feature.icon}
                </div>
                <h2 className="text-3xl font-bold">{feature.title}</h2>
                <p className="text-xl text-gray-400">
                  {feature.description}
                </p>
                <div className="pt-4">
                  <Button className="bg-sensei-accent hover:bg-sensei-accent/90 group">
                    See how it works
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>

              {/* Demo Visual */}
              <div className="flex-1 bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-lg">
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
                  {index === 0 && (
                    <div className="absolute inset-0 p-8">
                      <div className="bg-gray-800 h-full rounded-lg p-4">
                        <div className="flex flex-wrap gap-2">
                          {["Cmaj7", "Am7", "Dm7", "G7"].map((chord, i) => (
                            <div key={i} className={`chord-tile ${i === 2 ? 'chord-tile-warn' : 'chord-tile-good'}`}>
                              <div className="font-bold text-center text-white">{chord}</div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 h-1/2 flex items-center justify-center">
                          <p className="text-sensei-accent text-center font-medium">
                            {index === 0 ? "96% detection accuracy" : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {index === 1 && (
                    <div className="absolute inset-0 p-8">
                      <div className="bg-gray-800 h-full rounded-lg p-4 flex flex-col justify-center">
                        <div className="text-white text-center mb-2">Currently playing: F major scale</div>
                        <div className="bg-black p-2 rounded mb-4">
                          <div className="text-green-500 text-sm">✓ Good: C, E notes match the chord</div>
                          <div className="text-red-500 text-sm">✗ Try replacing B♭ with A to better fit the harmony</div>
                        </div>
                        <div className="flex justify-center">
                          <div className="bg-sensei-background p-2 rounded-lg inline-block">
                            <span className="text-sensei-accent font-mono">Next suggestion: Try Cmaj7 arpeggio</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {index === 2 && (
                    <div className="absolute inset-0 p-8">
                      <div className="bg-gray-800 h-full rounded-lg p-4 flex flex-col">
                        <div className="font-medium mb-1">Style: Jazz Fusion</div>
                        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                          <div className="bg-gray-900 p-2 rounded">Dorian mode</div>
                          <div className="bg-gray-900 p-2 rounded">Tritone substitution</div>
                          <div className="bg-gray-900 p-2 rounded">9th extensions</div>
                          <div className="bg-gray-900 p-2 rounded">Chromatic approach</div>
                        </div>
                        <div className="bg-sensei-background p-2 rounded text-sm">
                          <div className="text-sensei-accent mb-1">Recommended Lick:</div>
                          <div className="font-mono text-gray-300">"Miles Davis Style": D E♭ F G B♭ A G F</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 md:p-12 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to elevate your musical journey?</h2>
            <p className="text-xl text-gray-400 mb-8">
              Upload your first song and see ChordSensei AI in action.
            </p>
            <Link to="/upload">
              <Button size="lg" className="bg-sensei-accent hover:bg-sensei-accent/90 text-lg px-8 py-6">
                Start Analyzing
              </Button>
            </Link>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-black py-8 border-t border-gray-800 mt-16">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2025 ChordSensei AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Features;
