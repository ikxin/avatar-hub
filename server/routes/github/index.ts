import sharp from "sharp";

export default defineResponseHandler(async (event) => {
  const { id } = getQuery(event);

  const avatarUrl = `https://avatars.githubusercontent.com/u/${id}?size=100`;

  const response = await fetch(avatarUrl);

  return sharp(Buffer.from(await response.arrayBuffer()))
    .png()
    .toBuffer();
});
