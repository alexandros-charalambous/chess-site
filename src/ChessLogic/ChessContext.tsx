import React, { createContext, useContext, useEffect, useState } from "react";
import {
  checkCheck,
  checkCheckmate,
  checkDrawByRepetition,
  checkInsufficientMaterial,
  checkStalemate,
  getLegalMoves,
  isPromotionMove,
  isValidMove,
  makeMove,
  updateCastleState,
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
import {
  Board,
  GameState,
  Move,
  MoveHistory,
  Piece,
  PromotionPiece,
  Result,
} from "./types";
import { wait } from "@testing-library/user-event/dist/utils";

interface ChessContextProps {
  gameState: GameState;
  result: Result;
  board: Board;
  currentPlayer: "white" | "black";
  whiteTime: number;
  blackTime: number;
  isCheckmate: boolean;
  isStalemate: boolean;
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
  currentMoveIndex: number;
  loadHistoryBoard: (moveHistory: MoveHistory, index: number) => void;
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

  const [gameState, setGameState] = useState<GameState>("initial");
  const [result, setResult] = useState<Result>({
    winner: "Draw",
    method: null,
  });
  const [board, setBoard] = useState<Board>(initialBoardSetup);
  const [currentPlayer, setCurrentPlayer] = useState<"white" | "black">(
    "white"
  );
  const [isCheckmate, setIsCheckmate] = useState<boolean>(false);
  const [isStalemate, setIsStalemate] = useState<boolean>(false);
  const [promotionSquare, setPromotionSquare] = useState<
    [number, number] | null
  >(null);
  const [promotionMove, setPromotionMove] = useState<Move | null>(null);
  const [initialTime, setInitialTime] = useState(300);
  const [whiteTime, setWhiteTime] = useState(initialTime * 1000);
  const [tempWhiteTime, setTempWhiteTime] = useState(initialTime * 1000);
  const [blackTime, setBlackTime] = useState(initialTime * 1000);
  const [tempblackTime, setTempBlackTime] = useState(initialTime * 1000);
  const [lastMove, setLastMove] = useState<Move | null>(null);
  const [legalMoves, setLegalMoves] = useState<[number, number][]>([]);
  const [moveHistory, setMoveHistory] =
    useState<MoveHistory[]>(initialMoveHistory);
  const [currentMoveIndex, setCurrentMoveIndex] = useState<number>(
    moveHistory.length - 1
  );
  const [castleState, setCastleState] = useState(initialCastleState);
  const canCastle: [boolean, boolean] = [
    castleState[currentPlayer].kingSideCastle,
    castleState[currentPlayer].queenSideCastle,
  ];
  const [FENString, setFENString] = useState<string>(initialFENString);

  const setTime = (time: number) => {
    setInitialTime(time);
    setWhiteTime(time * 1000);
    setBlackTime(time * 1000);
  };

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
        updateCastleState(
          move,
          piece,
          capturedPiece,
          castleState,
          currentPlayer
        )
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
          moveTime: getMoveTime(),
          isCheck: checkCheck(newBoard, nextPlayer, canCastle),
          isCheckmate: checkCheckmate(newBoard, nextPlayer, move, canCastle),
          fen,
        };
        return [...prevHistory, newMove];
      });

      if (gameState !== "active") {
        setGameState("active");
      }

      if (checkCheckmate(newBoard, nextPlayer, move, canCastle)) {
        setIsCheckmate(true);
        setResult({
          winner: currentPlayer === "white" ? "White" : "Black",
          method: "checkmate",
        });
        setTimeout(() => {
          setGameState("end");
        }, 800);
      } else if (checkStalemate(newBoard, nextPlayer, move, canCastle)) {
        setIsStalemate(true);
        setResult({ winner: "Draw", method: "stalemate" });
        setTimeout(() => {
          setGameState("end");
        }, 800);
      } else if (checkDrawByRepetition(moveHistory)) {
        setResult({
          winner: "Draw",
          method: "repetition",
        });
        setTimeout(() => {
          setGameState("end");
        }, 800);
      } else if (checkInsufficientMaterial(newBoard)) {
        setResult({
          winner: "Draw",
          method: "insufficient material",
        });
        setTimeout(() => {
          setGameState("end");
        }, 800);
      }
    }
  };

  useEffect(() => {
    if (blackTime <= 0 || whiteTime <= 0) {
      setResult({
        winner: blackTime <= 0 ? "White" : "Black",
        method: "timeout",
      });
      setTimeout(() => {
        setGameState("end");
      }, 800);
    }
  }, [whiteTime, blackTime]);

  const getMoveTime = (): number => {
    if (currentPlayer === "white") {
      const moveTime = tempWhiteTime - whiteTime;
      setTempWhiteTime(tempWhiteTime - moveTime);
      return moveTime;
    } else {
      const moveTime = tempblackTime - blackTime;
      setTempBlackTime(tempblackTime - moveTime);
      return moveTime;
    }
  };

  useEffect(() => {
    if (gameState !== "active") return;

    const timer = setInterval(() => {
      if (currentPlayer === "white") {
        setWhiteTime((prevTime) => Math.max(prevTime - 100, 0));
      } else {
        setBlackTime((prevTime) => Math.max(prevTime - 100, 0));
      }
    }, 100);
    return () => clearInterval(timer);
  }, [currentPlayer, gameState]);

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

  const loadHistoryBoard = (moveHistory: MoveHistory, index: number) => {
    setBoard(deepCopyBoard(moveHistory.board));
    setCurrentMoveIndex(index);
    setFENString(moveHistory.fen);
    setLegalMoves([]);
  };

  useEffect(() => {
    setCurrentMoveIndex(moveHistory.length - 1);
  }, [moveHistory.length]);

  const startGame = () => {
    setGameState("start");
    setIsCheckmate(false);
    setIsStalemate(false);
    setWhiteTime(initialTime * 1000);
    setTempWhiteTime(initialTime * 1000);
    setBlackTime(initialTime * 1000);
    setTempBlackTime(initialTime * 1000);
    setBoard(initialBoardSetup());
    setCurrentPlayer("white");
    setMoveHistory(initialMoveHistory);
    setCurrentMoveIndex(0);
    setCastleState(initialCastleState);
    setFENString("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    resetFENCounters();
  };

  const resetBoard = () => {
    setGameState("initial");
    setIsCheckmate(false);
    setIsStalemate(false);
    setPromotionSquare(null);
    setPromotionMove(null);
    setWhiteTime(initialTime * 1000);
    setTempWhiteTime(initialTime * 1000);
    setBlackTime(initialTime * 1000);
    setTempBlackTime(initialTime * 1000);
    setBoard(initialBoardSetup());
    setCurrentPlayer("white");
    setLegalMoves([]);
    setMoveHistory(initialMoveHistory);
    setCurrentMoveIndex(0);
    setCastleState(initialCastleState);
    setFENString("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    resetFENCounters();
  };

  const value = {
    gameState,
    result,
    board,
    currentPlayer,
    whiteTime,
    blackTime,
    isCheckmate,
    isStalemate,
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
    currentMoveIndex,
    loadHistoryBoard,
    FENString,
  };

  return (
    <ChessContext.Provider value={value}>{children}</ChessContext.Provider>
  );
};
