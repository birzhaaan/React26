function About({ paragraphs }) {
  return (
    <section className="section" id="about">
      <h2 className="section-title">About me</h2>
      <div className="section-body">
        {paragraphs.map((text, index) => (
          <p key={index}>{text}</p>
        ))}
      </div>
    </section>
  )
}

export default About