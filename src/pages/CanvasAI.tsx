import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';
import { Image, Download, RefreshCw, Eraser } from 'lucide-react';
import { useUserActivities } from '@/hooks/useUserActivities';

const CanvasAI = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { trackActivity } = useUserActivities();

  // Track page access when component mounts
  useEffect(() => {
    trackActivity('page_visited', { 
      page: 'Canvas AI',
      timestamp: new Date().toISOString()
    });
  }, [trackActivity]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black';

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'canvas_image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const analyzeCanvas = async () => {
    setIsAnalyzing(true);
    console.log('Analyzing canvas content...');
    
    // Track canvas usage activity
    trackActivity('canvas_used', { 
      action: 'analyze',
      timestamp: new Date().toISOString()
    });
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsAnalyzing(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
              <Image className="h-8 w-8 mr-3 text-purple-600" />
              Canvas AI
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Draw and analyze handwritten equations with AI.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Canvas */}
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Draw Your Equation</CardTitle>
                <CardDescription>Draw an equation and let AI analyze it.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <canvas
                    ref={canvasRef}
                    width={500}
                    height={300}
                    className="border border-gray-300 dark:border-gray-700 rounded-md cursor-crosshair"
                    onMouseDown={startDrawing}
                    onMouseUp={stopDrawing}
                    onMouseOut={stopDrawing}
                    onMouseMove={draw}
                  />
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-gray-100 dark:bg-gray-700 bg-opacity-50 flex items-center justify-center rounded-md">
                      <p className="text-lg text-gray-600 dark:text-gray-400 animate-pulse">
                        Analyzing...
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex justify-between mt-4">
                  <Button variant="outline" onClick={clearCanvas}>
                    <Eraser className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                  <Button onClick={analyzeCanvas} disabled={isAnalyzing}>
                    {isAnalyzing ? (
                      <>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Analyze
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Analysis Result</CardTitle>
                <CardDescription>AI analysis of your handwritten equation.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Analysis results will appear here.
                </p>
                <Button variant="secondary" className="mt-4 w-full" onClick={downloadCanvas}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Image
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CanvasAI;
