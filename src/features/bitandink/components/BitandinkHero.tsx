import styles from "../styles/bitandink.module.css";

export default function BitandinkHero() {
  return (
    <section className={styles.hero}>
      {/* Room / workspace background */}
      <div className={styles.workspaceImage} />

      {/* Background blending layers */}
      <div className={styles.imageFade} />
      <div className={styles.backgroundTexture} />

      {/* Left-side identity */}
      <header className={styles.identity}>
        <span className={styles.eyebrow}>
          REAL WORLD / CONNECTION POINT
        </span>

        <h1 className={styles.title}>bitandink</h1>

        <p className={styles.subtitle}>
          somewhere between the real world
          <br />
          and Beanlog.
        </p>
      </header>

      {/* Scroll hint */}
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
    </section>
  );
}