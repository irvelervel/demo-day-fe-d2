import { useState } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Toast from 'react-bootstrap/Toast'
import Spinner from 'react-bootstrap/Spinner'
import { Link, RouteComponentProps } from 'react-router-dom'

const Login = ({ history }: RouteComponentProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [successToast, setSuccessToast] = useState(false)
  const [errorToast, setErrorToast] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      email,
      password,
    }

    try {
      let response = await fetch(process.env.REACT_APP_BE_URL + '/users/login', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        // with axios:
        // withCredentials: {true}
      })
      if (response.ok) {
        let user = await response.json()
        setSuccessToast(true)
        localStorage.setItem('demoday_logged_in', user.role)
        setTimeout(() => {
          history.push(user.role === 'Student' ? '/profile/me' : '/')
        }, 2000)
      } else {
        setErrorToast(true)
      }
    } catch (error) {
      setErrorToast(true)
      console.log(error)
    }
  }

  return (
    <Container>
      <h1 className="text-center">Welcome to Demo Day App!</h1>
      <h3 className="text-center">Login with your credentials</h3>
      <Row className="justify-content-center my-5">
        <Col className="d-flex flex-column justify-content-center align-items-center">
          <Form onSubmit={handleRegister} className="credentials-form">
            <Form.Control
              placeholder="Enter email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              className="form-field mb-3"
            />
            <Form.Control
              placeholder="Enter password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              className="form-field mb-3"
            />
            <Button type="submit" className="bg-strive-primary">
              Login
            </Button>
            <div className="mt-4">
              <p>
                If you don't have an account,{' '}
                <Link to="/register">
                  <span className="redirect-link">register</span>
                </Link>
              </p>
            </div>
          </Form>
        </Col>
      </Row>
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
        <Toast.Body>
          <Spinner animation="border" variant="success" className="redirect-spinner" />
          Redirecting...
        </Toast.Body>
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
    </Container>
  )
}

export default Login
