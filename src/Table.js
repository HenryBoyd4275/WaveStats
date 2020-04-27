import { Button, DataTable, Text, Box } from "grommet";
import React from "react";

export default function Table(props) {
  return (
    <Box
      flex={"grow"}
      hidden={true}
      align={"start"}
      background={"background-front"}
      round={"medium"}
      margin={"medium"}
      border={{ style: "solid", size: "large", color: "border" }}
    >
      <DataTable
        columns={[
          {
            property: "depth",
            header: <Text>Depth</Text>,
          },
          {
            property: "shoalingWaveAngle (degrees)",
            header: "Angle (\u00B0)",
          },
          {
            property: "shoalingWaveLength(m)",
            header: "Shoaling Wave Length (m)",
          },
          {
            property: "shoalingWaveHeight(m)",
            header: "Shoaling Wave Height (m)",
          },
          {
            property: "orbitalAmplitude(m)",
            header: "Orbital Amplitude (m)",
          },
          {
            property: "orbitalVelocity(m/s)",
            header: "Orbital Velocity (m/s)",
          },
          {
            property: "diameter (mm)",
            header: "Diameter (mm)",
          },
        ]}
        data={props.data}
      />
      <Button
        margin={"small"}
        color={"text"}
        label="Download"
        onClick={props.onClick}
      />
    </Box>
  );
}
