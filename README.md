You can start the bot by:
```
 npm run start
```

---

For some reason, the request `https://api.binance.com/api/v3/avgPrice?symbol=BTCUSD` doesn't work for me, it always returns 
>{"code":-1121,"msg":"Invalid symbol."}

That's why I use `BTCUSDT` for retrieving current price average.

---

I didn't work a lot on screen development, I just put everything in the console. In real situations, I believe architecture is other than that

---

For supporting billions of people I would try to use horizontal scaling for processes. And, of course, no console.logs, for sure, there should be separate frontend and backend, WebSockets