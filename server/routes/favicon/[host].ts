import sharp from "sharp";
import icoToPng from "ico-to-png";

export default defineResponseHandler(async (event) => {
  const host = getRouterParam(event, "host");

  const defaultIco = await generateStringIco(host?.charAt(0).toUpperCase());

  if (!host) {
    return defaultIco;
  }

  try {
    return await getIcoByLinkTag(host);
  } catch (error) {}

  try {
    return await getIcoByFavicon(host);
  } catch (error) {}

  return defaultIco;
});

const LINK_TAG_REGEX =
  /((<link[^>]+rel=.(icon|shortcut icon|alternate icon|apple-touch-icon)[^>]+>))/i;

const LINK_REF_REGEX = /href=["']([^"']+)["']/i;

const RESIZE_OPTIONS = { width: 64, height: 64 };

const getIcoByLinkTag = async (host: string): Promise<Buffer> => {
  const htmlStr = await fetch(`http://${host}`).then((res) => res.text());

  const linkTag = htmlStr.match(LINK_TAG_REGEX);
  if (!linkTag) throw new Error();

  const linkRef = linkTag[1].match(LINK_REF_REGEX);
  if (!linkRef) throw new Error();

  let [_, iconUrl] = linkRef;
  iconUrl = new URL(iconUrl, `http://${host}`).toString();

  const data = await fetch(iconUrl).then((res) => res.arrayBuffer());
  const buffer = Buffer.from(data);

  if (iconUrl.endsWith(".ico")) {
    return icoToPng(Buffer.from(buffer), 32);
  }

  return sharp(Buffer.from(buffer)).resize(RESIZE_OPTIONS).png().toBuffer();
};

const getIcoByFavicon = async (host: string): Promise<Buffer> => {
  const data = await fetch(`http://${host}/favicon.ico`).then((res) =>
    res.arrayBuffer()
  );
  return await icoToPng(Buffer.from(data), 32);
};

const generateStringIco = (val?: string): Promise<Buffer> => {
  const [r, g, b] = Array.from({ length: 3 }, () =>
    Math.floor(Math.random() * 200)
  );

  const svg = `<svg width="64" height="64">
    <rect width="64" height="64" rx="16" ry="16" fill="rgb(${r},${g},${b})"/>
    <text 
      x="32"
      y="44"
      font-size="36"
      font-weight="bold"
      fill="#FFFFFF"
      text-anchor="middle"
    >${process.env.VERCEL ? "" : val}</text>
  </svg>`;

  return sharp(Buffer.from(svg)).png().toBuffer();
};
