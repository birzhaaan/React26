export default function AboutPage() {
  return (
    <div className="about-page">
      <h1>About</h1>
      <p>
        Recipe Finder is a React application built for the KBTU React course in
        Fall 2026. It started as a midterm project and now uses React Router for
        navigation, nested routes, and lazy loading.
      </p>
      <p>
        The data layer is a simulated asynchronous API: requests return promises
        with realistic delays, support search, filtering, sorting and
        pagination, and persist new recipes to local storage.
      </p>
      <p>
        Built with React 19 and Vite. No UI libraries — all styling is
        hand-written CSS.
      </p>
    </div>
  );
}