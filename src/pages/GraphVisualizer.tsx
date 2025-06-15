
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';
import { BarChart, Settings, RefreshCw, Loader } from 'lucide-react';

const GraphVisualizer = () => {
  const [equation, setEquation] = useState('y = sin(x)');
  const [isLoading, setIsLoading] = useState(false);

  const updateGraph = async () => {
    setIsLoading(true);
    console.log('Updating graph with equation:', equation);
    
    // Simulate graph generation/calculation time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
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
              <BarChart className="h-8 w-8 mr-3 text-blue-600" />
              2D Graph Visualizer
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Interactive 2D graph plotting tool for mathematical functions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Controls */}
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Graph Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Single Equation Input */}
                <div className="space-y-2">
                  <Label htmlFor="equation">Mathematical Equation</Label>
                  <Input
                    id="equation"
                    value={equation}
                    onChange={(e) => setEquation(e.target.value)}
                    placeholder="e.g., y = x^2"
                    className="font-mono"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Enter a single equation to visualize
                  </p>
                </div>

                {/* Current Equation Display */}
                <div className="space-y-2">
                  <Label>Current Equation</Label>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md border">
                    <code className="text-sm font-mono text-blue-600 dark:text-blue-400">
                      {equation}
                    </code>
                  </div>
                </div>

                <Button 
                  onClick={updateGraph}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Generating Graph...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Update Graph
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Graph Display */}
            <div className="lg:col-span-2">
              <Card className="bg-white dark:bg-gray-800 h-full">
                <CardHeader>
                  <CardTitle>2D Graph Display</CardTitle>
                  <CardDescription>
                    2D visualization of your mathematical function
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center min-h-[400px] relative">
                    {isLoading ? (
                      <div className="text-center">
                        <Loader className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-spin" />
                        <p className="text-gray-600 dark:text-gray-400 mb-2">
                          Generating graph...
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                          Processing: <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">{equation}</code>
                        </p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <BarChart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">
                          2D Graph will be displayed here
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                          Currently showing: <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">{equation}</code>
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Examples */}
          <Card className="mt-8 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle>Function Examples</CardTitle>
              <CardDescription>Click on any example to load it as your equation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  'y = x^2',
                  'y = sin(x)',
                  'y = cos(x)',
                  'y = tan(x)',
                  'y = log(x)',
                  'y = e^x',
                  'y = sqrt(x)',
                  'y = abs(x)'
                ].map((example) => (
                  <Button
                    key={example}
                    variant="outline"
                    onClick={() => setEquation(example)}
                    className="text-left justify-start font-mono"
                  >
                    {example}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default GraphVisualizer;
