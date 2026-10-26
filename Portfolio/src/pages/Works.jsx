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

		// only the section crossing the middle of the screen counts as intersecting
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						changeActive(sectionRefs.current.indexOf(entry.target));
					}
				});
			},
			{ rootMargin: "-50% 0px -50% 0px" },
		);

		sectionRefs.current.forEach((el) => el && observer.observe(el));

		return () => {
			observer.disconnect();
			clearTimeout(fadeTimeoutRef.current);
		};
	}, [allProjects, categoryKey]);

	const project = projects[activeIndex] ?? projects[0];

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

						{/* only visible on mobile, desktop uses the fixed panel */}
						<div className={styles.cardInfo}>
							<ProjectText
								project={p}
								index={i}
								count={projects.length}
								Heading="h2"
							/>
							<Link to={`/works/${p.slug}`} className={styles.viewLink}>
								View project {"\u2192"}
							</Link>
						</div>
					</article>
				))}
			</div>

			<aside className={styles.projectInfo}>
				<div className={styles.infoHeader}>
					<div className={styles.infoHeaderTop}>
						<p>Works</p>
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
					className={`${styles.infoBody} ${isChanging ? styles.isChanging : ""}`}
				>
					<ProjectText
						project={project}
						index={activeIndex}
						count={projects.length}
						Heading="h1"
					/>
				</div>
			</aside>
		</section>
	);
}

function ProjectText({ project, index, count, Heading }) {
	return (
		<>
			<p className={styles.counter}>
				[ {String(index + 1).padStart(2, "0")} /{" "}
				{String(count).padStart(2, "0")} ]
			</p>
			<Heading className={styles.title}>{project.title}</Heading>
			<p className={styles.category}>{project.category}</p>
			<p className={styles.description}>{project.description}</p>
			<div className={styles.pills}>
				{project.tools.map((tool) => (
					<span className={styles.pill} key={tool}>
						{tool}
					</span>
				))}
			</div>
		</>
	);
}
