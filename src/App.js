import RectangleSelectTouch from "./components/RectangleSelectTouch.js";

import { useState, useEffect } from "react";

import logo from "./logo.svg";
import "./App.css";

function App() {
  const [origin, setOrigin] = useState([0, 0]);
  const [target, setTarget] = useState([0, 0]);
  const [limit, setLimit] = useState([
    [0, 0],
    [0, 0],
  ]);
  const [boxes, setBoxes] = useState([]);
  const [newBox, setNewBox] = useState({
    topLeft: [-1, -1],
    width: -1,
    height: -1,
  });

  const handleClick = () => {
    const newBoxes = [...boxes];
    newBoxes.push(newBox);
    setBoxes(newBoxes);
    setNewBox({
      topLeft: [-1, -1],
      width: -1,
      height: -1,
    });
  };

  const rooms = boxes.map((room, index) => (
    <div
      key={index}
      className="room"
      style={Object.assign({
        zIndex: 10,
        left: room.topLeft[0],
        top: room.topLeft[1],
        height: room.height,
        width: room.width,
        userSelect: "none",
      })}
    ></div>
  ));

  const boxInProg = () => {
    if (newBox.height > 0) {
      return (
        <div
          className="room"
          style={Object.assign({
            zIndex: 10,
            left: newBox.topLeft[0],
            top: newBox.topLeft[1],
            height: newBox.height,
            width: newBox.width,
            userSelect: "none",
          })}
        ></div>
      );
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>To test the image select idea</p>
        <span>{origin + " , " + target + " , " + limit}</span>
        <span>{[newBox.topLeft, newBox.width, newBox.height]}</span>
        <RectangleSelectTouch
          onSelect={(e, coords) => {
            setOrigin(coords.origin);
            setTarget(coords.target);
            setLimit(coords.limit);
            setNewBox({
              topLeft: coords.topLeft,
              width: coords.width,
              height: coords.height,
            });
          }}
          style={{ backgroundColor: "grey", borderColor: "black" }}
        >
          <div className="test-div">
            {rooms}
            {boxInProg()}
          </div>
        </RectangleSelectTouch>
        <button onClick={handleClick}>ok</button>
      </header>
    </div>
  );
}

export default App;
