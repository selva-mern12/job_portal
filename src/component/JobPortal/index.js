import React, { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import Cookies from 'js-cookie'
import "./index.css";

const JobListing = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('')
  const jwtToken = Cookies.get('jwt_token')

  const [filters, setFilters] = useState({
    skills: [],
    location: "",
    jobTitle: "",
    minSalary: "",
    maxSalary: "",
  });

  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("http://localhost:3005/api/jobs");
        const data = await response.json();
        if (!response.ok) throw new Error("Error fetching jobs");
        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    Cookies.set('user_type', userType)
  },[userType])

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
    setFilters((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const applyFilters = () => {
    return jobs.filter((job) => {
      const minSalaryFilter = filters.minSalary ? job.monthly_salary >= Number(filters.minSalary) : true;
      const maxSalaryFilter = filters.maxSalary ? job.monthly_salary <= Number(filters.maxSalary) : true;
      return (
        (filters.skills.length === 0 || filters.skills.every((s) => job.skills_required.includes(s))) &&
        (filters.location === "" || job.location.toLowerCase().includes(filters.location.toLowerCase())) &&
        (filters.jobTitle === "" || job.job_position.toLowerCase().includes(filters.jobTitle.toLowerCase())) &&
        minSalaryFilter &&
        maxSalaryFilter
      );
    });
  };

  const filteredJobs = applyFilters();
  
  const isHiringManager = userType === "hiring";



  return (
    <div className="job-listing-container">
      <header className="job-header">
        <h2>JobStation</h2>
        <div className="auth-buttons">
          {jwtToken ? (
            <>
              <button onClick={() => setUserType('hiring')}>Job Hiring</button>
              <button onClick={() => setUserType('seeker')}>Job Seeker</button>
              {isHiringManager && <button onClick={() => navigate('/job/add')}>Add Job</button>}
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

      <div className="filter-container">
        <input
          type="text"
          placeholder="Type any job title"
          value={filters.jobTitle}
          onChange={(e) => handleFilterChange("jobTitle", e.target.value)}
        />
        <div className="skills-filter">
          <select onChange={(e) => handleSkillAdd(e.target.value)}>
            <option value="">Skills</option>
            <option value="Frontend">Frontend</option>
            <option value="CSS">CSS</option>
            <option value="JavaScript">JavaScript</option>
            <option value="HTML">HTML</option>
            <option value="WordPress">WordPress</option>
            <option value="Node.js">Node.js</option>
            <option value="Express">Express</option>
            <option value="MongoDB">MongoDB</option>
            <option value="AWS">AWS</option>
            <option value="Figma">Figma</option>
            <option value="Adobe XD">Adobe XD</option>
            <option value="Sketch">Sketch</option>
            <option value="Python">Python</option>
            <option value="SQL">SQL</option>
            <option value="Tableau">Tableau</option>
          </select>
          {filters.skills.map((skill) => (
            <span key={skill} className="skill-tag">
              {skill} <button onClick={() => handleSkillRemove(skill)}>X</button>
            </span>
          ))}
        </div>
        <input
          type="text"
          placeholder="Location"
          value={filters.location}
          onChange={(e) => handleFilterChange("location", e.target.value)}
        />
        <input
          type="number"
          placeholder="Min Salary"
          value={filters.minSalary}
          onChange={(e) => handleFilterChange("minSalary", e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Salary"
          value={filters.maxSalary}
          onChange={(e) => handleFilterChange("maxSalary", e.target.value)}
        />
        <button className="filter-btn">Apply Filter</button>
        <button className="clear-btn" onClick={() => setFilters({ skills: [], location: "", jobTitle: "", minSalary: "", maxSalary: "" })}>
          Clear
        </button>
        {isHiringManager && <button className="add-btn">+ Add Job</button>}
      </div>

      <div className="job-list">
        {filteredJobs.map((job) => (
          <div key={job.id} className="job-card">
            <h3>{job.job_position}</h3>
            <p>{job.location}</p>
            <p>₹ {job.monthly_salary}/month</p>
            <div className="job-tags">
              {job.skills_required.split(",").map((skill) => (
                <span key={skill} className="job-skill">{skill.trim()}</span>
              ))}
            </div>
            <button className="details-btn" onClick={() => navigate(`/job/details/${job.id}`)}>View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobListing;

