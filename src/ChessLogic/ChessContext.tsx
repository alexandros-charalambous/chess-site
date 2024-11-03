import React, { createContext, useContext, useState } from "react";
import {
  checkCheckmate,
  getLegalMoves,
  isValidMove,
  makeMove,
} from "./chessLogic";
import {
  initialBoardSetup,
  initialFENString,
  initialMoveHistory,
} from "./chessUtils";
import {
  boardToFEN,
  getCastlingAvailability,
  getEnPassantTarget,
  getFullMoveNumber,
  getHalfMoveClock,
  resetFENCounters,
} from "./fenUtil";
import { Board, Move, MoveHistory } from "./types";

interface ChessContextProps {
  board: Board;
  currentPlayer: "white" | "black";
  isCheckmate: boolean;
  legalMoves: [number, number][];
  lastMove: Move | null;
  handleMove: (from: [number, number], to: [number, number]) => void;
  handleLegalMove: (from: [number, number]) => void;
  resetLegalMove: () => void;
  resetBoard: () => void;
  moveHistory: MoveHistory[];
  loadHistoryBoard: (moveHistory: MoveHistory) => void;
  FENString: string;
}

const ChessContext = createContext<ChessContextProps | undefined>(undefined);

export const useChessContext = () => {
  const context = useContext(ChessContext);
  if (!context) {
    throw new Error("useChessContext must be used within a ChessProvider");
  }
  return context;
};

export const ChessProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const initialCastleState = {
    white: {
      king: false,
      rookKingside: false,
      rookQueenside: false,
    },
    black: {
      king: false,
      rookKingside: false,
      rookQueenside: false,
    },
  };

  const [board, setBoard] = useState<Board>(initialBoardSetup);
  const [currentPlayer, setCurrentPlayer] = useState<"white" | "black">(
    "white"
  );
  const [isCheckmate, setIsCheckmate] = useState<boolean>(false);
  const [lastMove, setLastMove] = useState<Move | null>(null);
  const [legalMoves, setLegalMoves] = useState<[number, number][]>([]);
  const [moveHistory, setMoveHistory] =
    useState<MoveHistory[]>(initialMoveHistory);
  const [currentBoard, setCurrentBoard] = useState<Board>(initialBoardSetup);
  const [castleState, setCastleState] = useState(initialCastleState);
  const canCastle: [boolean, boolean, boolean] = [
    castleState[currentPlayer].king,
    castleState[currentPlayer].rookKingside,
    castleState[currentPlayer].rookQueenside,
  ];
  const [FENString, setFENString] = useState<string>(initialFENString);
  const deepCopyBoard = (board: Board): Board => {
    return board.map((row) => [...row]);
  };

  const handleMove = (from: [number, number], to: [number, number]) => {
    const move: Move = { from, to };
    const piece = board[from[0]][from[1]];

    const capturedPiece = board[to[0]][to[1]];
    if (isValidMove(move, board, currentPlayer, lastMove, canCastle)) {
      const newBoard = makeMove(move, board);
      const fen = boardToFEN(
        board,
        currentPlayer === "white" ? "black" : "white",
        getCastlingAvailability(castleState),
        getEnPassantTarget(move, board[from[0]][from[1]]),
        getHalfMoveClock(board[from[0]][from[1]], capturedPiece !== null),
        getFullMoveNumber(currentPlayer)
      );

      setBoard(newBoard);
      setCurrentBoard(board);
      setCurrentPlayer(currentPlayer === "white" ? "black" : "white");
      setLastMove(move);
      setLegalMoves([]);
      setCastleState(updateCastleState(move, castleState));
      setFENString(fen);
      setMoveHistory((prevHistory) => {
        const newMove = {
          move,
          board: deepCopyBoard(board),
          piece,
          capturedPiece: capturedPiece || undefined,
          fen,
        };
        return [...prevHistory, newMove];
      });
      if (
        checkCheckmate(
          newBoard,
          currentPlayer === "white" ? "black" : "white",
          move,
          canCastle
        )
      ) {
        setIsCheckmate(true);
      }
    }
  };

  const updateCastleState = (
    move: Move,
    castleState: {
      white: { king: boolean; rookKingside: boolean; rookQueenside: boolean };
      black: { king: boolean; rookKingside: boolean; rookQueenside: boolean };
    }
  ) => {
    const piece = board[move.to[0]][move.to[1]];
    const color = currentPlayer;

    if (piece?.substring(1, 2) === "K") {
      castleState[color].king = true;
    } else if (piece?.substring(1) === "R") {
      if (move.from[1] === 0) {
        castleState[color].rookQueenside = true;
      } else if (move.from[1] === 7) {
        castleState[color].rookKingside = true;
      }
    }

    return castleState;
  };

  const handleLegalMove = (from: [number, number]) => {
    if (board[from[0]][from[1]] === null) {
      resetLegalMove();
    } else {
      setLegalMoves(
        getLegalMoves(from, board, currentPlayer, lastMove, canCastle)
      );
    }
  };

  const resetLegalMove = () => {
    setLegalMoves([]);
  };

  const loadHistoryBoard = (moveHistory: MoveHistory) => {
    setBoard(deepCopyBoard(moveHistory.board));
    setFENString(moveHistory.fen);
    setLegalMoves([]);
  };

  const resetBoard = () => {
    setIsCheckmate(false);
    setBoard(initialBoardSetup());
    setCurrentBoard(initialBoardSetup);
    setCurrentPlayer("white");
    setLegalMoves([]);
    setMoveHistory(initialMoveHistory);
    setCastleState(initialCastleState);
    setFENString("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    resetFENCounters();
  };

  const value = {
    board,
    currentPlayer,
    isCheckmate,
    legalMoves,
    lastMove,
    handleMove,
    handleLegalMove,
    resetLegalMove,
    resetBoard,
    moveHistory,
    loadHistoryBoard,
    FENString,
  };

  return (
    <ChessContext.Provider value={value}>{children}</ChessContext.Provider>
  );
};
