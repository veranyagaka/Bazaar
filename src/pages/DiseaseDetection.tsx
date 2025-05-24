import React, { useState, useRef, useEffect } from 'react';
import { Upload, Camera, Info, Leaf, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

interface DetectionResult {
  diseaseName: string;
  confidence: number;
  description: string;
  treatment: string;
  severity: 'low' | 'medium' | 'high';
}

const DiseaseDetection: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set page title
  useEffect(() => {
    document.title = 'Disease Detection - Bazaar';
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target) {
          setSelectedImage(event.target.result as string);
          setDetectionResult(null);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target) {
          setSelectedImage(event.target.result as string);
          setDetectionResult(null);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) {
      toast.error('Please select an image first');
      return;
    }

    if (!selectedCrop) {
      toast.error('Please select a crop type');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Simulate API call for disease detection
      // In production, this would be a call to an edge function that interfaces with ML model
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock result
      const mockResult: DetectionResult = {
        diseaseName: 'Late Blight',
        confidence: 87.5,
        description: 'Late blight is a potentially devastating disease of tomato and potato, caused by the fungus Phytophthora infestans. The disease spreads quickly in wet weather and can cause significant yield loss.',
        treatment: 'Apply copper-based fungicides as a preventative measure. Remove and destroy all infected plant material. Improve air circulation around plants.',
        severity: 'medium',
      };
      
      setDetectionResult(mockResult);
      
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast.error('Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetDetection = () => {
    setSelectedImage(null);
    setDetectionResult(null);
    setSelectedCrop('');
  };

  // List of common crops for the dropdown
  const cropOptions = [
    'Tomatoes',
    'Potatoes',
    'Maize',
    'Rice',
    'Wheat',
    'Soybeans',
    'Coffee',
    'Cassava',
    'Cabbage',
    'Carrots',
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'text-success-500 bg-success-500/10';
      case 'medium':
        return 'text-warning-500 bg-warning-500/10';
      case 'high':
        return 'text-error-500 bg-error-500/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  return (
    <div className="pb-16 md:pb-0">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">
          Crop Disease Detection
        </h1>
        <p className="text-gray-400">
          Upload a photo of your crop to identify potential diseases and get treatment recommendations
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left side - Image upload & analysis */}
        <div className="space-y-6">
          {/* Upload section */}
          <div className="bg-background-light border border-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Upload Plant Image</h2>
            
            {!selectedImage ? (
              <div 
                className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center cursor-pointer hover:border-primary-500 transition-colors"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={triggerFileInput}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileChange}
                />
                <div className="flex flex-col items-center">
                  <Upload className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-white font-medium mb-2">Drag and drop or click to upload</p>
                  <p className="text-sm text-gray-400">JPG, PNG, or GIF files</p>
                </div>
              </div>
            ) : (
              <div className="rounded-lg overflow-hidden relative">
                <img 
                  src={selectedImage} 
                  alt="Selected plant" 
                  className="w-full h-auto object-cover"
                />
                <button
                  onClick={resetDetection}
                  className="absolute top-2 right-2 bg-background p-1 rounded-md text-white hover:bg-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            
            {/* Camera option */}
            <div className="flex mt-4 justify-center">
              <button 
                className="flex items-center text-primary-500 hover:text-primary-400"
                onClick={() => toast.error('Camera access is currently unavailable. Please upload an image instead.')}
              >
                <Camera className="h-5 w-5 mr-1" />
                <span className="text-sm">Or take a photo</span>
              </button>
            </div>
          </div>
          
          {/* Crop selection & analysis button */}
          <div className="bg-background-light border border-gray-800 rounded-lg p-6">
            <div className="mb-4">
              <label htmlFor="cropType" className="block text-sm font-medium text-gray-300 mb-2">
                Select Crop Type
              </label>
              <select
                id="cropType"
                className="w-full px-4 py-2 bg-background text-white rounded-md border border-gray-700 focus:outline-none focus:border-primary-500"
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
              >
                <option value="">Select a crop</option>
                {cropOptions.map((crop) => (
                  <option key={crop} value={crop}>{crop}</option>
                ))}
              </select>
            </div>
            
            <button
              onClick={analyzeImage}
              disabled={!selectedImage || !selectedCrop || isAnalyzing}
              className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                !selectedImage || !selectedCrop || isAnalyzing
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-primary-500 text-white hover:bg-primary-600'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing Image...
                </>
              ) : (
                'Analyze Image'
              )}
            </button>
          </div>
        </div>
        
        {/* Right side - Results or tips */}
        <div className="bg-background-light border border-gray-800 rounded-lg p-6">
          {detectionResult ? (
            // Display detection results
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">Detection Results</h2>
              
              <div className="bg-background p-4 rounded-lg border border-gray-700 mb-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-white font-medium">{detectionResult.diseaseName}</h3>
                    <div className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1 ${getSeverityColor(detectionResult.severity)}`}>
                      {detectionResult.severity.charAt(0).toUpperCase() + detectionResult.severity.slice(1)} Severity
                    </div>
                  </div>
                  <div className="bg-primary-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-semibold text-sm">
                    {Math.round(detectionResult.confidence)}%
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 flex items-center">
                      <Info className="h-4 w-4 mr-1 text-primary-500" />
                      Description
                    </h4>
                    <p className="mt-1 text-sm text-gray-400">
                      {detectionResult.description}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 flex items-center">
                      <Leaf className="h-4 w-4 mr-1 text-success-500" />
                      Treatment
                    </h4>
                    <p className="mt-1 text-sm text-gray-400">
                      {detectionResult.treatment}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-warning-500/10 p-4 rounded-lg">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-warning-500 mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-warning-500">Important Note</h4>
                    <p className="mt-1 text-xs text-gray-400">
                      This analysis is based on image recognition and should be used as a guide only. For severe cases, consult with an agricultural expert for confirmation.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <button
                  onClick={resetDetection}
                  className="inline-flex items-center text-primary-500 hover:text-primary-400"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Start New Detection
                </button>
              </div>
            </div>
          ) : (
            // Display tips when no detection is in progress
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">Crop Disease Detection Tips</h2>
              
              <div className="space-y-4">
                <div className="bg-background p-4 rounded-lg border border-gray-700">
                  <h3 className="text-white font-medium mb-2 flex items-center">
                    <div className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center mr-2">
                      <span className="text-primary-500 text-xs">1</span>
                    </div>
                    Take clear photos
                  </h3>
                  <p className="text-sm text-gray-400">
                    Ensure good lighting and focus on the affected area. Include both healthy and diseased parts for comparison.
                  </p>
                </div>
                
                <div className="bg-background p-4 rounded-lg border border-gray-700">
                  <h3 className="text-white font-medium mb-2 flex items-center">
                    <div className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center mr-2">
                      <span className="text-primary-500 text-xs">2</span>
                    </div>
                    Multiple angles
                  </h3>
                  <p className="text-sm text-gray-400">
                    For best results, upload multiple photos from different angles to improve detection accuracy.
                  </p>
                </div>
                
                <div className="bg-background p-4 rounded-lg border border-gray-700">
                  <h3 className="text-white font-medium mb-2 flex items-center">
                    <div className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center mr-2">
                      <span className="text-primary-500 text-xs">3</span>
                    </div>
                    Select correct crop type
                  </h3>
                  <p className="text-sm text-gray-400">
                    The detection system uses crop-specific models. Selecting the correct crop type improves accuracy.
                  </p>
                </div>
                
                <div className="bg-background p-4 rounded-lg border border-gray-700">
                  <h3 className="text-white font-medium mb-2 flex items-center">
                    <div className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center mr-2">
                      <span className="text-primary-500 text-xs">4</span>
                    </div>
                    Disease progression
                  </h3>
                  <p className="text-sm text-gray-400">
                    Early detection is crucial. Regular scanning helps identify diseases before they spread.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiseaseDetection;