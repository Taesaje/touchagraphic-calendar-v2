#!/usr/bin/env node
// npm run publish:v2
// build -> safe staging -> commit -> push (Netlify는 origin/v2-redesign push에 이미 git 연동 자동배포됨)

import { execFileSync, execSync } from "node:child_process";
import { statSync } from "node:fs";

const BRANCH = "v2-redesign";
const LARGE_FILE_LIMIT_BYTES = 15 * 1024 * 1024; // 15MB

// git add -A 대상에서 항상 제외 (개인 로컬 스크립트 / 툴 리포트).
// 대용량 원본 자료(references/touch-portfolio-original, -source)는 .gitignore 로 처리한다 —
// 이미 .gitignore 로 무시된 경로를 pathspec exclude 에도 넣으면 git add가
// "ignored by .gitignore" 로 판단해 exit code 1을 내므로 여기 중복 기재하지 않는다.
const STAGING_EXCLUDES = [":!*.ps1", ":!**/optimize-summary.json"];

function run(cmd, args, opts = {}) {
  return execFileSync(cmd, args, {
    stdio: opts.silent ? ["ignore", "pipe", "pipe"] : "inherit",
    encoding: "utf8",
    ...opts,
  });
}

function git(args, opts) {
  return run("git", args, opts);
}

function npmRunBuild() {
  // npm.cmd on Windows can't be spawned via execFileSync (EINVAL); execSync
  // runs it through the shell instead. The command is a fixed string, not
  // user input, so there's no injection risk.
  execSync("npm run build", { stdio: "inherit" });
}

function fail(message) {
  console.error(`\n[publish:v2] 중단: ${message}`);
  process.exit(1);
}

console.log("[publish:v2] 1/5 현재 브랜치 확인");
const currentBranch = git(["rev-parse", "--abbrev-ref", "HEAD"], {
  silent: true,
}).trim();
if (currentBranch !== BRANCH) {
  fail(
    `현재 브랜치가 '${currentBranch}' 입니다. '${BRANCH}' 브랜치에서만 publish:v2를 실행하세요.`,
  );
}

console.log("[publish:v2] 2/5 빌드 확인 (npm run build)");
try {
  npmRunBuild();
} catch {
  fail("빌드 실패 — 위 에러를 해결한 뒤 다시 실행하세요. (커밋/푸시 진행 안 함)");
}

console.log("[publish:v2] 3/5 safe staging (git add)");
git(["add", "-A", "--", ".", ...STAGING_EXCLUDES]);

const stagedFiles = git(["diff", "--cached", "--name-only"], { silent: true })
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean);

if (stagedFiles.length === 0) {
  console.log("[publish:v2] 커밋할 변경사항이 없습니다. 종료합니다.");
  process.exit(0);
}

const oversized = [];
for (const file of stagedFiles) {
  try {
    const size = statSync(file).size;
    if (size > LARGE_FILE_LIMIT_BYTES) {
      oversized.push({ file, size });
    }
  } catch {
    // 삭제된 파일은 statSync 실패 -> 크기 검사 대상 아님
  }
}

if (oversized.length > 0) {
  console.error("\n[publish:v2] 중단: 15MB를 초과하는 파일이 staging 되어 있습니다.");
  for (const { file, size } of oversized) {
    console.error(`  - ${file} (${(size / 1024 / 1024).toFixed(1)}MB)`);
  }
  console.error(
    "\n의도한 파일이면 scripts/publish-v2.mjs 의 LARGE_FILE_LIMIT_BYTES 를 조정하거나 수동으로 커밋하세요.",
  );
  git(["reset"]);
  process.exit(1);
}

console.log(`[publish:v2] staged files: ${stagedFiles.length}개`);
console.log("[publish:v2] 4/5 commit");
const timestamp = new Date().toISOString().slice(0, 16).replace("T", " ");
const commitMessage = `V2 작업 반영 (자동 publish) - ${timestamp}`;
git(["commit", "-m", commitMessage]);

console.log("[publish:v2] 5/5 push (origin/v2-redesign)");
git(["push", "origin", BRANCH]);

console.log(
  "\n[publish:v2] 완료. Netlify가 origin/v2-redesign push를 감지해 자동 재배포합니다:",
);
console.log("  https://gleaming-naiad-0686ac.netlify.app/");
