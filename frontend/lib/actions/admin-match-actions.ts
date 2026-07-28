"use server";

export async function createMatchAction(formData: FormData) {
  const title = String(formData.get("title") || "");
  return { success: true, message: `Match created: ${title}` };
}
