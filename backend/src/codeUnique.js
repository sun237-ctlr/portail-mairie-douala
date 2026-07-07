const { nanoid } = require('nanoid');
const QRCode = require('qrcode');

const genererCodeUnique = () => {
  const code = nanoid(8).toUpperCase();
  return code;
};

const genererQRCode = async (code) => {
  const url = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/recuperer-acte?code=${code}`;
  const qrBase64 = await QRCode.toDataURL(url, {
    width: 200,
    margin: 2,
    color: { dark: '#15803d', light: '#ffffff' }
  });
  return { qrBase64, url };
};

module.exports = { genererCodeUnique, genererQRCode };
