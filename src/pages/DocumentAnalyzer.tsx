
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';
import { FileText, Upload, BookOpen, Brain, Download } from 'lucide-react';

const DocumentAnalyzer = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const analyzeDocument = async () => {
    setIsAnalyzing(true);
    // Simulate analysis
    setTimeout(() => {
      setAnalysisResults({
        quizzes: [
          {
            question: "What is the derivative of x^2?",
            options: ["2x", "x", "x^2", "2"],
            correct: 0
          },
          {
            question: "What is the integral of sin(x)?",
            options: ["-cos(x)", "cos(x)", "sin(x)", "-sin(x)"],
            correct: 0
          }
        ],
        flashcards: [
          {
            front: "Derivative",
            back: "The rate of change of a function with respect to its variable"
          },
          {
            front: "Integral",
            back: "The inverse operation of differentiation"
          }
        ],
        studyPath: [
          "Review basic calculus concepts",
          "Practice derivative rules",
          "Work on integration techniques",
          "Apply to real-world problems"
        ]
      });
      setIsAnalyzing(false);
    }, 3000);
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
              <FileText className="h-8 w-8 mr-3 text-green-600" />
              Document Analyzer
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Upload PDFs to extract quizzes, flashcards, and personalized learning paths.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upload Section */}
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Document
                </CardTitle>
                <CardDescription>
                  Upload PDF or DOCX files for analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-green-500 transition-colors"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      PDF, DOCX up to 10MB
                    </p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  
                  {uploadedFile && (
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">
                        {uploadedFile.name}
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-300">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={analyzeDocument}
                    disabled={!uploadedFile || isAnalyzing}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Document'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results Section */}
            <div className="lg:col-span-2 space-y-6">
              {isAnalyzing && (
                <Card className="bg-white dark:bg-gray-800">
                  <CardContent className="p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Analyzing document with AI...
                    </p>
                  </CardContent>
                </Card>
              )}

              {analysisResults && (
                <>
                  {/* Generated Quizzes */}
                  <Card className="bg-white dark:bg-gray-800">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Brain className="h-5 w-5 mr-2" />
                        Generated Quizzes
                      </CardTitle>
                      <CardDescription>
                        {analysisResults.quizzes.length} questions extracted from your document
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analysisResults.quizzes.map((quiz: any, index: number) => (
                          <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <p className="font-medium mb-3">{quiz.question}</p>
                            <div className="grid grid-cols-2 gap-2">
                              {quiz.options.map((option: string, optIndex: number) => (
                                <Badge
                                  key={optIndex}
                                  variant={optIndex === quiz.correct ? "default" : "outline"}
                                  className="justify-start p-2"
                                >
                                  {option}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Flashcards */}
                  <Card className="bg-white dark:bg-gray-800">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BookOpen className="h-5 w-5 mr-2" />
                        Flashcards
                      </CardTitle>
                      <CardDescription>
                        Key concepts extracted for quick review
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {analysisResults.flashcards.map((card: any, index: number) => (
                          <div key={index} className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white">
                            <div className="font-semibold mb-2">{card.front}</div>
                            <div className="text-sm opacity-90">{card.back}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Study Path */}
                  <Card className="bg-white dark:bg-gray-800">
                    <CardHeader>
                      <CardTitle>Personalized Study Path</CardTitle>
                      <CardDescription>
                        Recommended learning sequence based on your document
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {analysisResults.studyPath.map((step: string, index: number) => (
                          <div key={index} className="flex items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                              {index + 1}
                            </div>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                      <Button className="w-full mt-4" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export Study Materials
                      </Button>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DocumentAnalyzer;
