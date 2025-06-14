
import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';
import { Image, Eraser, RotateCcw, Wand2, Copy } from 'lucide-react';

const CanvasAI = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [solution, setSolution] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(event.clientX - rect.left, event.clientY - rect.top);
      }
    }
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineTo(event.clientX - rect.left, event.clientY - rect.top);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    setSolution(null);
  };

  const solveEquation = async () => {
    setIsProcessing(true);
    // Simulate AI processing
    setTimeout(() => {
      setSolution({
        equation: "2x + 3 = 7",
        steps: [
          { step: "2x + 3 = 7", description: "Original equation" },
          { step: "2x = 7 - 3", description: "Subtract 3 from both sides" },
          { step: "2x = 4", description: "Simplify" },
          { step: "x = 2", description: "Divide both sides by 2" }
        ],
        answer: "x = 2"
      });
      setIsProcessing(false);
    }, 2000);
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
              Solve handwritten math equations drawn on canvas with step-by-step solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Drawing Canvas */}
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Draw Your Equation</CardTitle>
                <CardDescription>
                  Write your mathematical equation on the canvas below
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                    <canvas
                      ref={canvasRef}
                      width={400}
                      height={300}
                      className="w-full cursor-crosshair bg-white"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      style={{ touchAction: 'none' }}
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button onClick={clearCanvas} variant="outline" className="flex-1">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                    <Button onClick={clearCanvas} variant="outline" className="flex-1">
                      <Eraser className="h-4 w-4 mr-2" />
                      Erase
                    </Button>
                  </div>

                  <Button
                    onClick={solveEquation}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  >
                    {isProcessing ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4 mr-2" />
                        Solve with AI
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Solution Display */}
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Solution</CardTitle>
                <CardDescription>
                  Step-by-step solution will appear here
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isProcessing ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">
                      AI is analyzing your handwriting...
                    </p>
                  </div>
                ) : solution ? (
                  <div className="space-y-4">
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
                        Detected Equation:
                      </h4>
                      <code className="text-lg">{solution.equation}</code>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold">Step-by-Step Solution:</h4>
                      {solution.steps.map((step: any, index: number) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {index + 1}
                          </div>
                          <div>
                            <code className="block font-mono text-sm mb-1">{step.step}</code>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                        Final Answer:
                      </h4>
                      <code className="text-xl text-green-800 dark:text-green-200">
                        {solution.answer}
                      </code>
                    </div>

                    <Button variant="outline" className="w-full">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Solution
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Image className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Draw an equation on the canvas and click "Solve with AI"
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Examples */}
          <Card className="mt-8 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle>Try These Examples</CardTitle>
              <CardDescription>Common mathematical equations you can draw and solve</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  '2x + 3 = 7',
                  'x² - 4 = 0',
                  '3(x + 2) = 15',
                  'sin(x) = 0.5',
                  '∫x²dx',
                  'd/dx(x³)',
                  'log(x) = 2',
                  '√(x + 1) = 3'
                ].map((example) => (
                  <div
                    key={example}
                    className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <code className="text-sm">{example}</code>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CanvasAI;
