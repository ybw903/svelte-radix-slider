import { getContext, setContext } from 'svelte';
import type { AriaAttributes } from 'svelte/elements';
import { writable } from 'svelte/store';
import { isFunction, omit } from './helpers.js';

const SLIDER_ROOT = Symbol('SLIDER_ROOT');

interface SliderRootProps {
	disabled?: boolean | undefined;
	min?: number;
	max?: number;
	valueIndexToChange?: number;
	thumbs?: Set<HTMLSpanElement>;
	value?: number[];
	orientation?: AriaAttributes['aria-orientation'];
	form?: string | undefined;

	onValueChange?(value: number[]): void;
}

const omittedOptions = ['value', 'onValueChange'] as const;

export function setCtx(props: SliderRootProps = {}) {
	const sliderImplRef = writable<HTMLSpanElement | undefined>(undefined);
	const values = writable(props.value ?? []);

	function setValues(nextValue: (...args: any[]) => any | number[]) {
		if (isFunction(nextValue)) {
			values.update((prev) => {
				const next = nextValue(prev);
				if (props.onValueChange) {
					props.onValueChange(next);
				}
				return next;
			});
		} else {
			values.set(nextValue);
			if (props.onValueChange) {
				props.onValueChange(nextValue);
			}
		}
	}

	setContext(SLIDER_ROOT, { ...props, values, refs: { sliderImplRef } });

	return {
		...omit({ ...props }, ...omittedOptions),
		values,
		methods: {
			setValues
		},
		refs: {
			sliderImplRef
		}
	};
}

export function getCtx() {
	return getContext<ReturnType<typeof setCtx>>(SLIDER_ROOT);
}

const SLIDER_ORIENTATION = Symbol('SLIDER_ORIENTATION');

type Side = 'top' | 'right' | 'bottom' | 'left';

export function setOrientationCtx(props: {
	startEdge: Side;
	endEdge: Side;
	size: 'width' | 'height';
	direction: number;
}) {
	setContext(SLIDER_ORIENTATION, { ...props });
	return {
		...props
	};
}

export function getOrientationCtx() {
	return getContext<ReturnType<typeof setOrientationCtx>>(SLIDER_ORIENTATION);
}
