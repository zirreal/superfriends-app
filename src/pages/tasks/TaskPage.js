import { useHistory, useParams } from 'react-router';
import {useDocument} from '../../hooks/useDocument';
import { useFirestore } from '../../hooks/useFirestore';
import { Helmet } from 'react-helmet-async';

// components 
import TaskSummary from './TaskSummary';
import TaskComments from './TaskComments';
import Spinner from '../../components/Spinner';

// styles & images
import './TaskPage.scss';



export default function TaskPage() {
  const {id} = useParams();
  const history = useHistory();
  const {document, error} = useDocument('tasks', id);
  const {updateDocument, deleteDocument, error: docError} = useFirestore('tasks');

  const handleComplete = async() => {
    await updateDocument(id, {completed: true})
  }

  const handleDelete = () => {
    deleteDocument(id)
    history.push('/');
  }


  return (
    <>
      <Helmet>
        <meta
          name="description"
          content="Task details page | Superfriends app"
        />
        <title>{`Task ${document && document.taskName}  | Superfriends app`}</title>
      </Helmet>
      <div className="task">
        {(!error && !document) && <Spinner/>}
        {error && <div className="error">{error}</div>}
        {document && <TaskSummary task={document} handleComplete={handleComplete} handleDelete={handleDelete}/>}
        {docError && <div className="error">{docError}</div>}
        {document && <TaskComments task={document} />}
      </div>
    </>
  )
}

