import { motion } from "framer-motion";

const container = {
	initial: {},
	animate: { transition: { staggerChildren: 0.045 } },
};

const letterVariant = {
	initial: { opacity: 0, y: -22, x: -10 },
	animate: {
		opacity: 1,
		y: 0,
		x: 0,
		transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
	},
};

export default function AnimatedTitle({ text, className }) {
	return (
		<motion.h1
			className={className}
			variants={container}
			initial="initial"
			animate="animate"
		>
			{text.split("").map((letter, i) => (
				<motion.span
					key={i}
					variants={letterVariant}
					style={{ display: "inline-block" }}
				>
					{letter === " " ? " " : letter}
				</motion.span>
			))}
		</motion.h1>
	);
}
