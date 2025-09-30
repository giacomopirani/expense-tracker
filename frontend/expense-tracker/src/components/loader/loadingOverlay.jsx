import { useEffect, useState } from "react";

const LoadingOverlay = ({ isVisible, message = "Caricamento in corso..." }) => {
  const [dots, setDots] = useState("");
  const [encouragementIndex, setEncouragementIndex] = useState(0);

  const encouragements = [
    "Stiamo preparando tutto per te...",
    "Ancora un momento...",
    "Quasi pronto!",
    "Caricamento dei tuoi dati...",
    "Autenticazione in corso...",
  ];

  useEffect(() => {
    if (!isVisible) return;

    // Animazione dei puntini
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    // Cambio messaggio ogni 4 secondi
    const messageInterval = setInterval(() => {
      setEncouragementIndex((prev) => (prev + 1) % encouragements.length);
    }, 4000);

    return () => {
      clearInterval(dotsInterval);
      clearInterval(messageInterval);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Spinner principale */}
      <div
        style={{
          width: "80px",
          height: "80px",
          border: "4px solid rgba(255, 255, 255, 0.1)",
          borderTop: "4px solid #78716C",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          marginBottom: "24px",
        }}
      />

      {/* Messaggio principale */}
      <div
        style={{
          fontSize: "20px",
          fontWeight: "600",
          color: "#ffffff",
          marginBottom: "12px",
          textAlign: "center",
        }}
      >
        {message}
      </div>

      {/* Messaggio incoraggiamento */}
      <div
        style={{
          fontSize: "14px",
          color: "rgba(255, 255, 255, 0.7)",
          textAlign: "center",
          minHeight: "20px",
          transition: "opacity 0.3s ease",
        }}
      >
        {encouragements[encouragementIndex]}
        {dots}
      </div>

      {/* Barra di progresso animata */}
      <div
        style={{
          width: "200px",
          height: "3px",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderRadius: "3px",
          overflow: "hidden",
          marginTop: "24px",
        }}
      >
        <div
          style={{
            height: "100%",
            backgroundColor: "#78716C",
            animation: "progress 2s ease-in-out infinite",
          }}
        />
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes progress {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};

export default LoadingOverlay;
