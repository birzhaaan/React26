import { useState } from 'react'

function QuestForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [difficulty, setDifficulty] = useState('normal')

  function handleAdd() {
    if (title.trim() === '') {
      return
    }
    onAdd(title.trim(), difficulty)
    setTitle('')
    setDifficulty('normal')
  }

  return (
    <div className="form">
      <input
        className="field"
        value={title}
        placeholder="Name a new quest"
        onChange={(e) => setTitle(e.target.value)}
      />
      <select
        className="field select"
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
      >
        <option value="easy">Easy</option>
        <option value="normal">Normal</option>
        <option value="hard">Hard</option>
      </select>
      <button className="btn btn-solid" onClick={handleAdd} disabled={title.trim() === ''}>
        Post quest
      </button>
    </div>
  )
}

export default QuestForm