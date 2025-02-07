import sharp from "sharp";

export default defineResponseHandler(async (event) => {
  const user = getRouterParam(event, "user");

  let response: Response;

  try {
    response = await fetch(
      `https://images.opencollective.com/${user}/avatar.png?width=100&height=100`
    );
  } catch {
    response = await fetch(
      `https://images.opencollective.com/opencollective/avatar.png?width=100&height=100`
    );
  }

  return sharp(Buffer.from(await response.arrayBuffer()))
    .png()
    .toBuffer();
});
