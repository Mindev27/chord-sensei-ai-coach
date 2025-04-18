import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you use react-router-dom
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react'; // Example icon

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center"> {/* Group logo and nav */}
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 md:mr-6"> {/* Responsive margin */}
            {/* Replace with your actual logo */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
            <span className="font-bold inline-block">ChordAICoach</span>
          </Link>

          {/* Navigation */}
          <nav className="ml-6 flex items-center gap-4 md:gap-6 text-sm"> {/* Responsive gap and margin */}
            <Link
              to="/features"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Features
            </Link>
            <Link
              to="/pricing"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Pricing
            </Link>
            <Link
              to="/about"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              About
            </Link>
          </nav>
        </div>

        {/* Right side actions (e.g., Login) */}
        <div className="flex items-center justify-end space-x-4">
          <Button variant="ghost" size="sm">
            <LogIn className="mr-2 h-4 w-4" />
            Login
          </Button>
          {/* Add other actions like Sign Up if needed */}
          {/* <Button size="sm">Sign Up</Button> */}
        </div>
      </div>
    </header>
  );
};

export default Header; 