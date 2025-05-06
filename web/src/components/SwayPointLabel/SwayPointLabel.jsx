import styles from "./SwayPointLabel.module.css";
import clsx from "clsx";
import tickGreenIcon from "../../assets/tick-green-icon.svg";
import eraserIcon from "../../assets/cards_school_eraser.svg";

export function SwayPointLabel({
    onComplete,
    isRemoveSwayPpoint,
    setIsRemoveSwayPpoint,
}){
    return(
        <div className={styles.swayPointContainer}>
            <div className={styles.timeContainer}>
                <button className={styles.swayPointButton}
                >
                    Set Start Time
                </button>
                <button className={styles.swayPointButton}
                >
                    Set End Time
                </button>
            </div>
            
            <div className={styles.swayPointController}>
                <button className={styles.completeButton} onClick={onComplete}>
                Save Current Sway Boundary
                </button>
                <button
                className={clsx(
                    styles.eraserButton,
                    isRemoveSwayPpoint ? styles.isEraserActive : ""
                )}
                onClick={() => setIsRemoveSwayPpoint(!isRemoveSwayPpoint)}
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