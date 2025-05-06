import styles from "./SwayPointLabel.module.css";
import { swayPointsText, swayPointsIndex } from "../../utils/constant";
import clsx from "clsx";
import tickGreenIcon from "../../assets/tick-green-icon.svg";
import eraserIcon from "../../assets/cards_school_eraser.svg";

export function SwayPointLabel({
    marked,
    selected,
    swayPoints = swayPointsIndex,
    onSwayPoint,
    onComplete,
    isRemoveSwayPoint,
    setIsRemoveSwayPoint,
}){
    return (
        <div className={styles.swayPointContainer}>
            {/* Set time Buttons */}
            <div className={styles.timeButtonsColumn}>
                <div className={styles.swayPointOption}>
                    <button type="button" className={styles.timeButton}>
                        Set Start Time
                    </button>
                </div>
                <div className={styles.swayPointOption}>
                    <button type="button" className={styles.timeButton}>
                        Set End Time
                    </button>
                </div>
            </div>
            {/* Set left and right boundary buttons */}
            {swayPoints.map((value, index) => {
                const isMarked = marked.includes(value);
                return (
                <div className={styles.swayPointOption} key={index}>
                    <button
                    type="button"
                    className={clsx(
                        styles.swayPointButton,
                        isMarked
                        ? styles.marked
                        : value === selected
                        ? styles.selected
                        : ""
                    )}
                    onClick={() => {
                        onSwayPoint(value);
                        setIsRemoveSwayPoint(false);
                    }}
                    disabled={isMarked}
                    >
                    {swayPointsText[value]}
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
            {/* Set save current sway boundary button */}
            <div className={styles.swayPointController}>
                <button className={styles.completeButton} onClick={onComplete}>
                Save Current Sway Boundary
                </button>
                <button
                className={clsx(
                    styles.eraserButton,
                    isRemoveSwayPoint ? styles.isEraserActive : ""
                )}
                onClick={() => setIsRemoveSwayPoint(!isRemoveSwayPoint)}
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