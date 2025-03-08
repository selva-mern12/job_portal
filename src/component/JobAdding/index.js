import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./index.css";

const JobAdding = () => {
  
  const jwtToken = Cookies.get("jwt_token"); 
  const [formData, setFormData] = useState({
    companyName: "",
    logoUrl: "",
    jobPosition: "",
    salary: "",
    jobType: "",
    remote: "",
    location: "",
    jobDescription: "",
    aboutCompany: "",
    skills: "",
    information: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3005/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`, 
        },
        body: JSON.stringify({
          company_name: formData.companyName,
          logo_url: formData.logoUrl,
          job_position: formData.jobPosition,
          monthly_salary: formData.salary,
          job_type: formData.jobType,
          remote_office: formData.remote,
          location: formData.location,
          job_description: formData.jobDescription,
          about_company: formData.aboutCompany,
          skills_required: formData.skills,
          additional_info: formData.information,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to post job");
      }

      const data = await response.json();
      console.log("Job Posted:", data);

      setFormData({
        companyName: "",
        logoUrl: "",
        jobPosition: "",
        salary: "",
        jobType: "",
        remote: "",
        location: "",
        jobDescription: "",
        aboutCompany: "",
        skills: "",
        information: "",
      });
    } catch (error) {
      console.error("Error posting job:", error);
    }
  };

  if (!jwtToken) {
    return <Navigate to="/authentication" />;
  }
  

  return (
    <div className="job-adding-container">
      <div className="job-image-section" />
      <div className="job-form-section">
        <h2 className="form-title">Add Job Description</h2>
        <form onSubmit={handleSubmit} className="job-form">
          <div className="input-container">
            <label htmlFor="companyName" className="form-label">Company Name</label>
            <input id="companyName" className="form-input" type="text" name="companyName" placeholder="Enter your company name" value={formData.companyName} onChange={handleChange} />
          </div>
          <div className="input-container">
            <label htmlFor="logoUrl" className="form-label">Add Logo URL</label>
            <input id="logoUrl" className="form-input" type="text" name="logoUrl" placeholder="Enter the link" value={formData.logoUrl} onChange={handleChange} />
          </div>
          <div className="input-container">
            <label htmlFor="jobPosition" className="form-label">Job Position</label>
            <input id="jobPosition" className="form-input" type="text" name="jobPosition" placeholder="Enter job position" value={formData.jobPosition} onChange={handleChange} />
          </div>
          <div className="input-container">
            <label htmlFor="salary" className="form-label">Monthly Salary</label>
            <input id="salary" className="form-input" type="text" name="salary" placeholder="Enter amount in rupees" value={formData.salary} onChange={handleChange} />
          </div>
          <div className="input-container">
            <label htmlFor="jobType" className="form-label">Job Type</label>
            <select id="jobType" className="form-select" name="jobType" value={formData.jobType} onChange={handleChange}>
              <option value="">Select</option>
              <option value="Full Time">Full-Time</option>
              <option value="Part Time">Part-Time</option>
              <option value="Part Time">Contract</option>
              <option value="Part Time">Internship</option>
            </select>
          </div>
          <div className="input-container">
            <label htmlFor="remote" className="form-label">Remote/Office</label>
            <select id="remote" className="form-select" name="remote" value={formData.remote} onChange={handleChange}>
              <option value="">Select</option>
              <option value="Remote">Remote</option>
              <option value="Office">Office</option>
            </select>
          </div>
          <div className="input-container">
            <label htmlFor="location" className="form-label">Location</label>
            <input id="location" className="form-input" type="text" name="location" placeholder="Enter location" value={formData.location} onChange={handleChange} />
          </div>
          <div className="input-container">
            <label htmlFor="jobDescription" className="form-label">Job Description</label>
            <textarea id="jobDescription" className="form-textarea" name="jobDescription" placeholder="Type the job description" value={formData.jobDescription} onChange={handleChange} />
          </div>
          <div className="input-container">
            <label htmlFor="aboutCompany" className="form-label">About Company</label>
            <textarea id="aboutCompany" className="form-textarea" name="aboutCompany" placeholder="Type about your company" value={formData.aboutCompany} onChange={handleChange} />
          </div>
          <div className="input-container">
            <label htmlFor="skills" className="form-label">Skills Required</label>
            <input id="skills" className="form-input" type="text" name="skills" placeholder="Enter must-have skills (comma separated)" value={formData.skills} onChange={handleChange} />
          </div>
          <div className="input-container">
            <label htmlFor="information" className="form-label">Additional Information</label>
            <textarea id="information" className="form-textarea" name="information" placeholder="Enter additional information" value={formData.information} onChange={handleChange} />
          </div>
          <div className="form-buttons">
            <button type="button" className="cancel-btn">Cancel</button>
            <button type="submit" className="add-job-btn">+ Add Job</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobAdding;
