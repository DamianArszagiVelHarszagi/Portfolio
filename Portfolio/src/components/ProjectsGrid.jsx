import ProjectCard from "./ProjectCard";
import styles from "./ProjectsGrid.module.css";

export default function ProjectsGrid({ projects }) {
	if (!projects) {
		return (
			<div className={styles.grid}>
				{[0, 1].map((i) => (
					<div key={i} className={styles.skeleton}>
						<span className={styles.skeletonLine} />
						<span className={styles.skeletonTitle} />
						<span className={styles.skeletonPanel} />
					</div>
				))}
			</div>
		);
	}

	if (projects.length === 0) {
		return <p className={styles.empty}>No projects here yet.</p>;
	}

	return (
		<div className={styles.grid}>
			{projects.map((project, i) => (
				<ProjectCard key={project.slug} project={project} index={i} />
			))}
		</div>
	);
}
