function Hero({ name, avatar }) {
  return (
    <section className="hero">
      <img className="hero-photo" src={avatar} alt={name} />
      <h1 className="hero-name">{name}</h1>
    </section>
  )
}

export default Hero