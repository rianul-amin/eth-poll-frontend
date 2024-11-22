import { PollInputs } from "@/types/PollInputs";
import { PollsApiInstance } from "../api/PollsApi";

class PollsService {
  async createPoll(data: PollInputs, account: string) {
    return await PollsApiInstance!.createPoll(data, account);
  }
  async vote(pollId: number, optionIndex: number, account: string) {
    return await PollsApiInstance!.vote(pollId, optionIndex, account);
  }
  async closePoll(pollId: number, account: string) {
    return await PollsApiInstance!.closePoll(pollId, account);
  }
}

const PollsServiceInstance = new PollsService();
export { PollsService, PollsServiceInstance };
