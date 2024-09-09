import { useAuthContext } from "@/hooks/useAuthContext";
import useWindowSize from "react-use/lib/useWindowSize";
import ReactConfetti from "react-confetti";

const ConfettiProvider = () => {
  const {
    state: { showConfetti },
    dispatch,
  } = useAuthContext();
  const { width, height } = useWindowSize();

  const handleComplete = () => {
    dispatch({ type: "TOGGLE_CONFETTI" });
  };

  if (!showConfetti) return null;

  return (
    <ReactConfetti
      style={{
        position: "fixed",
        pointerEvents: "none",
        zIndex: 99,
      }}
      width={width}
      height={height}
      numberOfPieces={1000}
      recycle={false}
      onConfettiComplete={handleComplete}
    />
  );
};

export default ConfettiProvider;
