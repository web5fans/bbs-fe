import { AtpAgent } from "web5-api";
import { PDS_API_URL } from "@/constant/Network";

const agent = new AtpAgent({ service: PDS_API_URL });

export default function usePDSClient() {
  return agent;
}