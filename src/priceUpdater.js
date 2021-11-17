import getCurrentPrice from "./priceResolver.js";

setInterval(async () => {
  try {
    const data = await getCurrentPrice();
    let body = JSON.parse(data);
    process.send(body.price);
  } catch (error) {
    console.log(`Error here ${error.message}`);
  }
}, 5000);

process.on("close", function () {
  process.exit();
});
