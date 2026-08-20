"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

/* ========================================
   BOOT SEQUENCE
======================================== */

const bootLines = [
  "wake",
  "> waking up beanlog...",
  "> loading environment ........ OK",
  "",
  "> resident 01 ........ BEAN",
  "> resident 02 ........ PAMA",
  "> resident 03 ........ HODU",
  "",
  "> all residents online.",
  "> welcome to beanlog.site!",
];

/* ========================================
   TERMINAL
======================================== */

type TerminalHistoryItem = {
  id: number;
  type: "command" | "output";
  text: string;
};

/* ========================================
   FLOATING DATA
======================================== */

type FloatingData = {
  id: number;
  text: string;

  x: number;
  y: number;

  size: number;
  opacity: number;

  duration: number;
  delay: number;

  driftX: number;
  driftY: number;

  rotation: number;
};

/* ========================================
   RESIDENT TYPES
======================================== */

type ResidentId = "bean" | "pama" | "hodu";

type ResidentProfile = {
  id: ResidentId;

  number: string;
  name: string;

  type: string;
  age?: string;

  tagline: string;

  traits: string[];
  favorites: string[];

  note: string;
};

type ResidentRuntimeState = {
  status: string;
  visible: boolean;
  message: string;
};

type ResidentRuntime = Record<
  ResidentId,
  ResidentRuntimeState
>;

type KstTime = {
  hour: number;
  minute: number;
  label: string;
};

/* ========================================
   RESIDENT PROFILES
======================================== */

const residentProfiles: Record<
  ResidentId,
  ResidentProfile
> = {
  bean: {
    id: "bean",

    number: "01",

    name: "BEAN",

    type: "HUMAN / DEVELOPER",

    tagline:
      "Usually coding. Sometimes reading. Occasionally eating.",

    traits: [
      "주로 코딩을 하고 있음",
      "책 읽는 걸 좋아함",
      "조용히 혼자 뭔가 하는 걸 좋아함",
      "beanlog의 관리인이자 주민",
    ],

    favorites: [
      "코드",
      "책",
      "조용한 시간",
      "맛있는 것",
    ],

    note:
      "엄..ㅁ..ㅏ... 아니, 언니(bitandink)의 명령대로 beanlog 안에서 이것저것 만들고 고치며 살아가는 주민. 대체로 조용하지만 머릿속은 늘 뭔가 만들 생각으로 바쁘다.",
  },

  pama: {
    id: "pama",

    number: "02",

    name: "PAMA",

    type: "BICHON",

    age: "10 YEARS",

    tagline:
      "Mostly sleeping. Occasionally complaining.",

    traits: [
      "사람을 좋아함",
      "강아지는 별로 안 좋아함",
      "대체로 순하고 얌전함",
      "원하는 것이 있으면 엄청난 찡찡보가 됨",
    ],

    favorites: [
      "엄마",
      "언니 베개",
      "언니 이불",
      "잠",
    ],

    note:
      "언니(bitandink)가 데려왔지만 세상에서 엄마(bitandink 모친)를 제일 좋아한다.",
  },

  hodu: {
    id: "hodu",

    number: "03",

    name: "HODU",

    type: "POODLE",

    age: "8 YEARS",

    tagline:
      "Highly curious. Probably planning something.",

    traits: [
      "똥꼬발랄",
      "엄청난 겁보",
      "엄살쟁이",
      "호기심이 많음",
      "은근 고집과 줏대가 강함",
    ],

    favorites: [
      "언니 옆",
      "사고 치기",
      "궁금한 것 쫓아가기",
      "의외로 엄마",
    ],

    note:
      "낯선 사람에게 엄청 사납게 짖지만 사실 짖기만 하는 쫄보다. 넥카라는 거의 분신.",
  },
};

/* ========================================
   KST TIME
======================================== */

function getKstTime(): KstTime {
  const formatter = new Intl.DateTimeFormat(
    "en-GB",
    {
      timeZone: "Asia/Seoul",

      hour: "2-digit",
      minute: "2-digit",

      hourCycle: "h23",
    }
  );

  const parts = formatter.formatToParts(
    new Date()
  );

  const hour = Number(
    parts.find(
      (part) => part.type === "hour"
    )?.value ?? 0
  );

  const minute = Number(
    parts.find(
      (part) => part.type === "minute"
    )?.value ?? 0
  );

  return {
    hour,
    minute,

    label: `${String(hour).padStart(
      2,
      "0"
    )}:${String(minute).padStart(2, "0")}`,
  };
}

/* ========================================
   RESIDENT SCHEDULE
======================================== */

function getResidentRuntime(
  hour: number
): ResidentRuntime {
  /* 00:00 ~ 05:59 */

  if (hour >= 0 && hour < 6) {
    return {
      bean: {
        status: "ACTIVE...?",
        visible: true,
        message:
          "resident should probably be sleeping.",
      },

      pama: {
        status: "SLEEPING",
        visible: false,
        message:
          "probably sleeping on bitandink's pillow.",
      },

      hodu: {
        status: "SLEEPING",
        visible: false,
        message:
          "escaped into the data stream.",
      },
    };
  }

  /* 06:00 ~ 08:59 */

  if (hour >= 6 && hour < 9) {
    return {
      bean: {
        status: "BOOTING",
        visible: true,
        message:
          "starting another day in beanlog.",
      },

      pama: {
        status: "SLEEPING",
        visible: false,
        message: "resident unavailable.",
      },

      hodu: {
        status: "SLEEPING",
        visible: false,
        message: "do not disturb.",
      },
    };
  }

  /* 09:00 ~ 11:59 */

  if (hour >= 9 && hour < 12) {
    return {
      bean: {
        status: "ACTIVE",
        visible: true,
        message: "currently working.",
      },

      pama: {
        status: "IDLE",
        visible: true,
        message: "probably doing nothing.",
      },

      hodu: {
        status: "ROAMING",
        visible: true,
        message:
          "searching for something interesting.",
      },
    };
  }

  /* 12:00 ~ 13:59 */

  if (hour >= 12 && hour < 14) {
    return {
      bean: {
        status: "LUNCH",
        visible: false,
        message:
          "resident entered the data stream for lunch.",
      },

      pama: {
        status: "FEEDING",
        visible: false,
        message:
          "food detected. resident unavailable.",
      },

      hodu: {
        status: "SCAVENGING",
        visible: true,
        message: "looking for leftovers.",
      },
    };
  }

  /* 14:00 ~ 17:59 */

  if (hour >= 14 && hour < 18) {
    return {
      bean: {
        status: "ACTIVE",
        visible: true,
        message: "currently working.",
      },

      pama: {
        status: "IDLE",
        visible: true,
        message:
          "still doing almost nothing.",
      },

      hodu: {
        status: "ROAMING",
        visible: true,
        message:
          "probably about to cause trouble.",
      },
    };
  }

  /* 18:00 ~ 21:59 */

  if (hour >= 18 && hour < 22) {
    return {
      bean: {
        status: "IDLE",
        visible: true,
        message: "workload reduced.",
      },

      pama: {
        status: "ACTIVE",
        visible: true,
        message: "surprisingly awake.",
      },

      hodu: {
        status: "ACTIVE",
        visible: true,
        message:
          "energy level suspiciously high.",
      },
    };
  }

  /* 22:00 ~ 23:59 */

  return {
    bean: {
      status: "LOW POWER",
      visible: true,
      message:
        "resident should stop working soon.",
    },

    pama: {
      status: "SLEEPING",
      visible: false,
      message:
        "probably occupying bitandink's pillow.",
    },

    hodu: {
      status: "SLEEPING",
      visible: false,
      message:
        "escaped into the data stream.",
    },
  };
}

/* ========================================
   RESIDENT DIALOGUE
======================================== */

function getResidentDialogue(
  id: ResidentId,
  status: string
) {
  const dialogues: Record<
    ResidentId,
    Record<string, string>
  > = {
    bean: {
      "ACTIVE...?": "자야 하는데...",
      BOOTING: "부팅 중...",
      ACTIVE: "집중 중...",
      LUNCH: "밥 먹으러 가는 중...",
      IDLE: "오늘은 여기까지 할까...",
      "LOW POWER": "진짜 이것만 하고...",
    },

    pama: {
      SLEEPING: "자는 중...",
      IDLE: "또 저러고 있네...",
      FEEDING: "밥?",
      ACTIVE: "엄마 어디 갔지...",
    },

    hodu: {
      SLEEPING: "자는 중...",
      ROAMING: "뭐 재밌는 거 없나?",
      SCAVENGING: "뭐 떨어진 거 없나?",
      ACTIVE: "저건 뭐지?",
      CHASING: "저거 잡으면\n재밌겠다!",
    },
  };

  return dialogues[id][status] ?? "...";
}

/* ========================================
   RANDOM HELPERS
======================================== */

function random(
  min: number,
  max: number
) {
  return Math.random() * (max - min) + min;
}

function randomInteger(
  min: number,
  max: number
) {
  return Math.floor(random(min, max + 1));
}

function randomBinary() {
  const length = randomInteger(1, 10);

  return Array.from(
    { length },
    () => (Math.random() > 0.5 ? "1" : "0")
  ).join("");
}

function randomHex() {
  const value = randomInteger(0, 255);

  return `0x${value
    .toString(16)
    .toUpperCase()
    .padStart(2, "0")}`;
}

function generateDataText() {
  if (Math.random() < 0.82) {
    return randomBinary();
  }

  return randomHex();
}

/* ========================================
   RESIDENT POSITIONS
======================================== */

const residentCenters = [
  {
    x: 20,
    y: 62,
    radius: 17,
  },

  {
    x: 50,
    y: 72,
    radius: 16,
  },

  {
    x: 82,
    y: 38,
    radius: 16,
  },
];

/* ========================================
   HODU
======================================== */

const HODU_CENTER = {
  x: 82,
  y: 38,
};

const HODU_REACTION_RADIUS = 27;

/* ========================================
   DISTANCE
======================================== */

function distance(
  x1: number,
  y1: number,
  x2: number,
  y2: number
) {
  return Math.sqrt(
    Math.pow(x2 - x1, 2) +
      Math.pow(y2 - y1, 2)
  );
}

/* ========================================
   DATA OPACITY
======================================== */

function calculateOpacity(
  x: number,
  y: number
) {
  let opacity = random(0.15, 0.4);

  for (const resident of residentCenters) {
    const d = distance(
      x,
      y,
      resident.x,
      resident.y
    );

    if (d < resident.radius) {
      const proximity =
        d / resident.radius;

      const multiplier =
        0.28 + proximity * 0.72;

      opacity *= multiplier;
    }
  }

  return opacity;
}

/* ========================================
   HODU ESCAPE
======================================== */

function getHoduEscape(
  item: FloatingData
) {
  const dx = item.x - HODU_CENTER.x;
  const dy = item.y - HODU_CENTER.y;

  const d = Math.sqrt(
    dx * dx + dy * dy
  );

  if (d > HODU_REACTION_RADIUS) {
    return {
      active: false,
      x: 0,
      y: 0,
    };
  }

  if (d < 0.5) {
    const angle =
      (item.id * 137.5 * Math.PI) / 180;

    return {
      active: true,

      x: Math.cos(angle) * 48,

      y: Math.sin(angle) * 48,
    };
  }

  const proximity =
    1 - d / HODU_REACTION_RADIUS;

  const force =
    15 + proximity * 38;

  return {
    active: true,

    x: (dx / d) * force,

    y: (dy / d) * force,
  };
}

/* ========================================
   CREATE DATA
======================================== */

function createFloatingData(
  count = 34
): FloatingData[] {
  return Array.from(
    { length: count },

    (_, index) => {
      const x = random(2, 96);
      const y = random(4, 94);

      return {
        id: index,

        text: generateDataText(),

        x,
        y,

        size: random(7, 13),

        opacity: calculateOpacity(x, y),

        duration: random(24, 52),

        delay: random(-50, 0),

        driftX: random(-58, 58),

        driftY: random(-52, 52),

        rotation: random(-2, 2),
      };
    }
  );
}

/* ========================================
   COMPONENT
======================================== */

export default function BeanlogWorld() {
  const router = useRouter();

  /* ========================================
     BOOT
  ======================================== */

  const [
    bootComplete,
    setBootComplete,
  ] = useState(false);

  const [
    terminalDocked,
    setTerminalDocked,
  ] = useState(false);

  const [
    typedLines,
    setTypedLines,
  ] = useState<string[]>([]);

  const [
    currentText,
    setCurrentText,
  ] = useState("");

  const [
    environmentReady,
    setEnvironmentReady,
  ] = useState(false);

  const [
    beanReady,
    setBeanReady,
  ] = useState(false);

  const [
    pamaReady,
    setPamaReady,
  ] = useState(false);

  const [
    hoduReady,
    setHoduReady,
  ] = useState(false);

  /* ========================================
     KST
  ======================================== */

  const [
    kstTime,
    setKstTime,
  ] = useState<KstTime>({
    hour: 12,
    minute: 0,
    label: "12:00",
  });

  useEffect(() => {
    const updateTime = () => {
      setKstTime(getKstTime());
    };

    updateTime();

    const timer = window.setInterval(
      updateTime,
      60_000
    );

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const runtime =
    getResidentRuntime(kstTime.hour);

  /* ========================================
     TERMINAL
  ======================================== */

  const [
    terminalInput,
    setTerminalInput,
  ] = useState("");

  const [
    terminalHistory,
    setTerminalHistory,
  ] = useState<TerminalHistoryItem[]>([]);

  const terminalInputRef =
    useRef<HTMLInputElement>(null);

  const terminalScrollRef =
    useRef<HTMLDivElement>(null);

  const terminalHistoryId =
    useRef(0);

  /* ========================================
     PROFILE
  ======================================== */

  const [
    selectedResident,
    setSelectedResident,
  ] = useState<ResidentId | null>(null);

  /* ========================================
     HODU INTERACTION
  ======================================== */

  const [
    hoduHovered,
    setHoduHovered,
  ] = useState(false);

  const [
    hoduTargetId,
    setHoduTargetId,
  ] = useState<number | null>(null);

  /* ========================================
     RANDOM DIALOGUE
  ======================================== */

  const [
    visibleDialogue,
    setVisibleDialogue,
  ] = useState<Record<ResidentId, boolean>>({
    bean: false,
    pama: false,
    hodu: false,
  });

  /* ========================================
     FLOATING DATA
  ======================================== */

  const [
    floatingData,
    setFloatingData,
  ] = useState<FloatingData[]>([]);

  useEffect(() => {
    setFloatingData(
      createFloatingData(34)
    );
  }, []);

  /* ========================================
     DISPLAY STATUS
  ======================================== */

  const hoduDisplayStatus =
    hoduHovered &&
    runtime.hodu.visible
      ? "CHASING"
      : runtime.hodu.status;

  /* ========================================
     RANDOM DIALOGUE SCHEDULER
  ======================================== */

  useEffect(() => {
    let cancelled = false;

    const timers: number[] = [];

    const scheduleDialogue = (
      id: ResidentId
    ) => {
      const scheduleNext = () => {
        if (cancelled) {
          return;
        }

        /*
          15 ~ 35초 기다림
        */

        const wait =
          15000 +
          Math.random() * 20000;

        const waitTimer =
          window.setTimeout(() => {
            if (cancelled) {
              return;
            }

            /*
              화면에 실제 존재하는
              Resident만 혼잣말.
            */

            if (runtime[id].visible) {
              setVisibleDialogue(
                (prev) => ({
                  ...prev,

                  [id]: true,
                })
              );

              /*
                2.5 ~ 4초 동안 보임
              */

              const duration =
                2500 +
                Math.random() * 1500;

              const hideTimer =
                window.setTimeout(() => {
                  if (cancelled) {
                    return;
                  }

                  setVisibleDialogue(
                    (prev) => ({
                      ...prev,

                      [id]: false,
                    })
                  );

                  scheduleNext();
                }, duration);

              timers.push(hideTimer);

              return;
            }

            /*
              지금 없는 캐릭터라면
              다시 다음 시점 예약.
            */

            scheduleNext();
          }, wait);

        timers.push(waitTimer);
      };

      scheduleNext();
    };

    scheduleDialogue("bean");
    scheduleDialogue("pama");
    scheduleDialogue("hodu");

    return () => {
      cancelled = true;

      timers.forEach((timer) => {
        window.clearTimeout(timer);
      });
    };
  }, [
    kstTime.hour,
    runtime.bean.visible,
    runtime.pama.visible,
    runtime.hodu.visible,
  ]);

  /* ========================================
     HIDE DIALOGUE WHEN RESIDENT LEAVES
  ======================================== */

  useEffect(() => {
    setVisibleDialogue((prev) => ({
      bean:
        runtime.bean.visible
          ? prev.bean
          : false,

      pama:
        runtime.pama.visible
          ? prev.pama
          : false,

      hodu:
        runtime.hodu.visible
          ? prev.hodu
          : false,
    }));
  }, [
    runtime.bean.visible,
    runtime.pama.visible,
    runtime.hodu.visible,
  ]);

  /* ========================================
     IF HODU GOES AWAY
  ======================================== */

  useEffect(() => {
    if (runtime.hodu.visible) {
      return;
    }

    setHoduHovered(false);
    setHoduTargetId(null);
  }, [runtime.hodu.visible]);

  /* ========================================
     PROFILE ESC
  ======================================== */

  useEffect(() => {
    if (!selectedResident) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        setSelectedResident(null);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [selectedResident]);

  /* ========================================
     TERMINAL FOCUS
  ======================================== */

  useEffect(() => {
    if (!bootComplete) {
      return;
    }

    const timer = setTimeout(() => {
      terminalInputRef.current?.focus();
    }, 250);

    return () => {
      clearTimeout(timer);
    };
  }, [bootComplete]);

  /* ========================================
     TERMINAL AUTO SCROLL
  ======================================== */

  useEffect(() => {
    if (!bootComplete) {
      return;
    }

    const element =
      terminalScrollRef.current;

    if (!element) {
      return;
    }

    element.scrollTo({
      top: element.scrollHeight,
      behavior: "smooth",
    });
  }, [
    terminalHistory,
    bootComplete,
  ]);

  /* ========================================
     HODU INTERACTION
  ======================================== */

  function engageHodu() {
    if (
      !bootComplete ||
      !runtime.hodu.visible
    ) {
      return;
    }

    /*
      랜덤 혼잣말은 잠시 끄고
      CHASING 대사로 강제 전환.
    */

    setVisibleDialogue((prev) => ({
      ...prev,
      hodu: false,
    }));

    setHoduHovered(true);

    const nearbyData =
      floatingData.filter((item) => {
        const d = distance(
          item.x,
          item.y,
          HODU_CENTER.x,
          HODU_CENTER.y
        );

        return (
          d <= HODU_REACTION_RADIUS
        );
      });

    if (
      nearbyData.length === 0
    ) {
      setHoduTargetId(null);

      return;
    }

    const target =
      nearbyData[
        Math.floor(
          Math.random() *
            nearbyData.length
        )
      ];

    setHoduTargetId(target.id);
  }

  function disengageHodu() {
    setHoduHovered(false);

    setHoduTargetId(null);
  }

  /* ========================================
     TERMINAL HISTORY
  ======================================== */

  function createHistoryItem(
    type: TerminalHistoryItem["type"],
    text: string
  ): TerminalHistoryItem {
    terminalHistoryId.current += 1;

    return {
      id: terminalHistoryId.current,

      type,
      text,
    };
  }

  function addTerminalOutput(
    lines: string[]
  ) {
    const items =
      lines.map((line) =>
        createHistoryItem(
          "output",
          line
        )
      );

    setTerminalHistory((prev) => [
      ...prev,
      ...items,
    ]);
  }

  /* ========================================
     TERMINAL COMMANDS
  ======================================== */

  function executeCommand(
    rawCommand: string
  ) {
    const original =
      rawCommand.trim();

    const command =
      original.toLowerCase();

    if (!command) {
      return;
    }

    /* CLEAR */

    if (command === "clear") {
      setTerminalHistory([]);

      return;
    }

    setTerminalHistory((prev) => [
      ...prev,

      createHistoryItem(
        "command",
        original
      ),
    ]);

    /* HELP */

    if (command === "help") {
      addTerminalOutput([
        "> available commands:",
        ">",
        "> help",
        "> residents",
        "> bean",
        "> pama",
        "> hodu",
        "> where bean",
        "> where pama",
        "> where hodu",
        "> about",
        "> status",
        "> clear",
        "> goto bitandink",
      ]);

      return;
    }

    /* ========================================
       OPEN PROFILE
    ======================================== */

    if (
      command === "bean" ||
      command === "open bean" ||
      command === "resident bean"
    ) {
      addTerminalOutput([
        "> opening resident profile: BEAN",
      ]);

      setSelectedResident("bean");

      return;
    }

    if (
      command === "pama" ||
      command === "open pama" ||
      command === "resident pama"
    ) {
      addTerminalOutput([
        "> opening resident profile: PAMA",
      ]);

      setSelectedResident("pama");

      return;
    }

    if (
      command === "hodu" ||
      command === "open hodu" ||
      command === "resident hodu"
    ) {
      addTerminalOutput([
        "> opening resident profile: HODU",
      ]);

      setSelectedResident("hodu");

      return;
    }

    /* ========================================
       WHERE
    ======================================== */

    if (command === "where bean") {
      addTerminalOutput([
        "> BEAN",

        `> status ...... ${runtime.bean.status}`,

        `> location .... ${
          runtime.bean.visible
            ? "beanlog space"
            : "data stream"
        }`,

        `> note ........ ${runtime.bean.message}`,
      ]);

      return;
    }

    if (command === "where pama") {
      addTerminalOutput([
        "> PAMA",

        `> status ...... ${runtime.pama.status}`,

        `> location .... ${
          runtime.pama.visible
            ? "beanlog space"
            : "data stream"
        }`,

        `> note ........ ${runtime.pama.message}`,
      ]);

      return;
    }

    if (command === "where hodu") {
      addTerminalOutput([
        "> HODU",

        `> status ...... ${hoduDisplayStatus}`,

        `> location .... ${
          runtime.hodu.visible
            ? "beanlog space"
            : "data stream"
        }`,

        `> note ........ ${runtime.hodu.message}`,
      ]);

      return;
    }

    /* RESIDENTS */

    if (
      command === "residents"
    ) {
      const visibleCount = (
        Object.keys(
          runtime
        ) as ResidentId[]
      ).filter(
        (id) =>
          runtime[id].visible
      ).length;

      addTerminalOutput([
        "> resident registry:",
        ">",

        `> 01  BEAN  .... ${runtime.bean.status}`,

        `> 02  PAMA  .... ${runtime.pama.status}`,

        `> 03  HODU  .... ${hoduDisplayStatus}`,

        ">",

        `> visible residents: ${visibleCount} / 3`,
      ]);

      return;
    }

    /* ABOUT */

    if (command === "about") {
      addTerminalOutput([
        "> beanlog.site",
        ">",
        "> a small virtual data space",
        "> inhabited by three residents.",
        ">",
        "> BEAN / PAMA / HODU",
      ]);

      return;
    }

    /* STATUS */

    if (command === "status") {
      const visibleCount = (
        Object.keys(
          runtime
        ) as ResidentId[]
      ).filter(
        (id) =>
          runtime[id].visible
      ).length;

      addTerminalOutput([
        "> BEANLOG.SYSTEM",
        ">",

        `> local time ...... ${kstTime.label} KST`,

        "> environment ..... ONLINE",

        "> residents ....... 03",

        `> visible ......... ${String(
          visibleCount
        ).padStart(2, "0")}`,

        "> data stream ..... STABLE",

        "> terminal ........ READY",
      ]);

      return;
    }

    /* GOTO */

    if (
      command === "goto bitandink" ||
      command === "goto bitandink.site"
    ) {
      addTerminalOutput([
        "> leaving Beanlog...",
      ]);

      window.setTimeout(() => {
        addTerminalOutput([
          "> crossing world boundary...",
        ]);
      }, 450);

      window.setTimeout(() => {
        addTerminalOutput([
          "> connection established.",
        ]);
      }, 900);

      window.setTimeout(() => {
        router.push("/bitandink");
      }, 1350);

      return;
    }

    /* UNKNOWN */

    addTerminalOutput([
      `> command not found: ${command}`,

      "> type 'help' for available commands.",
    ]);
  }

  /* ========================================
     TERMINAL SUBMIT
  ======================================== */

  function handleTerminalSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const command =
      terminalInput.trim();

    if (!command) {
      return;
    }

    executeCommand(command);

    setTerminalInput("");

    requestAnimationFrame(() => {
      terminalInputRef.current?.focus();
    });
  }

  /* ========================================
     BOOT TYPING
  ======================================== */

  useEffect(() => {
    let lineIndex = 0;
    let charIndex = 0;

    let timer: ReturnType<
      typeof setTimeout
    >;

    const typeNextCharacter = () => {
      const line =
        bootLines[lineIndex];

      if (
        charIndex <
        line.length
      ) {
        setCurrentText(
          line.slice(
            0,
            charIndex + 1
          )
        );

        charIndex += 1;

        timer = setTimeout(
          typeNextCharacter,
          45
        );

        return;
      }

      setTypedLines((prev) => [
        ...prev,
        line,
      ]);

      setCurrentText("");

      if (
        line ===
        "> loading environment ........ OK"
      ) {
        setEnvironmentReady(true);
        setTerminalDocked(true);
      }

      if (
        line ===
        "> resident 01 ........ BEAN"
      ) {
        setBeanReady(true);
      }

      if (
        line ===
        "> resident 02 ........ PAMA"
      ) {
        setPamaReady(true);
      }

      if (
        line ===
        "> resident 03 ........ HODU"
      ) {
        setHoduReady(true);
      }

      lineIndex += 1;
      charIndex = 0;

      if (
        lineIndex >=
        bootLines.length
      ) {
        timer = setTimeout(() => {
          setBootComplete(true);
        }, 700);

        return;
      }

      let delay = 350;

      if (
        bootLines[lineIndex] ===
        ""
      ) {
        delay = 100;
      }

      if (
        line ===
        "> loading environment ........ OK"
      ) {
        delay = 1100;
      }

      timer = setTimeout(
        typeNextCharacter,
        delay
      );
    };

    timer = setTimeout(
      typeNextCharacter,
      700
    );

    return () => {
      clearTimeout(timer);
    };
  }, []);

  /* ========================================
     PROFILE
  ======================================== */

  const activeProfile =
    selectedResident
      ? residentProfiles[
          selectedResident
        ]
      : null;

  const activeRuntime =
    activeProfile
      ? runtime[
          activeProfile.id
        ]
      : null;

  /* ========================================
     DIALOGUE TEXT
  ======================================== */

  const beanDialogue =
    getResidentDialogue(
      "bean",
      runtime.bean.status
    );

  const pamaDialogue =
    getResidentDialogue(
      "pama",
      runtime.pama.status
    );

  const hoduDialogue =
    getResidentDialogue(
      "hodu",
      hoduDisplayStatus
    );

  /* ========================================
     RENDER
  ======================================== */

  return (
    <main
      className={[
        "beanlog-world",

        bootComplete
          ? "boot-complete"
          : "booting",

        terminalDocked
          ? "terminal-docked"
          : "",

        hoduHovered
          ? "hodu-engaged"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* ====================================
          DATA SPACE
      ==================================== */}

      <div
        className={[
          "data-space",

          environmentReady
            ? "is-visible"
            : "",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-hidden="true"
      >
        {floatingData.map(
          (item) => {
            const escape =
              getHoduEscape(
                item
              );

            const isEscaping =
              bootComplete &&
              hoduHovered &&
              runtime.hodu.visible &&
              escape.active;

            const isTarget =
              bootComplete &&
              hoduHovered &&
              runtime.hodu.visible &&
              hoduTargetId ===
                item.id;

            return (
              <span
                key={item.id}
                className={[
                  "floating-data-shell",

                  isEscaping
                    ? "is-escaping"
                    : "",

                  isTarget
                    ? "is-hodu-target"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                style={
                  {
                    "--x":
                      `${item.x}%`,

                    "--y":
                      `${item.y}%`,

                    "--size":
                      `${item.size}px`,

                    "--duration":
                      `${item.duration}s`,

                    "--delay":
                      `${item.delay}s`,

                    "--drift-x":
                      `${item.driftX}px`,

                    "--drift-y":
                      `${item.driftY}px`,

                    "--data-opacity":
                      item.opacity,

                    "--rotation":
                      `${item.rotation}deg`,

                    "--escape-x":
                      `${escape.x}px`,

                    "--escape-y":
                      `${escape.y}px`,
                  } as CSSProperties
                }
              >
                <span className="floating-data">
                  {item.text}
                </span>
              </span>
            );
          }
        )}

        <div className="node node-1" />
        <div className="node node-2" />
        <div className="node node-3" />
      </div>

      {/* ====================================
          TERMINAL
      ==================================== */}

      <section
        className="terminal-panel"
        onClick={() => {
          if (
            bootComplete &&
            !selectedResident
          ) {
            terminalInputRef.current?.focus();
          }
        }}
      >
        <div className="terminal-bar">
          <div className="terminal-dots">
            <span />
            <span />
            <span />
          </div>

          <span className="terminal-label">
            BEANLOG / TERMINAL
          </span>
        </div>

        <div className="terminal-body">
          <div
            ref={terminalScrollRef}
            className="terminal-output boot-output"
          >
            {typedLines.map(
              (
                line,
                index
              ) => {
                const isCommand =
                  index === 0;

                if (
                  line === ""
                ) {
                  return (
                    <div
                      key={`spacer-${index}`}
                      className="terminal-spacer"
                    />
                  );
                }

                const isWelcome =
                  line ===
                  "> welcome to beanlog.site!";

                return (
                  <p
                    key={`${line}-${index}`}
                    className={[
                      isCommand
                        ? "terminal-command"
                        : "",

                      isWelcome
                        ? "terminal-welcome"
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {isCommand ? (
                      <span>
                        bean@beanlog:~$
                      </span>
                    ) : null}

                    {line}
                  </p>
                );
              }
            )}

            {!bootComplete ? (
              <p
                className={
                  typedLines.length ===
                  0
                    ? "terminal-command"
                    : ""
                }
              >
                {typedLines.length ===
                0 ? (
                  <span>
                    bean@beanlog:~$
                  </span>
                ) : null}

                {currentText}

                <i className="terminal-cursor" />
              </p>
            ) : null}

            {bootComplete &&
              terminalHistory.map(
                (item) => {
                  if (
                    item.type ===
                    "command"
                  ) {
                    return (
                      <p
                        key={item.id}
                        className="terminal-command terminal-history-command"
                      >
                        <span>
                          bean@beanlog:~$
                        </span>

                        {item.text}
                      </p>
                    );
                  }

                  if (
                    item.text ===
                    ">"
                  ) {
                    return (
                      <div
                        key={item.id}
                        className="terminal-history-spacer"
                      />
                    );
                  }

                  return (
                    <p
                      key={item.id}
                      className="terminal-history-output"
                    >
                      {item.text}
                    </p>
                  );
                }
              )}

            {bootComplete ? (
              <form
                className="terminal-input-row"
                onSubmit={
                  handleTerminalSubmit
                }
              >
                <span className="terminal-prompt">
                  bean@beanlog:~$
                </span>

                <input
                  ref={terminalInputRef}
                  className="terminal-input"
                  value={terminalInput}
                  onChange={(event) =>
                    setTerminalInput(
                      event.target.value
                    )
                  }
                  placeholder="try 'help'..."
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  aria-label="Beanlog terminal command"
                />
              </form>
            ) : null}
          </div>
        </div>
      </section>

      {/* ====================================
          SYSTEM HUD
      ==================================== */}

      <aside className="system-hud">
        <div className="hud-header">
          <span>
            BEANLOG.SYSTEM
          </span>

          <span className="hud-online">
            ● ONLINE
          </span>
        </div>

        <div className="hud-summary">
          <span>
            RESIDENTS
          </span>

          <strong>
            03
          </strong>
        </div>

        <div className="hud-residents">
          <div>
            <span>01</span>

            <strong>
              BEAN
            </strong>

            <em>
              {runtime.bean.status}
            </em>
          </div>

          <div>
            <span>02</span>

            <strong>
              PAMA
            </strong>

            <em>
              {runtime.pama.status}
            </em>
          </div>

          <div>
            <span>03</span>

            <strong>
              HODU
            </strong>

            <em>
              {hoduDisplayStatus}
            </em>
          </div>
        </div>
      </aside>

      {/* ====================================
          RESIDENTS
      ==================================== */}

      <section className="residents">
        {/* PAMA */}

        <div
          className={[
            "resident",
            "resident-pama",

            pamaReady
              ? "is-visible"
              : "",

            !runtime.pama.visible
              ? "is-away"
              : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div
            className={[
              "speech-bubble",
              "speech-pama",

              visibleDialogue.pama &&
              runtime.pama.visible
                ? "is-speaking"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {pamaDialogue
              .split("\n")
              .map(
                (
                  line,
                  index,
                  lines
                ) => (
                  <span key={index}>
                    {line}

                    {index <
                    lines.length -
                      1 ? (
                      <br />
                    ) : null}
                  </span>
                )
              )}
          </div>

          <div className="resident-visual">
            <Image
              src="/bitandink/residents/pama.webp"
              alt="Pama"
              width={600}
              height={600}
              priority
            />
          </div>
        </div>

        {/* BEAN */}

        <div
          className={[
            "resident",
            "resident-bean",

            beanReady
              ? "is-visible"
              : "",

            !runtime.bean.visible
              ? "is-away"
              : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div
            className={[
              "speech-bubble",
              "speech-bean",

              visibleDialogue.bean &&
              runtime.bean.visible
                ? "is-speaking"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {beanDialogue}
          </div>

          <div className="resident-visual">
            <Image
              src="/bitandink/residents/bean.webp"
              alt="Bean"
              width={600}
              height={600}
              priority
            />
          </div>
        </div>

        {/* HODU */}

        <div
          className={[
            "resident",
            "resident-hodu",

            hoduReady
              ? "is-visible"
              : "",

            !runtime.hodu.visible
              ? "is-away"
              : "",

            hoduHovered &&
            runtime.hodu.visible
              ? "is-chasing"
              : "",
          ]
            .filter(Boolean)
            .join(" ")}
          onMouseEnter={engageHodu}
          onMouseLeave={disengageHodu}
        >
          <div
            className={[
              "speech-bubble",
              "speech-hodu",

              (visibleDialogue.hodu ||
                hoduHovered) &&
              runtime.hodu.visible
                ? "is-speaking"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {hoduDialogue
              .split("\n")
              .map(
                (
                  line,
                  index,
                  lines
                ) => (
                  <span key={index}>
                    {line}

                    {index <
                    lines.length -
                      1 ? (
                      <br />
                    ) : null}
                  </span>
                )
              )}
          </div>

          <div className="resident-visual">
            <Image
              src="/bitandink/residents/hodu.webp"
              alt="Hodu"
              width={600}
              height={600}
              priority
              unoptimized
            />
          </div>
        </div>
      </section>

      {/* ====================================
          RESIDENT CARDS
      ==================================== */}

      <nav
        className="resident-cards"
        aria-label="Beanlog residents"
      >
        {(
          [
            "bean",
            "pama",
            "hodu",
          ] as ResidentId[]
        ).map((id) => {
          const profile =
            residentProfiles[id];

          const state =
            runtime[id];

          const status =
            id === "hodu"
              ? hoduDisplayStatus
              : state.status;

          return (
            <button
              key={id}
              type="button"
              className={[
                "resident-card",

                `resident-card-${id}`,

                !state.visible
                  ? "is-away"
                  : "",

                selectedResident ===
                id
                  ? "is-selected"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() =>
                setSelectedResident(
                  id
                )
              }
            >
              <span className="resident-card-number">
                {profile.number}
              </span>

              <span className="resident-card-main">
                <strong>
                  {profile.name}
                </strong>

                <small>
                  {state.message}
                </small>
              </span>

              <span className="resident-card-status">
                {status}
              </span>
            </button>
          );
        })}
      </nav>

      {/* ====================================
          PROFILE
      ==================================== */}

      {activeProfile &&
      activeRuntime ? (
        <div
          className="resident-profile-layer"
          role="presentation"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setSelectedResident(
                null
              );
            }
          }}
        >
          <section
            className="resident-profile"
            role="dialog"
            aria-modal="true"
            aria-labelledby="resident-profile-title"
          >
            <div className="resident-profile-bar">
              <span>
                RESIDENT.PROFILE
              </span>

              <button
                type="button"
                className="resident-profile-close"
                onClick={() =>
                  setSelectedResident(
                    null
                  )
                }
                aria-label="Close resident profile"
              >
                ×
              </button>
            </div>

            <div className="resident-profile-body">
              <header className="resident-profile-heading">
                <div>
                  <span className="resident-profile-index">
                    RESIDENT{" "}
                    {activeProfile.number}
                  </span>

                  <h2 id="resident-profile-title">
                    {activeProfile.name}
                  </h2>
                </div>

                <span className="resident-profile-status">
                  ●{" "}
                  {activeProfile.id ===
                  "hodu"
                    ? hoduDisplayStatus
                    : activeRuntime.status}
                </span>
              </header>

              <div className="resident-profile-meta">
                <span>
                  {activeProfile.type}
                </span>

                {activeProfile.age ? (
                  <span>
                    {activeProfile.age}
                  </span>
                ) : null}
              </div>

              <p className="resident-profile-tagline">
                {activeProfile.tagline}
              </p>

              <div className="resident-profile-current">
                <span className="resident-profile-label">
                  CURRENT
                </span>

                <p>
                  {activeRuntime.message}
                </p>
              </div>

              <div className="resident-profile-grid">
                <section>
                  <span className="resident-profile-label">
                    TRAITS
                  </span>

                  <ul>
                    {activeProfile.traits.map(
                      (trait) => (
                        <li key={trait}>
                          {trait}
                        </li>
                      )
                    )}
                  </ul>
                </section>

                <section>
                  <span className="resident-profile-label">
                    FAVORITES
                  </span>

                  <ul>
                    {activeProfile.favorites.map(
                      (favorite) => (
                        <li
                          key={
                            favorite
                          }
                        >
                          {favorite}
                        </li>
                      )
                    )}
                  </ul>
                </section>
              </div>

              <div className="resident-profile-note">
                <span className="resident-profile-label">
                  NOTE
                </span>

                <p>
                  {activeProfile.note}
                </p>
              </div>

              <footer className="resident-profile-footer">
                <span>
                  BEANLOG.SYSTEM
                </span>

                <span>
                  {kstTime.label} KST
                </span>

                <span>
                  ESC TO CLOSE
                </span>
              </footer>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}