import { supabase } from "../lib/supabase";

export async function getUsers() {
  const { data, error } = await supabase
    .from("users")
    .select(
      "id, name, last_name, username, email, academic_program, school, profile_img",
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`No se pudieron cargar los usuarios: ${error.message}`);
  }

  return data;
}
