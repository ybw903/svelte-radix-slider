export function convertValueToPercentage(value: number, min: number, max: number) {
  const maxSteps = max - min
  const percentPerStep = 100 / maxSteps
  const percentage = percentPerStep * (value - min)
  return clamp(percentage, [0, 100])
}

export function clamp(value: number, [min, max]: [number, number]): number {
  return Math.min(max, Math.max(min, value))
}

export function linearScale(input: readonly [number, number], output: readonly [number, number]) {
  return (value: number) => {
    if (input[0] === input[1] || output[0] === output[1]) return output[0]
    const ratio = (output[1] - output[0]) / (input[1] - input[0])
    return output[0] + ratio * (value - input[0])
  }
}

export function composeEventHandlers<E extends { defaultPrevented: boolean }>(
  originalEventHandler?: (event: E) => void,
  ourEventHandler?: (event: E) => void,
  { checkForDefaultPrevented = true } = {}
) {
  return function handleEvent(event: E) {
    originalEventHandler?.(event)

    if (checkForDefaultPrevented === false || !event.defaultPrevented) {
      return ourEventHandler?.(event)
    }
  }
}

export type ValueOf<T> = T[keyof T]

export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Omit<T, K> {
  const result = {} as Omit<T, K>
  for (const key of Object.keys(obj)) {
    if (!keys.includes(key as unknown as K)) {
      result[key as keyof Omit<T, K>] = obj[key] as ValueOf<Omit<T, K>>
    }
  }
  return result
}

export function isFunction(value: unknown): value is (...args: any[]) => any {
  return typeof value === 'function'
}

export function styleToString(style: Record<string, number | string | undefined>): string {
  return Object.keys(style).reduce((str, key) => {
    if (style[key] === undefined) return str
    return str + `${key}:${style[key]};`
  }, '')
}
