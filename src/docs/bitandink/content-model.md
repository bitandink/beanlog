# bitandink — Content Model

## 1. Principle

`/bitandink`에서 보여주는 콘텐츠와 `/bitandink` 자체가 소유하는 데이터를 구분한다.

프로젝트나 글은 bitandink 페이지에 종속되지 않는다.

Beanlog의 독립적인 콘텐츠다.

```text
Beanlog Content
      │
      ├── Projects
      ├── Writings
      ├── Notes
      └── Maintenance
             │
             ▼
        /bitandink
        references
```

---

# 2. Content Types

## Project

비교적 명확한 목적과 결과물을 가진 작업.

예:

* Perfugium
* Korean Style Lab
* Diet API

기본 속성:

```text
title
summary
description
status
startedAt
endedAt
tags
links
featured
```

Status 예:

```text
idea
research
building
paused
completed
archived
```

---

## Writing

완성된 글.

Essay, article, reflection 등 비교적 독립적으로 읽을 수 있는 콘텐츠.

기본 속성:

```text
title
description
publishedAt
updatedAt
tags
relatedProjects
```

---

## Note

완성된 글보다 작은 생각의 단위.

관찰, 질문, 아이디어, 연구 중 발견한 내용 등을 기록한다.

기본 속성:

```text
content
createdAt
tags
relatedProject
```

Note는 시간이 지나면서 Writing이나 Project로 발전할 수 있다.

```text
Note
 ↓
Research
 ↓
Experiment
 ↓
Writing / Project
```

이 관계는 강제하지 않는다.

---

## Maintenance

실제 Beanlog의 변경과 세계관 속 사건을 연결하는 기록.

두 개의 레이어를 가진다.

### Technical Layer

실제로 무엇이 변경되었는가.

### World Layer

Beanlog 세계에서는 그 변경이 어떤 사건으로 표현되는가.

예:

```text
Maintenance #017

technical:
archive navigation bug fixed

world:
A small problem was found near the Archive.
Hodu denies everything.
```

기본 속성:

```text
id
date
title
technical
world
status
relatedResident
```

---

# 3. Bitandink Data

`features/bitandink/data`는 Beanlog 콘텐츠가 아니라 현실의 bitandink 상태를 나타낸다.

## Profile

비교적 잘 변하지 않는 정보.

```text
name
roles
introduction
interests
```

## Now

자주 변경될 수 있는 현재 상태.

```text
workingOn
thinkingAbout
writing
learning
updatedAt
```

## Links

현실 세계와 연결되는 외부 링크.

```text
label
url
type
```

---

# 4. Residents

주민 자체의 설정은 프로젝트 콘텐츠와 구분한다.

```text
Resident

id
name
role
personality
allowedEncounters
```

현재 주민:

```text
bean
pama
hodu
```

`/bitandink`에서는 주민 전체 설정을 설명하지 않는다.

필요한 Encounter에서 해당 주민을 참조한다.

---

# 5. Relationship Model

전체 관계는 다음과 같다.

```text
                    bitandink
                        │
           ┌────────────┼────────────┐
           │            │            │
        creates       writes       thinks
           │            │            │
           ▼            ▼            ▼
       Projects      Writings       Notes

                        │
                     maintains
                        │
                        ▼
                   Maintenance


Bean ─┐
Pama ─┼──── encounters ──── /bitandink
Hodu ─┘
```

---

# 6. Ownership Rule

콘텐츠의 위치를 결정할 때 다음 질문을 한다.

> 이 정보가 `/bitandink`가 없어져도 Beanlog 안에서 독립적으로 의미가 있는가?

YES라면:

```text
src/content/
```

에 속한다.

NO이고 bitandink 페이지의 상태나 인터페이스에만 필요한 정보라면:

```text
src/features/bitandink/
```

에 속한다.

이 규칙을 기본적인 콘텐츠 경계로 사용한다.
