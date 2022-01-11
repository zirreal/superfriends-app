
const btns = ['all', 'mine', 'crime', 'alien threat', 'off world', 'science']

export default function DashboardFilter({handleFilter, currentFilter}) {
  return (
    <div className="dashboard-filter">
      <h3 className="title dashboard-filter__title">Filter tasks by:</h3>
      <div className="dashboard-filter__btns">
        {btns.map(btn => (
          <button key={btn} 
          className={currentFilter === btn ? "dashboard-filter__btn dashboard-filter__btn--active " : "dashboard-filter__btn" }
          onClick={() => handleFilter(btn)}>
            {btn}</button>
        ))}
      </div>
    </div>
  )
}
