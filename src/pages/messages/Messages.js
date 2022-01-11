import { Link } from 'react-router-dom';
import { useCollection } from '../../hooks/useCollection';
import { useAuthContext } from '../../hooks/useAuthContext';
import { Helmet } from 'react-helmet-async';

// components 
import Avatar from '../../components/Avatar';
import Spinner from '../../components/Spinner';

// styles
import './Messages.scss';
import { useEffect, useState } from 'react';

export default function Messages() {
  const {user} = useAuthContext();
  const {documents, error} = useCollection('users');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if(documents) {
      const array = [];
      documents.filter(doc => {
        if(doc.id !== user.uid) {
          array.push(doc);
          setUsers(array)
        }
        return false
      })
    }
  }, [documents, user])

  return (
    <>
      <Helmet>
        <meta
          name="description"
          content="Message your teammates | Superfriends app"
        />
        <title>Message | Superfriends app</title>
      </Helmet>
      <div className="messages">
        <h2 className="title messages__title">Message your <span className="accent-color">Team Mates:</span></h2>
        {!documents && <Spinner/>}
        {error && <div className="error" >{error}</div>}
          <ul className="list-reset messages__list">
            {users && users.map(u => (
              <li className="messages__item" key={u.id}>
                <Link aria-label="go to personal chat with your teammate" className="messages__link" to={`/messages/${u.id}`}>
                  <div className="messages__wrapper">
                    <Avatar src={u.photoURL}/>
                    <h3 className="title messages__sub-title">{u.displayName}</h3>
                  </div>
                  <span className="messages__display-msg">check messages</span>
                </Link>
              </li>
            ))}
          </ul>
      </div>
    </>
  )
}

