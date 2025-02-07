import sharp from "sharp";

export default defineResponseHandler(async (event) => {
  const { id } = getQuery(event);

  try {
    const avatar = `https://avatars.githubusercontent.com/u/${id}?size=100`;
    const buffer = await fetch(avatar).then((res) => res.arrayBuffer());
    return sharp(Buffer.from(buffer)).png().toBuffer();
  } catch {
    return useStorage("assets:server").getItemRaw("github/fallback.png");
  }
});
