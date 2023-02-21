import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [inputCity, setInputCity] = useState("");
  return (
    <>
      <Sidebar setInputCity={setInputCity} />
      <Display />
    </>
  );
}

const currentCity = {
  name: "Montevideo",
  condition: "Cloudy",
  temp: "22°C",
  humidity: "74%",
  windSpeed: "24 km/h",
  time: "23:00",
};

function Display() {
  const [time, setTime] = useState("NaN");
  const [temp, setTemp] = useState(0);
  const [windSpeed, setWindSpeed] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [cloudCover, setCloudCover] = useState(0);
  const [windDirection, setWindDirection] = useState(0);
  const [condition, setCondition] = useState("NaN");
  const [cardinalWindDir, setCardinalWindDir] = useState("NaN");

  const defineCondition = (cloudCoverage) => {
    let text = "";
    switch (true) {
      case cloudCoverage < 10:
        text = "Sunny";
        break;
      case cloudCoverage < 20:
        text = "Fair";
        break;
      case cloudCoverage < 30:
        text = "Mostly Sunny";
        break;
      case cloudCoverage < 60:
        text = "Partly Cloudy";
        break;
      case cloudCoverage < 90:
        text = "Mostly Cloudy";
        break;
      case cloudCoverage < 95:
        text = "Overcast";
        break;

      default:
        break;
    }
    setCondition(text);
  };

  const definecardinalWindDir = (degree) => {
    let text = "";

    if (degree <= 30 || degree > 330) {
      text = "N";
    } else if (degree > 30 && degree <= 70) {
      text = "NE";
    } else if (degree > 70 && degree <= 110) {
      text = "E";
    } else if (degree > 110 && degree <= 160) {
      text = "SE";
    } else if (degree > 160 && degree <= 200) {
      text = "S";
    } else if (degree > 200 && degree <= 240) {
      text = "SW";
    } else if (degree > 240 && degree <= 290) {
      text = "W";
    } else if (degree > 290 && degree <= 330) {
      text = "NW";
    }
    setCardinalWindDir(text);
  };

  useEffect(() => {
    const currentCity_weather = async () => {
      const response = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=-34.90&longitude=-56.19&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,rain,cloudcover,windspeed_10m,winddirection_10m&models=best_match&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset&current_weather=true&timezone=America%2FSao_Paulo"
      );
      const data = await response.json();
      const { current_weather, hourly } = data;
      const positionNow = hourly.time.indexOf(current_weather.time);
      setTime(current_weather.time.slice(-5));
      setTemp(current_weather.temperature);
      setWindSpeed(current_weather.windspeed);
      setHumidity(hourly.relativehumidity_2m[positionNow]);
      setCloudCover(hourly.cloudcover[positionNow]);
      setWindDirection(hourly.winddirection_10m[positionNow]);
      defineCondition(cloudCover);
      definecardinalWindDir(windDirection);
    };

    const interval = setInterval(currentCity_weather, 1000);
    return () => clearInterval(interval);
  }, [cloudCover]);

  return (
    <div className="display">
      <div className="primaryDisplay">
        <h1 className="displayTemp">{temp} C</h1>
        <h2 className="displayCity">{currentCity.name}</h2>
        <h3>{condition}</h3>
      </div>
      <div className="secondaryDisplay">
        <h3>{time} hrs</h3>
        <h3>{humidity} %</h3>
        <h3>
          {windSpeed} km/h {cardinalWindDir}
        </h3>
      </div>
    </div>
  );
}

function Sidebar(setInputCity) {
  function historyInfo() {}

  function handleClick() {
    const cityName = document.getElementsByClassName("inputCity");
  }
  return (
    <>
      <input type="search" className="inputCity" />
      <button onClick={handleClick()}>Search</button>
    </>
  );
}

export default App;
