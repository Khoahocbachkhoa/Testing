import { useEffect, useMemo, useRef, useState } from "react";
import { LogOut, LoaderCircle, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { meApi } from "../api/auth";
import {
  createEntryApi,
  deleteEntryApi,
  getEntriesApi,
  updateEntryApi,
} from "../api/diary";
import "./Notes.css";

function localDateKey() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

function formatDate(date) {
  if (!date) return "";
  return new Date(`${date}T00:00:00`).toLocaleDateString("vi-VN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatShortDate(date) {
  if (!date) return "";
  return new Date(`${date}T00:00:00`)
    .toLocaleDateString("vi-VN", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })
    .toUpperCase();
}

function getErrorMessage(error) {
  return error.response?.data?.message || "Không thể kết nối tới máy chủ.";
}

export default function Notes() {
  const [entries, setEntries] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [dirtyIds, setDirtyIds] = useState(() => new Set());
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const nextDraftId = useRef(-1);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    Promise.all([getEntriesApi(), meApi()])
      .then(([entriesResponse, userResponse]) => {
        if (!active) return;
        const loadedEntries = entriesResponse.data.entries || [];
        setEntries(loadedEntries);
        setSelectedId(loadedEntries[0]?.id ?? null);
        setUser(userResponse.data.user);
      })
      .catch((error) => {
        if (active) toast.error(getErrorMessage(error));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const selectedEntry = entries.find((entry) => entry.id === selectedId);
  const isSaved = selectedEntry ? !dirtyIds.has(selectedEntry.id) : true;

  const filteredEntries = useMemo(() => {
    const keyword = search.trim().toLocaleLowerCase();
    return [...entries]
      .filter(
        (entry) =>
          entry.title.toLocaleLowerCase().includes(keyword) ||
          entry.content.toLocaleLowerCase().includes(keyword),
      )
      .sort((a, b) => b.entry_date.localeCompare(a.entry_date));
  }, [entries, search]);

  function markDirty(id) {
    setDirtyIds((previous) => new Set(previous).add(id));
  }

  function updateEntry(field, value) {
    if (!selectedEntry) return;
    setEntries((previous) =>
      previous.map((entry) =>
        entry.id === selectedEntry.id
          ? { ...entry, [field]: value, updated_at: new Date().toISOString() }
          : entry,
      ),
    );
    markDirty(selectedEntry.id);
  }

  function createEntry() {
    const id = nextDraftId.current;
    nextDraftId.current -= 1;
    const draft = {
      id,
      title: "",
      content: "",
      entry_date: localDateKey(),
      updated_at: new Date().toISOString(),
    };
    setEntries((previous) => [draft, ...previous]);
    setSelectedId(id);
    markDirty(id);
  }

  async function saveEntry() {
    if (!selectedEntry || saving) return;
    if (!selectedEntry.content.trim()) {
      toast.error("Viết nội dung trước khi lưu ghi chú.");
      return;
    }

    setSaving(true);
    const payload = {
      title: selectedEntry.title,
      content: selectedEntry.content,
      entry_date: selectedEntry.entry_date,
    };

    try {
      const response =
        selectedEntry.id < 0
          ? await createEntryApi(payload)
          : await updateEntryApi(selectedEntry.id, payload);
      const savedEntry = response.data.entry;

      setEntries((previous) =>
        previous.map((entry) =>
          entry.id === selectedEntry.id ? savedEntry : entry,
        ),
      );
      if (selectedEntry.id < 0) setSelectedId(savedEntry.id);
      setDirtyIds((previous) => {
        const next = new Set(previous);
        next.delete(selectedEntry.id);
        return next;
      });
      toast.success("Đã lưu ghi chú.");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  async function removeEntry() {
    if (!selectedEntry || deleting) return;
    setDeleting(true);
    try {
      if (selectedEntry.id > 0) await deleteEntryApi(selectedEntry.id);
      const remaining = entries.filter((entry) => entry.id !== selectedEntry.id);
      setEntries(remaining);
      setSelectedId(remaining[0]?.id ?? null);
      setDirtyIds((previous) => {
        const next = new Set(previous);
        next.delete(selectedEntry.id);
        return next;
      });
      toast.success("Đã xóa ghi chú.");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setDeleting(false);
    }
  }

  function logout() {
    localStorage.removeItem("accessToken");
    navigate("/login", { replace: true });
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
            <span className={`status-dot ${isSaved ? "" : "unsaved"}`} />
            {isSaved ? "Đã lưu" : "Chưa lưu thay đổi"}
          </span>
          <button
            className="save-button"
            onClick={saveEntry}
            disabled={isSaved || saving || !selectedEntry}
          >
            {saving ? "Đang lưu..." : "Lưu ghi chú"}
          </button>
          <span className="account-name" title={user?.username}>
            {user?.fullname || user?.username || ""}
          </span>
          <button className="logout-button" onClick={logout} title="Đăng xuất">
            <LogOut size={15} aria-hidden="true" />
            <span>Thoát</span>
          </button>
        </div>
      </header>

      <div className="workspace">
        <aside className="sidebar">
          <div className="sidebar-heading">
            <div>
              <h2>Nhật ký</h2>
              <span>{entries.length} ghi chú</span>
            </div>
            <button
              className="new-button"
              onClick={createEntry}
              title="Ghi chú mới"
              disabled={loading || saving || deleting}
            >
              +
            </button>
          </div>

          <div className="search-box">
            <span aria-hidden="true">⌕</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm ghi chú..."
              aria-label="Tìm ghi chú"
            />
          </div>

          <div className="entry-list">
            {loading ? (
              <div className="list-message">
                <LoaderCircle className="spin" size={18} />
                <span>Đang tải ghi chú...</span>
              </div>
            ) : (
              <>
                {filteredEntries.map((entry) => (
                  <button
                    key={entry.id}
                    className={`entry-item ${selectedId === entry.id ? "active" : ""}`}
                    onClick={() => setSelectedId(entry.id)}
                    disabled={saving || deleting}
                  >
                    <span className="entry-date">{formatShortDate(entry.entry_date)}</span>
                    <span className="entry-title">{entry.title || "Chưa có tiêu đề"}</span>
                    <span className="entry-preview">
                      {entry.content || "Chưa có nội dung..."}
                    </span>
                  </button>
                ))}

                {filteredEntries.length === 0 && (
                  <div className="empty-search">
                    {search ? "Không tìm thấy ghi chú." : "Chưa có ghi chú nào."}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="sidebar-footer">NHẬT KÝ CÁ NHÂN</div>
        </aside>

        <section className="editor">
          {selectedEntry ? (
            <>
              <div className="editor-toolbar">
                <span>NHẬT KÝ CỦA TÔI / GHI CHÚ</span>
                <div className="editor-actions">
                  <span>#{selectedEntry.id > 0 ? selectedEntry.id : "mới"}</span>
                  <button
                    className="delete-button"
                    onClick={removeEntry}
                    disabled={deleting || saving}
                    title="Xóa ghi chú đang mở"
                  >
                    <Trash2 size={15} aria-hidden="true" />
                    <span>{deleting ? "Đang xóa..." : "Xóa"}</span>
                  </button>
                </div>
              </div>

              <div className="editor-content">
                <label className="visually-hidden" htmlFor="entry-date">
                  Ngày ghi chú
                </label>
                <input
                  id="entry-date"
                  className="date-input"
                  type="date"
                  value={selectedEntry.entry_date}
                  onChange={(event) => updateEntry("entry_date", event.target.value)}
                  disabled={saving}
                  required
                />
                <p className="date-caption">{formatDate(selectedEntry.entry_date)}</p>

                <label className="visually-hidden" htmlFor="entry-title">
                  Tiêu đề ghi chú
                </label>
                <input
                  id="entry-title"
                  className="title-input"
                  type="text"
                  maxLength={200}
                  placeholder="Ghi chú chưa có tiêu đề"
                  value={selectedEntry.title}
                  onChange={(event) => updateEntry("title", event.target.value)}
                  disabled={saving}
                />

                <div className="title-divider" />

                <label className="visually-hidden" htmlFor="entry-content">
                  Nội dung ghi chú
                </label>
                <textarea
                  id="entry-content"
                  className="content-input"
                  placeholder="Bắt đầu viết..."
                  value={selectedEntry.content}
                  onChange={(event) => updateEntry("content", event.target.value)}
                  disabled={saving}
                />

                <div className="editor-footer">
                  <span>{selectedEntry.content.length} ký tự</span>
                  <span>
                    CẬP NHẬT LÚC{" "}
                    {new Date(selectedEntry.updated_at).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="empty-editor">
              <h2>{loading ? "Đang tải nhật ký..." : "Bắt đầu viết nhật ký"}</h2>
              <p>
                {loading
                  ? "Đang kết nối với máy chủ."
                  : "Tạo ghi chú đầu tiên và lưu lại những điều quan trọng."}
              </p>
              {!loading && <button onClick={createEntry}>Tạo ghi chú</button>}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
