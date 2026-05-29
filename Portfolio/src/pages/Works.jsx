import { useEffect, useRef, useState } from "react";
import styles from "./Works.module.css";
import rollerCoasterManager from "../assets/works/roller-coaster-manager.png";
import callistenicsAppOverview from "../assets/works/callistenics-app-overview.png";
import polskaSzkolaOverview from "../assets/works/polska-szkola-overview.png";
import hiddenShanghaiOverview from "../assets/works/hidden-shanghai.png";
import recyclageAppOverview from "../assets/works/recyclage-app-overview.png";
import wasteWatchOverview from "../assets/works/waste-watch-overview.png";

const PROJECTS = [
	{
		counter: "01",
		title: "Roller Coaster Manager",
		category: "Course Project / Full Stack",
		description:
			"A management app for Walibi roller coasters. View all attractions, sort them by category, and log breakdowns to keep operations running smoothly.",
		tools: ["Vue.js", "Kotlin", "Spring Boot"],
		image: rollerCoasterManager,
		alt: "Roller Coaster Manager app overview",
	},
	{
		counter: "02",
		title: "Cali Brussels",
		category: "Course Project / Full Stack",
		description:
			"Cali Brussels is a web platform that shows calisthenics parks in Brussels on an interactive map. Users can search for parks, filter by location or equipment, and view or add reviews.",
		tools: ["Figma", "Illustrator", "Javascript", "Node.js", "Html | css"],
		image: callistenicsAppOverview,
		alt: "Cali Brussels app overview",
	},
	{
		counter: "03",
		title: "Polish Institute in Brussels",
		category: "Client Work / Front End",
		description:
			"Full redesign of the old website for the Polish Institute Brussels, starting with a Figma design and later developed into a website after consultations.",
		tools: ["Javascript", "Html | css", "Figma", "Photoshop"],
		image: polskaSzkolaOverview,
		alt: "Polska szkola website overview",
	},
	{
		counter: "04",
		title: "Hidden Shanghai",
		category: "Course Project / Back End",
		description:
			"A backend application that uncovers hidden gems and lesser-known locations across Shanghai, serving location data and user-submitted spots through a Laravel API.",
		tools: ["Laravel", "PHP"],
		image: hiddenShanghaiOverview,
		alt: "Hidden Shanghai app overview",
	},
	{
		counter: "05",
		title: "Recycle App",
		category: "Personal project / Front End",
		description:
			"Recycling app that provides information about waste collection schedules and offers simple advice on how to sort waste correctly.",
		tools: ["React.js", "Typescript"],
		image: recyclageAppOverview,
		alt: "Recyclage App overview",
	},
	{
		counter: "06",
		title: "Waste Watch",
		category: "Groups project / Full Stack",
		description:
			"WasteWatch is an app that helps users track and understand their waste habits, providing insights and simple tips to reduce waste.",
		tools: ["Javascript", "Node.js", "Figma", "Photoshop", "Illustrator", "Html | css"],
		image: wasteWatchOverview,
		alt: "Waste Watch app overview",
	},
];

export default function Works() {
	const [activeIndex, setActiveIndex] = useState(0);
	const [isChanging, setIsChanging] = useState(false);

	const sectionRefs = useRef([]);
	const activeIndexRef = useRef(0);
	const fadeTimeoutRef = useRef(null);
	const frameRef = useRef(null);

	useEffect(() => {
		function changeActive(index) {
			if (activeIndexRef.current === index) return;

			clearTimeout(fadeTimeoutRef.current);
			activeIndexRef.current = index;
			setIsChanging(true);

			fadeTimeoutRef.current = setTimeout(() => {
				setActiveIndex(index);
				setIsChanging(false);
			}, 180);
		}

		function findClosestSection() {
			const viewportCenter = window.innerHeight / 2;
			let closestIndex = activeIndexRef.current;
			let closestDistance = Infinity;

			sectionRefs.current.forEach((el, i) => {
				if (!el) return;
				const rect = el.getBoundingClientRect();
				const distance = Math.abs(rect.top + rect.height / 2 - viewportCenter);

				if (distance < closestDistance) {
					closestDistance = distance;
					closestIndex = i;
				}
			});

			changeActive(closestIndex);
		}

		function loop() {
			findClosestSection();
			frameRef.current = requestAnimationFrame(loop);
		}

		frameRef.current = requestAnimationFrame(loop);

		return () => {
			cancelAnimationFrame(frameRef.current);
			clearTimeout(fadeTimeoutRef.current);
		};
	}, []);

	const project = PROJECTS[activeIndex];
	const isLastProject = activeIndex === PROJECTS.length - 1;

	return (
		<section className={styles.works}>
			<div className={styles.mediaRail}>
				{PROJECTS.map((p, i) => (
					<article
						key={p.counter}
						className={styles.projectSection}
						ref={(el) => (sectionRefs.current[i] = el)}
					>
						<div className={styles.projectImage}>
							<img src={p.image} alt={p.alt} className={styles.projectPhoto} />
						</div>
					</article>
				))}
			</div>

			<aside className={styles.projectInfo}>
				<div className={styles.infoHeader}>
					<p>Works</p>
					<span>/ Damian</span>
				</div>

				<div
					className={`${styles.infoBody} ${isLastProject ? styles.lastProjectInfo : ""} ${isChanging ? styles.isChanging : ""}`}
				>
					<p className={styles.counter}>[ {project.counter} / 06 ]</p>
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
					{isLastProject && (
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
