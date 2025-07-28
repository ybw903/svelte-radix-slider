import { getContext, setContext } from 'svelte'
import type { AriaAttributes } from 'svelte/elements'
import { writable, type Readable } from 'svelte/store'
import { isFunction, omit } from './helpers.js'

const SLIDER_ROOT = Symbol('SLIDER_ROOT')

type StoresValues<T> =
  T extends Readable<infer U> ? U : { [K in keyof T]: T[K] extends Readable<infer U> ? U : never }

interface SliderRootProps {
  disabled?: boolean | undefined
  min?: number
  max?: number
  valueIndexToChange?: number
  thumbs?: Set<HTMLSpanElement>
  value?: number[]
  orientation?: AriaAttributes['aria-orientation']
  form?: string | undefined

  onValueChange?(value: number[]): void
}

const omittedOptions = ['value', 'onValueChange', 'min', 'max', 'orientation', 'disabled'] as const

export function setCtx(props: SliderRootProps = {}) {
  const sliderImplRef = writable<HTMLSpanElement | undefined>(undefined)

  const values = writable(props.value ?? [])
  const min = writable(props.min)
  const max = writable(props.max)
  const orientation = writable(props.orientation)
  const disabled = writable(props.disabled)

  function setValues(nextValue: (...args: any[]) => any | number[]) {
    if (isFunction(nextValue)) {
      values.update((prev) => {
        const next = nextValue(prev)
        if (props.onValueChange) {
          props.onValueChange(next)
        }
        return next
      })
    } else {
      values.set(nextValue)
      if (props.onValueChange) {
        props.onValueChange(nextValue)
      }
    }
  }

  const options = {
    values,
    min,
    max,
    orientation,
    disabled
  }

  function updateOption<K extends keyof typeof options>(
    key: K,
    value: StoresValues<(typeof options)[K]>
  ) {
    if (!value) return
    options[key].set(value as never)
  }

  setContext(SLIDER_ROOT, {
    ...omit({ ...props }, ...omittedOptions),
    refs: { sliderImplRef },
    options,
    updateOption
  })

  return {
    ...omit({ ...props }, ...omittedOptions),
    methods: {
      setValues
    },
    refs: {
      sliderImplRef
    },
    options,
    updateOption
  }
}

export function getCtx() {
  return getContext<ReturnType<typeof setCtx>>(SLIDER_ROOT)
}

const SLIDER_ORIENTATION = Symbol('SLIDER_ORIENTATION')

type Side = 'top' | 'right' | 'bottom' | 'left'

export function setOrientationCtx(props: {
  startEdge: Side
  endEdge: Side
  size: 'width' | 'height'
  direction: number
}) {
  setContext(SLIDER_ORIENTATION, { ...props })
  return {
    ...props
  }
}

export function getOrientationCtx() {
  return getContext<ReturnType<typeof setOrientationCtx>>(SLIDER_ORIENTATION)
}
