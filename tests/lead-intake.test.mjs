// Workflow A의 Code 노드를 workflows/lead-intake.json에서 꺼내 그대로 실행한다.
// 실행: node tests/lead-intake.test.mjs
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const wf = JSON.parse(
  readFileSync(new URL("../workflows/lead-intake.json", import.meta.url)),
);
const code = (name) => wf.nodes.find((n) => n.name === name).parameters.jsCode;
const db = {};
const run = (name, items) =>
  new Function("$input", "$getWorkflowStaticData", code(name))(
    { all: () => items },
    () => db,
  );

// Webhook → Validate → (valid ? Upsert : Log Error) 흐름을 흉내 낸다
const submit = (body) => {
  const [v] = run("Validate Input", [{ json: { body } }]);
  return v.json.valid
    ? run("Deduplicate & Upsert Lead", [v])[0].json
    : { action: "rejected", ...run("Log Error", [v])[0].json };
};
const lead = {
  company_name: "(가상) 한빛정밀",
  contact_name: "홍길동",
  contact_role: "구매팀장",
  contact_email: "c001@example.com",
};

// 1. 정상 입력 → 신규 생성
assert.equal(submit(lead).action, "created");
// 2. 같은 이메일 재입력 → 갱신, 연락처 1건
assert.equal(submit(lead).action, "updated");
// 3. 대소문자·공백만 다른 이메일 → 같은 연락처
assert.equal(
  submit({ ...lead, contact_email: "  C001@Example.com " }).action,
  "updated",
);
assert.equal(Object.keys(db.contacts).length, 1);
// 4. 필수 필드 누락 → 저장 안 하고 오류 기록
assert.deepEqual(submit({ contact_email: "x@example.com" }).errors, [
  "company_name 누락",
]);
assert.deepEqual(submit({ company_name: "A" }).errors, ["contact_email 누락"]);
// 5. 잘못된 이메일 형식 → 오류 기록
assert.deepEqual(submit({ ...lead, contact_email: "not-an-email" }).errors, [
  "contact_email 형식 오류",
]);
assert.equal(db.errors.length, 3);
assert.equal(Object.keys(db.contacts).length, 1);
// 6. 같은 회사(표기만 다름), 다른 담당자 → 기업 1건 + 연락처 2건
const r = submit({
  company_name: "(가상)한빛정밀 주식회사",
  contact_email: "c001-2@example.com",
});
assert.equal(r.action, "created");
assert.equal(Object.keys(db.companies).length, 1);
assert.equal(Object.keys(db.contacts).length, 2);
// 갱신 시 빈 값이 기존 값을 지우지 않는다
assert.equal(db.contacts["c001@example.com"].contact_name, "홍길동");

console.log("lead-intake: all 6 cases passed");
