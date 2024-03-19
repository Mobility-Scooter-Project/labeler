function Selection({ name, values, onSelect, defaultValue }) {
  // values should have no duplicates
  const handleChange = (event) => {
    onSelect(event.target.value);
  };
  return (
    <div className="selection-item">
      <div className="selection-name">{name}</div>
      <select value={defaultValue} onChange={handleChange}>
        {values.map((e, i) => (
          <option key={i} value={e}>
            {e}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Selection;
