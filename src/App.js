import React, { useState } from "react";
import { Grommet, Box} from "grommet";
import Table from "./Table.js";
import { WaveForm } from "./WaveForm.js";
import WindForm from "./WindForm.js";

const myTheme = require("./myTheme.json");

function App() {
  let counter = 0;
  const [outputs, setOutputs] = useState([0]);

  let results = {};

  function waveSubmit(inputValues) {
    inputValues = {
      ...inputValues,
      angle: inputValues.angle / 57.2958,
    };

    let deepWaterWaveLength =
      (9.806 * (inputValues.period * inputValues.period)) / 6.2832;
    let shoalingWaveLength = deepWaterWaveLength;
    let depth = Math.trunc(deepWaterWaveLength / 2);
    calculate(inputValues, shoalingWaveLength, depth, deepWaterWaveLength);
    counter = 0;
    setOutputs(Object.values(results));
  }

  function calculate(
    inputValues,
    shoalingWaveLength,
    depth,
    deepWaterWaveLength
  ) {
    counter += 1;

    const waveNumber = 6.2832 / shoalingWaveLength;
    const waveVelocityRatio =
      (1 + (2 * waveNumber * depth) / Math.sinh(2 * waveNumber * depth)) / 2;
    shoalingWaveLength =
      deepWaterWaveLength * Math.tanh((6.2832 * depth) / shoalingWaveLength);
    const shoalingWaveAngle = Math.asin(
      (shoalingWaveLength / deepWaterWaveLength) * Math.sin(inputValues.angle)
    );
    const refractionCoefficient = Math.sqrt(
      Math.cos(inputValues.angle) / Math.cos(shoalingWaveAngle)
    );
    inputValues.angle = shoalingWaveAngle;
    const shoalingWaveHeight =
      inputValues.height *
      Math.sqrt(
        deepWaterWaveLength / (shoalingWaveLength * 2 * waveVelocityRatio)
      ) *
      refractionCoefficient;
    const orbitalAmplitude =
      shoalingWaveHeight / Math.sinh((6.2832 * depth) / shoalingWaveLength);
    const orbitalVelocity = (3.14159 * orbitalAmplitude) / inputValues.period;
    let diameter =
      ((orbitalVelocity * orbitalVelocity) /
        (3.3957 * Math.sqrt(orbitalAmplitude))) *
      ((orbitalVelocity * orbitalVelocity) /
        (3.3957 * Math.sqrt(orbitalAmplitude)));
    if (diameter > 0.0005) {
      diameter = Math.pow(
        (orbitalVelocity * orbitalVelocity) /
          (23.3678 * Math.pow(orbitalAmplitude, 0.25)),
        1.3333
      );
    }
    diameter = diameter * 1000;

    results = {
      ...results,
      [counter]: {
        depth,
        shoalingWaveAngle: Math.round(shoalingWaveAngle * 57.2958 * 100) / 100,
        shoalingWaveLength: Math.round(shoalingWaveLength * 100) / 100,
        shoalingWaveHeight: Math.round(shoalingWaveHeight * 100) / 100,
        orbitalAmplitude: Math.round(orbitalAmplitude * 100) / 100,
        orbitalVelocity: Math.round(orbitalVelocity * 100) / 100,
        diameter: Math.round(diameter * 100) / 100,
      },
    };

    depth = depth - inputValues.increment;

    if (inputValues.height < depth) {
      calculate(inputValues, shoalingWaveLength, depth, deepWaterWaveLength);
    }
  }

  function parseJSONToCSVStr(jsonData) {
    if (jsonData.length === 0) {
      return "";
    }

    let keys = Object.keys(jsonData[0]);
    let columnDelimiter = ",";
    let lineDelimiter = "\n";
    let csvColumnHeader = keys.join(columnDelimiter);
    let csvStr = csvColumnHeader + lineDelimiter;

    jsonData.forEach((item) => {
      keys.forEach((key, index) => {
        if (index > 0 && index < keys.length) {
          csvStr += columnDelimiter;
        }
        csvStr += item[key];
      });
      csvStr += lineDelimiter;
    });

    return encodeURIComponent(csvStr);
  }

  function downloadClicked() {
    let csvStr = parseJSONToCSVStr(outputs);
    let dataUri = "data:text/csv;charset=utf-8," + csvStr;
    let exportFileDefaultName = "data.csv";
    let linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  }

  return (
    <Grommet theme={myTheme} full>
      <Box fill>
        <header className="App-header" align="center">
          <h1>Wave Calculator</h1>
        </header>
        <Box flex={"grow"} direction="row">
          <WindForm onSubmit={(value) => waveSubmit(value)} />
          <WaveForm onSubmit={(value) => waveSubmit(value)} />
        </Box>
        <Table onClick={() => downloadClicked()} data={outputs} />
      </Box>
    </Grommet>
  );
}

export default App;
