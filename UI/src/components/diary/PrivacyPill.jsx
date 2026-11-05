import Icon from "../Icon";

export default function PrivacyPill({ small = false }) {
  return (
    <span className={`privacy-pill${small ? " privacy-pill--small" : ""}`}>
      <Icon name="friends" size={small ? 12 : 14} /> Bạn bè
    </span>
  );
}
