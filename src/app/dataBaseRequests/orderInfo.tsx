export async function getOrderInfo() {
  const response = await fetch("http://localhost:3001/all-order-info");
  const data = await response.json();
  console.log(data);
  return data;
}
