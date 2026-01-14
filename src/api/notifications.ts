import api from "./axios";

export async function getNotificationData() {
  const response = await api.get("/notifications");
  if (response.status < 200 || response.status >= 300) {
    throw new Error("Failed to fetch user data");
  }

  console.log(response, "res");
  return response.data;
}
