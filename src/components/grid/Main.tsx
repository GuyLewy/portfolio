import React, { useEffect, useReducer, useRef, useState } from "react";
import cn from "../../utils/cn";
import Container, { type ExternalContainerProps } from "./Container";

export default function Main() {
	const gridWidth = 12;
	const gridHeight = 8;

	const gridPositions = Array.from({ length: gridHeight }, (_, i) => {
		return Array.from({ length: gridWidth }, (_, j) => [i + 1, j + 1]);
	}).flat();

	return (
		<div className="w-full h-full flex items-center justify-center bg-background dark p-6">
			<Grid
				className="w-full aspect-[1.5/1] relative"
				rows={gridHeight}
				cols={gridWidth}
				gap={{ x: 1, y: 1.5 }}
				animations={{
					1: {
						duration: 1,
						0: {
							1: { width: 4, height: 3 },
						},
						1: {
							1: { width: 4, height: 4 },
						},
						2: {
							1: { width: 4, height: 5 },
						},
					},
					2: {
						duration: 1,
						0: {
							2: { width: 4, height: 3 },
						},
					},
				}}
			>
				<Container
					rowStart={2}
					colStart={2}
					rowSpan={2}
					colSpan={4}
					index={1}
				></Container>

				<Container
					rowStart={2}
					colStart={6}
					rowSpan={1}
					colSpan={2}
					index={2}
				></Container>

				<Container
					rowStart={3}
					colStart={6}
					rowSpan={1}
					colSpan={3}
					index={3}
				></Container>

				<Container
					rowStart={2}
					colStart={8}
					rowSpan={1}
					colSpan={1}
					index={4}
				></Container>

				<Container
					rowStart={2}
					colStart={9}
					rowSpan={1}
					colSpan={1}
					index={5}
				></Container>

				<Container
					rowStart={3}
					colStart={9}
					rowSpan={1}
					colSpan={1}
					index={6}
				></Container>

				<Container
					rowStart={2}
					colStart={10}
					rowSpan={2}
					colSpan={2}
					index={8}
				></Container>
			</Grid>
		</div>
	);
}

function Grid({
	rows,
	cols,
	gap,
	animations,
	className,
	children,
}: {
	rows: number;
	cols: number;
	gap: { x: number; y: number };
	animations?: {
		[active: number]: {
			[time: number]: {
				[node: number]: {
					col?: number;
					row?: number;
					width?: number;
					height?: number;
				};
			};
			duration: number;
		};
	};
	className: string;
	children: React.ReactNode;
}) {
	const [focused, setFocused] = useState(0);
	const [requestedFocus, setRequestedFocus] = useState(focused);
	const [curStep, setCurStep] = useState(0);

	const curAnimation = animations?.[focused];

	const animationDuration = curAnimation?.duration ?? 0.2;

	if (curStep === 0 && focused !== requestedFocus) {
		setTimeout(() => {
			setFocused(requestedFocus);
		}, animationDuration * 1000);
	}

	console.log(focused)

	const firstClose = useRef(true);

	useEffect(() => {
		if (requestedFocus === focused) {
			firstClose.current = true; // Reset for next close
			if (!curAnimation) return;
			if (curStep >= Object.keys(curAnimation).length - 2) return;

			const timeout = setTimeout(() => {
				setCurStep(curStep + 1);
			}, animationDuration * 1000);

			return () => clearTimeout(timeout);
		} else {
			if (!curAnimation) return;
			if (curStep <= 0) return;

			if (firstClose.current) {
				setCurStep(curStep - 1);
				firstClose.current = false;
				return;
			}

			const timeout = setTimeout(() => {
				setCurStep(curStep - 1);
			}, animationDuration * 1000);

			return () => clearTimeout(timeout);
		}
	}, [curStep, focused, requestedFocus, animationDuration, curAnimation]);

	return (
		<div className={cn(className, "relative")}>
			{React.Children.map(children, (child) => {
				if (React.isValidElement<ExternalContainerProps>(child)) {
					return React.cloneElement(child, {
						...child.props,
						// @ts-ignore cellDim is used internally by the container
						cellDim: {
							rows: rows,
							cols: cols,
							h: (100 - (rows - 1) * gap.y) / rows,
							w: (100 - (cols - 1) * gap.x) / cols,
							gap: { x: gap.x, y: gap.y },
						},
						focus: focused,
						setFocused: setRequestedFocus,
						colStart:
							curAnimation &&
							curAnimation[curStep] &&
							curAnimation[curStep][child.props.index]
								? curAnimation[curStep][child.props.index]
										.col ?? child.props.colStart
								: child.props.colStart,
						rowStart:
							curAnimation &&
							curAnimation[curStep] &&
							curAnimation[curStep][child.props.index]
								? curAnimation[curStep][child.props.index]
										.row ?? child.props.rowStart
								: child.props.rowStart,
						colSpan:
							curAnimation &&
							curAnimation[curStep] &&
							curAnimation[curStep][child.props.index]
								? curAnimation[curStep][child.props.index]
										.width ?? child.props.colSpan
								: child.props.colSpan,
						rowSpan:
							curAnimation &&
							curAnimation[curStep] &&
							curAnimation[curStep][child.props.index]
								? curAnimation[curStep][child.props.index]
										.height ?? child.props.rowSpan
								: child.props.rowSpan,
						animationDuration: animationDuration,
					});
				}
				return null;
			})}
		</div>
	);
}
