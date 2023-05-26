import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';

function SearchFriends() {
  if (sessionStorage.getItem('username') === 'admin') {
    window.location.href = '/admin';
  } else if (!sessionStorage.getItem('username')) {
    window.location.href = '/';
  }
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [existingRequests, setExistingRequests] = useState([]);

  const currentUser = sessionStorage.getItem('username');

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/users/usersList?search=${searchQuery}&currentUser=${currentUser}`);

 
      const filteredUsers = response.data.filter(user => user.username !== currentUser);

      setUsers(filteredUsers);
      setErrorMessage('');
    } catch (error) {
      setUsers([]);
      if (error.response) {
        const errorMessage = error.response.data.message;
        setErrorMessage(errorMessage);
      } else {
        setErrorMessage('An error occurred while searching for users.');
      }
    }
  };


  const handleSendFriendRequest = async (receiverUsername) => {
    try {
      const senderUsername = sessionStorage.getItem('username');
      const requestData = {
        senderUsername: senderUsername,
        receiverUsername: receiverUsername
      };
      await axios.post(`http://localhost:8080/friend/request/${receiverUsername}?senderUsername=${senderUsername}`, JSON.stringify(requestData), {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('username')}`
        }
      });

      const updatedUsers = users.map(user => {
        if (user.username === receiverUsername) {
          user.pendingRequest = true;
        }
        return user;
      });
      setUsers(updatedUsers);
      setExistingRequests([...existingRequests, receiverUsername]);
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data;
        alert(errorMessage);
      } else {
        alert('An error occurred while sending the friend request.');
      }
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`http://localhost:8080/users/usersList?currentUser=${currentUser}`);
        setUsers(response.data);
        setErrorMessage('');
      } catch (error) {
        setUsers([]);
        if (error.response) {
          const errorMessage = error.response.data.message;
          setErrorMessage(errorMessage);
        } else {
          setErrorMessage('An error occurred while fetching users.');
        }
      }
    }

    fetchData();
  }, [currentUser]);


  return (
    <div>
      <h1>Search for Friends</h1>
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="search-input">Search: </label>
        <input id="search-input" type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <button onClick={handleSearch}>Search</button>
      </div>

      {errorMessage && <p>{errorMessage}</p>}
      <Container fluid>
        <Row xs={1} sm={2} md={3} className="g-4">
          {users.map((user) => (
            user.username !== 'admin' && (
              <Col key={user.id}>
                <div className="friendship p-3 h-100 d-flex flex-column justify-content-between">
                  <div className="text-center">
                    <img
                      src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=007bff&color=fff`}
                      alt={`${user.username}'s avatar`}
                      className="img-fluid rounded-circle"
                      style={{ width: '100px', height: '100px', margin: 'auto' }}
                    />
                    <p className="mt-3 mb-0"><strong>{user.username}</strong></p>
                    <p className="text-muted">{user.email}</p>
                  </div>
                  <div className="text-center">
                    {existingRequests.includes(user.username) ?
                      <p className="text-muted">Request Done</p> :
                      <button className="btn btn-outline-primary" onClick={() => handleSendFriendRequest(user.username)}>Add Friend</button>
                    }
                  </div>
                </div>
              </Col>
            )
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default SearchFriends;
