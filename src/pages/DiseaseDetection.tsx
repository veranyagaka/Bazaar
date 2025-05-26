import { useState, useRef } from 'react';
import { Camera, Upload, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { useUser } from '@clerk/clerk-react';

interface DetectionResult {
  disease_name: string;
  confidence_score: number;
  severity: 'mild' | 'moderate' | 'severe' | 'critical';
  affected_area_percentage: number;
  symptoms: string[];
  causes: string[];
  treatment_recommendations: string[];
  preventive_measures: string[];
  urgency: 'low' | 'medium' | 'high' | 'immediate';
  estimated_yield_loss: number;
  follow_up_required: boolean;
  follow_up_days: number;
}

const DiseaseDetection = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [cropType, setCropType] = useState<string>('maize');
  const [location, setLocation] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useUser();

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setDetectionResult(null);
    }
  };

  const uploadImageToSupabase = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('disease-images')
      .upload(fileName, file);

    if (error) {
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('disease-images')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const callAIDetectionService = async (imageUrl: string): Promise<DetectionResult> => {
    const { data, error } = await supabase.functions.invoke('ai-disease-detection', {
      body: {
        imageUrl,
        cropType,
        location: location || 'Kenya'
      }
    });

    if (error) {
      throw error;
    }

    return data;
  };

  const saveDetectionResult = async (imageUrl: string, result: DetectionResult) => {
    const { error } = await supabase
      .from('disease_detections')
      .insert({
        farmer_id: user?.id,
        image_url: imageUrl,
        disease_name: result.disease_name,
        confidence_score: result.confidence_score,
        severity: result.severity,
        affected_area_percentage: result.affected_area_percentage,
        symptoms: result.symptoms,
        causes: result.causes,
        treatment_recommendations: result.treatment_recommendations,
        preventive_measures: result.preventive_measures,
        urgency: result.urgency,
        estimated_yield_loss: result.estimated_yield_loss,
        location: location || 'Kenya',
        follow_up_required: result.follow_up_required,
        follow_up_date: result.follow_up_required ? 
          new Date(Date.now() + result.follow_up_days * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null
      });

    if (error) {
      throw error;
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage || !user) {
      toast({
        title: "Error",
        description: "Please select an image and ensure you're logged in",
        variant: "destructive"
      });
      return;
    }

    if (!location.trim()) {
      toast({
        title: "Location Required",
        description: "Please enter your location for better analysis",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Upload image to Supabase Storage
      const imageUrl = await uploadImageToSupabase(selectedImage);
      
      // Call real AI detection service
      const result = await callAIDetectionService(imageUrl);
      
      // Save detection result to database
      await saveDetectionResult(imageUrl, result);
      
      setDetectionResult(result);
      
      // Trigger data warehouse sync
      try {
        await supabase.functions.invoke('data-warehouse-sync');
      } catch (syncError) {
        console.error('Data warehouse sync failed:', syncError);
        // Don't fail the main operation if sync fails
      }
      
      toast({
        title: "Analysis Complete",
        description: `Disease analysis completed with ${(result.confidence_score * 100).toFixed(1)}% confidence`
      });
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze the image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'text-green-500';
      case 'moderate': return 'text-yellow-500';
      case 'severe': return 'text-orange-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'low': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'medium': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'high': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'immediate': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            AI Crop Disease Detection
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Upload photos of your crops to get instant disease diagnosis and treatment recommendations powered by advanced AI
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Upload Section */}
          <div className="gradient-card p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-foreground mb-4">Upload Crop Image</h2>
            
            <div className="space-y-4">
              {/* Crop Type and Location Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Crop Type
                  </label>
                  <select
                    value={cropType}
                    onChange={(e) => setCropType(e.target.value)}
                    className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
                  >
                    <option value="maize">Maize</option>
                    <option value="beans">Beans</option>
                    <option value="potatoes">Potatoes</option>
                    <option value="tomatoes">Tomatoes</option>
                    <option value="kale">Kale (Sukuma Wiki)</option>
                    <option value="cabbage">Cabbage</option>
                    <option value="onions">Onions</option>
                    <option value="coffee">Coffee</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Location/County
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Nairobi, Kiambu"
                    className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
                  />
                </div>
              </div>

              {!imagePreview ? (
                <div 
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">Click to upload or drag and drop</p>
                  <p className="text-sm text-muted-foreground">PNG, JPG or JPEG (max 10MB)</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Selected crop" 
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setImagePreview(null);
                        setSelectedImage(null);
                        setDetectionResult(null);
                      }}
                    >
                      Change Image
                    </Button>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />

              <Button
                onClick={handleAnalyze}
                disabled={!selectedImage || isAnalyzing || !location.trim()}
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Analyzing with AI...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Analyze for Diseases
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Results Section */}
          <div className="gradient-card p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-foreground mb-4">AI Analysis Results</h2>
            
            {!detectionResult ? (
              <div className="text-center py-12">
                <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Upload and analyze an image to see AI-powered disease detection results
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Disease Info */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">
                      {detectionResult.disease_name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {getUrgencyIcon(detectionResult.urgency)}
                      <span className="text-sm capitalize text-muted-foreground">
                        {detectionResult.urgency} urgency
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-muted-foreground">
                      Confidence: {(detectionResult.confidence_score * 100).toFixed(1)}%
                    </span>
                    <span className={`text-sm font-medium capitalize ${getSeverityColor(detectionResult.severity)}`}>
                      {detectionResult.severity} severity
                    </span>
                  </div>

                  {detectionResult.affected_area_percentage > 0 && (
                    <div className="text-sm text-muted-foreground">
                      Affected Area: {detectionResult.affected_area_percentage.toFixed(1)}%
                    </div>
                  )}

                  {detectionResult.estimated_yield_loss > 0 && (
                    <div className="text-sm text-orange-600">
                      Estimated Yield Loss: {detectionResult.estimated_yield_loss.toFixed(1)}%
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-2">Symptoms</h4>
                  <ul className="space-y-1">
                    {detectionResult.symptoms.map((symptom, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-center">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                        {symptom}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Treatment */}
                <div>
                  <h4 className="font-medium text-foreground mb-2">Treatment Recommendations</h4>
                  <ul className="space-y-1">
                    {detectionResult.treatment_recommendations.map((treatment, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-center">
                        <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                        {treatment}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Prevention */}
                <div>
                  <h4 className="font-medium text-foreground mb-2">Prevention Measures</h4>
                  <ul className="space-y-1">
                    {detectionResult.preventive_measures.map((measure, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-center">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" />
                        {measure}
                      </li>
                    ))}
                  </ul>
                </div>

                {detectionResult.follow_up_required && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      <AlertTriangle className="w-4 h-4 inline mr-2" />
                      Follow-up recommended in {detectionResult.follow_up_days} days
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiseaseDetection;
