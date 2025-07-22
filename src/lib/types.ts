import type { AriaAttributes, HTMLAttributes } from 'svelte/elements'

type Direction = 'ltr' | 'rtl'

export interface SliderProps {
  name?: string
  disabled?: boolean
  orientation?: AriaAttributes['aria-orientation']
  dir?: Direction
  min?: number
  max?: number
  step?: number
  minStepsBetweenThumbs?: number
  value?: number[]
  onValueChange?(value: number[]): void
  onValueCommit?(value: number[]): void
  inverted?: boolean
}

export type SliderOrientationProps = {
  min: number
  max: number
  inverted: boolean
  onSlideStart?(value: number): void
  onSlideMove?(value: number): void
  onSlideEnd?(): void
  onHomeKeyDown(event: KeyboardEvent): void
  onEndKeyDown(event: KeyboardEvent): void
  onStepKeyDown(step: { event: KeyboardEvent; direction: number }): void
}

export type SliderImplProps = {
  onSlideStart(event: PointerEvent): void
  onSlideMove(event: PointerEvent): void
  onSlideEnd(event: PointerEvent): void
  onHomeKeyDown(event: KeyboardEvent): void
  onEndKeyDown(event: KeyboardEvent): void
  onStepKeyDown(event: KeyboardEvent): void
}
