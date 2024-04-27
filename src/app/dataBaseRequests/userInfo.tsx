export async function getUserInfo() {
  const response = await fetch("http://localhost:3001/users");
  const userInfo = await response.json();
  return userInfo;
}
