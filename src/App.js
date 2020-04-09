import React from 'react';
import { Grommet, Form, FormField, Button, } from 'grommet';

function App() {
    let counter = 0;

    let results = {};

    function submit(inputValues) {
        inputValues = {
            ...inputValues,
            angle: inputValues.angle / 57.2958
        }

        let deepWaterWaveLength = (9.806 * inputValues.period * inputValues.period) / 6.2832;
        let shoalingWaveLength = deepWaterWaveLength;
        let depth = Math.trunc(((9.806 * inputValues.period * inputValues.period) / 6.2832) / 2);
        calculate(inputValues, shoalingWaveLength, depth, deepWaterWaveLength);
    }

    function calculate(inputValues, shoalingWaveLength, depth, deepWaterWaveLength) {
        counter += 1;
        console.log("inputs", inputValues);
       
        const waveNumber = 6.2832 * shoalingWaveLength;
        const waveVelocityRatio = (1 + ((2 * waveNumber * depth) / Math.sinh(2 * waveNumber * depth))) / 2
        shoalingWaveLength = (shoalingWaveLength * Math.tanh(6.2832 * depth / shoalingWaveLength));
        const shoalingWaveAngle = Math.asin((shoalingWaveLength / depth) * Math.sin(inputValues.angle));
        const refractionCoefficient = Math.sqrt(Math.cos(inputValues.angle) / Math.cos(shoalingWaveAngle));
        inputValues.angle = shoalingWaveAngle;
        const shoalingWaveHeight = inputValues.height * (Math.sqrt(deepWaterWaveLength / (shoalingWaveLength * 2 * waveVelocityRatio))) * refractionCoefficient;
        const orbitalAmplitude = shoalingWaveHeight / (Math.sinh(6.2832 * depth / shoalingWaveLength));//off by a decimal place
        const orbitalVelocity = 3.14159 * orbitalAmplitude / inputValues.period;
        let diameter = ((orbitalVelocity * orbitalVelocity) / (3.3957 * Math.sqrt(orbitalAmplitude))) * ((orbitalVelocity * orbitalVelocity) / (3.3957 * Math.sqrt(orbitalAmplitude)))
        if (diameter > 0.0005) {
            diameter = Math.pow((orbitalVelocity * orbitalVelocity) / (23.3678 * Math.pow(orbitalAmplitude, 0.25)), 1.3333)
        }
        diameter = diameter * 1000;
        const waveReynoldsNumber = (orbitalAmplitude * orbitalVelocity) * (Math.pow(10, 6))

        results = {
            ...results,
            [counter]: {
                depth,
                shoalingWaveAngle,
                shoalingWaveLength,
                shoalingWaveHeight,
                orbitalAmplitude,
                orbitalVelocity,
                waveReynoldsNumber,
                diameter
            }
        }

        depth = depth - inputValues.increment;

        console.log("results", results);

        if (inputValues.height < depth) {
            console.log("here");
            calculate(inputValues, shoalingWaveLength, depth, deepWaterWaveLength)
        }
    }

    return (

        <Grommet plain>
            <header className="App-header">
                Wave Calculator
            </header>
            <Form onSubmit={(submits) => submit(submits.value)}>
                <FormField name="height" required={true} label="Deep Water Wave Height in Meters" />
                <FormField name="period" required={true} label="Wave Period in Seconds" />
                <FormField name="angle" required={true} label="Deep Water Incident Wave Angle in Degrees" />
                <FormField name="increment" required={true} label="Desired Depth Increments in metres" />
                <Button type="submit" primary label="Submit" />
            </Form>
        </Grommet>
    );
}

export default App;

/*<DataTable
    columns={[
        {
            property: 'name',
            header: <Text>Output</Text>,
            primary: true,
        },
        {
            property: 'percent',
            header: 'Value',
        },
    ]}
    data={outputs}
/>*/