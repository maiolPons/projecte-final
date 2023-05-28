import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Modal, Button, Card, Container, Row, Col } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function Party() {
    let navigate = useNavigate();
    const { partyId } = useParams();
    const [party, setParty] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(sessionStorage.getItem('username'));
    const [messageInput, setMessageInput] = useState('');
    const [selectedEmote, setSelectedEmote] = useState(null);
    const [emotes, setEmotes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [messages, setMessages] = useState([]);
    var oldlen = null;
    

    const scrollRef = useRef(null);

    if (sessionStorage.getItem("username") === "admin") {
        navigate(`/admin`);
    } else if (!sessionStorage.getItem("username")) {
        navigate(`/`);
    } else {
        if (!sessionStorage.getItem("party")) {
        navigate(`/partyFinder`);
        }
    }

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

    function handleEmoteSelection(emote) {
        setSelectedEmote(emote);
        setShowModal(false);

        const sendEmote = (emoteId) => {
        return axios.post('http://localhost:8080/parties/sendEmote', {
            partyId: partyId,
            currentUser: currentUser,
            message: messageInput,
            emoteId: emoteId
        });
        };

        sendEmote(emote.id)
        .then(response => {
            console.log('Emote sent successfully');

        })
        .catch(error => {
            console.error('Error sending emote:', error);
            alert('Error sending emote. Please try again later.');
        });
    }

    useEffect(() => {
        async function fetchParty() {
        try {
            const response = await axios.get(`http://localhost:8080/parties/partyById/${partyId}`);
            setParty(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching party:', error);
        }
        }

        fetchParty();
    }, [partyId]);
    function scrollToBottom(len) {
        if(len !== oldlen){
          var element = document.getElementById("scroll");
          element.scrollIntoView(false);
          element.scrollTop = element.scrollHeight;
          oldlen = len;
        }
      }

    useEffect(() => {

    
        const fetchMessages = async () => {
          try {
            const response = await axios.get(`http://localhost:8080/parties/partyMessages/${partyId}`);
            setMessages(response.data);
    
 
          } catch (error) {
            console.error('Error fetching party messages:', error);
          }
        };
    
        const interval = setInterval(fetchMessages, 1000); 
    
        return () => {
          clearInterval(interval);
        };
      }, [partyId]);

    const handleLeaveParty = async () => {
        try {
        const currentUser = sessionStorage.getItem("username");
        const response = await axios.post(`http://localhost:8080/parties/leaveParty`, {
            partyId: partyId,
            currentUser: currentUser
        });
        sessionStorage.removeItem('party');
        navigate(`/partyFinder`);
        } catch (error) {
        alert("error leaving the party");
        console.error('Error leaving the party:', error);
        }
    };

    const sendMessage = async () => {
        if (messageInput.trim() === '') {

        return;
        }

        try {
        const response = await axios.post(`http://localhost:8080/parties/sendMessage`, {
            partyId: partyId,
            currentUser: currentUser,
            message: messageInput
        });
 
        setMessageInput('');
        } catch (error) {
        console.error('Error sending message:', error);

        }
    }

 
    

    if (isLoading) {
        return <div>Loading...</div>;
    }

   
    return (
        <Container fluid style={{ marginTop: '20px' }}>
        <Row>
            <Col xs={3} className='friendship'>
            <h2>Party</h2>
            <div className='Party'>
                {(() => {
                let memberElements = [];
                for (let i = 1; i < 9; i++) {
                    let image = "";
                    if (i === 1 || i === 2) {
                    image = "/img/roles/tank.png";
                    } else if (i === 3 || i === 4) {
                    image = "/img/roles/healer.png";
                    } else {
                    image = "/img/roles/dps.png";
                    }
                    let member = party[`member${i}`];
                    if (member == null) {
                    memberElements.push(
                        <div key={i} className="friendCard">
                        <div className="friend-info" style={{ display: 'flex', height: 'max-content' }}>
                            <div className="friend-avatar">
                            <img
                                src={image}
                                style={{ width: "80px", height: "max-content" }}
                                alt="Friend Avatar"
                                className="avatar"
                            /> 
                            </div>
                            <div className="friend-details" style={{ width: "100%", lineHeight: "40px" }}>
                            <p className="username" style={{ fontSize: "14px", fontWeight: "bold", marginLeft: "10px" }}>{"Awaiting Party Member"}</p>
                            </div>
                        </div>
                        </div>
                    );
                    } else {
                    memberElements.push(
                        <div key={i} className="friendCard">
                        <div className="friend-info" style={{ display: 'flex', height: 'max-content' }}>
                            <div className="friend-avatar">
                            <img
                                src={"/" + member.job.image}
                                style={{ width: "80px", height: "max-content" }}
                                alt="Friend Avatar"
                                className="avatar"
                            />
                            </div>
                            <div className="friend-details" style={{ width: "100%", lineHeight: "40px" }}>
                            <p className="username" style={{ fontSize: "14px", fontWeight: "bold", marginLeft: "10px" }}>{member.user.nickname}</p>
                            </div>
                            <div className="friend-avatar">
                            {member.user.avatarPath == null ? (
                                <img
                                src={
                                `https://ui-avatars.com/api/?name=${member.user.nickname}&background=007bff&color=fff`}
                                style={{ width: "80px", height: "max-content", borderRadius: "50%" }}
                                alt="Friend Avatar"
                                className="avatar"
                            />
                            ) : (
                                <img
                                src={"/" + member.user.avatarPath }
                                style={{ width: "80px", height: "max-content", borderRadius: "50%" }}
                                alt="Friend Avatar"
                                className="avatar"
                            />
                            )}
                            
                            </div>
                        </div>
                        </div>
                    );
                    }
                }
                return memberElements;
                })()}
            </div>
            </Col>
            <Col xs={8} className="discord-col" style={{ height: "80vh" }}>
            <div className="chat-window">
                <div className="chat-header">
                <h2>{party.raid.name}</h2>
                </div>
                <div className="conversation">
                    {messages.map((message, index) => (
                        <div
                        key={index}
                        className={`message ${message.partyMemberNickname === currentUser ? 'sent' : 'received'}`}
                        style={{
                            display: 'flex',
                            justifyContent: message.partyMemberNickname === currentUser ? 'flex-end' : 'flex-start',
                        }}
                        >
                        <div
                            style={{
                            padding: '8px',
                            color: message.partyMemberNickname === currentUser ? 'white' : 'black',
                            
                            justifyContent: message.partyMemberNickname === currentUser ? 'flex-end' : 'flex-start',
                            }}
                            className={`content message ${message.partyMemberNickname === currentUser ? 'right' : 'left'}`}
                        >
                            {message.emote && (
                            <img
                                style={{
                                display: 'flex',
                                color: message.partyMemberNickname === currentUser ? 'white' : 'black',
                                justifyContent: message.partyMemberNickname === currentUser ? 'flex-end' : 'flex-start',
                                padding: '8px',
                                width: '120px',
                                }}
                                className="content"
                                src={"/" + message.emote.imagePath}
                                alt={message.emote.name}
                            />
                            )}
                            <p >{message.message}</p>
                            <p 
                            style={{color:"#ADD8E6"}}>{message.partyMemberNickname}</p>
                        </div>
                        
                        </div>
                    ))}
                    <div ref={scrollRef} />
                    </div>


                <div className="input-area">
                <input
                    type="text"
                    placeholder="Type a message"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                />
                <button onClick={sendMessage}>Send</button>
                <button onClick={() => setShowModal(true)}>Emotes</button>
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                    <Modal.Title>Select an Emote</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    {emotes
                        .filter((emote) => emote.status)
                        .map((emote) => (
                        <Button key={emote.id} variant="outline-primary" onClick={() => handleEmoteSelection(emote)}>
                            <img src={"/" + emote.imagePath} alt={emote.name} style={{ width: '40px' }} />
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
            </Col>
            <Col xs={1} className="discord-col" style={{ height: "80vh" }}>
            <button
                className='leaveButton'
                onClick={handleLeaveParty}
                onMouseEnter={(e) => (e.target.style.opacity = '1')}
                onMouseLeave={(e) => (e.target.style.opacity = '0.6')}
            >
                Leave Party
            </button>
            </Col>
        </Row>
        </Container>
    );
}
