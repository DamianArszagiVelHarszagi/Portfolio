import { useEffect, useState } from "react";
import AnimatedTitle from "../components/AnimatedTitle";
import FilterBar from "../components/FilterBar";
import ProjectsGrid from "../components/ProjectsGrid";
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
			"Other projects by Damian Arszagi, from a Vue.js and Spring Boot management app to client websites and interactive Node.js maps.",
	},
];

function inGroup(project, key) {
	const isReact = project.tools.includes("React.js");
	const isLaravel = project.tools.includes("Laravel");

	if (key === "react") return isReact;
	if (key === "laravel") return isLaravel;
	return !isReact && !isLaravel;
}

export default function Works({ categoryKey = "react" }) {
	const [allProjects, setAllProjects] = useState(null);

	useEffect(() => {
		fetch(`${import.meta.env.VITE_API_URL}/api/projects`)
			.then((res) => res.json())
			.then((json) => setAllProjects(json.data))
			.catch(() => setAllProjects([]));
	}, []);

	const activeCategory =
		TECHNOLOGY_GROUPS.find((group) => group.key === categoryKey) ??
		TECHNOLOGY_GROUPS[0];
	const projects = allProjects
		? allProjects.filter((item) => inGroup(item, activeCategory.key))
		: null;

	return (
		<section className={styles.page}>
			<title>{`${activeCategory.label} Projects | Damian Arszagi`}</title>
			<meta name="description" content={activeCategory.description} />

			<header className={styles.header}>
				<AnimatedTitle
					text={`${activeCategory.label} Projects`}
					className={styles.title}
				/>
				<FilterBar tabs={TECHNOLOGY_GROUPS} />
			</header>

			<ProjectsGrid projects={projects} />
		</section>
	);
}
