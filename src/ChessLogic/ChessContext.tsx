import React, { createContext, useContext, useState } from "react";
import { getLegalMoves, isValidMove, makeMove } from "./chessLogic";
import { initialBoardSetup } from "./chessUtils";
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
  legalMoves: [number, number][];
  lastMove: Move | null;
  handleMove: (from: [number, number], to: [number, number]) => void;
  handleLegalMove: (from: [number, number]) => void;
  resetBoard: () => void;
  moveHistory: MoveHistory[];
  loadHistoryBoard: (board: Board) => void;
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

  const initialMoveHistory: MoveHistory[] = [
    {
      move: {
        from: [0, 0],
        to: [0, 0],
      },
      board: initialBoardSetup().map((row) => [...row]),
      piece: null,
      capturedPiece: undefined,
    },
  ];

  const [board, setBoard] = useState<Board>(initialBoardSetup);
  const [currentPlayer, setCurrentPlayer] = useState<"white" | "black">(
    "white"
  );
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
  const [FENString, setFENString] = useState<string>(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  );
  const deepCopyBoard = (board: Board): Board => {
    return board.map((row) => [...row]);
  };

  const handleMove = (from: [number, number], to: [number, number]) => {
    const move: Move = { from, to };
    const piece = board[from[0]][from[1]];
    const capturedPiece = board[to[0]][to[1]];
    if (isValidMove(move, board, currentPlayer, lastMove, canCastle)) {
      setBoard(makeMove(move, board));
      setCurrentBoard(board);
      setLastMove(move);
      setLegalMoves([]);
      updatecastleState(move, castleState);
      setFENString(
        boardToFEN(
          board,
          currentPlayer,
          getCastlingAvailability(castleState),
          getEnPassantTarget(move, board[from[0]][from[1]]),
          getHalfMoveClock(board[from[0]][from[1]], capturedPiece !== null),
          getFullMoveNumber(currentPlayer)
        )
      );
      setMoveHistory((prevHistory) => {
        const newMove = {
          move,
          board: deepCopyBoard(board),
          piece,
          capturedPiece: capturedPiece || undefined,
        };
        return [...prevHistory, newMove];
      });
      setCurrentPlayer(currentPlayer === "white" ? "black" : "white");
    }
  };

  const updatecastleState = (
    move: Move,
    castleState: {
      white: { king: boolean; rookKingside: boolean; rookQueenside: boolean };
      black: { king: boolean; rookKingside: boolean; rookQueenside: boolean };
    }
  ) => {
    const piece = board[move.from[0]][move.from[1]];
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
    setCastleState(castleState);
  };

  const handleLegalMove = (from: [number, number]) => {
    if (board[from[0]][from[1]] === null) {
      setLegalMoves([]);
    } else {
      setLegalMoves(
        getLegalMoves(from, board, currentPlayer, lastMove, canCastle)
      );
    }
  };

  const loadHistoryBoard = (board: Board) => {
    setBoard(deepCopyBoard(board));
    setLegalMoves([]);
  };

  const resetBoard = () => {
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
    legalMoves,
    lastMove,
    handleMove,
    handleLegalMove,
    resetBoard,
    moveHistory,
    loadHistoryBoard,
    FENString,
  };

  return (
    <ChessContext.Provider value={value}>{children}</ChessContext.Provider>
  );
};
