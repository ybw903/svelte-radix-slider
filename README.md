# svelte-radix-slider

A Svelte port of the accessible and unstyled [Radix UI Slider](https://www.radix-ui.com/primitives/docs/components/slider) component.  
Build performant and accessible sliders with full styling control in Svelte.

![npm](https://img.shields.io/npm/v/svelte-radix-slider?color=%23007acc)
![License](https://img.shields.io/github/license/ybw903/svelte-radix-slider)
![CI](https://img.shields.io/github/actions/workflow/status/ybw903/svelte-radix-slider/ci.yml)

---

## ✨ Features

- ✅ Fully accessible (ARIA compliant)
- 🎯 Precise keyboard and pointer interaction
- 🧩 Supports single & multi-thumb sliders
- 🎨 Unstyled — bring your own styles
- 💡 Built with Svelte and idiomatic component API

---

## 🚀 Installation

```bash
npm install svelte-radix-slider
# or
pnpm add svelte-radix-slider
```

## 🧱 Usage

```svelte
<script>
  import { SliderRoot, SliderTrack, SliderRange, SliderThumb } from 'svelte-radix-slider'

  let value = [50]
</script>

<SliderRoot
  {value}
  onValueChange={(next) => {
    value = next
  }}
  min={0}
  max={100}
  step={1}
  class="slider-root">
  <SliderTrack class="slider-track">
    <SliderRange class="slider-range" />
  </SliderTrack>
  <SliderThumb class="slider-thumb" />
</SliderRoot>

<style>
  .slider-root {
    position: relative;
    display: flex;
    align-items: center;
    user-select: none;
    touch-action: none;
    width: 200px;
    height: 20px;
  }

  .slider-track {
    background-color: #000c;
    position: relative;
    flex-grow: 1;
    border-radius: 9999px;
    height: 3px;
  }

  .slider-range {
    position: absolute;
    background-color: white;
    border-radius: 9999px;
    height: 100%;
  }

  .slider-thumb {
    display: block;
    width: 20px;
    height: 20px;
    background-color: white;
    box-shadow: 0 2px 10px #00000080;
    border-radius: 10px;
  }
  .slider-thumb:hover {
    background-color: #f4f0fe;
  }
  .slider-thumb:focus {
    outline: none;
    box-shadow: 0 0 0 5px #0009;
  }
</style>
```

> 💡 Style the component using any CSS solution (Tailwind, SCSS, or plain CSS).

📦 Components
| Component | Description |
| ------------- | ---------------------------------- |
| `SliderRoot` | Root container (holds value state) |
| `SliderTrack` | Track area representing full range |
| `SliderRange` | Filled range (between thumbs) |
| `SliderThumb` | Draggable control |

## 📚 Props

`<SliderRoot />`

| Prop                     | Type                         | Default        | Description                                                            |
| ------------------------ | ---------------------------- | -------------- | ---------------------------------------------------------------------- |
| `value`                  | `number[]`                   | `[]`           | Bound value. Supports single and multi-thumb sliders.                  |
| `min`                    | `number`                     | `0`            | Minimum value                                                          |
| `max`                    | `number`                     | `100`          | Maximum value                                                          |
| `step`                   | `number`                     | `1`            | Step size                                                              |
| `disabled`               | `boolean`                    | `false`        | Whether the slider is disabled                                         |
| `orientation`            | `'horizontal' \| 'vertical'` | `'horizontal'` | Orientation of the slider.                                             |
| `inverted`               | `boolean`                    | `false`        | If true, inverts the direction (e.g., right-to-left or bottom-to-top). |
| `onValueChange`          | `(value: number[]) => void`  | —              | Callback fired when value changes during interaction.                  |
| `onValueCommit`          | `(value: number[]) => void`  | —              | Callback fired when value is committed (e.g., on pointer release).     |
| `thumbCollisionBehavior` | `'none' \| 'push'`           | `'none'`       | Controls thumb collision. `'push'` makes thumbs push each other.       |

## 🎁 To-do

- [ ] RTL support
- [ ] default value support

## 🤝 Contributing PRs are welcome!

If you’d like to contribute:

- Fork the repo
- Clone and pnpm install
- Run pnpm dev to start local development
- Open a PR 🚀

## 📄 License

MIT License © 2025 ybw903

## 🙌 Acknowledgements

This project
is heavily inspired by the excellent work on Radix UI.

Svelte version built with care to bring the same accessibility guarantees to the Svelte ecosystem.
