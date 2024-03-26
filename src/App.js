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
    [0, 0],
  ]);
  const [rooms, setRooms] = useState([]);
  const [newBox, setNewBox] = useState({
    topLeft: [-1, -1],
    width: -1,
    height: -1,
  });
  const [newRoomName, setNewRoomName] = useState("");
  const [building, setBuilding] = useState({ height: 0, width: 0, image: "" });

  const handleClick = () => {
    const newRooms = [...rooms];
    const newRoom = { ...newBox };
    newRoom.name = newRoomName;
    newRooms.push(newRoom);
    setRooms(newRooms);
    setNewBox({
      topLeft: [-1, -1],
      width: -1,
      height: -1,
    });
    setNewRoomName("");
  };

  const handleChange = (e, setter) => {
    setter(e.target.value);
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    const image = new Image();
    image.onload = function () {
      console.log(this.width, this.height);
      const newBuilding = { ...building };
      const imageWidth = window.innerWidth - 200;
      newBuilding.height = (this.height * imageWidth) / this.width;
      newBuilding.width = imageWidth;

      const reader = new FileReader();
      reader.onloadend = () => {
        newBuilding.image = reader.result;
      };
      reader.readAsDataURL(file);
      setBuilding(newBuilding);
    };
    image.src = URL.createObjectURL(file);
  };

  const roomDivs = rooms.map((room, index) => (
    <div
      key={index}
      className="room"
      style={Object.assign({
        zIndex: 10,
        left: room.topLeft[0] + "%",
        top: room.topLeft[1] + "%",
        height: room.height + "%",
        width: room.width + "%",
        userSelect: "none",
      })}
    >
      {room.name}
    </div>
  ));

  const boxInProg = () => {
    if (newBox.height > 0) {
      return (
        <div
          className="room"
          style={Object.assign({
            zIndex: 10,
            left: newBox.topLeft[0] + "%",
            top: newBox.topLeft[1] + "%",
            height: newBox.height + "%",
            width: newBox.width + "%",
            userSelect: "none",
          })}
        >
          {newRoomName}
        </div>
      );
    }
  };

  const img = {
    height: building.height,
    width: building.width,
    url: "https://media.licdn.com/dms/image/C5603AQHdnuerzA9i5A/profile-displayphoto-shrink_400_400/0/1635394928434?e=1717027200&v=beta&t=Aw4YRksXsmLtC3B1NQ77Ky2EnWPm2b3Mi03l3yF0cfQ",
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>To test the image select idea</p>
        <input type="file" onChange={(e) => handleFile(e)}></input>
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
          <div
            className="container"
            style={{
              height: building.height,
              width: building.width,
              backgroundImage: `url(${building.image})`,
            }}
          >
            {/* <img src="https://media.licdn.com/dms/image/C5603AQHdnuerzA9i5A/profile-displayphoto-shrink_400_400/0/1635394928434?e=1717027200&v=beta&t=Aw4YRksXsmLtC3B1NQ77Ky2EnWPm2b3Mi03l3yF0cfQ" /> */}
            {roomDivs}
            {boxInProg()}
          </div>
        </RectangleSelectTouch>
        <label>Room Name: </label>
        <input
          value={newRoomName}
          onChange={(e) => handleChange(e, setNewRoomName)}
        ></input>
        <button onClick={handleClick}>ok</button>
      </header>
    </div>
  );
}

export default App;
