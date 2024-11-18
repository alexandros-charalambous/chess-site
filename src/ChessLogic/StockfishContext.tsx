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
  const { isCheckmate, isStalemate, FENString } = useChessContext();
  const [depth, setDepth] = useState<number>(12);
  const [result, setResult] = useState<StockfishAPIResponse | null>(null);
  const [error, setError] = useState<string | null>();

  const [evaluation, setEvaluation] = useState<number>(0.0);
  const [mate, setMate] = useState<number | null>(null);
  const [bestmove, setBestMove] = useState<string | null>(null);
  const [continuation, setContinuation] = useState<string | null>(null);

  const StockfishAPI = async (depth: number) => {
    setError(null);

    if (!isCheckmate && !isStalemate) {
      try {
        //https://chess-api.com/
        const response = await fetch("https://chess-api.com/v1", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fen: `${FENString}`,
            variants: 3,
            depth: depth,
            // maxThinkingTime: 50,
          }),
        });

        const data = await response.json();
        setResult({
          success: true,
          evaluation: data.eval,
          mate: data.mate,
          bestmove: data.move,
          continuation: data.continuationArr,
        });
      } catch (error: any) {
        setError("Failed to fetch analysis. Please try again.");
      }
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
