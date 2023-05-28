import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, ListGroup, Form, Button, Modal } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";


export default function PartyFinder() {
  let navigate = useNavigate();
  const [parties, setParties] = useState([]);
  const [search, setSearch] = useState("");
  const [raids, setRaids] = useState([]);
  const [selectedRaid, setSelectedRaid] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedJob, setSelectedJob] = useState("");
  const [jobs, setJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState("");
  const [currentUser, setCurrentUser] = useState(sessionStorage.getItem('username'));
  const [selectedNullMember, setSelectedNullMember] = useState(null);
  const [showNullMemberModal, setShowNullMemberModal] = useState(false);
  const [selectedPartyId, setSelectedPartyId] = useState("");
  const [petitions, setPetitions] = useState([]);
  
  
  useEffect(() => {
    if (sessionStorage.getItem("username") === "admin") {
      navigate(`/admin`);
      //window.location.href = '/admin';
    } else if (!sessionStorage.getItem("username")) {
      navigate(`/`);
      //window.location.href = '/';
    } else {
      if (sessionStorage.getItem("party")) {
        navigate(`/party/${sessionStorage.getItem("party")}`);
        //window.location.href = `/party/${sessionStorage.getItem("party")}`;
      }
    }
  }, []);

  useEffect(() => {
    try {
      const response = axios.post(
          `http://localhost:8080/parties/partiesForMember/${currentUser}`
        );
          const data = response.data[0].id;
          console.log(data)
          sessionStorage.setItem("party", data);
          navigate(`/party/${sessionStorage.getItem("party")}`);
    } catch (error) {
        
    }
  }, []);


  useEffect(() => {
    axios.get('http://localhost:8080/raids/getRaidsTrue')
      .then(response => setRaids(response.data))
      .catch(error => console.log(error));
  }, []);

  useEffect(() => {
    if (selectedRole) {
      axios.get(`http://localhost:8080/jobs/getJobsByRole/${selectedRole}`)
        .then(response => setJobs(response.data))
        .catch(error => console.log(error));
    }
  }, [selectedRole]);

  useEffect(() => {
    if (search) {
      const selectedRaidId = parseInt(search);

      axios.get(`http://localhost:8080/parties/partiesByRaid/${selectedRaidId}`)
        .then(response => {
          const fetchedParties = response.data;
          setParties(fetchedParties);
        })
        .catch(error => console.log(error));
    } else {
      axios.get('http://localhost:8080/parties/getAllParties')
        .then(response => {
          const fetchedParties = response.data;
          setParties(fetchedParties);
        })
        .catch(error => console.log(error));
    }
  }, [search]);

  const handleSearchChange = (event) => {
    const selectedRaidId = event.target.value;
    setSearch(selectedRaidId);
  };

  const handleRaidChange = (event) => {
    const selectedRaidId = event.target.value;
    setSelectedRaid(selectedRaidId);
  };

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
    setSelectedJob("");
  };

  const handleJobChange = (event) => {
    setSelectedJob(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleNullMemberClick = (index,partyId) => {
    setSelectedNullMember(index);
    let role;
    if (index === 1 || index === 2) {
      role = "TANK";
    } else if (index === 3 || index === 4) {
      role = "HEALER";
    } else {
      role = "DPS";
    }
    setSelectedPartyId(partyId);
    setShowNullMemberModal(true);
  
    axios.get(`http://localhost:8080/jobs/getJobsByRole/${role}`)
      .then(response => {
        const fetchedJobs = response.data;
        setJobs(fetchedJobs);
      })
      .catch(error => console.log(error));
  };
  
  const handleCreatePetition = () => {
    if (selectedJob !== null) {
      const memberData = {
        job: selectedJob,
        user: currentUser,
      };
  
      axios
        .post("http://localhost:8080/members/createMember", memberData)
        .then((response) => {
          const createdMember = response.data;
          const petitionData = {
            index: selectedNullMember,
            memberId: createdMember.id,
            partyId: selectedPartyId,
          };
  
          axios
            .post("http://localhost:8080/parties/addMember", petitionData)
            .then((response) => {
              const createdPetition = response.data;
              setPetitions([...petitions, createdPetition]);
              sessionStorage.setItem('party', response.data.id);
              handleCloseNullMemberModal();
              navigate(`/party/${sessionStorage.getItem("party")}`);
            })
            .catch((error) => console.log(error));
        })
        .catch((error) => console.log(error));
    }
  }
  
  
  const handleCloseNullMemberModal = () => {
    setSelectedNullMember(null);
    setShowNullMemberModal(false);
  };

  const handleCreateParty = () => {
    const memberData = {
      job: selectedJob,
      user: currentUser,
    };

    axios.post('http://localhost:8080/members/createMember', memberData)
      .then(response => {
        const createdMember = response.data;
        const partyData = {
          name: `Party - ${createdMember.job}`,
          description,
          member1: createdMember.id,
          raid: selectedRaid,
          idMember: response.data.id,
        };

        axios.post('http://localhost:8080/parties/createParty', partyData)
          .then(response => {
            const createdParty = response.data;
            setParties([...parties, createdParty]);
            handleCloseModal();
            sessionStorage.setItem('party', response.data.id);
            navigate(`/party/${sessionStorage.getItem("party")}`);
          })
          .catch(error => console.log(error));
      })
      .catch(error => console.log(error));
  };

  const isCreateButtonClickable = description.length >= 15 && selectedRaid !== "" && selectedRole !== "" && selectedJob !== "";

  return (
    <Container>
      <div className='py-4'>
        <h1>Party Finder</h1>
        <div className="d-flex flex-column align-items-center mb-3">
          <Form.Group style={{ width: '50%' }}>
            <Form.Label>Search by Raid:</Form.Label>
            <Form.Control as="select" value={search} onChange={handleSearchChange}>
              <option value="">Select an option</option>
              {raids.map(raid => (
                <option key={raid.id} value={raid.id}>{raid.name} --- level: ({raid.lvl})</option>
              ))}
            </Form.Control>
          </Form.Group>
          <Button variant="primary" onClick={handleOpenModal} style={{ borderRadius: "50%", width: '60px', height: '60px', opacity: 0.9, marginTop: "10px" }}>
            <img style={{ maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto' }} src='img/plus.png' alt="Create Party" />
          </Button>
        </div>

        <h3>Parties:</h3>
        <div className="row">
          {parties.length > 0 ? (
            parties.map((party, index) => {
              return (
                <div key={party.id} className="col-md-6 mb-3">
                  {console.log(party.raid.image)}
                  <div
                    className="party-card friendship"
                    style={{
                      backgroundImage: `url(${party.raid.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      height: '20vh',
                    }}
                  >
                    <h5>{party.raid.name}</h5>
                    <p>{party.description}</p>
                    <div className="partyMembers">
                    {[...Array(8)].map((_, index) => {
                      const member = party[`member${index + 1}`];
                      var jobImage = null;
                      var jobName = null;
                      var position = index + 1;
                      
                      if (index === 0 || index === 1) {
                        jobImage = member && member.job ? member.job.image : `/img/roles/tank.png`;
                        jobName = member && member.job ? member.job.name : 'TANK';
                      } else if (index === 2 || index === 3) {
                        jobImage = member && member.job ? member.job.image : `/img/roles/healer.png`;
                        jobName = member && member.job ? member.job.name : 'HEALER';
                      } else {
                        jobImage = member && member.job ? member.job.image : `/img/roles/dps.png`;
                        jobName = member && member.job ? member.job.name : 'DPS';
                      }

                      return member ? (
                        <img
                          key={index}
                          src={jobImage}
                          alt={jobName}
                          className={position}
                          style={{
                            width: '20px',
                            height: '20px',
                            marginRight: '5px',
                          }}
                        />
                      ) : (
                        <button
                          key={index}
                          className={position}
                          style={{
                            width: '20px',
                            height: '20px',
                            marginRight: '5px',
                            border: 'none',
                            padding: '0',
                            background: 'none',
                            cursor: 'pointer',
                          }}
                          onClick={() => handleNullMemberClick(index + 1,party.id)}
                        >
                          <img
                            src={jobImage}
                            alt={jobName}
                            style={{
                              width: '20px',
                              height: '20px',
                            }}
                          />
                        </button>
                      );
                    })}
                    </div>

                  </div>
                </div>
              );
            })
          ) : (
            <p>No parties found.</p>
          )}
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} dialogClassName="custom-modal" contentClassName="custom-modal-content">
        <Modal.Header closeButton>
          <Modal.Title>Create Party</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Select Raid:</Form.Label>
            <Form.Control as="select" value={selectedRaid} onChange={handleRaidChange}>
              <option name="raid" value="">Select an option</option>
              {raids.map(raid => (
                <option key={raid.id} value={raid.id}>{raid.name} --- level: ({raid.lvl})</option>
              ))}
            </Form.Control>
          </Form.Group>
          {selectedRaid && (
            <Form.Group>
              <Form.Label>Select Role:</Form.Label>
              <div className="d-flex flex-wrap">
                {['tank', 'healer', 'dps'].map(role => (
                  <div key={role} className="d-flex flex-column align-items-center mx-3 mb-3">
                    <label>
                      <img
                        src={`/img/roles/${role.toLowerCase()}.png`}
                        alt={role}
                        style={{ width: '50px', height: '50px', marginBottom: '5px' }}
                      />
                      <input
                        type="radio"
                        name="role"
                        value={role}
                        checked={selectedRole === role}
                        onChange={handleRoleChange}
                        className="me-2"
                      />
                      {role.toUpperCase()}
                    </label>
                  </div>
                ))}
              </div>
            </Form.Group>
          )}
          {selectedRole && (
            <Form.Group>
              <Form.Label>Select Job:</Form.Label>
              <div className="d-flex flex-wrap">
                {jobs.map(job => (
                  <div key={job.id} className="d-flex flex-column align-items-center mx-3 mb-3">
                    <label>
                      <img
                        src={job.image}
                        alt={job.name}
                        style={{
                          width: '50px',
                          height: '50px',
                          marginBottom: '5px',
                          opacity: selectedJob == job.id ? 1 : 0.5,
                        }}
                      />
                      <input
                        type="radio"
                        name="job"
                        value={job.id}
                        checked={selectedJob == job.id}
                        style={{ display: 'none' }}
                        onChange={handleJobChange}
                      />
                      {job.name}
                    </label>
                  </div>
                ))}
              </div>
            </Form.Group>
          )}
          {selectedRole && (
            <Form.Group>
              <Form.Label>Description:</Form.Label>
              <Form.Control
                type="text"
                maxLength="30"
                value={description}
                onChange={handleDescriptionChange}
                placeholder="Enter description (minimum 15 characters)"
              />
            </Form.Group>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateParty} disabled={!isCreateButtonClickable}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>



      <Modal show={showNullMemberModal} onHide={handleCloseNullMemberModal} dialogClassName="custom-modal" contentClassName="custom-modal-content">
        <Modal.Header closeButton>
          <Modal.Title>Select Job</Modal.Title>
        </Modal.Header>
        <Modal.Body >
          <Form.Group>
            <Form.Label>Select Job:</Form.Label>
            <div className="d-flex flex-wrap">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="d-flex flex-column align-items-center mx-3 mb-3"
                  onClick={() => setSelectedJob(job.id)}
                >
                  <label>
                    <img
                      src={job.image}
                      alt={job.name}
                      style={{
                        width: "50px",
                        height: "50px",
                        marginBottom: "5px",
                        opacity: selectedJob === job.id ? 1 : 0.5,
                      }}
                    />
                    <input
                      type="radio"
                      name="job"
                      value={job.id}
                      checked={selectedJob === job.id}
                      style={{ display: "none" }}
                      onChange={handleJobChange}
                    />
                    {job.name}
                  </label>
                </div>
              ))}
            </div>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseNullMemberModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreatePetition}>
            Join the Party
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
}
