import { Component } from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'
import ProfileDetails from '../ProfileDetails'
import FiltersGroup from '../FiltersGroup'
import JobCard from '../JobCard'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    profileDetails: {},
    profileApiStatus: apiStatusConstants.initial,
    jobsList: [],
    jobsApiStatus: apiStatusConstants.initial,
    searchInput: '',
    activeSalaryRangeId: '',
    employmentTypesChecked: [],
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobs()
  }

  updateEmploymentTypesChecked = typeId => {
    const { employmentTypesChecked } = this.state
    let updatedList = employmentTypesChecked.includes(typeId)
      ? employmentTypesChecked.filter(eachType => eachType !== typeId)
      : [...employmentTypesChecked, typeId]
    this.setState({ employmentTypesChecked: updatedList }, this.getJobs)
  }

  updateSalaryRangeId = activeSalaryRangeId => 
    this.setState({ activeSalaryRangeId }, this.getJobs)

  getJobs = async () => {
    this.setState({ jobsApiStatus: apiStatusConstants.inProgress })
    const { activeSalaryRangeId, employmentTypesChecked, searchInput } = this.state
    const jwtToken = Cookies.get('jwt_token')
    
    try {
      const response = await fetch(
        `https://apis.ccbp.in/jobs?employment_type=${employmentTypesChecked.join(',')}&minimum_package=${activeSalaryRangeId}&search=${searchInput}`,
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
          method: 'GET',
        }
      )
      const data = await response.json()
      if (response.ok) {
        this.setState({
          jobsList: data.jobs.map(job => ({
            companyLogoUrl: job.company_logo_url,
            employmentType: job.employment_type,
            id: job.id,
            jobDescription: job.job_description,
            location: job.location,
            packagePerAnnum: job.package_per_annum,
            rating: job.rating,
            title: job.title,
          })),
          jobsApiStatus: apiStatusConstants.success,
        })
      } else {
        this.setState({ jobsApiStatus: apiStatusConstants.failure })
      }
    } catch {
      this.setState({ jobsApiStatus: apiStatusConstants.failure })
    }
  }

  getProfileDetails = async () => {
    this.setState({ profileApiStatus: apiStatusConstants.inProgress })
    const jwtToken = Cookies.get('jwt_token')
    
    try {
      const response = await fetch('https://apis.ccbp.in/profile', {
        headers: { Authorization: `Bearer ${jwtToken}` },
        method: 'GET',
      })
      const data = await response.json()
      if (response.ok) {
        this.setState({
          profileDetails: {
            name: data.profile_details.name,
            profileImageUrl: data.profile_details.profile_image_url,
            shortBio: data.profile_details.short_bio,
          },
          profileApiStatus: apiStatusConstants.success,
        })
      } else {
        this.setState({ profileApiStatus: apiStatusConstants.failure })
      }
    } catch {
      this.setState({ profileApiStatus: apiStatusConstants.failure })
    }
  }

  renderSearchBar = (searchBarID) => (
    <div className="search-bar" id={searchBarID}>
      <input
        className="search-input"
        type="search"
        placeholder="Search"
        value={this.state.searchInput}
        onChange={e => this.setState({ searchInput: e.target.value })}
      />
      <button
        className="search-button"
        type="button"
        onClick={this.getJobs}
      >
        Search
      </button>
    </div>
  )

  renderSideBar = () => (
    <div className="side-bar">
      {this.renderSearchBar('smallSearchBar')}
      <ProfileDetails
        profileDetails={this.state.profileDetails}
        profileApiStatus={this.state.profileApiStatus}
        getProfileDetails={this.getProfileDetails}
      />
      <hr className="separator" />
      <FiltersGroup
        updateSalaryRangeId={this.updateSalaryRangeId}
        activeSalaryRangeId={this.state.activeSalaryRangeId}
        updateEmploymentTypesChecked={this.updateEmploymentTypesChecked}
        employmentTypesChecked={this.state.employmentTypesChecked}
      />
    </div>
  )

  renderNoJobsView = () => (
    <div className="no-jobs-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="no-jobs-image"
      />
      <h1>No Jobs Found</h1>
      <p>We could not find any jobs. Try other filters.</p>
    </div>
  )

  renderJobsList = () => (
    this.state.jobsList.length > 0 ? (
      <ul className="jobs-list">
        {this.state.jobsList.map(job => (
          <JobCard key={job.id} jobDetails={job} />
        ))}
      </ul>
    ) : (
      this.renderNoJobsView()
    )
  )

  renderLoader = () => (
    <div className="loader-container">
      <div className="spinner"></div>
    </div>
  )

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button onClick={this.getJobs}>Retry</button>
    </div>
  )

  renderJobsContent = () => {
    switch (this.state.jobsApiStatus) {
      case apiStatusConstants.inProgress: return this.renderLoader()
      case apiStatusConstants.success: return this.renderJobsList()
      case apiStatusConstants.failure: return this.renderFailureView()
      default: return null
    }
  }

  render() {
    return (
      <div className="jobs-page-container">
        <Header />
        <div className="jobs-page">
          {this.renderSideBar()}
          <div className="jobs-container">
            {this.renderSearchBar('largeSearchBar')}
            {this.renderJobsContent()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs