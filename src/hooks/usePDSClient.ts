import { AtpAgent } from "web5-api";
import { PDS_API_URL } from "@/constant/Network";

let agent: AtpAgent

export default function usePDSClient() {
  if (!agent) {
    agent = new AtpAgent({ service: PDS_API_URL });
  }
  return agent;
}