import React, { createContext, useContext, useEffect, useState } from "react";
import { useChessContext } from "./ChessContext";

interface StockfishAPIResponse {
  success?: boolean;
  evaluation: number;
  mate: number | null;
  bestmove: string | null;
  continuation: string | null;
}
const StockfishContext = createContext<StockfishAPIResponse | undefined>(
  undefined
);

export const useStockfishContext = () => {
  const context = useContext(StockfishContext);
  if (!context) {
    throw new Error("useChessContext must be used within a ChessProvider");
  }
  return context;
};

export const StockfishProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { FENString } = useChessContext();
  const [depth, setDepth] = useState<number>(12);
  const [result, setResult] = useState<StockfishAPIResponse | null>(null);
  const [error, setError] = useState<string | null>();

  const [evaluation, setEvaluation] = useState<number>(0.0);
  const [mate, setMate] = useState<number | null>(null);
  const [bestmove, setBestMove] = useState<string | null>(null);
  const [continuation, setContinuation] = useState<string | null>(null);

  const StockfishAPI = async (depth: number) => {
    setError(null);
    try {
      const response = await fetch(
        `https://stockfish.online/api/s/v2.php?fen=${FENString}&depth=${depth}`
      );

      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      setError("Failed to fetch analysis. Please try again.");
    }
  };

  useEffect(() => {
    StockfishAPI(depth);
  }, [FENString, depth]);

  useEffect(() => {
    setEvaluation(result === null ? 0 : result.evaluation);
    setMate(result === null ? null : result.mate);
    setBestMove(result === null ? null : result.bestmove);
    setContinuation(result === null ? null : result.continuation);
  }, [result]);

  const value = { evaluation, mate, bestmove, continuation };

  return (
    <StockfishContext.Provider value={value}>
      {children}
    </StockfishContext.Provider>
  );
};
