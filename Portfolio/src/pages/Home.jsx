import styles from "./Home.module.css";
import photo from "../assets/me_picture.jpg";

export default function Home() {
	return (
		<div className={styles.home}>
			<div className={styles.hero}>
				<div className={styles.nameBlock}>
					<h1 className={styles.name}>
						DAMIAN
						<br />
						ARSZAGI
					</h1>
					<p className={styles.role}>Web Developer</p>
				</div>

				<div className={styles.contactBlock}>
					<p className={styles.contactText}>
						For business inquiries, email me at
					</p>
					<a href="mailto:damian@arszagi.eu" className={styles.contactEmail}>
						damian@arszagi.eu
					</a>
				</div>

				<div className={styles.photoBlock}>
					<img src={photo} alt="Damian Arszagi" className={styles.photo} />
				</div>
			</div>

			<div className={styles.about}>
				<h2 className={styles.aboutTitle}>ABOUT ME</h2>
				<div className={styles.aboutLine} />
				<div className={styles.aboutText}>
					<p>
						I am a web developer and designer focused on building clean,
						functional digital experiences with attention to detail.
					</p>
					<p>
						My main focus is front-end development. I enjoy exploring new
						technologies and experimenting with creative ideas.
					</p>
					<p>
						Outside of programming, I am passionate about design, photography,
						and building things from scratch.
					</p>
				</div>
			</div>
		</div>
	);
}
