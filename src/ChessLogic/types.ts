export type Piece = 'wK' | 'wQ' | 'wR' | 'wB' | 'wN' | 'wP' | 'bK' | 'bQ' | 'bR' | 'bB' | 'bN' | 'bP' | null;

export type PromotionPiece =  'Q' | 'R' | 'B' | 'N';

export type Board = Piece[][];

export type Move = {
  from: [number, number];
  to: [number, number];
}

export type MoveHistory = {
  move: Move;
  board: Piece[][];
  piece: Piece; 
  capturedPiece?: Piece;
  fen: string;
}