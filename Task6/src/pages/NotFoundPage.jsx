import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <div className="notfound-page">
      <h1>404</h1>
      <p className="lead">This page does not exist.</p>
      <Link to="/" className="btn-primary">Back to Home</Link>
    </div>
  );
}