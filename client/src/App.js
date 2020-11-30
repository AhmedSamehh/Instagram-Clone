import React,{useEffect,createContext,useReducer,useContext} from 'react';
import NavBar from './Components/Navbar'
import "./App.css"
import {BrowserRouter,Route,Switch,useHistory} from 'react-router-dom'
import Home from './Components/Screens/Home'
import Signin from './Components/Screens/Login'
import Profile from './Components/Screens/Profile'
import Signup from './Components/Screens/Signup'
import CreatePost from './Components/Screens/CreatePost'
import UserProfile from './Components/Screens/UserProfile'
import SubscribedPosts from './Components/Screens/SubscribedPosts'

import {reducer,initialState} from './Reducers/userReducer'
export const UserContext = createContext()


const Routing = ()=>{
  const history = useHistory()
  const {state,dispatch} = useContext(UserContext)
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER", payload:user})
    }else{
        history.push('/login')
    }
  },[])
  return(
    <Switch>
      <Route exact path="/" >
      <Home />
      </Route>
      <Route path="/login">
        <Signin />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route path="/create">
        <CreatePost/>
      </Route>
      <Route path="/profile/:userId">
        <UserProfile/>
      </Route> 
      <Route path="/followedposts">
        <SubscribedPosts/>
      </Route> 
    </Switch>
  )
}

function App() {
  const [state,dispatch] = useReducer(reducer,initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
    <BrowserRouter>
      <NavBar />
      <Routing />
    </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;