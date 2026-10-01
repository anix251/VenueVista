const str = "ðŸŽŸï¸ ";
console.log(str);
try {
  console.log("Latin1 to UTF8:", Buffer.from(str, 'latin1').toString('utf8'));
} catch (e) {
  console.log(e);
}
try {
  console.log("Windows-1252 to UTF8:");
  const buf = Buffer.from(str, 'binary');
  console.log(buf.toString('utf8'));
} catch (e) {}
