import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import styles from "./Home.module.css";
import photo from "../assets/me_picture.jpg";

const nameContainer = {
	initial: {},
	animate: { transition: { staggerChildren: 0.045 } },
};

const letterVariant = {
	initial: { opacity: 0, y: -22, x: -10 },
	animate: {
		opacity: 1,
		y: 0,
		x: 0,
		transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
	},
};

const fadeUp = {
	initial: { opacity: 0, y: 22 },
	animate: {
		opacity: 1,
		y: 0,
		transition: { duration: 1.5, ease: [0.4, 1, 0.36, 1] },
	},
};

export default function Home() {
	const sectionRef = useRef(null);

	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ["start end", "end start"],
	});

	const photoY = useTransform(scrollYProgress, [0, 1], ["35px", "-35px"]);

	return (
		<div className={styles.home}>
			{/* ── Top section ── */}
			<div className={styles.topSection}>
				<div className={styles.hero}>
					<div className={styles.nameBlock}>
						<motion.h1
							className={styles.name}
							variants={nameContainer}
							initial="initial"
							animate="animate"
						>
							{"DAMIAN".split("").map((letter, i) => (
								<motion.span
									key={`d${i}`}
									variants={letterVariant}
									style={{ display: "inline-block" }}
								>
									{letter}
								</motion.span>
							))}
							<br />
							{"ARSZAGI".split("").map((letter, i) => (
								<motion.span
									key={`a${i}`}
									variants={letterVariant}
									style={{ display: "inline-block" }}
								>
									{letter}
								</motion.span>
							))}
						</motion.h1>
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
				</div>

				<motion.div
					className={styles.about}
					variants={fadeUp}
					initial="initial"
					animate="animate"
				>
					<h2 className={styles.aboutTitle}>ABOUT ME</h2>
					<div className={styles.aboutLine} />
					<div className={styles.aboutText}>
						<p>
							I am currently in my second year of the Bachelor of Multimedia &
							Creative Technology at Erasmus University College Brussels. My
							main focus is on web development, and I have worked on several
							creative and technical projects. I enjoy building interactive
							experiences and exploring new technologies. Outside of
							programming, my interests include video creation, playing
							football, and going to the gym.
						</p>
					</div>
				</motion.div>
			</div>

			{/* ── Motivation section ── */}
			<div className={styles.motivationSection}>
				<div className={styles.motivationText}>
					<h2 className={styles.motivationTitle}>MOTIVATION</h2>
					<div className={styles.motivationLine} />
					<div className={styles.motivationParagraphs}>
						<p>
							I'm driven by turning ideas into real, interactive experiences. I
							have a strong interest in frontend development, where I combine
							logic and creativity, while also exploring backend to better
							understand how everything connects. My goal is to grow into a
							well-rounded developer who builds meaningful digital products.
						</p>
					</div>
				</div>

				<div className={styles.photoWrapper} ref={sectionRef}>
					<motion.img
						src={photo}
						className={styles.parallaxPhoto}
						style={{ y: photoY }}
					/>
				</div>
			</div>

			{/* ── Skills section ── */}
			<div className={styles.skillsSection}>
				<h2 className={styles.skillsTitle}>SKILLS</h2>
				<div className={styles.skillsDivider} />

				<div className={styles.skillsGrid}>
					<div className={styles.skillsColumn}>
						<p className={styles.columnTitle}>FRONTEND</p>
						<div className={styles.pills}>
							<span className={styles.pill}>React.js</span>
							<span className={styles.pill}>Javascript</span>
							<span className={styles.pill}>HTML</span>
							<span className={styles.pill}>CSS</span>
							<span className={styles.pill}>Bootstrap</span>
							<span className={styles.pill}>Motion</span>
							<span className={styles.pill}>Tailwind CSS</span>
							<span className={styles.pill}>Typescript</span>
								<span className={styles.pill}>Vue.js</span>
						</div>
					</div>

					<div className={styles.skillsColumn}>
						<p className={styles.columnTitle}>BACKEND</p>
						<div className={styles.pills}>
							<span className={styles.pill}>Node.js</span>
							<span className={styles.pill}>Kotlin</span>
							<span className={styles.pill}>Express.js</span>
							<span className={styles.pill}>Laravel</span>
							<span className={styles.pill}>PHP</span>
							<span className={styles.pill}>SQL</span>
						</div>
					</div>

					<div className={styles.skillsColumn}>
						<p className={styles.columnTitle}>TOOLS</p>
						<div className={styles.pills}>
							<span className={styles.pill}>VSCode</span>
							<span className={styles.pill}>Figma</span>
							<span className={styles.pill}>After Effects</span>
							<span className={styles.pill}>Premiere Pro</span>
							<span className={styles.pill}>Photoshop</span>
							<span className={styles.pill}>Illustrator</span>
							<span className={styles.pill}>Lightroom</span>
							<span className={styles.pill}>InDesign</span>
						</div>
					</div>
				</div>

				<div className={styles.skillsLinks}>
					<a href="/works" className={styles.skillsLink}>
						WORKS →
					</a>
					<a href="/contact" className={styles.skillsLink}>
						CONTACT →
					</a>
				</div>
			</div>
		</div>
	);
}
