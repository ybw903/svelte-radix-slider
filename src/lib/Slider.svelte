<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import SliderHorizontal from './SliderHorizontal.svelte'
  import SliderVertical from './SliderVertical.svelte'

  import { setCtx } from './ctx.js'
  import { ARROW_KEYS, PAGE_KEYS } from './constants.js'
  import type { SliderProps } from './types.js'

  type $$Props = SliderProps & HTMLAttributes<HTMLSpanElement>

  export let min: number = 0
  export let max: number = 100
  export let step: number = 1
  export let orientation: $$Props['orientation'] = 'horizontal'
  export let disabled: $$Props['disabled'] = false
  export let minStepsBetweenThumbs: $$Props['minStepsBetweenThumbs'] = 0
  export let value: $$Props['value'] = undefined
  export let onValueChange: $$Props['onValueChange'] = () => {}
  export let onValueCommit: $$Props['onValueCommit'] = () => {}
  export let inverted: boolean = false

  const thumbRefs = new Set<HTMLSpanElement>()
  let valueIndexToChange = 0
  const isHorizontal = orientation === 'horizontal'
  const SliderOrientation = isHorizontal ? SliderHorizontal : SliderVertical

  const {
    values,
    methods: { setValues }
  } = setCtx({
    disabled,
    min,
    max,
    valueIndexToChange,
    thumbs: thumbRefs,
    value,
    orientation,
    onValueChange
  })

  const valuesBeforeSlideStart = $values

  function handleSlideStart(value: number) {
    const closestIndex = getClosestValueIndex($values, value)
    updateValues(value, closestIndex)
  }

  function handleSlideMove(value: number) {
    updateValues(value, valueIndexToChange)
  }

  function handleSlideEnd() {
    const prevValue = valuesBeforeSlideStart[valueIndexToChange]
    const nextValue = $values[valueIndexToChange]
    const hasChanged = nextValue !== prevValue
    if (hasChanged) onValueCommit?.($values)
  }

  function updateValues(value: number, atIndex: number, { commit } = { commit: false }) {
    const decimalCount = getDecimalCount(step!)
    const snapToStep = roundValue(Math.round((value - min!) / step!) * step! + min!, decimalCount)
    const nextValue = clamp(snapToStep, [min!, max!])

    setValues((prevValues) => {
      const nextValues = getNextSortedValues(prevValues, nextValue, atIndex)
      if (hasMinStepsBetweenValues(nextValues, minStepsBetweenThumbs! * step!)) {
        valueIndexToChange = nextValues.indexOf(nextValue)
        const hasChanged = String(nextValues) !== String(prevValues)
        if (hasChanged && commit) onValueCommit?.(nextValues)

        return hasChanged ? nextValues : prevValues
      } else {
        return prevValues
      }
    })
  }

  function getDecimalCount(value: number) {
    return (String(value).split('.')[1] || '').length
  }

  function roundValue(value: number, decimalCount: number) {
    const rounder = Math.pow(10, decimalCount)
    return Math.round(value * rounder) / rounder
  }

  function clamp(value: number, [min, max]: [number, number]): number {
    return Math.min(max, Math.max(min, value))
  }

  function getNextSortedValues(prevValues: number[] = [], nextValue: number, atIndex: number) {
    const nextValues = [...prevValues]
    nextValues[atIndex] = nextValue
    return nextValues.sort((a, b) => a - b)
  }

  function getClosestValueIndex(values: number[], nextValue: number) {
    if (values.length === 1) return 0
    const distances = values.map((value) => Math.abs(value - nextValue))
    const closestDistance = Math.min(...distances)
    return distances.indexOf(closestDistance)
  }

  function getStepsBetweenValues(values: number[]) {
    return values.slice(0, -1).map((value, index) => values[index + 1]! - value)
  }

  function hasMinStepsBetweenValues(values: number[], minStepsBetweenValues: number) {
    if (minStepsBetweenValues > 0) {
      const stepsBetweenValues = getStepsBetweenValues(values)
      const actualMinStepsBetweenValues = Math.min(...stepsBetweenValues)
      return actualMinStepsBetweenValues >= minStepsBetweenValues
    }
    return true
  }
</script>

<svelte:component
  this={SliderOrientation}
  aria-disabled={disabled}
  data-disabled={disabled ? '' : undefined}
  {...$$restProps}
  {min}
  {max}
  {inverted}
  onSlideStart={disabled ? undefined : handleSlideStart}
  onSlideMove={disabled ? undefined : handleSlideMove}
  onSlideEnd={disabled ? undefined : handleSlideEnd}
  onHomeKeyDown={() => !disabled && updateValues(min, 0, { commit: true })}
  onEndKeyDown={() => !disabled && updateValues(max, $values.length - 1, { commit: true })}
  onStepKeyDown={({ event, direction: stepDirection }) => {
    if (!disabled) {
      const isPageKey = PAGE_KEYS.includes(event.key)
      const isSkipKey = isPageKey || (event.shiftKey && ARROW_KEYS.includes(event.key))
      const multiplier = isSkipKey ? 10 : 1
      const atIndex = valueIndexToChange
      const value = $values[atIndex]
      const stepInDirection = step * multiplier * stepDirection
      updateValues(value + stepInDirection, atIndex, { commit: true })
    }
  }}>
  <slot />
</svelte:component>
