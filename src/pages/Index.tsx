
import LandingHero from "@/components/LandingHero";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div>
      <LandingHero />
      
      {/* Quick demo section */}
      <div className="bg-gray-900 py-12 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to see ChordSensei in action?</h2>
          <p className="text-gray-400 mb-6">
            Check out our sample analysis of "Don't Look Back in Anger" by Oasis
          </p>
          <Link to="/workspace">
            <Button 
              size="lg" 
              className="bg-sensei-accent hover:bg-sensei-accent/90 group"
            >
              View Sample Analysis
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
