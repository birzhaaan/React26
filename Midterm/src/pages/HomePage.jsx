import { Link } from "react-router";
import heroImage from "../assets/rec.png";

export default function HomePage() {
  return (
    <div className="home-page">
      <h1>Find your next meal</h1>
      <p className="lead">
        Browse over a hundred recipes across five categories and twenty-two
        cuisines. Search by ingredient, filter by what you have time for, and
        add your own.
      </p>

      <img src={heroImage} alt="Cooking" className="home-hero" />

      <div className="home-links">
        <Link to="/recipes" className="btn-primary">Browse Recipes</Link>
        <Link to="/dashboard" className="btn-link">View Statistics</Link>
        <Link to="/about" className="btn-link">About the Project</Link>
      </div>
    </div>
  );
}