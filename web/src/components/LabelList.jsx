function LabelList({ labels, onAddLabel, onRemoveLabel, onChangeLabel }) {
  return (
    <div className="label-container">
      {labels.map((value, index) => (
        <div className="label-item" key={index}>
          <input type="text" value={value} onChange={(e) => onChangeLabel(index, e)} />
          <button onClick={() => onRemoveLabel(index)}>-</button>
        </div>
      ))}
      <button className="add-btn" onClick={onAddLabel}>+</button>
    </div>
  )
}

export default LabelList;