import { useEffect, useRef, useState } from "react";
import styles from "./Works.module.css";
import callistenicsAppOverview from "../assets/works/callistenics-app-overview.png";
import polskaSzkolaOverview from "../assets/works/polska-szkola-overview.png";
import recyclageAppOverview from "../assets/works/recyclage-app-overview.png";
import wasteWatchOverview from "../assets/works/waste-watch-overview.png";

function getProject(projectNumber) {
	switch (projectNumber) {
		case 2:
			return {
				counter: "02",
				title: "Polish Insitute in Brussels",
				category: "Client Work / Front End",
				description:
					"Full redesign of the old website for the Polish Institute Brussels, starting with a Figma design and later developed into a website after consultations.",
				tools: ["Javascript", "Html | css", "Figma", "Photoshop"],
			};
		case 3:
			return {
				counter: "03",
				title: "Recycle App",
				category: "Personal project / Front End",
				description:
					"Recycling app that provides information about waste collection schedules and offers simple advice on how to sort waste correctly.",
				tools: ["React.js", "Typescript"],
			};
		case 4:
			return {
				counter: "04",
				title: "Waste Watch",
				category: "Groups project / Full Stack",
				description:
					"WasteWatch is an app that helps users track and understand their waste habits, providing insights and simple tips to reduce waste.",
				tools: [
					"Javascript",
					"Node.js",
					"Figma",
					"Photoshop",
					"Illustrator",
					"Html | css",
				],
			};
		default:
			return {
				counter: "01",
				title: "Cali Brussels",
				category: "Course Project / Full Stack",
				description:
					"Cali Brussels is a web platform that shows calisthenics parks in Brussels on an interactive map. Users can search for parks, filter by location or equipment, and view or add reviews.",
				tools: ["Figma", "Illustrator", "Javascript", "Node.js", "Html | css"],
			};
	}
}

export default function Works() {
	const [activeProject, setActiveProject] = useState(1);
	const [isChanging, setIsChanging] = useState(false);

	const projectOneRef = useRef(null);
	const projectTwoRef = useRef(null);
	const projectThreeRef = useRef(null);
	const projectFourRef = useRef(null);
	const activeProjectRef = useRef(1);
	const fadeTimeoutRef = useRef(null);
	const frameRef = useRef(null);

	useEffect(() => {
		function changeProject(projectNumber) {
			if (activeProjectRef.current === projectNumber) return;

			window.clearTimeout(fadeTimeoutRef.current);
			activeProjectRef.current = projectNumber;
			setIsChanging(true);

			fadeTimeoutRef.current = window.setTimeout(() => {
				setActiveProject(projectNumber);
				setIsChanging(false);
			}, 180);
		}

		function updateActiveProject() {
			const projectRefs = [
				projectOneRef,
				projectTwoRef,
				projectThreeRef,
				projectFourRef,
			];
			const viewportCenter = window.innerHeight / 2;
			let closestProject = activeProjectRef.current;
			let closestDistance = Number.POSITIVE_INFINITY;

			projectRefs.forEach((projectRef, index) => {
				if (!projectRef.current) return;

				const rect = projectRef.current.getBoundingClientRect();
				const projectCenter = rect.top + rect.height / 2;
				const distance = Math.abs(projectCenter - viewportCenter);

				if (distance < closestDistance) {
					closestDistance = distance;
					closestProject = index + 1;
				}
			});

			changeProject(closestProject);
		}

		function watchActiveProject() {
			updateActiveProject();
			frameRef.current = window.requestAnimationFrame(watchActiveProject);
		}

		frameRef.current = window.requestAnimationFrame(watchActiveProject);

		return () => {
			if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
			window.clearTimeout(fadeTimeoutRef.current);
		};
	}, []);

	const project = getProject(activeProject);

	return (
		<section className={styles.works}>
			<div className={styles.mediaRail}>
				<article
					className={styles.projectSection}
					data-project="1"
					ref={projectOneRef}
				>
					<div className={styles.projectImage}>
						<img
							src={callistenicsAppOverview}
							alt="Cali Brussels app overview"
							className={styles.projectPhoto}
						/>
					</div>
				</article>

				<article
					className={styles.projectSection}
					data-project="2"
					ref={projectTwoRef}
				>
					<div className={styles.projectImage}>
						<img
							src={polskaSzkolaOverview}
							alt="Polska szkola website overview"
							className={styles.projectPhoto}
						/>
					</div>
				</article>

				<article
					className={styles.projectSection}
					data-project="3"
					ref={projectThreeRef}
				>
					<div className={styles.projectImage}>
						<img
							src={recyclageAppOverview}
							alt="Recyclage App overview"
							className={styles.projectPhoto}
						/>
					</div>
				</article>

				<article
					className={styles.projectSection}
					data-project="4"
					ref={projectFourRef}
				>
					<div className={styles.projectImage}>
						<img
							src={wasteWatchOverview}
							alt="Waste Watch app overview"
							className={styles.projectPhoto}
						/>
					</div>
				</article>
			</div>

			<aside className={styles.projectInfo}>
				<div className={styles.infoHeader}>
					<p>Works</p>
					<span>/ Damian</span>
				</div>

				<div
					className={`${styles.infoBody} ${
						activeProject === 4 ? styles.lastProjectInfo : ""
					} ${isChanging ? styles.isChanging : ""}`}
				>
					<p className={styles.counter}>[ {project.counter} / 04 ]</p>
					<h1>{project.title}</h1>
					<p className={styles.category}>{project.category}</p>
					<p className={styles.description}>{project.description}</p>
					<div className={styles.pills}>
						{project.tools.map((tool) => (
							<span className={styles.pill} key={tool}>
								{tool}
							</span>
						))}
					</div>
					{activeProject === 4 && (
						<div className={styles.quickLinks}>
							<a href="/" className={styles.quickLink}>
								HOME →
							</a>
							<a href="/contact" className={styles.quickLink}>
								CONTACT →
							</a>
						</div>
					)}
				</div>
			</aside>
		</section>
	);
}
