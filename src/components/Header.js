import {useAuthContext} from '../hooks/useAuthContext';
import {useLogout} from '../hooks/useLogout';

import { Link } from 'react-router-dom';

//components
import BurgerBtn from './BurgerBtn';

//styles & images
import './Header.scss';
import logo from '../assets/superman.png';

export default function Header({show, setShow}) {
  const {user} = useAuthContext();
  const {error, isPending, logout} = useLogout();


  return (
    <header className="header">
      <BurgerBtn show={show} setShow={setShow}/>
      <div className="header__logo">
        <img src={logo} alt="logo" />
      </div>
      {!user && 
        <div> 
          <Link aria-label="go to login page" to="/login" className="btn header__btn">log in</Link>
          <Link aria-label="go to signup page"  to="/signup" className="btn header__btn">sign up</Link>
        </div>
      }
      {user && !isPending && <button aria-label="log out of your account" className="btn header__btn" onClick={logout}>log out</button>}
      { user && isPending && <button aria-label="logging out of your account" className="btn header__btn btn-with-spinner" onClick={logout}>logging out</button>}
      {error && <div className="error">{error}</div>}
    </header>
  )
}

