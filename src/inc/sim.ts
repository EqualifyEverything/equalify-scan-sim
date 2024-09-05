interface Results {
    data: Array<ResultsRecord[]>;
    perf: String;
    jobsChart: Array<Array<number>>;
  }

  interface ScanCustomer {
    jobsCount: number;
    arrivalTick: number;
    finishedTick: number | null;
    startingJobsCount: number;
  }

 export interface ResultsRecord { 
    name: number, val: number|null 
}

export default function scanSim(
  workers: number,
  customersCount: number,
  averageCustomerRequestSize: number,
  simRuns: number
):Promise<Results> {
  // inputs
  //let scanTime = 5; // time per scan (s)

  // consts
  let secsPerTick = 5; // seconds per tick (s)
  let currentTick = 0;

  // intermediates
  let simDuration = (7 * 24 * 60 * 60) / secsPerTick; // seconds in a week/secsPerTick
  let sampleInterval = Math.round(simDuration / 200); // get ~100 datapoints
  console.log(sampleInterval);



  const customers: ScanCustomer[] = [];
  const jobsCountHistory: number[] = [];
  const results: Results = { data: [], perf: "", jobsChart: [] };

  function generateCustomer(jobsCount?: number) {
    const jobs = jobsCount
      ? jobsCount
      : Math.round(randn_bm(0, averageCustomerRequestSize * 2, 1));
    return {
      jobsCount: jobs,
      startingJobsCount: jobs,
      arrivalTick: Math.round(Math.random() * simDuration),
      finishedTick: null,
    };
  }

  const provisionCustomers = () => {
    customers.splice(0, customers.length);
    // Control customers
    customers.push(generateCustomer(1));
    customers.push(generateCustomer(500));
    customers.push(generateCustomer(5000));

    // randomized cusomers
    for (let i = 0; i < customersCount - 3; i++) {
      customers.push(generateCustomer());
    }
  };

  let customerPointer = 0;
  const advanceTick = () => {

    // Add the current jobs in queue to the sample history
    if (currentTick % sampleInterval === 0) {
      let currentActiveJobs = 0;
      customers.forEach((customer) => {
        if (currentTick >= customer.arrivalTick) {
          currentActiveJobs += customer.jobsCount;
        }
      });
      jobsCountHistory.push(currentActiveJobs);
    }

    // Process each worker's jobs
    for (let i = 0; i < workers; i++) {
      // advance the pointer
      customerPointer++;
      if (customerPointer > customers.length - 1) {
        customerPointer = 0;
      }

      if (
        currentTick >= customers[customerPointer].arrivalTick &&
        customers[customerPointer].finishedTick == null
      ) {
        if (customers[customerPointer].jobsCount > 0) {
          customers[customerPointer].jobsCount--; // finish a scan
        } else {
          // if done, set the finishedTick and remove from loop
          customers[customerPointer].finishedTick = currentTick;
          // Dont' pass zero for scans faster than secsPerTick
          if (
            customers[customerPointer].finishedTick ===
            customers[customerPointer].arrivalTick
          ) {
            customers[customerPointer].finishedTick = currentTick + 1;
          }
        }
      }
    }

    currentTick++;
  };

  function simReset() {
    currentTick = 0;
    customerPointer = 0;
    jobsCountHistory.splice(0, jobsCountHistory.length);
  }

  const run = () => {
    let start = performance.now();
    console.log(`Sim duration: ${(simDuration * secsPerTick).toFixed(2)}s`);
    for (let j = 0; j < simRuns; j++) {
      // start a new run
      provisionCustomers();
      for (let i = 0; i < simDuration; i++) {
        advanceTick();
      }
      // run finished, process results
      results.jobsChart.push(jobsCountHistory.slice());
      results.data.push(saveResults());
      
      simReset();
    }
    let delta = performance.now() - start;
    results.perf = `Finished, took: ${delta.toFixed(2)}ms`;
  };

  const saveResults = () => {

    // get 1,500,500
    const exampleCustomers:ResultsRecord[] = [ { name: 1, val: -1 }, { name: 500, val: -1 }, { name: 5000, val: -1 } ];
    exampleCustomers.forEach((customer) => {
      const scan = customers.find(
        (obj) => obj.startingJobsCount === Number(customer.name)
      );
      if (scan && scan.finishedTick) {
        customer.val =
          (scan.finishedTick - scan.arrivalTick) * secsPerTick;
      }
    });
   
    return exampleCustomers;
  };

  run();
  return new Promise((resolve, reject) => {
    resolve(results);
  });
}

// Exponential random number generator
/* function randomExponential(lambda: number) {
  return -Math.log(1 - Math.random()) / lambda;
} */

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
