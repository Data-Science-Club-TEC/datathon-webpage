import type { AutoCamelCase } from "./utils";

export interface UserRow {
  id: number;
  name: string;
  last_name: string;
  username: string;
  email: string;
  gender: string;
  academic_program: string;
  school?: string;
  profile_img?: string;
  github_url?: string;
  linkedin_url?: string;
  created_at: string;
}

export type User = AutoCamelCase<Omit<UserRow, "id" | "created_at" | "gender">>;
