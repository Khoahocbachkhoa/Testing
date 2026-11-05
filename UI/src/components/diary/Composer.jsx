import { useState } from "react";
import Avatar from "../Avatar";
import Icon from "../Icon";
import { photos } from "../../data/diary";
import PrivacyPill from "./PrivacyPill";

export default function Composer({ onPost }) {
  const [text, setText] = useState("");
  const [expanded, setExpanded] = useState(false);

  const submit = () => {
    if (!text.trim()) {
      setExpanded(true);
      return;
    }

    onPost(text.trim());
    setText("");
    setExpanded(false);
  };

  return (
    <section
      className={`composer card${expanded ? " composer--expanded" : ""}`}
      aria-label="Tạo nhật ký"
    >
      <div className="composer__top">
        <Avatar src={photos.me} name="Minh Anh" />
        <button className="composer-input" onClick={() => setExpanded(true)}>
          {text || "Hôm nay bạn thế nào, Minh Anh?"}
        </button>
      </div>
      {expanded && (
        <textarea
          autoFocus
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Chia sẻ một chút với bạn bè..."
          aria-label="Nội dung nhật ký"
        />
      )}
      <div className="composer__bottom">
        <div className="composer__tools">
          <button className="tool-button tool-button--photo" onClick={() => setExpanded(true)}>
            <Icon name="image" size={18} /> <span>Ảnh / Video</span>
          </button>
          <button
            className="tool-button tool-button--mood"
            onClick={() => setText((current) => `${current}${current ? " " : ""}😊`)}
          >
            <Icon name="smile" size={18} /> <span>Cảm xúc</span>
          </button>
        </div>
        <div className="composer__submit">
          <PrivacyPill />
          <button className="post-button" onClick={submit} disabled={!text.trim()}>
            Đăng nhật ký
          </button>
        </div>
      </div>
    </section>
  );
}
