import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Landing from "./pages/Landing";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import VideoGenerator from "./pages/VideoGenerator";
import GraphVisualizer from "./pages/GraphVisualizer";
import DocumentAnalyzer from "./pages/DocumentAnalyzer";
import CanvasAI from "./pages/CanvasAI";
import YouTubeTranscriber from "./pages/YouTubeTranscriber";
import SettingsPage from "./pages/Settings"; // Import the new Settings page
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/video-generator" element={
                <ProtectedRoute>
                  <VideoGenerator />
                </ProtectedRoute>
              } />
              <Route path="/graph-visualizer" element={
                <ProtectedRoute>
                  <GraphVisualizer />
                </ProtectedRoute>
              } />
              <Route path="/document-analyzer" element={
                <ProtectedRoute>
                  <DocumentAnalyzer />
                </ProtectedRoute>
              } />
              <Route path="/canvas-ai" element={
                <ProtectedRoute>
                  <CanvasAI />
                </ProtectedRoute>
              } />
              <Route path="/youtube-transcriber" element={
                <ProtectedRoute>
                  <YouTubeTranscriber />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
