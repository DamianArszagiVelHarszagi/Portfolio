import styles from "./TagList.module.css";

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
