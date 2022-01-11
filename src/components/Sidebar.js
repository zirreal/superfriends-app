import { useAuthContext } from '../hooks/useAuthContext';
import {useCollection} from '../hooks/useCollection';

import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';

// components
import Avatar from './Avatar';
import Users from './Users';
import Notifications from './Notifications';

// styles & images
import './Sidebar.scss';
import Bell from '../assets/notific.svg';
import WhiteBell from '../assets/white-bell.svg';
import Dashboard from '../assets/dashboard.svg';
import Create from '../assets/create.svg';
import UsersIcon from '../assets/users.svg';
import AddIcon from '../assets/add-icon.svg';
import MessagesIcon from '../assets/messages.svg';

export default function Sidebar({show, setShow}) {
  const {user} = useAuthContext();
  const { documents, error } = useCollection('users', ['id', '==', user.uid]);
  const [showUsers, setShowUsers] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [allNotifications, setAllNotifications] = useState([]);
  const [changeBellColor, setChangeBellColor] = useState(false);

  const handleUsers = (e) => {
    setShowUsers((prev) => {
      return !prev
    })
  }

  const handlePressKey = (e) => {
    if(e.key === 'Enter' || e.key === ' '){
      setShowUsers((prev) => {
        return !prev
      })
    }
  }

  const handleNotifications = () => {
    setShowNotifications((prev) => {
      return !prev
    })
  }

  useEffect(() => {
    if(documents) {
      if(documents[0].notifications) {
        documents[0].notifications.map(not => {

          documents[0].notifications.every((i) => {
            if(i.read === true) {
              setChangeBellColor(false)
            } else {
              setChangeBellColor(true)
            }

            if(not.read === false) {
              setChangeBellColor(true)
             }

            return false
          })


          return false
        
        })

        return setAllNotifications([...documents[0].notifications])
      }
    }
  }, [documents])



  return (
    <aside className={show ? 'sidebar sidebar-active' : 'sidebar'}>
      <button aria-label="close sidebar" onClick={() => setShow(false)} className="close-btn">&times;</button>
      <div className="sidebar__block">
        <div className="sidebar__content">
          <div className="sidebar__user">
            {error && <p>{error}</p>}
            <div className="sidebar__notification">
              <button aria-label="toggle notifications window" className="sidebar__notification-btn" onClick={handleNotifications}>
                <img src={changeBellColor ? WhiteBell : Bell} alt="notification bell" className={changeBellColor ? 'red-bell' : 'white-bell'} />
              </button>
              <Notifications allNotifications={allNotifications} showNotifications={setShowNotifications} show={showNotifications} user={user}  />
            </div>
            <Avatar src={user.photoURL}/>
            <span className="sidebar__greetings">hello, {user.displayName}</span>
          </div>
          <nav className="sidebar__nav nav">
            <ul className="nav__list list-reset">
              <li className="nav__item">
                <NavLink aria-label="go to dashboard" onClick={() => setShow(false)} exact to="/" className="nav__link">
                  <span>Dashboard</span>
                  <img className="nav__img" src={Dashboard} alt="dashboard icon" />
                </NavLink>
              </li>
              <li className="nav__item ">
                <NavLink aria-label="go to create task page" onClick={() => setShow(false)} exact to="/create" className="nav__link">
                  <span>Create Task</span>
                  <img className="nav__img" src={Create} alt="create icon" />
                </NavLink>
              </li>
              <li className="nav__item ">
                <NavLink aria-label="go to add biography page" onClick={() => setShow(false)} exact to="/add-bio" className="nav__link">
                  <span>Add bio</span>
                  <img className="nav__img" src={AddIcon} alt="add icon" />
                </NavLink>
              </li>
              <li className="nav__item ">
                <NavLink aria-label="go to messages page" onClick={() => setShow(false)} exact to="/messages" className="nav__link">
                  <span>Messages</span>
                  <img className="nav__img" src={MessagesIcon} alt="add icon" />
                </NavLink>
              </li>
              <li 
                className={showUsers ? 'nav__item nav__item--users nav__item--users-active' : 'nav__item nav__item--users'} 
                onClick={handleUsers}
                tabIndex="0"
                onKeyPress={(e) => handlePressKey(e)}
              >
                <span>Team Members</span>
                <img className="nav__img" src={UsersIcon} alt="users icon" />
              </li>
              <div className='users-block'>
                <Users show={showUsers} showSidebar={setShow} setShow={setShowUsers}/>
              </div>
            </ul>
          </nav>
        </div> 
      </div>
    </aside>
  )
}
