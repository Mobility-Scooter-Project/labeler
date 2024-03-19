import { colors } from "../colors";

function LabelList({
  selected,
  active,
  editing,
  labels,
  onAddLabel,
  onRemoveLabel,
  onChangeLabel,
  onClickLabel,
}) {
  return (
    <div className="label-container">
      {labels.map((value, index) => (
        <div className="label-item" key={index}>
          <div className="label-index">{index}</div>
          <input
            type="text"
            style={{
              backgroundColor: colors[index],
              ...(editing
                ? index === 0
                  ? { width: "156px" }
                  : { width: "120px" }
                : {}),
            }}
            className={
              !editing &&
              (index === active
                ? "active-label"
                : index === selected
                ? "selected-label"
                : "")
            }
            value={value}
            onChange={(e) => onChangeLabel(index, e)}
            readOnly={index === 0 || !editing}
            onClick={() => !editing && onClickLabel(index)}
          />
          <button
            onClick={() => onRemoveLabel(index)}
            className={editing && index !== 0 ? "" : "inactive"}
          >
            -
          </button>
        </div>
      ))}
      {editing && (
        <button className="add-btn" onClick={onAddLabel}>
          +
        </button>
      )}
    </div>
  );
}

export default LabelList;
