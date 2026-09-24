import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Contact from './components/Contact.jsx'
import { profile } from './data.js'

function App() {
  return (
    <main>
      <Hero name={profile.name} avatar={profile.avatar} />
      <About paragraphs={profile.about} />
      <Contact contacts={profile.contacts} />
    </main>
  )
}

export default App