import { motion } from "framer-motion";
import AnimatedTitle from "../components/AnimatedTitle";
import styles from './Works.module.css';

export default function Works() {
	return (
		<div className={styles.works}>
			<div className={styles.header}>
				<p className={styles.label}>Selected Work</p>
				<AnimatedTitle text="Works" className={styles.title} />
			</div>

			<div className={styles.grid}>
				<motion.div className={styles.card} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
					<div className={styles.cardThumb} />
					<div className={styles.cardInfo}>
						<p className={styles.cardTitle}>Project 1</p>
						<p className={styles.cardTag}>Design · Development</p>
					</div>
				</motion.div>
				<motion.div className={styles.card} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
					<div className={styles.cardThumb} />
					<div className={styles.cardInfo}>
						<p className={styles.cardTitle}>Project 2</p>
						<p className={styles.cardTag}>Design · Development</p>
					</div>
				</motion.div>
				<motion.div className={styles.card} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
					<div className={styles.cardThumb} />
					<div className={styles.cardInfo}>
						<p className={styles.cardTitle}>Project 3</p>
						<p className={styles.cardTag}>Design · Development</p>
					</div>
				</motion.div>
				<motion.div className={styles.card} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
					<div className={styles.cardThumb} />
					<div className={styles.cardInfo}>
						<p className={styles.cardTitle}>Project 4</p>
						<p className={styles.cardTag}>Design · Development</p>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
