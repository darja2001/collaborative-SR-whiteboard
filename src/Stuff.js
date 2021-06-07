import logo from './logo.svg';
import './App.css';
import { Layer, Stage, Text, Rect, Line, Image } from 'react-konva';
import { Html, useImage } from 'react-konva-utils';
import React from 'react';

function App() {

  const [tool, setTool] = React.useState('pen');
  const [brushSize, setBrushSize] = React.useState('5');
  const [colour, setColour] = React.useState('#00000');
  const [lines, setLines] = React.useState([]);
  const isDrawing = React.useRef(false);

  const Images = () => {
    const[image] = useImage('https://static01.nyt.com/images/2020/10/20/science/30TB-PENGUINS04/30TB-PENGUINS04-jumbo.jpg?quality=90&auto=webp');
    return <Image image={image} 
    draggable
    width={200}
    height={200}
    />;
  }

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { colour, brushSize, tool, points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e) => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  }; 


  return (
    <div className="container">
      <text>Draw something!</text>

      <select
        value={tool}
        onChange={(e) => {
          setTool(e.target.value);
        }}
      >
        <option value="pen">Pen</option>
        <option value="eraser">Eraser</option>
      </select>
      <select
        value={brushSize}
        onChange={(e) => {
          setBrushSize(e.target.value);
        }}
      >
        <option value="5">5</option>
        <option value="50">50</option>
      </select>
      <input type="color"
        value={colour}
        onChange={(e) => {
          setColour(e.target.value);
        }}/>


      <div className="canvas">
        <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        >

        <Layer>
        <Images
        draggable
        />
        {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke={line.colour}
              strokeWidth={line.brushSize}
              tension={0.5}
              lineCap="round"
              globalCompositeOperation={
                line.tool === 'eraser' ? 'destination-out' : 'source-over'
              }
            />
          ))}
        </Layer>
        </Stage>
        
      </div>
      
    </div>
  );
}

export default App;
