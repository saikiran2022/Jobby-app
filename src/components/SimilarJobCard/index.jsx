import './index.css'

const SimilarJobCard = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = jobDetails

  return (
    <li className="similar-job-card">
      <div className="logo-title-container-card">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
          className="company-logo-card"
        />
        <div className="title-rating-container-card">
          <h1 className="job-title-card">{title}</h1>
          <div className="rating-container-card">
            <span role="img" aria-label="star" className="star-icon-card">⭐</span>
            <p className="rating-number-card">{rating}</p>
          </div>
        </div>
      </div>
      <h1 className="description-heading-card">Description</h1>
      <p className="job-description-card">{jobDescription}</p>
      <div className="location-package-container-card">
        <div className="icon-type-container-card">
          <span role="img" aria-label="location" className="type-icon">📍</span>
          <p className="type-text">{location}</p>
        </div>
        <div className="icon-type-container-card">
          <span role="img" aria-label="job type" className="type-icon">💼</span>
          <p className="type-text">{employmentType}</p>
        </div>
      </div>
    </li>
  )
}

export default SimilarJobCard