import { Company } from "@/schemas/company.schema";
import { UserPayload } from "./auth.dto";

export type RequestWithUser = Request & {
  user: UserPayload;
};