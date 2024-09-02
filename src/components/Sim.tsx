import { useEffect, useState } from "react"

export default function Sim(){

    // u customers per hour
    // a average number of customers that can be served in an hour
    // expected wait = a / u(u-a)
    // expected customers waiting at any time = a^2 / u(u-a)

    // scan time = 5s each
    // customers per hour = 60*60 (seconds in an hour) / scan time 
    
    // inputs
    const [ scanTime, setScanTime ] = useState(5);
    const [ customers,SetCustomers ] = useState(1); // customers running 1 scan a week
    const [ averageScanSize, setAverageScanSize ] = useState(5000);
    //const [ weeklyScansPerCustomer, setWeeklyScansPerCustomer ] = useState(1);

    // intermediates
    const [λ, setλ] = useState(0); // requests arriving per hour
    const [μ, setμ] = useState(0); // scans able to be processed per hour

    // outputs
    const [ expectedWait, setExpectedWait ] = useState(0)
    const [ expectedCustomersInQueue, setExpectedCustomersInQueue ] = useState(0);
    
    useEffect(()=>{
        setμ( 1/scanTime ); // scans able to be processed per second
        setλ( customers / (7 * 24 * 60 * 60 )  ); // Customers running scans per second

        let serviceRate = μ/averageScanSize;
        console.log(serviceRate);
        
        setExpectedWait( 1 / ( μ - λ )  );
        setExpectedCustomersInQueue( μ / ( 1-μ ) ); 
    },[
        scanTime, 
        //weeklyScansPerCustomer, 
        customers, λ, μ, averageScanSize])

    return (
        <>
        <div>
            <input value={scanTime} id="scanTime" /><label htmlFor="scanTime">Average Scan Time</label>
        </div>
        <div>
            <input value={customers} id="customers" /><label htmlFor="customers">Customers</label>
        </div>
        <div>
            { μ } Scans Able to Be Processed  
        </div>
        <div>
            { λ.toFixed(2) } Expected Scans Requested
        </div>
        <div>
            { expectedCustomersInQueue.toFixed(2) } Expected Average Customers in Queue
        </div>
        <div>
            { expectedWait.toFixed(2) } Expected Average Wait
        </div>
        </>
    )

}

/* 
Buses arrive every 30 minutes on average, so that's an average rate of 2 per hour.
I arrive at the bus station, I can use this to generate the next bus ETA:
  randomExponential(2); // => 0.3213031016466269 hours, i.e. 19 minutes 
*/

// Exponential random number generator
function randomExponential(lambda:number) {
    return - Math.log(1 - Math.random()) / lambda;
}