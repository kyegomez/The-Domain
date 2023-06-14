


<a href="https://thedomain.ai">
  <img alt="The Domain, an interface with all of Humanity's knowledge and wisdom" src="https://thedomain.ai/api/og">
  <h1 align="center">The Domain</h1>
</a>

<p align="center">
  An advanced conversational interface connecting you with all digital data across the cosmos.
</p>

<p align="center">
  <a href="https://twitter.com/steventey">
    <img src="https://img.shields.io/twitter/follow/steventey?style=flat&label=steventey&logo=twitter&color=0bf&logoColor=fff" alt="Steven Tey Twitter follower count" />
  </a>
  <a href="https://github.com/steven-tey/thedomain">
    <img src="https://img.shields.io/github/stars/steven-tey/thedomain?label=steven-tey%2Fthedomain" alt="The Domain repo star count" />
  </a>
</p>

<p align="center">
  <a href="#introduction"><strong>Introduction</strong></a> ·
  <a href="#installation"><strong>Installation</strong></a> ·
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#author"><strong>Author</strong></a>
</p>
<br/>

## Introduction

The Domain is the future of digital communication, a super intelligent conversational interface that allows seamless interaction with any digital data.

## Installation

The Domain is ready for deployment in any environment with the click of a button:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsteven-tey%2Fthedomain&project-name=thedomain&repository-name=thedomain&demo-title=The%20Domain&demo-description=A%20super%20intelligent%20conversational%20interface%20that%20allows%20seamless%20interaction%20with%20any%20digital%20data.&demo-url=https%3A%2F%2Fthedomain.ai&demo-image=https%3A%2F%2Fthedomain.ai%2Fapi%2Fog&env=DATABASE_URL,GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET,NEXTAUTH_SECRET&envDescription=How%20to%2Fget%20these%20env%20variables%3A&envLink=https%3A%2F%2Fgithub.com%2Fsteven-tey%2Fthedomain%2Fblob%2Fmain%2F.env.example)

You can also clone & install The Domain locally with the following command:

```bash
npx create-next-app thedomain --example "https://github.com/steven-tey/thedomain"
```

## Tech Stack + Features

https://user-images.githubusercontent.com/28986134/212368288-12f41e37-aa8c-4e0a-a542-cf6d23410a65.mp4

### Frameworks

- [Next.js](https://nextjs.org/) – React framework for building performant apps with the best developer experience
- [Auth.js](https://authjs.dev/) – Handle user authentication with ease with providers like Google, Twitter, GitHub, etc.
- [Prisma](https://www.prisma.io/) – Typescript-first ORM for Node.js

### Platforms

- [Vercel](https://vercel.com/) – Easily preview & deploy changes with git
- [Railway](https://railway.app/) – Easily provision a PostgreSQL database (no login required)

### UI

- [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS framework for rapid UI development
- [Radix](https://www.radix-ui.com/) – Primitives like modal, popover, etc. to build a stellar user experience
- [Framer Motion](https://framer.com/motion) – Motion library for React to animate components with ease
- [Lucide](https://lucide.dev/) – Beautifully simple, pixel-perfect icons
- [`@next/font`](https://nextjs.org/docs/basic-features/font-optimization) – Optimize custom fonts and remove external network requests for improved performance
- [`@vercel/og`](https://vercel.com/docs/concepts/functions/edge-functions/og-image-generation) – Generate dynamic Open Graph images on the edge
- [`react-wrap-balancer`](https://github.com/shuding/react-wrap-balancer) – Simple React component that makes titles more readable

### Hooks and Utilities

- `useIntersectionObserver` –  React hook to observe when an element enters or leaves the viewport
- `useLocalStorage` – Persist data in the browser's local storage
- `useScroll` – React hook to observe scroll position ([example](https://github.com/steven-tey/precedent/blob/main/components/layout/index.tsx#L25))
- `nFormatter` – Format numbers with suffixes like `1.2k` or `1.2M`
- `capitalize` – Capitalize the first letter of a string
- `truncate` – Truncate a string to a specified length
- [`use-debounce`](https://www.npmjs.com/package/use-debounce) – Debounce a function call / state update

### Code Quality

- [TypeScript](https://www.typescriptlang.org/) – Static type checker for end-to-end typesafety
- [Prettier](https://prettier.io/) – Opinionated code formatter for consistent code style
- [ESLint](https://eslint.org/) – Pluggable linter for Next.js and TypeScript

### Miscellaneous

- [Vercel Analytics](https://vercel.com/analytics) – Track unique visitors, pageviews, and more in a privacy-friendly way


# To do:

* Establish save to database write with error handling

* Integrate Ocean db, the multi-modality native database 

* Add Tools like Google Drive, Asana, Github, etc tools you use,

* Create integration layer where you can connect any model with tool data 

* Dynamically scale up Ocean instances based on how much data you have

* Integrate the ability to use any model from Huggingface

* Integrate AUTOGPT agent with goals

* Integrate file upload with pdfs, csvs, any folder

* Change stylings, make it more light blue or Neon blue

* Upload Images, videos, sensor data, imf, etc etc and use ocean db instance to talk with it

* Create Anything, images, videos, music, etc

* Share with friends links

* Subscription plan selection

* Automate any workflow with just text,

* Create marketplace to share datasets for free or buy them, or share finetuned models

* Allow for easy finetuning of models, ask for money before payment is acquired