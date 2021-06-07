import React from "react";
import { Rect, Transformer } from "react-konva";
const Rectangle = ({ shapeProps, isSelected, onSelect, onChange }) => {
  const shapeRef = React.useRef();
  const trRef = React.useRef();
  React.useEffect(() => {
    if (isSelected) {
      trRef.current.setNode(shapeRef.current);
      trRef.current.getLayer().batchDraw();
      
    }
  }, [isSelected]);
  return (
    <React.Fragment>
      <Rect
        onClick={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onDragEnd={e => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onDblClick={e => {
          e.target.remove();
        }}
       
      />
        {isSelected && <Transformer ref={trRef} />}
    </React.Fragment>
  );
};
export default Rectangle;