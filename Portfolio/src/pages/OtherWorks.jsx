import { useEffect, useState } from "react";
import AnimatedTitle from "../components/AnimatedTitle";
import FilterBar from "../components/FilterBar";
import ProjectsGrid from "../components/ProjectsGrid";
import styles from "./OtherWorks.module.css";

// everything that is not React or Laravel, same rule as in Works.jsx
function isOther(project) {
	return (
		!project.tools.includes("React.js") && !project.tools.includes("Laravel")
	);
}

export default function OtherWorks() {
	// null = still loading
	const [projects, setProjects] = useState(null);

	useEffect(() => {
		fetch(`${import.meta.env.VITE_API_URL}/api/projects`)
			.then((res) => res.json())
			.then((json) => setProjects(json.data.filter(isOther)))
			.catch(() => setProjects([]));
	}, []);

	return (
		<section className={styles.page}>
			<title>Other Projects | Damian Arszagi</title>
			<meta
				name="description"
				content="Other projects by Damian Arszagi, from a Vue.js and Spring Boot management app to client websites and interactive Node.js maps."
			/>

			<header className={styles.header}>
				<AnimatedTitle text="Other Projects" className={styles.title} />
				<FilterBar />
			</header>

			<ProjectsGrid projects={projects} />
		</section>
	);
}
