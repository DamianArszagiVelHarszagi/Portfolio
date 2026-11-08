import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import AnimatedTitle from "../components/AnimatedTitle";
import Tags from "../components/Tags";
import styles from "./Project.module.css";

const GROUPS = {
	react: { label: "React", path: "/works/react" },
	laravel: { label: "Laravel", path: "/works/laravel" },
	others: { label: "Others", path: "/works/others" },
};

function getGroup(project) {
	if (project.tools.includes("React.js")) return "react";
	if (project.tools.includes("Laravel")) return "laravel";
	return "others";
}

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

	const group = GROUPS[getGroup(project)];
	const sameGroup = projects.filter((p) => getGroup(p) === getGroup(project));
	const position = sameGroup.indexOf(project);
	const number = String(position + 1).padStart(2, "0");
	const count = String(sameGroup.length).padStart(2, "0");
	const next = sameGroup[(position + 1) % sameGroup.length];

	return (
		<article className={styles.project} key={project.slug}>
			<title>{`${project.title} | Damian Arszagi`}</title>
			<meta name="description" content={project.description} />

			<div className={styles.topBar}>
				<Link to={group.path} className={styles.back}>
					{"←"} Works
				</Link>
				<p className={styles.counter}>
					[ {number} / {count} ]
				</p>
			</div>

			<AnimatedTitle text={project.title} className={styles.title} />

			<motion.div variants={fadeUp} initial="initial" animate="animate">
				<p className={styles.subtitle}>
					{project.category} / {group.label}
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
								<dd>
									<Tags items={project.tools} />
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

			{next !== project && (
				<Link to={`/works/${next.slug}`} className={styles.next}>
					<span className={styles.nextLabel}>Next project</span>
					<span className={styles.nextTitle}>
						{next.title} <span className={styles.nextArrow}>{"→"}</span>
					</span>
				</Link>
			)}
		</article>
	);
}
