import styles from "./TagList.module.css";

// small, non-clickable pills for the tech stack of a project
export default function TagList({ items }) {
	return (
		<ul className={styles.list}>
			{items.map((item) => (
				<li className={styles.tag} key={item}>
					{item}
				</li>
			))}
		</ul>
	);
}
