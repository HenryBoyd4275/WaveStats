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
            property: "shoalingWaveAngle",
            header: "Angle",
          },
          {
            property: "shoalingWaveLength",
            header: "Shoaling Wave Length",
          },
          {
            property: "shoalingWaveHeight",
            header: "Shoaling Wave Height",
          },
          {
            property: "orbitalAmplitude",
            header: "Orbital Amplitude",
          },
          {
            property: "orbitalVelocity",
            header: "Orbital Velocity",
          },
          {
            property: "diameter",
            header: "Diameter",
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
