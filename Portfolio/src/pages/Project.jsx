import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import AnimatedTitle from "../components/AnimatedTitle";
import styles from "./Project.module.css";

const TYPES = {
	fullStack: { label: "Full Stack", path: "/works/full-stack" },
	frontEnd: { label: "Front End", path: "/works/front-end" },
	backEnd: { label: "Back End", path: "/works/back-end" },
};

const fadeUp = {
	initial: { opacity: 0, y: 22 },
	animate: {
		opacity: 1,
		y: 0,
		transition: { duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] },
	},
};

export default function Project() {
	const { slug } = useParams();
	const [projects, setProjects] = useState([]);

	useEffect(() => {
		fetch(`${import.meta.env.VITE_API_URL}/api/projects`)
			.then((res) => res.json())
			.then((json) => setProjects(json.data));
	}, []);

	const project = projects.find((p) => p.slug === slug);
	if (!project) return null;

	const type = TYPES[project.type];
	const sameType = projects.filter((p) => p.type === project.type);
	const number = String(sameType.indexOf(project) + 1).padStart(2, "0");
	const count = String(sameType.length).padStart(2, "0");

	return (
		<article className={styles.project}>
			<title>{`${project.title} | Damian Arszagi`}</title>
			<meta name="description" content={project.description} />

			<div className={styles.topBar}>
				<Link to={type.path} className={styles.back}>
					{"←"} Works
				</Link>
				<p className={styles.counter}>
					[ {number} / {count} ]
				</p>
			</div>

			<AnimatedTitle text={project.title} className={styles.title} />

			<motion.div variants={fadeUp} initial="initial" animate="animate">
				<p className={styles.subtitle}>
					{project.category} / {type.label}
				</p>

				<div className={styles.cover}>
					<img src={project.image} alt={project.alt} className={styles.coverPhoto} />
				</div>
			</motion.div>
		</article>
	);
}
