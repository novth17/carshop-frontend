import { useState } from "react";
import React from "react";
import "./App.css";
import Carlist from "./components/Carlist";

function App() {
  return (
    <>
      <div className='"App"'>
        <h1>Hello Hien's car factory</h1>
        <Carlist />
      </div>
    </>
  );
}

export default App;
