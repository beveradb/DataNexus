import { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './Components/NavBar/NavBar';
import HomePage from './Pages/HomePage/HomePage';
import Error from './Pages/Error/Error';
import InstallerData from './Pages/InstallerData/InstallerData';
import LotData from './Pages/LotData/LotData';
import "./App.css";

function App() {
    const [resultData, setResultData] = useState({});

    return (
        <div className="App">
            <Router>
                <NavBar />
                <Routes>
                    <Route path='/' element={<HomePage setResultData={setResultData} />} />
                    <Route path='/installer' element={<InstallerData resultData={resultData} />} />
                    <Route path='/lot' element={<LotData />} />
                    <Route path='*' element={<Error />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;





