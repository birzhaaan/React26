function Contact({ contacts }) {
  return (
    <section className="section" id="contact">
      <h2 className="section-title">Contact</h2>
      <dl className="section-body contacts">
        {contacts.map((item) => (
          <div key={item.label} className="contact-row">
            <dt>{item.label}</dt>
            <dd>
              {item.href ? (
                <a href={item.href} target="_blank" rel="noreferrer">
                  {item.value}
                </a>
              ) : (
                item.value
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

export default Contact