import { useState } from 'react'

const labels = {
  todo: 'Not started',
  active: 'In progress',
  done: 'Finished',
}

function QuestCard({ quest, onRemove, onStatus, onReset }) {
  const [attempts, setAttempts] = useState(0)
  const [note, setNote] = useState('')

  console.log('render QuestCard —', quest.title, '| attempts:', attempts)

  function addAttempt() {
    setAttempts(attempts + 1)
  }

  function handleNote(event) {
    setNote(event.target.value)
  }

  function handleStatus(event) {
    onStatus(quest.id, event.target.value)
  }

  const touched = attempts > 0 || note !== ''

  return (
    <div className="card">
      <div className="row">
        <h2>{quest.title}</h2>
        <span className="badge">{labels[quest.status]}</span>
      </div>

      <p className="muted">{quest.difficulty}</p>

      <div className="row-left">
        <select className="field" value={quest.status} onChange={handleStatus}>
          <option value="todo">Not started</option>
          <option value="active">In progress</option>
          <option value="done">Finished</option>
        </select>
        <button className="btn" onClick={() => onRemove(quest.id)}>
          Remove
        </button>
      </div>

      <div className="local">
        <div className="row-left">
          <button className="btn" onClick={addAttempt}>
            Log an attempt
          </button>
          <span className="muted">{attempts} so far</span>
        </div>

        <input
          className="field wide"
          value={note}
          placeholder="Notes"
          onChange={handleNote}
        />

        {touched && (
          <button className="link" onClick={() => onReset(quest.id)}>
            Reset this card
          </button>
        )}
      </div>
    </div>
  )
}

export default QuestCard