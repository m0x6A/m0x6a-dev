import { access, cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const standaloneDir = path.join(rootDir, ".next", "standalone");
const staticDir = path.join(rootDir, ".next", "static");
const publicDir = path.join(rootDir, "public");
const outputDir = path.join(rootDir, "dist", "azure-webapp");

await assertExists(
  standaloneDir,
  "Missing .next/standalone. Run `npm run build` before packaging for Azure.",
);
await assertExists(
  staticDir,
  "Missing .next/static. Run `npm run build` before packaging for Azure.",
);

await rm(outputDir, { force: true, recursive: true });
await mkdir(path.join(outputDir, ".next"), { recursive: true });

await cp(standaloneDir, outputDir, { recursive: true });
await cp(staticDir, path.join(outputDir, ".next", "static"), { recursive: true });

if (await exists(publicDir)) {
  await cp(publicDir, path.join(outputDir, "public"), { recursive: true });
}

console.log(`Prepared Azure App Service bundle at ${path.relative(rootDir, outputDir)}`);

async function assertExists(targetPath, errorMessage) {
  if (!(await exists(targetPath))) {
    throw new Error(errorMessage);
  }
}

async function exists(targetPath) {
  try {
    await access(targetPath);
    return true;
  } catch (error) {
    if (isNodeErrorWithCode(error, "ENOENT")) {
      return false;
    }

    throw error;
  }
}

function isNodeErrorWithCode(error, code) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === code
  );
}
