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
      <h3 style={{ fontSize: 20, fontWeight: 700, color: "#FFFFFF", margin: "0 0 8px" }}>
        {entry.title}
      </h3>
      <h4 style={{ fontSize: 16, fontWeight: 500, color: "#D0D8E8", margin: "0 0 8px" }}>
        {entry.khmerTitle}
      </h4>
      <p style={{ fontSize: 16, color: "#97A1B3", lineHeight: 1.6, margin: 0 }}>
        {entry.description}
      </p>
      <div style={{ display: "flex", gap: "12px", marginTop: 12, alignItems: "center" }}>
        <p style={labelStyle}>Contributor:</p>
        <span style={valueStyle}>---</span>
        <p style={{...labelStyle, margin: "0 4px"}}>---</p>
        <p style={labelStyle}>Place:</p>
        <span style={valueStyle}>---</span>
      </div>
    </div>
  );
};

export default EntryCard;