import { useState } from 'react'
import { User } from '../typings/User'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Toast from 'react-bootstrap/Toast'
import { isAdmin, isCompany } from '../lib/helpers'
import { RouteComponentProps } from 'react-router-dom'
import { ifError } from 'assert'

interface StudentCardProps extends RouteComponentProps {
  user: User
  getUsers: () => void
  getPersonalProfile: () => void
  connectedStudents: string[]
}

const StudentCard = ({ user, history, getUsers, getPersonalProfile, connectedStudents }: StudentCardProps) => {
  // PUT
  // /students/:id/approve

  // { approved: true }
  // { approved: false }

  const [successToast, setSuccessToast] = useState(false)
  const [errorToast, setErrorToast] = useState(false)

  const approveUser = async (value: boolean) => {
    try {
      let response = await fetch(process.env.REACT_APP_BE_URL + '/students/' + user._id + '/approve', {
        method: 'PUT',
        credentials: 'include',
        body: JSON.stringify({ approved: value }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (response.ok) {
        // alert('ok!')
        // here I want to fetch the students again
        getUsers()
      } else {
        alert('not ok!')
      }
    } catch (error) {
      alert('not ok!')
      console.log(ifError)
    }
  }

  const connectWithUser = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_BE_URL + '/companies/connect', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ _id: user._id }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (response.ok) {
        setSuccessToast(true)
        await getPersonalProfile()
        getUsers()
      } else {
        setErrorToast(true)
      }
    } catch (error) {
      setErrorToast(true)
      console.log(error)
    }
  }

  const alreadyConnected = () => connectedStudents.find((s) => s === user._id)

  return (
    <>
      <Card className="student-card">
        <img src={user.profilePic as string} alt="user-avatar" className="profile-image" />
        <Card.Body>
          <Card.Title>
            <div className="name">{user.firstName?.toUpperCase()}</div>
            <div className="role">{user.desiredPosition || 'Web Developer'}</div>
            <div className="location">
              {user.located}
              {user.availableToRelocation && <>{'// relocation: ' + user.availableToRelocation}</>}
            </div>
          </Card.Title>
          <Card.Text as="div">
            <div className="text">{user.oneLiner}</div>
            <div className="links">
              <>
                <div>
                  {user.linkedinURL && (
                    <a href={user.linkedinURL} target="_blank" rel="noreferrer">
                      <img src="assets/linkedin_icon.png" alt="linkedin logo" />
                    </a>
                  )}
                  {user.portfolioURL && (
                    <a href={user.portfolioURL} target="_blank" rel="noreferrer">
                      <img
                        src="/assets/resume.png"
                        style={{
                          background: '#01ff84',
                          borderRadius: '50%',
                        }}
                        alt="resume logo"
                      />
                    </a>
                  )}
                  {user.githubURL && (
                    <a href={user.githubURL} target="_blank" rel="noreferrer">
                      <img
                        style={{
                          background: '#01ff84',
                          borderRadius: '50%',
                        }}
                        src="/assets/github.png"
                        alt="github logo"
                      />
                    </a>
                  )}
                  {user.capstoneURL && (
                    <a href={user.capstoneURL} target="_blank" rel="noreferrer">
                      <img src="/assets/portfolio_icon.png" alt="portfolio logo" />
                    </a>
                  )}
                  {user.youtubeURL && (
                    <a href={user.youtubeURL} target="_blank" rel="noreferrer">
                      <img src="/assets/play02.png" alt="video" />
                    </a>
                  )}
                </div>
                {isCompany() && !alreadyConnected() && (
                  <button onClick={connectWithUser} className="contact">
                    Connect
                  </button>
                )}
                {isCompany() && alreadyConnected() && <span>Email sent</span>}
              </>
            </div>
            {isAdmin() && (
              <div className="d-flex justify-content-between mt-4">
                <div>
                  <Button variant={user.approved ? 'success' : 'light'} onClick={() => approveUser(true)}>
                    <span>✅</span>
                  </Button>
                  <Button variant={!user.approved ? 'danger' : 'light'} onClick={() => approveUser(false)}>
                    <span>❌</span>
                  </Button>
                </div>
                <div>
                  <Button variant="success" onClick={() => history.push('/profile/' + user._id)}>
                    EDIT PROFILE
                  </Button>
                </div>
              </div>
            )}
          </Card.Text>
        </Card.Body>
      </Card>
      <Toast
        show={successToast}
        onClose={() => {
          setSuccessToast(false)
        }}
        delay={3000}
        autohide
        className="toast-msg toast-success"
      >
        <Toast.Header>
          <strong className="mr-auto">Success!</strong>
        </Toast.Header>
        <Toast.Body>Successfully connected</Toast.Body>
      </Toast>
      <Toast
        show={errorToast}
        onClose={() => {
          setErrorToast(false)
        }}
        delay={3000}
        autohide
        className="toast-msg toast-error"
      >
        <Toast.Header>
          <strong className="mr-auto">Error</strong>
        </Toast.Header>
        <Toast.Body>Something went wrong</Toast.Body>
      </Toast>
    </>
  )
}

export default StudentCard
