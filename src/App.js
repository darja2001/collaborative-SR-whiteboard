import React, { useState, useRef, useEffect } from "react";
//import ButtonGroup from "react-bootstrap/ButtonGroup";
//import Button from "react-bootstrap/Button";
import { Stage, Layer, Image } from "react-konva";
import Rectangle from "./Rectangle";
import Circle from "./Circle";
import { addLine } from "./line";
import { addTextNode } from "./textNode";
import useImage from "use-image";
import socketIOClient from "socket.io-client";
import io from 'socket.io-client';
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const ENDPOINT = "http://127.0.0.1:4001";

function App() {

  const [rectangles, setRectangles] = useState([]);
  const [circles, setCircles] = useState([]);
  const [selectedId, selectShape] = useState(null);
  const [shapes, setShapes] = useState([]);
  const [, updateState] = React.useState();
  const stageEl = React.createRef();
  const layerEl = React.createRef();
  const fileUploadEl = React.createRef();
  const [brushSize, setBrushSize] = React.useState('5');
  const [isDrawing, setIsDrawing] = React.useState(false);
  const dragUrl = React.useRef();
  //const stageRef = React.useRef();
  const [images, setImages] = React.useState([]);
  const [loadImages, setLoadImages] = React.useState([]);
  const getRandomInt = max => {
    return Math.floor(Math.random() * Math.floor(max));
  };

  const {transcript} = useSpeechRecognition();

  const URLImage = ({image}) => {
    const [img] = useImage(image.src);
    return (
      <Image
        image = {img}
        x = {image.x}
        y = {image.y}

        offsetX = {50}
        offsetY = {50}

        width={200}
        height={200}
        draggable
      />
    );
  };

  const drawLine = () => {
    setIsDrawing(true);
    if(isDrawing){
      console.log(isDrawing);
      addLine(stageEl.current.getStage(), layerEl.current, brushSize);
    };
  };

  const eraseLine = () => {
    addLine(stageEl.current.getStage(), layerEl.current, brushSize, "erase");
  };
  const addRectangle = () => {
    setIsDrawing(false);
    const rect = {
      x: getRandomInt(100),
      y: getRandomInt(100),
      width: 100,
      height: 100,
      fill: "red",
      id: `rect${rectangles.length + 1}`,
    };
    const rects = rectangles.concat([rect]);
    setRectangles(rects);
    const shs = shapes.concat([`rect${rectangles.length + 1}`]);
    setShapes(shs);

  };

  const addCircle = () => {
    const circ = {
      x: getRandomInt(100),
      y: getRandomInt(100),
      width: 100,
      height: 100,
      fill: "red",
      id: `circ${circles.length + 1}`,
    };
    const circs = circles.concat([circ]);
    setCircles(circs);
    const shs = shapes.concat([`circ${circles.length + 1}`]);
    setShapes(shs);
  };

  const drawText = () => {
    const id = addTextNode(stageEl.current.getStage(), layerEl.current);
    const shs = shapes.concat([id]);
    setShapes(shs);
  };

  const forceUpdate = React.useCallback(() => updateState({}), []);
  
  const undo = () => {
    const lastId = shapes[shapes.length - 1];
    let index = circles.findIndex(c => c.id == lastId);
    if (index != -1) {
      circles.splice(index, 1);
      setCircles(circles);
    }
    index = rectangles.findIndex(r => r.id == lastId);
    if (index != -1) {
      rectangles.splice(index, 1);
      setRectangles(rectangles);
    }
    index = images.findIndex(r => r.id == lastId);
    if (index != -1) {
      images.splice(index, 1);
      setImages(images);
    }
    shapes.pop();
    setShapes(shapes);
    forceUpdate();
  };

  document.addEventListener("keydown", ev => {
    if (ev.code == "Delete") {
      let index = circles.findIndex(c => c.id == selectedId);
      if (index != -1) {
        circles.splice(index, 1);
        setCircles(circles);
      }
      index = rectangles.findIndex(r => r.id == selectedId);
      if (index != -1) {
        rectangles.splice(index, 1);
        setRectangles(rectangles);
      }
      index = images.findIndex(r => r.id == selectedId);
      if (index != -1) {
        images.splice(index, 1);
        setImages(images);
      }
      forceUpdate();
    }
  });

  React.useEffect(() => {
    if (transcript === "kitten") {
      const newImages = loadImages.concat({image: 'https://www.onlinekittencare.com/wp-content/uploads/2020/07/vChK6pTy3vN3KbYZ7UU7k3-1200-80.jpg'})
      setLoadImages(newImages);
    }
  }, [transcript]);

  return (
<div className="home-page">

{loadImages.map(image => (
  <img id="img" className="img"
  src={image.image}
  width="200"
  height="200"
  onDragStart={(e) => {
    dragUrl.current = e.target.src;}}
/>
))}
    
    <div
        onDrop={(e) => {
          e.preventDefault();
          // register event position
          stageEl.current.setPointersPositions(e);
          // add image
          setImages(
            images.concat([
              {
                ...stageEl.current.getPointerPosition(),
                src: dragUrl.current,
              },
            ])
          );
        }}
        onDragOver={(e) => 
          e.preventDefault()
        }
      >
    
      <h1>Whiteboard</h1>

        <button onClick={addRectangle}>
          Rectangle
        </button>
        <button onClick={addCircle}>
          Circle
        </button>
        <button onClick={drawLine}>
          Line
        </button>
        <button onClick={eraseLine}>
          Erase
        </button>
        <select
        value={brushSize}
        onChange={(e) => {
          setBrushSize(e.target.value);
          drawLine();
        }}
      >
        <option value="5">5</option>
        <option value="20">20</option>
        <option value="50">50</option>
      </select>
        <button onClick={drawText}>
          Text
        </button>
        <button variant="secondary">
          Image
        </button>
        <button variant="secondary" onClick={undo}>
          Undo
        </button>
       <p id="transcript">Transcript: {transcript}</p>
       <button onClick={SpeechRecognition.startListening}>Start</button>
      <Stage
        width={window.innerWidth * 0.9}
        height={window.innerHeight - 150}
        ref={stageEl}
        dragabble
        onMouseDown={e => {
          // deselect when clicked on empty area
          const clickedOnEmpty = e.target === e.target.getStage();
          if (clickedOnEmpty) {
            selectShape(null);
          }
        }}
      >
        <Layer ref={layerEl}>
        {rectangles.map((rect, i) => {
            return (
              <Rectangle
                key={i}
                shapeProps={rect}
                isSelected={rect.id === selectedId}
                onSelect={() => {
                  selectShape(rect.id);
                }}
                onChange={newAttrs => {
                  const rects = rectangles.slice();
                  rects[i] = newAttrs;
                  setRectangles(rects);
                }}
              />
            );
          })}
         {circles.map((circle, i) => {
            return (
              <Circle
                key={i}
                shapeProps={circle}
                isSelected={circle.id === selectedId}
                onSelect={() => {
                  selectShape(circle.id);
                }}
                onChange={newAttrs => {
                  const circs = circles.slice();
                  circs[i] = newAttrs;
                  setCircles(circs);
                }}
              />
            );
          })}
         {images.map((image) => {
              return <URLImage image={image}/>;
            })}

        </Layer>
      </Stage>
      </div>
    </div>
  );
}
export default App;