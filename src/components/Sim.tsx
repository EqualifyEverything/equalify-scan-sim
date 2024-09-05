import {
  Box,
  Button,
  Card,
  Container,
 
  Flex,
  Grid,
  Heading,
  Separator,
  Slider,
  Text,
} from "@radix-ui/themes";
import { useState } from "react";
import scanSim, { ResultsRecord } from "../inc/sim";
import { formatDuration, intervalToDuration } from "date-fns";
import { SparklinesLine, Tooltip } from "@lueton/react-sparklines";

export default function Sim() {
  // inputs
  const [scanTime, setScanTime] = useState([5]); // time per scan (s)
  const [workers, setWorkers] = useState([1]);
  const [customersCount, setCustomersCount] = useState([3]);
  const [averageCustomerRequestSize, setAverageCustomerRequestSize] = useState([
    5000,
  ]);
  const [simRuns, setSimRuns] = useState([1]);

  // data
  const [_1Rec, Set_1Rec] = useState(0);
  const [_500Rec, Set_500Rec] = useState(0);
  const [_5000Rec, Set_5000Rec] = useState(0);
  const [jobsCharts, setJobsCharts] = useState([] as number[][]);

  function calculateTimeAvg(data: Array<ResultsRecord[]>) {
    const average = (array: any[]) =>
      array.reduce((a, b) => a + b) / array.length;

    let _1RecArray = data.map((rec) => {
      return rec[0].val && rec[0].val > 0 ? rec[0].val : false;
    });
    Set_1Rec(average(_1RecArray));

    let _500RecArray = data.map((rec) => {
      return rec[1].val && rec[1].val > 0 ? rec[1].val : false;
    });
    Set_500Rec(average(_500RecArray));

    let _5000RecArray = data.map((rec) => {
      return rec[2].val && rec[2].val > 0 ? rec[2].val : false;
    });
    Set_5000Rec(average(_5000RecArray));
  }

  function populateCharts(jobsChart: number[][]) {
    setJobsCharts(jobsChart.slice(0, 16));
  }

  async function run() {
    const results = await scanSim(
      workers[0],
      customersCount[0],
      averageCustomerRequestSize[0],
      simRuns[0]
    );
    calculateTimeAvg(results.data);
    populateCharts(results.jobsChart);
    console.log(results);
  }

  return (
    <Flex>
      <Container size="1" p="3">
        <img
          alt="Equalify"
          width="201"
          height="62"
          src="https://equalify.app/wp-content/uploads/2024/04/Equalify-Logo.png"
        ></img>

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
                fontSize: 12,
                lineHeight: 1.2,
                textAlign: "left",
                color: "#c8c8c8",
              }}
            >
              Avg Scan (s)
            </Box>
            <Slider
              min={0}
              max={10}
              value={scanTime}
              onValueChange={setScanTime}
              disabled
            ></Slider>
            {scanTime}
          </Flex>
          <Flex minWidth="300px" align={"center"} gap="4" pt="2">
            <Box
              width="120px"
              style={{ fontSize: 12, lineHeight: 1.2, textAlign: "left" }}
            >
              Workers
            </Box>
            <Slider
              min={1}
              max={50}
              value={workers}
              onValueChange={setWorkers}
            ></Slider>
            {workers}
          </Flex>
          <Flex minWidth="300px" align={"center"} gap="4" pt="2">
            <Box
              width="120px"
              style={{ fontSize: 12, lineHeight: 1.2, textAlign: "left" }}
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
              style={{ fontSize: 12, lineHeight: 1.2, textAlign: "left" }}
            >
              Avg Customer Request Size
            </Box>
            <Slider
              min={1}
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
              style={{ fontSize: 12, lineHeight: 1.2, textAlign: "left" }}
            >
              # of Simulation Runs
            </Box>
            <Slider
              min={1}
              max={500}
              value={simRuns}
              onValueChange={setSimRuns}
            ></Slider>
            {simRuns}
          </Flex>
          <Separator
            style={{ width: "100%", marginTop: "1em", marginBottom: "1em" }}
          />
          <Text size="2">Estimated Cost: ${  (14+(14*workers[0])).toFixed(2) }/mo</Text>
          <Separator
            style={{ width: "100%", marginTop: "1em", marginBottom: "1em" }}
          />

        </Box>
        <Box>
          <Button onClick={run}>Run</Button>
        </Box>
      </Container>
      <Container p="5" width="60vw">
        <Grid columns="3" gap="3" width="100%">
          <Card>
            <Text as="div" size="2" weight="bold">
              1 Scan
            </Text>
            <Text as="div" size="2" color="gray">
              {formatDuration(
                intervalToDuration({ start: 0, end: Math.round(_1Rec) * 1000 })
              )}
            </Text>
          </Card>
          <Card>
            <Text as="div" size="2" weight="bold">
              500 Scans
            </Text>
            <Text as="div" size="2" color="gray">
              {formatDuration(
                intervalToDuration({
                  start: 0,
                  end: Math.round(_500Rec) * 1000,
                })
              )}
            </Text>
          </Card>
          <Card>
            <Text as="div" size="2" weight="bold">
              5000 Scans
            </Text>
            <Text as="div" size="2" color="gray">
              {formatDuration(
                intervalToDuration({
                  start: 0,
                  end: Math.round(_5000Rec) * 1000,
                })
              )}
            </Text>
          </Card>
        </Grid>
        <Grid columns="4" gap="5" pt="5">
          {jobsCharts
            ? jobsCharts.map((chart, i) => (
                <Box style={{ borderLeft: "2px solid #efefef", borderBottom: "2px solid #efefef" }}>
                <SparklinesLine
                  data={chart}
                  key={i}
                  stroke="#155f1b"
                  fill="none"
                  curved
                  strokeWidth={2}
                  label="Scans"
                  
                >
                  <Tooltip />
                </SparklinesLine></Box>
              ))
            : ""}
        </Grid>
      </Container>
    </Flex>
  );
}
