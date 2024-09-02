import { Box, Button } from "@radix-ui/themes";
import { useEffect, useState } from "react";

interface ScanCustomer {
  jobsCount: number;
  arrivalTick: number;
  finishedTick: number | null;
}

export default function Sim() {
  // inputs
  const [scanTime, setScanTime] = useState(5); // time per scan (s)
  const [workers, setWorkers] = useState(1);
  const [customersCount, setCustomersCount] = useState(3);
  const [averageCustomerRequestSize, setAverageCustomerRequestSize] =
    useState(5000);

  const [simRuns, setSimRuns] = useState(1);

  // consts
  let secsPerTick = 5; // seconds per tick (s)
  const [currentTick, setCurrentTick] = useState(0);

  // intermediates
  let simDuration = (7 * 24 * 60 * 60) / secsPerTick; // seconds in a week/secsPerTick

  const [customers, setCustomers] = useState<ScanCustomer[]>([]);

  const [customerPointer, setCustomerPointer] = useState(0);

  function advanceTick() {
    for (let i = 0; i < workers; i++) {
      // advance the pointer
      if (customerPointer >= customers.length - 1) {
        setCustomerPointer(0);
      } else {
        setCustomerPointer(customerPointer + 1);
      }
      if (
        customers[customerPointer].arrivalTick &&
        currentTick > customers[customerPointer].arrivalTick &&
        customers[customerPointer].finishedTick == null
      ) {
        let newArr = [...customers];
        if (customers[customerPointer].jobsCount > 0) {
          newArr[customerPointer].jobsCount--; // finish a scan
        } else {
          // if done, set the finishedTick and remove from look
          newArr[customerPointer].finishedTick = currentTick;
        }
        setCustomers(newArr)
      }
      setCurrentTick(currentTick+1);
    }
  }

  function run() {
    let start = performance.now();
    console.log(`Sim duration: ${(simDuration * secsPerTick).toFixed(2)}s`);
    // start a new run
    for (let j = 0; j < simRuns; j++) {
      const newCustomers = [];
      for (let k = 0; k < customersCount; k++) {
        newCustomers.push({
          jobsCount: Math.round(randn_bm(0, averageCustomerRequestSize * 2, 1)),
          arrivalTick: Math.round(Math.random() * simDuration),
          finishedTick: null,
        });
      }
      setCustomers(newCustomers);
      console.log(customers);
      
      for (let i = 0; i < simDuration; i++) {
        advanceTick();
      };
      console.log(customers);
      analyseResults(); 
    }
    let delta = performance.now() - start;

    console.log(`Finished, took: ${delta.toFixed(2)}ms`);
  }

  const analyseResults = () => {
    // TODO generate report
    /*
       - multiply values by secsPerTick to convert to seconds!
       - calculate average job completion time (in minutes)
       - generate jobs graph (simple array from sampling?)
       - generate customer timeline 
       - push to results array
      */
    return null;
  };

  return (
    <>
      <Box>
        <Button onClick={run}>Run</Button>
      </Box>
    </>
  );
}

// Exponential random number generator
function randomExponential(lambda: number) {
  return -Math.log(1 - Math.random()) / lambda;
}

// Standard Normal variate using Box-Muller transform.
function randn_bm(min: number, max: number, skew: number) {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

  num = num / 10.0 + 0.5; // Translate to 0 -> 1
  if (num > 1 || num < 0) num = randn_bm(min, max, skew); // resample between 0 and 1 if out of range
  num = Math.pow(num, skew); // Skew
  num *= max - min; // Stretch to fill range
  num += min; // offset to min
  return num;
}
