import colors from "../colors";

function LabelList({ active, editing, labels, onAddLabel, onRemoveLabel, onChangeLabel, onClickLabel }) {
  return (
    <div className="label-container">
      {labels.map((value, index) => (
        <div className="label-item" key={index} >
          <input
            type="text"
            style={{ backgroundColor: colors[index] }}
            className={!editing && index === active ? "active-label" : ""}
            value={value}
            onChange={(e) => onChangeLabel(index, e)}
            readOnly={!editing}
            onClick={() => !editing && onClickLabel(index)}
          />
          <button onClick={() => onRemoveLabel(index)} className={editing ? "" : "inactive"}>-</button>
        </div>
      ))}
      {editing && <button className="add-btn" onClick={onAddLabel}>+</button>}
    </div>
  )
}

export default LabelList;