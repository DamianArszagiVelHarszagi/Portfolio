import AnimatedTitle from "../components/AnimatedTitle";
import styles from "./Gallery.module.css";

export default function Gallery() {
	return (
		<section className={styles.gallery}>
			<p className={styles.label}>Visual Archive</p>
			<AnimatedTitle text="Gallery" className={styles.title} />
		</section>
	);
}
