import { useEffect, useState } from "react"
import { useCollection } from "../../hooks/useCollection"

// components
import Avatar from "../../components/Avatar";
import Spinner from '../../components/Spinner';

export default function MessagePageHeader({id}) {
  const {documents, error} = useCollection('users');
  const [otherUser, setOtherUser] = useState({});

  useEffect(() => {
    if(documents) {
      documents.filter(doc => {
        if(doc.id === id) {
          setOtherUser(doc)
        }
        return false
      })
    }
  }, [documents, id])

  return (
    <div className="chat__header">
      {error && <div className="error">{error}</div>}
      {Object.keys(otherUser).length > 0 &&  
        <>
          <span className={otherUser.online ? 'chat__header-status chat__header-status--online' : 'chat__header-status'}></span>
          <span className="chat__header-title">{otherUser.displayName}</span>
          <Avatar src={otherUser.photoURL}/>
        </>
      }
      {Object.keys(otherUser).length === 0 && <Spinner/>}
    </div>
  )
}
