import { Form, FormField, Button, Box } from "grommet";
import React from "react";

export const WaveForm = (props) => {
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
      <Form validate="submit" onSubmit={({ value }) => props.onSubmit(value)}>
        <FormField
          name="height"
          required={true}
          validate={(fieldData) => {
            if (isNaN(fieldData) || fieldData < 0) {
              return "Entry must be a positive number";
            }
          }}
          label="Deep Water Wave Height in Meters"
        />
        <FormField
          name="period"
          required={true}
          validate={(fieldData) => {
            if (isNaN(fieldData) || fieldData < 0) {
              return "Entry must be a positive number";
            }
          }}
          label="Wave Period in Seconds"
        />
        <FormField
          name="angle"
          label="Deep Water Incident Wave Angle in Degrees"
        />
        <FormField
          name="increment"
          required={true}
          validate={(fieldData) => {
            if (isNaN(fieldData) || fieldData < 0) {
              return "Entry must be a positive number";
            }
          }}
          label="Desired Depth Increments in metres"
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
  );
};
