<script lang="ts">
  import { onDestroy, onMount } from 'svelte'

  import { getCtx, getOrientationCtx } from './ctx.js'
  import { elementSize } from './element-size.js'
  import { convertValueToPercentage, linearScale, styleToString } from './helpers.js'

  const {
    options: { min, max, orientation, disabled, values },
    thumbs
  } = getCtx()
  let { valueIndexToChange } = getCtx()
  const orientationCtx = getOrientationCtx()

  let thumbRef: HTMLSpanElement
  const index = 0

  $: value = $values?.[index] as number | undefined
  $: percent = value === undefined ? 0 : convertValueToPercentage(value, $min, $max)
  $: label = getLabel(index, $values?.length ?? 0)

  let size
  const { subscribe: elementSubScribe } = elementSize(thumbRef!)
  const elementUnsubscribe = elementSubScribe((currentSize) => {
    if (currentSize) {
      size = {
        width: currentSize?.width,
        height: currentSize?.height
      }
    }
  })

  let orientationSize = size?.[orientationCtx.size]
  let thumbInBoundsOffset = orientationSize
    ? getThumbInBoundsOffset(orientationSize, percent, orientationCtx.direction)
    : 0

  function getThumbInBoundsOffset(width: number, left: number, direction: number) {
    const halfWidth = width / 2
    const halfPercent = 50
    const offset = linearScale([0, halfPercent], [0, halfWidth])
    return (halfWidth - offset(left) * direction) * direction
  }

  function getLabel(index: number, totalValues: number) {
    if (totalValues > 2) {
      return `Value ${index + 1} of ${totalValues}`
    } else if (totalValues === 2) {
      return ['Minimum', 'Maximum'][index]
    } else {
      return undefined
    }
  }

  $: style =
    ($$props.style ?? '') +
    styleToString({
      transform: `-50%`,
      position: 'absolute',
      [orientationCtx.startEdge]: `calc(${percent}% + ${thumbInBoundsOffset}px)`
    })

  onMount(() => {
    if (thumbRef) {
      thumbs?.add(thumbRef)
    }
  })

  onDestroy(() => {
    elementUnsubscribe()
    thumbs?.delete(thumbRef)
  })
</script>

<span
  {style}
  role="slider"
  aria-label={$$props['aria-label'] || label}
  aria-valuemin={$min}
  aria-valuenow={value}
  aria-valuemax={$max}
  aria-orientation={$orientation}
  data-orientation={orientation}
  data-disabled={disabled ? '' : undefined}
  tabIndex={disabled ? undefined : 0}
  {...$$restProps}
  bind:this={thumbRef}
  on:focus={(event) => {
    if ($$props.onFocus) {
      $$props.onfocus(event)
    }
    valueIndexToChange = index
  }}></span>
