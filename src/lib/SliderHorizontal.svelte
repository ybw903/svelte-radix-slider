<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import SliderImpl from './SliderImpl.svelte'

  import { getCtx, setOrientationCtx } from './ctx.js'
  import { linearScale } from './helpers.js'
  import { BACK_KEYS } from './constants.js'
  import type { SliderOrientationProps } from './types.js'

  type $$Props = SliderOrientationProps & { dir?: 'ltr' | 'rtl' } & HTMLAttributes<HTMLSpanElement>

  export let min: $$Props['min']
  export let max: $$Props['max']
  export let dir: $$Props['dir'] = 'ltr'
  export let inverted: $$Props['inverted']
  export let onSlideStart: $$Props['onSlideStart'] = () => {}
  export let onSlideMove: $$Props['onSlideMove'] = () => {}
  export let onSlideEnd: $$Props['onSlideEnd'] = () => {}
  export let onStepKeyDown: $$Props['onStepKeyDown']

  let rectRef: DOMRect | undefined

  const isDirectionLTR = dir === 'ltr'
  const isSlidingFromLeft = (isDirectionLTR && !inverted) || (!isDirectionLTR && inverted)

  const {
    refs: { sliderImplRef }
  } = getCtx()

  setOrientationCtx({
    startEdge: isSlidingFromLeft ? 'left' : 'right',
    endEdge: isSlidingFromLeft ? 'right' : 'left',
    size: 'width',
    direction: isSlidingFromLeft ? 1 : -1
  })

  function getValueFromPointer(pointerPosition: number) {
    const rect = rectRef || $sliderImplRef!.getBoundingClientRect()
    const input: [number, number] = [0, rect.width]
    const output: [number, number] = isSlidingFromLeft ? [min, max] : [max, min]
    const value = linearScale(input, output)

    rectRef = rect
    return value(pointerPosition - rect.left)
  }
</script>

<SliderImpl
  {dir}
  data-orientation="horizontal"
  onSlideStart={(evt) => {
    const value = getValueFromPointer(evt.clientX)
    onSlideStart?.(value)
  }}
  onSlideMove={(evt) => {
    const value = getValueFromPointer(evt.clientX)
    onSlideMove?.(value)
  }}
  onSlideEnd={() => {
    rectRef = undefined
    onSlideEnd?.()
  }}
  onStepKeyDown={(evt) => {
    const slideDirection = isSlidingFromLeft ? 'from-left' : 'from-right'
    const isBackKey = BACK_KEYS[slideDirection].includes(evt.key)
    onStepKeyDown?.({ event: evt, direction: isBackKey ? -1 : 1 })
  }}
  onHomeKeyDown={$$props.onHomeKeyDown}
  onEndKeyDown={$$props.onEndKeyDown}
  {...$$restProps}>
  <slot />
</SliderImpl>
