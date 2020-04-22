import React, { useState } from 'react';
import { Grommet, Form, FormField, Button, DataTable, Text, Box, RadioButtonGroup } from 'grommet';

const myTheme = require('./myTheme.json');

function App() {
    let counter = 0;
    const [outputs, setOutputs] = useState([0]);
    const [landOrWater, setLandOrWater] = useState('Land');
    const [waveValue, setWaveValue] = useState();

    let results = {};

    function getWindPow() {
        if (landOrWater === "Land") {
            return 0.14;
        } else if (landOrWater === "Water") {
            return 0.1;
        } else {
            console.log("null");
            return null;
        }
    }

    function windSubmit(inputValues) {
        console.log("you submitted:", inputValues);

        const windSpeedAtTenMetres = (inputValues.windSpeed / 3.6 ) * Math.pow(10 / inputValues.heightOfWindMeasure, getWindPow()); //also convers to metres per second
        const height = '' + Math.round( 0.01616 * windSpeedAtTenMetres * Math.pow(inputValues.fetch, 0.5) * 100) / 100;
        const period = '' + Math.round( 0.6238 * Math.pow(windSpeedAtTenMetres * inputValues.fetch, 0.33) * 100) / 100;

        console.log("windAtTen:", windSpeedAtTenMetres, "height:", height, "period:", period);
        setWaveValue({ ...waveValue, height, period });
        console.log("formState", waveValue);
    }

    function waveSubmit(inputValues) {
        inputValues = {
            ...inputValues,
            angle: inputValues.angle / 57.2958
        }

        let deepWaterWaveLength = (9.806 * (inputValues.period * inputValues.period)) / 6.2832;
        let shoalingWaveLength = deepWaterWaveLength;
        let depth = Math.trunc(deepWaterWaveLength / 2);
        calculate(inputValues, shoalingWaveLength, depth, deepWaterWaveLength);
        counter = 0;
        setOutputs(Object.values(results));
    }

    function calculate(inputValues, shoalingWaveLength, depth, deepWaterWaveLength) {
        counter += 1;
       
        const waveNumber = 6.2832 / shoalingWaveLength;
        const waveVelocityRatio = (1 + ((2 * waveNumber * depth) / Math.sinh(2 * waveNumber * depth))) / 2
        shoalingWaveLength = deepWaterWaveLength * Math.tanh(6.2832 * depth / shoalingWaveLength);
        const shoalingWaveAngle = Math.asin((shoalingWaveLength / deepWaterWaveLength) * Math.sin(inputValues.angle));
        const refractionCoefficient = Math.sqrt(Math.cos(inputValues.angle) / Math.cos(shoalingWaveAngle));
        inputValues.angle = shoalingWaveAngle;
        const shoalingWaveHeight = inputValues.height * (Math.sqrt(deepWaterWaveLength / (shoalingWaveLength * 2 * waveVelocityRatio))) * refractionCoefficient;
        const orbitalAmplitude = shoalingWaveHeight / (Math.sinh(6.2832 * depth / shoalingWaveLength));
        const orbitalVelocity = 3.14159 * orbitalAmplitude / inputValues.period;
        let diameter = ((orbitalVelocity * orbitalVelocity) / (3.3957 * Math.sqrt(orbitalAmplitude))) * ((orbitalVelocity * orbitalVelocity) / (3.3957 * Math.sqrt(orbitalAmplitude)))
        if (diameter > 0.0005) {
            diameter = Math.pow((orbitalVelocity * orbitalVelocity) / (23.3678 * Math.pow(orbitalAmplitude, 0.25)), 1.3333)
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
                diameter: Math.round(diameter * 100) / 100
            }
        }

        depth = depth - inputValues.increment;

        if (inputValues.height < depth) {
            calculate(inputValues, shoalingWaveLength, depth, deepWaterWaveLength)
        }
    }

    function parseJSONToCSVStr(jsonData) {
        if (jsonData.length === 0) {
            return '';
        }

        let keys = Object.keys(jsonData[0]);

        let columnDelimiter = ',';
        let lineDelimiter = '\n';

        let csvColumnHeader = keys.join(columnDelimiter);
        let csvStr = csvColumnHeader + lineDelimiter;

        jsonData.forEach(item => {
            keys.forEach((key, index) => {
                if ((index > 0) && (index < keys.length)) {
                    csvStr += columnDelimiter;
                }
                csvStr += item[key];
            });
            csvStr += lineDelimiter;
        });

        return encodeURIComponent(csvStr);;
    }

    function downloadClicked() {
        let csvStr = parseJSONToCSVStr(outputs);
        let dataUri = 'data:text/csv;charset=utf-8,' + csvStr;

        let exportFileDefaultName = 'data.csv';

        let linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    return (

        <Grommet theme={myTheme} full>
            <Box fill>
                <header className="App-header" align={"center"}>
                    <h1>Wave Calculator</h1>
                </header>

                <Box flex={'grow'} direction="row">
                    <Box fill={false} flex={"grow"} align={"start"} background={"background-front"} round={"medium"} margin={"medium"} border={{ style: 'solid', size: 'large', color: 'border' }}>
                        <Form onSubmit={(submits) => windSubmit(submits.value)}>
                            <FormField name="windSpeed" required={true} validate={(fieldData) => { if (isNaN(fieldData) || fieldData < 0) { return "Entry must be a positive number" } }} label="Wind Speed in Kilometres Per Hour" />
                            <FormField name="fetch" required={true} validate={(fieldData) => { if (isNaN(fieldData) || fieldData < 0) { return "Entry must be a positive number" } }} label="Fetch in Kilometres" />
                            <FormField name="heightOfWindMeasure" required={false} validate={(fieldData) => { if (isNaN(fieldData) || fieldData < 0) { return "Entry must be a positive number" } }} label="Height of Wind Speed Measurement in Metres" />
                            <Text margin={"small"} > Wind Speed was Measured Over:</Text>
                            <RadioButtonGroup
                                name="land or water"
                                margin={'small'}
                                options={['Land', 'Water']}
                                value={landOrWater}
                                onChange={(event) => setLandOrWater(event.target.value)}
                            />
                            <Button margin={"small"} plain={false} color={"text"} type="submit" label="Submit" />
                        </Form>
                    </Box>
                    <Box fill={false} flex={"grow"} align={"start"} background={"background-front"} round={"medium"} margin={"medium"} border={{ style: 'solid', size: 'large', color: 'border' }}>
                        <Form value={waveValue} onChange={nextValue => setWaveValue(nextValue)} onSubmit={({ value }) => waveSubmit(value)}> 
                            <FormField name="height" required={true} validate={(fieldData) => { if (isNaN(fieldData) || fieldData < 0) { return "Entry must be a positive number" }}} label="Deep Water Wave Height in Meters" />
                            <FormField name="period" required={true} validate={(fieldData) => { if (isNaN(fieldData) || fieldData < 0) { return "Entry must be a positive number" }}} label="Wave Period in Seconds" />
                            <FormField name="angle" required={false} validate={(fieldData) => { if (isNaN(fieldData) || fieldData < 0) { return "Entry must be a positive number" }}} label="Deep Water Incident Wave Angle in Degrees" />
                            <FormField name="increment" required={true} validate={(fieldData) => { if (isNaN(fieldData) || fieldData < 0) { return "Entry must be a positive number" }}} label="Desired Depth Increments in metres" />
                            <Button margin={"small"} plain={false} color={"text"} type="submit" label="Submit" />
                        </Form>
                    </Box>
                </Box>
                
                <Box flex={"grow"} hidden={true} align={"start"} background={"background-front"} round={"medium"} margin={"medium"} border={{ style: 'solid', size: 'large', color: 'border' }}>
                    <DataTable
                        columns={[
                            {
                                property: 'depth',
                                header: <Text>Depth</Text>,
                            },
                            {
                                property: 'shoalingWaveAngle',
                                header: 'Angle',
                            },
                            {
                                property: 'shoalingWaveLength',
                                header: 'Shoaling Wave Length',
                            },
                            {
                                property: 'shoalingWaveHeight',
                                header: 'Shoaling Wave Height',
                            },
                            {
                                property: 'orbitalAmplitude',
                                header: 'Orbital Amplitude',
                            },
                            {
                                property: 'orbitalVelocity',
                                header: 'Orbital Velocity',
                            },
                            {
                                property: 'diameter',
                                header: 'Diameter',
                            },
                        ]}
                        data={outputs}
                    />
                    <Button margin={"small"} color={"text"} label="Download" onClick={downloadClicked}/>
                </Box>
             </Box>
        </Grommet>
    );
}

export default App;