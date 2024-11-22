interface PollInfo {
  0: string; // title
  1: string; // description
  2: string[]; // options
  3: number[]; // votes
  4: number; // duration
  5: number; // endTime
  6: boolean; // isClosed
  7: string; // status
  8: number; // remainingTime
}
