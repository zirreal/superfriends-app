import { Link } from 'react-router-dom';
import {useCollection} from '../hooks/useCollection';

// components
import Avatar from './Avatar';

// styles
import './Users.scss';

export default function Users({show, setShow, showSidebar}) {
  const {error, documents} = useCollection('users');

  const hideBlocks = () => {
    setShow(false);
    showSidebar(false);
  }

  return (
    <div className={show ? 'users-wrapper users-wrapper-active' : 'users-wrapper'}>
      <div className='users'>
        <h2 className="title users__title">All Team Members:</h2>
        {error && <div className="error">{error}</div>}
        <ul className="list-reset users__list">
          {documents && documents.map(doc => (
            <li key={doc.id} className="users__item">
              <Link aria-label="go to user biography page" to={`/users/${doc.id}`} className="users__link" onClick={hideBlocks}>
                {doc.online && <span className="users__online"></span>}
                <span className="users__name">{doc.displayName}</span>
                <Avatar src={doc.photoURL} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}