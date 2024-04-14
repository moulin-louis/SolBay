import { v4 as uuidv4 } from "uuid";

export default defineEventHandler(async (event) => {
  try {
    const auction = await readBody(event);
    auction.id = uuidv4();
    auction.created = new Date().toISOString();
    auction.status = "open";
    auction.bids = [];
    auction.current_price = 0;
    await useStorage("db").setItem(auction.id.toString(), auction);
    return {
      status: 200,
      data: "Good!",
    };
  } catch (e) {
    console.log("error when creating auction", e);
    return {
      status: 500,
      data: JSON.stringify({ error: "error when creating auction" }),
    };
  }
});
