import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useCollection } from '../../hooks/useCollection';
import { useFirestore } from '../../hooks/useFirestore';

import { v4 as uuidv4 } from 'uuid';
import { Helmet } from 'react-helmet-async';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { timestamp } from '../../firebase/config';

// components
import MessagePageHeader from './MessagePageHeader';
import Avatar from '../../components/Avatar';

// styles & images
import './MessagesPage.scss';
import DeleteIcon from '../../assets/delete-msg.svg';
import EditIcon from '../../assets/edit-msg.svg';

export default function MessagesPage() {
  const { user } = useAuthContext();
  const {id} = useParams();
  const {documents, error} = useCollection('messages', null,
  ['createdAt', 'asc']);
  const { addDocument, deleteDocument, updateDocument, response } = useFirestore('messages');

  const [newMessage, setNewMessage] = useState('');
  const [filteredMessages, setFilterMessages] = useState([]);
  const [idEdit, setIdEdit] = useState('');

  const ref = useRef(null);
  const textRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const addMessage = {
      sendBy: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
      sendTo: id,
      msg: newMessage.trim(),
      createdAt: timestamp.fromDate(new Date()),
      id: uuidv4(),
    };


    if(newMessage && !idEdit) {
      await addDocument(addMessage);
    }

    if(idEdit) {
      await updateDocument(idEdit, {
        msg: newMessage.trim()
      })
    }


    if(!response.error) {
      setNewMessage('');
      setIdEdit('');
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }

  const handleEnter = (e) => {
    if(e.key === 'Enter') {
      handleSubmit(e);
    }
  }

  useEffect(() => {
    const array = [];
    if(documents) {
      documents.filter(doc => {
        if((doc.sendTo === id && doc.sendBy === user.uid) || (doc.sendBy === id && doc.sendTo === user.uid) ) {
         array.push(doc)
        }
        return false
      });
      setFilterMessages(array);
    }
    

  }, [documents, id, user]);


  if(filteredMessages.length) {
    ref.current.scrollTop = ref.current.scrollHeight;
  }

  const handleDeleteMsg = (id) => {
    filteredMessages.filter(msg => {
      if(msg.id === id) {
        deleteDocument(msg.id)
      }

      return false
    })
  }

  const handleEditMsg = (msg, id) => {
    setNewMessage(msg);
    setIdEdit(id);
    textRef.current.focus();
  }


  return (
    <>
      <Helmet>
        <meta
          name="description"
          content="Your personal messages with a specific teammate | Superfriends app"
        />
        <title>Chat | Superfriends app</title>
      </Helmet>
      <div className="chat">
        {error && <div className="error">{error}</div>}
        <MessagePageHeader id={id}/>
        <div className="chat__window">
          <ul className="list-reset chat__list" ref={ref}>
            {!filteredMessages.length && <div style={{
              color: '#bbb'
            }}>no messages yet..</div>}
            {filteredMessages && filteredMessages.map(msg => (
              <li 
                className='chat__item'
                key={msg.id}
              >
                <div className={msg.sendBy === user.uid ? 'chat__item-wrapper chat__item-wrapper--me ' : 'chat__item-wrapper'}>
                  <div className="chat__info">
                    <Avatar src={msg.photoURL}/>
                    <div className="chat__wrapper">
                      <span className="chat__name">{msg.displayName}</span>
                      <span className="chat__time">{formatDistanceToNow(msg.createdAt.toDate(), {addSuffix: true})}</span>
                      {msg.sendBy === user.uid && <span className="chat__time">you</span>}
                    </div>
                  </div>
                  <div className="chat__msg">
                  <span>{msg.msg}</span>
                  </div>
                  {msg.sendBy === user.uid &&
                    <div className="chat__btns">
                      <button 
                        className="chat__btn-small chat__btn-small--delete"
                        onClick={() => handleDeleteMsg(msg.id)}
                      >
                        <img src={DeleteIcon} alt="delete msg" />
                      </button>
                      <button 
                        className="chat__btn-small chat__btn-small--edit"
                        onClick={() => handleEditMsg(msg.msg, msg.id)}
                      >
                        <img src={EditIcon} alt="edit msg" />
                      </button>
                    </div>
                  }
                </div>
              </li>
            ))}
          </ul>
        </div>
        <form className="chat__form" onSubmit={handleSubmit}>
          <textarea
          className="form__textarea form__textarea--small" 
          name="msg"
          placeholder="type your message..."
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
          onKeyPress={handleEnter}
          ref={textRef}
          />
          {response.error && <div className="error">{response.error}</div>}
          <button aria-label="send message to the chat" type="submit" className="btn chat__btn">send message</button>
        </form>
      </div>
    </>
  )
}
