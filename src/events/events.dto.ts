export type JoinRoomDto = {
  room: string;
};

export type ScanItemDto = {
  userId: string;
  codeData: string;
};

export type ScanUserDto = {
  userId: string;
  scannedUserId: string;
};
