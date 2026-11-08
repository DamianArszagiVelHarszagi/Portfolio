import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import styles from "./HeroTiles.module.css";

export default function HeroTiles({ projects }) {
	const reduceMotion = useReducedMotion();
	const tiles = projects ?? [null, null, null];

	return (
		<div className={styles.stack}>
			{tiles.map((project, i) => (
				<motion.div
					key={project?.slug ?? i}
					className={styles.slot}
					initial={{ opacity: 0, y: reduceMotion ? 0 : 22 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1, delay: 0.6 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
				>
					<div className={styles.tile}>
						{project && (
							<Link to={`/works/${project.slug}`} className={styles.link}>
								<img
									src={project.poster || project.image}
									alt={project.title}
									className={styles.image}
									decoding="async"
								/>
							</Link>
						)}
					</div>
				</motion.div>
			))}
		</div>
	);
}
