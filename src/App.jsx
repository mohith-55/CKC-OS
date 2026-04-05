import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Index from './pages/index.jsx'
import EditorPage from './pages/editor.jsx'
import DevChat from "./pages/devchat.jsx"
import SandBox from "./pages/sandbox.jsx";
import ApiTesting from "./pages/api.jsx";
import PerformanceMonitor from "./pages/performance.jsx";

import Frustration from "./pages/frustration.jsx";
import Cognitive from "./pages/cognitive.jsx";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/editor" element={<EditorPage />} />
        <Route path="/devchat" element={<DevChat />} />
        <Route path="/sandbox" element={<SandBox />} />
        <Route path="/api" element={<ApiTesting />} />
        <Route path="/performance" element={<PerformanceMonitor />} /><Route path="/frustration" element={<Frustration/>} />
        
        <Route path="/frustration" element={<Frustration/>} />
        <Route path="/cognitive" element={<Cognitive/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App