import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import styles from "./Works.module.css";

const TECHNOLOGY_GROUPS = [
	{
		key: "fullStack",
		label: "Full Stack",
		path: "/works/full-stack",
		description:
			"Full stack projects by Damian Arszagi, from management apps to interactive maps, built with Vue.js, Kotlin, Spring Boot, and Node.js.",
	},
	{
		key: "frontEnd",
		label: "Front End",
		path: "/works/front-end",
		description:
			"Front end projects by Damian Arszagi, including client websites and interactive React apps with maps, TypeScript, and custom designs.",
	},
	{
		key: "backEnd",
		label: "Back End",
		path: "/works/back-end",
		description:
			"Back end projects by Damian Arszagi built with Laravel and PHP, featuring APIs, database relationships, authentication, and admin tools.",
	},
];

export default function Works({ categoryKey = "fullStack" }) {
	const [activeIndex, setActiveIndex] = useState(0);
	const [isChanging, setIsChanging] = useState(false);

	const [allProjects, setAllProjects] = useState([]);
	useEffect(() => {
		fetch(`${import.meta.env.VITE_API_URL}/api/projects`)
			.then((res) => res.json())
			.then((json) => setAllProjects(json.data));
	}, []);
	const sectionRefs = useRef([]);
	const activeIndexRef = useRef(0);
	const fadeTimeoutRef = useRef(null);
	const frameRef = useRef(null);
	const activeCategory =
		TECHNOLOGY_GROUPS.find((group) => group.key === categoryKey) ??
		TECHNOLOGY_GROUPS[0];
	const projects = allProjects.filter(
		(item) => item.type === activeCategory.key,
	);

	useEffect(() => {
		function changeActive(index) {
			if (activeIndexRef.current === index) return;

			clearTimeout(fadeTimeoutRef.current);
			activeIndexRef.current = index;
			setIsChanging(true);

			fadeTimeoutRef.current = setTimeout(() => {
				setActiveIndex(index);
				setIsChanging(false);
			}, 180);
		}

		function findClosestSection() {
			const viewportCenter = window.innerHeight / 2;
			let closestIndex = activeIndexRef.current;
			let closestDistance = Infinity;

			sectionRefs.current.forEach((el, i) => {
				if (!el) return;
				const rect = el.getBoundingClientRect();
				const distance = Math.abs(rect.top + rect.height / 2 - viewportCenter);

				if (distance < closestDistance) {
					closestDistance = distance;
					closestIndex = i;
				}
			});

			changeActive(closestIndex);
		}

		function loop() {
			findClosestSection();
			frameRef.current = requestAnimationFrame(loop);
		}

		frameRef.current = requestAnimationFrame(loop);

		return () => {
			if (frameRef.current !== null) {
				cancelAnimationFrame(frameRef.current);
			}
			clearTimeout(fadeTimeoutRef.current);
		};
	}, []);

	const project = projects[activeIndex] ?? projects[0];
	const isLastProject = activeIndex === projects.length - 1;
	const projectCount = String(projects.length).padStart(2, "0");
	const projectNumber = String(activeIndex + 1).padStart(2, "0");

	if (!project) return null;

	return (
		<section className={styles.works}>
			<title>{`${activeCategory.label} Projects | Damian Arszagi`}</title>
			<meta name="description" content={activeCategory.description} />
			<div className={styles.mediaRail}>
				{projects.map((p, i) => (
					<article
						key={p.title}
						className={styles.projectSection}
						ref={(el) => (sectionRefs.current[i] = el)}
					>
						<Link to={`/works/${p.slug}`} className={styles.projectImage}>
							<img
								src={p.image}
								alt={p.alt}
								className={styles.projectPhoto}
								loading={i === 0 ? "eager" : "lazy"}
								decoding="async"
								fetchPriority={i === 0 ? "high" : "auto"}
							/>
						</Link>
					</article>
				))}
			</div>

			<aside className={styles.projectInfo}>
				<div className={styles.infoHeader}>
					<div className={styles.infoHeaderTop}>
						<p>Works</p>
						<span>/ Damian</span>
					</div>
					<div className={styles.technologyButtons}>
						{TECHNOLOGY_GROUPS.map((group) => (
							<NavLink
								to={group.path}
								key={group.key}
								className={({ isActive }) =>
									`${styles.technologyLink} ${isActive ? styles.technologyLinkActive : ""}`
								}
							>
								{group.label}
							</NavLink>
						))}
					</div>
				</div>

				<div
					className={`${styles.infoBody} ${isLastProject ? styles.lastProjectInfo : ""} ${isChanging ? styles.isChanging : ""}`}
				>
					<p className={styles.counter}>
						[ {projectNumber} / {projectCount} ]
					</p>

					<h1>{project.title}</h1>
					<p className={styles.category}>
						{project.category} / {activeCategory.label}
					</p>
					<p className={styles.description}>{project.description}</p>
					<div className={styles.pills}>
						{project.tools.map((tool) => (
							<span className={styles.pill} key={tool}>
								{tool}
							</span>
						))}
					</div>
					{isLastProject && (
						<div className={styles.quickLinks}>
							<a href="/" className={styles.quickLink}>
								HOME {"\u2192"}
							</a>
							<a href="/contact" className={styles.quickLink}>
								CONTACT {"\u2192"}
							</a>
						</div>
					)}
				</div>
			</aside>
		</section>
	);
}
