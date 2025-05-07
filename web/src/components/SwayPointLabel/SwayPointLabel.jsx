import styles from "./SwayPointLabel.module.css";
import { swayPointsText, swayPointsIndex } from "../../utils/constant";
import clsx from "clsx";
import tickGreenIcon from "../../assets/tick-blue-icon.png";
import eraserIcon from "../../assets/cards_school_eraser.svg";

export function SwayPointLabel({
    marked,
    selected,
    swayPoints = swayPointsIndex,
    onSwayPoint,
    onComplete,
    isRemoveSwayPoint,
    setIsRemoveSwayPoint,
    onSetStart,
    onSetEnd,
    timeButtonsClicked,
}){
    // Disable save current sway boundary button 
    // if all points are not marked OR end time isn't set
    // const isSaveDisabled = marked.length < 4 || !timeButtonsClicked.end;
    const isSaveDisabled = !timeButtonsClicked.end;

    return (
        <div className={styles.swayPointContainer}>
            {/* Set time Buttons */}
            <div className={styles.timeButtonsColumn}>
                <div className={styles.swayPointOption}>
                    <button 
                        type="button" 
                        className={clsx(
                            styles.timeButton,
                            timeButtonsClicked.start && styles.marked
                        )}
                        onClick={onSetStart}
                    >
                        Set Start Time
                    </button>
                    {timeButtonsClicked.start && (
                        <img
                            src={tickGreenIcon}
                            alt="green-tick"
                            className={styles.greenTickIcon}
                        />
                    )}
                </div>
                <div className={styles.swayPointOption}>
                    <button 
                        type="button" 
                        className={clsx(
                            styles.timeButton,
                            timeButtonsClicked.end && styles.marked
                        )}
                        onClick={onSetEnd}
                        disabled={marked.length < 4}
                    >
                        Set End Time
                    </button>
                    {timeButtonsClicked.end && (
                        <img
                            src={tickGreenIcon}
                            alt="green-tick"
                            className={styles.greenTickIcon}
                        />
                    )}
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
                    disabled={isMarked || !timeButtonsClicked.start}
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
                <button 
                    className={styles.completeButton} 
                    onClick={onComplete}
                    disabled={isSaveDisabled}
                >
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

