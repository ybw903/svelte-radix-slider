import { onDestroy, onMount } from 'svelte'
import { writable } from 'svelte/store'

export const elementSize = (element: HTMLElement) => {
  let ro: ResizeObserver | undefined
  const { subscribe, set } = writable<{ width: number; height: number } | undefined>(undefined)

  onMount(() => {
    if (element) {
      ro = new ResizeObserver((entries) => {
        if (!Array.isArray(entries)) {
          return
        }
        if (!entries.length) {
          return
        }
        const entry = entries[0]!
        let width: number
        let height: number

        if ('borderBoxSize' in entry) {
          const borderSizeEntry = entry['borderBoxSize']
          const borderSize = Array.isArray(borderSizeEntry) ? borderSizeEntry[0] : borderSizeEntry
          width = borderSize['inlineSize']
          height = borderSize['blockSize']
        } else {
          width = element.offsetWidth
          height = element.offsetHeight
        }

        set({ width, height })
      })
      ro.observe(element, { box: 'border-box' })
    } else {
      set(undefined)
    }
  })

  onDestroy(() => {
    if (ro) {
      ro.unobserve(element)
      ro = undefined
    }
  })

  return {
    subscribe
  }
}
