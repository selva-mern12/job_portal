import { useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const userTypes = Cookies.get('user_type') || 'seeker';
    const [userType, setUserType] = useState(userTypes);
    const jwtToken = Cookies.get('jwt_token');

    const handleUserTypeChange = (type) => {
        Cookies.set('user_type', type);
        setUserType(type);
        window.location.reload(); // Reload only when button is clicked
    };

    const isHiringManager = userType === "hiring";

    return (
        <div className="job-header">
            <h2 onClick={() => navigate('/')} className='app-name'>JobStation</h2>
            <div className="auth-buttons">
                {jwtToken ? (
                    <>
                        {isHiringManager && <button onClick={() => navigate('/job/add')}>Add Job</button>}
                        <button onClick={() => navigate('/job/applied')}>Applied Jobs</button>
                        <button onClick={() => handleUserTypeChange('hiring')}>Job Hiring</button>
                        <button onClick={() => handleUserTypeChange('seeker')}>Job Seeker</button>
                        <button className="logout-btn" onClick={() => {
                            Cookies.remove('jwt_token');
                            Cookies.remove('user_type');
                            navigate('/authentication');
                        }}>Logout</button>
                    </>
                ) : (
                    <button className="login-btn" onClick={() => navigate('/authentication')}>Login</button>
                )}
            </div>
        </div>
    );
};

export default Header;
