import readline from "readline";
import cp from "child_process";
import getCurrentPrice from "./priceResolver.js";

const sellOrders = [];

let currentPrice = null;
let adminBalance = 100;
let userBalance = 5000000;

const dirname = process.cwd();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function priceUpdate() {
  var child = cp.fork(dirname + "/src/priceUpdater.js");

  child.on("message", function (data) {
    currentPrice = data;
  });
}

async function handleRequests() {
  console.log(`BTC/USDT : ${currentPrice}`);

  const userType = await new Promise((resolve) =>
    rl.question("who are you? > ", (ans) => {
      if (ans === "user") {
        resolve("user");
      } else if (ans === "admin") {
        resolve("admin");
      } else {
        main();
      }
    })
  );

  let question = isUser(userType)
    ? "Enter buy price > "
    : "Enter sell price > ";

  const price = await new Promise((resolve) =>
    rl.question(question, (ans) => {
      resolve(ans);
    })
  );
  if (ifOrderShouldBePlaced(price)) {
    if (isUser(userType)) {
      handleUserPrice(price);
    } else {
      handleAdminPrice(price);
    }
  }

  await handleRequests();
}

async function main() {
  const priceBody = await getCurrentPrice();
  let body = JSON.parse(priceBody);
  currentPrice = body.price;

  await priceUpdate();
  await handleRequests();
}

main();

function isUser(userType) {
  return userType === "user";
}

function handleUserPrice(price) {
  let message = `Buy order placed for 1 btc at ${price}`;

  const boughtOrder = tryToBuy(price);

  if (boughtOrder !== null) {
    message =
      message +
      `, order matched with order ${
        boughtOrder.number + 1
      }, order executed, balance updated`;
  }
  showBalances();

  console.log(message);
}

function handleAdminPrice(price) {
  sellOrders.push(Number(price));
  console.log(`Sell order placed for 1 btc at ${price}`);
}

function ifOrderShouldBePlaced(price) {
  const percentage = Math.abs(((price - currentPrice) / currentPrice) * 100);

  return percentage <= 5 ? true : false;
}

function tryToBuy(price) {
  const bestSellPrice = getBestSellPrice();

  if (price <= bestSellPrice.min) {
    removeOrder(bestSellPrice.number);
    updateAdminWallet();
    updateUserWallet(price);

    return bestSellPrice;
  }
  return null;
}

function removeOrder(number) {
  delete sellOrders[number];
}

function showBalances() {
  console.log(`Admin Balance: ${adminBalance}`);
  console.log(`User Balance: ${userBalance}`);
}

function updateAdminWallet() {
  adminBalance--;
}

function updateUserWallet(price) {
  userBalance = userBalance - price;
}

function getBestSellPrice() {
  const minPrice = Math.min(...sellOrders);
  return {
    min: minPrice || null,
    number: sellOrders.indexOf(minPrice) || null,
  };
}
