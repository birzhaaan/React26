const options = ['all', 'todo', 'active', 'done']

const labels = {
  all: 'All',
  todo: 'Not started',
  active: 'In progress',
  done: 'Finished',
}

function Filters({ filter, onFilter, reversed, onReverse, total, shown }) {
  return (
    <div className="filters">
      <div className="tabs">
        {options.map(function (option) {
          let style = 'tab'
          if (filter === option) {
            style = 'tab tab-on'
          }
          return (
            <button key={option} className={style} onClick={() => onFilter(option)}>
              {labels[option]}
            </button>
          )
        })}
      </div>

      <div className="right">
        <span className="muted">
          {shown} of {total}
        </span>
        <button className="btn" onClick={onReverse}>
          {reversed ? 'Oldest first' : 'Newest first'}
        </button>
      </div>
    </div>
  )
}

export default Filters