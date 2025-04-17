
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link2, Upload, Youtube } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const UploadSection = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      const fileType = file.type;
      
      if (fileType.includes("audio") || file.name.match(/\.(mp3|wav|flac)$/i)) {
        handleFileUpload(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an MP3, WAV, or FLAC file.",
          variant: "destructive"
        });
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      handleFileUpload(file);
    }
  };

  const handleFileUpload = (file: File) => {
    // In a real implementation, this would upload the file to a server
    // For now, we'll simulate the analysis process and navigate to the workspace
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      // Navigate to workspace with mock data
      navigate("/workspace");
    }, 2000);
  };

  const handleYoutubeAnalysis = () => {
    // Validate YouTube URL
    const ytRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    
    if (!youtubeUrl || !ytRegex.test(youtubeUrl)) {
      toast({
        title: "Invalid YouTube URL",
        description: "Please enter a valid YouTube video URL.",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    
    // In a real implementation, this would send the URL to a server for processing
    // For now, we'll simulate the analysis process and navigate to the workspace
    setTimeout(() => {
      setIsProcessing(false);
      navigate("/workspace");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-sensei-background flex flex-col items-center justify-center p-6">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 max-w-3xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Analyze Your Song</h1>
        
        <div className="mb-8">
          <div 
            className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
              isDragging 
                ? "border-sensei-accent bg-sensei-accent/10" 
                : "border-gray-700 hover:border-gray-500"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-medium mb-2">Drag & Drop Your Audio File</h3>
            <p className="text-gray-400 mb-4">Upload MP3, WAV, or FLAC</p>
            <Button 
              className="bg-gray-800 hover:bg-gray-700"
              disabled={isProcessing}
            >
              Browse Files
            </Button>
            <input 
              id="file-upload" 
              type="file" 
              className="hidden"
              accept=".mp3,.wav,.flac"
              onChange={handleFileSelect}
              disabled={isProcessing}
            />
          </div>
        </div>
        
        <div className="relative flex items-center justify-center my-8">
          <div className="border-t border-gray-800 flex-grow"></div>
          <div className="px-4 text-gray-500">OR</div>
          <div className="border-t border-gray-800 flex-grow"></div>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-300 mb-2 font-medium">YouTube URL</label>
          <div className="flex gap-2">
            <div className="relative flex-grow">
              <Youtube className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <Input 
                type="text" 
                placeholder="Paste YouTube link here"
                className="pl-10 bg-gray-800 border-gray-700"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                disabled={isProcessing}
              />
            </div>
            <Button 
              onClick={handleYoutubeAnalysis}
              className="bg-sensei-accent hover:bg-sensei-accent/90"
              disabled={isProcessing || !youtubeUrl}
            >
              <Link2 className="mr-2 h-4 w-4" />
              Analyze
            </Button>
          </div>
        </div>
        
        {isProcessing && (
          <div className="mt-6 text-center">
            <div className="inline-block animate-pulse-orange bg-sensei-accent text-white py-2 px-4 rounded-lg">
              Analyzing audio... This may take a moment
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadSection;
