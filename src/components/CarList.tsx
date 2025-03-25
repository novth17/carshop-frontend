import React, { useState, useEffect } from "react";

export default function Carlist() {
  const [cars, setCars] = useState([]);

  useEffect(() => fetchData(), []);

  const fetchData = () => {
    fetch("https://car-rest-service-carshop.2.rahtiapp.fi/cars")
      .then((response) => response.json())
      .then((data) => setCars(data._embedded.cars));
  };
  return (
    <div>
      <h1>Carlist</h1>
    </div>
  );
}
