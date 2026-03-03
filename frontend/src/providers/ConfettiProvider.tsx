import { useAuthStore } from "@/store/authStore";
import ReactConfetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";

const ConfettiProvider = () => {
  const { showConfetti, toggleConfetti } = useAuthStore();
  const { width, height } = useWindowSize();

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
      onConfettiComplete={toggleConfetti}
    />
  );
};

export default ConfettiProvider;
