import { Component } from 'react'
import Cookies from 'js-cookie'
import { Navigate, useNavigate } from 'react-router-dom'  // Added useNavigate import
import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    errorMsg: '',
    showErrorMsg: false,
  }

  onSuccessLogin = jwtToken => {
    Cookies.set('jwt_token', jwtToken, { expires: 30 })
    const { navigate } = this.props
    navigate('/', { replace: true })
  }

  onFailureLogin = errorMsg => {
    this.setState({ errorMsg, showErrorMsg: true })
  }

  onSubmitForm = async event => {
    event.preventDefault()
    let { username, password } = this.state

    if (username.toLowerCase().trim() === 'vikas') username = 'rahul'
    if (password === 'vikas@2024') password = 'rahul@2021'

    const userDetails = { username, password }
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    try {
      const response = await fetch('https://apis.ccbp.in/login', options)
      const data = await response.json()

      if (response.ok) {
        this.onSuccessLogin(data.jwt_token)
      } else {
        this.onFailureLogin(data.error_msg)
      }
    } catch (error) {
      this.onFailureLogin('Network error. Please try again.')
    }
  }

  updateUsername = event => this.setState({ username: event.target.value })

  updatePassword = event => this.setState({ password: event.target.value })

  renderUsernameField = () => (
    <div className="input-field-container">
      <label htmlFor="username" className="login-input-label">
        USERNAME
      </label>
      <input
        type="text"
        value={this.state.username}
        className="login-input-field"
        placeholder="vikas"
        id="username"
        onChange={this.updateUsername}
      />
    </div>
  )

  renderPasswordField = () => (
    <div className="input-field-container">
      <label htmlFor="password" className="login-input-label">
        PASSWORD
      </label>
      <input
        type="password"
        value={this.state.password}
        className="login-input-field"
        placeholder="vikas@2024"
        id="password"
        onChange={this.updatePassword}
      />
    </div>
  )

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken) {
      return <Navigate to="/" replace />
    }

    const { errorMsg, showErrorMsg } = this.state
    return (
      <div className="login-container">
        <form className="login-form" onSubmit={this.onSubmitForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo-login-form"
          />
          {this.renderUsernameField()}
          {this.renderPasswordField()}
          <div>
            <button type="submit" className="login-button">
              Login
            </button>
            {showErrorMsg && <p className="error-msg">*{errorMsg}</p>}
          </div>
        </form>
      </div>
    )
  }
}

// Wrap with withRouter replacement for v6
export default function(props) {
  const navigate = useNavigate()
  return <Login {...props} navigate={navigate} />
}