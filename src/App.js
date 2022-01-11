import { useState } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import {useAuthContext} from './hooks/useAuthContext';
import { Helmet, HelmetProvider } from 'react-helmet-async';

// components & pages
import Signup from './pages/signup/Signup';
import Login from './pages/login/Login';
import Dashboard from './pages/home/Dashboard';
import CreateTask from './pages/createTask/CreateTask';
import TaskPage from './pages/tasks/TaskPage';
import UserPage from './pages/users/UserPage';
import AddBio from './pages/addBio/AddBio';
import Messages from './pages/messages/Messages';
import MessagesPage from './pages/messages-single/MessagesPage';
import Page404 from './pages/404/Page404';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

// styles
import './App.scss';


function App() {
  const {user, authIsReady} = useAuthContext();
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <HelmetProvider >
      <Helmet>
        <meta charset="utf-8" />
      </Helmet>
      <div className="App">
        {authIsReady &&
          <BrowserRouter>
            {user && <Sidebar show={showSidebar} setShow={setShowSidebar}/>}
            <div className="wrapper">
              <Header show={showSidebar} setShow={setShowSidebar}/>
              <div className="container">
                <Switch>
                  <Route exact path="/">
                    {!user && <Redirect to="/login"/>}
                    {user &&  <Dashboard />}
                  </Route>
                  <Route path="/create">
                    {!user && <Redirect to="/login"/>}
                    {user &&  <CreateTask />}
                  </Route>
                  <Route path="/add-bio">
                    {!user && <Redirect to="/login"/>}
                    {user &&  <AddBio />}
                  </Route>
                  <Route exact path="/messages">
                    {!user && <Redirect to="/login"/>}
                    {user &&  <Messages />}
                  </Route>
                  <Route path="/tasks/:id">
                    {!user && <Redirect to="/login"/>}
                    {user &&  <TaskPage />}
                  </Route>
                  <Route path="/users/:id">
                    {!user && <Redirect to="/login"/>}
                    {user &&  <UserPage />}
                  </Route>
                  <Route path="/messages/:id">
                    {!user && <Redirect to="/login"/>}
                    {user &&  <MessagesPage />}
                  </Route>
                  <Route path="/login">
                    {!user && <Login />}
                    {user &&  <Redirect to="/" />}
                  </Route>
                  <Route path="/signup">
                    {!user && <Signup />}
                    {user &&  <Redirect to="/" />}
                  </Route>
                  <Route path="/*">
                    {!user && <Redirect to="/login"/>}
                    {user &&  <Page404 />}
                  </Route>
                </Switch>
              </div>
            </div>
          </BrowserRouter>
        }
      </div>
    </HelmetProvider>
  );
}

export default App;
