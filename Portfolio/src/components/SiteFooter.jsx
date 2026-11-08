import styles from "./SiteFooter.module.css";

export default function SiteFooter() {
	return (
		<footer className={styles.footer}>
			<p className={styles.meta}>Brussels, Belgium</p>
			<p className={`${styles.meta} ${styles.copy}`}>
				{"©"} {new Date().getFullYear()} Damian Arszagi
			</p>
			<a href="#top" className={styles.top}>
				Back to top <span>{"↑"}</span>
			</a>
		</footer>
	);
}
