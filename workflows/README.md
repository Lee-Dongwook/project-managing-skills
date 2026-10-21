# n8n 워크플로

n8n에서 내보낸 JSON을 그대로 저장하고 버전 관리한다. 자격 증명(credentials)은 내보내기 전에 제거한다.

| 파일                    | 워크플로                     | 완료 기준                                                                                 |
| ----------------------- | ---------------------------- | ----------------------------------------------------------------------------------------- |
| lead-intake.json        | A — 리드 수집 및 CRM 동기화  | 같은 연락처가 두 번 입력되어도 중복 리드가 생기지 않고, 필수 정보 누락 시 오류를 기록한다 |
| interview-analysis.json | B — 인터뷰 분석 및 문제 분류 | 고객 발언과 관찰·해석을 분리 저장하고, 지불 의사는 명시적 발언만 기록한다                 |
| follow-up-actions.json  | C — 후속 조치 자동화         | 초안과 작업 생성까지만 자동화하고, 발송은 담당자 승인 후 진행한다                         |
| weekly-report.json      | D — 주간 GTM 리포트          | 주 1회 퍼널 지표, 채널별 성과, 다음 주 검증 가설을 집계한다                               |

## lead-intake.json 사용법

1. n8n → Workflows → Import from File로 불러온다.
2. 워크플로를 활성화하면 `POST /webhook/lead-intake`로 리드를 받는다.
   ```bash
   curl -X POST http://localhost:5678/webhook/lead-intake \
     -H 'Content-Type: application/json' \
     -d '{"company_name":"(가상) 한빛정밀","contact_name":"홍길동","contact_role":"구매팀장","contact_email":"c001@example.com"}'
   ```
   응답: 성공 `200 {ok, action: created|updated, company_id}` · 검증 실패 `400 {ok: false, errors}`
3. Notify(Slack) 노드는 비활성 상태다. Slack 자격 증명을 연결한 뒤 활성화한다.

**주의**: 현재 저장소는 n8n 워크플로 static data다. static data는 **활성화된 워크플로의 운영 실행에서만 저장**되고, 에디터의 수동 테스트 실행에서는 저장되지 않는다. 실제 운영 시에는 Deduplicate & Upsert Lead 노드를 CRM(HubSpot 등)이나 DB(Postgres, n8n Data Table) 노드로 교체한다.
