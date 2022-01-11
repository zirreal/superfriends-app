import {useState} from 'react';
import { useHistory } from 'react-router';
import DatePicker from 'react-date-picker';
import { Helmet } from 'react-helmet-async';
import { Formik, Form, Field, ErrorMessage, useField} from 'formik';
import * as Yup from 'yup';


import { useStorage } from '../../hooks/useStorage';
import {useFirestore} from '../../hooks/useFirestore';
import { useAuthContext } from '../../hooks/useAuthContext';

import { timestamp } from '../../firebase/config';

//styles
import './AddBio.scss';

const MyTextInput = ({label, ...props}) => {
  const [field, meta] = useField(props);

  return (
    <>    
      <label htmlFor={props.name} className="form__label">{label}</label>
      <input className="form__input" {...props} {...field}/>
      {meta.touched && meta.error ? (
          <div className="error error--validate">{meta.error}</div>
      ): null}
    </>
  )
};


export default function AddBio() {

  const {uploadImage} = useStorage();
  const {response, updateDocument} = useFirestore('users');
  const {user} = useAuthContext();  
  const history = useHistory();

  const [age, setAge] = useState('');
  const [thumbnailError, setThumbnailError] = useState(null);
  const [picName, setPicName] = useState(null);
  const [bioPic, setBioPic] = useState(null)

  const handleFileChange = async (e) => {
    setBioPic(null)

    const selected = e.target.files[0];

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

    setThumbnailError(null);
    setBioPic(selected)


  }


  const handleSubmit = async (realName, earthName, species, homePlanet, occupation, quote, details) => {

    if(bioPic) {
      await uploadImage(bioPic);
      await updateDocument(user.uid, {
        bio: [
          {realName},
          {earthName}, 
          {details},
          {age: timestamp.fromDate(new Date(age))},
          {species},
          {homePlanet},
          {occupation},
          {quote},
        ]
      });


    }

    if(!response.error) {
      history.push('/users/' + user.uid)
    }
  }


  return (
    <>
      <Helmet>
        <meta
          name="description"
          content="Add Biography for your user | Superfriends app"
        />
        <title>Add Biography | Superfriends app</title>
      </Helmet>
      <div className="add-bio">
        <h2 className="title add-bio__title">Add your biography:</h2>
        <Formik 
          initialValues = {{
            realName: '',
            earthName: '',
            species: '',
            homePlanet: '',
            occupation: '',
            quote: '',
            details: ''
          }}
          validationSchema = {Yup.object({
              realName: Yup.string().min(2, 'Enter at least 2 characters').required('Required'),
              earthName: Yup.string().min(2, 'Enter at least 2 characters').required('Required'),
              species: Yup.string().min(2, 'Enter at least 2 characters').required('Required'),
              homePlanet: Yup.string().min(2, 'Enter at least 2 characters').required('Required'),
              occupation: Yup.string().min(2, 'Enter at least 2 characters').required('Required'),
              quote: Yup.string().min(2, 'Enter at least 2 characters').required('Required'),
              details: Yup.string()
                      .min(10, 'Enter at least 10 characters')
                      .required('Required'),
                      
          })}
          onSubmit = {values => {
            handleSubmit(values.realName, values.earthName, values.species, values.homePlanet, values.occupation, values.quote, values.details)
          }}
        >
          <Form className="form add-bio__form">
            <div className="form__wrapper">
              <MyTextInput 
                label="Real Name"
                id="realName"
                name="realName"
                type="text"
              />
            </div>
            <div className="form__wrapper">
              <MyTextInput 
                label="Earth Name"
                id="earthName"
                name="earthName"
                type="text"
              />
            </div>
            <div className="form__wrapper">
              <label htmlFor="age" className="form__label">Birthday:</label>
              <DatePicker
                id="age"
                className="form__input"
                onChange={setAge}
                value={age}
                required
              />
            </div>
            <div className="form__wrapper">
              <MyTextInput 
                label="Species"
                id="species"
                name="species"
                type="text"
              />
            </div>
            <div className="form__wrapper">
              <MyTextInput 
                label="Home Planet"
                id="homePlanet"
                name="homePlanet"
                type="text"
              />
            </div>
            <div className="form__wrapper">
              <MyTextInput 
                label="Occupation"
                id="occupation"
                name="occupation"
                type="text"
              />
            </div>
            <div className="form__wrapper">
              <MyTextInput 
                label="Quote"
                id="quote"
                name="quote"
                type="text"
              />
            </div>
            <div className="form__wrapper">
              <label htmlFor="details" className="form__label">Details:</label>
              <Field 
                name="details"
                id="details"
                as="textarea"
                className="form__textarea"
              />
              <ErrorMessage className="error error--validate" name="details" component="div"/>
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
                <span className="file__content">Upload bio photo</span>
                {picName && <span className="file__content file__content-uploaded ">You have uploaded - {picName}</span>}
                <div className="file__pic"></div>
                {thumbnailError && <div className="error">{thumbnailError}</div>}
              </label>
            </div>
            {!response.isPending && <button type="submit" aria-label="add your biography information" className="btn btn-blue">add</button>}
            {response.isPending && <button type="submit" disabled className="btn btn-blue btn-with-spinner btn-with-spinner--diff">Adding...</button>}
            {response.error && <div className="error">{response.error}</div>}
          </Form>
        </Formik>
      </div>
    </>
  )
}
