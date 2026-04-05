# Pro-3D Interactive Visualizer

## Project Overview
A professional-grade 3D object visualization tool designed for web browsers. It provides an interactive sandbox for exploring various geometries, materials, and motion profiles in a high-fidelity WebGL environment.

## User Manual
1.  **Interaction**: 
    - **Mouse**: Click and drag on the 3D canvas to manually rotate the object in any direction. Scroll to zoom in and out.
    - **Touch**: Drag with one finger to rotate. Zoom is managed via the UI slider for accessibility on all devices.
2.  **Configuration Menu**:
    - Access the menu by clicking the hamburger icon (top-left corner).
    - Change shapes (Cube, Sphere, Torus, etc.) using the geometry buttons.
    - Modify color by selecting one of the palette circles.
    - Adjust physical properties like metalness and scale using sliders.
    - Toggle auto-rotation and adjust its speed to visualize the object in motion.
3.  **About/README**:
    - Click the 'How to Use' button in the menu to open this documentation overlay.

## Feature Specification
- **3D Engine**: Uses a Perspective Camera and WebGL Renderer for depth-accurate visualization.
- **Dynamic Materials**: Implements MeshStandardMaterial which supports lighting calculations (PBR).
- **Responsive Controls**: The interface automatically collapses and adapts to mobile screen sizes, ensuring the 3D view remains central.
- **Lighting System**: Features multiple light sources (Ambient and Point lights) to accentuate surface contours and material properties.

## Technical Architecture
- **State Management**: React's `useState` manages the visual configuration which is passed into the 3D scene.
- **3D Lifecycle**: A dedicated `Scene` component handles the Three.js lifecycle using `useEffect` for creation, updates, and cleanup.
- **Styling**: Tailwind CSS is used for the modern, blurred-translucent UI overlays.
- **Events**: Native window event listeners handle mouse and touch inputs, mapped to Three.js Quaternions for smooth, non-gimbal-locked rotation.