<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'

  import { getCtx } from './ctx.js'

  type $$Props = HTMLAttributes<HTMLSpanElement>
  const {
    options: { disabled, orientation }
  } = getCtx()
</script>

<span data-disabled={$disabled ? '' : undefined} data-orientation={$orientation} {...$$restProps}>
  <slot />
</span>
