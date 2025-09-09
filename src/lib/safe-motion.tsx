import React from 'react';

// Safe, no-op motion shim to allow the app to render without framer-motion
// Exports a "motion" object with intrinsic elements that ignore animation props
// and an AnimatePresence that simply renders children.

export type MotionProps = any;

type AnyProps = Record<string, unknown> & { children?: React.ReactNode };

function createNoopComponent(tag: string) {
	const Component = React.forwardRef<unknown, AnyProps>((props, ref) => {
		// Strip out common motion props to avoid React DOM warnings
		const {
			initial: _initial,
			animate: _animate,
			exit: _exit,
			whileHover: _whileHover,
			whileTap: _whileTap,
			transition: _transition,
			layoutId: _layoutId,
			...rest
		} = props as AnyProps;
		return React.createElement(tag as any, { ...rest, ref } as any);
	});
	Component.displayName = `motion.${tag}`;
	return Component;
}

export const motion: Record<string, React.ComponentType<any>> = new Proxy({}, {
	get: (_target, key) => {
		const tag = String(key);
		return createNoopComponent(tag);
	}
}) as any;

export const AnimatePresence: React.FC<{ children?: React.ReactNode } & AnyProps> = ({ children }) => {
	return <>{children}</>;
};

