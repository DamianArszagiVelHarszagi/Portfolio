import styles from "./Tags.module.css";

export default function Tags({ items, className = "" }) {
	return (
		<p className={`${styles.tags} ${className}`}>
			{items.map((item, i) => (
				<span className={styles.tag} key={item}>
					{i > 0 && <span className={styles.separator}>/</span>}
					{item}
				</span>
			))}
		</p>
	);
}
