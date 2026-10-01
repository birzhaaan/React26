import QuestCard from './QuestCard.jsx'

function QuestList({ quests, versions, onRemove, onStatus, onReset }) {
  if (quests.length === 0) {
    return <p className="empty">Nothing here yet.</p>
  }

  return (
    <div className="list">
      {quests.map(function (quest) {
        let version = 0
        if (versions[quest.id]) {
          version = versions[quest.id]
        }

        return (
          <QuestCard
            key={quest.id + '-' + version}
            quest={quest}
            onRemove={onRemove}
            onStatus={onStatus}
            onReset={onReset}
          />
        )
      })}
    </div>
  )
}

export default QuestList