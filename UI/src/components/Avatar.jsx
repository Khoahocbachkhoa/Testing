export default function Avatar({ src, name, size = "normal", online = false }) {
  return (
    <span className={`avatar avatar--${size}${online ? " avatar--online" : ""}`}>
      <img src={src} alt={name} />
    </span>
  );
}
