#!/usr/bin/env node
// @ paw.js — Paw language (transpiler Bear→JS) tokenizer-safe CLI
// @ Usage:
//  @ paw file.paw            # run
//  @ paw file.paw --out a.js # write compiled JS

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const dict = {
  lepas: "let",
  deklar: "const",
  var: "var",
  benar: "true",
  salah: "false",
  fungsi: "async function",
  fungsinya: "function",
  balik: "return",
  lanjut: "continue",
  stop: "break",
  jika: "if",
  maka: "else",
  looping: "while",
  untuk: "for",
  ganti: "switch",
  menu: "case",
  awal: "default",
  lempar: "throw",
  tunggu: "await",
  ambil: "import",
  kasih: "export",
  dari: "require",
  kelas: "class",
  perluas: "extends",
  konstruk: "constructor",
  ini: "this",
  kosong: "null",
  ngga: "undefined",
  jenis: "typeof",
  contoh: "instanceof",
  baru: "new",
  hapus: "delete"
};

// @ ----- Tokenizer -----
function tokenize(src) {
  const tokens = [];
  let i = 0;
  while (i < src.length) {
    const ch = src[i];

    // @ string literal
    if (ch === '"' || ch === "'" || ch === "`") {
      const quote = ch;
      let val = ch; i++;
      while (i < src.length) {
        const c = src[i];
        val += c;
        if (c === "\\" && i + 1 < src.length) { val += src[i+1]; i += 2; continue; }
        i++;
        if (c === quote) break;
      }
      tokens.push({ type: "string", value: val });
      continue;
    }

    // @ line comment //
    if (ch === "/" && src[i+1] === "/") {
      let val = "";
      while (i < src.length && src[i] !== "\n") val += src[i++];
      tokens.push({ type: "comment", value: val });
      continue;
    }

    // @ block comment /* */
    if (ch === "/" && src[i+1] === "*") {
      let val = "/*"; i += 2;
      while (i < src.length) {
        if (src[i] === "*" && src[i+1] === "/") { val += "*/"; i += 2; break; }
        val += src[i++];
      }
      tokens.push({ type: "comment", value: val });
      continue;
    }

    // @ identifier/word
    if (/[A-Za-z_$]/.test(ch)) {
      let val = "";
      while (i < src.length && /[A-Za-z0-9_$]/.test(src[i])) val += src[i++];
      tokens.push({ type: "word", value: val });
      continue;
    }

    // @ whitespace or symbol
    tokens.push({ type: "symbol", value: ch });
    i++;
  }
  return tokens;
}

// @ ----- Compile -----
function compilePaw(src) {
  const tokens = tokenize(src);
  const out = [];
  let i = 0;

  while (i < tokens.length) {
    const t = tokens[i];

    // @ preserve strings/comments/symbols
    if (t.type !== "word") {
      out.push(t.value);
      i++;
      continue;
    }

    // @ special: cobaerror -> try { ... } catch(error) { console.error(...); }
    if (t.value === "cobaerror") {
      out.push("try");
      i++;
      continue;
    }

    // @ special: saat used as while in "do { } saat (cond)" -> handled by mapping below
    if (t.value === "saat") {
      out.push("while");
      i++;
      continue;
    }

    // @ special: ulang(expr) { ... } -> for (let __iN=0; __iN<(expr); __iN++) { ... }
    if (t.value === "ulang") {
      // @ find "("
      let j = i + 1;
      while (j < tokens.length && tokens[j].value !== "(") j++;
      if (j >= tokens.length) { out.push("ulang"); i++; continue; }
      // @ extract expr until matching ")"
      let depth = 0, expr = "";
      j++; // @ start after "("
      while (j < tokens.length) {
        const v = tokens[j].value;
        if (v === "(") { depth++; expr += v; }
        else if (v === ")") {
          if (depth === 0) { j++; break; }
          depth--; expr += v;
        } else {
          expr += v;
        }
        j++;
      }
      const id = `__i${Math.floor(Math.random()*1e9).toString(36)}`;
      out.push(`for(let ${id}=0; ${id}<(${expr}); ${id}++)`);
      i = j;
      continue;
    }

    // @ normal keyword mapping (safe, word boundaries ensured by tokenizer)
    if (dict[t.value]) {
      out.push(dict[t.value]);
    } else {
      out.push(t.value);
    }
    i++;
  }

  let code = out.join("");

  // @ Add default catch for try blocks without catch (cobaerror usage)
  code = code.replace(/\btry\s*\{([\s\S]*?)\}(?!\s*catch)/g, (m, inner) => {
    return `try {${inner}} catch (error) { console.error(\`\${error} ~ erornya di sana bang\`); }`;
  });

  return code;
}

// @ ----- Run compiled JS in sandbox -----
function runCompiled(jsCode, filename) {
  const sandbox = {
    console,
    require,
    module,
    process,
    setTimeout, setInterval, clearTimeout, clearInterval,
    __dirname: path.dirname(path.resolve(filename)),
    __filename: path.resolve(filename)
  };
  try {
    vm.runInNewContext(jsCode, sandbox, { filename });
  } catch (err) {
    console.error(`${err} ~ erornya di sana bang`);
    process.exitCode = 1;
  }
}

// @ ----- CLI -----
function usageExit() {
  console.log("Usage: paw <file.paw> [--out out.js] [--print]");
  process.exit(0);
}

const argv = process.argv.slice(2);
if (!argv.length) usageExit();

const input = argv[0];
if (!fs.existsSync(input)) {
  console.error("File tidak ditemukan:", input);
  process.exit(1);
}

const src = fs.readFileSync(input, "utf8");
const compiled = compilePaw(src);

if (argv.includes("--out")) {
  const outPath = argv[argv.indexOf("--out")+1] || input.replace(/\.paw$/i, ".js");
  fs.writeFileSync(outPath, compiled, "utf8");
  console.log(`✅ Compiled → ${outPath}`);
  process.exit(0);
}

if (argv.includes("--print")) {
  process.stdout.write(compiled);
  process.exit(0);
}

// @ default: run
runCompiled(compiled, input);