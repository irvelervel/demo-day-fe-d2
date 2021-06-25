import { RouteComponentProps } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { User } from '../typings/User'
import StudentCard from './StudentCard'
import { isAdmin, isCompany } from '../lib/helpers'

const HomePage = (routerProps: RouteComponentProps) => {
  const [users, setUsers] = useState([])
  const [connectedStudents, setConnectedStudents] = useState([])
  const [filteredTrack, setFilteredTrack] = useState('')

  const getUsers = async () => {
    console.log(
      process.env.REACT_APP_BE_URL +
        '/students' +
        (!isAdmin() ? '?approved=true' : '') +
        (!filteredTrack ? '' : '&track=' + filteredTrack)
    )

    // /students&track=FS
    try {
      let response = await fetch(
        process.env.REACT_APP_BE_URL +
          '/students' +
          (!isAdmin() ? '?approved=true' : '') +
          (!filteredTrack ? '' : (isAdmin() ? '?' : '&') + 'track=' + filteredTrack),
        {
          credentials: 'include',
        }
      )
      if (response.ok) {
        let data = await response.json()
        setUsers(data.students)
      } else {
        console.log('error')
      }
    } catch (error) {
      console.log('error')
    }
  }

  const getPersonalProfile = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_BE_URL + '/students/me', {
        credentials: 'include',
      })
      if (response.ok) {
        let data = await response.json()
        setConnectedStudents(data.connectedStudents)
      } else {
        alert('something went wrong')
      }
    } catch (error) {
      alert('something went wrong')
      console.log(error)
    }
  }

  useEffect(() => {
    getUsers()
    if (isCompany()) {
      getPersonalProfile()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    getUsers()
    // do another fetch
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredTrack])

  return (
    <Container>
      <Row className="justify-content-center">
        <ButtonGroup aria-label="track-filter">
          <Button variant="success" onClick={() => setFilteredTrack('')}>
            All
          </Button>
          <Button variant="success" onClick={() => setFilteredTrack('FS')}>
            FS
          </Button>
          <Button variant="success" onClick={() => setFilteredTrack('AI')}>
            AI
          </Button>
        </ButtonGroup>
      </Row>
      <Row style={{ marginTop: '120px' }}>
        {users.map((user: User) => (
          <Col key={user._id} lg={6} className={!user.profilePic ? 'd-none student-column' : 'student-column'}>
            <StudentCard
              user={user}
              {...routerProps}
              getPersonalProfile={getPersonalProfile}
              getUsers={getUsers}
              connectedStudents={connectedStudents}
            />
          </Col>
        ))}
      </Row>
    </Container>
  )
}

export default HomePage
