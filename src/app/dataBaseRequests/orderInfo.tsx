export async function getOrderInfo() {
  const response = await fetch(
    "https://chatbot-langchain-backend.onrender.com/all-order-info"
  );
  const data = await response.json();

  return data;
}
