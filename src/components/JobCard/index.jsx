import { Link } from 'react-router-dom'
import './index.css'

const JobCard = props => {
  const { jobDetails } = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
    id,
  } = jobDetails

  return (
    <li className="job-card">
      <Link to={`/jobs/${id}`} className="job-card-link">
        <div className="logo-title-container">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />
          <div className="title-rating-container">
            <h1 className="job-title">{title}</h1>
            <div className="rating-container">
              <span className="star-icon" role="img" aria-label="rating">⭐</span>
              <p className="rating-number">{rating}</p>
            </div>
          </div>
        </div>
        <div className="job-meta-container">
          <div className="meta-item">
            <span className="meta-icon" role="img" aria-label="location">📍</span>
            <p className="meta-text">{location}</p>
          </div>
          <div className="meta-item">
            <span className="meta-icon" role="img" aria-label="employment type">💼</span>
            <p className="meta-text">{employmentType}</p>
          </div>
          <p className="package-text">{packagePerAnnum}</p>
        </div>
        <hr className="separator" />
        <h2 className="description-heading">Description</h2>
        <p className="job-description">{jobDescription}</p>
      </Link>
    </li>
  )
}

export default JobCard