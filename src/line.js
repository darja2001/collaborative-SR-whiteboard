import Konva from "konva";
import App from './App';

export const addLine = (stage, layer, brushSize, mode = "brush") => {
  let isDrawing = false;
  let lastLine;

    stage.on("mousedown touchstart", function(e) {
      isDrawing = true;
      let pos = stage.getPointerPosition();
      lastLine = new Konva.Line({
        stroke: mode == "brush" ? "green" : "white",
        strokeWidth: brushSize,
        globalCompositeOperation:
          mode === "brush" ? "source-over" : "destination-out",
        points: [pos.x, pos.y]
      });
      layer.add(lastLine);
    });
    stage.on("mouseup touchend", function() {
      isDrawing = false;
    });
    stage.on("mousemove touchmove", function() {
      if (!isDrawing) {
        return;
      }
    const pos = stage.getPointerPosition();
      let newPoints = lastLine.points().concat([pos.x, pos.y]);
      lastLine.points(newPoints);
      layer.batchDraw();
    });
  


};
