import { useState } from 'react'
import QuestForm from './components/QuestForm.jsx'
import Filters from './components/Filters.jsx'
import QuestList from './components/QuestList.jsx'

const startQuests = [
  { id: 1, title: 'Clear the Old Mine', difficulty: 'hard', status: 'active' },
  { id: 2, title: 'Deliver the Letter', difficulty: 'easy', status: 'todo' },
  { id: 3, title: 'Tame the Grey Wolf', difficulty: 'normal', status: 'done' },
]

function App() {
  const [quests, setQuests] = useState(startQuests)
  const [filter, setFilter] = useState('all')
  const [reversed, setReversed] = useState(false)
  const [versions, setVersions] = useState({})
  const [nextId, setNextId] = useState(4)

  console.log('render App — quests:', quests.length, '| filter:', filter)

  function addQuest(title, difficulty) {
    const quest = {
      id: nextId,
      title: title,
      difficulty: difficulty,
      status: 'todo',
    }
    setQuests([...quests, quest])
    setNextId(nextId + 1)
  }

  function removeQuest(id) {
    const left = []
    for (let i = 0; i < quests.length; i++) {
      if (quests[i].id !== id) {
        left.push(quests[i])
      }
    }
    setQuests(left)
  }

  function changeStatus(id, status) {
    const updated = []
    for (let i = 0; i < quests.length; i++) {
      if (quests[i].id === id) {
        updated.push({ ...quests[i], status: status })
      } else {
        updated.push(quests[i])
      }
    }
    setQuests(updated)
  }

  function resetCard(id) {
    const copy = { ...versions }
    if (copy[id]) {
      copy[id] = copy[id] + 1
    } else {
      copy[id] = 1
    }
    setVersions(copy)
  }

  function toggleOrder() {
    setReversed(!reversed)
  }

  let visible = []
  for (let i = 0; i < quests.length; i++) {
    if (filter === 'all' || quests[i].status === filter) {
      visible.push(quests[i])
    }
  }
  if (reversed) {
    visible = visible.reverse()
  }

  return (
    <div className="page">
      <h1>Quest Board</h1>
      <p className="lead">Keep track of what the party has taken on.</p>

      <QuestForm onAdd={addQuest} />

      <Filters
        filter={filter}
        onFilter={setFilter}
        reversed={reversed}
        onReverse={toggleOrder}
        total={quests.length}
        shown={visible.length}
      />

      <QuestList
        quests={visible}
        versions={versions}
        onRemove={removeQuest}
        onStatus={changeStatus}
        onReset={resetCard}
      />
    </div>
  )
}

export default App