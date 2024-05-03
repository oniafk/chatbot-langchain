export async function getPaymentMethods() {
  const response = await fetch(
    "https://chatbot-langchain-backend.onrender.com/payment-methods"
  );
  const userInfo = await response.json();
  return userInfo;
}
