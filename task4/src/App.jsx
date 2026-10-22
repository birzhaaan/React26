import { useState, useEffect } from "react";
import {
  getItemsList,
  getItem,
  createItem,
  updateItem,
  deleteItem,
} from "./api/fakeApi.js";
import "./App.css";

function App() {
  const [items, setItems] = useState([]);
  const [listStatus, setListStatus] = useState("idle");
  const [listError, setListError] = useState(null);

  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailStatus, setDetailStatus] = useState("idle");
  const [detailError, setDetailError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "open",
    priority: "medium",
    category: "",
    createdAt: "",
  });
  const [formStatus, setFormStatus] = useState("idle");
  const [formError, setFormError] = useState(null);

  const [actionLoading, setActionLoading] = useState(false);

  function loadList() {
    setListStatus("loading");
    setListError(null);

    getItemsList("?limit=50")
      .then((result) => {
        setItems(result.data);
        setListStatus("success");
      })
      .catch((err) => {
        setListError(err.message);
        setListStatus("error");
      });
  }

  useEffect(() => {
    loadList();
  }, []);

  useEffect(() => {
    if (selectedId === null) {
      setDetail(null);
      setDetailStatus("idle");
      return;
    }

    let cancelled = false;

    setDetailStatus("loading");
    setDetailError(null);
    setDetail(null);

    getItem(selectedId)
      .then((data) => {
        if (!cancelled) {
          setDetail(data);
          setDetailStatus("success");
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setDetailError(err.message);
          setDetailStatus("error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  function handleSelect(id) {
    setSelectedId(id);
    if (showForm === "edit") {
      setShowForm(false);
    }
  }

  function handleReload() {
    setSelectedId(null);
    setDetail(null);
    loadList();
  }

  function handleOpenCreate() {
    setShowForm("create");
    setSelectedId(null);
    setDetail(null);
    setFormData({
      name: "",
      description: "",
      status: "open",
      priority: "medium",
      category: "",
      createdAt: new Date().toISOString().split("T")[0],
    });
    setFormError(null);
  }

  function handleOpenEdit() {
    if (!detail) return;
    setShowForm("edit");
    setFormData({
      name: detail.name,
      description: detail.description,
      status: detail.status,
      priority: detail.priority,
      category: detail.category,
      createdAt: detail.createdAt,
    });
    setFormError(null);
  }

  function handleFormChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    setFormStatus("loading");
    setFormError(null);

    if (showForm === "create") {
      createItem(formData)
        .then(() => {
          setFormStatus("idle");
          setShowForm(false);
          loadList();
        })
        .catch((err) => {
          setFormError(err.message);
          setFormStatus("idle");
        });
    } else if (showForm === "edit") {
      updateItem(selectedId, formData)
        .then((updated) => {
          setFormStatus("idle");
          setShowForm(false);
          setDetail(updated);
          loadList();
        })
        .catch((err) => {
          setFormError(err.message);
          setFormStatus("idle");
        });
    }
  }

  function handleDelete() {
    if (!selectedId) return;
    if (!window.confirm("Delete this task?")) return;

    setDetailStatus("loading");

    deleteItem(selectedId)
      .then(() => {
        setSelectedId(null);
        setDetail(null);
        setDetailStatus("idle");
        loadList();
      })
      .catch((err) => {
        setDetailError(err.message);
        setDetailStatus("error");
      });
  }

  function handleToggleStatus() {
    if (!detail || actionLoading) return;

    const capturedId = detail.id;
    const newStatus = detail.status === "completed" ? "open" : "completed";

    setActionLoading(true);

    updateItem(capturedId, { status: newStatus })
      .then((updated) => {
        setSelectedId((currentId) => {
          if (currentId === capturedId) {
            setDetail(updated);
          }
          return currentId;
        });

        setItems((currentItems) =>
          currentItems.map((item) =>
            item.id === capturedId ? { ...item, status: newStatus } : item
          )
        );

        setActionLoading(false);
      })
      .catch(() => {
        setActionLoading(false);
        alert("Failed to update status. Try again.");
      });
  }

  function priorityClass(p) {
    if (p === "high") return "badge high";
    if (p === "medium") return "badge medium";
    return "badge low";
  }

  function statusClass(s) {
    if (s === "completed") return "badge completed";
    if (s === "in-progress") return "badge in-progress";
    return "badge open";
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Task Manager</h1>
      </header>

      <div className="layout">
        <div className="panel list-panel">
          <div className="panel-header">
            <h2>Tasks</h2>
            <div className="panel-actions">
              <button className="btn btn-primary" onClick={handleOpenCreate}>
                + New
              </button>
              <button className="btn" onClick={handleReload}>
                Reload
              </button>
            </div>
          </div>

          {listStatus === "loading" && (
            <div className="state-msg">Loading tasks...</div>
          )}

          {listStatus === "error" && (
            <div className="state-msg error">
              <p>Error: {listError}</p>
              <button className="btn" onClick={handleReload}>
                Retry
              </button>
            </div>
          )}

          {listStatus === "success" && items.length === 0 && (
            <div className="state-msg">No tasks yet. Create one!</div>
          )}

          {listStatus === "success" && items.length > 0 && (
            <ul className="item-list">
              {items.map((item) => (
                <li
                  key={item.id}
                  className={
                    "item-row" + (selectedId === item.id ? " selected" : "")
                  }
                  onClick={() => handleSelect(item.id)}
                >
                  <div className="item-row-top">
                    <span className="item-name">{item.name}</span>
                    <span className={priorityClass(item.priority)}>
                      {item.priority}
                    </span>
                  </div>
                  <div className="item-row-bottom">
                    <span className={statusClass(item.status)}>
                      {item.status}
                    </span>
                    <span className="item-category">{item.category}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="panel detail-panel">
          {showForm ? (
            <>
              <div className="panel-header">
                <h2>{showForm === "create" ? "New Task" : "Edit Task"}</h2>
                <button
                  className="btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>

              <form className="task-form" onSubmit={handleFormSubmit}>
                <label>
                  Name
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                  />
                </label>

                <label>
                  Description
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    required
                    rows={3}
                  />
                </label>

                <label>
                  Status
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </label>

                <label>
                  Priority
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleFormChange}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </label>

                <label>
                  Category
                  <input
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    required
                  />
                </label>

                <label>
                  Created At
                  <input
                    name="createdAt"
                    type="date"
                    value={formData.createdAt}
                    onChange={handleFormChange}
                    required
                  />
                </label>

                {formError && <p className="form-error">Error: {formError}</p>}

                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={formStatus === "loading"}
                >
                  {formStatus === "loading"
                    ? "Saving..."
                    : showForm === "create"
                    ? "Create"
                    : "Save"}
                </button>
              </form>
            </>
          ) : selectedId === null ? (
            <div className="state-msg">Select a task to see details</div>
          ) : detailStatus === "loading" ? (
            <div className="state-msg">Loading details...</div>
          ) : detailStatus === "error" ? (
            <div className="state-msg error">
              <p>Error: {detailError}</p>
              <button
                className="btn"
                onClick={() => { setSelectedId(null); setTimeout(() => setSelectedId(selectedId), 0); }}
              >
                Retry
              </button>
            </div>
          ) : detail ? (
            <>
              <div className="panel-header">
                <h2>Details</h2>
                <div className="panel-actions">
                  <button className="btn" onClick={handleOpenEdit}>
                    Edit
                  </button>
                  <button className="btn btn-danger" onClick={handleDelete}>
                    Delete
                  </button>
                </div>
              </div>

              <div className="detail-content">
                <div className="detail-field">
                  <span className="detail-label">ID</span>
                  <span>{detail.id}</span>
                </div>
                <div className="detail-field">
                  <span className="detail-label">Name</span>
                  <span>{detail.name}</span>
                </div>
                <div className="detail-field">
                  <span className="detail-label">Description</span>
                  <span>{detail.description}</span>
                </div>
                <div className="detail-field">
                  <span className="detail-label">Status</span>
                  <span className={statusClass(detail.status)}>
                    {detail.status}
                  </span>
                </div>
                <div className="detail-field">
                  <span className="detail-label">Priority</span>
                  <span className={priorityClass(detail.priority)}>
                    {detail.priority}
                  </span>
                </div>
                <div className="detail-field">
                  <span className="detail-label">Category</span>
                  <span>{detail.category}</span>
                </div>
                <div className="detail-field">
                  <span className="detail-label">Created</span>
                  <span>{detail.createdAt}</span>
                </div>

                <button
                  className={
                    "btn btn-action" +
                    (detail.status === "completed" ? " reopen" : "")
                  }
                  onClick={handleToggleStatus}
                  disabled={actionLoading}
                >
                  {actionLoading
                    ? "Updating..."
                    : detail.status === "completed"
                    ? "Reopen"
                    : "Mark Completed"}
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default App;