import { Box, Typography } from "@mui/material";
import { useChessContext } from "../../ChessLogic/ChessContext";
import { useEffect, useState } from "react";

interface StockfishAPIResponse {
  success: boolean;
  evaluation: string;
  mate: string;
  bestmove: string;
  continuation:string;
}

const FENBox: React.FC = () => {
  const { FENString } = useChessContext();

  const [depth, setDepth] = useState<number>(12);
  const [result, setResult] = useState<StockfishAPIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const StockfishAPI = async (depth: number) => {
      setError(null);    
      try {
        const response = await fetch(`https://stockfish.online/api/s/v2.php?fen=${FENString}&depth=${depth}`);
  
        const data = await response.json();
        setResult(data);
      } catch (error: any) {
        setError("Failed to fetch analysis. Please try again.");
      }
  };


  useEffect(() => {
    StockfishAPI(depth);
  }, [FENString, depth]);
  
  return (
    <Box
      sx={{
        width: "25vw",
        padding: 2,
        bgcolor: "#0000002e",
        boxShadow: "0 3px 4px 0px #000000",
      }}
    >
    <Typography color="#ffffff" variant="caption">
      {FENString}
    </Typography>
    <Box/>
      <Typography color="#ffffff" variant="caption">
        {result?.success}
        {result?.evaluation}
        {result?.mate}
        {result?.bestmove}
        {result?.continuation}
      </Typography>
    </Box>
  );
};

export default FENBox;
