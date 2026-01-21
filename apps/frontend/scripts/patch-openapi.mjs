import fs from "fs";
import path from "path";

const root = process.cwd();
const openApiPath = path.join(root, "src/api/core/OpenAPI.ts");
const requestPath = path.join(root, "src/api/core/request.ts");

function patchFile(filePath, patches) {
  let content = fs.readFileSync(filePath, "utf8");
  const original = content;

  for (const { name, apply } of patches) {
    const next = apply(content);
    if (next === content) {
      console.warn(`[patch-openapi] Patch "${name}" made no changes in ${path.basename(filePath)} (maybe already applied or pattern changed)`);
    }
    content = next;
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`[patch-openapi] Patched ${path.relative(root, filePath)}`);
  } else {
    console.log(`[patch-openapi] No changes needed for ${path.relative(root, filePath)}`);
  }
}

// ---------- Patch OpenAPI.ts ----------
if (!fs.existsSync(openApiPath)) {
  console.error(`[patch-openapi] Missing ${openApiPath}. Did codegen output to src/api?`);
  process.exit(1);
}

patchFile(openApiPath, [
  {
    name: "Force BASE to env or /api",
    apply: (s) => {
      // Replace BASE: '...' with BASE: process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api'
      return s.replace(
        /BASE:\s*(['"`]).*?\1\s*,/m,
        "BASE: (process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api'),"
      );
    },
  },
  {
    name: "Enable credentials",
    apply: (s) => {
      // Ensure WITH_CREDENTIALS: true
      s = s.replace(/WITH_CREDENTIALS:\s*false/m, "WITH_CREDENTIALS: true");
      // Ensure CREDENTIALS: 'include' if present
      s = s.replace(/CREDENTIALS:\s*(['"`])omit\1/m, "CREDENTIALS: 'include'");
      return s;
    },
  },
]);

// ---------- Patch request.ts ----------
if (!fs.existsSync(requestPath)) {
  console.error(`[patch-openapi] Missing ${requestPath}. The codegen output structure may differ.`);
  process.exit(1);
}

patchFile(requestPath, [
  {
    name: "Configure Axios XSRF for Django",
    apply: (s) => {
      // Idempotent: if already present, do nothing
      if (s.includes("xsrfCookieName")) return s;

      // Insert axios XSRF config into requestConfig in sendRequest()
      // We inject right after the generated `withXSRFToken:` line.
      const re = /\n\s*withXSRFToken:\s*[^\n]*,\s*\n/;
      if (!re.test(s)) return s;

      return s.replace(re, (m) =>
        m +
        "        xsrfCookieName: 'csrftoken',\n" +
        "        xsrfHeaderName: 'X-CSRFToken',\n"
      );
    },
  },
]);

console.log("[patch-openapi] Done.");