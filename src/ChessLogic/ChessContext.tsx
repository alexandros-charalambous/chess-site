import React, { createContext, useContext, useEffect, useState } from "react";
import {
  checkCheckmate,
  checkStalemate,
  getLegalMoves,
  isPromotionMove,
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
import { Board, Move, MoveHistory, Piece, PromotionPiece } from "./types";

interface ChessContextProps {
  gameStarted: boolean;
  board: Board;
  currentPlayer: "white" | "black";
  whiteTime: number;
  blackTime: number;
  isCheckmate: boolean;
  isStalemate: boolean;
  isGameActive: boolean;
  promotionSquare: [number, number] | null;
  promotionMove: Move | null;
  legalMoves: [number, number][];
  lastMove: Move | null;
  startGame: () => void;
  setTime: (time: number) => void;
  handleMove: (from: [number, number], to: [number, number]) => void;
  completeMove: (
    from: [number, number],
    to: [number, number],
    promotionPiece?: PromotionPiece
  ) => void;
  cancelPromotion: () => void;
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
      kingSideCastle: false,
      queenSideCastle: false,
    },
    black: {
      kingSideCastle: false,
      queenSideCastle: false,
    },
  };

  const [gameStarted, setGameStarted] = useState(false);
  const [board, setBoard] = useState<Board>(initialBoardSetup);
  const [currentPlayer, setCurrentPlayer] = useState<"white" | "black">(
    "white"
  );
  const [isCheckmate, setIsCheckmate] = useState<boolean>(false);
  const [isStalemate, setIsStalemate] = useState<boolean>(false);
  const [isGameActive, setIsGameActive] = useState(false);
  const [promotionSquare, setPromotionSquare] = useState<
    [number, number] | null
  >(null);
  const [promotionMove, setPromotionMove] = useState<Move | null>(null);
  const [initialTime, setInitialTime] = useState(300);
  const [whiteTime, setWhiteTime] = useState(initialTime * 1000);
  const [blackTime, setBlackTime] = useState(initialTime * 1000);
  const [lastMove, setLastMove] = useState<Move | null>(null);
  const [legalMoves, setLegalMoves] = useState<[number, number][]>([]);
  const [moveHistory, setMoveHistory] =
    useState<MoveHistory[]>(initialMoveHistory);
  const [castleState, setCastleState] = useState(initialCastleState);
  const canCastle: [boolean, boolean] = [
    castleState[currentPlayer].kingSideCastle,
    castleState[currentPlayer].queenSideCastle,
  ];
  const [FENString, setFENString] = useState<string>(initialFENString);
  const deepCopyBoard = (board: Board): Board => {
    return board.map((row) => [...row]);
  };

  const handleMove = (from: [number, number], to: [number, number]) => {
    const move: Move = { from, to };

    if (
      isValidMove(move, board, currentPlayer, lastMove, canCastle) &&
      !isCheckmate &&
      !isStalemate
    ) {
      if (isPromotionMove(board, move)) {
        setPromotionSquare(to);
        setPromotionMove(move);
      } else {
        completeMove(from, to);
      }
    }
  };

  const completeMove = (
    from: [number, number],
    to: [number, number],
    promotionPiece?: PromotionPiece
  ) => {
    const move: Move = { from, to };
    const piece = board[from[0]][from[1]];
    const capturedPiece = board[to[0]][to[1]];
    if (isValidMove(move, board, currentPlayer, lastMove, canCastle)) {
      const newBoard = makeMove(move, board, promotionPiece);
      const nextPlayer = currentPlayer === "white" ? "black" : "white";

      setPromotionSquare(null);
      setPromotionMove(null);

      setBoard(newBoard);
      setCurrentPlayer(nextPlayer);
      setLastMove(move);
      setLegalMoves([]);
      setCastleState(
        updateCastleState(move, piece, capturedPiece, castleState)
      );

      const fen = boardToFEN(
        board,
        nextPlayer,
        getCastlingAvailability(castleState),
        getEnPassantTarget(move, board[from[0]][from[1]]),
        getHalfMoveClock(board[from[0]][from[1]], capturedPiece !== null),
        getFullMoveNumber(currentPlayer)
      );
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

      if (!isGameActive) {
        setIsGameActive(true);
      }

      if (checkCheckmate(newBoard, nextPlayer, move, canCastle)) {
        setIsCheckmate(true);
        setIsGameActive(false);
        setGameStarted(false);
      } else if (checkStalemate(newBoard, nextPlayer, move, canCastle)) {
        setIsStalemate(true);
        setIsGameActive(false);
        setGameStarted(false);
      }
    }
  };

  useEffect(() => {
    if (!isGameActive) return;

    const timer = setInterval(() => {
      if (currentPlayer === "white") {
        setWhiteTime((prevTime) => Math.max(prevTime - 100, 0));
      } else {
        setBlackTime((prevTime) => Math.max(prevTime - 100, 0));
      }
    }, 100);
    return () => clearInterval(timer);
  }, [currentPlayer, isGameActive]);

  const updateCastleState = (
    move: Move,
    piece: Piece,
    capturedPiece: Piece,
    castleState: {
      white: { kingSideCastle: boolean; queenSideCastle: boolean };
      black: { kingSideCastle: boolean; queenSideCastle: boolean };
    }
  ) => {
    const color = currentPlayer;
    const opponentColor = color === "white" ? "black" : "white";

    if (piece?.substring(1, 2) === "K") {
      castleState[color].kingSideCastle = true;
      castleState[color].queenSideCastle = true;
    }

    if (piece?.substring(1, 2) === "R") {
      if (move.from[1] === 0) {
        castleState[color].queenSideCastle = true;
      } else if (move.from[1] === 7) {
        castleState[color].kingSideCastle = true;
      }
    }
    if (capturedPiece?.substring(1, 2) === "R") {
      if (
        move.to[0] === (opponentColor === "white" ? 7 : 0) &&
        move.to[1] === 0
      ) {
        castleState[opponentColor].queenSideCastle = true;
      } else if (
        move.to[0] === (opponentColor === "white" ? 7 : 0) &&
        move.to[1] === 7
      ) {
        castleState[opponentColor].kingSideCastle = true;
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

  const cancelPromotion = () => {
    setPromotionSquare(null);
    setPromotionMove(null);
  };

  const setTime = (time: number) => {
    setInitialTime(time);
  };

  const loadHistoryBoard = (moveHistory: MoveHistory) => {
    setBoard(deepCopyBoard(moveHistory.board));
    setFENString(moveHistory.fen);
    setLegalMoves([]);
  };

  const startGame = () => {
    setGameStarted(true);
    setIsCheckmate(false);
    setIsStalemate(false);
    setIsGameActive(false);
    setWhiteTime(initialTime * 1000);
    setBlackTime(initialTime * 1000);
    setBoard(initialBoardSetup());
    setCurrentPlayer("white");
    setMoveHistory(initialMoveHistory);
    setCastleState(initialCastleState);
    setFENString("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    resetFENCounters();
  };

  const resetBoard = () => {
    setGameStarted(false);
    setIsCheckmate(false);
    setIsStalemate(false);
    setIsGameActive(false);
    setPromotionSquare(null);
    setPromotionMove(null);
    setWhiteTime(initialTime * 1000);
    setBlackTime(initialTime * 1000);
    setBoard(initialBoardSetup());
    setCurrentPlayer("white");
    setLegalMoves([]);
    setMoveHistory(initialMoveHistory);
    setCastleState(initialCastleState);
    setFENString("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    resetFENCounters();
  };

  const value = {
    gameStarted,
    board,
    currentPlayer,
    whiteTime,
    blackTime,
    isCheckmate,
    isStalemate,
    isGameActive,
    promotionSquare,
    promotionMove,
    legalMoves,
    lastMove,
    startGame,
    setTime,
    handleMove,
    completeMove,
    cancelPromotion,
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
