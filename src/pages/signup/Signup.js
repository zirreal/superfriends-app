import { useState } from "react";
import { useSignup } from "../../hooks/useSignup";
import { Helmet } from 'react-helmet-async';

// styles
import './Signup.scss';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailError, setThumbnailError] = useState(null);
  const [picName, setPicName] = useState(null);

  const {signup, isPending, error} = useSignup();

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(email, password, name, thumbnail)
  }

  const handleFileChange = (e) => {
    setThumbnail(null);

    let selected = e.target.files[0];

    if(selected) {
      setPicName(selected.name);
    }

    if(!selected) {
      setThumbnailError('Please, upload a picture');
      return
    }

    if(!selected.type.includes('image')) {
      setThumbnailError('Selected file must be an image')
      return
    }

    if(selected.size > 500000) {
      setThumbnailError('Image file size must be less than 500kb ')
      return
    }

    setThumbnailError(null);
    setThumbnail(selected);
  }

  return (
    <>
      <Helmet>
        <meta
          name="description"
          content="Signup page | Superfriends app"
        />
        <title>Signup | Superfriends app</title>
      </Helmet>
      <form className="form signup__form" onSubmit={handleSubmit}> 
        <h2 className="title signup__title">Sing Up</h2>
        <div className="form__wrapper">
          <label htmlFor="name" className="form__label">Your name:</label>
          <input 
            type="text" 
            name="name" 
            id="name" 
            className="form__input" 
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </div>
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
        <div className="form__wrapper">
        <label className="file">
          <input 
            type="file"
            name="photo"
            required
            accept="image/*"
            className="file__input"
            onChange={handleFileChange}
          />
          <span className="file__icon"></span>
          <span className="file__content">Upload profile thumbnail</span>
          {picName && <span className="file__content file__content-uploaded ">You have uploaded - {picName}</span>}
          <div className="file__pic"></div>
          {thumbnailError && <div className="error">{thumbnailError}</div>}
        </label>
        </div>
        {!isPending && <button aria-label="sign up to your account" className="btn btn-blue signup__btn">Sign up</button>}
        {isPending && <button className="btn btn-blue signup__btn btn-with-spinner btn-with-spinner--diff">Signing up...</button>}
        {error && <div className="error">{error}</div>}
      </form>
    </>
  )
}
