import React from 'react'
import Photo from "../../Components/Photo/Photo";
import Header from "../../Components/Header/Header";
import Description from '../../Components/Description/Description';
import Gator from "../../Components/Photo/gator.jpg"
import "./Error.css"

export default function Error() {
  return (
    <div id="error-div">
      <Header message={"Error..."} />
      <Photo id="error-pic" source={Gator} alt="error-gator" />
      <Description message={"Oh, no! The page you're looking for does not exist."} />

    </div>
  );
}