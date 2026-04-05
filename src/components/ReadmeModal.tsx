import React from 'react';
import { X } from 'lucide-react';

export default function ReadmeModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl max-h-[80vh] bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-slate-800/50">
          <h2 className="text-2xl font-bold text-blue-400">Pro-3D Visualizer Guide</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 text-slate-300">
          <section>
            <h3 className="text-lg font-semibold text-white mb-2 italic">Interactive Controls</h3>
            <ul className="list-disc list-inside space-y-2 opacity-80">
              <li><strong className="text-blue-400">Rotate:</strong> Click and drag anywhere on the screen (or use touch).</li>
              <li><strong className="text-blue-400">Zoom:</strong> Use your mouse scroll wheel to move closer or further.</li>
              <li><strong className="text-blue-400">Settings:</strong> Click the hamburger icon in the top-left to open customization options.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-2 italic">Customization Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <h4 className="text-blue-400 font-bold mb-1">Geometry</h4>
                <p className="text-sm">Choose from five unique 3D shapes including cubes, knots, and toruses.</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <h4 className="text-blue-400 font-bold mb-1">Materials</h4>
                <p className="text-sm">Adjust metalness and roughness to see how the object reacts to lights.</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <h4 className="text-blue-400 font-bold mb-1">Animation</h4>
                <p className="text-sm">Toggle auto-rotation and control the speed of the spin.</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <h4 className="text-blue-400 font-bold mb-1">Wireframe</h4>
                <p className="text-sm">Switch to wireframe mode to see the underlying geometry structure.</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-2 italic">Technical Notes</h3>
            <p className="text-sm opacity-70 leading-relaxed">
              This application is built using <strong>React 18</strong> and <strong>Three.js</strong>. 
              It utilizes a WebGL-based rendering pipeline with antialiasing for crisp visuals. 
              The lighting setup includes a global ambient light and two dynamic point lights 
              to provide depth and highlights to the surfaces.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-slate-800/30 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/40"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
