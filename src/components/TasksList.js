import { Link } from 'react-router-dom';

// components & pages
import Avatar from './Avatar';
import Glyph from '../assets/el.png';

// styles & images
import './TasksList.scss'

export default function TasksList({tasks}) {
  return (
    <div className="tasks">
      {tasks.length === 0 && <p>No tasks yet!</p>}
      {tasks.map(task => (
        <article className="tasks__item" key={task.id} >
          <Link aria-label="go to task details page" className="tasks__link"to={`/tasks/${task.id}`}>
            <h2 className="title tasks__title">{task.taskName}</h2>
            <div className="tasks__text">
            <span className="tasks__descr">task by <span className="accent-color">{task.createdBy.displayName}</span></span>
            <span className="tasks__descr">due by <span className="accent-color">{task.dueDate.toDate().toDateString()}</span></span>
            </div>
            <div className="tasks-team">
              <ul className="list-reset tasks-team__list">
                {task.teamMembers.map(item => (
                  <li key={item.photoURL} className="tasks-team__item">
                    <Avatar src={item.photoURL}/>
                  </li>
                ))}
              </ul>
              <div className="tasks-team__glyph">
                <img src={Glyph} alt="glyph of el" />
              </div>
            </div>
          </Link>
        </article>
      ))}
    </div>
  )
}
