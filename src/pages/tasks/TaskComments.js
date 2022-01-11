import { useState } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useFirestore } from '../../hooks/useFirestore';

import { v4 as uuidv4 } from 'uuid';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { timestamp } from '../../firebase/config';

// components
import Avatar from '../../components/Avatar';

// styles
import './TaskComments.scss';

export default function TaskComments({task}) {
  const {user} = useAuthContext();
  const [newComment, setNewComment] = useState('');
  const {updateDocument, response} = useFirestore('tasks');



  const handleSubmit = async (e) => {
    e.preventDefault();

    const addNewComment = {
      displayName: user.displayName,
      photoURL: user.photoURL,
      id: uuidv4(),
      userUid: user.uid,
      createdAt: timestamp.fromDate(new Date()),
      message: newComment.trim()
    }

    await updateDocument(task.id, {
      comments: [...task.comments, addNewComment]
    })

    if(!response.error) {
      setNewComment('');
    }

  }


  return (
    <div className="task-comments">
      <h3 className='title task-comments__title'>Task Comments:</h3>

      <ul className="list-reset task-comments__list">
        {task.comments.length === 0 && <div className='no-comments' >no comments yet...</div>}
        {task.comments.length > 0 && task.comments.map(comment => (
          <li className="task-comments__item" key={comment.id}>
            <div className="task-comments__user">
              <Avatar src={comment.photoURL}/>
              <div className="task-comments__text">
                <p className="paragraph-reset task-comments__msg">
                  {comment.message}
                </p>
                <span className="task-comments__name">{comment.displayName}</span>
              </div>
            </div>
            <span className="task-comments__time">{formatDistanceToNow(comment.createdAt.toDate(), {addSuffix: true})}</span>
          </li>
        ))}
      </ul>

      <form className="task-comments__form" onSubmit={handleSubmit}>
        <div className="form__wrapper">
          <label className="form__label form__label--small">Add new comment:</label>
          <textarea 
            name="comments" 
            required
            placeholder="type your comment here"
            className="form__textarea form__textarea--small"
            onChange={(e) => setNewComment(e.target.value)}
            value={newComment}
          />
        </div>
        <button aria-label="add comment to the task" type="submit" className="btn">Add Comment</button>
      </form>
    </div>
  )
}
