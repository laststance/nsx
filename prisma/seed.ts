import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const posts = [
    {
      title: 'I now understand structure of the TypeScirpt Error Message.',
      body: 'Thanks this official docs page, finally I got it why TypeScirpt displayed many type error message for per conflict point\n\n- [TypeScirpt: Understanding Errors](https://www.typescriptlang.org/docs/handbook/2/understanding-errors.html)\n\nThese post introduce assignable type guard in a const from TypeScript 4.4\n\n- [Write more readable code with TypeScript 4.4](https://blog.logrocket.com/typescript-4-4-and-more-readable-code/)\n- [TypeScript: Control Flow Analysis of Aliased Conditions](https://devblogs.microsoft.com/typescript/announcing-typescript-4-4-beta/#cfa-aliased-conditions)',
    },
    {
      title: 'I now understand structure of the TypeScirpt Error Message.1',
      body: 'Thanks this official docs page, finally I got it why TypeScirpt displayed many type error message for per conflict point\n\n- [TypeScirpt: Understanding Errors](https://www.typescriptlang.org/docs/handbook/2/understanding-errors.html)\n\nThese post introduce assignable type guard in a const from TypeScript 4.4\n\n- [Write more readable code with TypeScript 4.4](https://blog.logrocket.com/typescript-4-4-and-more-readable-code/)\n- [TypeScript: Control Flow Analysis of Aliased Conditions](https://devblogs.microsoft.com/typescript/announcing-typescript-4-4-beta/#cfa-aliased-conditions)',
    },
    {
      title: 'I now understand structure of the TypeScirpt Error Message.2',
      body: 'Thanks this official docs page, finally I got it why TypeScirpt displayed many type error message for per conflict point\n\n- [TypeScirpt: Understanding Errors](https://www.typescriptlang.org/docs/handbook/2/understanding-errors.html)\n\nThese post introduce assignable type guard in a const from TypeScript 4.4\n\n- [Write more readable code with TypeScript 4.4](https://blog.logrocket.com/typescript-4-4-and-more-readable-code/)\n- [TypeScript: Control Flow Analysis of Aliased Conditions](https://devblogs.microsoft.com/typescript/announcing-typescript-4-4-beta/#cfa-aliased-conditions)',
    },
    {
      title: 'Express is pretty nice as a framework',
      body: 'Today I Read how to working the Express.  \nSimply set up debugger and tracking program line by line.  \nFinally I thought Express handing everything manner before create Node.js webserver(`http.createServer()`).  \nThis is feels like ideal software as a library.  \nThis is because Express can raise the quality of the Entire webserver just by using it.  \nThat definitely contributing to making better Internet!',
    },
    {
      title: 'Load to mastering React internal',
      body: "Today I was learing React internal.  \nI didn't know that long time React docs has such as page.  \n\n- [React: Codebase Overview](https://reactjs.org/docs/codebase-overview.html)\n\nAnd existing super cool document link in the paragrah.\n\n- [React Fiber Architecture](https://github.com/acdlite/react-fiber-architecture#review)\n\nSecond, Reduced this blog's bundle size to splitting heavy syntax hilight library contained bundle.\n\n- [apply code splitting to SyntaxHilighter](https://github.com/laststance/today-i-learned/commit/bdae84613b5643e0a01b3f796dd88105f81765dc)\n-------------------------------\n### Today I Read\n- [What’s the purpose of the HTML “nomodule” attribute for script elements if the default is text/javascript?](https://stackoverflow.com/questions/45943494/what-s-the-purpose-of-the-html-nomodule-attribute-for-script-elements-if-the-d)\n- [What Are Design Tokens?](https://css-tricks.com/what-are-design-tokens/)\n- [Global vs. Local Styling In Next.js](https://www.smashingmagazine.com/2021/07/global-local-styling-nextjs/)\n- [WebView2 and Electron](https://www.electronjs.org/blog/webview2)",
    },
    {
      title:
        'Create React App + Express + Sequelize CLI == FullStack Framework',
      body: "This Sunday I've been working consider around create-react-app version up strategy and wrote comment on the issue.  \nIf create-react-app support `esbuild-loader` officially, dev-server speed improve drastically.  \n\n- [Comment on We need regualr CRA maintainer #11180](https://github.com/facebook/create-react-app/issues/11180#issuecomment-890454128)\n\nAnd I had many activity really wide.  \nHowever, I don't have enough time to research and implement everything I'm interested in.  \nAnyway that's enough achievement I could make `sequelize-cli` based setup DB backend of [today-i-learned](https://github.com/laststance/today-i-learned/blob/afd5b17b66881e84aebc79014911cc086f6db265/package.json#L104-L111).\n\nI'd like to mounted DB organizer command kind of `db:migrate`, `db:seed:all` on create-react-app project.  \nIt's looks like Ruby on Rails! Sounds like a FullStack Framework totally!\n\n----------------------------------------------------------\n### Articles\n\n- [Keyboard shortcuts](https://docs.github.com/en/get-started/using-github/keyboard-shortcuts)\n- [visionmedia/debug](https://github.com/visionmedia/debug#usage)\n- [Improved dark mode default styling with the color-scheme CSS property and the corresponding meta tag](https://web.dev/color-scheme/)\n- [prefers-color-scheme: Hello darkness, my old friend](https://web.dev/prefers-color-scheme/)\n- [Analyze your Create React App bundle size - without ejecting](https://tjaddison.com/blog/2020/12/analyze-your-create-react-app-bundle-size-without-ejecting/)",
    },
    {
      title:
        "I didn't understand difference between sequelize and sequelize/cli",
      body: 'In the docs there are 2 command `sequelize` and `sequelize-cli`.  \nIn the beginning I thought those command has different feature but both are exact same executable command finally I got it.\n\n- [Profiler API](https://reactjs.org/docs/profiler.html)\n- [sequelize/cli](https://github.com/sequelize/cli)\n- [How to Generate Fake Data in Node.js Using Faker.js](https://www.section.io/engineering-education/how-to-generate-fake-data-in-node-using-faker.js/)\n- [webpack or esbuild: Why not both?](https://blog.logrocket.com/webpack-or-esbuild-why-not-both/)\n- [Yarn 3.0](https://dev.to/arcanis/yarn-3-0-performances-esbuild-better-patches-e07)',
    },
    {
      title: 'Researching production docker-compose setting',
      body: '- [Use Compose in production](https://docs.docker.com/compose/production/)',
    },
    {
      title: 'React Rush',
      body: "- [MDN: Object.defineProperty()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)\n\nIn this page introduce the great example code that contains the essence of this function.\n\n```javascript\n// using __proto__\nvar obj = {};\nvar descriptor = Object.create(null); // no inherited properties\ndescriptor.value = 'static';\n\n// not enumerable, not configurable, not writable as defaults\nObject.defineProperty(obj, 'key', descriptor);\n\n// being explicit\nObject.defineProperty(obj, 'key', {\n  enumerable: false,\n  configurable: false,\n  writable: false,\n  value: 'static'\n});\n\n// recycling same object\nfunction withValue(value) {\n  var d = withValue.d || (\n    withValue.d = {\n      enumerable: false,\n      writable: false,\n      configurable: false,\n      value: value\n    }\n  );\n\n  // avoiding duplicate operation for assigning value\n  if (d.value !== value) d.value = value;\n\n  return d;\n}\n// ... and ...\nObject.defineProperty(obj, 'key', withValue('static'));\n\n// if freeze is available, prevents adding or\n// removing the object prototype properties\n// (value, get, set, enumerable, writable, configurable)\n(Object.freeze || Object)(Object.prototype);\n\n```\n\n\n- [What's the difference between a regular push and an Array.prototype.push.apply](https://stackoverflow.com/questions/35638511/whats-the-difference-between-a-regular-push-and-an-array-prototype-push-apply)\n\nSo if you do something like this:\n\n```javascript\nlet numbersArray = [1, 2]\nnumbersArray.push([3, 4])\nYou will have an array in array:\n\n[1, 2, [3,4]]\nWhen you have a list of variables which you want to add, you can use push.apply()\n\nlet numbersArray = [1, 2]\nnumbersArray.push.apply(numbersArray, [3, 4])\nThen your result will looks like that:\n\n[1, 2, 3, 4]\n```\n\n\n- [Bug: Potential bug in “official” useInterval example #21912](https://github.com/facebook/react/issues/21912)\n\n",
    },
    {
      title: 'Satisfied todays code things',
      body: '- [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)\n- [React: Strict Mode](https://reactjs.org/docs/strict-mode.html)\n- [Node.js: what is ENOSPC error and how to solve?](https://stackoverflow.com/questions/22475849/node-js-what-is-enospc-error-and-how-to-solve)',
    },
    {
      title: 'Understanding How to use type definition with Deno',
      body: '- [Overview of TypeScript in Deno](https://deno.land/manual@v1.12.1/typescript/overview)\n- [ypes and Type Declarations](https://deno.land/manual@v1.12.1/typescript/types)',
    },
    {
      title: "What's the ESBuild? What's the Vite? What's the Deno?",
      body: '- [Why eslint consider JSX or some react @types undefined, since upgrade typescript-eslint/parser to version 4.0.0](https://stackoverflow.com/questions/64170868/why-eslint-consider-jsx-or-some-react-types-undefined-since-upgrade-typescript)\n- [Dockerize your Node app](https://dev.to/karanpratapsingh/dockerize-node-application-222k)\n- [Workaround for anchor-is-valid with next/link](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/issues/402)\n- [Using CSS custom properties (variables)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)\n- [fmt: add config flag #3827](https://github.com/denoland/deno/issues/3827)\n- [esBuild Getting Started](https://esbuild.github.io/getting-started/#build-scripts)\n- [Vite Dependency Pre-Bundling](https://vitejs.dev/guide/dep-pre-bundling.html)',
    },
    {
      title: 'How I created in-memory DOM?',
      body: '- [How I created in-memory DOM?](https://dev.to/abhishekraj272/how-i-created-this-mini-virtual-dom-13lp)',
    },
    {
      title: 'Deno super rush',
      body: '# Today I read\n\n- [Deno Internal details](https://deno.land/manual@v1.12.0/contributing/architecture)\n- [A Guide to Deno Core](https://denolib.gitbook.io/guide/)\n- [Suggestion: Look into porting to Rust and using Tokio #205](https://github.com/denoland/deno/issues/205)\n- [https://esm.sh/](https://esm.sh/)\n- [How to get started with Deno Tutorial](https://www.robinwieruch.de/deno-tutorial?utm_campaign=Robin%20Wieruch%20-%20A%20Developer%27s%20Newsletter&utm_medium=email&utm_source=Revue%20newsletter)',
    },
    {
      title: 'Deno docs to Webassembly',
      body: '### Today I Read\n\n- [Direct links to my single page app don’t work](https://answers.netlify.com/t/support-guide-direct-links-to-my-single-page-app-spa-dont-work/126)\n\n- [Why is the initial connection time for a HTTP request so long?](https://stackoverflow.com/questions/37919706/why-is-the-initial-connection-time-for-a-http-request-so-long)\n\n- [Deno WebAssembly support](https://deno.land/manual/getting_started/webassembly)\n\n- [WebAssembly Guide](https://developer.mozilla.org/en-US/docs/WebAssembly#guides)',
    },
    {
      title: 'Why Deno could have TypeScript Runtime?',
      body: '- [Getting Started with Compression in Node.js](https://www.digitalocean.com/community/tutorials/nodejs-compression)\n- [Redbird Reverse Proxy](https://github.com/OptimalBits/redbird)\n\n- [renderToHTML](https://github.com/vercel/next.js/blob/canary/packages/next/server/render.tsx#L372-L1159)',
    },
    {
      title: 'I learned what is the Buffer',
      body: '- [Node.js Buffers](https://nodejs.dev/learn/nodejs-buffers) Buffer is an area of memory.\n\n- [MDN Web Docs: Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) re-learn Promise data flow\n\n- [Ubuntu Package Management](https://ubuntu.com/server/docs/package-management)\n- [What does the `is` keyword do in typescript?](https://stackoverflow.com/questions/40081332/what-does-the-is-keyword-do-in-typescript)\n- [One config format, in one place #1596](https://github.com/rome/tools/issues/1596)\n- [deno.land / std@0.100.0 / http / server.ts](https://deno.land/std@0.100.0/http/server.ts)',
    },
    {
      title: 'Read Newsletters',
      body: '- [July 07 - Top 3 React resources: short and sweet](https://buttondown.email/tinyreact/archive/july-07-top-3-react-resources-short-and-sweet/)',
    },
    {
      title: 'Rome: independent force',
      body: '- [Philosophy](https://rome.tools/#philosophy)',
    },
    {
      title: 'Write long text in Issue thread',
      body: '- [We need regualr CRA maintainer #11180](https://github.com/facebook/create-react-app/issues/11180)',
    },
    {
      title: 'Who report npm audit?',
      body: '- [Help, npm audit says I have a vulnerability in react-scripts! #11174](https://github.com/facebook/create-react-app/issues/11174)\n- [npm-audit](https://docs.npmjs.com/cli/v7/commands/npm-audit)\n- [Auditing package dependencies for security vulnerabilities](https://docs.npmjs.com/auditing-package-dependencies-for-security-vulnerabilities)',
    },
    {
      title: 'Future of Create React App',
      body: '- [We need regualr CRA maintainer #11180](https://github.com/facebook/create-react-app/issues/11180)\n\nJust React development Out of the Box without specific framework.  \nWhether there is Server Component or not.',
    },
    {
      title: 'ANSI? Color?',
      body: '# Reading\n- [Colorizing your terminal and shell environment?](https://unix.stackexchange.com/questions/148/colorizing-your-terminal-and-shell-environment)',
    },
    {
      title: "Finaly I got it RTK Query's transformResponse",
      body: '### Reading\n- [Customizing queries](https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#customizing-query-responses-with-transformresponse)',
    },
    {
      title:
        'Currently Rreact-Redux recommended useSelector() over the connect()',
      body: "- [Why Redux is strongly recommending to use hooks API? · Discussion #1796 · reduxjs/react-redux](https://github.com/reduxjs/react-redux/discussions/1796)\n\nIt's interesting for me because `connect()` is well performance rather than `useSelector()` I thought unconsciously.  \nThinking a few time I easily understood actually only difference is `HOC` or `Hooks` where React-Redux must be done the extract value tasks.  \n\nFinally I'm curious about how prevent rerender where the no update value components dispite using React Context.\n\n\n- [When a JavaScript WeakMap() Actually Came in Handy // Alex MacArthur](https://macarthur.me/posts/when-a-weakmap-came-in-handy)\n- [JSON Web Token Introduction - jwt.io](https://jwt.io/introduction)",
    },
    {
      title: 'Learned about TypeScript a lot of.',
      body: "I've researched for set up universal frontend & backend TypeScript with global `d.ts` that stored app specific types of domain concerns.  \nSomehow finally made it facing phantom TypeScirpt error cause editor's language service not working correctly.  \n\nBelieve only who’s saying `tsc`.\n\n- [Index signature is missing in type (only on interfaces, not on type alias) · Issue #15300 · microsoft/TypeScript](https://github.com/microsoft/TypeScript/issues/15300)\n- [collections: most functions that work on `Record` do not work with `interface` · Issue #1126 · denoland/deno_std](https://github.com/denoland/deno_std/issues/1126)\n- [Assertion Functions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions)\n- [browserify/commonjs-assert: Node.js's require('assert') for all engines](https://github.com/browserify/commonjs-assert)\n- [How to configure custom global interfaces (.d.ts files) for TypeScript? - Stack Overflow](https://stackoverflow.com/questions/42233987/how-to-configure-custom-global-interfaces-d-ts-files-for-typescript)",
    },
    {
      title: 'Read the New JSX Transform React Official Post after the year',
      body: "It's too late though...\n\n- [Introducing the New JSX Transform – React Blog](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)",
    },
    {
      title: 'ValueOrganizerComponent',
      body: "I suppose this pattern...\n\n```js\nimport React from 'react'\n\nfunction CurrencyValueOrganizer() {}\n\n```",
    },
    {
      title: "I've visit documentation of pipe pipe pipe",
      body: '- [Child process | Node.js v16.9.1 Documentation](https://nodejs.org/api/child_process.html#child_process_options_stdio)',
    },
    {
      title: "I've done basic CRUD opration with RTKQuery somehow",
      body: "One thing to keep in mind is that if you don't set the CacheTag properly, you will still see the cache that should be Invalidad even after the data has been changed by Mutation.  \n\nThis is a big difference from plain HTTP clients such as fetch and Axios.  \n\nI was curious to touch RTKQuery to see how React-Query does cache control.",
    },
    {
      title: 'Supabase is obviously trusted than Firebase as a DabaBase',
      body: "Client Side ORM directly DabaBase manipulation is so strong option.  \nMight be useful to reboot [Trueblue](https://github.com/ryota-murakami/trueblue)?\n\n- [What's the difference between putting script in head and body?](https://stackoverflow.com/questions/17106462/whats-the-difference-between-putting-script-in-head-and-body)\n- [Open source backend-as-a-service startup Supabase raises $30M](https://techcrunch.com/2021/09/09/supabase-raises-30m-for-its-open-source-insta-backend/)\n- [testing-library/testing-playground\n](https://github.com/testing-library/testing-playground)\n- [NPM Dependency Resolving and Pre-Bundling](https://vitejs.dev/guide/features.html#npm-dependency-resolving-and-pre-bundling)\n\nThant's awesome, I want to know how to do it.  \n\n```\nPre-bundle them to improve page loading speed and convert CommonJS / UMD modules to ESM. The pre-bundling step is performed with esbuild and makes Vite's cold start time significantly faster than any JavaScript-based bundler.\n```",
    },
    {
      title: 'Babel finding chunk fo funding? But...',
      body: "Actually around 2017~2021 is golden age of the Babel.  \nEvery code running on browser might through Babel transpile process because original code written by developer contain various future proposal on tc39 syntax and Flow type stripping, many   javascript library provide enhanced feature by Babel plugin that working at babel transpile time.  \nI'm sure Babel accelerated world wide web entirely that should receive many respects.\n\n[Babel is used by millions, so why are we running out of money?](https://babeljs.io/blog/2021/05/10/funding-update)  \n\nBut now I have my thought about against the post which well known in the tech world.   \n\nThe factor is TypeScript popularity.  \nBasically TS is enhanced language for JavaScript specifically type system.  \nBut as same as importing aggressively many future JavaScript proposal syntax so TS doesn't require external polyfill tools like Babel.  \n\nI guess that over the next few years, Babel roles will gradually decrease in inverse proportion to the growth of TypeScirpt's market share.\n\nBut that's okay!\nI think it's best for them to continue to work on a scale that meets the demand for a reliable polyfill super set that has been tested through AST.",
    },
    {
      title: 'Disappointed',
      body: "hurt, sadly, I'm so much without power.",
    },
    {
      title: "It's time of proof TDD is dead. by Cpress",
      body: '- [TDD is dead. Long live testing.](https://dhh.dk/2014/tdd-is-dead-long-live-testing.html)\n\nHe mentioned "capybara" to tell us "worth it" testing.  \nSeven years later, I will show you absolutely  power of testing.',
    },
    {
      title: 'Vite is fine, but...',
      body: 'There is no various build chunk optimization quality concern compared Webpack?  \nMight be worth it Webpack for production build today, my stable choice is  \n\n- Bundler: Webpack\n- Transpiler: ESbuild migrate from Babel',
    },
    {
      title: 'I explored React v18 features',
      body: "Actually this article was written about React v18 new feature that I've seen on mainly [React v18 working group](https://github.com/reactwg/react-18/discussions) at the 22 Aug but original text is lost for bugs, I'm writing this announce as a fix blog system bug.  \n\n- [What happened to concurrent \"mode\"? #64](https://github.com/reactwg/react-18/discussions/64)\n\nI'll continue to taking note dump Today I Read from now on.",
    },
    {
      title: 'I now understand structure of the TypeScirpt Error Message.',
      body: 'Thanks this official docs page, finally I got it why TypeScirpt displayed many type error message for per conflict point\n\n- [TypeScirpt: Understanding Errors](https://www.typescriptlang.org/docs/handbook/2/understanding-errors.html)\n\nThese post introduce assignable type guard in a const from TypeScript 4.4\n\n- [Write more readable code with TypeScript 4.4](https://blog.logrocket.com/typescript-4-4-and-more-readable-code/)\n- [TypeScript: Control Flow Analysis of Aliased Conditions](https://devblogs.microsoft.com/typescript/announcing-typescript-4-4-beta/#cfa-aliased-conditions)',
    },
    {
      title: 'Express is pretty nice as a framework',
      body: 'Today I Read how to working the Express.  \nSimply set up debugger and tracking program line by line.  \nFinally I thought Express handing everything manner before create Node.js webserver(`http.createServer()`).  \nThis is feels like ideal software as a library.  \nThis is because Express can raise the quality of the Entire webserver just by using it.  \nThat definitely contributing to making better Internet!',
    },
    {
      title: 'Load to mastering React internal',
      body: "Today I was learing React internal.  \nI didn't know that long time React docs has such as page.  \n\n- [React: Codebase Overview](https://reactjs.org/docs/codebase-overview.html)\n\nAnd existing super cool document link in the paragrah.\n\n- [React Fiber Architecture](https://github.com/acdlite/react-fiber-architecture#review)\n\nSecond, Reduced this blog's bundle size to splitting heavy syntax hilight library contained bundle.\n\n- [apply code splitting to SyntaxHilighter](https://github.com/laststance/digital-strength/commit/bdae84613b5643e0a01b3f796dd88105f81765dc)\n-------------------------------\n### Today I Read\n- [What’s the purpose of the HTML “nomodule” attribute for script elements if the default is text/javascript?](https://stackoverflow.com/questions/45943494/what-s-the-purpose-of-the-html-nomodule-attribute-for-script-elements-if-the-d)\n- [What Are Design Tokens?](https://css-tricks.com/what-are-design-tokens/)\n- [Global vs. Local Styling In Next.js](https://www.smashingmagazine.com/2021/07/global-local-styling-nextjs/)\n- [WebView2 and Electron](https://www.electronjs.org/blog/webview2)",
    },
    {
      title:
        'Create React App + Express + Sequelize CLI == FullStack Framework',
      body: "This Sunday I've been working consider around create-react-app version up strategy and wrote comment on the issue.  \nIf create-react-app support `esbuild-loader` officially, dev-server speed improve drastically.  \n\n- [Comment on We need regualr CRA maintainer #11180](https://github.com/facebook/create-react-app/issues/11180#issuecomment-890454128)\n\nAnd I had many activity really wide.  \nHowever, I don't have enough time to research and implement everything I'm interested in.  \nAnyway that's enough achievement I could make `sequelize-cli` based setup DB backend of [digital-strength](https://github.com/laststance/digital-strength/blob/afd5b17b66881e84aebc79014911cc086f6db265/package.json#L104-L111).\n\nI'd like to mounted DB organizer command kind of `db:migrate`, `db:seed:all` on create-react-app project.  \nIt's looks like Ruby on Rails! Sounds like a FullStack Framework totally!\n\n----------------------------------------------------------\n### Articles\n\n- [Keyboard shortcuts](https://docs.github.com/en/get-started/using-github/keyboard-shortcuts)\n- [visionmedia/debug](https://github.com/visionmedia/debug#usage)\n- [Improved dark mode default styling with the color-scheme CSS property and the corresponding meta tag](https://web.dev/color-scheme/)\n- [prefers-color-scheme: Hello darkness, my old friend](https://web.dev/prefers-color-scheme/)\n- [Analyze your Create React App bundle size - without ejecting](https://tjaddison.com/blog/2020/12/analyze-your-create-react-app-bundle-size-without-ejecting/)",
    },
    {
      title:
        "I didn't understand difference between sequelize and sequelize/cli",
      body: 'In the docs there are 2 command `sequelize` and `sequelize-cli`.  \nIn the beginning I thought those command has different feature but both are exact same executable command finally I got it.\n\n- [Profiler API](https://reactjs.org/docs/profiler.html)\n- [sequelize/cli](https://github.com/sequelize/cli)\n- [How to Generate Fake Data in Node.js Using Faker.js](https://www.section.io/engineering-education/how-to-generate-fake-data-in-node-using-faker.js/)\n- [webpack or esbuild: Why not both?](https://blog.logrocket.com/webpack-or-esbuild-why-not-both/)\n- [Yarn 3.0](https://dev.to/arcanis/yarn-3-0-performances-esbuild-better-patches-e07)',
    },
    {
      title: 'Researching production docker-compose setting',
      body: '- [Use Compose in production](https://docs.docker.com/compose/production/)',
    },
    {
      title: 'React Rush',
      body: "- [MDN: Object.defineProperty()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)\n\nIn this page introduce the great example code that contains the essence of this function.\n\n```javascript\n// using __proto__\nvar obj = {};\nvar descriptor = Object.create(null); // no inherited properties\ndescriptor.value = 'static';\n\n// not enumerable, not configurable, not writable as defaults\nObject.defineProperty(obj, 'key', descriptor);\n\n// being explicit\nObject.defineProperty(obj, 'key', {\n  enumerable: false,\n  configurable: false,\n  writable: false,\n  value: 'static'\n});\n\n// recycling same object\nfunction withValue(value) {\n  var d = withValue.d || (\n    withValue.d = {\n      enumerable: false,\n      writable: false,\n      configurable: false,\n      value: value\n    }\n  );\n\n  // avoiding duplicate operation for assigning value\n  if (d.value !== value) d.value = value;\n\n  return d;\n}\n// ... and ...\nObject.defineProperty(obj, 'key', withValue('static'));\n\n// if freeze is available, prevents adding or\n// removing the object prototype properties\n// (value, get, set, enumerable, writable, configurable)\n(Object.freeze || Object)(Object.prototype);\n\n```\n\n\n- [What's the difference between a regular push and an Array.prototype.push.apply](https://stackoverflow.com/questions/35638511/whats-the-difference-between-a-regular-push-and-an-array-prototype-push-apply)\n\nSo if you do something like this:\n\n```javascript\nlet numbersArray = [1, 2]\nnumbersArray.push([3, 4])\nYou will have an array in array:\n\n[1, 2, [3,4]]\nWhen you have a list of variables which you want to add, you can use push.apply()\n\nlet numbersArray = [1, 2]\nnumbersArray.push.apply(numbersArray, [3, 4])\nThen your result will looks like that:\n\n[1, 2, 3, 4]\n```\n\n\n- [Bug: Potential bug in “official” useInterval example #21912](https://github.com/facebook/react/issues/21912)\n\n",
    },
    {
      title: 'Satisfied todays code things',
      body: '- [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)\n- [React: Strict Mode](https://reactjs.org/docs/strict-mode.html)\n- [Node.js: what is ENOSPC error and how to solve?](https://stackoverflow.com/questions/22475849/node-js-what-is-enospc-error-and-how-to-solve)',
    },
    {
      title: 'Understanding How to use type definition with Deno',
      body: '- [Overview of TypeScript in Deno](https://deno.land/manual@v1.12.1/typescript/overview)\n- [ypes and Type Declarations](https://deno.land/manual@v1.12.1/typescript/types)',
    },
    {
      title: "What's the ESBuild? What's the Vite? What's the Deno?",
      body: '- [Why eslint consider JSX or some react @types undefined, since upgrade typescript-eslint/parser to version 4.0.0](https://stackoverflow.com/questions/64170868/why-eslint-consider-jsx-or-some-react-types-undefined-since-upgrade-typescript)\n- [Dockerize your Node app](https://dev.to/karanpratapsingh/dockerize-node-application-222k)\n- [Workaround for anchor-is-valid with next/link](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/issues/402)\n- [Using CSS custom properties (variables)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)\n- [fmt: add config flag #3827](https://github.com/denoland/deno/issues/3827)\n- [esBuild Getting Started](https://esbuild.github.io/getting-started/#build-scripts)\n- [Vite Dependency Pre-Bundling](https://vitejs.dev/guide/dep-pre-bundling.html)',
    },
    {
      title: 'How I created in-memory DOM?',
      body: '- [How I created in-memory DOM?](https://dev.to/abhishekraj272/how-i-created-this-mini-virtual-dom-13lp)',
    },
    {
      title: 'Deno super rush',
      body: '# Today I read\n\n- [Deno Internal details](https://deno.land/manual@v1.12.0/contributing/architecture)\n- [A Guide to Deno Core](https://denolib.gitbook.io/guide/)\n- [Suggestion: Look into porting to Rust and using Tokio #205](https://github.com/denoland/deno/issues/205)\n- [https://esm.sh/](https://esm.sh/)\n- [How to get started with Deno Tutorial](https://www.robinwieruch.de/deno-tutorial?utm_campaign=Robin%20Wieruch%20-%20A%20Developer%27s%20Newsletter&utm_medium=email&utm_source=Revue%20newsletter)',
    },
    {
      title: 'Deno docs to Webassembly',
      body: '### Today I Read\n\n- [Direct links to my single page app don’t work](https://answers.netlify.com/t/support-guide-direct-links-to-my-single-page-app-spa-dont-work/126)\n\n- [Why is the initial connection time for a HTTP request so long?](https://stackoverflow.com/questions/37919706/why-is-the-initial-connection-time-for-a-http-request-so-long)\n\n- [Deno WebAssembly support](https://deno.land/manual/getting_started/webassembly)\n\n- [WebAssembly Guide](https://developer.mozilla.org/en-US/docs/WebAssembly#guides)',
    },
    {
      title: 'Why Deno could have TypeScript Runtime?',
      body: '- [Getting Started with Compression in Node.js](https://www.digitalocean.com/community/tutorials/nodejs-compression)\n- [Redbird Reverse Proxy](https://github.com/OptimalBits/redbird)\n\n- [renderToHTML](https://github.com/vercel/next.js/blob/canary/packages/next/server/render.tsx#L372-L1159)',
    },
    {
      title: 'I learned what is the Buffer',
      body: '- [Node.js Buffers](https://nodejs.dev/learn/nodejs-buffers) Buffer is an area of memory.\n\n- [MDN Web Docs: Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) re-learn Promise data flow\n\n- [Ubuntu Package Management](https://ubuntu.com/server/docs/package-management)\n- [What does the `is` keyword do in typescript?](https://stackoverflow.com/questions/40081332/what-does-the-is-keyword-do-in-typescript)\n- [One config format, in one place #1596](https://github.com/rome/tools/issues/1596)\n- [deno.land / std@0.100.0 / http / server.ts](https://deno.land/std@0.100.0/http/server.ts)',
    },
    {
      title: 'Read Newsletters',
      body: '- [July 07 - Top 3 React resources: short and sweet](https://buttondown.email/tinyreact/archive/july-07-top-3-react-resources-short-and-sweet/)',
    },
    {
      title: 'Rome: independent force',
      body: '- [Philosophy](https://rome.tools/#philosophy)',
    },
    {
      title: 'Write long text in Issue thread',
      body: '- [We need regualr CRA maintainer #11180](https://github.com/facebook/create-react-app/issues/11180)',
    },
    {
      title: 'Who report npm audit?',
      body: '- [Help, npm audit says I have a vulnerability in react-scripts! #11174](https://github.com/facebook/create-react-app/issues/11174)\n- [npm-audit](https://docs.npmjs.com/cli/v7/commands/npm-audit)\n- [Auditing package dependencies for security vulnerabilities](https://docs.npmjs.com/auditing-package-dependencies-for-security-vulnerabilities)',
    },
    {
      title: 'Future of Create React App',
      body: '- [We need regualr CRA maintainer #11180](https://github.com/facebook/create-react-app/issues/11180)\n\nJust React development Out of the Box without specific framework.  \nWhether there is Server Component or not.',
    },
    {
      title: 'ANSI? Color?',
      body: '# Reading\n- [Colorizing your terminal and shell environment?](https://unix.stackexchange.com/questions/148/colorizing-your-terminal-and-shell-environment)',
    },
    {
      title: "Finaly I got it RTK Query's transformResponse",
      body: '### Reading\n- [Customizing queries](https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#customizing-query-responses-with-transformresponse)',
    },
    {
      title: 'close your eyes',
      body: '\n- [CSS Weekly #464](https://css-weekly.com/issue-464/)\n- [Content-Disposition](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition)\n- [Contributor Covenant](https://www.contributor-covenant.org/)\n- [RTK Query Overview](https://redux-toolkit.js.org/rtk-query/overview)\n- [Queries](https://redux-toolkit.js.org/rtk-query/usage/queries)\n- [Mutation](https://redux-toolkit.js.org/rtk-query/usage/mutations)\n- [RTK Query Quick Start](https://redux-toolkit.js.org/tutorials/rtk-query)\n- [Usage With TypeScript](https://redux-toolkit.js.org/rtk-query/usage-with-typescript)\n- [Fix the "React Hook is Called Conditionally" Error in React](https://typeofnan.dev/fix-the-react-hook-is-called-conditionally-error-in-react/)',
    },
  ]
  /*
   * Post Seed
   */
  for (const post of posts) {
    await prisma.posts.create({
      data: post,
    })
  }
  /*
   * User Seed
   */
  await prisma.authors.create({
    data: {
      name: 'John Doe',
      // hash of 'popcoon',
      password: '$2b$10$PDIcmRmxvgVeIaa/c9AWiu4wRQD7EwBjczFqVDjgMtsj4.To0W5aC',
    },
  })
  await prisma.authors.create({
    data: {
      name: 'rex',
      // hash of 'popcoon',
      password: '$2b$10$PDIcmRmxvgVeIaa/c9AWiu4wRQD7EwBjczFqVDjgMtsj4.To0W5aC',
    },
  })
  /*
   * Tweet Seed
   */
  const tweets = [
    {
      text: 'Just launched our new feature! Anyone else excited about learning a new language through immersive storytelling? #LanguageLearning',
    },
    {
      text: "Hot take: TypeScript isn't just JavaScript with extra steps. It's JavaScript with a safety net. Discuss.",
    },
    {
      text: "That feeling when your code works on the first try and you don't know why 👀 #DeveloperLife",
    },
    {
      text: 'Reading "Clean Code" for the third time and still finding new insights. What tech books do you keep coming back to?',
    },
    {
      text: 'Just had a call with a client who implemented our API and increased conversions by 37%. This is why we build things!',
    },
    {
      text: "Controversial opinion: dark mode isn't better for your eyes, you just think it looks cooler (and you're right)",
    },
    {
      text: 'Sometimes I debug by adding console.log, sometimes I use a proper debugger, but mostly I just stare at the code until it confesses its sins.',
    },
    {
      text: 'The best database is the one that works for YOUR specific use case. Stop fighting holy wars over SQL vs NoSQL and start solving real problems.',
    },
    {
      text: "Want to join our beta program? We're looking for early adopters who aren't afraid to give honest feedback! Drop a reply if interested.",
    },
    {
      text: 'Just hit 10,000 users! Thank you to everyone who believed in us when we were just three people working out of a basement. This journey is just beginning.',
    },
  ]
  for (const tweet of tweets) {
    await prisma.tweet.create({
      data: tweet,
    })
  }
}

/*
 * Main
 */
main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
