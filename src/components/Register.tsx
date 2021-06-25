import { useState } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Toast from 'react-bootstrap/Toast'
import Spinner from 'react-bootstrap/Spinner'
import { Link, RouteComponentProps } from 'react-router-dom'

const Register = ({ history }: RouteComponentProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [successToast, setSuccessToast] = useState(false)
  const [errorToast, setErrorToast] = useState(false)

  const [profileType, setProfileType] = useState('students')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      email,
      password,
    }

    try {
      let response = await fetch(process.env.REACT_APP_BE_URL + '/' + profileType + '/register', {
        // localhost:3001/students/register
        // localhost:3001/companies/register
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (response.ok) {
        setSuccessToast(true)
        setTimeout(() => {
          history.push('/login')
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
      <h3 className="text-center">Create an account filling the form below</h3>
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
            <Form.Control
              as="select"
              value={profileType}
              onChange={(e) => setProfileType(e.target.value)}
              className="form-field mb-3"
            >
              <option value="students">Student</option>
              <option value="companies">Company</option>
            </Form.Control>
            <Button type="submit" className="bg-strive-primary">
              Register
            </Button>
            <div className="mt-4">
              <p>
                If you already have an account,{' '}
                <Link to="/login">
                  <span className="redirect-link">log in</span>
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

export default Register
