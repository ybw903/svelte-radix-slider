<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'

  import { getCtx } from './ctx.js'

  type $$Props = HTMLAttributes<HTMLSpanElement>
  const ctx = getCtx()
</script>

<span
  data-disabled={ctx.disabled ? '' : undefined}
  data-orientation={ctx.orientation}
  {...$$restProps}>
  <slot />
</span>
