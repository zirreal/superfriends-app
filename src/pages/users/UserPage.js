import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import {useCollection} from '../../hooks/useCollection';
import { Helmet } from 'react-helmet-async';

//components 
import Spinner from '../../components/Spinner';


// styles & images
import './UserPage.scss';
import Glyph from '../../assets/el.png';

export default function UserPage() {
  const {documents} = useCollection('users');
  const [userInfo, setUserInfo] = useState();
  const [isEmpty, setIsEmpty] = useState(false);
  const {id} = useParams();

  useEffect(() => {
    if(documents) {
      setUserInfo(false)
      documents.map(doc => {
        if(doc.id === id) {
          if(doc.bio && doc.additionalPhoto) {
            setIsEmpty(false)
            const array = [...doc.bio, ...doc.additionalPhoto, {displayName: doc.displayName}, {id: doc.id}];
            const info = Object.assign({}, ...array);
            setUserInfo(info)
          } else {
            setUserInfo(false)
            setIsEmpty(true)
          }
        }
        return false
      })
    }
  }, [documents, id, isEmpty])  



  return (
    <>
    <Helmet>
      <meta
        name="description"
        content="User biography page | Superfriends app"
      />
      <title>{`${ (userInfo && userInfo.displayName) || 'no user found'} page | Superfriends app`}</title>
    </Helmet>
    <div className="user-info">
      {!documents && <Spinner/>}
      {userInfo && !isEmpty &&
        <>
          <div className="user-info__header">
            <h2 className="title user-info__title">{userInfo.displayName}</h2>
          </div>
          <div className="user-info__content">
            <div className="user-info__quote">
              <img src={Glyph} alt="glyph of el" />
              <p className="paragraph-reset user-info__text">
                {userInfo.quote}
              </p>
            </div>
            <div className="user-info__data">
            <div className="user-info__photo">
              <img src={userInfo.coverUrl} alt={userInfo.displayName} />
            </div>
            <div className="user-info__bio">
              <ul className="list-reset user-info__list">
                <li className="user-info__item">
                  real name : 
                  <span className="accent"> {userInfo.realName}</span>
                </li>
                <li className="user-info__item">
                  earth name : 
                  <span className="accent"> {userInfo.earthName}</span>
                </li>
                <li className="user-info__item">
                  age : 
                  <span className="accent"> {new Date().getFullYear() - userInfo.age.toDate().getFullYear()}</span>
                </li>
                <li className="user-info__item">
                  species/home planet : 
                  <span className="accent"> {userInfo.species} / {userInfo.homePlanet}</span>
                </li>
                <li className="user-info__item">
                  occupation : 
                  <span className="accent"> {userInfo.occupation}</span>
                </li>
              </ul>
            </div>
            </div>
            <p className="paragraph-reset user-info__text">
              {userInfo.details}
            </p>
          </div>
        </>
      }
      {isEmpty && <div>nothing here yet...</div>}
      {!userInfo && documents && <div className="error">no such user exists</div>}
    </div>
    </>
  )
}
