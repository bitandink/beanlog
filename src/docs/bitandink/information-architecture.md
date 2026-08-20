# bitandink — Information Architecture

## 1. Goal

`/bitandink`의 정보 구조는 방문자가 이력서를 읽듯 정보를 소비하게 하지 않는다.

페이지를 내려가면서 다음 순서로 bitandink를 발견하도록 한다.

```text
세계의 경계
↓
현재
↓
작업
↓
생각
↓
사람
↓
현실
```

---

# 2. Primary Flow

## 01. Boundary / Monitor

페이지의 첫 번째 핵심 경험.

Monitor를 통해 현실의 bitandink와 Beanlog 사이의 관계를 암시한다.

주요 정보:

* bitandink
* 현재 작업
* 현재 관심
* Beanlog 상태
* 최근 업데이트

Monitor는 `/bitandink`의 대표적인 시각적 오브젝트다.

---

## 02. Working

현재 만들고 있는 것을 보여준다.

완성된 프로젝트보다 **현재 진행 중인 작업**이 우선한다.

가능한 정보:

* project
* current task
* research
* writing
* learning

이 영역은 시간이 지나면서 계속 변화한다.

---

## 03. Made

bitandink가 만들어온 대표적인 작업을 보여준다.

모든 프로젝트를 나열하지 않는다.

Selected Works의 성격을 가진다.

각 작업에서는 기술 스택보다 다음 정보를 우선한다.

1. 무엇인가
2. 왜 만들었는가
3. 현재 상태
4. 더 알아보기

---

## 04. Thinking

bitandink의 사고와 관심의 흔적.

다음 콘텐츠가 연결될 수 있다.

* Notes
* Writings
* Research
* Experiments

목적은 지식을 과시하는 것이 아니라 프로젝트가 어떤 생각에서 시작되었는지 보여주는 것이다.

---

## 05. About Bitandink

페이지 후반부에서 비로소 사람 자체를 설명한다.

가능한 정보:

* Developer
* Writer
* Observer
* Interests
* Short introduction

프로필 사진이나 상세 이력은 필수 요소가 아니다.

---

## 06. Real World

Beanlog 세계에서 현실 세계로 가장 가까워지는 영역.

외부 링크가 위치한다.

예:

* GitHub
* Email
* External profile

필요한 링크만 제공한다.

---

## 07. Return

페이지의 마지막에는 Beanlog로 돌아갈 수 있는 작은 통로를 제공한다.

```text
return to Beanlog →
```

페이지의 서사적 의미는:

> Beanlog에서 잠시 경계를 넘어 제작자를 만난 뒤 다시 세계 안으로 돌아간다.

---

# 3. Secondary Layer — Encounters

Primary Flow와 별개로 Encounter Layer가 존재한다.

```text
PRIMARY CONTENT
────────────────────────

Monitor
Working
Made
Thinking
About
Real World

────────────────────────
ENCOUNTER LAYER

Bean peek
Pama request
Hodu incident
System message
```

Encounter는 정보 구조를 변경하지 않는다.

기본 콘텐츠 위에 일시적으로 발생한다.

따라서 Encounter가 없어도 `/bitandink`는 완전한 페이지여야 한다.

---

# 4. Hidden Layer — Terminal

Terminal은 기본 정보 구조에서 강조하지 않는다.

발견 가능한 보조 인터페이스 또는 Easter Egg에 가깝다.

Terminal을 발견한 사용자는 Beanlog와 bitandink의 관계를 더 깊게 탐색할 수 있다.

가능한 기능:

```text
whoami
now
works
notes
status
bean
connect
```

Terminal이 사이트 탐색의 필수 수단이 되어서는 안 된다.

---

# 5. Information Priority

```text
1. Current identity
2. Current activity
3. Selected work
4. Thoughts
5. Personal context
6. External links
7. World interactions
```

세계관 인터랙션은 가장 눈에 띌 수 있지만 정보 우선순위에서는 가장 아래에 있다.

콘텐츠가 먼저 존재하고 세계관은 그것을 둘러싼다.

---

# 6. Page Narrative

페이지 전체의 서사는 다음과 같다.

```text
You are inside Beanlog.

        ↓

You find the boundary.

        ↓

You see the monitor.

        ↓

Someone is working behind it.

        ↓

You discover what they are making.

        ↓

You discover what they think about.

        ↓

You meet bitandink.

        ↓

You briefly reach the real world.

        ↓

Return to Beanlog.
```

이 흐름이 `/bitandink`의 기본 사용자 경험이다.
