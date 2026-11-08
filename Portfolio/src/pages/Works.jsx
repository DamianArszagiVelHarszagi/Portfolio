import { Fragment, useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Tags from "../components/Tags";
import styles from "./Works.module.css";

const TECHNOLOGY_GROUPS = [
	{
		key: "react",
		label: "React",
		path: "/works/react",
		description:
			"React projects by Damian Arszagi, including interactive map apps and websites built with React and TypeScript.",
	},
	{
		key: "laravel",
		label: "Laravel",
		path: "/works/laravel",
		description:
			"Laravel projects by Damian Arszagi, featuring APIs, database relationships, authentication, and admin tools.",
	},
	{
		key: "others",
		label: "Others",
		path: "/works/others",
		description:
			"Other projects by Damian Arszagi, from a Vue.js and Spring Boot management app to an interactive Node.js map.",
	},
];

// React and Laravel come from the tools, the rest goes under Others
function inGroup(project, key) {
	const isReact = project.tools.includes("React.js");
	const isLaravel = project.tools.includes("Laravel");

	if (key === "react") return isReact;
	if (key === "laravel") return isLaravel;
	return !isReact && !isLaravel;
}

export default function Works({ categoryKey = "react" }) {
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
	const projects = allProjects.filter((item) =>
		inGroup(item, activeCategory.key),
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
						{/* REACT - LARAVEL, the last one (OTHERS) sits on the right */}
						{TECHNOLOGY_GROUPS.map((group, i) => (
							<Fragment key={group.key}>
								{i > 0 && i < TECHNOLOGY_GROUPS.length - 1 && (
									<span className={styles.technologySeparator}>-</span>
								)}
								<NavLink
									to={group.path}
									className={({ isActive }) =>
										`${styles.technologyLink} ${isActive ? styles.technologyLinkActive : ""}`
									}
								>
									{group.label}
								</NavLink>
							</Fragment>
						))}
					</div>
				</div>

				<div
					className={`${styles.infoBody} ${isChanging ? styles.isChanging : ""}`}
				>
					{project && (
						<ProjectText
							project={project}
							index={activeIndex}
							count={projects.length}
							Heading="h1"
						/>
					)}
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
			<Tags items={project.tools} className={styles.tags} />
		</>
	);
}
