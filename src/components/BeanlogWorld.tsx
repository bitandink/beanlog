"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Image from "next/image";

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
   RANDOM HELPERS
======================================== */

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function randomInteger(min: number, max: number) {
  return Math.floor(random(min, max + 1));
}

/* ========================================
   RANDOM BINARY
======================================== */

function randomBinary() {
  /*
    1~10자리 이진수 생성

    0
    101
    001101
    1100101010
    ...
  */

  const length = randomInteger(1, 10);

  return Array.from(
    { length },
    () => (Math.random() > 0.5 ? "1" : "0")
  ).join("");
}

/* ========================================
   RANDOM HEX
======================================== */

function randomHex() {
  /*
    0x00 ~ 0xFF
  */

  const value = randomInteger(0, 255);

  return `0x${value
    .toString(16)
    .toUpperCase()
    .padStart(2, "0")}`;
}

/* ========================================
   GENERATE DATA TEXT
======================================== */

function generateDataText() {
  /*
    대부분은 이진수.

    HEX가 너무 많으면
    오히려 장식적으로 보여서 18%만.
  */

  if (Math.random() < 0.82) {
    return randomBinary();
  }

  return randomHex();
}

/* ========================================
   RESIDENT PROXIMITY

   데이터를 아예 금지하지 않고
   캐릭터 중심에 가까울수록 희미하게 처리.
======================================== */

const residentCenters = [
  /*
    PAMA
  */
  {
    x: 18,
    y: 72,
    radius: 21,
  },

  /*
    BEAN
  */
  {
    x: 50,
    y: 74,
    radius: 20,
  },

  /*
    HODU
  */
  {
    x: 82,
    y: 39,
    radius: 20,
  },
];

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
  /*
    기본 밝기도 랜덤.
  */

  let opacity = random(0.16, 0.42);

  /*
    가장 가까운 캐릭터와의 거리 확인.
  */

  for (const resident of residentCenters) {
    const d = distance(
      x,
      y,
      resident.x,
      resident.y
    );

    if (d < resident.radius) {
      /*
        캐릭터 중심에 가까울수록 희미함.

        중심부에서도 완전히 사라지지는 않게
        최소 25% 정도는 남김.
      */

      const proximity =
        d / resident.radius;

      const multiplier =
        0.25 + proximity * 0.75;

      opacity *= multiplier;
    }
  }

  return opacity;
}

/* ========================================
   CREATE RANDOM FLOATING DATA
======================================== */

function createFloatingData(
  count = 34
): FloatingData[] {
  return Array.from(
    { length: count },
    (_, index) => {
      /*
        가장자리 살짝 여유.
      */

      const x = random(2, 96);
      const y = random(4, 94);

      return {
        id: index,

        /*
          문자열도 매번 새로 생성
        */

        text: generateDataText(),

        /*
          위치 완전 랜덤
        */

        x,
        y,

        /*
          크기도 랜덤
        */

        size: random(7, 13),

        /*
          캐릭터 근처에서는 자동으로
          더 흐려짐.
        */

        opacity:
          calculateOpacity(x, y),

        /*
          애니메이션 속도
        */

        duration:
          random(13, 30),

        /*
          이미 떠다니고 있던 것처럼
          animation 중간 지점에서 시작.
        */

        delay:
          random(-30, 0),

        /*
          이동 방향 / 거리
        */

        driftX:
          random(-42, 42),

        driftY:
          random(-38, 38),

        /*
          미세한 회전도 각자 다르게.
        */

        rotation:
          random(-2.5, 2.5),
      };
    }
  );
}

/* ========================================
   COMPONENT
======================================== */

export default function BeanlogWorld() {
  /* ========================================
     BOOT STATES
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
     RANDOM DATA STATE
  ======================================== */

  const [
    floatingData,
    setFloatingData,
  ] = useState<FloatingData[]>([]);

  /*
    브라우저 마운트 후 한 번만 생성.

    React가 다시 렌더링되어도
    데이터 위치는 바뀌지 않는다.
  */

  useEffect(() => {
    setFloatingData(
      createFloatingData(34)
    );
  }, []);

  /* ========================================
     TERMINAL BOOT
  ======================================== */

  useEffect(() => {
    let lineIndex = 0;
    let charIndex = 0;

    let timer:
      ReturnType<typeof setTimeout>;

    const typeNextCharacter = () => {
      const line =
        bootLines[lineIndex];

      /* ----------------------------------------
         CHARACTER TYPING
      ---------------------------------------- */

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

      /* ----------------------------------------
         LINE COMPLETE
      ---------------------------------------- */

      setTypedLines(
        (prev) => [
          ...prev,
          line,
        ]
      );

      setCurrentText("");

      /* ========================================
         BOOT EVENTS
      ======================================== */

      if (
        line ===
        "> loading environment ........ OK"
      ) {
        setEnvironmentReady(
          true
        );

        setTerminalDocked(
          true
        );
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

      /* ----------------------------------------
         NEXT LINE
      ---------------------------------------- */

      lineIndex += 1;
      charIndex = 0;

      /* ----------------------------------------
         BOOT COMPLETE
      ---------------------------------------- */

      if (
        lineIndex >=
        bootLines.length
      ) {
        timer = setTimeout(
          () => {
            setBootComplete(
              true
            );
          },
          700
        );

        return;
      }

      /* ----------------------------------------
         LINE DELAY
      ---------------------------------------- */

      let delay = 350;

      if (
        bootLines[
          lineIndex
        ] === ""
      ) {
        delay = 100;
      }

      /*
        environment가 로드되면
        terminal docking을 기다림.
      */

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

    /*
      처음 시작할 때
      잠깐 정적 상태 유지.
    */

    timer = setTimeout(
      typeNextCharacter,
      700
    );

    return () =>
      clearTimeout(timer);
  }, []);

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
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* ========================================
          DATA SPACE
      ======================================== */}

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
          (item) => (
            <span
              key={item.id}
              className="floating-data"
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
                } as CSSProperties
              }
            >
              {item.text}
            </span>
          )
        )}

        <div className="node node-1" />
        <div className="node node-2" />
        <div className="node node-3" />
      </div>

      {/* ========================================
          TERMINAL
      ======================================== */}

      <section className="terminal-panel">
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
          <div className="terminal-output boot-output">
            {typedLines.map(
              (line, index) => {
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
                      .filter(
                        Boolean
                      )
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

            {/* CURRENT LINE */}

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

            {/* READY */}

            {bootComplete ? (
              <p className="terminal-command terminal-ready">
                <span>
                  bean@beanlog:~$
                </span>

                <i className="terminal-cursor" />
              </p>
            ) : null}
          </div>
        </div>
      </section>

      {/* ========================================
          SYSTEM HUD
      ======================================== */}

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
              ACTIVE
            </em>
          </div>

          <div>
            <span>02</span>
            <strong>
              PAMA
            </strong>
            <em>
              IDLE
            </em>
          </div>

          <div>
            <span>03</span>
            <strong>
              HODU
            </strong>
            <em>
              ???
            </em>
          </div>
        </div>
      </aside>

      {/* ========================================
          RESIDENTS
      ======================================== */}

      <section className="residents">
        {/* PAMA */}

        <div
          className={[
            "resident",
            "resident-pama",

            pamaReady
              ? "is-visible"
              : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div className="speech-bubble speech-pama">
            또 저러고 있네...
            <br />
            하아...
          </div>

          <Image
            src="/residents/pama.webp"
            alt="Pama"
            width={600}
            height={600}
            priority
          />
        </div>

        {/* BEAN */}

        <div
          className={[
            "resident",
            "resident-bean",

            beanReady
              ? "is-visible"
              : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div className="speech-bubble speech-bean">
            집중 중...
          </div>

          <Image
            src="/residents/bean.webp"
            alt="Bean"
            width={600}
            height={600}
            priority
          />
        </div>

        {/* HODU */}

        <div
          className={[
            "resident",
            "resident-hodu",

            hoduReady
              ? "is-visible"
              : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div className="speech-bubble speech-hodu">
            저거 잡으면
            <br />
            재밌겠다!
          </div>

          <Image
            src="/residents/hodu.webp"
            alt="Hodu"
            width={600}
            height={600}
            priority
          />
        </div>
      </section>
    </main>
  );
}