import { api } from "./api";

export async function validateUse({ face }: { face: string }) {
  const validation = await api.post("/chopp-dispenser", {
    face,
  });
  return validation.data;
}
