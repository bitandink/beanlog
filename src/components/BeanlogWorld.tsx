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
  if (Math.random() < 0.82) {
    return randomBinary();
  }

  return randomHex();
}

/* ========================================
   RESIDENT POSITIONS

   캐릭터가 작아지고 위치가 바뀌었으므로
   opacity 계산용 중심 좌표도 조정.
======================================== */

const residentCenters = [
  /* PAMA */
  {
    x: 20,
    y: 62,
    radius: 17,
  },

  /* BEAN */
  {
    x: 50,
    y: 72,
    radius: 16,
  },

  /* HODU */
  {
    x: 82,
    y: 38,
    radius: 16,
  },
];

/* ========================================
   HODU REACTION
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
   HODU ESCAPE VECTOR
======================================== */

function getHoduEscape(
  item: FloatingData
) {
  const dx =
    item.x - HODU_CENTER.x;

  const dy =
    item.y - HODU_CENTER.y;

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

      x:
        Math.cos(angle) * 48,

      y:
        Math.sin(angle) * 48,
    };
  }

  const proximity =
    1 - d / HODU_REACTION_RADIUS;

  const force =
    15 + proximity * 38;

  return {
    active: true,

    x:
      (dx / d) *
      force,

    y:
      (dy / d) *
      force,
  };
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
      const x =
        random(2, 96);

      const y =
        random(4, 94);

      return {
        id: index,

        text:
          generateDataText(),

        x,
        y,

        size:
          random(7, 13),

        opacity:
          calculateOpacity(
            x,
            y
          ),

        /*
          이전보다 훨씬 느리게.
        */

        duration:
          random(24, 52),

        /*
          이미 공간에 떠 있던 것처럼
          서로 다른 시점에서 시작.
        */

        delay:
          random(-50, 0),

        /*
          이동 거리는 조금 넓게.
          대신 속도가 느려서
          길게 흘러가는 느낌.
        */

        driftX:
          random(-58, 58),

        driftY:
          random(-52, 52),

        rotation:
          random(-2, 2),
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
     HODU INTERACTION
  ======================================== */

  const [
    hoduHovered,
    setHoduHovered,
  ] = useState(false);

  /* ========================================
     RANDOM DATA
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

        hoduHovered
          ? "hodu-engaged"
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
          (item) => {
            const escape =
              getHoduEscape(
                item
              );

            const isEscaping =
              bootComplete &&
              hoduHovered &&
              escape.active;

            return (
              <span
                key={item.id}
                className={[
                  "floating-data-shell",

                  isEscaping
                    ? "is-escaping"
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
                  typedLines.length === 0
                    ? "terminal-command"
                    : ""
                }
              >
                {typedLines.length === 0 ? (
                  <span>
                    bean@beanlog:~$
                  </span>
                ) : null}

                {currentText}

                <i className="terminal-cursor" />
              </p>
            ) : null}

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
              {hoduHovered
                ? "CHASING"
                : "???"}
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

          <div className="resident-visual">
            <Image
              src="/residents/pama.webp"
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
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div className="speech-bubble speech-bean">
            집중 중...
          </div>

          <div className="resident-visual">
            <Image
              src="/residents/bean.webp"
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

            hoduHovered
              ? "is-chasing"
              : "",
          ]
            .filter(Boolean)
            .join(" ")}
          onMouseEnter={() => {
            if (bootComplete) {
              setHoduHovered(
                true
              );
            }
          }}
          onMouseLeave={() => {
            setHoduHovered(
              false
            );
          }}
        >
          <div className="speech-bubble speech-hodu">
            저거 잡으면
            <br />
            재밌겠다!
          </div>

          <div className="resident-visual">
            <Image
              src="/residents/hodu.webp"
              alt="Hodu"
              width={600}
              height={600}
              priority
            />
          </div>
        </div>
      </section>
    </main>
  );
}