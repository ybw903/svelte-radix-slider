<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import SliderImpl from './SliderImpl.svelte'

  import { getCtx, setOrientationCtx } from './ctx.js'
  import { linearScale } from './helpers.js'
  import { BACK_KEYS } from './constants.js'
  import type { SliderOrientationProps } from './types.js'

  type $$Props = SliderOrientationProps & HTMLAttributes<HTMLSpanElement>

  export let min: $$Props['min']
  export let max: $$Props['max']
  export let inverted: $$Props['inverted']
  export let onSlideStart: $$Props['onSlideStart'] = () => {}
  export let onSlideMove: $$Props['onSlideMove'] = () => {}
  export let onSlideEnd: $$Props['onSlideEnd'] = () => {}
  export let onStepKeyDown: $$Props['onStepKeyDown']

  let rectRef: DOMRect | undefined

  const isSlidingFromBottom = !inverted

  const {
    refs: { sliderImplRef }
  } = getCtx()

  setOrientationCtx({
    startEdge: isSlidingFromBottom ? 'bottom' : 'top',
    endEdge: isSlidingFromBottom ? 'top' : 'bottom',
    size: 'height',
    direction: isSlidingFromBottom ? 1 : -1
  })

  function getValueFromPointer(pointerPosition: number) {
    const rect = rectRef || $sliderImplRef!.getBoundingClientRect()
    const input: [number, number] = [0, rect.height]
    const output: [number, number] = isSlidingFromBottom ? [max, min] : [min, max]
    const value = linearScale(input, output)

    rectRef = rect
    return value(pointerPosition - rect.top)
  }
</script>

<SliderImpl
  data-orientation="vertical"
  onSlideStart={(event) => {
    const value = getValueFromPointer(event.clientY)
    onSlideStart?.(value)
  }}
  onSlideMove={(event) => {
    const value = getValueFromPointer(event.clientY)
    onSlideMove?.(value)
  }}
  onSlideEnd={() => {
    rectRef = undefined
    onSlideEnd?.()
  }}
  onStepKeyDown={(event) => {
    const slideDirection = isSlidingFromBottom ? 'from-bottom' : 'from-top'
    const isBackKey = BACK_KEYS[slideDirection].includes(event.key)
    onStepKeyDown?.({ event, direction: isBackKey ? -1 : 1 })
  }}
  onHomeKeyDown={$$props.onHomeKeyDown}
  onEndKeyDown={$$props.onEndKeyDown}
  {...$$restProps}>
  <slot />
</SliderImpl>
