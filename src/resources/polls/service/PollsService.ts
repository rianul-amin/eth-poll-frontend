import { PollsApiInstance } from "../api/PollsApi";

class PollsService {
  async createPoll({ ...params }) {
    const result = await PollsApiInstance.createPoll({ ...params });
    return result;
  }
}

const PollsServiceInstance = new PollsService();
export { PollsService, PollsServiceInstance };
