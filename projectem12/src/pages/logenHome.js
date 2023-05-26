import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Modal, Button, Card, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
export default function LogenHome() {
  let navigate = useNavigate();
  if(sessionStorage.getItem("username") == "admin"){
      navigate("/admin");
      //window.location.href = '/admin';
  }
  else if(!sessionStorage.getItem("username")){

      navigate("/");
      //window.location.href = '/';
  }
  const [pendingFriends, setPendingFriends] = useState([]);
  const [confirmedFriends, setConfirmedFriends] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [selectedFriendUsername, setSelectedFriendUsername] = useState(null);
  const [currentUser, setCurrentUser] = useState(sessionStorage.getItem('username'));
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([]);
  const chatWindowRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmote, setSelectedEmote] = useState(null);
  const [emotes, setEmotes] = useState([]);
  var oldlen = null;
  //emote


console.log(sessionStorage);

  function handleEmoteSelection(emote) {
    setSelectedEmote(emote);
    setShowModal(false);

    if (selectedFriend) {
      let senderId;
    let receiverId;

    if (selectedFriend.sender.username === currentUser) {
      receiverId = selectedFriend.receiver.id;
      senderId = selectedFriend.sender.id;
    } else {
      receiverId = selectedFriend.sender.id;
      senderId = selectedFriend.receiver.id;
    }

      const sendEmote = (senderId, receiverId, emoteId) => {
        return axios.post('http://localhost:8080/emotes/sendEmote', {
          senderId: senderId,
          receiverId: receiverId,
          emoteId: emoteId
        });
      };

      sendEmote(senderId, receiverId, emote.id)
        .then(response => {
          console.log('Emote sent successfully');

        })
        .catch(error => {
          console.error('Error sending emote:', error);
          alert('Error sending emote. Please try again later.');
        });
    }
  }
  
  
////////////Do on load////////////////
useEffect(() => {
  async function fetchEmotes() {
    try {
      const response = await axios.get('http://localhost:8080/emotes');
      setEmotes(response.data);
    } catch (error) {
      console.error('Error fetching emotes:', error);
    }
  }

  fetchEmotes();
}, []);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`http://localhost:8080/friend/pending?username=${currentUser}`);
        setPendingFriends(response.data);
        setErrorMessage('');
      } catch (error) {
        setPendingFriends([]);
        if (error.response) {
          const errorMessage = error.response.data.message;
          setErrorMessage(errorMessage);
        } else {
          setErrorMessage('An error occurred while fetching pending friends.');
        }
      }
    }
    fetchData();
  }, [currentUser]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`http://localhost:8080/friend/confirmed?username=${currentUser}`);
        setConfirmedFriends(response.data);
        setErrorMessage('');
      } catch (error) {
        setConfirmedFriends([]);
        if (error.response) {
          const errorMessage = error.response.data.message;
          setErrorMessage(errorMessage);
        } else {
          setErrorMessage('An error occurred while fetching confirmed friends.');
        }
      }
    }
    fetchData();
  }, [currentUser]);
  ////////////accept friendship////////////////
  function handleAddFriend(friendId) {
    axios.put(`http://localhost:8080/friend/${friendId}/accept`)
      .then(response => {
        window.location.href = '/';
        console.log('Friend request accepted successfully');
      })
      .catch(error => {
        alert("Error with the request, try it later");
        console.error('Error accepting friend request:', error);
      });
  }
  ////////////Deny friendship////////////////
  function handleCancelFriendship(friendId) {
    axios.delete(`http://localhost:8080/friend/${friendId}`)
      .then(response => {
        window.location.href = '/';
        console.log('Friend request cancelled successfully');
      })
      .catch(error => {
        alert("Error with the request, try it later");
        console.error('Error cancelling friend request:', error);
      });
  }

  useEffect(() => {
    let interval;

    if (selectedFriend) {
      fetchMessages();

      interval = setInterval(fetchMessages, 1000);
    }

    return () => clearInterval(interval);
  }, [selectedFriend]);
////////////Select conversation////////////////
  function handleSelectFriend(friend) {
    
    setSelectedFriend(friend);
    if (friend.sender.username === currentUser) {
      setSelectedFriendUsername(friend.receiver.username);
    } else {
      setSelectedFriendUsername(friend.sender.username);
    }
  }
  ////////////Display messages////////////////
  function fetchMessages() {
    const senderId = selectedFriend.sender.id;
    const receiverId = selectedFriend.receiver.id;

    const getMessages = (senderId, receiverId) => {
      return axios.get(`http://localhost:8080/messages/messages?senderId=${senderId}&receiverId=${receiverId}`);
    };


    axios.all([
      getMessages(senderId, receiverId),
      getMessages(receiverId, senderId)
    ])
      .then(axios.spread((response1, response2) => {
        const messages1 = response1.data;
        const messages2 = response2.data;
        const allMessages = [...messages1, ...messages2];
        allMessages.sort((a, b) => new Date(a.sentDateTime) - new Date(b.sentDateTime)); 
        setMessages(allMessages);
        
        setTimeout(() => {
          scrollToBottom(allMessages.length); 
        }, 100);
      }))
      .catch(error => {
        console.error('Error fetching messages:', error);
      });
  }

  function scrollToBottom(len) {
    if(len !== oldlen){
      var element = document.getElementById("scroll");
      element.scrollIntoView(false);
      element.scrollTop = element.scrollHeight;
      oldlen = len;
    }
  }
  ////////////send message////////////////
  function sendMessage() {
    if (!selectedFriend) {
      return;
    }

    let senderId;
    let receiverId;

    if (selectedFriend.sender.username === currentUser) {
      receiverId = selectedFriend.receiver.id;
      senderId = selectedFriend.sender.id;
    } else {
      receiverId = selectedFriend.sender.id;
      senderId = selectedFriend.receiver.id;
    }

    if (messageInput.trim() !== '') {
      const messageContent = messageInput;

      axios.post('http://localhost:8080/messages/addMessage', {
        senderId: senderId,
        receiverId: receiverId,
        content: messageContent
      })
        .then(response => {
          console.log('Message sent successfully');
        })
        .catch(error => {
          console.error('Error sending message:', error);
          alert("Error with the request, please try again later");
        });

      setMessageInput('');
    }
  }
  ////////////return start here////////////////
  return (
    <Container fluid style={{ marginTop: '20px' }}>
      <Row>
        <Col xs={3} className='friendship'>
          <h2>Friend List</h2>
          <div className="friend-list">
            {confirmedFriends.map(friend => (
              friend.pending === false && friend.sender.username === currentUser ? (
                <div key={friend.id} className="friendCard" onClick={() => handleSelectFriend(friend)}>
                  <a href='#' style={{ textDecoration: "none" }}>
                    <div className="friend-info" style={{ display: 'flex', height: 'max-content' }}>
                      <div className="friend-avatar">
                        <img
                          src={
                            friend.receiver.avatarPath ||
                            `https://ui-avatars.com/api/?name=${friend.receiver.username}&background=007bff&color=fff`
                          }
                          style={{ width: "80px", height: "max-content", borderRadius: "50%" }}
                          alt="Friend Avatar"
                          className="avatar"
                        />
                      </div>
                      <div className="friend-details" style={{ width: "100%", lineHeight: "40px" }}>
                      <p className="username" style={{ color: "white", fontSize: "18px", fontWeight: "bold", marginLeft: "10px" }}>{friend.receiver.username}</p>
                      </div>
                    </div>
                  </a>
                </div>
              ) : friend.pending === false && friend.receiver.username === currentUser ? (
              <div key={friend.id} className="friendCard" onClick={() => handleSelectFriend(friend)}>
                <a href='#' style={{ textDecoration: "none" }}>
                  <div className="friend-info" style={{ display: 'flex', height: 'max-content' }}>
                    <div className="friend-avatar">
                      <img
                        src={
                          friend.sender.avatarPath ||
                          `https://ui-avatars.com/api/?name=${friend.sender.username}&background=007bff&color=fff`
                        }
                        style={{ width: "80px", height: "max-content", borderRadius: "50%" }}
                        alt="Friend Avatar"
                        className="avatar"
                      />
                    </div>
                    <div className="friend-details" style={{ width: "100%", lineHeight: "40px" }}>
                    <p className="username" style={{ fontSize: "18px", fontWeight: "bold", marginLeft: "10px", color: "white" }}>{friend.sender.username}</p>
                    </div>
                  </div>
                </a>
              </div>
              ) : null
            ))}
          </div>
        </Col>

        <Col xs={6} className="discord-col" style={{ height: "80vh" }}>
          {selectedFriend ? (
            <div className="chat-window" ref={chatWindowRef}>
              <div className="chat-header">
                <h2>Chat with {selectedFriendUsername}</h2>
              </div>
              <div className="conversation" id="scroll">
              {messages.map((message, index) => (
                <div
                
                  key={index}
                  className={`message ${message.sender.username == currentUser ? 'sent' : 'received'} `}
                  style={{
                    display:"flex",
                    justifyContent: message.sender.username == currentUser ? 'flex-end' : 'flex-start',
                  }}
                >
                  {message.emote != null ? (
                    <img src={message.emote.imagePath} 
                    alt={message.emote.name} 
                    className={`content ${message.partyMemberNickname == currentUser ? 'right' : 'left'}`}
                    style={{
                      display: 'flex',
                      color: message.partyMemberNickname === currentUser ? 'white' : 'black',
                      justifyContent: message.partyMemberNickname === currentUser ? 'flex-end' : 'flex-start',
                      padding: '8px',
                      width: '80px',
                      }}/>
                  ) : (
                    <div
                      className={`content ${message.partyMemberNickname == currentUser ? 'right' : 'left'}`}
                      style={{
                        color: message.sender.username == currentUser ? 'white' : 'black',
                        borderRadius: '8px',
                        padding: '8px',
                      }}
                    >
                      {message.content}
                    </div>
                  )}
                </div>
              ))}
              </div>
              <div className="input-area">
                <input
                  type="text"
                  placeholder="Type a message"
                  value={messageInput}
                  onChange={event => setMessageInput(event.target.value)}
                />
                <button onClick={sendMessage}>Send</button>
                {/* Button to open the emote modal */}
                <button onClick={() => setShowModal(true)}>Emotes</button>

                {/* Emote modal */}
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                  <Modal.Header closeButton>
                    <Modal.Title>Select an Emote</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    {/* Emote selection options */}
                    {emotes
                      .filter((emote) => emote.status) // Filter emotes with status true
                      .map((emote) => (
                        <Button key={emote.id} variant="outline-primary" onClick={() => handleEmoteSelection(emote)}>
                          <img src={emote.imagePath} alt={emote.name} style={{ width: '40px' }} />
                        </Button>
                      ))}
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>

              </div>
            </div>
          ) : (
            <div className="conversation">
              <p>Select a friend to start a conversation.</p>
            </div>
          )}
        </Col>

        <Col xs={3} className='friendship'>
          <h2>Friend Requests</h2>
          <div className="friend-list">
            {pendingFriends.map(friend => (
              <div key={friend.sender.id} className="friendCard" >
                <div className="friend-info" style={{ display: 'flex', height:"80px" }}>
                  <div className="friend-avatar">
                    <img
                      src={
                        friend.sender.avatarPath ||
                        `https://ui-avatars.com/api/?name=${friend.sender.username}&background=007bff&color=fff`
                      }
                      style={{ width: "80px", height:"max-content",borderRadius:"50%" }}
                      alt="Friend Avatar"
                      className="avatar"
                    />
                  </div>
                  <p className="username" style={{ fontWeight: "bold", position: "relative", top: "5px", height: "100%", textAlign: "center", width: "100%",fontSize:"20px" }}>{friend.sender.username}</p>
                  <div className="friend-details" style={{ width: "100%", display: 'flex', justifyContent: 'flex-end' }}>
                    <Button style={{height:"80px", borderRadius:"50%"}} variant="primary" onClick={() => handleAddFriend(friend.id)}>Accept</Button>
                    <Button style={{height:"80px",borderRadius:"50%"}} variant="danger" onClick={() => handleCancelFriendship(friend.id)}>Cancel</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
