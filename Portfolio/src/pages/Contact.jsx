import styles from "./Contact.module.css";

export default function Contact() {
	return (
		<div className={styles.contact}>
			<div className={styles.content}>
				<p className={styles.label}>Get in Touch</p>
				<h1 className={styles.title}>Contact</h1>

				<div className={styles.divider} />

				<p className={styles.intro}>
					Interested in working together or have a question?
					<br />
					Feel free to reach out.
				</p>

				<div className={styles.links}>
					<a href="mailto:damian@arszagi.eu" className={styles.emailLink}>
						damian@arszagi.eu
					</a>
				</div>
			</div>
		</div>
	);
}
