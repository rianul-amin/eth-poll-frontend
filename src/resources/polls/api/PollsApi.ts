// import { getAxios } from "../../../config/axios-config";

class PollsApi {
  async createPoll({ ...params }) {
    console.log("create poll api: ", { ...params });
    return true;
  }
}

const PollsApiInstance = new PollsApi();
export { PollsApi, PollsApiInstance };
