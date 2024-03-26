import React from "react";
import { useState } from "react";
import "./RectangleSelect.css";

const ReactRectangleSelection = (props) => {
  const [hold, setHold] = useState(false);
  const [selectionBox, setSelectionBox] = useState(false);
  const [selectionBoxOrigin, setSelectionBoxOrigin] = useState([0, 0]);
  const [selectionBoxTarget, setSelectionBoxTarget] = useState([0, 0]);
  const [selectionBoxLimit, setSelectionBoxLimit] = useState([
    [0, 0],
    [0, 0],
  ]);
  const [animation, setAnimation] = useState("");

  let animationInProgress = null;

  const handleTransformBox = () => {
    if (
      selectionBoxOrigin[1] > selectionBoxTarget[1] &&
      selectionBoxOrigin[0] > selectionBoxTarget[0]
    )
      return "scaleY(-1) scaleX(-1)";

    if (selectionBoxOrigin[1] > selectionBoxTarget[1]) return "scaleY(-1)";
    if (selectionBoxOrigin[0] > selectionBoxTarget[0]) return "scaleX(-1)";
    return null;
  };

  const closeSelectionBox = () => {
    document.body.style.overflow = "";
    setHold(false);
    setAnimation("react-rectangle-selection--fadeout");
    animationInProgress = setTimeout(() => {
      setAnimation("");
      setSelectionBox(false);
      animationInProgress = null;
    }, 300);
  };

  const handleTouchDown = (e) => {
    if (props.disabled) return;
    let doubleClick = false;
    clearTimeout(animationInProgress);
    animationInProgress = null;
    setSelectionBox(false);
    setAnimation("");

    if (animation.length > 0 && e.target.id === "react-rectangle-selection") {
      setSelectionBox(false);
      setAnimation("");
      doubleClick = true;
    }

    const target = e.touches[0].target;

    setHold(true);
    setSelectionBoxOrigin([
      Math.round(e.touches[0].pageX),
      Math.round(e.touches[0].pageY),
    ]);
    setSelectionBoxTarget([
      Math.round(e.touches[0].pageX),
      Math.round(e.touches[0].pageY),
    ]);
    setSelectionBoxLimit([
      [target.offsetLeft, target.offsetTop],
      [
        target.offsetLeft + target.offsetWidth,
        target.offsetTop + target.offsetHeight,
      ],
    ]);
  };

  const handleMouseDown = (e) => {
    if (props.disabled) return;
    let doubleClick = false;
    clearTimeout(animationInProgress);
    animationInProgress = null;
    setSelectionBox(false);
    setAnimation("");

    if (animation.length > 0 && e.target.id === "react-rectangle-selection") {
      setSelectionBox(false);
      setAnimation("");
      doubleClick = true;
    }

    const target = e.nativeEvent.target;

    setHold(true);
    setSelectionBoxOrigin([
      Math.round(e.nativeEvent.pageX),
      Math.round(e.nativeEvent.pageY),
    ]);
    setSelectionBoxTarget([
      Math.round(e.nativeEvent.pageX),
      Math.round(e.nativeEvent.pageY),
    ]);
    setSelectionBoxLimit([
      [target.offsetLeft, target.offsetTop],
      [
        target.offsetLeft + target.offsetWidth,
        target.offsetTop + target.offsetHeight,
      ],
    ]);
  };

  const calculateRoomDivParams = () => {
    const topLeft = [
      Math.min(selectionBoxOrigin[0], selectionBoxTarget[0]) -
        selectionBoxLimit[0][0],
      Math.min(selectionBoxOrigin[1], selectionBoxTarget[1]) -
        selectionBoxLimit[0][1],
    ];
    const absWidth = Math.abs(selectionBoxOrigin[0] - selectionBoxTarget[0]);
    const absHeight = Math.abs(selectionBoxOrigin[1] - selectionBoxTarget[1]);
    return { topLeft: topLeft, width: absWidth - 1, height: absHeight - 1 };
  };

  const baseStyle = {
    zIndex: 10,
    left: selectionBoxOrigin[0],
    top: selectionBoxOrigin[1],
    height: Math.abs(selectionBoxTarget[1] - selectionBoxOrigin[1] - 1),
    width: Math.abs(selectionBoxTarget[0] - selectionBoxOrigin[0] - 1),
    userSelect: "none",
    transformOrigin: "top left",
    transform: handleTransformBox(),
  };

  return (
    <div
      style={{ height: "inherit", width: "inherit" }}
      onTouchStart={(e) => handleTouchDown(e)}
      onTouchEnd={() => {
        closeSelectionBox();
      }}
      onMouseLeave={() => {
        closeSelectionBox();
      }}
      onMouseDown={(e) => handleMouseDown(e)}
      onMouseUp={() => closeSelectionBox()}
      // for desktop screens
      onMouseMove={(evt) => {
        if (hold && !selectionBox) {
          if (props.onTouchStart) props.onTouchStart();
          setSelectionBox(true);
        }
        if (selectionBox && !animationInProgress) {
          setSelectionBoxTarget([evt.nativeEvent.pageX, evt.nativeEvent.pageY]);

          const { topLeft, width, height } = calculateRoomDivParams();

          props.onSelect(evt, {
            origin: selectionBoxOrigin,
            target: selectionBoxTarget,
            limit: selectionBoxLimit,
            topLeft: topLeft,
            width: width,
            height: height,
          });
        }
      }}
      // for touchscreen
      onTouchMove={(evt) => {
        document.body.style.overflow = "hidden";
        if (hold && !selectionBox) {
          if (props.onTouchStart) props.onTouchStart();
          setSelectionBox(true);
        }
        if (selectionBox && !animationInProgress) {
          const touchLeave =
            evt.touches[0].pageX < selectionBoxLimit[0][0] ||
            evt.touches[0].pageX > selectionBoxLimit[1][0] ||
            evt.touches[0].pageY < selectionBoxLimit[0][1] ||
            evt.touches[0].pageY > selectionBoxLimit[1][1];

          if (touchLeave) {
            closeSelectionBox();
          }
          setSelectionBoxTarget([
            Math.round(evt.touches[0].pageX),
            Math.round(evt.touches[0].pageY),
          ]);

          const { topLeft, width, height } = calculateRoomDivParams();

          props.onSelect(evt, {
            origin: selectionBoxOrigin,
            target: selectionBoxTarget,
            limit: selectionBoxLimit,
            topLeft: topLeft,
            width: width,
            height: height,
          });
        }
      }}
    >
      {selectionBox && (
        <div
          className={`react-rectangle-selection ${animation}`}
          id={"react-rectangle-selection"}
          style={Object.assign(baseStyle, props.style)}
        />
      )}
      {props.children}
    </div>
  );
};

export default ReactRectangleSelection;
