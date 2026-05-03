import AnimatedTitle from "../components/AnimatedTitle";
import styles from "./Contact.module.css";

export default function Contact() {
	return (
		<div className={styles.contact}>
			<div className={styles.content}>
				<p className={styles.label}>Get in Touch</p>
				<AnimatedTitle text="Contact" className={styles.title} />
				<div className={styles.divider} />
				<p className={styles.intro}>
					Available for internships and open to new collaborations.
				</p>
				<div className={styles.details}>
					<div>
						<span>Location</span>
						<p>Based in Brussels, Belgium</p>
					</div>
					<div>
						<span>Status</span>
						<p>Available for internships</p>
					</div>
				</div>
				<div className={styles.links}>
					<a href="mailto:damian@arszagi.eu" className={styles.contactLink}>
						<span>Email</span>
						<p>damian@arszagi.eu</p>
					</a>
					<div className={styles.socialLinks}>
						<a
							href="https://linkedin.com/in/damian-arszagivelharszagi"
							target="_blank"
							rel="noreferrer"
						>
							LinkedIn
							<span aria-hidden="true">Open</span>
						</a>
						<a
							href="https://github.com/DamianArszagiVelHarszagi"
							target="_blank"
							rel="noreferrer"
						>
							GitHub
							<span aria-hidden="true">Open</span>
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
