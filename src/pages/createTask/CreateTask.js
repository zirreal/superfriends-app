import { useState, useEffect } from 'react';
import DatePicker from 'react-date-picker';
import { useHistory } from 'react-router';
import Select from 'react-select';
import { Helmet } from 'react-helmet-async';
import makeAnimated from 'react-select/animated';

import { v4 as uuidv4 } from 'uuid';
import { Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';

import { timestamp } from '../../firebase/config';

import {useAuthContext} from '../../hooks/useAuthContext';
import {useCollection} from '../../hooks/useCollection';
import { useFirestore } from '../../hooks/useFirestore';


// styles
import './CreateTask.scss';

const categories = [
  {value: 'crime', label: 'Crime'},
  {value: 'alien threat', label: 'Alien Threat'},
  {value: 'off world', label: 'Off World'},
  {value: 'science', label: 'Science'}
];

const customStyles = {
  menu: (provided) => ({
    ...provided,
    zIndex: 10,
  }),

  control: (provided) => ({
    ...provided,
    marginBottom: 40,
    padding: '10px 10px',
    border: '1px solid #98cfe7',
    borderRadius: '10px'
  }),
}

const animatedComponents = makeAnimated();

export default function CreateTask() {
  const { documents } = useCollection('users');
  const [users, setUsers] = useState([]);
  const {user} = useAuthContext();
  const {addDocument, response} = useFirestore('tasks');
  const {updateDocument} = useFirestore('users');
  const history = useHistory();

  const [dueDate, setDueDate] = useState(new Date());
  const [category, setCategory] = useState('');
  const [team, setTeam] = useState([]);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if(documents) {
      const options = documents.map(item => {
        return {value: item, label: item.displayName}
      })
      setUsers(options);
    }
  }, [documents])


  const handleSubmit = async (taskName, details) => {
    setFormError(null);

    if (!category) {
      setFormError('Please, select a task category');
      return
    }

    if(team.length === 0) {
      setFormError('Please, pick at least one person for this task')
      return
    }

    const createdBy = {
      displayName: user.displayName,
      photoURL: user.photoURL,
      id: user.uid
    }

    const teamMembers = team.map(user => {
      return {
        displayName: user.value.displayName,
        photoURL: user.value.photoURL,
        id: user.value.id
      }
    })

    const project = {
      taskName,
      details,
      category: category.value,
      dueDate: timestamp.fromDate(new Date(dueDate)),
      comments: [],
      createdBy,
      teamMembers,
      completed: false,
    }
    await addDocument(project);

    const notification = {
      read: false,
      text: taskName,
      requestedBy: createdBy.displayName,
      id: uuidv4(),
      createdAt: timestamp.fromDate(new Date()),
    }

    documents.filter( (member)  => {
      return teamMembers.forEach(async (item) => {
        if(item.displayName.includes(member.displayName) && createdBy.displayName !== member.displayName) {
          await updateDocument(member.id, {notifications: [...member.notifications, notification] })
        }
      })
    })

    if(!response.error) {
      history.push('/')
    }

  }


  return (
    <>
      <Helmet>
        <meta
          name="description"
          content="Create task for the superheroes | Superfriends app"
        />
        <title>Create Task | Superfriends app</title>
      </Helmet>
      <div className="create-task">
        <h2 className="title create-task__title">Create a new task:</h2>
        <Formik 
          initialValues={{ 
            taskname: '', 
            det: '' ,
          }}
          validationSchema = {Yup.object({
            taskname: Yup.string()
                .min(2, 'Enter at least 2 characters')
                .required('required'),
            det: Yup.string()
                    .min(10, 'Enter at least 10 characters')
                    .required('required'),
          })}
          onSubmit = {values => {
            handleSubmit(values.taskname, values.det)
          }}
        >
          <Form className="form create-task__form">
            <div className="form__wrapper">
              <label htmlFor="taskname" className="form__label">Task Name:</label>
              <Field 
                type="text" 
                name="taskname"
                id="taskname"
                className="form__input"
              />
              <ErrorMessage className="error error--validate" name="taskname" component="div"/>
            </div>
            <div className="form__wrapper">
              <label htmlFor="dueDate" className="form__label">Due Date:</label>
              <DatePicker
                id="dueDate"
                className="form__input"
                onChange={setDueDate}
                value={dueDate}
                minDate={new Date()}
                required
              />
            </div>
            <div className="form__wrapper">
              <label htmlFor="det" className="form__label">Details:</label>
              <Field 
                name="det"
                as="textarea"
                id="det"
                className="form__textarea"
              />
              <ErrorMessage className="error error--validate" name="det" component="div"/>
            </div>
            <div className="form__wrapper">
              <label htmlFor="category" className="form__label">
                Category
              </label>
              <Select
                onChange={(option) => setCategory(option)}
                options={categories} 
                styles={customStyles}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    primary25: '#98cfe7',
                    primary: 'black',
                  },
                })}
              />
            </div>
            <div className="form__wrapper">
              <label htmlFor="backup" className="form__label">Team for the mission</label>
              <Select
                onChange={(option) => setTeam(option)}
                options={users} 
                styles={customStyles}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    primary25: '#98cfe7',
                    primary: 'black',
                  },
                })}
                isMulti
                closeMenuOnSelect={false}
                components={animatedComponents}
              />
            </div>
            {formError && <div className="error">{formError}</div>}
            {!response.isPending && <button aria-label="create a new task" type="submit" className="btn btn-blue">create task</button>}
            {response.isPending && <button disabled className="btn btn-blue btn-with-spinner btn-with-spinner--diff">Creating...</button>}
            {response.error && <div className="error">{response.error}</div>}
          </Form>
        </Formik>
      </div>
    </>
  )
}
