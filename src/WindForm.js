import React from "react";
import {
    Form,
    FormField,
    Button,
    Text,
    Box,
    RadioButtonGroup,
} from "grommet";

export default function WindForm(props) {

  const [landOrWater, setLandOrWater] = React.useState("Land");

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

    const windSpeedAtTenMetres =
      (inputValues.windSpeed / 3.6) *
      Math.pow(10 / inputValues.heightOfWindMeasure, getWindPow()); //also convers to metres per second
    const height =
      "" +
      Math.round(
        0.01616 * windSpeedAtTenMetres * Math.pow(inputValues.fetch, 0.5) * 100
      ) /
      100;
    const period =
      "" +
      Math.round(
        0.6238 * Math.pow(windSpeedAtTenMetres * inputValues.fetch, 0.33) * 100
      ) /
      100;

    //somehow send height and period over to WaveForm
  }

    return (
        <Box
            fill={false}
            flex={"grow"}
            align={"start"}
            background={"background-front"}
            round={"medium"}
            margin={"medium"}
            border={{ style: "solid", size: "large", color: "border" }}
        >
            <Form onSubmit={(submits) => windSubmit(submits.value)}>
                <FormField
                    name="windSpeed"
                    required={true}
                    validate={(fieldData) => {
                        if (isNaN(fieldData) || fieldData < 0) {
                            return "Entry must be a positive number";
                        }
                    }}
                    label="Wind Speed in Kilometres Per Hour"
                />
                <FormField
                    name="fetch"
                    required={true}
                    validate={(fieldData) => {
                        if (isNaN(fieldData) || fieldData < 0) {
                            return "Entry must be a positive number";
                        }
                    }}
                    label="Fetch in Kilometres"
                />
                <FormField
                    name="heightOfWindMeasure"
                    required={false}
                    validate={(fieldData) => {
                        if (isNaN(fieldData) || fieldData < 0) {
                            return "Entry must be a positive number";
                        }
                    }}
                    label="Height of Wind Speed Measurement in Metres"
                />
                <Text margin={"small"}> Wind Speed was Measured Over:</Text>
                <RadioButtonGroup
                    direction="row"
                    name="land or water"
                    margin={"small"}
                    options={["Land", "Water"]}
                    value={landOrWater}
                    onChange={(event) => setLandOrWater(event.target.value)}
                />
                <Button
                    margin={"small"}
                    plain={false}
                    color={"text"}
                    type="submit"
                    label="Submit"
                />
            </Form>
        </Box>
        )
}