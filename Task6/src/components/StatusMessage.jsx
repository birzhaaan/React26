export default function StatusMessage({ status, error, isEmpty }) {
  if (status === "loading") {
    return <div className="status-message loading">Loading recipes...</div>;
  }

  if (status === "error") {
    return <div className="status-message error">Error: {error}</div>;
  }

  if (isEmpty) {
    return <div className="status-message empty">No recipes found. Try different filters.</div>;
  }

  return null;
}