import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import './InstallerData.css';
ChartJS.register(...registerables);

function InstallerData({ resultData }) {
    const [formattedData, setFormattedData] = useState([]);

    useEffect(() => {
        if (resultData && Object.keys(resultData).length > 0) {
            const data = formatDataForChart(resultData);
            setFormattedData(data);
        }
    }, [resultData]);

    function formatDataForChart(resultData) {
        const initialInstallerData = {};

        for (const key in resultData) {
            const entry = resultData[key];
            const installer = entry["Initial Installer"];
            const timeToComplete = entry["Time to Complete"];

            if (!initialInstallerData[installer]) {
                initialInstallerData[installer] = {
                    total: 0,
                    count: 0
                };
            }

            initialInstallerData[installer].total += timeToComplete;
            initialInstallerData[installer].count++;
        }

        const newData = [];
        for (const installer in initialInstallerData) {
            const averageTime = initialInstallerData[installer].total / initialInstallerData[installer].count;
            newData.push({
                "Initial Installer": installer,
                "Average time to Complete": averageTime
            });
        }

        return newData;
    }

    const chartData = {
        labels: formattedData.map(item => item["Initial Installer"]),
        datasets: [{
            label: 'Average Time to Complete',
            data: formattedData.map(item => item["Average time to Complete"]),
            backgroundColor: 'rgba(75,192,192,1)',
            borderColor: 'rgba(0,0,0,1)',
            borderWidth: 2
        }]
    };

    const chartOptions = {
        scales: {
            x: {
                beginAtZero: true
            },
            y: {
                beginAtZero: true
            }
        }
    };

    return (
        <div className='installer-data'>
            <h2>Installer Data Bar Graph</h2>
            <Bar data={chartData} options={chartOptions} />
        </div>
    );
}

export default InstallerData;



















// import { useEffect, useState } from 'react';
// import { Bar } from 'react-chartjs-2';
// import { Chart as ChartJS, registerables } from 'chart.js';
// import axios from 'axios';
// import { read, utils } from 'xlsx';
// ChartJS.register(...registerables);

// function InstallerData() {
//     const [resultData, setResultData] = useState({});

//     useEffect(() => {
//         axios
//             .get('http://localhost:3000/')
//             .then((res) => {
//                 setResultData(res.data);
//             })
//             .catch((error) => {
//                 console.log(error);
//             });
//     }, []);

//     useEffect(() => {
//         const handleFileChange = (e) => {
//             let file = e.target.files[0];
//             let reader = new FileReader();

//             reader.onload = function (event) {
//                 let orgData = new Uint8Array(event.target.result);
//                 let workbook = read(orgData, { type: 'array' });
//                 let sheetNameList = workbook.SheetNames;
//                 let jsonResult = utils.sheet_to_json(workbook.Sheets[sheetNameList[0]], { header: 1 });
//                 setResultData(jsonResult);
//             }
//             reader.readAsArrayBuffer(file);
//         };

//         const fileInput = document.getElementById('fileInput');
//         if (fileInput) {
//             fileInput.addEventListener('change', handleFileChange);
//         }

//         return () => {
//             if (fileInput) {
//                 fileInput.removeEventListener('change', handleFileChange);
//             }
//         };
//     }, []);

//     function formatDataForChart(resultData) {
//         const initialInstallerData = {};

//         // Check if resultData is an array
//         if (Array.isArray(resultData)) {
//             resultData.forEach(entry => {
//                 const installer = entry["Initial Installer"];
//                 const timeToComplete = entry["Time to Complete"];

//                 if (!initialInstallerData[installer]) {
//                     initialInstallerData[installer] = {
//                         total: 0,
//                         count: 0
//                     };
//                 }

//                 initialInstallerData[installer].total += timeToComplete;
//                 initialInstallerData[installer].count++;
//             });
//         } else {
//             // Log resultData to understand its structure
//             console.log(resultData);
//         }

//         const newData = {};
//         for (const installer in initialInstallerData) {
//             const averageTime = initialInstallerData[installer].total / initialInstallerData[installer].count;
//             newData[installer] = averageTime;
//         }

//         const chartData = [];
//         for (const installer in newData) {
//             chartData.push({
//                 "Initial Installer": installer,
//                 "Average time to Complete": newData[installer]
//             });
//         }

//         return chartData;
//     }

//     const formattedData = formatDataForChart(resultData);

//     const chartData = {
//         labels: formattedData.map(item => item["Initial Installer"]),
//         datasets: [{
//             label: 'Average Time to Complete',
//             data: formattedData.map(item => item["Average time to Complete"]),
//             backgroundColor: 'rgba(75,192,192,1)',
//             borderColor: 'rgba(0,0,0,1)',
//             borderWidth: 2
//         }]
//     };

//     const chartOptions = {
//         scales: {
//             x: {
//                 beginAtZero: true
//             },
//             y: {
//                 beginAtZero: true
//             }
//         }
//     };

//     return (
//         <div>
//             <h2>Installer Data Bar Graph</h2>
//             <Bar data={chartData} options={chartOptions} />
//         </div>
//     );
// }

// export default InstallerData;





























// import { useEffect, useState } from 'react';
// import { Bar } from 'react-chartjs-2';
// import { Chart as ChartJS, registerables } from 'chart.js';
// import axios from 'axios';
// import { read, utils } from 'xlsx';
// ChartJS.register(...registerables);




// function InstallerData() {
//     const [resultData, setResultData] = useState({});

//     useEffect(() => {
//         axios
//         .get('http://localhost:3000/')
//         .then((res) => {
//         setResultData(res.data)
        
//     })
//     .catch((error) => {
//         console.log(error);
//     })
//     }, [resultData]);

//     console.log(resultData)

//     useEffect(() => {
//             const handleFileChange = (e) => {
//                     let file = e.target.files[0];
//                     let reader = new FileReader();
        
//                     reader.onload = function (event) {
//                         let orgData = new Uint8Array(event.target.result);
//                         let workbook = read(orgData, { type: 'array' });
//                         let sheetNameList = workbook.SheetNames;
//                         let jsonResult = utils.sheet_to_json(workbook.Sheets[sheetNameList[0]], { header: 1 });
//                         let jsonOutput = JSON.parse(jsonResult); // Parse the JSON string
//                         setResultData(jsonOutput);
        
//                     }
//                     reader.readAsArrayBuffer(file);
//             };
    
//             const fileInput = document.getElementById('fileInput');
//             if (fileInput) {
//                 fileInput.addEventListener('change', handleFileChange);
//             }
    
//             return () => {
//                 if (fileInput) {
//                     fileInput.removeEventListener('change', handleFileChange);
//                 }
//             };
//         });

//         function formatDataForChart(resultData) {
//             // Step 1: Parse resultData to extract relevant information
//             const initialInstallerData = {};
        
//             resultData.forEach(entry => {
//                 const installer = entry["Initial Installer"];
//                 const timeToComplete = entry["Time to Complete"];
        
//                 if (!initialInstallerData[installer]) {
//                     initialInstallerData[installer] = {
//                         total: 0,
//                         count: 0
//                     };
//                 }
        
//                 initialInstallerData[installer].total += timeToComplete;
//                 initialInstallerData[installer].count++;
//             });
        
//             // Step 2: Calculate the average time to complete for each initial installer
//             const newData = {};
//             for (const installer in initialInstallerData) {
//                 const averageTime = initialInstallerData[installer].total / initialInstallerData[installer].count;
//                 newData[installer] = averageTime;
//             }
        
//             // Step 3: Format the data into an array of objects with "Initial Installer" and "Average time to Complete" properties
//             const chartData = [];
//             for (const installer in newData) {
//                 chartData.push({
//                     "Initial Installer": installer,
//                     "Average time to Complete": newData[installer]
//                 });
//             }
        
//             return chartData;
//         }

//         // const chartData = formatDataForChart(resultData);


//         const chartData = {
//             labels: Object.keys(resultData), // Check if this is correct (I think I need to make a new key/value Object from result data first)
//             datasets: [{
//                 label: 'Average Time to Complete',
//                 data: Object.values(resultData), // Check if this is correct (I think I need to make a new key/value Object from result data first)
//                 backgroundColor: 'rgba(75,192,192,1)',
//                 borderColor: 'rgba(0,0,0,1)',
//                 borderWidth: 2
//             }]
//         };

//         console.log(chartData.labels)

//     const chartOptions = {
//         scales: {
//             xAxes: [{
//                 ticks: {
//                     beginAtZero: true, 
//                     callback: formatDataForChart(chartData)
//                 }
//             }]
//         }
//     };

//     return (
//         <div>
//             <h2>Installer Data Bar Graph</h2>
//             <Bar data={chartData} options={chartOptions} />  

//         </div>
//     );
// }

// export default InstallerData; 