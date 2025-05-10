import React, { useState } from "react";
import cn from "../../utils/cn";
import Container, { type ExternalContainerProps } from "./Container";

export default function Main() {
	const [focused, setFocused] = useState(0);

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
				gap={{x: 1, y: 1.5}}
			>
				{/* {gridPositions.map((position, idx) => {
					return (
						<Container
							key={`grid-${position[0]}-${position[1]}`}
							rowStart={position[0]}
							colStart={position[1]}
							rowSpan={1}
							colSpan={1}
							index={idx + 1}
							focus={focused}
							setFocused={setFocused}
						></Container>
					);
				})} */}

						<Container
							rowStart={2}
							colStart={2}
							rowSpan={2}
							colSpan={4}
							index={1}
							focus={focused}
							setFocused={setFocused}
						></Container>

						<Container
							rowStart={2}
							colStart={6}
							rowSpan={1}
							colSpan={2}
							index={2}
							focus={focused}
							setFocused={setFocused}
						></Container>

						<Container
							rowStart={3}
							colStart={6}
							rowSpan={1}
							colSpan={3}
							index={2}
							focus={focused}
							setFocused={setFocused}
						></Container>

						<Container
							rowStart={2}
							colStart={8}
							rowSpan={1}
							colSpan={1}
							index={2}
							focus={focused}
							setFocused={setFocused}
						></Container>

						<Container
							rowStart={2}
							colStart={9}
							rowSpan={1}
							colSpan={1}
							index={2}
							focus={focused}
							setFocused={setFocused}
						></Container>

						<Container
							rowStart={3}
							colStart={9}
							rowSpan={1}
							colSpan={1}
							index={2}
							focus={focused}
							setFocused={setFocused}
						></Container>

						<Container
							rowStart={2}
							colStart={6}
							rowSpan={1}
							colSpan={2}
							index={2}
							focus={focused}
							setFocused={setFocused}
						></Container>

						<Container
							rowStart={2}
							colStart={10}
							rowSpan={2}
							colSpan={2}
							bigColSpan={3}
							bigRowSpan={3}
							bigColStart={9}
							index={3}
							focus={focused}
							setFocused={setFocused}
						></Container>

				{/* <Container rowStart={3}
							colStart={1}
							rowSpan={2}
							colSpan={6}
							index={100}
							focus={focused}
							setFocused={setFocused}>

				</Container> */}
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
	gap: {x: number; y: number};
	animations?: {
		active: {
			node: number;
			direction: "l" | "r" | "u" | "d";
			spaces: number;
			time: number;
			delay: number;
		};
	};
	className: string;
	children: React.ReactNode;
}) {
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
					});
				}
				return null;
			})}
		</div>
	);
}
