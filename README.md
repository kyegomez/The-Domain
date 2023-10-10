# The Domain: Harnessing Humanity's Collective Knowledge

![The Domain, an interface with all of Humanity's knowledge and wisdom](https://domain.apac.ai)

<p align="center">
  An avant-garde conversational interface bridging you with the sum of digital knowledge in the cosmos.
</p>

[![Follow kyegomez on Twitter](https://img.shields.io/twitter/follow/kyegomez?style=flat&label=kyegomez&logo=twitter&color=0bf&logoColor=fff)](https://twitter.com/kyegomez)
[![Star The Domain on GitHub](https://img.shields.io/github/stars/kyegomez/thedomain?label=steven-tey%2Fthedomain)](https://github.com/kyegomez/thedomain)

- [Introduction](#introduction)
- [Installation](#installation)
- [Features](#features)
- [Author](#author)
- [To Do](#to-do)

<br/>

## Introduction

The Domain embodies the frontier of digital communication: a hyper-intelligent conversational interface empowering seamless interaction with any digital data. It is an embodiment of our ever-pressing endeavor to push the boundaries, to foster innovation, and to shape the landscape of technology that better serves humanity.

## Installation

Setting up The Domain is easy and requires only a few steps. You can deploy it in any environment swiftly:

Deploy with Vercel

Alternatively, take the reins and clone & install The Domain locally using yarn:

```shell
# Clone the repository
git clone https://github.com/kyegomez/The-Domain.git

# Go to the domain directory
cd thedomain

# Install the dependencies
yarn install

# Build the project
yarn build

# Start the server
yarn run dev
```

## Tech Stack + Features

https://user-images.githubusercontent.com/28986134/212368288-12f41e37-aa8c-4e0a-a542-cf6d23410a65.mp4

### Frameworks

- [Next.js](https://nextjs.org/) – React framework for building performant apps with the best developer experience
- [Auth.js](https://authjs.dev/) – Handle user authentication with ease with providers like Google, Twitter, GitHub, etc.
- [Prisma](https://www.prisma.io/) – Typescript-first ORM for Node.js

### Platforms

- [Vercel](https://vercel.com/) – Easily preview & deploy changes with git
- [Railway](https://railway.app/) – Easily provision a PostgreSQL database (no login required)

### UI

- [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS framework for rapid UI development
- [Radix](https://www.radix-ui.com/) – Primitives like modal, popover, etc. to build a stellar user experience
- [Framer Motion](https://framer.com/motion) – Motion library for React to animate components with ease
- [Lucide](https://lucide.dev/) – Beautifully simple, pixel-perfect icons
- [`@next/font`](https://nextjs.org/docs/basic-features/font-optimization) – Optimize custom fonts and remove external network requests for improved performance
- [`@vercel/og`](https://vercel.com/docs/concepts/functions/edge-functions/og-image-generation) – Generate dynamic Open Graph images on the edge
- [`react-wrap-balancer`](https://github.com/shuding/react-wrap-balancer) – Simple React component that makes titles more readable

### Hooks and Utilities

- `useIntersectionObserver` –  React hook to observe when an element enters or leaves the viewport
- `useLocalStorage` – Persist data in the browser's local storage
- `useScroll` – React hook to observe scroll position ([example](https://github.com/steven-tey/precedent/blob/main/components/layout/index.tsx#L25))
- `nFormatter` – Format numbers with suffixes like `1.2k` or `1.2M`
- `capitalize` – Capitalize the first letter of a string
- `truncate` – Truncate a string to a specified length
- [`use-debounce`](https://www.npmjs.com/package/use-debounce) – Debounce a function call / state update

### Code Quality

- [TypeScript](https://www.typescriptlang.org/) – Static type checker for end-to-end typesafety
- [Prettier](https://prettier.io/) – Opinionated code formatter for consistent code style
- [ESLint](https://eslint.org/) – Pluggable linter for Next.js and TypeScript

### Miscellaneous

- [Vercel Analytics](https://vercel.com/analytics) – Track unique visitors, pageviews, and more in a privacy-friendly way

## To Do

The beauty of innovation lies in its ever-evolving nature. Here is what we are excited to work on next:

* Robust database write operations with integrated error handling
* Ocean db integration for multi-modal data handling
* Integration with tools such as Google Drive, Asana, Github, etc.
* A dynamic integration layer to connect any model with tool data 
* Ability to scale Ocean instances based on data size
* Integration with all models from Huggingface
* Integration with AUTOGPT agent and goal orientation
* File upload support for pdfs, csvs, and other folders
* Rebranding with lighter or neon-blue aesthetic
* Support for uploading Images, videos, sensor data, imf, etc.
* Creation capabilities for images, videos, music, etc.
* Feature to share links with friends
* Subscription plan selection
* Automate any workflow with just text,
* Marketplace for sharing, purchasing, or selling datasets and fine-tuned models
* Easy finetuning of models, with monetization options

Every step we take in the evolution of The Domain brings us closer to a future where technology truly serves us all. Let's shape that future together.
