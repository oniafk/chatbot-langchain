export async function getUserInfo() {
  const response = await fetch(
    "https://chatbot-langchain-backend.onrender.com/users"
  );
  const userInfo = await response.json();
  return userInfo;
}
