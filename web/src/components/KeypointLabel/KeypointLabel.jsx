import { keypointsText, keypointsIndex } from "../../utils/constant";
import styles from "./KeypointLabel.module.css";
import clsx from "clsx";
import tickGreenIcon from "../../assets/tick-green-icon.svg";
import eraserIcon from "../../assets/cards_school_eraser.svg";
export function KeypointLabel({
  selected,
  marked,
  keypoints = keypointsIndex,
  onKeypoint,
  onComplete,
  isRemoveKeypoint,
  setIsRemoveKeypoint,
}) {
  return (
    <div className={styles.keypointContainer}>
      {keypoints.map((value, index) => {
        const isMarked = marked.includes(value);
        return (
          <div className={styles.keypointOption} key={index}>
            <button
              type="button"
              className={clsx(
                styles.keypointButton,
                isMarked
                  ? styles.marked
                  : value === selected
                  ? styles.selected
                  : ""
              )}
              onClick={() => {
                onKeypoint(value);
                setIsRemoveKeypoint(false);
              }}
              disabled={isMarked}
            >
              {keypointsText[value]}
            </button>
            {isMarked && (
              <img
                src={tickGreenIcon}
                alt="green-tick"
                className={styles.greenTickIcon}
              />
            )}
          </div>
        );
      })}
      <div className={styles.keypointController}>
        <button className={styles.completeButton} onClick={onComplete}>
          Save Current Frame Keypoint
        </button>
        <button
          className={clsx(
            styles.eraserButton,
            isRemoveKeypoint ? styles.isEraserActive : ""
          )}
          onClick={() => setIsRemoveKeypoint(!isRemoveKeypoint)}
        >
          <img
            className={styles.eraserIcon}
            src={eraserIcon}
            alt="eraser-icon"
          />
        </button>
      </div>
    </div>
  );
}
