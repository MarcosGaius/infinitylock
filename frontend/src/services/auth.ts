import { api } from "./api";

export async function signUpApi({
  firstName,
  lastName,
  email,
  password,
  address,
  face,
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  address: string;
  face: string;
}) {
  const user = await api.post("/auth/signup", {
    firstName,
    lastName,
    email,
    password,
    address,
    face,
  });
  return user.data;
}
