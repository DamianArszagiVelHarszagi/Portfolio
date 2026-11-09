import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import FeaturedProject from "../components/FeaturedProject";
import HeroTiles from "../components/HeroTiles";
import styles from "./Home.module.css";
import tankcalcPoster from "../assets/posters/tankcalc poster.png";
import directorDnaPoster from "../assets/posters/director dna poster.png";
import ingArenaPoster from "../assets/posters/ING arena poster.png";

const FEATURED_SLUG = "ing-arena";

const HERO_SLUGS = ["tankcalc", "director-dna", "ing-arena"];

const POSTERS = {
	tankcalc: tankcalcPoster,
	"director-dna": directorDnaPoster,
	"ing-arena": ingArenaPoster,
};

const SKILLS = ["React", "Laravel", "Tailwind CSS", "Motion"];

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
	animate: { opacity: 1, y: 0 },
	transition: { duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] },
};

const reveal = {
	initial: { opacity: 0, y: 30 },
	whileInView: { opacity: 1, y: 0 },
	viewport: { once: true, amount: 0.3 },
	transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
};

function letters(word) {
	return word.split("").map((letter, i) => (
		<motion.span key={i} className={styles.letter} variants={letterVariant}>
			{letter}
		</motion.span>
	));
}

export default function Home() {
	const [projects, setProjects] = useState(null);

	useEffect(() => {
		fetch(`${import.meta.env.VITE_API_URL}/api/projects`)
			.then((res) => res.json())
			.then((json) =>
				setProjects(json.data.map((p) => ({ ...p, poster: POSTERS[p.slug] }))),
			)
			.catch(() => setProjects([]));
	}, []);

	let featured = null;
	let heroProjects = null;

	if (projects) {
		featured = projects.find((p) => p.slug === FEATURED_SLUG);
		heroProjects = HERO_SLUGS.map((slug) => projects.find((p) => p.slug === slug));
	}

	return (
		<>
			<title>Damian Arszagi | Web Developer Portfolio</title>
			<meta
				name="description"
				content="Portfolio of Damian Arszagi, web developer and designer in Brussels and final-year Multimedia & Creative Technology student."
			/>

			<section className={styles.hero}>
				<div className={styles.intro}>
					<motion.h1
						className={styles.name}
						variants={nameContainer}
						initial="initial"
						animate="animate"
					>
						{letters("DAMIAN")}
						<br />
						{letters("ARSZAGI")}
					</motion.h1>

					<motion.p className={styles.role} {...fadeUp}>
						Web developer, based in Brussels
					</motion.p>
				</div>

				<div className={styles.tiles}>
					<HeroTiles projects={heroProjects} />
				</div>

				<motion.a href="#featured" className={styles.scrollLink} {...fadeUp}>
					Featured project <span>{"↓"}</span>
				</motion.a>
			</section>

			<FeaturedProject project={featured} className={styles.section} />

			<section className={styles.section}>
				<h2 className={styles.sectionLabel}>About</h2>
				<motion.p className={styles.aboutText} {...reveal}>
					I'm a final-year Multimedia & Creative Technology student at Erasmus
					University College Brussels. I build for the web because I like seeing
					an idea turn into something people can click, scroll and use. I care
					about how it looks and just as much about what happens behind it, and
					my goal is to become a developer who can carry a product from first
					sketch to launch. Off screen: football, boxing and making videos.
				</motion.p>
			</section>

			<section className={styles.section}>
				<h2 className={styles.sectionLabel}>Skills</h2>
				<motion.ul className={styles.skills} {...reveal}>
					{SKILLS.map((skill) => (
						<li key={skill} className={styles.skill}>
							{skill}
						</li>
					))}
				</motion.ul>
			</section>
		</>
	);
}
