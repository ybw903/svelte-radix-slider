<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'

  import { getCtx } from './ctx.js'
  import { composeEventHandlers } from './helpers.js'
  import { ARROW_KEYS, PAGE_KEYS } from './constants.js'
  import type { SliderImplProps } from './types.js'

  type $$Props = SliderImplProps & HTMLAttributes<HTMLSpanElement>

  const {
    thumbs,
    refs: { sliderImplRef }
  } = getCtx()

  export let onSlideStart
  export let onSlideMove
  export let onSlideEnd
  export let onHomeKeyDown
  export let onEndKeyDown
  export let onStepKeyDown
</script>

<span
  bind:this={$sliderImplRef}
  on:keydown={composeEventHandlers($$props.onkeydown, (event) => {
    if (event.key === 'Home') {
      onHomeKeyDown(event)
      event.preventDefault()
    } else if (event.key === 'End') {
      onEndKeyDown(event)
      event.preventDefault()
    } else if (PAGE_KEYS.concat(ARROW_KEYS).includes(event.key)) {
      onStepKeyDown(event)
      event.preventDefault()
    }
  })}
  on:pointerdown={composeEventHandlers($$props.onpointerdown, (event) => {
    const target = event.currentTarget
    target.setPointerCapture(event.pointerId)
    event.preventDefault()
    if (thumbs?.has(target)) {
      target.focus()
    } else {
      onSlideStart(event)
    }
  })}
  on:pointermove={composeEventHandlers($$props.onpointermove, (event) => {
    const target = event.currentTarget
    if (target.hasPointerCapture(event.pointerId)) onSlideMove(event)
  })}
  on:pointerup={composeEventHandlers($$props.onpointerup, (event) => {
    const target = event.currentTarget
    if (target.hasPointerCapture(event.pointerId)) {
      target.releasePointerCapture(event.pointerId)
      onSlideEnd(event)
    }
  })}
  {...$$restProps}>
  <slot />
</span>
