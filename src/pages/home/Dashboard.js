import { useState } from 'react';
import { useCollection } from '../../hooks/useCollection';
import { useAuthContext } from '../../hooks/useAuthContext';
import { Helmet } from 'react-helmet-async';

// components & pages
import TasksList from '../../components/TasksList';
import DashboardFilter from './DashboardFilter';
import Spinner from '../../components/Spinner';

// styles
import './Dashboard.scss';

export default function Dashboard() {
  const {documents, error} = useCollection('tasks', 
    null,
    ['createdAt', 'desc']
  );
  const {user} = useAuthContext();
  const [currentFilter, setCurrentFilter] = useState('all');

  const handleFilter = (btn) => {
    setCurrentFilter(btn);
  }

  const filteredDocs = documents ? documents.filter(doc => {
    switch(currentFilter) {
      case 'mine': 
        let includeMe = false;
        doc.teamMembers.forEach(t => {
          if(t.id === user.uid ) {
            includeMe = true;
          }
        })
        return includeMe
      case 'crime':
      case 'alien threat':
      case 'off world':
      case 'science':
        return doc.category === currentFilter
      default:
        return documents
    }
  }) : null;


  return (
    <>
      <Helmet>
        <meta
          name="description"
          content="Dashboard with tasks | Superfriends app"
        />
        <title>Dashboard | Superfriends app</title>
      </Helmet>
      <div className="dashboard">
        {!documents && <Spinner/>}
        <DashboardFilter handleFilter={handleFilter} currentFilter={currentFilter}/>
        {error && <div className="error">{error}</div>}
        {documents && <TasksList tasks={filteredDocs}/>}
      </div>
    </>
  )
}
