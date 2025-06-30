import { Component } from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'
import SimilarJobCard from '../SimilarJobCard'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobDetailsApiStatus: apiStatusConstants.initial,
    jobDetails: {},
    similarJobs: [],
  }

  componentDidMount() {
    this.getJobItemDetails()
  }

  getCamelCasedData = data => {
    const jobDetails = data.job_details
    return {
      updatedJobDetails: {
        companyLogoUrl: jobDetails.company_logo_url,
        companyWebsiteUrl: jobDetails.company_website_url,
        employmentType: jobDetails.employment_type,
        jobDescription: jobDetails.job_description,
        location: jobDetails.location,
        rating: jobDetails.rating,
        title: jobDetails.title,
        packagePerAnnum: jobDetails.package_per_annum,
        skills: jobDetails.skills.map(eachSkill => ({
          imageUrl: eachSkill.image_url,
          name: eachSkill.name,
        })),
        lifeAtCompany: {
          description: jobDetails.life_at_company.description,
          imageUrl: jobDetails.life_at_company.image_url,
        },
      },
      similarJobs: data.similar_jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
    }
  }

  getJobItemDetails = async () => {
    this.setState({ jobDetailsApiStatus: apiStatusConstants.inProgress })
    const { match } = this.props
    const jwtToken = Cookies.get('jwt_token')

    try {
      const response = await fetch(
        `https://apis.ccbp.in/jobs/${match.params.id}`,
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
          method: 'GET',
        }
      )
      const data = await response.json()
      if (response.ok) {
        const { updatedJobDetails, similarJobs } = this.getCamelCasedData(data)
        this.setState({
          jobDetails: updatedJobDetails,
          similarJobs,
          jobDetailsApiStatus: apiStatusConstants.success,
        })
      } else {
        this.setState({ jobDetailsApiStatus: apiStatusConstants.failure })
      }
    } catch {
      this.setState({ jobDetailsApiStatus: apiStatusConstants.failure })
    }
  }

  renderLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <div className="spinner"></div>
    </div>
  )

  renderApiFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button onClick={this.getJobItemDetails}>Retry</button>
    </div>
  )

  renderJobDetails = () => {
    const { jobDetails, similarJobs } = this.state
    const {
      companyLogoUrl,
      employmentType,
      jobDescription,
      location,
      rating,
      title,
      packagePerAnnum,
      companyWebsiteUrl,
      skills,
      lifeAtCompany,
    } = jobDetails

    return (
      <div className="job-details-container">
        <div className="job-card">
          <div className="job-header">
            <img src={companyLogoUrl} alt="company logo" />
            <div>
              <h2>{title}</h2>
              <div className="rating">
                <span>★</span> {rating}
              </div>
            </div>
          </div>
          <div className="job-meta">
            <div>
              <span>📍 {location}</span>
              <span>💼 {employmentType}</span>
            </div>
            <div>{packagePerAnnum}</div>
          </div>
          <hr />
          <div className="description-header">
            <h3>Description</h3>
            <a href={companyWebsiteUrl} className="visit-link">
              Visit ↗
            </a>
          </div>
          <p>{jobDescription}</p>
          
          <h3>Skills</h3>
          <div className="skills-list">
            {skills.map(skill => (
              <div key={skill.name} className="skill-item">
                <img src={skill.imageUrl} alt={skill.name} />
                <span>{skill.name}</span>
              </div>
            ))}
          </div>
          
          <h3>Life at Company</h3>
          <div className="life-at-company">
            <p>{lifeAtCompany.description}</p>
            <img src={lifeAtCompany.imageUrl} alt="Life at company" />
          </div>
        </div>

        <h2 className="similar-jobs-title">Similar Jobs</h2>
        <div className="similar-jobs">
          {similarJobs.map(job => (
            <SimilarJobCard key={job.id} jobDetails={job} />
          ))}
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="job-details-page">
        <Header />
        {(() => {
          switch (this.state.jobDetailsApiStatus) {
            case apiStatusConstants.inProgress: return this.renderLoaderView()
            case apiStatusConstants.success: return this.renderJobDetails()
            case apiStatusConstants.failure: return this.renderApiFailureView()
            default: return null
          }
        })()}
      </div>
    )
  }
}

export default JobItemDetails