export default function generateRoomCode() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";

  for (let i = 0; i < 9; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
    if (i % 3 === 2 && i < 8) {
      code += "-";
    }
  }

  return code;
}
