import {
  Box,
  Button,
  Container,
  DataList,
  Flex,
  Heading,
  Section,
  Separator,
  Slider,
} from "@radix-ui/themes";
import { useEffect, useState } from "react";
import scanSim from "../inc/sim";

export default function Sim() {
  // inputs
  const [scanTime, setScanTime] = useState([5]); // time per scan (s)
  const [workers, setWorkers] = useState([1]);
  const [customersCount, setCustomersCount] = useState([3]);
  const [averageCustomerRequestSize, setAverageCustomerRequestSize] = useState([
    5000,
  ]);

  const [simRuns, setSimRuns] = useState([1]);

  async function run() {
    const results = await scanSim(
      workers[0],
      customersCount[0],
      averageCustomerRequestSize[0],
      simRuns[0]
    );
    console.log(results);
  }

  return (
    <Box>
      <Container size="1" p="3">
        <Box pb="6">
          <Heading size={"2"} align={"left"}>
            Settings
          </Heading>
          <Separator
            style={{ width: "100%", marginTop: "1em", marginBottom: ".5em" }}
          />
          <Flex minWidth="300px" align={"center"} gap="4" pt="2">
            <Box
              width="120px"
              style={{
                fontSize: 10,
                lineHeight: 1.2,
                textAlign: "left",
                color: "#c8c8c8",
              }}
            >
              Avg Scan Time (s)
            </Box>
            <Slider
              min={0}
              max={50}
              value={scanTime}
              onValueChange={setScanTime}
              disabled
            ></Slider>
            {scanTime}
          </Flex>
          <Flex minWidth="300px" align={"center"} gap="4" pt="2">
            <Box
              width="120px"
              style={{ fontSize: 10, lineHeight: 1.2, textAlign: "left" }}
            >
              Workers
            </Box>
            <Slider
              min={0}
              max={50}
              value={workers}
              onValueChange={setWorkers}
            ></Slider>
            {workers}
          </Flex>
          <Flex minWidth="300px" align={"center"} gap="4" pt="2">
            <Box
              width="120px"
              style={{ fontSize: 10, lineHeight: 1.2, textAlign: "left" }}
            >
              Customers
            </Box>
            <Slider
              min={3}
              max={50}
              value={customersCount}
              onValueChange={setCustomersCount}
            ></Slider>
            {customersCount}
          </Flex>
          <Flex minWidth="300px" align={"center"} gap="4" pt="2">
            <Box
              width="120px"
              style={{ fontSize: 10, lineHeight: 1.2, textAlign: "left" }}
            >
              Avg Customer Request Size
            </Box>
            <Slider
              min={0}
              max={20000}
              value={averageCustomerRequestSize}
              onValueChange={setAverageCustomerRequestSize}
            ></Slider>
            {averageCustomerRequestSize}
          </Flex>
          <Separator
            style={{ width: "100%", marginTop: "1em", marginBottom: "1em" }}
          />
          <Flex minWidth="300px" align={"center"} gap="4" pt="2">
            <Box
              width="120px"
              style={{ fontSize: 10, lineHeight: 1.2, textAlign: "left" }}
            >
              # of Simulation Runs
            </Box>
            <Slider
              min={0}
              max={20000}
              value={simRuns}
              onValueChange={setSimRuns}
            ></Slider>
            {simRuns}
          </Flex>
        </Box>
        <Box>
          <Button onClick={run}>Run</Button>
        </Box>
      </Container>
    </Box>
  );
}
