# Turkish Football Career Game

A text-based interactive game where you play as a young Turkish footballer trying to make it to the top.

## How to Run

### Option 1: Using the Custom Server (Recommended)
```bash
python3 server.py
```
Then open your browser and go to: `http://localhost:8000`

### Option 2: Using Python's Built-in Server
```bash
python3 -m http.server 8000
```
Then open your browser and go to: `http://localhost:8000`

### Option 3: Using Node.js (if you have it installed)
```bash
npx http-server
```

### Game Starts at Beginning Scene
- The game is designed to start at scene1 by default
- You can start from a specific scene by adding `?scene=sceneX` to the URL
- Example: `http://localhost:8000?scene=scene5a`

### Features
- Interactive storyline with multiple paths
- Player stats that affect the story
- Achievement system
- Game history tracking
- Beautiful UI with animations

## File Structure
- `index.html` - Main game page
- `script.js` - Game logic and mechanics
- `scenes.json` - All game scenes and story content
- `style.css` - Game styling and animations
- `server.py` - Custom server with proper headers
