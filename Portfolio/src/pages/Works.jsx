import styles from './Works.module.css';

export default function Works() {
  return (
    <div className={styles.works}>
      <div className={styles.header}>
        <p className={styles.label}>Selected Work</p>
        <h1 className={styles.title}>Works</h1>
      </div>

      <div className={styles.grid}>
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className={styles.card}>
            <div className={styles.cardThumb} />
            <div className={styles.cardInfo}>
              <p className={styles.cardTitle}>Project {n}</p>
              <p className={styles.cardTag}>Design · Development</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
