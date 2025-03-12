import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { parse, differenceInDays, format  } from "date-fns";
import { LuDot } from "react-icons/lu";
import Cookies from "js-cookie";
import Header from "../Header";
import { FailureView, LoaderView } from "../LoadingFailure";
import "./index.css";

const pageStatus = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE'
};

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",  
    logoUrl: "",  
    jobPosition: "",  
    monthlySalary: "",  
    jobType: "",  
    remoteOffice: "",  
    location: "",  
    jobDescription: "",  
    aboutCompany: "",  
    skillsRequired: "",  
    additionalInfo: ""
  });
  const [jobDetailPageStatus, setJobDetailPageStatus] = useState(pageStatus.initial)

  const jwtToken = Cookies.get("jwt_token");
  const userType = Cookies.get('user_type');
  const userId = Cookies.get('user_id');

  const [message, setMessage] = useState("");
  const isHiringManager = userType === "hiring";

  useEffect(() => {
    const fetchJob = async () => {
      setJobDetailPageStatus(pageStatus.loading)
      try {
        const response = await fetch(`https://job-portal-server-witx.onrender.com/job/get?jobId=${jobId}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Error fetching job details");
           
        setJob({
          jobId: data.job_id,
          userId: data.user_id,
          companyName: data.company_name,
          logoUrl: data.logo_url,
          jobPosition: data.job_position,
          monthlySalary: data.monthly_salary,
          jobType: data.job_type,
          remoteOffice: data.remote_office,
          location: data.location,
          jobDescription: data.job_description,
          aboutCompany: data.about_company,
          skillsRequired: data.skills_required,
          additionalInfo: data.additional_info,
          jobPosted: data.job_posted
        });

        setFormData({
          companyName: data.company_name,
          logoUrl: data.logo_url,
          jobPosition: data.job_position,
          monthlySalary: data.monthly_salary,
          jobType: data.job_type,
          remoteOffice: data.remote_office,
          location: data.location,
          jobDescription: data.job_description,
          aboutCompany: data.about_company,
          skillsRequired: data.skills_required,
          additionalInfo: data.additional_info
        });
        setJobDetailPageStatus(pageStatus.success)
      } catch (error) {
        console.log(error.message);
        setJobDetailPageStatus(pageStatus.failure)
      }
    };
    fetchJob();
  }, [jobId, jwtToken]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://job-portal-server-witx.onrender.com/job/update/${jobId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          job_position: formData.jobPosition,
          company_name: formData.companyName,
          logo_url: formData.logoUrl,
          monthly_salary: formData.monthlySalary,
          job_type: formData.jobType,
          remote_office: formData.remoteOffice,
          location: formData.location,
          job_description: formData.jobDescription,
          about_company: formData.aboutCompany,
          skills_required: formData.skillsRequired,
          additional_info: formData.additionalInfo
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error updating job");

      setMessage("Job updated successfully");
      setTimeout(() => setMessage(""), 1000);
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      setMessage(error.message || "Error updating job");
      setTimeout(() => setMessage(""), 1000);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`https://job-portal-server-witx.onrender.com/job/delete/${jobId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      if (!response.ok) throw new Error("Error deleting job");
      
      setMessage("Job deleted successfully");
      setTimeout(() => setMessage(""), 1000);
      navigate("/");
    } catch (error) {
      setMessage("Error deleting job");
      setTimeout(() => setMessage(""), 1000);
    }
  };

  const handleAppliedJobs = async () => {
    try {
      const appliedJob = {
        user_id: userId,
        job_id: job.jobId,
        company_name: job.companyName,
        logo_url: job.logoUrl,
        job_position: job.jobPosition,
        applied_date: format(new Date(), "dd-MM-yyyy"),
      };
  
      const response = await fetch("https://job-portal-server-witx.onrender.com/job/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`
        },
        body: JSON.stringify(appliedJob),
      });
  
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setTimeout(() => setMessage(""), 1000);
      } else {
        setMessage(data.error);
        setTimeout(() => setMessage(""), 1000);
      }
    } catch (error) {
      setMessage("Error applying for job");
    }
  };
  

  const formatJobPostedDate = (dateString) => {
    const parsedDate = parse(dateString, "dd-MM-yyyy", new Date());
    const daysAgo = differenceInDays(new Date(), parsedDate);

    if (daysAgo === 0) return "today";
    if (daysAgo === 1) return "yesterday";
    if (daysAgo < 7) return `${daysAgo}d ago`;
    if (daysAgo < 30) return `${Math.floor(daysAgo / 7)}w ago`;
    return `${Math.floor(daysAgo / 30)}m ago`;
  };

  const renderJobDetailsPage = () => {
    switch (jobDetailPageStatus) {
      case pageStatus.loading: 
        return <LoaderView />;
      case pageStatus.success:
        return(
          <div className="job-details">
            <div className="job-banner">
              <h3>{job.jobPosition}</h3>
            </div>
            {isEditing ? (
              <form onSubmit={handleUpdate}>
                <div className="input-container">
                  <label>Job Position</label>
                  <input
                    type="text"
                    name="jobPosition"
                    value={formData.jobPosition}
                    onChange={handleChange}
                  />
                </div>
                <div className="input-container">
                  <label>Monthly Salary</label>
                  <input
                    type="text"
                    name="monthlySalary"
                    value={formData.monthlySalary}
                    onChange={handleChange}
                  />
                </div>
                <div className="input-container">
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
                <div className="input-container">
                  <label>Job Type</label>
                  <input
                    type="text"
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleChange}
                  />
                </div>
                <div className="input-container">
                  <label>Remote/Office</label>
                  <input
                    type="text"
                    name="remoteOffice"
                    value={formData.remoteOffice}
                    onChange={handleChange}
                  />
                </div>
                <div className="input-container">
                  <label>Job Description</label>
                  <textarea
                    name="jobDescription"
                    value={formData.jobDescription}
                    onChange={handleChange}
                  />
                </div>
                <div className="input-container">
                  <label>About Company</label>
                  <textarea
                    name="aboutCompany"
                    value={formData.aboutCompany}
                    onChange={handleChange}
                  />
                </div>
                <div className="input-container">
                  <label>Skills Required</label>
                  <input
                    type="text"
                    name="skillsRequired"
                    value={formData.skillsRequired}
                    onChange={handleChange}
                  />
                </div>
                <div className="input-container">
                  <label>Additional Information</label>
                  <textarea
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleChange}
                  />
                </div>
                <div className="job-details-action">
                <button type="submit" className="update-job-btn" onClick={handleUpdate}>
                  Update Job
                </button>
                <button type="button"  className="cancel-job-btn" onClick={() => setIsEditing(false)}>
                  Cancel
                </button></div>
              </form>
            ) : (
              <div>
                <p className="date-remote">{formatJobPostedDate(job.jobPosted)}<LuDot size={25}/>{job.remoteOffice} </p>
                <div className="company-details">
                  <h3 className="job-role">{job.jobPosition}</h3>
                  <img src={job.logoUrl} alt='company logo' />
                </div>
                <p className="location">{job.location}</p>
                <p className="salary">₹ {job.monthlySalary}/month</p>
                <section className="about-company">
                  <h4>About Company</h4>
                  <h6>{job.companyName}</h6>
                  <p>{job.aboutCompany}</p>
                </section>
                <section className="about-job">
                  <h4>About the Job/Internship</h4>
                  <p>{job.jobDescription}</p>
                </section>
                <section>
                  <h4>Skills Required</h4>
                  <ul className="skills">
                    {job.skillsRequired.split(',').map(skill => <li key={skill}>{skill}</li>)}
                  </ul>
                </section>
                <section className="additional-info">
                  <h4>Additional Information</h4>
                  <p>{job.additionalInfo}</p>
                </section>
                {isHiringManager && job.userId === userId ? (
                  <div className="job-details-action">
                    <button className="edit-job-btn" onClick={() => setIsEditing(true)}>
                      Edit Job
                    </button>
                    <button className="delete-job-btn" onClick={handleDelete}>
                      Delete Job
                    </button>
                  </div>
                ) : (
                  <button
                    className={jwtToken ? "apply-job-btn" : "disable-btn"} disabled={!jwtToken}
                    onClick={handleAppliedJobs}>
                    Apply for Job
                  </button>
                )}
                {message && <div className="message">{message}</div>}
                {!jwtToken && <p>Please Login</p>}
              </div>
            )}
          </div>);
      case pageStatus.failure: 
        return <FailureView />;
      default:
        return null;
    }
  }

  return (
    <div className="job-detail-container">
      <Header/>
      <>{renderJobDetailsPage()}</>
    </div>
  );
};

export default JobDetails;
