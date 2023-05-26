import React from 'react'
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { Navbar, Nav  } from 'react-bootstrap';
const handleDestroySession = () => {
  sessionStorage.removeItem('username');
  sessionStorage.removeItem('role');
  sessionStorage.removeItem('party');
  window.location.href = '/loginUser';
};
export default function NavbarElement() {
    return (
      <Navbar className='navbar' bg="dark" expand="lg">
        <Container>
          <Navbar.Brand>
          <Link to="/" className="text-decoration-none d-flex align-items-center">
            <img src="/img/mog.png" alt="Logo" width="60"  className="rounded-circle me-2 img-fluid w-40" />
            <h1>Emet Selch Party Maker</h1>
          </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="ms-auto">
              {sessionStorage.getItem("username") && (
                <Nav.Link style={{color:"white",fontSize:"20px"}} as={Link} to="/partyFinder">
                  Party Finder
                </Nav.Link>
              )}
              {sessionStorage.getItem("username") && (
                <Nav.Link style={{color:"white",fontSize:"20px"}} as={Link} to="/SearchFriends">
                  Search Friends
                </Nav.Link>
              )}
              {sessionStorage.getItem("username") && (
                <Nav.Link style={{color:"white",fontSize:"20px"}} as={Link} to="/editUser">
                  Edit Account
                </Nav.Link>
              )}
              {!sessionStorage.getItem("username") && (
                <Nav.Link style={{color:"white",fontSize:"20px"}} as={Link} to="/loginUser">
                  Sign In
                </Nav.Link>
              )}
              {sessionStorage.getItem("username") ? (
                <Nav.Link style={{color:"white",fontSize:"20px"}} onClick={handleDestroySession}>
                  Log Out
                </Nav.Link>
              ) : (
                <Nav.Link style={{color:"white",fontSize:"20px"}} as={Link} to="/adduser">
                  Make an Account
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    )
}