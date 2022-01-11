import { Helmet } from 'react-helmet-async';
import { useHistory} from 'react-router-dom';

// styles & image
import './Page404.scss';
import Kara from '../../assets/drawing-lightning-supergirl.png';


export default function Page404() {
  const history = useHistory();


  return (
    <>
      <Helmet>
        <meta
          name="description"
          content="Page was not found | Superfriends app"
        />
        <title>404 Page | Superfriends app</title>
      </Helmet>
      <div className="page-404">
        <div className="page-404__img">
          <img src={Kara} alt="supergirl" />
        </div>
        <p className="paragraph-reset page-404__text">Page you are looking for is not here</p>
        <button aria-label="Return to the previous page" className="btn page-404__btn" onClick={history.goBack}>Return to the previous page</button>
      </div>
    </>
  )
}
