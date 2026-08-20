"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";

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

        duration:
          random(24, 52),

        delay:
          random(-50, 0),

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
     TERMINAL STATE
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
     TERMINAL AUTO FOCUS
  ======================================== */

  useEffect(() => {
    if (!bootComplete) {
      return;
    }

    const timer = setTimeout(() => {
      terminalInputRef.current?.focus();
    }, 250);

    return () =>
      clearTimeout(timer);
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
     HODU TARGET / CHASE
  ======================================== */

  function engageHodu() {
    if (!bootComplete) {
      return;
    }

    setHoduHovered(true);

    const nearbyData =
      floatingData.filter(
        (item) => {
          const d = distance(
            item.x,
            item.y,
            HODU_CENTER.x,
            HODU_CENTER.y
          );

          return (
            d <=
            HODU_REACTION_RADIUS
          );
        }
      );

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

    setHoduTargetId(
      target.id
    );
  }

  function disengageHodu() {
    setHoduHovered(false);

    setHoduTargetId(null);
  }

  /* ========================================
     TERMINAL HISTORY HELPERS
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
    const outputItems =
      lines.map(
        (line) =>
          createHistoryItem(
            "output",
            line
          )
      );

    setTerminalHistory(
      (prev) => [
        ...prev,
        ...outputItems,
      ]
    );
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

    /*
      clear는 실행된 명령 자체도
      화면에 남기지 않고 history를 정리.
    */

    if (command === "clear") {
      setTerminalHistory([]);

      return;
    }

    const commandItem =
      createHistoryItem(
        "command",
        original
      );

    setTerminalHistory(
      (prev) => [
        ...prev,
        commandItem,
      ]
    );

    /* HELP */

    if (command === "help") {
      addTerminalOutput([
        "> available commands:",
        ">",
        "> help",
        "> residents",
        "> about",
        "> status",
        "> clear",
        "> goto bitandink",
      ]);

      return;
    }

    /* RESIDENTS */

    if (command === "residents") {
      addTerminalOutput([
        "> resident registry:",
        ">",
        "> 01  BEAN  .... ACTIVE",
        "> 02  PAMA  .... IDLE",
        "> 03  HODU  .... ???",
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
      addTerminalOutput([
        "> BEANLOG.SYSTEM",
        ">",
        "> environment .... ONLINE",
        "> residents ...... 03",
        "> data stream .... STABLE",
        "> terminal ....... READY",
      ]);

      return;
    }

    /* BITANDINK */

    if (
      command ===
        "goto bitandink" ||
      command ===
        "goto bitandink.site"
    ) {
      addTerminalOutput([
        "> locating bitandink...",
        "> destination is not connected yet.",
      ]);

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

            const isTarget =
              bootComplete &&
              hoduHovered &&
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

      {/* ========================================
          TERMINAL
      ======================================== */}

      <section
        className="terminal-panel"
        onClick={() => {
          if (bootComplete) {
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
            {/* ====================================
                BOOT HISTORY
            ==================================== */}

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

            {/* ====================================
                BOOT CURRENT LINE
            ==================================== */}

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

            {/* ====================================
                USER COMMAND HISTORY
            ==================================== */}

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
                    item.text === ">"
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

            {/* ====================================
                REAL TERMINAL INPUT
            ==================================== */}

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
                  ref={
                    terminalInputRef
                  }
                  className="terminal-input"
                  value={
                    terminalInput
                  }
                  onChange={
                    (event) => {
                      setTerminalInput(
                        event.target.value
                      );
                    }
                  }
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
          onMouseEnter={
            engageHodu
          }
          onMouseLeave={
            disengageHodu
          }
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