const EntryCard = ({ entry }) => {
  const cardStyle = {
    marginTop: 48,
    padding: 24,
    backgroundColor: "#1C222C",
    border: "1px solid #2E3644",
    borderRadius: 10,
  };

  const labelStyle = {
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    color: "#97A1B3",
    margin: 0,
  };

  const valueStyle = {
    fontSize: 16,
    margin: "6px 0 0",
  };

  const imageStyle = {
    width: "100%",
    height: 180,
    backgroundColor: "#2E3644",
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
  };

  return (
    <div style={cardStyle}>
      {entry.image && (
        <div style={imageStyle}></div>
      )}
      <h3 style={{ fontSize: 20, fontWeight: 700, color: "#FFFFFF", margin: "0 0 12px" }}>
        {entry.khmerTitle}
      </h3>
      <p style={{ fontSize: 16, color: "#97A1B3", lineHeight: 1.6, margin: 0 }}>
        {entry.description}
      </p>
      <div style={{ display: "flex", gap: "12px", marginTop: 12 }}>
        <p style={labelStyle}>Contributor:</p>
        <p style={valueStyle}>{entry.contributor}</p>
        <p style={labelStyle}>Place:</p>
        <p style={valueStyle}>{entry.place}</p>
      </div>
    </div>
  );
};

export default EntryCard;