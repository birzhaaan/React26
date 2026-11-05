export default function LoginPage() {
  return (
    <div className="login-page">
      <h1>Sign in</h1>
      <p className="lead">Authentication is not implemented yet.</p>

      <form className="login-form" onSubmit={(e) => e.preventDefault()}>
        <label>
          Email
          <input type="email" placeholder="you@example.com" />
        </label>

        <label>
          Password
          <input type="password" placeholder="••••••••" />
        </label>

        <button type="submit" className="btn-primary" disabled>
          Sign in
        </button>
      </form>
    </div>
  );
}