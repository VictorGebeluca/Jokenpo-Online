export type Escolha = "pedra" | "papel" | "tesoura";
export type Dificuldade = "facil" | "normal" | "dificil";

/* CLIENT → SERVER */
export interface CreateRoomPayload {
  rodadas: number;
  dificuldade: Dificuldade;
}

export interface JoinRoomPayload {
  roomId: string;
}

/* SERVER → CLIENT */
export interface RoomCreatedPayload {
  roomId: string;
}

export interface PlayerJoinedPayload {
  jogadores: number;
}
