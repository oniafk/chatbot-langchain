export async function getPaymentMethods() {
  const response = await fetch("http://localhost:3001/payment-methods");

  const userInfo = await response.json();

  return userInfo;
}
