import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./index.css";

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    jobPosition: "",
    salary: "",
    location: "",
    jobDescription: "",
    aboutCompany: "",
    skills: "",
    information: "",
  });

  const userType = Cookies.get('user_type')
  const [message, setMessage] = useState("");
  const isHiringManager = userType === "hiring";
  const jwtToken = Cookies.get("jwt_token"); 

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`http://localhost:3005/api/jobs/${jobId}`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Error fetching job details");
        setJob(data);
        setFormData({
          jobPosition: data.job_position,
          salary: data.monthly_salary,
          location: data.location,
          jobDescription: data.job_description,
          aboutCompany: data.about_company,
          skills: data.skills_required,
          information: data.additional_info,
        });
      } catch (error) {
        setMessage("Error fetching job details");
        setTimeout(() => setMessage(""), 1000);
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
        const response = await fetch(`http://localhost:3005/api/jobs/${jobId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwtToken}`,
            },
            body: JSON.stringify({
                job_position: formData.jobPosition,
                monthly_salary: formData.salary,
                location: formData.location,
                job_description: formData.jobDescription,
                about_company: formData.aboutCompany,
                skills_required: formData.skills,
                additional_info: formData.information,
            }),
        });

        const data = await response.json(); // Parse the response JSON

        if (!response.ok) {
            throw new Error(data.error || "Error updating job");
        }

        setMessage("Job updated successfully");
        setTimeout(() => setMessage(""), 1000);
        setIsEditing(false);
        window.location.reload(); // Reload the page to reflect changes
    } catch (error) {
        setMessage(error.message || "Error updating job");
        setTimeout(() => setMessage(""), 1000);
    }
};

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3005/api/jobs/${jobId}`, {
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



  if (!job) {
    return <div>Loading job details...</div>; 
  }
  

  return (
    <div className="details-bg">
      <div className="job-container">
        <header className="job-header">
          <h2>JobStation</h2>
          <div className="auth-buttons">
            {jwtToken ? (
                <>
                  <button className="logout-btn" onClick={() => {
                    Cookies.remove('jwt_token')
                    navigate('/authentication')
                  }}>Logout</button>
                </>
              ) : (
                <>
                  <button className="login-btn" onClick={() => navigate('/authentication')}>Login</button>
                </>
              )}
          </div>
        </header>

        {message && <div className="message">{message}</div>}

        <div className="job-banner">
          <p>{job.job_position}</p>
        </div>

        <div className="job-details">
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
                  name="salary"
                  value={formData.salary}
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
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                />
              </div>
              <div className="input-container">
                <label>Additional Information</label>
                <textarea
                  name="information"
                  value={formData.information}
                  onChange={handleChange}
                />
              </div>
              <button type="submit" className="update-job-btn">
                Update Job
              </button>
              <button type="button" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </form>
          ) : (
            <>
              <h3>{job.job_position}</h3>
              <p className="location">{job.location}</p>
              <p className="salary">₹ {job.monthly_salary}/month</p>
              <section className="about-company">
                <h4>About Company</h4>
                <p>{job.about_company}</p>
              </section>
              <section className="about-job">
                <h4>About the Job/Internship</h4>
                <p>{job.job_description}</p>
              </section>
              <section className="skills">
                <h4>Skills Required</h4>
                <p>{job.skills_required}</p>
              </section>
              <section className="additional-info">
                <h4>Additional Information</h4>
                <p>{job.additional_info}</p>
              </section>
              {isHiringManager ? (
                <>
                  <button className="edit-job-btn" onClick={() => setIsEditing(true)}>
                    Edit Job
                  </button>
                  <button className="delete-job-btn" onClick={handleDelete}>
                    Delete Job
                  </button>
                </>
              ) : (
                <button
                  className="apply-job-btn"
                  onClick={() => {
                    setMessage(jwtToken ? "Applied Successfully": "Please Login");
                    setTimeout(() => {
                      setMessage("");
                    }, 2000);}}
                >
                  Apply for Job
                </button>
              )}
            </>
          )}
        </div>
      </div>

    </div>
  );
};

export default JobDetails;