import { BrowserRouter, Routes, Route } from 'react-router-dom'

import AuthPage from "./component/JobPortalAuth";
import JobListing from "./component/JobPortal";
import JobAdding from "./component/JobAdding";
import JobDetails from "./component/JobDetails";

import './App.css'

const App = () => (
    
    <BrowserRouter>
       <Routes>
            <Route path='/authentication' element={<AuthPage /> } />
            <Route path='/' element={<JobListing /> } />
            <Route path='/job/add' element={<JobAdding /> } />
            <Route path='/job/details/:jobId' element={<JobDetails /> } />
       </Routes>
    </BrowserRouter>

)

export default App;
