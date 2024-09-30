import { Button } from "@mui/material";
import { useChessContext } from "./ChessContext";

const ResetButton: React.FC = () => {
  const { resetBoard } = useChessContext();

  return (
    <>
      <Button variant="contained" color="secondary" onClick={resetBoard}>
        Reset
      </Button>
    </>
  );
};

export default ResetButton;