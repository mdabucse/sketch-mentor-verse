import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';
import { Image, Eraser, RotateCcw, Wand2, Copy, Pencil, Circle, Square, Minus, Play, Palette } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const CanvasAI = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#ffffff');
  const [lineWidth, setLineWidth] = useState(3);
  const [shape, setShape] = useState('free');
  const [startPos, setStartPos] = useState<{x: number, y: number} | null>(null);
  const [isErasing, setIsErasing] = useState(false);
  const [activeTool, setActiveTool] = useState('free');
  const [responseText, setResponseText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Predefined colors for quick selection
  const presetColors = [
    '#ffffff', '#ff0000', '#00ff00', '#0000ff',
    '#ffff00', '#ff00ff', '#00ffff', '#ffa500',
    '#800080', '#ffc0cb', '#a52a2a', '#808080'
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        // Set black background
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    if (isErasing) {
      const size = lineWidth * 2;
      ctx.clearRect(offsetX - size / 2, offsetY - size / 2, size, size);
      // Fill cleared area with black background
      ctx.fillStyle = '#000000';
      ctx.fillRect(offsetX - size / 2, offsetY - size / 2, size, size);
    } else if (shape === 'free') {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY);
    } else {
      setStartPos({ x: offsetX, y: offsetY });
    }
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    if (isErasing) {
      const size = lineWidth * 2;
      ctx.clearRect(offsetX - size / 2, offsetY - size / 2, size, size);
      // Fill cleared area with black background
      ctx.fillStyle = '#000000';
      ctx.fillRect(offsetX - size / 2, offsetY - size / 2, size, size);
    } else if (shape === 'free') {
      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();
    }
  };

  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (isErasing) return;

    if (shape !== 'free' && startPos) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const endX = e.clientX - rect.left;
      const endY = e.clientY - rect.top;

      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;

      if (shape === 'rectangle') {
        ctx.strokeRect(startPos.x, startPos.y, endX - startPos.x, endY - startPos.y);
      } else if (shape === 'circle') {
        const radius = Math.sqrt((endX - startPos.x) ** 2 + (endY - startPos.y) ** 2);
        ctx.beginPath();
        ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (shape === 'line') {
        ctx.beginPath();
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }
    }
    setStartPos(null);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Set black background
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
    setResponseText('');
  };

  const selectTool = (tool: string) => {
    setActiveTool(tool);
    setIsErasing(tool === 'eraser');
    if (tool !== 'eraser') setShape(tool);
  };

  const runBackendAnalysis = async () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error('Canvas reference not found.');
      setResponseText('Error: Canvas not found.');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check if canvas has any content
    const hasContent = (() => {
      const pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      for (let i = 0; i < pixelData.length; i += 4) {
        // Check if pixel is not black (allowing for some tolerance)
        if (pixelData[i] > 10 || pixelData[i + 1] > 10 || pixelData[i + 2] > 10) {
          return true;
        }
      }
      return false;
    })();

    if (!hasContent) {
      console.error('Canvas is empty. Please draw something.');
      setResponseText('Error: Please draw something before running.');
      return;
    }

    // Convert canvas to base64 image
    const imageData = canvas.toDataURL('image/png');

    if (!imageData || imageData.length < 100) {
      console.error('Image data is empty or too small.');
      setResponseText('Error: Image data is invalid.');
      return;
    }

    setIsProcessing(true);
    
    try {
      console.log('Sending image data to backend...');

      const response = await axios.post(
        'https://srt9mmrf-5000.inc1.devtunnels.ms/calculate',
        { image: imageData, dict_of_vars: {} },
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log('Backend Response:', response.data);

      if (
        response.data &&
        Array.isArray(response.data.data) &&
        response.data.data.length > 0
      ) {
        const resultObj = response.data.data[0];
        
        setResponseText(`${resultObj.expr} = ${resultObj.result}`);

        // Clear canvas and display result
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Arial';

        console.log('Drawing on Canvas:', resultObj.expr, resultObj.result);

        ctx.fillText(`Expression: ${resultObj.expr}`, 20, 50);
        ctx.fillText(`Result: ${resultObj.result}`, 20, 100);
      } else {
        console.error('Unexpected backend response format:', response.data);
        setResponseText('Error: Unexpected backend response.');
      }
    } catch (error) {
      console.error('Error calling backend:', error);
      setResponseText('Network error. Check backend server.');
    } finally {
      setIsProcessing(false);
    }
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
              Draw mathematical equations and get step-by-step solutions powered by AI.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Drawing Canvas */}
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Drawing Canvas</CardTitle>
                <CardDescription>
                  Use the tools below to draw your mathematical equation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Drawing Tools */}
                  <div className="flex flex-wrap gap-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Button
                      variant={activeTool === 'free' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => selectTool('free')}
                      className="flex items-center gap-2"
                    >
                      <Pencil className="h-4 w-4" />
                      Pen
                    </Button>

                    <Button
                      variant={activeTool === 'rectangle' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => selectTool('rectangle')}
                      className="flex items-center gap-2"
                    >
                      <Square className="h-4 w-4" />
                      Rectangle
                    </Button>

                    <Button
                      variant={activeTool === 'circle' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => selectTool('circle')}
                      className="flex items-center gap-2"
                    >
                      <Circle className="h-4 w-4" />
                      Circle
                    </Button>

                    <Button
                      variant={activeTool === 'line' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => selectTool('line')}
                      className="flex items-center gap-2"
                    >
                      <Minus className="h-4 w-4" />
                      Line
                    </Button>

                    <Button
                      variant={activeTool === 'eraser' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => selectTool('eraser')}
                      className="flex items-center gap-2"
                    >
                      <Eraser className="h-4 w-4" />
                      Eraser
                    </Button>
                  </div>

                  {/* Enhanced Canvas Controls */}
                  <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    {/* Pencil Size Control */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Pencil Size</label>
                        <span className="text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded">
                          {lineWidth}px
                        </span>
                      </div>
                      <Slider
                        value={[lineWidth]}
                        onValueChange={(value) => setLineWidth(value[0])}
                        min={1}
                        max={20}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    {/* Color Controls */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Colors</label>
                      <div className="flex items-center gap-2">
                        {/* Color Picker */}
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={isErasing}
                              className="w-10 h-10 p-0 border-2"
                              style={{ backgroundColor: color }}
                            >
                              <Palette className="h-4 w-4" style={{ color: color === '#ffffff' ? '#000000' : '#ffffff' }} />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-3">
                            <div className="space-y-3">
                              <div>
                                <label className="text-xs font-medium mb-2 block">Custom Color</label>
                                <input
                                  type="color"
                                  value={color}
                                  onChange={(e) => setColor(e.target.value)}
                                  className="w-full h-8 rounded border border-gray-300 dark:border-gray-600"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-medium mb-2 block">Preset Colors</label>
                                <div className="grid grid-cols-4 gap-1">
                                  {presetColors.map((presetColor) => (
                                    <button
                                      key={presetColor}
                                      onClick={() => setColor(presetColor)}
                                      className={`w-8 h-8 rounded border-2 ${
                                        color === presetColor 
                                          ? 'border-blue-500 ring-2 ring-blue-200' 
                                          : 'border-gray-300 dark:border-gray-600'
                                      }`}
                                      style={{ backgroundColor: presetColor }}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>

                        {/* Quick Color Buttons */}
                        <div className="flex gap-1">
                          {presetColors.slice(0, 6).map((presetColor) => (
                            <button
                              key={presetColor}
                              onClick={() => setColor(presetColor)}
                              disabled={isErasing}
                              className={`w-6 h-6 rounded border ${
                                color === presetColor 
                                  ? 'border-blue-500 ring-1 ring-blue-300' 
                                  : 'border-gray-300 dark:border-gray-600'
                              } disabled:opacity-50`}
                              style={{ backgroundColor: presetColor }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Canvas */}
                  <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                    <canvas
                      ref={canvasRef}
                      width={500}
                      height={400}
                      className="w-full cursor-crosshair bg-black"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      style={{ touchAction: 'none' }}
                    />
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={runBackendAnalysis}
                      disabled={isProcessing}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    >
                      {isProcessing ? (
                        <>
                          <Wand2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Solve with AI
                        </>
                      )}
                    </Button>

                    <Button onClick={clearCanvas} variant="outline">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Solution Display */}
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>AI Solution</CardTitle>
                <CardDescription>
                  Mathematical analysis results will appear here
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isProcessing ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">
                      AI is analyzing your drawing...
                    </p>
                  </div>
                ) : responseText ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                        Solution:
                      </h4>
                      <code className="text-lg text-green-800 dark:text-green-200 font-mono">
                        {responseText}
                      </code>
                    </div>

                    <Button variant="outline" className="w-full" onClick={() => navigator.clipboard.writeText(responseText)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Solution
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Image className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Draw a mathematical equation on the canvas and click "Solve with AI"
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
