import { useState } from 'react';
import {useLogin} from '../../hooks/useLogin';
import { Helmet } from 'react-helmet-async';

// styles
import './Login.scss';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {login, isPending, error} = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password)
  }


  return (
    <>
      <Helmet>
        <meta
          name="description"
          content="Login page | Superfriends app"
        />
        <title>Login | Superfriends app</title>
      </Helmet>
      <form className="form signup__form" onSubmit={handleSubmit}> 
        <h2 className="title signup__title">Log in</h2>
        <div className="form__wrapper">
          <label htmlFor="email" className="form__label">Your email:</label>
          <input 
            type="email" 
            name="email" 
            id="email" 
            className="form__input" 
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
        <div className="form__wrapper">
          <label htmlFor="password" className="form__label">Your password:</label>
          <input 
            type="password" 
            name="password" 
            id="password" 
            className="form__input" 
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        {!isPending && <button aria-label="log in to your account" className="btn btn-blue signup__btn">Log in</button>}
        {isPending && <button className="btn btn-blue signup__btn btn-with-spinner btn-with-spinner--diff">Logging in...</button>}
        {error && <div className="error">{error}</div>}
      </form>
    </>
  )
}
