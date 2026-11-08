import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./FilterBar.module.css";

export default function FilterBar({ tabs }) {
	return (
		<nav className={styles.bar}>
			{tabs.map((tab) => (
				<NavLink
					key={tab.path}
					to={tab.path}
					className={({ isActive }) =>
						`${styles.tab} ${isActive ? styles.active : ""}`
					}
				>
					{({ isActive }) => (
						<>
							{tab.label}
							{isActive && (
								<motion.span
									layoutId="filterUnderline"
									className={styles.underline}
								/>
							)}
						</>
					)}
				</NavLink>
			))}
		</nav>
	);
}
