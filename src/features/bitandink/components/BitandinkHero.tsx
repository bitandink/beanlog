"use client";

import {
  useEffect,
  useRef,
} from "react";

import styles from "../styles/bitandink.module.css";

/* ========================================
   HELPERS
======================================== */

function clamp(
  value: number,
  min = 0,
  max = 1
) {
  return Math.min(
    Math.max(value, min),
    max
  );
}

function rangeProgress(
  value: number,
  start: number,
  end: number
) {
  return clamp(
    (value - start) /
      (end - start)
  );
}

function lerp(
  start: number,
  end: number,
  progress: number
) {
  return (
    start +
    (end - start) * progress
  );
}

/* ========================================
   COMPONENT
======================================== */

export default function BitandinkHero() {
  const journeyRef =
    useRef<HTMLElement>(null);

  const stickyRef =
    useRef<HTMLDivElement>(null);

  /* ========================================
     SCROLL JOURNEY
  ======================================== */

  useEffect(() => {
    const journey =
      journeyRef.current;

    const sticky =
      stickyRef.current;

    if (!journey || !sticky) {
      return;
    }

    let frameId = 0;

    const update = () => {
      frameId = 0;

      const rect =
        journey.getBoundingClientRect();

      const viewportHeight =
        window.innerHeight;

      const scrollDistance =
        Math.max(
          journey.offsetHeight -
            viewportHeight,
          1
        );

      const progress =
        clamp(
          -rect.top /
            scrollDistance
        );

      const isMobile =
        window.innerWidth <= 780;

      /* ====================================
         CAMERA
      ==================================== */

      const cameraProgress =
        rangeProgress(
          progress,
          0.08,
          0.88
        );

      const finalScale =
        isMobile
          ? 2.7
          : 3.35;

      const sceneScale =
        lerp(
          1,
          finalScale,
          cameraProgress
        );

      const finalX =
        isMobile
          ? -window.innerWidth *
            0.19
          : -window.innerWidth *
            0.27;

      const finalY =
        isMobile
          ? -window.innerHeight *
            0.07
          : -window.innerHeight *
            0.09;

      const sceneX =
        lerp(
          0,
          finalX,
          cameraProgress
        );

      const sceneY =
        lerp(
          0,
          finalY,
          cameraProgress
        );

      /* ====================================
         HERO TEXT
      ==================================== */

      const identityFade =
        rangeProgress(
          progress,
          0.16,
          0.38
        );

      const identityOpacity =
        1 - identityFade;

      const hintFade =
        rangeProgress(
          progress,
          0.02,
          0.18
        );

      const hintOpacity =
        1 - hintFade;

      /* ====================================
         PORTAL
      ==================================== */

      const portalProgress =
        rangeProgress(
          progress,
          0.68,
          1
        );

      const startTop =
        isMobile
          ? 48
          : 37;

      const startLeft =
        isMobile
          ? 44
          : 66;

      const startWidth =
        isMobile
          ? 48
          : 26;

      const startHeight =
        isMobile
          ? 27
          : 32;

      const portalTop =
        lerp(
          startTop,
          0,
          portalProgress
        );

      const portalLeft =
        lerp(
          startLeft,
          0,
          portalProgress
        );

      const portalWidth =
        lerp(
          startWidth,
          100,
          portalProgress
        );

      const portalHeight =
        lerp(
          startHeight,
          100,
          portalProgress
        );

      /* ====================================
         WORKSPACE FADE
      ==================================== */

      const workspaceProgress =
        rangeProgress(
          progress,
          0.79,
          0.96
        );

      const workspaceOpacity =
        workspaceProgress;

      const workspaceY =
        lerp(
          22,
          0,
          workspaceProgress
        );

      /* ====================================
         ROOM FADE
      ==================================== */

      const roomFade =
        rangeProgress(
          progress,
          0.76,
          0.96
        );

      const roomOpacity =
        1 - roomFade;

      /* ====================================
         APPLY
      ==================================== */

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

      frameId =
        window.requestAnimationFrame(
          update
        );
    };

    update();

    window.addEventListener(
      "scroll",
      requestUpdate,
      {
        passive: true,
      }
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
        window.cancelAnimationFrame(
          frameId
        );
      }
    };
  }, []);

  return (
    <section
      ref={journeyRef}
      className={styles.heroJourney}
    >
      <div
        ref={stickyRef}
        className={styles.heroSticky}
      >
        {/* =================================
            REAL WORLD
        ================================= */}

        <div className={styles.roomLayer}>
          <div
            className={
              styles.workspaceImage
            }
          />

          <div
            className={
              styles.imageFade
            }
          />
        </div>

        <div
          className={
            styles.backgroundTexture
          }
        />

        {/* =================================
            IDENTITY
        ================================= */}

        <header
          className={styles.identity}
        >
          <span
            className={styles.eyebrow}
          >
            REAL WORLD / CONNECTION POINT
          </span>

          <h1 className={styles.title}>
            bitandink
          </h1>

          <p
            className={
              styles.subtitle
            }
          >
            somewhere between
            the real world
            <br />
            and Beanlog.
          </p>
        </header>

        {/* =================================
            SCROLL HINT
        ================================= */}

        <div
          className={
            styles.scrollHint
          }
        >
          <span
            className={
              styles.mouseHint
            }
          >
            <i />
          </span>

          <div
            className={
              styles.scrollText
            }
          >
            <span>
              scroll to leave
            </span>

            <span>
              the boundary
            </span>
          </div>

          <i
            className={
              styles.scrollLine
            }
          />
        </div>

        {/* =================================
            BITANDINK WORKSPACE
        ================================= */}

        <div
          className={
            styles.monitorPortal
          }
        >
          <div
            className={
              styles.workspaceShell
            }
          >
            {/* =============================
                SIDEBAR
            ============================== */}

            <aside
              className={
                styles.workspaceSidebar
              }
            >
              <div
                className={
                  styles.workspaceIdentity
                }
              >
                <span
                  className={
                    styles.workspaceMark
                  }
                >
                  b/
                </span>

                <div>
                  <strong>
                    bitandink
                  </strong>

                  <span>
                    workspace
                  </span>
                </div>
              </div>

              <nav
                className={
                  styles.workspaceNav
                }
                aria-label="Bitandink workspace"
              >
                {/* =========================
                    WORKSPACE
                ========================== */}

                <div
                  className={
                    styles.navGroup
                  }
                >
                  <span
                    className={
                      styles.navLabel
                    }
                  >
                    WORKSPACE
                  </span>

                  <div
                    className={[
                      styles.navItem,
                      styles.navItemActive,
                    ].join(" ")}
                  >
                    <span>
                      ◌
                    </span>

                    <strong>
                      Current
                    </strong>
                  </div>

                  <div
                    className={
                      styles.navItem
                    }
                  >
                    <span>
                      □
                    </span>

                    <strong>
                      Archive
                    </strong>
                  </div>
                </div>

                {/* =========================
                    SPACES
                ========================== */}

                <div
                  className={
                    styles.navGroup
                  }
                >
                  <span
                    className={
                      styles.navLabel
                    }
                  >
                    SPACES
                  </span>

                  <div
                    className={
                      styles.navItem
                    }
                  >
                    <span>
                      ↗
                    </span>

                    <strong>
                      Beanlog
                    </strong>
                  </div>

                  <div
                    className={
                      styles.navItem
                    }
                  >
                    <span>
                      ↗
                    </span>

                    <strong>
                      Perfugium
                    </strong>
                  </div>
                </div>

                {/* =========================
                    LAB
                ========================== */}

                <div
                  className={
                    styles.navGroup
                  }
                >
                  <span
                    className={
                      styles.navLabel
                    }
                  >
                    LAB
                  </span>

                  <div
                    className={
                      styles.navItem
                    }
                  >
                    <span>
                      +
                    </span>

                    <strong>
                      Playground
                    </strong>
                  </div>
                </div>
              </nav>

              <div
                className={
                  styles.sidebarFooter
                }
              >
                <span>
                  local workspace
                </span>

                <i />
              </div>
            </aside>

            {/* =============================
                MAIN
            ============================== */}

            <main
              className={
                styles.workspaceMain
              }
            >
              {/* ===========================
                  TOP BAR
              ============================ */}

              <header
                className={
                  styles.workspaceTopbar
                }
              >
                <div
                  className={
                    styles.breadcrumb
                  }
                >
                  <span>
                    bitandink
                  </span>

                  <i>
                    /
                  </i>

                  <span>
                    workspace
                  </span>

                  <i>
                    /
                  </i>

                  <strong>
                    current
                  </strong>
                </div>

                <div
                  className={
                    styles.workspaceStatus
                  }
                >
                  <i />

                  <span>
                    ACTIVE
                  </span>
                </div>
              </header>

              {/* ===========================
                  CURRENT DOCUMENT
              ============================ */}

              <article
                className={
                  styles.currentDocument
                }
              >
                <header
                  className={
                    styles.documentHeading
                  }
                >
                  <span
                    className={
                      styles.documentIndex
                    }
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

                {/* =========================
                    OBSESSIONS
                ========================== */}

                <div
                  className={
                    styles.obsessionList
                  }
                >
                  {/* =======================
                      BEANLOG
                  ======================== */}

                  <article
                    className={
                      styles.obsessionItem
                    }
                  >
                    <span
                      className={
                        styles.obsessionNumber
                      }
                    >
                      01
                    </span>

                    <div
                      className={
                        styles.obsessionBody
                      }
                    >
                      <div
                        className={
                          styles.obsessionTitle
                        }
                      >
                        <h3>
                          Beanlog
                        </h3>

                        <span>
                          ACTIVE
                        </span>
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
                          개인 홈페이지를 다시 만들기 시작했는데,
                          어느 순간 홈페이지 자체보다
                          그 안에 어떤 세계를 만들 수 있을지가
                          더 재미있어졌다.
                        </p>

                        <p>
                          작은 방을 만들고,
                          그 안에 주민들을 살게 하고,
                          별 의미 없는 인터랙션도
                          하나씩 붙이는 중.
                        </p>
                      </div>

                      <div
                        className={
                          styles.obsessionMeta
                        }
                      >
                        <span>
                          worldbuilding
                        </span>

                        <span>
                          frontend
                        </span>

                        <span>
                          interaction
                        </span>

                        <span>
                          tiny residents
                        </span>
                      </div>
                    </div>
                  </article>

                  {/* =======================
                      PERFUGIUM
                  ======================== */}

                  <article
                    className={
                      styles.obsessionItem
                    }
                  >
                    <span
                      className={
                        styles.obsessionNumber
                      }
                    >
                      02
                    </span>

                    <div
                      className={
                        styles.obsessionBody
                      }
                    >
                      <div
                        className={
                          styles.obsessionTitle
                        }
                      >
                        <h3>
                          Perfugium
                        </h3>

                        <span>
                          FORMING
                        </span>
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
                          예전에 사용하던 이름을
                          다시 꺼냈다.
                        </p>

                        <p>
                          perfugium.
                          <br />
                          피난처, 안식처.
                        </p>

                        <p>
                          내가 편하게 글을 쓸 수 있는 곳이면서,
                          내가 쓴 무언가가 누군가에게는
                          잠깐 머물다 갈 수 있는
                          안식처가 되었으면 하는 곳.
                        </p>

                        <p>
                          아직은 공간의 형태만
                          천천히 생각하는 중.
                        </p>
                      </div>

                      <div
                        className={
                          styles.obsessionMeta
                        }
                      >
                        <span>
                          writing
                        </span>

                        <span>
                          essays
                        </span>

                        <span>
                          archive
                        </span>

                        <span>
                          refuge
                        </span>
                      </div>
                    </div>
                  </article>

                  {/* =======================
                      OLD WEB / NEW WEB
                  ======================== */}

                  <article
                    className={
                      styles.obsessionItem
                    }
                  >
                    <span
                      className={
                        styles.obsessionNumber
                      }
                    >
                      03
                    </span>

                    <div
                      className={
                        styles.obsessionBody
                      }
                    >
                      <div
                        className={
                          styles.obsessionTitle
                        }
                      >
                        <h3>
                          Old Web,
                          New Web
                        </h3>

                        <span>
                          CURIOUS
                        </span>
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
                          몇 년 만에 웹 인터랙션을
                          다시 만지고 있다.
                        </p>

                        <p>
                          예전에는 JavaScript와
                          라이브러리를 끌어오고,
                          스크롤 값을 계속 계산하고,
                          콘솔 로그를 찍어가며 만들었던 것들이
                          이제는 너무 자연스럽게 움직인다.
                        </p>

                        <p>
                          분명 알고 있던 웹인데,
                          오랜만에 다시 만나니
                          조금 낯설고 재미있다.
                        </p>
                      </div>

                      <div
                        className={
                          styles.obsessionMeta
                        }
                      >
                        <span>
                          css
                        </span>

                        <span>
                          browser
                        </span>

                        <span>
                          interaction
                        </span>

                        <span>
                          nostalgia
                        </span>
                      </div>
                    </div>
                  </article>

                  {/* =======================
                      PLAYGROUND
                  ======================== */}

                  <article
                    className={
                      styles.obsessionItem
                    }
                  >
                    <span
                      className={
                        styles.obsessionNumber
                      }
                    >
                      04
                    </span>

                    <div
                      className={
                        styles.obsessionBody
                      }
                    >
                      <div
                        className={
                          styles.obsessionTitle
                        }
                      >
                        <h3>
                          Playground
                        </h3>

                        <span>
                          UNSTABLE
                        </span>
                      </div>

                      <p>
                        굳이 없어도 되는 것들.
                      </p>

                      <div
                        className={
                          styles.obsessionDescription
                        }
                      >
                        <p>
                          작은 게임,
                          이상한 인터랙션,
                          한 번쯤 만들어보고 싶은 실험들.
                        </p>

                        <p>
                          딱히 필요한 기능은 아니다.
                        </p>

                        <p
                          className={
                            styles.playgroundNote
                          }
                        >
                          그래서 아마 만들 것 같다.
                        </p>
                      </div>

                      <div
                        className={
                          styles.obsessionMeta
                        }
                      >
                        <span>
                          experiments
                        </span>

                        <span>
                          tiny games
                        </span>

                        <span>
                          interaction
                        </span>

                        <span>
                          questionable ideas
                        </span>
                      </div>
                    </div>
                  </article>
                </div>
              </article>
            </main>

            {/* =============================
                STATUS BAR
            ============================== */}

            <footer
              className={
                styles.workspaceStatusbar
              }
            >
              <div>
                <span>
                  ◇
                </span>

                <span>
                  main
                </span>

                <span>
                  UTF-8
                </span>
              </div>

              <div>
                <span>
                  somewhere between worlds
                </span>

                <span>
                  ●
                </span>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </section>
  );
}