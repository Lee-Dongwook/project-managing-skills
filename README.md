# gtm-validation-lab

제조·SCM 아이디어의 고객 문제와 유료 의사를 4주 안에 검증하고, 그 과정을 n8n으로 자동화하는 프로젝트.

> 자동화 자체가 목적이 아니라, 반복 가능한 고객 검증을 더 적은 시간과 비용으로 수행하는 것이 목적이다.

## 우선순위

고객 문제 검증 → 유료 파일럿 제안 → n8n 자동화 → KPI 대시보드

## 현재 마일스톤: 고객 문제를 검증할 수 있는 상태 만들기

- [ ] [docs/icp-and-personas.md](docs/icp-and-personas.md) — 첫 고객군과 구매자 정의
- [ ] [docs/interview-guide.md](docs/interview-guide.md) — 인터뷰 질문 및 증거 기록 방식
- [ ] [data/sample-companies.csv](data/sample-companies.csv) — 조사 대상 기업과 접촉 상태 관리

## 4주 로드맵

| 주차   | 단계   | 핵심 활동                                         | 산출물                                 |
| ------ | ------ | ------------------------------------------------- | -------------------------------------- |
| Week 1 | 발견   | ICP·문제 가설·UVP 초안, 기업 30곳 목록, 인터뷰 폼 | GTM 전략 초안, 고객 목록, 인터뷰 폼    |
| Week 2 | 검증   | 인터뷰 진행, 문제 증거 기록, 파일럿 범위 정의     | 인터뷰 결과, 문제 우선순위, UVP 수정안 |
| Week 3 | 자동화 | n8n 워크플로 A~D 구축                             | 작동하는 워크플로, 테스트 케이스       |
| Week 4 | 결정   | 파일럿 제안, 가격·도입 장벽 분석, 진행/피벗/중단  | 검증 보고서, 다음 단계 계획            |

## 구조

```
docs/        전략 문서, 인터뷰 가이드, 실험 기록, 검증 보고서
data/        샘플 데이터 (실제 고객 데이터는 data/private/, Git 제외)
workflows/   n8n에서 내보낸 워크플로 JSON
tests/       워크플로 테스트 케이스와 실패 시나리오
```

## 기업 접촉 상태 (`data/sample-companies.csv`의 `status`)

`researched` → `contacted` → `replied` → `interview_scheduled` → `interviewed` → `pilot_proposed`
그 외: `no_response` (후속 연락에도 무응답), `excluded` (ICP 제외 조건에 해당)

## 데이터 원칙

- API 키, 고객 개인정보, 실제 인터뷰 원문은 Git에 올리지 않는다.
- 샘플 데이터는 가상의 데이터만 사용한다.
