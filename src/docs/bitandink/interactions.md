# bitandink — Interactions

## 1. Principle

`/bitandink`의 상호작용은 페이지를 재미있게 만드는 장식이 아니라 현실과 Beanlog가 연결되어 있다는 사실을 보여주는 작은 사건이다.

가장 중요한 원칙은:

> **Rare, subtle, optional.**

상호작용은 드물고, 조용하며, 무시할 수 있어야 한다.

---

# 2. Encounter System

Encounter는 두 세계 사이에서 발생하는 일시적인 사건이다.

```text
Encounter

trigger
resident
location
duration
message
interaction
cooldown
```

모든 Encounter가 클릭 가능한 기능을 가질 필요는 없다.

단순히 나타났다 사라지는 사건도 존재한다.

---

# 3. Bean Encounters

## Bean Peek

Bean이 bitandink가 무엇을 하고 있는지 궁금해서 Monitor 너머를 바라본다.

### Trigger

낮은 확률의 방문 이벤트.

### Behavior

모니터 가장자리에서 잠시 얼굴을 내민다.

사용자가 발견하면 잠시 머물거나 사라질 수 있다.

가능한 메시지:

```text
bean is watching.
```

또는 아무 메시지도 표시하지 않는다.

### Principle

Bean Peek은 설명하지 않을수록 좋다.

방문자가 우연히 발견하도록 한다.

---

# 4. Pama Encounters

## Snack Request

Pama가 현실의 bitandink에게 간식을 요청한다.

Monitor의 작은 system request 형태로 나타날 수 있다.

예:

```text
incoming request

from: pama
type: snack
```

사용자는 이를 무시할 수 있다.

요청에 반드시 실제 기능적 결과가 있을 필요는 없다.

---

# 5. Hodu Encounters

## Snack Request

Pama보다 조금 더 적극적일 수 있다.

```text
incoming request

from: hodu
type: snack
priority: urgent
```

---

## Footprints

Monitor 주변이나 화면의 예상하지 못한 위치에 작은 흔적이 나타날 수 있다.

직접적인 설명은 하지 않는다.

---

## Incident

Hodu와 관련된 예상하지 못한 사건.

모든 오류를 Hodu 탓으로 돌리지는 않는다.

반복되면 캐릭터가 단순한 사고뭉치로 축소되기 때문이다.

따라서 실제로 Hodu와 관련된 사건은 드물게 사용한다.

---

# 6. System Encounters

Beanlog 자체가 현실 세계에 상태를 전달할 수 있다.

예:

```text
SYSTEM NOTICE

unexpected behavior detected.
```

또는:

```text
connection unstable.
```

System Encounter는 Terminal 연결로 이어질 수 있다.

---

# 7. Terminal Interaction

Terminal은 숨겨진 보조 인터페이스다.

기본 명령 후보:

```text
help
whoami
now
works
notes
status
bean
connect
```

### whoami

bitandink에 대한 짧은 정보를 출력한다.

### now

현재 작업과 관심을 출력한다.

### works

Selected Works를 보여준다.

### notes

최근 Note 일부를 보여준다.

### status

Beanlog의 현재 상태를 출력한다.

### bean

Bean과 관련된 작은 응답을 제공한다.

항상 동일한 응답일 필요는 없다.

### connect

Beanlog 세계로 직접 접속하는 특별한 명령.

---

# 8. Connect Sequence

`connect`가 실행되면 다음 단계가 가능하다.

```text
> connect

connection requested...

authenticating bitandink...

encoding identity...

digital embodiment ready.

enter Beanlog? [y/n]
```

사용자가 진행하면 Digital Bitandink가 Beanlog에 등장할 수 있다.

이 기능은 초기 버전에서 반드시 구현할 필요는 없다.

세계관 확장을 위한 장기 기능으로 유지할 수 있다.

---

# 9. Frequency

Encounter는 희소성이 중요하다.

방문할 때마다 캐릭터가 나타나면 세계관이 이벤트 UI로 변한다.

따라서 다음 원칙을 따른다.

```text
Normal visit
→ 대부분 아무 일도 일어나지 않음

Occasional visit
→ 작은 흔적

Rare visit
→ Resident encounter

Very rare
→ Special/system encounter
```

정확한 확률은 구현 단계에서 결정한다.

---

# 10. Persistence

필요하다면 사용자가 최근에 Encounter를 경험했는지 로컬에서 기억할 수 있다.

목적은 수집이나 추적이 아니라 반복 노출 방지다.

예:

```text
lastEncounter
encounterCount
seenEvents
```

서버 계정이나 사용자 프로필과 연결할 필요는 없다.

---

# 11. Accessibility

세계관 인터랙션 때문에 핵심 콘텐츠 접근성이 떨어져서는 안 된다.

따라서:

* 중요한 정보는 Encounter 안에만 제공하지 않는다.
* 애니메이션 없이도 페이지를 사용할 수 있어야 한다.
* reduced motion 환경을 고려한다.
* 캐릭터 이벤트가 키보드 탐색을 방해하지 않는다.
* Terminal을 사용하지 않아도 모든 핵심 콘텐츠에 접근할 수 있다.

---

# 12. Final Rule

새로운 Encounter를 추가하기 전에 묻는다.

> 이 사건이 정말 두 세계가 살아 있다는 느낌을 주는가?

단순히 귀엽기 때문이라면 추가하지 않는다.

그리고 한 가지를 더 묻는다.

> 이 사건이 없어도 `/bitandink`는 좋은 페이지인가?

항상 YES여야 한다.

세계관은 좋은 페이지 위에 존재해야 한다.
