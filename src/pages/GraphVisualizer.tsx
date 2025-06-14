
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';
import { BarChart, Settings, Plus, Trash2 } from 'lucide-react';

const GraphVisualizer = () => {
  const [functions, setFunctions] = useState(['y = sin(x)']);
  const [is3D, setIs3D] = useState(false);
  const [newFunction, setNewFunction] = useState('');

  const addFunction = () => {
    if (newFunction.trim()) {
      setFunctions([...functions, newFunction]);
      setNewFunction('');
    }
  };

  const removeFunction = (index: number) => {
    setFunctions(functions.filter((_, i) => i !== index));
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
              Graph Visualizer
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Interactive 2D/3D graph plotting tool for mathematical functions.
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
                {/* 2D/3D Toggle */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="3d-mode">3D Mode</Label>
                  <Switch
                    id="3d-mode"
                    checked={is3D}
                    onCheckedChange={setIs3D}
                  />
                </div>

                {/* Add Function */}
                <div className="space-y-2">
                  <Label htmlFor="function">Add Function</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="function"
                      value={newFunction}
                      onChange={(e) => setNewFunction(e.target.value)}
                      placeholder="e.g., y = x^2"
                    />
                    <Button onClick={addFunction} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Function List */}
                <div className="space-y-2">
                  <Label>Functions</Label>
                  {functions.map((func, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                      <code className="text-sm">{func}</code>
                      <Button
                        onClick={() => removeFunction(index)}
                        variant="ghost"
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                  Update Graph
                </Button>
              </CardContent>
            </Card>

            {/* Graph Display */}
            <div className="lg:col-span-2">
              <Card className="bg-white dark:bg-gray-800 h-full">
                <CardHeader>
                  <CardTitle>Graph Display</CardTitle>
                  <CardDescription>
                    {is3D ? '3D' : '2D'} visualization of your mathematical functions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                      <BarChart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">
                        Graph will be displayed here
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                        Currently showing: {functions.join(', ')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Examples */}
          <Card className="mt-8 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle>Function Examples</CardTitle>
              <CardDescription>Click on any example to add it to your graph</CardDescription>
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
                    onClick={() => setNewFunction(example)}
                    className="text-left justify-start"
                  >
                    <code>{example}</code>
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
