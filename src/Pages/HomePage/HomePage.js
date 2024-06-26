import { useState, useEffect } from 'react';
import { read, utils } from 'xlsx';
import { parse, format, differenceInCalendarDays } from 'date-fns';
import axios from 'axios';
import "./HomePage.css";

function HomePage({ setResultData }) {
    const [output, setOutput] = useState([]);

    useEffect(() => {
        axios
            .get('http://localhost:3000/')
            .then((res) => {
                setResultData(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [setResultData]);

    useEffect(() => {
        const handleFileChange = (e) => {
            let file = e.target.files[0];
            let reader = new FileReader();

            reader.onload = function (event) {
                let orgData = new Uint8Array(event.target.result);
                let workbook = read(orgData, { type: 'array' });
                let sheetNameList = workbook.SheetNames;
                let jsonResult = utils.sheet_to_json(workbook.Sheets[sheetNameList[0]], { header: 1 });
                let jsonOutput = JSON.stringify(jsonResult, null, 2);
                setOutput(jsonOutput);

                processData(jsonResult);
            }
            reader.readAsArrayBuffer(file);
        }

        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
            fileInput.addEventListener('change', handleFileChange);
        }

        return () => {
            if (fileInput) {
                fileInput.removeEventListener('change', handleFileChange);
            }
        };
    }, []);

    const processData = (jsonData) => {
        const keys = jsonData[0];
        const result = jsonData.slice(1).map(values => {
            const obj = {};
            keys.forEach((key, index) => {
                obj[key] = values[index];
            });
            return obj;
        });

        const groupedByPrimary = {};
        result.forEach(item => {
            const primary = item["Primary"];
            if (!groupedByPrimary[primary]) {
                groupedByPrimary[primary] = [];
            }
            groupedByPrimary[primary].push(item);
        });

        const newData = {};
        for (const primary in groupedByPrimary) {
            const items = groupedByPrimary[primary];
            let initialStartDate = null;
            let initialInstaller = null;
            let finalEndDate = null;

            items.forEach(item => {
                const startDate = excelSerialToDate(item["Start Date"]);
                if (!initialStartDate || startDate < initialStartDate) {
                    initialStartDate = startDate;
                    initialInstaller = item["Type"] === "New Start" ? item["Installers"] : (initialInstaller || "No New Start Listed");
                }

                const completeDate = excelSerialToDate(item["Complete"]);
                const qiDate = excelSerialToDate(item["QI Date"]);

                if (completeDate > finalEndDate || !finalEndDate) {
                    finalEndDate = completeDate;
                }
                if (qiDate > finalEndDate || !finalEndDate) {
                    finalEndDate = qiDate;
                }
            });

            const timeToComplete = calculateDaysDifference(initialStartDate, finalEndDate);

            newData[primary] = {
                "Initial Start Date": formatDate(initialStartDate),
                "Initial Installer": initialInstaller,
                "Final End Date": formatDate(finalEndDate),
                "Time to Complete": timeToComplete
            };
        }

        setResultData(newData);
    };

    const excelSerialToDate = (serial) => {
        if (!serial) return null;
        const MS_PER_DAY = 24 * 60 * 60 * 1000;
        const daysFromUnixEpoch = serial - 25568;
        const milliseconds = daysFromUnixEpoch * MS_PER_DAY;
        return new Date(milliseconds);
    };

    const formatDate = (date) => {
        if (!date) return '';
        return format(date, 'MM/dd/yyyy');
    };

    const calculateDaysDifference = (startDate, endDate) => {
        if (!startDate || !endDate) return '';
        return differenceInCalendarDays(endDate, startDate) + 1;
    };

    return (
        <div className="container">
            <h1 id="header">DataNexus Pro</h1>
            <p id="instructions">Import your .xlsx file below to retrieve a converted version of your project data:</p>
            <br />
            <form>
                <input type="file" id="fileInput" accept=".xlsx" />
                <br />
                <pre id="output">{output}</pre>
                <br />
                <div id="resultData"></div>
            </form>
        </div>
    );
}

export default HomePage;



















// import { useState, useEffect } from 'react';
// import { read, utils } from 'xlsx';
// import { parse, format, differenceInCalendarDays } from 'date-fns';
// import axios from 'axios';
// import "./HomePage.css";


// function HomePage() {
//     const [output, setOutput] = useState([]);
//     const [resultData, setResultData] = useState({});

//      useEffect(() => {
//         axios
//         .get('http://localhost:3000/')
//         .then((res) => {
//         setResultData(res.data)
//     })
//     .catch((error) => {
//         console.log(error)
//     })
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
//                 let jsonOutput = JSON.stringify(jsonResult, null, 2);
//                 setOutput(jsonOutput);

//                 processData(jsonResult);
//             }
//             reader.readAsArrayBuffer(file);
//         }

//         document.getElementById('fileInput').addEventListener('change', handleFileChange);

//         return () => {
//             document.getElementById('fileInput');
//         };
//     });

//     const processData = (jsonData) => {
//         const keys = jsonData[0];
//         // Convert the remaining arrays into objects
//         const result = jsonData.slice(1).map(values => {
//             const obj = {};
//             keys.forEach((key, index) => {
//                 obj[key] = values[index];
//             });
//             return obj;
//         });
    
//         // Group objects by "Primary" key
//         const groupedByPrimary = {};
//         result.forEach(item => {
//             const primary = item["Primary"];
//             if (!groupedByPrimary[primary]) {
//                 groupedByPrimary[primary] = [];
//             }
//             groupedByPrimary[primary].push(item);
//         });
    
//         // Construct new object with keys "Initial Start Date", "Initial Installer", "Final End Date", and "Time to Complete"
//         const newData = {};
//         for (const primary in groupedByPrimary) {
//             const items = groupedByPrimary[primary];
//             let initialStartDate = null;
//             let initialInstaller = null;
//             let finalEndDate = null;
    
//             items.forEach(item => {
//                 const startDate = excelSerialToDate(item["Start Date"]);
//                 if (!initialStartDate || startDate < initialStartDate) {
//                     initialStartDate = startDate;
//                     // Convert null to "No New Start Listed" if initialInstaller is null
//                     initialInstaller = item["Type"] === "New Start" ? item["Installers"] : (initialInstaller || "No New Start Listed");
//                 }
    
//                 const completeDate = excelSerialToDate(item["Complete"]);
//                 const qiDate = excelSerialToDate(item["QI Date"]);
    
//                 if (completeDate > finalEndDate || !finalEndDate) {
//                     finalEndDate = completeDate;
//                 }
//                 if (qiDate > finalEndDate || !finalEndDate) {
//                     finalEndDate = qiDate;
//                 }
//             });
    
//             const timeToComplete = calculateDaysDifference(initialStartDate, finalEndDate);
    
//             newData[primary] = {
//                 "Initial Start Date": formatDate(initialStartDate),
//                 "Initial Installer": initialInstaller,
//                 "Final End Date": formatDate(finalEndDate),
//                 "Time to Complete": timeToComplete
//             };
//             console.log(newData)
//         }
    
//         // Generate HTML content for newData
//         let htmlContent = '<ul>';
//         for (const primary in newData) {
//             htmlContent += `<li><strong>${primary}</strong><br>`;
//             const data = newData[primary];
//             for (const key in data) {
//                 htmlContent += `<span>${key}: ${data[key]}</span><br>`;
//             }
//             htmlContent += '</li><br>';
//         }
//         htmlContent += '</ul>';
    
//         // Append HTML content to the "resultData" div
//         document.getElementById('resultData').innerHTML = htmlContent;
//         setResultData(htmlContent)
//     }


//     // Function to convert Excel serial number to JavaScript Date object
//     const excelSerialToDate = (serial) => {
//         if (!serial) return null;
//         const MS_PER_DAY = 24 * 60 * 60 * 1000;
//         const daysFromUnixEpoch = serial - 25568; // Number of days from 1900-01-01 to 1970-01-01
//         const milliseconds = daysFromUnixEpoch * MS_PER_DAY;
//         return new Date(milliseconds);
//     };

//     // Function to format date as mm/dd/yyyy
//     const formatDate = (date) => {
//         if (!date) return '';
//         return format(date, 'MM/dd/yyyy');
//     };

//     // Function to calculate difference in days between two dates
// const calculateDaysDifference = (startDate, endDate) => {
//     if (!startDate || !endDate) return '';
//     return differenceInCalendarDays(endDate, startDate) + 1; // Adding 1 to include both start and end dates
// };


//     return (
//         <div className="container">
//             <h1 id="header">DataNexus Pro</h1>
//             <p id="instructions">Import your .xlsx file below to retrieve a converted version of your project data:</p>
//             <br />
//             <form>
//                 <input type="file" id="fileInput" accept=".xlsx" />
//                 <br />
//                 <pre id="output">{output}</pre>
//                 <br />
//                 <div id="resultData"></div> {/* No need for dangerouslySetInnerHTML since we'll update this using React state */}
//             </form>
//         </div>
//     );
// }

// export default HomePage;
















// function HomePage({ setJsonData, setBarGraphData }) {
//     const [output, setOutput] = useState('');

//     useEffect(() => {
//         const handleFileChange = (e) => {
//             let file = e.target.files[0];
//             let reader = new FileReader();

//             reader.onload = function (event) {
//                 let orgData = new Uint8Array(event.target.result);
//                 let workbook = read(orgData, { type: 'array' });
//                 let sheetNameList = workbook.SheetNames;
//                 let jsonResult = utils.sheet_to_json(workbook.Sheets[sheetNameList[0]], { header: 1 });
//                 let jsonOutput = JSON.stringify(jsonResult, null, 2);
//                 setOutput(jsonOutput);
//                 processData(jsonResult); // Call processData here
//             }
//             reader.readAsArrayBuffer(file);
//         }

//         document.getElementById('fileInput').addEventListener('change', handleFileChange);

//         return () => {
//             document.getElementById('fileInput').removeEventListener('change', handleFileChange);
//         };
//     }, [setBarGraphData]); // Include setBarGraphData in the dependency array

//     // Function to convert Excel serial number to JavaScript Date object
//     const excelSerialToDate = (serial) => {
//         if (!serial) return null;
//         const MS_PER_DAY = 24 * 60 * 60 * 1000;
//         const daysFromUnixEpoch = serial - 25568; // Number of days from 1900-01-01 to 1970-01-01
//         const milliseconds = daysFromUnixEpoch * MS_PER_DAY;
//         return new Date(milliseconds);
//     }

//     // Function to format date as mm/dd/yyyy
//     const formatDate = (date) => {
//         if (!date) return '';
//         const month = (date.getMonth() + 1).toString().padStart(2, '0');
//         const day = date.getDate().toString().padStart(2, '0');
//         const year = date.getFullYear();
//         return `${month}/${day}/${year}`;
//     }

//     // Function to calculate difference in days between two dates
//     const calculateDaysDifference = (startDate, endDate) => {
//         if (!startDate || !endDate) return '';
//         const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
//         const diffDays = Math.round(Math.abs((endDate - startDate) / oneDay) + 1);
//         return diffDays;
//     }

//     // Function to process JSON data and update HTML content
//     const processData = (jsonData) => {
//         const keys = jsonData[0];
//         // Convert the remaining arrays into objects
//         const result = jsonData.slice(1).map(values => {
//             const obj = {};
//             keys.forEach((key, index) => {
//                 obj[key] = values[index];
//             });
//             return obj;
//         });

//         // Group objects by "Primary" key
//         const groupedByPrimary = {};
//         result.forEach(item => {
//             const primary = item["Primary"];
//             if (!groupedByPrimary[primary]) {
//                 groupedByPrimary[primary] = [];
//             }
//             groupedByPrimary[primary].push(item);
//         });

//         // Construct new object with keys "Initial Start Date", "Initial Installer", "Final End Date", and "Time to Complete"
//         const newData = {};
//         for (const primary in groupedByPrimary) {
//             const items = groupedByPrimary[primary];
//             let initialStartDate = null;
//             let initialInstaller = null;
//             let finalEndDate = null;

//             items.forEach(item => {
//                 const startDate = excelSerialToDate(item["Start Date"]);
//                 if (!initialStartDate || startDate < initialStartDate) {
//                     initialStartDate = startDate;
//                     initialInstaller = item["Type"] === "New Start" ? item["Installers"] : initialInstaller;
//                 }

//                 const completeDate = excelSerialToDate(item["Complete"]);
//                 const qiDate = excelSerialToDate(item["QI Date"]);

//                 if (completeDate > finalEndDate || !finalEndDate) {
//                     finalEndDate = completeDate;
//                 }
//                 if (qiDate > finalEndDate || !finalEndDate) {
//                     finalEndDate = qiDate;
//                 }
//             });

//             const timeToComplete = calculateDaysDifference(initialStartDate, finalEndDate);

//             newData[primary] = {
//                 "Initial Start Date": formatDate(initialStartDate),
//                 "Initial Installer": initialInstaller,
//                 "Final End Date": formatDate(finalEndDate),
//                 "Time to Complete": timeToComplete
//             };
//         }

//         // Generate HTML content for newData
//         let htmlContent = '<ul>';
//         for (const primary in newData) {
//             htmlContent += `<li><strong>${primary}</strong><br>`;
//             const data = newData[primary];
//             for (const key in data) {
//                 htmlContent += `<span>${key}: ${data[key]}</span><br>`;
//             }
//             htmlContent += '</li><br>';
//         }
//         htmlContent += '</ul>';

//         // Update HTML content
//         document.getElementById('resultData').innerHTML = htmlContent;

//         // After processing data, set bar graph data using setBarGraphData
//         setBarGraphData(/* your bar graph data */);
//     }

//     return (
//         <div className="container">
//             <h1 id="header">Plumbing Solutions' Solutions</h1>
//             <p id="instructions">Import your .xlsx file below to retrieve a converted version of your project data:</p>
//             <br />
//             <form>
//                 <input type="file" id="fileInput" accept=".xlsx" />
//                 <br />
//                 <pre id="output">{output}</pre>
//                 <br />
//                 <div id="resultData"></div> {/* No need for dangerouslySetInnerHTML since we'll update this using React state */}
//             </form>
//         </div>
//     );
// }

// export default HomePage;