const piston = require("piston-client");

const execute = (async (code, language) => {
  const client = piston({ server: "https://emkc.org" });

  const runtimes = await client.runtimes();
  // const fileContent = fs.readFileSync("main.py", "utf8");
  // [{ language: 'python', version: '3.9.4', aliases: ['py'] }, ...]

  const result = await client.execute({
    language,
    code,
  });
  console.log("result", result);
})();

module.exports = execute;
