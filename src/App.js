
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from './HomePage';
import ForgotPassword from "./components/auth/ForgotPassword";
import Dashboard from "./Dashboard.js";
import AuthDetails from "./components/AuthDetails.jsx";

function App() {
 
  
  return (
    <>
    <BrowserRouter>
            <div>
                <Routes>
                    <Route path="/" element={<HomePage/>} />
                    <Route path="/dashboard" element={<Dashboard/>} />
                    <Route path="/home" element={<AuthDetails/>} />
                    <Route path="/reset" element={<ForgotPassword/>} />
                </Routes>
            </div>
    </BrowserRouter>

   

    </>
    
  );
}

export default App;
