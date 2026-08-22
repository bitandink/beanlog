"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import styles from "../styles/bitandink.module.css";

type WorkspaceView =
  | "current"
  | "archive"
  | "beanlog"
  | "perfugium"
  | "playground";

type PlaygroundScene =
  | "idle"
  | "chasing"
  | "fallen"
  | "comforting"
  | "gift";

function clamp(
  value: number,
  min = 0,
  max = 1
) {
  return Math.min(Math.max(value, min), max);
}

function rangeProgress(
  value: number,
  start: number,
  end: number
) {
  return clamp((value - start) / (end - start));
}

function lerp(
  start: number,
  end: number,
  progress: number
) {
  return start + (end - start) * progress;
}

export default function BitandinkHero() {
  const journeyRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const workspaceShellRef = useRef<HTMLDivElement>(null);
  const workspaceMainRef = useRef<HTMLElement>(null);
  const workspaceLockedRef = useRef(false);
  const returningToHeroRef = useRef(false);
  const switchTimerRef = useRef<number | null>(null);
  const playgroundTimersRef = useRef<number[]>([]);
  const thudAudioRef =
    useRef<HTMLAudioElement | null>(null);

  const [activeView, setActiveView] =
    useState<WorkspaceView>("current");

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);

  const [isSwitching, setIsSwitching] =
    useState(false);

  const [
    playgroundScene,
    setPlaygroundScene,
  ] = useState<PlaygroundScene>("idle");

  const [
    playgroundObserver,
    setPlaygroundObserver,
  ] = useState<"pama" | "bitandink" | null>(
    null
  );


  const [
    beanGiftBubbleVisible,
    setBeanGiftBubbleVisible,
  ] = useState(false);

  const [
    giftBalloonPopped,
    setGiftBalloonPopped,
  ] = useState(false);


  const [
    cssLabOpen,
    setCssLabOpen,
  ] = useState(false);

  const [
    cssLabFontSize,
    setCssLabFontSize,
  ] = useState(18);

  const [
    cssLabRadius,
    setCssLabRadius,
  ] = useState(14);

  const [
    cssLabLetterSpacing,
    setCssLabLetterSpacing,
  ] = useState(0.02);

  const [
    cssLabRotate,
    setCssLabRotate,
  ] = useState(0);

  const [
    cssLabOpacity,
    setCssLabOpacity,
  ] = useState(0.92);


  const [
    envPanelOpen,
    setEnvPanelOpen,
  ] = useState(false);

  const [
    envBootStep,
    setEnvBootStep,
  ] = useState(0);

  const [
    envNote,
    setEnvNote,
  ] = useState("");

  const [
    envSendState,
    setEnvSendState,
  ] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");

  const [
    envSendMessage,
    setEnvSendMessage,
  ] = useState("");


  useEffect(() => {
    if (!envPanelOpen) {
      setEnvBootStep(0);
      setEnvSendState("idle");
      setEnvSendMessage("");
      return;
    }

    setEnvBootStep(0);

    const timers = [
      window.setTimeout(
        () => setEnvBootStep(1),
        260
      ),
      window.setTimeout(
        () => setEnvBootStep(2),
        620
      ),
      window.setTimeout(
        () => setEnvBootStep(3),
        980
      ),
      window.setTimeout(
        () => setEnvBootStep(4),
        1360
      ),
    ];

    return () => {
      timers.forEach((timer) =>
        window.clearTimeout(timer)
      );
    };
  }, [envPanelOpen]);

  const sendEnvNote = async () => {
    const note = envNote.trim();

    if (!note || envSendState === "sending") {
      return;
    }

    setEnvSendState("sending");
    setEnvSendMessage(
      "> transmitting private variable..."
    );

    try {
      const response = await fetch(
        "/api/env-note",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            note,
          }),
        }
      );

      const payload = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        throw new Error(
          payload?.message ||
            "Transmission failed."
        );
      }

      setEnvSendState("sent");
      setEnvSendMessage(
        "> delivered to bitandink.\n> variable cleared."
      );
      setEnvNote("");
    } catch {
      setEnvSendState("error");
      setEnvSendMessage(
        "> transmission failed. try again later."
      );
    }
  };

  useEffect(() => {
    const audio =
      new Audio(
        "/bitandink/sounds/thud.wav"
      );

    audio.volume = 0.25;

    thudAudioRef.current = audio;

    return () => {
      audio.pause();
      thudAudioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const params =
      new URLSearchParams(
        window.location.search
      );

    const requested =
      params.get("view");

    if (
      requested !== "archive" &&
      requested !== "perfugium" &&
      requested !== "playground"
    ) {
      return;
    }

    setActiveView(requested);

    const frame =
      window.requestAnimationFrame(
        () => {
          const journey =
            journeyRef.current;

          if (!journey) {
            return;
          }

          const workspaceTop =
            journey.offsetTop +
            journey.offsetHeight -
            window.innerHeight;

          window.scrollTo({
            top: workspaceTop,
            behavior: "auto",
          });

          workspaceMainRef.current?.scrollTo({
            top: 0,
            behavior: "auto",
          });

          workspaceLockedRef.current =
            true;
        }
      );

    return () => {
      window.cancelAnimationFrame(
        frame
      );
    };
  }, []);

  useEffect(() => {
    const journey = journeyRef.current;
    const sticky = stickyRef.current;

    if (!journey || !sticky) {
      return;
    }

    let frameId = 0;

    const update = () => {
      frameId = 0;

      const rect = journey.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const scrollDistance = Math.max(
        journey.offsetHeight - viewportHeight,
        1
      );

      const progress = clamp(
        -rect.top / scrollDistance
      );

      /*
        Once the workspace is entered, keep the outer Hero
        scroll locked. Do not continuously derive the lock
        from scroll progress, because one stray wheel tick
        could otherwise lower progress and unlock it again.
      */
      if (
        !returningToHeroRef.current &&
        progress >= 0.96
      ) {
        workspaceLockedRef.current = true;
      }

      /*
        During an explicit return, keep the workspace
        unlocked until we are safely back near the Hero.
      */
      if (
        returningToHeroRef.current &&
        progress <= 0.08
      ) {
        returningToHeroRef.current = false;
      }

      const isMobile = window.innerWidth <= 780;

      const cameraProgress = rangeProgress(
        progress,
        0.08,
        0.88
      );

      const finalScale = isMobile ? 2.7 : 3.35;

      const sceneScale = lerp(
        1,
        finalScale,
        cameraProgress
      );

      const finalX = isMobile
        ? -window.innerWidth * 0.19
        : -window.innerWidth * 0.27;

      const finalY = isMobile
        ? -window.innerHeight * 0.07
        : -window.innerHeight * 0.09;

      const sceneX = lerp(
        0,
        finalX,
        cameraProgress
      );

      const sceneY = lerp(
        0,
        finalY,
        cameraProgress
      );

      const identityFade = rangeProgress(
        progress,
        0.16,
        0.38
      );

      const identityOpacity = 1 - identityFade;

      const hintFade = rangeProgress(
        progress,
        0.02,
        0.18
      );

      const hintOpacity = 1 - hintFade;

      const portalProgress = rangeProgress(
        progress,
        0.68,
        1
      );

      const startTop = isMobile ? 48 : 37;
      const startLeft = isMobile ? 44 : 66;
      const startWidth = isMobile ? 48 : 26;
      const startHeight = isMobile ? 27 : 32;

      const portalTop = lerp(
        startTop,
        0,
        portalProgress
      );

      const portalLeft = lerp(
        startLeft,
        0,
        portalProgress
      );

      const portalWidth = lerp(
        startWidth,
        100,
        portalProgress
      );

      const portalHeight = lerp(
        startHeight,
        100,
        portalProgress
      );

      const workspaceProgress = rangeProgress(
        progress,
        0.79,
        0.96
      );

      const workspaceOpacity = workspaceProgress;

      const workspaceY = lerp(
        22,
        0,
        workspaceProgress
      );

      const roomFade = rangeProgress(
        progress,
        0.76,
        0.96
      );

      const roomOpacity = 1 - roomFade;

      sticky.style.setProperty(
        "--scene-scale",
        sceneScale.toString()
      );

      sticky.style.setProperty(
        "--scene-x",
        `${sceneX}px`
      );

      sticky.style.setProperty(
        "--scene-y",
        `${sceneY}px`
      );

      sticky.style.setProperty(
        "--identity-opacity",
        identityOpacity.toString()
      );

      sticky.style.setProperty(
        "--hint-opacity",
        hintOpacity.toString()
      );

      sticky.style.setProperty(
        "--room-opacity",
        roomOpacity.toString()
      );

      sticky.style.setProperty(
        "--portal-top",
        `${portalTop}%`
      );

      sticky.style.setProperty(
        "--portal-left",
        `${portalLeft}%`
      );

      sticky.style.setProperty(
        "--portal-width",
        `${portalWidth}%`
      );

      sticky.style.setProperty(
        "--portal-height",
        `${portalHeight}%`
      );

      sticky.style.setProperty(
        "--portal-opacity",
        portalProgress.toString()
      );

      sticky.style.setProperty(
        "--workspace-opacity",
        workspaceOpacity.toString()
      );

      sticky.style.setProperty(
        "--workspace-y",
        `${workspaceY}px`
      );
    };

    const requestUpdate = () => {
      if (frameId) {
        return;
      }

      frameId = window.requestAnimationFrame(update);
    };

    update();

    window.addEventListener(
      "scroll",
      requestUpdate,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      requestUpdate
    );

    return () => {
      window.removeEventListener(
        "scroll",
        requestUpdate
      );

      window.removeEventListener(
        "resize",
        requestUpdate
      );

      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      if (switchTimerRef.current !== null) {
        window.clearTimeout(switchTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
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
  }, [mobileMenuOpen]);

  const handleViewChange = (
    nextView: WorkspaceView
  ) => {
    setMobileMenuOpen(false);

    if (
      nextView === activeView ||
      isSwitching
    ) {
      return;
    }

    setIsSwitching(true);

    if (switchTimerRef.current !== null) {
      window.clearTimeout(
        switchTimerRef.current
      );
    }

    switchTimerRef.current =
      window.setTimeout(() => {
        setActiveView(nextView);

        workspaceMainRef.current?.scrollTo({
          top: 0,
          behavior: "auto",
        });

        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            setIsSwitching(false);
          });
        });
      }, 105);
  };

  useEffect(() => {
    const shell = workspaceShellRef.current;

    if (!shell) {
      return;
    }

    const handleWheel = (event: globalThis.WheelEvent) => {
      /*
        Before the Hero → monitor transition is finished,
        do not interfere with normal page scrolling.
      */
      if (!workspaceLockedRef.current) {
        return;
      }

      const target = event.target as HTMLElement | null;

      const main =
        target?.closest(
          `.${styles.workspaceMain}`
        ) as HTMLElement | null;

      /*
        Sidebar / topbar / statusbar:
        wheel input belongs to the workspace, so it must
        never leak back to the outer Hero journey.
      */
      if (!main) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      /*
        Main document:
        allow ordinary document scrolling, but block
        the exact moment where the inner scroller reaches
        an edge and the browser tries to chain the wheel
        to the outer page.
      */
      const atTop =
        main.scrollTop <= 0;

      const atBottom =
        main.scrollTop + main.clientHeight >=
        main.scrollHeight - 1;

      const leavingThroughTop =
        event.deltaY < 0 && atTop;

      const leavingThroughBottom =
        event.deltaY > 0 && atBottom;

      if (
        leavingThroughTop ||
        leavingThroughBottom
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    shell.addEventListener(
      "wheel",
      handleWheel,
      {
        passive: false,
      }
    );

    return () => {
      shell.removeEventListener(
        "wheel",
        handleWheel
      );
    };
  }, []);

  const handleReturnToHero = () => {
    setMobileMenuOpen(false);

    /*
      Leaving the workspace is an explicit action.
      Unlock the outer Hero only for this transition.
    */
    workspaceLockedRef.current = false;
    returningToHeroRef.current = true;

    if (window.location.search) {
      window.history.replaceState(
        null,
        "",
        "/bitandink"
      );
    }

    journeyRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const clearPlaygroundTimers = () => {
    playgroundTimersRef.current.forEach(
      (timer) => {
        window.clearTimeout(timer);
      }
    );

    playgroundTimersRef.current = [];
  };

  const schedulePlayground = (
    callback: () => void,
    delay: number
  ) => {
    const timer =
      window.setTimeout(
        callback,
        delay
      );

    playgroundTimersRef.current.push(
      timer
    );
  };

  const startHoduSequence = () => {
    if (
      playgroundScene !== "idle" &&
      playgroundScene !== "gift"
    ) {
      return;
    }

    clearPlaygroundTimers();
    setPlaygroundObserver(null);
    setBeanGiftBubbleVisible(false);
    setGiftBalloonPopped(false);
    setPlaygroundScene("chasing");

    schedulePlayground(() => {
      setPlaygroundScene("fallen");

      const thud =
        thudAudioRef.current;

      if (thud) {
        thud.currentTime = 0;

        void thud
          .play()
          .catch(() => {});
      }
    }, 1450);

    schedulePlayground(() => {
      setPlaygroundScene("comforting");
    }, 2650);

    schedulePlayground(() => {
      setPlaygroundScene("gift");
      setBeanGiftBubbleVisible(true);

      schedulePlayground(() => {
        setBeanGiftBubbleVisible(false);
      }, 1800);
    }, 4100);
  };

  const popGiftBalloon = () => {
    if (
      playgroundScene !== "gift" ||
      giftBalloonPopped
    ) {
      return;
    }

    const pop =
      new Audio(
        "/bitandink/sounds/pop.wav"
      );

    pop.volume = 0.4;

    void pop
      .play()
      .catch((error) => {
        console.error(
          "POP SOUND ERROR:",
          error
        );
      });

    setBeanGiftBubbleVisible(false);
    setGiftBalloonPopped(true);
  };

  const resetPlayground = () => {
    clearPlaygroundTimers();
    setPlaygroundObserver(null);
    setBeanGiftBubbleVisible(false);
    setGiftBalloonPopped(false);
    setPlaygroundScene("idle");
  };

  useEffect(() => {
    if (activeView !== "playground") {
      clearPlaygroundTimers();
      setPlaygroundObserver(null);
      setBeanGiftBubbleVisible(false);
      setGiftBalloonPopped(false);
      setCssLabOpen(false);
      setEnvPanelOpen(false);
      setPlaygroundScene("idle");
    }

    return () => {
      clearPlaygroundTimers();
    };
  }, [activeView]);

  const documentClassName = [
    styles.currentDocument,
    styles.workspaceDocument,
    isSwitching
      ? styles.workspaceDocumentSwitching
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      ref={journeyRef}
      className={styles.heroJourney}
    >
      <div
        ref={stickyRef}
        className={styles.heroSticky}
      >
        <div className={styles.roomLayer}>
          <div className={styles.workspaceImage} />
          <div className={styles.imageFade} />
        </div>

        <div className={styles.backgroundTexture} />

        <header className={styles.identity}>
          <span className={styles.eyebrow}>
            REAL WORLD / CONNECTION POINT
          </span>

          <h1 className={styles.title}>
            bitandink
          </h1>

          <p className={styles.subtitle}>
            somewhere between the real world
            <br />
            and Beanlog.
          </p>
        </header>

        <div className={styles.scrollHint}>
          <span className={styles.mouseHint}>
            <i />
          </span>

          <div className={styles.scrollText}>
            <span>scroll to leave</span>
            <span>the boundary</span>
          </div>

          <i className={styles.scrollLine} />
        </div>

        <div className={styles.monitorPortal}>
          <div
            ref={workspaceShellRef}
            className={styles.workspaceShell}
          >
            {mobileMenuOpen ? (
              <button
                type="button"
                className={styles.mobileMenuOverlay}
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                aria-label="Close workspace menu"
              />
            ) : null}

            <aside
              id="bitandink-workspace-nav"
              className={[
                styles.workspaceSidebar,
                mobileMenuOpen
                  ? styles.workspaceSidebarOpen
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div
                className={styles.workspaceIdentity}
              >
                <span
                  className={styles.workspaceMark}
                >
                  b/
                </span>

                <div>
                  <strong>bitandink</strong>
                  <span>workspace</span>
                </div>
              </div>

              <nav
                className={styles.workspaceNav}
                aria-label="Bitandink workspace"
              >
                <div className={styles.navGroup}>
                  <span className={styles.navLabel}>
                    WORKSPACE
                  </span>

                  <button
                    type="button"
                    className={[
                      styles.navItem,
                      activeView === "current"
                        ? styles.navItemActive
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() =>
                      handleViewChange("current")
                    }
                  >
                    <span>◌</span>
                    <strong>Current</strong>
                  </button>

                  <button
                    type="button"
                    className={[
                      styles.navItem,
                      activeView === "archive"
                        ? styles.navItemActive
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() =>
                      handleViewChange("archive")
                    }
                  >
                    <span>□</span>
                    <strong>Archive</strong>
                  </button>
                </div>

                <div className={styles.navGroup}>
                  <span className={styles.navLabel}>
                    SPACES
                  </span>

                  <button
                    type="button"
                    className={[
                      styles.navItem,
                      activeView === "beanlog"
                        ? styles.navItemActive
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() =>
                      handleViewChange("beanlog")
                    }
                  >
                    <span>↗</span>
                    <strong>Beanlog</strong>
                  </button>

                  <button
                    type="button"
                    className={[
                      styles.navItem,
                      activeView === "perfugium"
                        ? styles.navItemActive
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() =>
                      handleViewChange("perfugium")
                    }
                  >
                    <span>↗</span>
                    <strong>Perfugium</strong>
                  </button>
                </div>

                <div className={styles.navGroup}>
                  <span className={styles.navLabel}>
                    LAB
                  </span>

                  <button
                    type="button"
                    className={[
                      styles.navItem,
                      activeView === "playground"
                        ? styles.navItemActive
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() =>
                      handleViewChange("playground")
                    }
                  >
                    <span>+</span>
                    <strong>Playground</strong>
                  </button>
                </div>
              </nav>

              <div className={styles.sidebarFooter}>
                <span>local workspace</span>
                <i />
              </div>
            </aside>

            <main
              ref={workspaceMainRef}
              className={styles.workspaceMain}
            >
              <header
                className={styles.workspaceTopbar}
              >
                <div className={styles.breadcrumb}>
                  <span>bitandink</span>
                  <i>/</i>
                  <span>workspace</span>
                  <i>/</i>
                  <strong>{activeView}</strong>
                </div>

                <div
                  className={styles.workspaceTopbarActions}
                >
                  <div
                    className={styles.workspaceStatus}
                  >
                    <i />
                    <span>ACTIVE</span>
                  </div>

                  <button
                    type="button"
                    className={styles.mobileMenuButton}
                    onClick={() =>
                      setMobileMenuOpen((open) => !open)
                    }
                    aria-label={
                      mobileMenuOpen
                        ? "Close workspace menu"
                        : "Open workspace menu"
                    }
                    aria-expanded={mobileMenuOpen}
                    aria-controls="bitandink-workspace-nav"
                  >
                    {mobileMenuOpen ? "×" : "☰"}
                  </button>
                </div>
              </header>

              {activeView === "current" ? (
                <article
                  className={documentClassName}
                >
                  <header
                    className={styles.documentHeading}
                  >
                    <span
                      className={styles.documentIndex}
                    >
                      01 / CURRENT
                    </span>

                    <h2>
                      Current
                      <br />
                      Obsessions
                    </h2>

                    <p>
                      요즘 자꾸 머릿속을 차지하는 것들.
                    </p>
                  </header>

                  <div
                    className={styles.obsessionList}
                  >
                    <article
                      className={styles.obsessionItem}
                    >
                      <span
                        className={styles.obsessionNumber}
                      >
                        01
                      </span>

                      <div
                        className={styles.obsessionBody}
                      >
                        <div
                          className={styles.obsessionTitle}
                        >
                          <h3>Beanlog</h3>
                          <span>ACTIVE</span>
                        </div>

                        <p>
                          웹 위에 작은 세계를 만드는 중.
                        </p>

                        <div
                          className={
                            styles.obsessionDescription
                          }
                        >
                          <p>
                            개인 홈페이지를 다시 만들기
                            시작했는데, 어느 순간 홈페이지
                            자체보다 그 안에 어떤 세계를 만들
                            수 있을지가 더 재미있어졌다.
                          </p>

                          <p>
                            작은 방을 만들고, 그 안에 주민들을
                            살게 하고, 별 의미 없는 인터랙션도
                            하나씩 붙이는 중.
                          </p>
                        </div>

                        <div
                          className={styles.obsessionMeta}
                        >
                          <span>worldbuilding</span>
                          <span>frontend</span>
                          <span>interaction</span>
                          <span>tiny residents</span>
                        </div>
                      </div>
                    </article>

                    <article
                      className={styles.obsessionItem}
                    >
                      <span
                        className={styles.obsessionNumber}
                      >
                        02
                      </span>

                      <div
                        className={styles.obsessionBody}
                      >
                        <div
                          className={styles.obsessionTitle}
                        >
                          <h3>Perfugium</h3>
                          <span>FORMING</span>
                        </div>

                        <p>
                          글이 머무를 조용한 공간.
                        </p>

                        <div
                          className={
                            styles.obsessionDescription
                          }
                        >
                          <p>
                            예전에 사용하던 이름을 다시
                            꺼냈다.
                          </p>

                          <p>
                            perfugium.
                            <br />
                            피난처, 안식처.
                          </p>

                          <p>
                            내가 편하게 글을 쓸 수 있는
                            곳이면서, 내가 쓴 무언가가
                            누군가에게는 잠깐 머물다 갈 수
                            있는 안식처가 되었으면 하는 곳.
                          </p>

                          <p>
                            아직은 공간의 형태만 천천히
                            생각하는 중.
                          </p>
                        </div>

                        <div
                          className={styles.obsessionMeta}
                        >
                          <span>writing</span>
                          <span>essays</span>
                          <span>archive</span>
                          <span>refuge</span>
                        </div>
                      </div>
                    </article>

                    <article
                      className={styles.obsessionItem}
                    >
                      <span
                        className={styles.obsessionNumber}
                      >
                        03
                      </span>

                      <div
                        className={styles.obsessionBody}
                      >
                        <div
                          className={styles.obsessionTitle}
                        >
                          <h3>Old Web, New Web</h3>
                          <span>CURIOUS</span>
                        </div>

                        <p>
                          CSS가 원래 이렇게 부드러웠나?
                        </p>

                        <div
                          className={
                            styles.obsessionDescription
                          }
                        >
                          <p>
                            몇 년 만에 웹 인터랙션을 다시
                            만지고 있다.
                          </p>

                          <p>
                            예전에는 JavaScript와 라이브러리를
                            끌어오고, 스크롤 값을 계속 계산하고,
                            콘솔 로그를 찍어가며 만들었던 것들이
                            이제는 너무 자연스럽게 움직인다.
                          </p>

                          <p>
                            분명 알고 있던 웹인데, 오랜만에 다시
                            만나니 조금 낯설고 재미있다.
                          </p>
                        </div>

                        <div
                          className={styles.obsessionMeta}
                        >
                          <span>css</span>
                          <span>browser</span>
                          <span>interaction</span>
                          <span>nostalgia</span>
                        </div>
                      </div>
                    </article>

                    <article
                      className={styles.obsessionItem}
                    >
                      <span
                        className={styles.obsessionNumber}
                      >
                        04
                      </span>

                      <div
                        className={styles.obsessionBody}
                      >
                        <div
                          className={styles.obsessionTitle}
                        >
                          <h3>Playground</h3>
                          <span>UNSTABLE</span>
                        </div>

                        <p>굳이 없어도 되는 것들.</p>

                        <div
                          className={
                            styles.obsessionDescription
                          }
                        >
                          <p>
                            작은 게임, 이상한 인터랙션,
                            한 번쯤 만들어보고 싶은 실험들.
                          </p>

                          <p>
                            딱히 필요한 기능은 아니다.
                          </p>

                          <p
                            className={styles.playgroundNote}
                          >
                            그래서 아마 만들 것 같다.
                          </p>
                        </div>

                        <div
                          className={styles.obsessionMeta}
                        >
                          <span>experiments</span>
                          <span>tiny games</span>
                          <span>interaction</span>
                          <span>questionable ideas</span>
                        </div>
                      </div>
                    </article>
                  </div>
                </article>
              ) : activeView === "archive" ? (
                <article
                  className={documentClassName}
                >
                  <header
                    className={styles.documentHeading}
                  >
                    <span
                      className={styles.documentIndex}
                    >
                      02 / ARCHIVE
                    </span>

                    <h2>Archive</h2>

                    <p>
                      한때 머릿속을 차지했던 것들.
                    </p>
                  </header>

                  <div
                    className={styles.obsessionList}
                  >
                    <article
                      className={styles.obsessionItem}
                    >
                      <span
                        className={styles.obsessionNumber}
                      >
                        01
                      </span>

                      <div
                        className={styles.obsessionBody}
                      >
                        <div
                          className={styles.obsessionTitle}
                        >
                          <h3>Portfolio / Studio</h3>
                          <span>ARCHIVED</span>
                        </div>

                        <p>
                          예전 개인 홈페이지에 있던 두 개의
                          공간.
                        </p>

                        <div
                          className={
                            styles.obsessionDescription
                          }
                        >
                          <p>
                            비슷한 구조를 가진 두 공간을 하나의
                            추상화 안에 묶어두었다가, 몇 년 뒤
                            Studio를 없애면서 그 흔적을 프로젝트
                            곳곳에서 다시 만났다.
                          </p>

                          <p>
                            지금은 사라졌지만, 덕분에 오래 지나서야
                            이해하게 된 것들이 남았다.
                          </p>
                        </div>

                        <div
                          className={styles.obsessionMeta}
                        >
                          <span>old homepage</span>
                          <span>portfolio</span>
                          <span>studio</span>
                          <span>legacy</span>
                        </div>
                      </div>
                    </article>
                  </div>

                  <p className={styles.archiveEnding}>
                    끝났거나, 멈췄거나, 다른 형태로 남은 것들은
                    천천히 이곳으로 옮겨둘 예정.
                  </p>
                </article>
              ) : activeView === "beanlog" ? (
                <article
                  className={[
                    documentClassName,
                    styles.beanlogDocument,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <header
                    className={styles.beanlogHeading}
                  >
                    <span
                      className={styles.documentIndex}
                    >
                      03 / SPACE
                    </span>

                    <h2>Beanlog</h2>

                    <p>
                      Bean, Pama, Hodu가 별일 없이
                      지내는 곳.
                    </p>

                    <span
                      className={styles.beanlogAside}
                    >
                      가끔 기록하고, 대부분은 쉰다.
                    </span>
                  </header>

                  <div
                    className={styles.diaryStream}
                  >
                    <article
                      className={styles.diaryEntry}
                    >
                      <div
                        className={styles.diaryEntryTop}
                      >
                        <div>
                          <span
                            className={styles.diaryResident}
                          >
                            BEAN
                          </span>

                          <span
                            className={styles.diaryDate}
                          >
                            08.21
                          </span>
                        </div>

                        <span
                          className={styles.diaryMood}
                        >
                          mood / comfortable
                        </span>
                      </div>

                      <div
                        className={styles.diaryText}
                      >
                        <p>오늘은 아무것도 안 했다.</p>

                        <p>
                          정확히 말하면 소파에서 세 번
                          뒤집어졌고, 냉장고를 두 번
                          열어봤다.
                        </p>

                        <p>아무것도 없었다.</p>

                        <p>
                          내일 다시 확인해볼 예정이다.
                        </p>
                      </div>
                    </article>

                    <article
                      className={styles.diaryEntry}
                    >
                      <div
                        className={styles.diaryEntryTop}
                      >
                        <div>
                          <span
                            className={styles.diaryResident}
                          >
                            PAMA
                          </span>

                          <span
                            className={styles.diaryDate}
                          >
                            08.19
                          </span>
                        </div>

                        <span
                          className={styles.diaryMood}
                        >
                          mood / watching
                        </span>
                      </div>

                      <div
                        className={styles.diaryText}
                      >
                        <p>
                          Bean이 냉장고를 계속 열어본다.
                        </p>

                        <p>
                          두 번째 열었을 때부터
                          말해줄까 고민했는데 그냥
                          두기로 했다.
                        </p>

                        <p>세 번째도 열 것 같다.</p>
                      </div>
                    </article>

                    <article
                      className={styles.diaryEntry}
                    >
                      <div
                        className={styles.diaryEntryTop}
                      >
                        <div>
                          <span
                            className={styles.diaryResident}
                          >
                            HODU
                          </span>

                          <span
                            className={styles.diaryDate}
                          >
                            08.18
                          </span>
                        </div>

                        <span
                          className={styles.diaryMood}
                        >
                          mood / sleepy
                        </span>
                      </div>

                      <div
                        className={styles.diaryText}
                      >
                        <p>오늘 햇빛이 좋았다.</p>
                        <p>창가에서 잤다.</p>
                        <p>끝.</p>
                      </div>
                    </article>

                    <article
                      className={[
                        styles.diaryEntry,
                        styles.diaryEntrySmall,
                      ].join(" ")}
                    >
                      <div
                        className={styles.diaryEntryTop}
                      >
                        <div>
                          <span
                            className={styles.diaryResident}
                          >
                            HODU
                          </span>

                          <span
                            className={styles.diaryDate}
                          >
                            08.12
                          </span>
                        </div>

                        <span
                          className={styles.diaryMood}
                        >
                          mood / satisfied
                        </span>
                      </div>

                      <div
                        className={styles.diaryText}
                      >
                        <p>과자 맛있었다.</p>
                      </div>
                    </article>
                  </div>

                  <p
                    className={styles.beanlogEnding}
                  >
                    이곳의 기록은 정해진 주기도,
                    특별한 목적도 없다.
                  </p>
                </article>
              ) : activeView === "perfugium" ? (
                <article
                  className={[
                    documentClassName,
                    styles.perfugiumDocument,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <header
                    className={styles.perfugiumHeading}
                  >
                    <span
                      className={styles.documentIndex}
                    >
                      04 / SPACE
                    </span>

                    <h2>Perfugium</h2>

                    <p>
                      생각이 오래 머물렀던 곳.
                    </p>

                    <span
                      className={styles.perfugiumAside}
                    >
                      기술과 사람,
                      그리고 그 사이에서 떠오른 것들.
                    </span>
                  </header>

                  <div
                    className={styles.perfugiumList}
                  >
                    <a
                      className={styles.perfugiumEntry}
                      href="https://blog.naver.com/bitandink/224205543377"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <div
                        className={styles.perfugiumEntryTop}
                      >
                        <span
                          className={styles.perfugiumNumber}
                        >
                          01
                        </span>

                        <span
                          className={styles.perfugiumMeta}
                        >
                          2026.03.05 · AI / HUMAN / ESSAY
                        </span>
                      </div>

                      <div
                        className={styles.perfugiumEntryBody}
                      >
                        <h3>
                          춤추는 로봇을 보고
                          이상한 질문이 떠올랐다
                        </h3>

                        <p
                          className={styles.perfugiumSubtitle}
                        >
                          우리는 왜 AI에게 성격을 느낄까
                        </p>

                        <p
                          className={styles.perfugiumExcerpt}
                        >
                          로봇의 춤에서 인간을 보고,
                          AI의 대답에서 성격을 발견했다.
                          그런데 정말 AI에게 성격이 있었던 걸까.
                        </p>
                      </div>

                      <span
                        className={styles.perfugiumRead}
                      >
                        ↗ read essay
                      </span>
                    </a>

                    <a
                      className={styles.perfugiumEntry}
                      href="https://blog.naver.com/bitandink/224221454392"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <div
                        className={styles.perfugiumEntryTop}
                      >
                        <span
                          className={styles.perfugiumNumber}
                        >
                          02
                        </span>

                        <span
                          className={styles.perfugiumMeta}
                        >
                          2026.03.18 · WRITING / AI / IDENTITY
                        </span>
                      </div>

                      <div
                        className={styles.perfugiumEntryBody}
                      >
                        <h3>
                          내가 쓴 소설이
                          AI가 쓴 글이라고 한다
                        </h3>

                        <p
                          className={styles.perfugiumSubtitle}
                        >
                          80% 판정 받음
                        </p>

                        <p
                          className={styles.perfugiumExcerpt}
                        >
                          내가 쓴 글을 인간이 쓴 글이라고
                          증명해야 하는 시대.
                          잘 쓰는 것이 오히려 의심의 근거가 된다는
                          기묘한 경험에서 시작한 기록.
                        </p>
                      </div>

                      <span
                        className={styles.perfugiumRead}
                      >
                        ↗ read essay
                      </span>
                    </a>

                    <a
                      className={styles.perfugiumEntry}
                      href="https://blog.naver.com/bitandink/224165184517"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <div
                        className={styles.perfugiumEntryTop}
                      >
                        <span
                          className={styles.perfugiumNumber}
                        >
                          03
                        </span>

                        <span
                          className={styles.perfugiumMeta}
                        >
                          2026.01.30 · AI / JUDGMENT / HUMAN
                        </span>
                      </div>

                      <div
                        className={styles.perfugiumEntryBody}
                      >
                        <h3>
                          모든 AI는 move37을
                          향한다는 말에 대하여
                        </h3>

                        <p
                          className={styles.perfugiumSubtitle}
                        >
                          판단을 위임하는 인간의 방식
                        </p>

                        <p
                          className={styles.perfugiumExcerpt}
                        >
                          AI가 무엇을 판단할 수 있는가보다,
                          우리가 무엇을 AI에게 맡기고 있는지를
                          생각한 글.
                        </p>
                      </div>

                      <span
                        className={styles.perfugiumRead}
                      >
                        ↗ read essay
                      </span>
                    </a>

                    <a
                      className={styles.perfugiumEntry}
                      href="https://blog.naver.com/bitandink/224318112646"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <div
                        className={styles.perfugiumEntryTop}
                      >
                        <span
                          className={styles.perfugiumNumber}
                        >
                          04
                        </span>

                        <span
                          className={styles.perfugiumMeta}
                        >
                          2026.06.16 · PERSON / LITERATURE / FREEDOM
                        </span>
                      </div>

                      <div
                        className={styles.perfugiumEntryBody}
                      >
                        <h3>
                          자기 방식으로 살았던 사람
                        </h3>

                        <p
                          className={styles.perfugiumSubtitle}
                        >
                          루 안드레아스 살로메
                        </p>

                        <p
                          className={styles.perfugiumExcerpt}
                        >
                          누군가의 뮤즈가 아니라,
                          자기 삶의 형식을 끝까지
                          스스로 고르려 했던 한 사람에 대하여.
                        </p>
                      </div>

                      <span
                        className={styles.perfugiumRead}
                      >
                        ↗ read essay
                      </span>
                    </a>
                  </div>

                  <footer
                    className={styles.perfugiumFooter}
                  >
                    <div>
                      <span>
                        여기에 꺼내놓은 건 몇 편뿐이다.
                      </span>

                      <p>
                        더 많은 글은 bitandink의
                        네이버 블로그에 쌓여 있다.
                      </p>
                    </div>

                    <a
                      href="https://blog.naver.com/bitandink"
                      target="_blank"
                      rel="noreferrer"
                    >
                      more writings ↗
                    </a>
                  </footer>
                </article>
              ) : (
                <article
                  className={[
                    documentClassName,
                    styles.playgroundDocument,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <header
                    className={styles.playgroundHeading}
                  >
                    <span
                      className={styles.documentIndex}
                    >
                      05 / LAB
                    </span>

                    <h2>Playground</h2>

                    <p>
                      여긴 별로 쓸모 있는 건 없다.
                    </p>

                    <span
                      className={styles.playgroundAside}
                    >
                      대신, 누르면 뭔가 일어날 수도 있다.
                    </span>

                    <span
                      className={styles.playgroundStatus}
                    >
                      STATUS / QUESTIONABLE
                    </span>
                  </header>

                  <section
                    className={[
                      styles.playgroundStage,
                      styles[
                        `playgroundScene_${playgroundScene}`
                      ],
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    aria-label="Beanlog resident playground"
                  >
                    <div
                      className={styles.playgroundHint}
                    >
                      <span>HINT_01</span>
                      <p>
                        떠다니는 데이터를 누르거나,
                        캐릭터를 클릭해 보자.
                      </p>
                    </div>

                    <a
                      className={[
                        styles.playData,
                        styles.playDataOne,
                      ].join(" ")}
                      href="https://orange-periwinkle-04b.notion.site/2ef3b18f802880fc8851d0175a7c5398"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Open bitandink portfolio on Notion"
                    >
                      .md
                    </a>

                    <a
                      className={[
                        styles.playData,
                        styles.playDataTwo,
                      ].join(" ")}
                      href="https://bitandink.github.io/portfolio-2026/"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Open bitandink web portfolio"
                    >
                      .json
                    </a>

                    <button
                      type="button"
                      className={[
                        styles.playData,
                        styles.playDataThree,
                      ].join(" ")}
                      onClick={() =>
                        setCssLabOpen(true)
                      }
                      aria-label="Open CSS Lab"
                    >
                      .css
                    </button>

                    <button
                      type="button"
                      className={[
                        styles.playData,
                        styles.playDataFour,
                      ].join(" ")}
                      onClick={startHoduSequence}
                      aria-label="Catch text data"
                    >
                      .txt
                    </button>

                    <button
                      type="button"
                      className={[
                        styles.playData,
                        styles.playDataFive,
                      ].join(" ")}
                      onClick={startHoduSequence}
                      aria-label="Catch tsx data"
                    >
                      .tsx
                    </button>

                    <button
                      type="button"
                      className={[
                        styles.playData,
                        styles.playDataSix,
                      ].join(" ")}
                      onClick={startHoduSequence}
                      aria-label="Catch log data"
                    >
                      .log
                    </button>

                    <button
                      type="button"
                      className={[
                        styles.playData,
                        styles.playDataSeven,
                      ].join(" ")}
                      onClick={() => {
                        setCssLabOpen(false);
                        setEnvPanelOpen(true);
                      }}
                      aria-label="Open private env note"
                    >
                      .env
                    </button>

                    <button
                      type="button"
                      className={[
                        styles.playData,
                        styles.playDataEight,
                      ].join(" ")}
                      onClick={startHoduSequence}
                      aria-label="Catch yaml data"
                    >
                      .yml
                    </button>

                    <a
                      className={[
                        styles.playData,
                        styles.playDataNine,
                      ].join(" ")}
                      href="https://github.com/bitandink"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Open bitandink GitHub"
                    >
                      .git
                    </a>

                    <button
                      type="button"
                      className={[
                        styles.playData,
                        styles.playDataTen,
                      ].join(" ")}
                      onClick={startHoduSequence}
                      aria-label="Catch binary data"
                    >
                      0101
                    </button>

                    <button
                      type="button"
                      className={[
                        styles.playData,
                        styles.playDataEleven,
                      ].join(" ")}
                      onClick={startHoduSequence}
                      aria-label="Catch unknown data"
                    >
                      ???
                    </button>

                    <button
                      type="button"
                      className={[
                        styles.playData,
                        styles.playDataTwelve,
                      ].join(" ")}
                      onClick={startHoduSequence}
                      aria-label="Catch archive data"
                    >
                      .zip
                    </button>

                    <button
                      type="button"
                      className={styles.pamaActor}
                      onClick={() =>
                        setPlaygroundObserver(
                          playgroundObserver === "pama"
                            ? null
                            : "pama"
                        )
                      }
                      aria-label="Talk to Pama"
                    >
                      <img
                        src="/bitandink/residents/pama.webp"
                        alt="Pama"
                      />

                      {playgroundObserver === "pama" ? (
                        <span
                          className={styles.actorBubble}
                        >
                          또 저런다.
                        </span>
                      ) : null}
                    </button>

                    <button
                      type="button"
                      className={styles.bitandinkActor}
                      onClick={() =>
                        setPlaygroundObserver(
                          playgroundObserver === "bitandink"
                            ? null
                            : "bitandink"
                        )
                      }
                      aria-label="Talk to bitandink"
                    >
                      <img
                        src="/bitandink/residents/bitandink-front.webp"
                        alt="bitandink"
                      />

                      {playgroundObserver === "bitandink" ? (
                        <span
                          className={styles.actorBubble}
                        >
                          원래 이거 포트폴리오였는데.
                        </span>
                      ) : null}
                    </button>

                    <div
                      className={styles.hoduActor}
                    >
                      <button
                        type="button"
                        className={styles.actorButton}
                        onClick={startHoduSequence}
                        aria-label="Play with Hodu"
                      >
                        <img
                          src="/bitandink/residents/hodu.webp"
                          alt="Hodu"
                        />
                      </button>

                      {playgroundScene === "idle" ? (
                        <span
                          className={styles.hoduBubble}
                        >
                          저건 뭐지?
                        </span>
                      ) : null}

                      {playgroundScene === "fallen" ? (
                        <span
                          className={styles.hoduBubble}
                        >
                          ...
                        </span>
                      ) : null}
                    </div>

                    <div
                      className={styles.beanActor}
                    >
                      <img
                        src="/bitandink/residents/bean.webp"
                        alt="Bean"
                      />

                      {playgroundScene === "comforting" ? (
                        <span
                          className={styles.beanBubble}
                        >
                          또 놓쳤어?
                        </span>
                      ) : null}

                      {playgroundScene === "gift" &&
                      beanGiftBubbleVisible ? (
                        <span
                          className={styles.beanBubble}
                        >
                          이건 안 도망가.
                        </span>
                      ) : null}
                    </div>

                    <button
                      type="button"
                      className={[
                        styles.dataBalloon,
                        giftBalloonPopped
                          ? styles.dataBalloonPopped
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={popGiftBalloon}
                      disabled={
                        playgroundScene !== "gift" ||
                        giftBalloonPopped
                      }
                      aria-label="Pop Bean's JSON balloon"
                      aria-hidden={
                        playgroundScene !== "gift"
                      }
                    >
                      <span>.json</span>
                      <i />
                    </button>

                    {playgroundScene === "gift" &&
                    giftBalloonPopped ? (
                      <div
                        className={styles.snackRain}
                        aria-hidden="true"
                      >
                        {[
                          ["🍪", "-82px", "-16deg", "0ms"],
                          ["🦴", "-54px", "18deg", "90ms"],
                          ["🍪", "-28px", "-28deg", "160ms"],
                          ["🦴", "0px", "12deg", "40ms"],
                          ["🍪", "26px", "24deg", "210ms"],
                          ["🦴", "52px", "-18deg", "120ms"],
                          ["🍪", "78px", "30deg", "260ms"],
                          ["🦴", "96px", "-8deg", "320ms"],
                          ["🍪", "-98px", "20deg", "300ms"],
                        ].map(
                          ([snack, x, rotate, delay], index) => (
                            <span
                              key={`${snack}-${index}`}
                              style={
                                {
                                  "--snack-x": x,
                                  "--snack-rotate": rotate,
                                  "--snack-delay": delay,
                                } as React.CSSProperties
                              }
                            >
                              {snack}
                            </span>
                          )
                        )}
                      </div>
                    ) : null}

                    {playgroundScene === "gift" ? (
                      <button
                        type="button"
                        className={styles.playAgain}
                        onClick={resetPlayground}
                      >
                        again? ↺
                      </button>
                    ) : null}

                    {envPanelOpen ? (
                      <aside
                        className={styles.envPanel}
                        aria-label="Private env note"
                      >
                        <div
                          className={styles.envPanelHeader}
                        >
                          <div>
                            <span>.env</span>
                            <strong>
                              PRIVATE CHANNEL
                            </strong>
                          </div>

                          <button
                            type="button"
                            className={styles.envPanelClose}
                            onClick={() =>
                              setEnvPanelOpen(false)
                            }
                            aria-label="Close private env note"
                          >
                            ×
                          </button>
                        </div>

                        <div
                          className={styles.envTerminal}
                          aria-live="polite"
                        >
                          <p>$ open .env</p>

                          {envBootStep >= 1 ? (
                            <p>
                              &gt; loading private variables...
                            </p>
                          ) : null}

                          {envBootStep >= 2 ? (
                            <p>
                              &gt; visitor detected.
                            </p>
                          ) : null}

                          {envBootStep >= 3 ? (
                            <p>
                              &gt; opening private channel...
                            </p>
                          ) : null}

                          {envBootStep >= 4 ? (
                            <p
                              className={
                                styles.envTerminalReady
                              }
                            >
                              &gt; access granted.
                            </p>
                          ) : null}
                        </div>

                        {envBootStep >= 4 ? (
                          <div
                            className={styles.envNoteArea}
                          >
                            <div
                              className={styles.envNotice}
                            >
                              <span>
                                SECRET_NOTE=
                              </span>

                              <p>
                                bitandink에게만 남기고 싶은
                                한 문장을 적어도 된다.
                              </p>

                              <small>
                                전송된 메모는 이메일로 전달된다.
                              </small>
                            </div>

                            <textarea
                              value={envNote}
                              onChange={(event) => {
                                setEnvNote(
                                  event.target.value.slice(
                                    0,
                                    1000
                                  )
                                );

                                if (
                                  envSendState === "error"
                                ) {
                                  setEnvSendState("idle");
                                  setEnvSendMessage("");
                                }
                              }}
                              maxLength={1000}
                              placeholder="type something..."
                              aria-label="Secret note to bitandink"
                            />

                            <div
                              className={styles.envNoteFooter}
                            >
                              <span>
                                {envNote.length} / 1000
                              </span>

                              <button
                                type="button"
                                onClick={sendEnvNote}
                                disabled={
                                  !envNote.trim() ||
                                  envSendState ===
                                    "sending"
                                }
                              >
                                {envSendState ===
                                "sending"
                                  ? "sending..."
                                  : "send variable"}
                              </button>
                            </div>

                            {envSendMessage ? (
                              <pre
                                className={[
                                  styles.envSendStatus,
                                  envSendState === "sent"
                                    ? styles.envSendSuccess
                                    : "",
                                  envSendState === "error"
                                    ? styles.envSendError
                                    : "",
                                ]
                                  .filter(Boolean)
                                  .join(" ")}
                              >
                                {envSendMessage}
                              </pre>
                            ) : null}

                            <p
                              className={styles.envFootnote}
                            >
                              // never commit .env
                            </p>
                          </div>
                        ) : null}
                      </aside>
                    ) : null}

                    {cssLabOpen ? (
                      <aside
                        className={styles.cssLabPanel}
                        aria-label="CSS Lab"
                      >
                        <div
                          className={styles.cssLabHeader}
                        >
                          <div>
                            <span>CSS LAB</span>
                            <strong>
                              live style test
                            </strong>
                          </div>

                          <button
                            type="button"
                            className={styles.cssLabClose}
                            onClick={() =>
                              setCssLabOpen(false)
                            }
                            aria-label="Close CSS Lab"
                          >
                            ×
                          </button>
                        </div>

                        <div
                          className={styles.cssLabBody}
                        >
                          <div
                            className={styles.cssLabControls}
                          >
                            <label>
                              <span>
                                font-size
                                <em>
                                  {cssLabFontSize}px
                                </em>
                              </span>

                              <input
                                type="range"
                                min="12"
                                max="32"
                                value={cssLabFontSize}
                                onChange={(event) =>
                                  setCssLabFontSize(
                                    Number(
                                      event.target.value
                                    )
                                  )
                                }
                              />
                            </label>

                            <label>
                              <span>
                                border-radius
                                <em>
                                  {cssLabRadius}px
                                </em>
                              </span>

                              <input
                                type="range"
                                min="0"
                                max="32"
                                value={cssLabRadius}
                                onChange={(event) =>
                                  setCssLabRadius(
                                    Number(
                                      event.target.value
                                    )
                                  )
                                }
                              />
                            </label>

                            <label>
                              <span>
                                letter-spacing
                                <em>
                                  {cssLabLetterSpacing.toFixed(
                                    2
                                  )}
                                  em
                                </em>
                              </span>

                              <input
                                type="range"
                                min="-0.04"
                                max="0.16"
                                step="0.01"
                                value={cssLabLetterSpacing}
                                onChange={(event) =>
                                  setCssLabLetterSpacing(
                                    Number(
                                      event.target.value
                                    )
                                  )
                                }
                              />
                            </label>

                            <label>
                              <span>
                                rotate
                                <em>
                                  {cssLabRotate}deg
                                </em>
                              </span>

                              <input
                                type="range"
                                min="-12"
                                max="12"
                                value={cssLabRotate}
                                onChange={(event) =>
                                  setCssLabRotate(
                                    Number(
                                      event.target.value
                                    )
                                  )
                                }
                              />
                            </label>

                            <label>
                              <span>
                                opacity
                                <em>
                                  {cssLabOpacity.toFixed(
                                    2
                                  )}
                                </em>
                              </span>

                              <input
                                type="range"
                                min="0.35"
                                max="1"
                                step="0.05"
                                value={cssLabOpacity}
                                onChange={(event) =>
                                  setCssLabOpacity(
                                    Number(
                                      event.target.value
                                    )
                                  )
                                }
                              />
                            </label>
                          </div>

                          <div
                            className={styles.cssLabPreviewWrap}
                          >
                            <div
                              className={styles.cssLabPreview}
                              style={{
                                fontSize:
                                  cssLabFontSize,
                                borderRadius:
                                  cssLabRadius,
                                letterSpacing:
                                  `${cssLabLetterSpacing}em`,
                                transform:
                                  `rotate(${cssLabRotate}deg)`,
                                opacity:
                                  cssLabOpacity,
                              }}
                            >
                              <span>
                                .demo
                              </span>

                              <strong>
                                CSS는 생각보다
                                많이 움직인다.
                              </strong>

                              <p>
                                값을 바꾸면 바로
                                여기서 확인할 수 있다.
                              </p>
                            </div>

                            <pre
                              className={styles.cssLabCode}
                            >
{`.demo {
  font-size: ${cssLabFontSize}px;
  border-radius: ${cssLabRadius}px;
  letter-spacing: ${cssLabLetterSpacing.toFixed(2)}em;
  transform: rotate(${cssLabRotate}deg);
  opacity: ${cssLabOpacity.toFixed(2)};
}`}
                            </pre>
                          </div>
                        </div>
                      </aside>
                    ) : null}

                    <p
                      className={styles.playgroundTip}
                    >
                      TIP: 여기서는 정답보다
                      과정이 더 중요할지도.
                    </p>
                  </section>
                </article>
              )}
            </main>

            <footer
              className={styles.workspaceStatusbar}
            >
              <div>
                <span>◇</span>
                <span>main</span>
                <span>UTF-8</span>
              </div>

              <div>
                <span>somewhere between worlds</span>

                <button
                  type="button"
                  className={styles.returnToHero}
                  onClick={handleReturnToHero}
                  aria-label="Back to bitandink hero"
                >
                  ← back to real world
                </button>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </section>
  );
}
