import {
  useEffect,
  useRef,
  useState,
} from "react";

function SOSButton({
  onActivate,
  disabled = false,
}) {
  const timerRef =
    useRef(null);

  const animationRef =
    useRef(null);

  const startTimeRef =
    useRef(null);

  const activatedRef =
    useRef(false);

  const [holding, setHolding] =
    useState(false);

  const [progress, setProgress] =
    useState(0);

  const HOLD_DURATION = 3000;

  /*
    Cancel all active timers
    and animations.
  */

  const clearHoldTimers = () => {
    if (timerRef.current) {
      clearTimeout(
        timerRef.current
      );

      timerRef.current = null;
    }

    if (
      animationRef.current
    ) {
      cancelAnimationFrame(
        animationRef.current
      );

      animationRef.current =
        null;
    }

    startTimeRef.current =
      null;
  };

  /*
    Update circular hold progress.
  */

  const updateProgress = () => {
    if (
      !startTimeRef.current
    ) {
      return;
    }

    const elapsed =
      Date.now() -
      startTimeRef.current;

    const nextProgress =
      Math.min(
        (elapsed /
          HOLD_DURATION) *
          100,
        100
      );

    setProgress(
      nextProgress
    );

    if (
      nextProgress < 100
    ) {
      animationRef.current =
        requestAnimationFrame(
          updateProgress
        );
    }
  };

  /*
    Start SOS hold.
  */

  const startHold = () => {
    if (
      disabled ||
      holding ||
      timerRef.current
    ) {
      return;
    }

    activatedRef.current =
      false;

    setHolding(true);
    setProgress(0);

    startTimeRef.current =
      Date.now();

    animationRef.current =
      requestAnimationFrame(
        updateProgress
      );

    timerRef.current =
      setTimeout(() => {
        /*
          Hold completed successfully.
        */

        activatedRef.current =
          true;

        timerRef.current =
          null;

        if (
          animationRef.current
        ) {
          cancelAnimationFrame(
            animationRef.current
          );

          animationRef.current =
            null;
        }

        startTimeRef.current =
          null;

        setHolding(false);
        setProgress(100);

        /*
          Trigger emergency flow.
        */

        if (
          typeof onActivate ===
          "function"
        ) {
          onActivate();
        }
      }, HOLD_DURATION);
  };

  /*
    User released before
    3 seconds.
  */

  const cancelHold = () => {
    /*
      If SOS already activated,
      mouse/touch release should
      not reset the completed
      activation immediately.
    */

    if (
      activatedRef.current
    ) {
      activatedRef.current =
        false;

      return;
    }

    clearHoldTimers();

    setHolding(false);
    setProgress(0);
  };

  /*
    Cleanup when component
    unmounts.
  */

  useEffect(() => {
    return () => {
      clearHoldTimers();
    };
  }, []);

  /*
    Remaining seconds shown
    inside SOS button.
  */

  const remainingSeconds =
    Math.max(
      1,
      Math.ceil(
        (HOLD_DURATION -
          (progress / 100) *
            HOLD_DURATION) /
          1000
      )
    );

  return (
    <button
      type="button"
      className={`sos-trigger ${
        holding
          ? "sos-holding"
          : ""
      }`}
      disabled={disabled}
      onMouseDown={
        startHold
      }
      onMouseUp={
        cancelHold
      }
      onMouseLeave={
        cancelHold
      }
      onTouchStart={(e) => {
        e.preventDefault();

        startHold();
      }}
      onTouchEnd={(e) => {
        e.preventDefault();

        cancelHold();
      }}
      onTouchCancel={(e) => {
        e.preventDefault();

        cancelHold();
      }}
      onContextMenu={(e) =>
        e.preventDefault()
      }
      aria-label="Press and hold for three seconds to activate Silent SOS"
    >
      {/* Decorative rings */}

      <span className="sos-ring ring-two"></span>

      {/* Hold progress */}

      <span
        className="sos-progress-ring"
        style={{
          background:
            `conic-gradient(
              #ffffff ${progress}%,
              transparent ${progress}%
            )`,
        }}
      ></span>

      {/* Button Content */}

      <span className="sos-button-content">

        <i className="bi bi-shield-exclamation"></i>

        <strong>
          {holding
            ? remainingSeconds
            : "SOS"}
        </strong>

        <small>
          {holding
            ? "Keep holding"
            : "Hold 3 seconds"}
        </small>

      </span>
    </button>
  );
}

export default SOSButton;