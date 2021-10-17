import { Card, Box } from "@chakra-ui/react";
import { charts } from "./charts";
import { Line } from "react-chartjs-2";

const ChartsComponent = () => {
  return (
    <>
      {charts.map(({ data, options }) => (
        <Box bg="red.400" height={200}>
          <Line data={data} options={options} height={70} />
        </Box>
      ))}
    </>
  );
};

export default ChartsComponent;
