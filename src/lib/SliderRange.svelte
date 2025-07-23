<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import { getCtx, getOrientationCtx } from './ctx.js'
  import { convertValueToPercentage, styleToString } from './helpers.js'

  type $$Props = HTMLAttributes<HTMLSpanElement>
  const {
    options: { min, max, orientation, disabled, values }
  } = getCtx()
  const orientationCtx = getOrientationCtx()

  $: valuesCount = $values?.length ?? 0
  $: percentages = $values?.map((value) => convertValueToPercentage(value, $min!, $max!)) ?? []

  $: offsetStart = valuesCount > 1 ? Math.min(...percentages) : 0
  $: offsetEnd = 100 - Math.max(...percentages)

  $: style =
    ($$props.style ?? '') +
    styleToString({
      [orientationCtx.startEdge]: offsetStart + '%',
      [orientationCtx.endEdge]: offsetEnd + '%'
    })
</script>

<span
  {style}
  data-orientation={$orientation}
  data-disabled={$disabled ? '' : undefined}
  {...$$restProps}>
</span>
