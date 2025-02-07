import sharp from "sharp";

export default defineResponseHandler(async (event) => {
  const user = getRouterParam(event, "user");

  let response: Response;

  try {
    response = await fetch(`https://github.com/${user}.png?size=100`);
  } catch {
    response = await fetch(`https://github.com/github.png?size=100`);
  }

  return sharp(Buffer.from(await response.arrayBuffer()))
    .png()
    .toBuffer();
});
