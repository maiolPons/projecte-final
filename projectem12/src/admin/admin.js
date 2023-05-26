    import React, { useState, useEffect } from 'react';
    import axios from 'axios';
    import { Container, ListGroup } from 'react-bootstrap';


    export default function Admin() {
        if(sessionStorage.getItem("username") !== "admin"){
            window.location.href = '/';
        }

        const [userCount, setUserCount] = useState(0);

        useEffect(() => {
            const fetchUserCount = async () => {
            const response = await axios.get('http://localhost:8080/users/count');
            setUserCount(response.data);
            };

            fetchUserCount();
        }, []);
        
        return (
            <div className='container'>
                <div className='py-4'>
                    <h1>Admin menu</h1>
                    <h2>Emotes</h2>
                    <Container>
                        <ListGroup>
                        <ListGroup.Item>
                            <a href="/addEmote">Add Emote</a>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <a href="/emoteList">List Emotes</a>
                        </ListGroup.Item>
                        </ListGroup>
                    </Container>
                    <h2>jobs</h2>
                    <Container>
                        <ListGroup>
                        <ListGroup.Item>
                            <a href="/addJob">Add Job</a>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <a href="/jobList">List Jobs</a>
                        </ListGroup.Item>
                        </ListGroup>
                    </Container>
                    <h2>Raids</h2>
                    <Container>
                        <ListGroup>
                        <ListGroup.Item>
                            <a href="/addRaid">Add Raid</a>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <a href="raidList">List Raids</a>
                        </ListGroup.Item>
                        </ListGroup>
                    </Container>
                </div>
                
                    
                    
                
            </div>
        )
        }