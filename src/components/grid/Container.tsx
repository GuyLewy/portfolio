import React, {
    useEffect,
	useReducer,
	type Dispatch,
	type ReactNode,
	type SetStateAction,
} from "react";
import cn from "../../utils/cn";

export type ExternalContainerProps = {
	rowStart: number;
	colStart: number;
	rowSpan: number;
	colSpan: number;
	className?: string;
	index: number;
	children?: ReactNode;
};

export type ContainerProps = ExternalContainerProps & {
	cellDim: {
		h: number;
		w: number;
		gap: { x: number; y: number };
		cols: number;
		rows: number;
	};
    focus: number;
	animationDuration: number;
	setFocused?: Dispatch<SetStateAction<number>>;
};

function ContainerComponent({
	cellDim,
	rowStart,
	colStart,
	rowSpan,
	colSpan,
	index,
	focus,
	setFocused,
	className,
	animationDuration,
	children,
}: ContainerProps) {
	const isFocused = focus === index;

	if (!cellDim) {
		console.error(
			"Container requires cellDim to be provided by Grid component"
		);
		return null;
	}

	function movePosition(
		position: { row: number; col: number },
		move:
			| { set: { row: number; col: number } | "reset"; dir?: never }
			| { set?: never; dir: "l" | "r" | "u" | "d" }
	) {
		if (move.set) {
			if (move.set === "reset") {
				return { row: rowStart, col: colStart };
			}

			return {
				row: Math.max(move.set.row, 1),
				col: Math.max(move.set.col, 1),
			};
		}

		switch (move.dir) {
			case "r":
				position.col++;
				break;
			case "l":
				position.col--;
				break;
			case "u":
				position.row++;
				break;
			case "d":
				position.row--;
				break;
		}

		position.row = Math.max(position.row, 1);
		position.col = Math.max(position.col, 1);

		return position;
	}

	const xPos = `${(colStart - 1) * (cellDim.w + cellDim.gap.x)}%`;
	const yPos = `${(rowStart - 1) * (cellDim.h + cellDim.gap.y)}%`;
	const width = `${
		colSpan * cellDim.w + cellDim.gap.x * (colSpan - 1)
	}%`;
	const height = `${
		rowSpan * cellDim.h + cellDim.gap.y * (rowSpan - 1)
	}%`;

	return (
		<div
			className={cn(
				"bg-foreground absolute transition-[top_left_width_height]",
				`duration-[${animationDuration}s]`,
				className || ""
			)}
			style={{
				left: xPos,
				top: yPos,
				width: width,
				height: height,
				transitionDuration: `${animationDuration}s`,
			}}
			onClick={() => {
				
				setFocused?.(isFocused ? 0 : index);
			}}
		>
			{children}
		</div>
	);
}

const Container = ContainerComponent as React.FC<ExternalContainerProps>;
export default Container;
