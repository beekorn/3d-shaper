import React, { useState, useEffect, useRef } from 'react';
import { Menu as MenuIcon, X, Info, Settings, Rotate3d, Palette, Box, Maximize, Play, Pause, Layers } from 'lucide-react';
import Scene from './components/Scene.tsx';
import ReadmeModal from './components/ReadmeModal.tsx';

const COLORS = [
  { name: 'Electric Blue', value: '#3b82f6' },
  { name: 'Neon Green', value: '#22c55e' },
  { name: 'Vibrant Red', value: '#ef4444' },
  { name: 'Cyber Purple', value: '#a855f7' },
  { name: 'Hot Pink', value: '#ec4899' },
  { name: 'Amber Gold', value: '#f59e0b' },
  { name: 'Pure White', value: '#ffffff' },
  { name: 'Slate Gray', value: '#64748b' }
];

const SHAPES = ['Cube', 'Sphere', 'Torus', 'Octahedron', 'Knot', 'Dodecahedron', 'Icosahedron', 'Cone'];
const TEXTURES = ['None', 'Stone & Patterns', 'Brick', 'Wood', 'Stone'];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isReadmeOpen, setIsReadmeOpen] = useState(false);
  
  // 3D Scene State
  const [config, setConfig] = useState({
    color: '#3b82f6',
    shape: 'Cube',
    autoRotate: true,
    rotationSpeed: 1,
    wireframe: false,
    metalness: 0.5,
    roughness: 0.2,
    scale: 1,
    texture: 'none',
    mixColor: false,
  });

  return (
    <div className="relative w-full h-full text-white font-sans">
      {/* 3D Scene Layer */}
      <Scene config={config} />

      {/* Top Left Menu Toggle */}
      <button 
        onClick={() => setIsMenuOpen(true)}
        className="fixed top-4 left-4 z-40 p-3 bg-black/50 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/10 transition-all"
      >
        <MenuIcon size={24} />
      </button>

      {/* Collapsible Menu Sidebar */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div 
            className="absolute inset-0 bg-black/40" 
            onClick={() => setIsMenuOpen(false)} 
          />
          <div className="relative w-80 h-full bg-slate-900 border-r border-white/10 shadow-2xl flex flex-col">
            {/* Menu Header */}
            <div className="p-6 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2">
                <Settings className="text-blue-400" />
                <h2 className="text-xl font-bold uppercase tracking-wider">Controls</h2>
              </div>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Menu Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Readme Button */}
              <button 
                onClick={() => setIsReadmeOpen(true)}
                className="w-full flex items-center gap-3 p-3 bg-blue-600/20 text-blue-300 border border-blue-500/30 rounded-xl hover:bg-blue-600/30 transition-all"
              >
                <Info size={20} />
                <span className="font-medium">How to Use / README</span>
              </button>

              {/* Shape Selection */}
              <section>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-400 mb-4">
                  <Box size={16} /> GEOMETRY
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {SHAPES.map(s => (
                    <button
                      key={s}
                      onClick={() => setConfig({...config, shape: s})}
                      className={`px-3 py-2 rounded-lg text-sm border transition-all ${
                        config.shape === s 
                        ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-900/40' 
                        : 'bg-slate-800 border-white/5 text-slate-400 hover:border-white/20'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </section>

              {/* Color Selection */}
              <section>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-400 mb-4">
                  <Palette size={16} /> APPEARANCE
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {COLORS.map(c => (
                    <button
                      key={c.value}
                      onClick={() => setConfig({...config, color: c.value})}
                      title={c.name}
                      className={`w-10 h-10 rounded-full border-2 transition-all transform hover:scale-110 ${
                        config.color === c.value ? 'border-white scale-110 shadow-xl' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c.value }}
                    />
                  ))}
                </div>
                
                <div className="mt-6 space-y-4">
                   <label className="flex items-center justify-between text-sm">
                    <span>Wireframe Mode</span>
                    <input 
                      type="checkbox" 
                      checked={config.wireframe}
                      onChange={(e) => setConfig({...config, wireframe: e.target.checked})}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </label>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Reflectivity (Metalness)</span>
                      <span>{Math.round(config.metalness * 100)}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="1" step="0.01"
                      value={config.metalness}
                      onChange={(e) => setConfig({...config, metalness: parseFloat(e.target.value)})}
                      className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </section>

              {/* Texture Selection */}
              <section>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-400 mb-4">
                  <Layers size={16} /> TEXTURE
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {TEXTURES.map(t => (
                    <button
                      key={t}
                      onClick={() => setConfig({...config, texture: t.toLowerCase()})}
                      className={`px-3 py-2 rounded-lg text-sm border transition-all ${
                        config.texture === t.toLowerCase()
                        ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-900/40' 
                        : 'bg-slate-800 border-white/5 text-slate-400 hover:border-white/20'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </section>

              {/* Animation Controls */}
              <section>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-400 mb-4">
                  <Rotate3d size={16} /> MOTION
                </label>
                <div className="space-y-4">
                  <button 
                    onClick={() => setConfig({...config, autoRotate: !config.autoRotate})}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
                      config.autoRotate ? 'bg-green-600/20 text-green-400 border border-green-500/30' : 'bg-red-600/20 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {config.autoRotate ? <Pause size={18} /> : <Play size={18} />}
                    {config.autoRotate ? 'Auto-Rotate Active' : 'Auto-Rotate Paused'}
                  </button>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Rotation Speed</span>
                      <span>{config.rotationSpeed}x</span>
                    </div>
                    <input 
                      type="range" min="0.1" max="5" step="0.1"
                      value={config.rotationSpeed}
                      onChange={(e) => setConfig({...config, rotationSpeed: parseFloat(e.target.value)})}
                      className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </section>

              {/* Scale */}
              <section>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-400 mb-4">
                  <Maximize size={16} /> SCALE
                </label>
                <input 
                  type="range" min="0.5" max="2" step="0.1"
                  value={config.scale}
                  onChange={(e) => setConfig({...config, scale: parseFloat(e.target.value)})}
                  className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </section>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 text-center">
              <p className="text-xs text-slate-500">PRO-3D Visualizer v1.0</p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Instructions (HUD) */}
      {!isMenuOpen && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 pointer-events-none">
          <div className="px-6 py-2 bg-black/30 backdrop-blur-sm border border-white/10 rounded-full text-xs text-white/60 uppercase tracking-widest">
            Drag to Rotate • Scroll to Zoom • Tap for Menu
          </div>
        </div>
      )}

      {/* Modals */}
      {isReadmeOpen && <ReadmeModal onClose={() => setIsReadmeOpen(false)} />}
    </div>
  );
}
