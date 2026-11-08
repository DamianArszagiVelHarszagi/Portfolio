import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import Tags from "./Tags";
import styles from "./FeaturedProject.module.css";

export default function FeaturedProject({ project }) {
	const reduceMotion = useReducedMotion();

	const reveal = {
		initial: { opacity: 0, y: reduceMotion ? 0 : 30 },
		whileInView: { opacity: 1, y: 0 },
		viewport: { once: true, amount: 0.2 },
		transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
	};

	return (
		<section className={styles.featured} id="featured">
			<h2 className={styles.label}>
				Featured project
			</h2>

			<div className={styles.layout}>
				<motion.div className={styles.poster} {...reveal}>
					{project &&
						(project.poster ? (
							<img
								src={project.poster}
								alt={`Poster of ${project.title}`}
								className={styles.posterImage}
							/>
						) : (
							<div className={styles.placeholder}>
								<span className={styles.posterMeta}>{project.category}</span>
								<img
									src={project.image}
									alt={project.alt || project.title}
									className={styles.screenshot}
									loading="lazy"
									decoding="async"
								/>
								<span className={styles.posterTitle}>{project.title}</span>
							</div>
						))}
				</motion.div>

				<motion.div
					className={styles.info}
					{...reveal}
					transition={{ ...reveal.transition, delay: 0.15 }}
				>
					{project && (
						<>
							<h3 className={styles.title}>{project.title}</h3>
							<p className={styles.description}>{project.description}</p>
							<Tags items={project.tools} className={styles.tags} />
							<Link to={`/works/${project.slug}`} className={styles.cta}>
								View project <span>{"→"}</span>
							</Link>
						</>
					)}
				</motion.div>
			</div>
		</section>
	);
}
