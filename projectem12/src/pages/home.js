import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Home() {
  if(sessionStorage.getItem("username")){
    window.location.href = '/logenHome';
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
            <h1>Join the community</h1>
            <h2>
                Time to get
            </h2>
            <h2>
                {userCount}
            </h2>
            <h2>
                And were ready to have fun!
            </h2>
            <div>
            <Link style={{width:"300px"}} className='btn btn-outline-primary' to="/adduser">Make an Account</Link>
            </div>
        </div>
    </div>
  )
}