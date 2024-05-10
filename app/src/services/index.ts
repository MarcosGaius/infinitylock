"use server";

export const publishMessage = async () => {
  const res = await fetch(process.env.NEXT_API_URL + "/mqtt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return "ok";
};
