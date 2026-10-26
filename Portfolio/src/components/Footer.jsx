import styles from "./Footer.module.css";

export default function Footer() {
	return (
		<footer className={styles.footer}>
			<a href="mailto:damian@arszagi.eu" className={styles.email}>
				damian@arszagi.eu
			</a>
			<p className={styles.copy}>© {new Date().getFullYear()} Damian Arszagi</p>
		</footer>
	);
}
