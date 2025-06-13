import React, {
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
