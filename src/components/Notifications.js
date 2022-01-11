import { useFirestore } from '../hooks/useFirestore';

//styles & images
import './Notifications.scss';
import RedBell from '../assets/red-notif.svg';

export default function Notifications({allNotifications, showNotifications, user, show}) {

  const {updateDocument} = useFirestore('users');

  const onDeleteNotifications = async (id) => {
    const filteredNotifications = allNotifications.filter(n => n.id !== id)

    await updateDocument(user.uid, {
      notifications: filteredNotifications
    });
  }

  const onReadNotifications = async (id) => {
    const filteredNotifications = allNotifications.filter(n => n.id !== id)

    const readNotification = allNotifications.filter(n => {
      if(n.id === id) {
        return n.read = true
      }

      return false;
    })

    const all = [...filteredNotifications, ...readNotification];

    console.log('working')

    await updateDocument(user.uid, {
      notifications: all
    });
  }

  return (
    <div className={show ? 'notifications notifications-active' : 'notifications'}>
      <button aria-label="close notifications window" className="notifications__delete-btn notifications__delete-btn-main" onClick={() => showNotifications(false)}>x</button>
      <img className="notifications__img" src={RedBell} alt="notification icon" />
      <span className="notifications__name">Notifications for {user.displayName} :</span>
      {allNotifications && !allNotifications.length && <p>no notifications</p>}
      {allNotifications && 
        allNotifications.map(item => (
          <div 
            className={item.read ? 'notifications__item notifications__item--read ' : 'notifications__item' } 
            key={item.id} 
            onClick={() => !item.read ? onReadNotifications(item.id) : null
          }>
            <button aria-label="delete notification" className="notifications__delete-btn" onClick={() => onDeleteNotifications(item.id)}>&times;</button>
            <h3 className="title notifications__title">{user.displayName} !</h3>
            <span className="notifications__text">Your assistant was requested by {item.requestedBy}</span>
            <p className="paragraph-reset notifications__descr">
              Check Task: <span className="accent">{item.text}</span>
            </p>
          </div>
        ))
      }
    </div>
  )
}
