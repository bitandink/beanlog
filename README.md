# beanlog

> **a small virtual world built by bitandink**

웹 개발, 인터랙션, 디자인과 작은 이야기를 직접 만들고 실험하는 개인 개발 공간입니다.

단순히 완성된 프로젝트를 나열하는 포트폴리오가 아니라,  
사이트 자체를 하나의 프로젝트이자 작은 세계로 만들고 있습니다.

🌐 https://beanlog.site

---

## About

**beanlog**는 `bitandink`가 만든 개인 개발 playground이자 작은 가상 세계입니다.

사이트에 접속하면 일반적인 홈페이지 대신  
BEAN, PAMA, HODU가 살아가는 **Beanlog World**와 터미널이 먼저 나타납니다.

터미널을 통해 주민들의 상태를 확인하거나  
Beanlog 안의 다른 공간으로 이동할 수 있습니다.

```text
beanlog.site
│
├─ Beanlog World
│  ├─ Terminal
│  ├─ BEAN
│  ├─ PAMA
│  └─ HODU
│
└─ bitandink
   ├─ Real World / Gateway
   └─ Virtual Workspace
      ├─ Home
      ├─ Beanlog
      └─ Playground

External
├─ Webzine
└─ Portfolio
```

현실과 가상 공간의 경계를 오가며  
개발자의 작업 공간을 탐색하는 경험을 만드는 것을 목표로 합니다.

---

## Beanlog World

`/`

beanlog.site의 시작점입니다.

화면에는 데이터가 떠다니고  
BEAN, PAMA, HODU가 시간에 따라 각자의 상태로 존재합니다.

터미널에서는 다음과 같은 명령을 사용할 수 있습니다.

```text
help
residents

bean
pama
hodu

where bean
where pama
where hodu

about
status
clear

bitandink
beanlog
playground
webzine
portfolio
```

각 주민의 프로필을 열거나 현재 상태를 확인할 수 있으며,  
터미널을 통해 Beanlog의 다른 공간으로 이동할 수도 있습니다.

---

## bitandink / Gateway

`/bitandink`

Beanlog World와 bitandink의 작업 공간 사이에 있는 경계입니다.

이곳에서는 가상 세계가 아니라  
어두운 방에서 모니터를 바라보며 작업하고 있는 bitandink의 현실 공간이 나타납니다.

화면을 스크롤하면 카메라가 모니터 쪽으로 이동하고  
모니터 화면을 통과하면서 다시 가상 공간으로 진입합니다.

```text
REAL WORLD
    ↓
bitandink's room
    ↓
monitor
    ↓
virtual workspace
```

현실의 개발자가 자신이 만든 가상 세계 안으로 들어간다는 구조를  
스크롤과 화면 전환을 이용해 표현했습니다.

---

## Virtual Workspace

### Home

`/bitandink/home`

모니터를 통과한 뒤 도착하는 가상 작업 공간의 허브입니다.

여기에서 Beanlog, Playground와 외부 Webzine, Portfolio로 이동할 수 있습니다.

### Beanlog

`/bitandink/beanlog`

BEAN, PAMA, HODU가 남기는 짧은 기록을 모아둔 공간입니다.

각 기록은 Markdown 파일로 관리합니다.

```text
src/content/beanlog/

├─ 2026-08-12-hodu.md
├─ 2026-08-18-hodu.md
├─ 2026-08-19-pama.md
└─ 2026-08-21-bean.md
```

각 로그에는 최소한의 정보만 저장합니다.

```yaml
---
resident: "hodu"
date: "2026-08-18"
mood: "suspicious"
---
```

별도의 글 페이지나 카테고리 시스템을 만들기보다  
주민들의 짧은 기록이 시간순으로 쌓이는 단순한 구조를 사용합니다.

---

## Playground

`/bitandink/playground`

Beanlog의 실험적인 인터랙션 공간입니다.

BEAN, HODU, PAMA 그리고 bitandink가 등장하며  
화면에 흩어진 개발 파일과 데이터를 클릭하면 작은 사건들이 발생합니다.

### `.css`

CSS 값을 직접 변경하며 화면의 변화를 확인하는 작은 디자인 실험입니다.

### `.env`

방문자가 메시지를 작성하고 실제로 전송할 수 있습니다.

Next.js Route Handler와 Resend를 사용하며  
API Key와 이메일 관련 값은 서버 환경 변수로 관리합니다.

### `.json`

데이터를 쫓던 HODU가 사고를 치고  
BEAN이 이를 수습하는 캐릭터 인터랙션입니다.

### `.txt`

HODU가 문장의 글자를 훔치면서 시작되는 작은 사건입니다.

BEAN과 PAMA가 등장하며 상황이 이어집니다.

### `.log`

현재 브라우저 세션에서 Playground에서 발생한 행동을 기록합니다.

```text
[ACCESS] .txt opened
[WARN]   character count changed: 43 → 42
[TRACE]  missing character located near HODU
[INFO]   BEAN restored "다"
```

로그는 현재 세션에서만 유지되며 별도로 저장하지 않습니다.

### `.md`

Playground의 README입니다.

공간과 등장 캐릭터를 소개하며  
README를 읽는 과정 자체에도 작은 인터랙션이 포함되어 있습니다.

---

## Residents

### BEAN

> maintains the system.  
> fixes things nobody asked HODU to break.

Beanlog의 주민.

주로 코드를 작성하거나 데이터를 정리하고 있으며  
HODU가 벌인 일을 수습하는 경우가 많습니다.

### PAMA

> mostly observes.  
> occasionally makes things worse.

10살 비숑.

대부분 느긋하게 상황을 지켜보며  
가끔 예상하지 못한 방식으로 사건에 끼어듭니다.

### HODU

> professional troublemaker.

8살 푸들.

호기심이 많고 데이터나 이상한 물건을 발견하면 일단 쫓아갑니다.  
Playground에서 발생하는 여러 사건의 원인이기도 합니다.

### bitandink

> built this place.  
> claims everything is intentional.

Beanlog를 만든 현실 세계의 개발자입니다.

Beanlog 안의 주민인 BEAN과는 별개의 존재입니다.

---

## External Spaces

Beanlog 내부에서 독립적으로 운영되는 두 개의 작업 공간으로 연결됩니다.

### Webzine

**bitandink quarterly web magazine**

https://bitandink.vercel.app

### Portfolio

**bitandink portfolio**

https://bitandink.github.io/portfolio-2026/

---

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- CSS Modules
- Next.js Image Optimization

### Content

- Markdown
- gray-matter
- Node.js File System API

### Backend / API

- Next.js Route Handlers
- Resend

### Infrastructure

- Vercel
- Custom Domain
- HTTPS

### SEO

- Next.js Metadata API
- Open Graph
- Twitter Card
- `robots.txt`
- `sitemap.xml`
- Google Search Console

---

## Architecture

리팩터링 이후 각 공간의 역할에 따라 코드를 분리했습니다.

```text
src/
├─ app/
│  ├─ api/
│  └─ bitandink/
│     ├─ page.tsx
│     ├─ home/
│     ├─ beanlog/
│     └─ playground/
│
├─ components/
│  └─ BeanlogWorld.tsx
│
├─ gateway/
│  ├─ components/
│  └─ styles/
│
├─ world/
│  ├─ home/
│  ├─ beanlog/
│  └─ playground/
│
├─ content/
│  └─ beanlog/
│
├─ shared/
│  └─ components/
│
└─ config.ts
```

`app`은 라우팅,  
`gateway`는 현실과 가상 세계 사이의 전환,  
`world`는 가상 공간의 각 페이지,  
`content`는 주민들의 기록을 담당합니다.

---

## Philosophy

```text
build.
play.
break.
fix.
repeat.
```

완성된 결과만 보여주기보다  
만들고 실험하고 고치는 과정 자체를 보여주는 공간을 지향합니다.

---

## Author

**bitandink**

Developer / Web Designer

> code, design, and unnecessary interactions.

---

© bitandink. All rights reserved.
