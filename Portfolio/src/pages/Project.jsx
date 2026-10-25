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

				<div className={styles.intro}>
					<div className={styles.cover}>
						<img src={project.image} alt={project.alt} className={styles.coverPhoto} />
					</div>

					<section className={styles.overview}>
						<h2 className={styles.overviewTitle}>Overview</h2>
						<p className={styles.description}>{project.description}</p>

						<dl className={styles.details}>
							{project.role && (
								<div className={styles.detail}>
									<dt>Role</dt>
									<dd>{project.role}</dd>
								</div>
							)}
							{project.year && (
								<div className={`${styles.detail} ${styles.half}`}>
									<dt>Year</dt>
									<dd>{project.year}</dd>
								</div>
							)}
							{project.duration && (
								<div className={`${styles.detail} ${styles.half}`}>
									<dt>Duration</dt>
									<dd>{project.duration}</dd>
								</div>
							)}
							{project.team && (
								<div className={styles.detail}>
									<dt>Team</dt>
									<dd>{project.team}</dd>
								</div>
							)}
							<div className={styles.detail}>
								<dt>Tools</dt>
								<dd className={styles.pills}>
									{project.tools.map((tool) => (
										<span className={styles.pill} key={tool}>
											{tool}
										</span>
									))}
								</dd>
							</div>
						</dl>

						{(project.github_url || project.live_url) && (
							<div className={styles.links}>
								{project.github_url && (
									<a href={project.github_url} target="_blank" rel="noreferrer" className={styles.link}>
										GitHub {"↗"}
									</a>
								)}
								{project.live_url && (
									<a href={project.live_url} target="_blank" rel="noreferrer" className={styles.link}>
										Live site {"↗"}
									</a>
								)}
							</div>
						)}
					</section>
				</div>
			</motion.div>
		</article>
	);
}
