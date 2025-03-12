import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HiUsers } from "react-icons/hi";
import { FaRupeeSign } from "react-icons/fa";
import { MdLocationPin } from "react-icons/md";
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

const JobListing = () => {
  const navigate = useNavigate();
  const userTypes = Cookies.get('user_type');
  const [userType] = useState(userTypes);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [jobPortalPageStatus, setJobPortalPageStatus] = useState(pageStatus.initial);

  const [filters, setFilters] = useState({
    skills: [],
    location: "",
    jobTitle: "",
    minSalary: "",
    maxSalary: "",
  });

  const [jobs, setJobs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setJobPortalPageStatus(pageStatus.loading);
        const response = await fetch(`https://job-portal-server-witx.onrender.com/job/get?page=${currentPage}`);
        const data = await response.json();
        if (!response.ok) {
          setJobPortalPageStatus(pageStatus.failure);
        }
        setJobs(data.jobs);
        setTotalPages(data.totalPages);
        setJobPortalPageStatus(pageStatus.success);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setJobPortalPageStatus(pageStatus.failure);
      }
    };
    fetchJobs();
  }, [currentPage]);

  useEffect(() => {
    Cookies.set('user_type', userType);
  }, [userType]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSkillAdd = (skill) => {
    setFilters((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill) ? prev.skills : [...prev.skills, skill],
    }));
  };

  const handleSkillRemove = (skill) => {
    setSelectedSkill(skill);
    setFilters((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
    setSelectedSkill('');
  };

  const applyFilters = () => {
    return jobs.filter((job) => {
      const minSalaryFilter = filters.minSalary ? job.monthly_salary >= Number(filters.minSalary) : true;
      const maxSalaryFilter = filters.maxSalary ? job.monthly_salary <= Number(filters.maxSalary) : true;
      return (
        (filters.skills.length === 0 || filters.skills.some((s) => job.skills_required.includes(s))) &&
        (filters.location === "" || job.location.toLowerCase().includes(filters.location.toLowerCase())) &&
        (filters.jobTitle === "" || job.job_position.toLowerCase().includes(filters.jobTitle.toLowerCase())) &&
        minSalaryFilter &&
        maxSalaryFilter
      );
    });
  };

  const filteredJobs = applyFilters();
  filteredJobs.sort((a, b) => new Date(b.job_posted) - new Date(a.job_posted));

  const skillsList = ['Frontend', 'React', 'CSS', 'JavaScript', 'HTML', 'WordPress', 'Node.js', 'Express', 'MongoDB', 'AWS', 'Figma', 'Adobe XD', 'Sketch', 'Python', 'SQL', 'Tableau'];

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage > 3) pages.push(1, "...");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      )
        pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...", totalPages);
    }
    return pages;
  };

  const renderPagination = () => (
    <div className="pagination-container">
      <div className="pagination">
      <button
        className={`page-btn ${currentPage === 1 ? "disabled" : ""}`}
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      {getPageNumbers().map((num, index) =>
        typeof num === "number" ? (
          <button
            key={index}
            className={`page-number ${currentPage === num ? "active" : ""}`}
            onClick={() => setCurrentPage(num)}
          >
            {num}
          </button>
        ) : (
          <span key={index} className="dots">
            {num}
          </span>
        )
      )}
      <button
        className={`page-btn ${currentPage === totalPages ? "disabled" : ""}`}
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
    </div>
  );

  const renderJobPortalPage = () => {
    switch (jobPortalPageStatus) {
      case pageStatus.loading:
        return <LoaderView />;
      case pageStatus.success:
        return (
          <>
            <div className="filter-container">
              <input type="text" placeholder="Type any job title" value={filters.jobTitle} onChange={(e) => handleFilterChange("jobTitle", e.target.value)} />
              <div className="skills-filter">
                <select onChange={(e) => handleSkillAdd(e.target.value)} value={selectedSkill}>
                  <option value="" disabled>Skills</option>
                  {skillsList.map(skill => <option value={skill} key={skill}>{skill}</option>)}
                </select>
              </div>
              <input type="text" placeholder="Location" value={filters.location} onChange={(e) => handleFilterChange("location", e.target.value)} />
              <input type="number" placeholder="Min Salary" value={filters.minSalary} onChange={(e) => handleFilterChange("minSalary", e.target.value)} />
              <input type="number" placeholder="Max Salary" value={filters.maxSalary} onChange={(e) => handleFilterChange("maxSalary", e.target.value)} />
              <div className="filter-button-container">
                {filters.skills.map((skill) => (
                  <span key={skill} className="skill-tag">
                    {skill} <button className="skill-remove" onClick={() => handleSkillRemove(skill)}>X</button>
                  </span>
                ))}
                <button className="clear-btn" onClick={() => setFilters({ skills: [], location: "", jobTitle: "", minSalary: "", maxSalary: "" })}>
                  Clear
                </button>
              </div>
            </div>
            <div className="job-list">
              {filteredJobs?.length > 0 ? (
                filteredJobs.map((job) => (
                  <div key={job.job_id} className="job-card">
                    <img src={job.logo_url} alt='company logo' className="cmpy-logo-lg" />
                    <div style={{ flexGrow: '15', marginLeft: '20px' }}>
                      <h3 className="job-title">{job.job_position}<img src={job.logo_url} alt='company logo' className="cmpy-logo-sm" />
                      </h3>
                      <div className="user-rupee-locate-container">
                        <p><HiUsers /> 11-50</p>
                        <p><FaRupeeSign /> {job.monthly_salary}</p>
                        <p><MdLocationPin /> {job.location}</p>
                      </div>
                      <div className="type-remote">
                        <p>{job.job_type}</p>
                        <p>{job.remote_office}</p>
                      </div>
                    </div>
                    <div style={{ flexGrow: '1', textAlign: 'end', alignSelf: 'flex-end'}}>
                      <div className="job-tags">
                        {job.skills_required.split(",").map((skill) => (
                          <span key={skill} className="job-skill">{skill.trim()}</span>
                        ))}
                      </div>
                      <button className="detail-btn" onClick={() => navigate(`/job/details/${job.job_id}`)}>View Details</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-jobs-message">
                  <p>❌ No jobs found. Try different filters.</p>
                </div>
              )}
            </div>
            {renderPagination()}
          </>
        );
      case pageStatus.failure:
        return <FailureView />;
      default:
        return null;
    }
  };

  return (
    <div className="job-listing-container">
      <Header />
      {renderJobPortalPage()}
    </div>
  );
};

export default JobListing;
