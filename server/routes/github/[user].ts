import sharp from "sharp";

export default defineResponseHandler(async (event) => {
  const user = getRouterParam(event, "user");

  try {
    const avatar = `https://github.com/${user}.png?size=100`;
    const buffer = await fetch(avatar).then((res) => res.arrayBuffer());
    return sharp(Buffer.from(buffer)).png().toBuffer();
  } catch {
    return useStorage("assets:server").getItemRaw("github/fallback.png");
  }
});
