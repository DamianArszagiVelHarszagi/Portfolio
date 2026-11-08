import ProjectCard from "./ProjectCard";
import styles from "./ProjectsGrid.module.css";

// projects is null while loading
export default function ProjectsGrid({ projects }) {
	if (projects && projects.length === 0) {
		return <p className={styles.empty}>No projects here yet.</p>;
	}

	return (
		<div className={styles.grid} aria-busy={!projects}>
			{projects
				? projects.map((project, i) => (
						<ProjectCard
							key={project.slug}
							project={project}
							index={i}
							// right card in a row comes in slightly later
							delay={(i % 2) * 0.1}
						/>
					))
				: [0, 1].map((i) => (
						<div key={i} className={styles.skeleton} aria-hidden="true">
							<span className={styles.skeletonLine} />
							<span className={styles.skeletonTitle} />
							<span className={styles.skeletonPanel} />
						</div>
					))}
		</div>
	);
}
