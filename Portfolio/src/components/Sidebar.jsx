import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./Sidebar.module.css";

const navContainer = {
	animate: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

const navItem = {
	initial: { opacity: 0, x: -12 },
	animate: {
		opacity: 1,
		x: 0,
		transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
	},
};

const socialsContainer = {
	animate: { transition: { staggerChildren: 0.07, delayChildren: 0.4 } },
};

const socialItem = {
	initial: { opacity: 0 },
	animate: { opacity: 1, transition: { duration: 0.4 } },
};

function GitHubIcon() {
	return (
		<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
			<path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
		</svg>
	);
}

function LinkedInIcon() {
	return (
		<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
			<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
		</svg>
	);
}

function MailIcon() {
	return (
		<svg
			width="17"
			height="17"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
		>
			<rect x="2" y="4" width="20" height="16" rx="2" />
			<path d="M2 7l10 7 10-7" />
		</svg>
	);
}

export default function Sidebar() {
	return (
		<aside className={styles.sidebar}>
			<div className={styles.navsocials}>
				<motion.nav
					className={styles.nav}
					variants={navContainer}
					initial="initial"
					animate="animate"
				>
					<motion.div variants={navItem}>
						<NavLink
							to="/"
							end
							className={({ isActive }) =>
								`${styles.link} ${isActive ? styles.active : ""}`
							}
						>
							Home
						</NavLink>
					</motion.div>
					<motion.div variants={navItem}>
						<NavLink
							to="/works"
							className={({ isActive }) =>
								`${styles.link} ${isActive ? styles.active : ""}`
							}
						>
							Works
						</NavLink>
					</motion.div>
					<motion.div variants={navItem}>
						<NavLink
							to="/contact"
							className={({ isActive }) =>
								`${styles.link} ${isActive ? styles.active : ""}`
							}
						>
							Contact
						</NavLink>
					</motion.div>
				</motion.nav>

				<motion.div
					className={styles.socials}
					variants={socialsContainer}
					initial="initial"
					animate="animate"
				>
					<motion.a
						href="https://linkedin.com/in/damian-arszagivelharszagi"
						className={styles.socialLink}
						aria-label="LinkedIn"
						variants={socialItem}
						whileHover={{ scale: 1.2, transition: { duration: 0.15 } }}
					>
						<LinkedInIcon />
					</motion.a>
					<motion.a
						href="https://github.com/DamianArszagiVelHarszagi"
						className={styles.socialLink}
						aria-label="GitHub"
						variants={socialItem}
						whileHover={{ scale: 1.2, transition: { duration: 0.15 } }}
					>
						<GitHubIcon />
					</motion.a>
					<motion.a
						href="mailto:damian@arszagi.eu"
						className={styles.socialLink}
						aria-label="Email"
						variants={socialItem}
						whileHover={{ scale: 1.2, transition: { duration: 0.15 } }}
					>
						<MailIcon />
					</motion.a>
				</motion.div>
			</div>

			<p className={styles.copyright}>© Damian Arszagi</p>
		</aside>
	);
}
