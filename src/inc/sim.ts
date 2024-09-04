export default function scanSim() {
  // inputs
  let scanTime = 5; // time per scan (s)
  let workers = 1;
  let customersCount = 3;
  let averageCustomerRequestSize = 5000;

  let simRuns = 1;

  // consts
  let secsPerTick = 5; // seconds per tick (s)
  let currentTick = 0;

  // intermediates
  let simDuration = (7 * 24 * 60 * 60) / secsPerTick; // seconds in a week/secsPerTick

  interface ScanCustomer {
    jobsCount: number;
    arrivalTick: number;
    finishedTick: number | null;
    startingJobsCount: number;
  }

  const customers: ScanCustomer[] = [];

  const results = {};

  function generateCustomer(jobsCount?:number){
    const jobs = jobsCount ? jobsCount : Math.round(randn_bm(0, averageCustomerRequestSize * 2, 1));
    return {
        jobsCount: jobs,
        startingJobsCount: jobs,
        arrivalTick: Math.round(Math.random() * simDuration),
        finishedTick: null,
    }
  }

  const provisionCustomers = () => {
    customers.splice(0,customers.length);
    // Control customers
    customers.push(generateCustomer(1));
    customers.push(generateCustomer(500));
    customers.push(generateCustomer(5000));

    // randomized cusomers
    for (let i = 0; i < customersCount - 3; i++) {
      customers.push(generateCustomer());
    }
    console.log(customers)
  };

  let customerPointer = 0;
  const advanceTick = () => {
    for (let i = 0; i < workers; i++) {
      // advance the pointer
      if (customerPointer >= customers.length - 1) {
        customerPointer = 0;
      } else {
        customerPointer++;
      }
      if (
        currentTick > customers[customerPointer].arrivalTick &&
        customers[customerPointer].finishedTick == null
      ) {
        if (customers[customerPointer].jobsCount > 0) {
          customers[customerPointer].jobsCount--; // finish a scan
        } else {
          // if done, set the finishedTick and remove from look
          customers[customerPointer].finishedTick = currentTick;
        }
      }
      currentTick++;
    }
  };

  const run = () => {
    let start = performance.now();
    console.log(`Sim duration: ${(simDuration * secsPerTick).toFixed(2)}s`);
    for (let j = 0; j < simRuns; j++) {
      // start a new run
      provisionCustomers();
      for (let i = 0; i < simDuration; i++) {
        advanceTick();
      }
      console.log(customers);
      // run finished, process results
      analyseResults();
    }
    let delta = performance.now() - start;

    console.log(`Finished, took: ${delta.toFixed(2)}ms`);
  };

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

  run();
  return new Promise((resolve, reject) => {
    resolve(true);
  });
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
