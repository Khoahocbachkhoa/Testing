
import { useMemo, useState } from "react";
import "./Notes.css";

const initialEntries = [
  {
    id: 1,
    title: "A normal day",
    content:
      "Today was quite ordinary. I spent most of my time studying and working on my projects.\n\nThere are still many things I want to accomplish. I should probably focus on one thing at a time.",
    entry_date: "2026-11-11",
    updated_at: "2026-11-11T23:20:00",
  },
  {
    id: 2,
    title: "Learning AWS",
    content:
      "Started exploring AWS today. There is a lot to learn, especially networking and cloud infrastructure.",
    entry_date: "2026-11-10",
    updated_at: "2026-11-10T21:30:00",
  },
  {
    id: 3,
    title: "Random thoughts",
    content: "Some thoughts about life, learning and the future.",
    entry_date: "2026-11-09",
    updated_at: "2026-11-09T20:15:00",
  },
];

function formatDate(date) {
  if (!date) return "";

  return new Date(date + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatShortDate(date) {
  return new Date(date + "T00:00:00")
    .toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })
    .toUpperCase();
}

export default function Notes() {
  const [entries, setEntries] = useState(initialEntries);
  const [selectedId, setSelectedId] = useState(1);
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState(true);

  const selectedEntry = entries.find(
    (entry) => entry.id === selectedId
  );

  const filteredEntries = useMemo(() => {
    const keyword = search.toLowerCase();

    return [...entries]
      .filter(
        (entry) =>
          entry.title.toLowerCase().includes(keyword) ||
          entry.content.toLowerCase().includes(keyword)
      )
      .sort((a, b) =>
        b.entry_date.localeCompare(a.entry_date)
      );
  }, [entries, search]);

  function updateEntry(field, value) {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === selectedId
          ? {
              ...entry,
              [field]: value,
              updated_at: new Date().toISOString(),
            }
          : entry
      )
    );

    setSaved(false);
  }

  function createEntry() {
    const today = new Date().toLocaleDateString("en-CA");

    const newEntry = {
      id: Math.max(0, ...entries.map((e) => e.id)) + 1,
      title: "",
      content: "",
      entry_date: today,
      updated_at: new Date().toISOString(),
    };

    setEntries((prev) => [newEntry, ...prev]);
    setSelectedId(newEntry.id);
    setSaved(false);
  }

  function saveEntry() {
    // TODO: POST / PUT diary_entries API
    setSaved(true);
  }

  return (
    <main className="journal">
      <header className="topbar">
        <div className="brand">
          <span className="brand-icon">N.</span>
          <span>NOTES</span>
        </div>

        <div className="topbar-right">
          <span className="status">
            <span className={`status-dot ${saved ? "" : "unsaved"}`} />
            {saved ? "All changes saved" : "Unsaved changes"}
          </span>
          <button
            className="save-button"
            onClick={saveEntry}
            disabled={saved || !selectedEntry}
          >
            Save changes
          </button>
        </div>
      </header>

      <div className="workspace">
        <aside className="sidebar">
          <div className="sidebar-heading">
            <div>
              <h2>Journal</h2>
              <span>{entries.length} entries</span>
            </div>

            <button
              className="new-button"
              onClick={createEntry}
              title="New entry"
            >
              +
            </button>
          </div>

          <div className="search-box">
            <span>⌕</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search entries..."
            />
          </div>

          <div className="entry-list">
            {filteredEntries.map((entry) => (
              <button
                key={entry.id}
                className={`entry-item ${
                  selectedId === entry.id ? "active" : ""
                }`}
                onClick={() => {
                  setSelectedId(entry.id);
                  setSaved(true);
                }}
              >
                <span className="entry-date">
                  {formatShortDate(entry.entry_date)}
                </span>

                <span className="entry-title">
                  {entry.title || "Untitled"}
                </span>

                <span className="entry-preview">
                  {entry.content || "No content yet..."}
                </span>
              </button>
            ))}

            {filteredEntries.length === 0 && (
              <div className="empty-search">
                No entries found.
              </div>
            )}
          </div>

          <div className="sidebar-footer">
            PERSONAL JOURNAL
          </div>
        </aside>

        <section className="editor">
          {selectedEntry ? (
            <>
              <div className="editor-toolbar">
                <span>MY JOURNAL / ENTRY</span>
                <span>#{selectedEntry.id}</span>
              </div>

              <div className="editor-content">
                <input
                  className="date-input"
                  type="date"
                  value={selectedEntry.entry_date}
                  onChange={(e) =>
                    updateEntry("entry_date", e.target.value)
                  }
                />

                <input
                  className="title-input"
                  type="text"
                  maxLength={200}
                  placeholder="Untitled entry"
                  value={selectedEntry.title}
                  onChange={(e) =>
                    updateEntry("title", e.target.value)
                  }
                />

                <div className="title-divider" />

                <textarea
                  className="content-input"
                  placeholder="Start writing..."
                  value={selectedEntry.content}
                  onChange={(e) =>
                    updateEntry("content", e.target.value)
                  }
                />

                <div className="editor-footer">
                  <span>
                    {selectedEntry.content.length} characters
                  </span>
                  <span>
                    LAST EDITED{" "}
                    {new Date(
                      selectedEntry.updated_at
                    ).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="empty-editor">
              <h2>No entry selected</h2>
              <p>Create a new entry to start writing.</p>
              <button onClick={createEntry}>
                Create entry
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
