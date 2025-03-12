import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { parse } from "date-fns";
import Cookies from 'js-cookie';
import Header from "../Header";
import { FailureView, LoaderView } from "../LoadingFailure";
import "./index.css";

const pageStatus = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE'
};

const JobApplied = () => {
    const navigate = useNavigate();
    const userId = Cookies.get('user_id')
    const jwtToken = Cookies.get('jwt_token')
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [applyJobStatus, setApplyJobStatus] = useState(pageStatus.initial);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      setApplyJobStatus(pageStatus.loading)
        try {
          const response = await fetch(`https://job-portal-server-witx.onrender.com/job/applied/${userId}`,{
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwtToken}`
            },
          });
          const data = await response.json();
          setAppliedJobs(data);
          setApplyJobStatus(pageStatus.success)
        } catch (error) {
          console.error("Error fetching applied jobs:", error);
          setApplyJobStatus(pageStatus.failure)
        }
      };

    fetchAppliedJobs();
  }, [jwtToken, userId]);

  const handleRemoveJob = async (apply_id) => {
    try {
      const response = await fetch(`https://job-portal-server-witx.onrender.com/job/applied/delete/${apply_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`
        },
      });

      if (response.ok) {
        setAppliedJobs(appliedJobs.filter((job) => job.apply_id !== apply_id));
      }
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const formatAppliedDate = (dateString) => {
    const parsedDate = parse(dateString, "dd-MM-yyyy", new Date());
    const daysAgo = Math.floor((new Date() - parsedDate) / (1000 * 60 * 60 * 24));

    if (daysAgo === 0) return "Today";
    if (daysAgo === 1) return "Yesterday";
    if (daysAgo < 7) return `${daysAgo}d ago`;
    if (daysAgo < 30) return `${Math.floor(daysAgo / 7)}w ago`;
    return `${Math.floor(daysAgo / 30)}m ago`;
  };

  const renderAppliedJobPage = () => {
    switch (applyJobStatus) {
      case pageStatus.loading: 
        return <LoaderView />
      case pageStatus.success:
        return (
          <div className="job-applied-container">
            <h2>Applied Jobs</h2>
            {appliedJobs.length === 0 ? (
              <div className="empty-state">
                <p>No applied jobs yet.</p>
                <button className="home-btn" onClick={() => navigate("/")}>
                  Go to Home
                </button>
              </div>
              ) : (
              <div className="apply-job-list">
                {appliedJobs?.map((job) => (
                  <div key={job.apply_id} className="apply-job-card">
                    <img src={job.logo_url} alt="Company Logo" className="company-logo" />
                    <div className="applied-job-details">
                      <h3>{job.job_position}</h3>
                      <p className="company-name">{job.company_name}</p>
                      <p className="applied-date">{formatAppliedDate(job.applied_date)}</p>
                    </div>
                    <div className="applied-buttons-container">
                        <button className="detail-btn" onClick={() => navigate(`/job/details/${job.job_id}`)}>
                            View Details
                        </button>
                        <button className="remove-btn" onClick={() => handleRemoveJob(job.apply_id)}>
                            Remove
                        </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      case pageStatus.failure:
        return <FailureView />
      default:
        return null
    }
  }

  if (!jwtToken){
    navigate('/authentication');
    return;
  }

  return (
    <div className="job-apply-bg">
      <Header />
      <div>{renderAppliedJobPage()}</div>
    </div>
  );
};

export default JobApplied;
