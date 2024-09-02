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
}

const customers: ScanCustomer[] = [];

const provisionCustomers = () => {
  for (let i = 0; i < customersCount; i++) {
    let customer: ScanCustomer = {
      jobsCount: averageCustomerRequestSize, //TODO randomize w distribution
      arrivalTick: Math.round(Math.random() * simDuration),
      finishedTick: null,
    };
    customers.push(customer);
  }
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
  console.log(`Sim duration: ${(simDuration*secsPerTick).toFixed(2)}s`);
  for (let j = 0; j < simRuns; j++) {
    // start a new run
    provisionCustomers();
    for (let i = 0; i < simDuration; i++) {
      advanceTick();
    }
    console.log(customers);
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
}

run();