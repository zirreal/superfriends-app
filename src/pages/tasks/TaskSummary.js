import { useAuthContext } from '../../hooks/useAuthContext';

// components
import Avatar from '../../components//Avatar';

// styles & images
import './TaskSummary.scss';
import Glyph from '../../assets/el.png';

export default function TaskSummary({task, handleComplete, handleDelete}) {
  const {user} = useAuthContext();

  return (
    <div className="task-summary__wrapper">
      <div className="task-summary">
        <h2 className="title task-summary__title">{task.taskName}</h2>
        <div className="task-summary__header">
          <div className="task-summary__text">
            <div>by <span className="accent-color">{task.createdBy.displayName}</span> </div>
            <div>due date: <span className="accent-color">{task.dueDate.toDate().toDateString()}</span> </div>
          </div>
          <div className="task-summary__glyph">
            <img src={Glyph} alt="glyph of el" />
          </div>
        </div>
        <p className="paragraph-reset task-summary__descr">
          {task.details}
        </p>
        <div className="task-summary__team">
          <span>TEAM:</span>
          <ul className="list-reset task-summary__list">
            {task.teamMembers.map(item => (
              <li key={item.photoURL} className="task-summary__item">
                <Avatar src={item.photoURL}/>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {user.uid === task.createdBy.id && <div className="task__buttons">
        <button
        aria-label="delete the task" 
        className="btn btn-with-outline btn-delete"
        onClick={handleDelete}
        >
          Delete Task</button>
        {!task.completed && <button 
        className="btn btn-blue btn-complete"
        aria-label="mark task as completed"
        onClick={handleComplete}>
          Complete Task</button>}
        {task.completed && <span className="btn paragraph-reset task-completed">
          task was completed!</span>}
      </div>}
    </div>
  )
}
