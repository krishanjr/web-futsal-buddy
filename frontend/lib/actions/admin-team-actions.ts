"use server";

export async function createTeamAction(formData: FormData) {
  const name = String(formData.get("name") || "");
  return { success: true, message: `Team created: ${name}` };
}
