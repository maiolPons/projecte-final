  import './App.css';
  import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
  import NavbarElement from './layout/NavbarElement';
  import Home from './pages/home';
  import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
  import AddUser from './users/addUser';
  import LoginUser from './users/loginUser';
  import SearchFriends from './friends/searchFriends';
  import LogenHome from './pages/logenHome';
  import Admin from './admin/admin';
  import AddEmote from './admin/addEmote';
  import AddJob from './admin/addJob';
  import AddRaid from './admin/addRaid';
  import EditRaid from './admin/editRaid';
  import RaidList from './admin/raidList';
  import EmoteList from './admin/emoteList';
  import JobList from './admin/jobList';
  import EditJob from './admin/editJob';
  import EditEmote from './admin/editEmote';
  import PartyFinder from './pages/partyFinder';
  import Party from './pages/party';
  import EditUser from './users/editUser';


  function App() {  
    return <div className="App container-fluid bg-image">
        <Router>
          <NavbarElement/>

          <Routes>
            <Route exact path="/" element={<Home/>}/>
            <Route exact path="/adduser" element={<AddUser/>}/>
            <Route exact path="/loginUser" element={<LoginUser/>}/>
            <Route exact path='/SearchFriends' element={<SearchFriends/>}/>
            <Route exact path='/logenHome' element={<LogenHome/>}/>
            <Route exact path='/admin' element={<Admin/>}/>
            <Route exact path='/addEmote' element={<AddEmote/>}/>
            <Route exact path='/addJob' element={<AddJob/>}/>
            <Route exact path='/addRaid' element={<AddRaid/>}/>
            <Route exact path='/editRaid/:raidId' element={<EditRaid/>}/>
            <Route exact path='/raidList' element={<RaidList/>}/>
            <Route exact path='/emoteList' element={<EmoteList/>}/>
            <Route exact path='/jobList' element={<JobList/>}/>
            <Route exact path='/editJob/:jobId' element={<EditJob/>}/>
            <Route exact path='/editEmote/:emoteId' element={<EditEmote/>}/>
            <Route exact path='/partyFinder' element={<PartyFinder/>}/>
            <Route exact path='/party/:partyId' element={<Party/>}/>
            <Route exact path='/editUser' element={<EditUser/>}/>

          </Routes>
        </Router>

      </div>
  }

  export default App;
