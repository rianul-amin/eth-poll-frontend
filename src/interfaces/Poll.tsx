interface Poll {
  title: string;
  description: string;
  options: string[];
  votes: number[];
  duration: number;
  endTime: number;
  isClosed: boolean;
  status: string;
  remainingTime: number;
}
