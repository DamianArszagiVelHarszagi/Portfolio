import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./FilterBar.module.css";

const TABS = [
	{ label: "React", path: "/works/react" },
	{ label: "Laravel", path: "/works/laravel" },
	{ label: "Others", path: "/works/others" },
];

// NavLink sets aria-current="page" on the active tab by itself
export default function FilterBar() {
	return (
		<nav className={styles.bar} aria-label="Filter projects">
			{TABS.map((tab) => (
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
