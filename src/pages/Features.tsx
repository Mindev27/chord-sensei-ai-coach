import React from "react";
import EnhancedGuitarVisualizer from "@/components/EnhancedGuitarVisualizer";
import ChordProgressionVisualizer from "@/components/ChordProgressionVisualizer";

const Features = () => {
  return (
    <div className="min-h-screen bg-sensei-background text-sensei-foreground p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Features</h1>
        
        <div className="grid grid-cols-1 gap-8">
          <ChordProgressionVisualizer />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-sensei-card p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">AI-Powered Song Analysis</h2>
              <p>
                Our advanced AI models analyze your songs to identify key patterns, 
                chord progressions, and musical elements to provide personalized 
                feedback and suggestions.
              </p>
            </div>
            
            <div className="bg-sensei-card p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Interactive Learning</h2>
              <p>
                Explore musical concepts with interactive visualizations. From 
                chord progressions to scale patterns, learn music theory in a 
                hands-on, intuitive way.
              </p>
            </div>
            
            <div className="bg-sensei-card p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Performance Insights</h2>
              <p>
                Get detailed insights about your guitar playing. Identify areas 
                for improvement, track your progress, and receive personalized 
                practice recommendations.
              </p>
            </div>
            
            <div className="bg-sensei-card p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Custom Practice Plans</h2>
              <p>
                Receive tailored practice routines based on your skill level, 
                goals, and the songs you're learning. Make the most efficient 
                use of your practice time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
