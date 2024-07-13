import React from "react";
import "../styles.css";
import "./HomeComponent.css";
import useWindowDimensions from "../hooks/UseWindowDimensions";

function Home() {
    const { height, width } = useWindowDimensions();
    console.log("width", height, width);
    let src = width < 600 ? "https://koraput.s3.ap-southeast-1.amazonaws.com/Koraput_portrait.mp4":  "https://koraput.s3.ap-southeast-1.amazonaws.com/Koraput_video.mp4";
    return (
      <React.Fragment>
        <div id="myVideo">
            <video autoPlay loop muted id="myVideo">
              <source src={src} type="video/mp4"/>
              Your browser does not support the video tag.
            </video>
        </div>
      </React.Fragment>
    );
}

export default Home;
