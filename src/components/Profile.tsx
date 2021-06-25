import React, { Component } from 'react'
import { User } from '../typings/User'
import { RouteComponentProps } from 'react-router-dom'
import Container from 'react-bootstrap/esm/Container'
import Row from 'react-bootstrap/esm/Row'
import Col from 'react-bootstrap/esm/Col'
import Form from 'react-bootstrap/esm/Form'
import Toast from 'react-bootstrap/esm/Toast'
import { Button } from 'react-bootstrap'
import { isAdmin } from '../lib/helpers'

interface MatchParams {
  id: string
}

interface ProfileState {
  user: User
  successToast: boolean
  errorToast: boolean
}

class Profile extends Component<RouteComponentProps<MatchParams>, ProfileState> {
  state: ProfileState = {
    user: {
      firstName: '',
      lastName: '',
      profilePic: '',
      githubURL: '',
      portfolioURL: '',
      capstoneURL: '',
      linkedinURL: '',
      youtubeURL: '',
      oneLiner: '',
      availableToRelocation: false,
      located: '',
      desiredPosition: '',
      approved: false,
    },
    successToast: false,
    errorToast: false,
  }

  componentDidMount = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_BE_URL + '/students/' + this.props.match.params.id, {
        credentials: 'include',
      })
      if (response.ok) {
        let profile = await response.json()
        this.setState({
          user: {
            ...this.state.user,
            ...profile,
          },
        })
      } else {
        console.log('error')
      }
    } catch (error) {
      console.log(error)
    }
  }

  handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    let formData = new FormData()

    Object.keys(this.state.user).forEach((k) => {
      formData.append(k, (this.state.user as Record<string, any>)[k])
    })

    if (!isAdmin()) {
      formData.delete('youtubeURL')
      formData.delete('oneLiner')
      formData.delete('role')
    }

    try {
      let response = await fetch(process.env.REACT_APP_BE_URL + '/students/' + this.props.match.params.id, {
        credentials: 'include',
        method: 'PUT',
        body: formData,
      })
      if (response.ok) {
        this.setState({
          successToast: true,
        })
      } else {
        this.setState({
          errorToast: true,
        })
      }
    } catch (error) {
      this.setState({
        errorToast: true,
      })
      console.log(error)
    }
  }

  handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.id
    const value = id === 'availableToRelocation' ? e.target.checked : e.target.value

    this.setState({
      user: {
        ...this.state.user,
        [id]: value,
      },
    })
  }

  render() {
    return (
      <Container>
        <h1 className="text-center">Edit your Profile</h1>
        <Row className="justify-content-center my-5">
          <Col>
            <Form onSubmit={this.handleSubmit} className="d-flex flex-column justify-content-center align-items-center">
              <Form.Control
                placeholder="Insert your name"
                id="firstName"
                className="form-field mb-3"
                value={this.state.user.firstName}
                onChange={this.handleInput}
              />
              <Form.Control
                placeholder="Insert your surname"
                id="lastName"
                className="form-field mb-3"
                value={this.state.user.lastName}
                onChange={this.handleInput}
              />
              <Form.Control
                placeholder="Insert your github url"
                id="githubURL"
                className="form-field mb-3"
                value={this.state.user.githubURL}
                onChange={this.handleInput}
              />
              <Form.Control
                placeholder="Insert your linkedin url"
                id="linkedinURL"
                className="form-field mb-3"
                value={this.state.user.linkedinURL}
                onChange={this.handleInput}
              />
              <Form.Control
                placeholder="Insert your portfolio url"
                id="portfolioURL"
                className="form-field mb-3"
                value={this.state.user.portfolioURL}
                onChange={this.handleInput}
              />
              <Form.Control
                placeholder="Insert your capstone url"
                id="capstoneURL"
                className="form-field mb-3"
                value={this.state.user.capstoneURL}
                onChange={this.handleInput}
              />
              {isAdmin() && (
                <Form.Control
                  placeholder="Insert your youtube url"
                  id="youtubeURL"
                  className="form-field mb-3"
                  value={this.state.user.youtubeURL}
                  onChange={this.handleInput}
                />
              )}
              {isAdmin() && (
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Insert the oneLiner"
                  id="oneLiner"
                  value={this.state.user.oneLiner}
                  onChange={this.handleInput}
                  className="form-field mb-3"
                />
              )}
              <Form.Control
                placeholder="Insert your location"
                id="located"
                className="form-field mb-3"
                value={this.state.user.located}
                onChange={this.handleInput}
              />
              <Form.Control
                placeholder="Insert your desired position"
                id="desiredPosition"
                className="form-field mb-3"
                value={this.state.user.desiredPosition}
                onChange={this.handleInput}
              />
              <Form.Check
                type="checkbox"
                id="availableToRelocation"
                label="Available to relocation"
                checked={this.state.user.availableToRelocation}
                onChange={this.handleInput}
              />
              <Form.File
                className="form-field mb-4"
                label={typeof this.state.user.profilePic === 'string' ? this.state.user.profilePic : 'image selected'}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  this.setState({
                    user: {
                      ...this.state.user,
                      profilePic: e.target.files![0],
                    },
                  })
                }}
              />
              <Button type="submit" className="bg-strive-primary">
                SAVE DATA
              </Button>
            </Form>
          </Col>
        </Row>
        <Toast
          show={this.state.successToast}
          onClose={() => {
            this.setState({
              successToast: false,
            })
          }}
          delay={3000}
          autohide
          className="toast-msg toast-success"
        >
          <Toast.Header>
            <strong className="mr-auto">Success!</strong>
          </Toast.Header>
          <Toast.Body>Profile saved</Toast.Body>
        </Toast>
        <Toast
          show={this.state.errorToast}
          onClose={() => {
            this.setState({
              errorToast: false,
            })
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
      </Container>
    )
  }
}

export default Profile
