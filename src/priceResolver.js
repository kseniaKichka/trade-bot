import https from "https";

export default function getCurrentPrice() {
  return new Promise((resolve, reject) => {
    https
      .get("https://api.binance.com/api/v3/avgPrice?symbol=BTCUSDT", (res) => {
        res.setEncoding("utf8");
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => resolve(body));
      })
      .on("error", reject);
  });
}
