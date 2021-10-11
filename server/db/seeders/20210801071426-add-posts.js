'use strict'

module.exports = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'posts',
      [
        {
          title: 'I now understand structure of the TypeScirpt Error Message.',
          body: 'Thanks this official docs page, finally I got it why TypeScirpt displayed many type error message for per conflict point\n\n- [TypeScirpt: Understanding Errors](https://www.typescriptlang.org/docs/handbook/2/understanding-errors.html)\n\nThese post introduce assignable type guard in a const from TypeScript 4.4\n\n- [Write more readable code with TypeScript 4.4](https://blog.logrocket.com/typescript-4-4-and-more-readable-code/)\n- [TypeScript: Control Flow Analysis of Aliased Conditions](https://devblogs.microsoft.com/typescript/announcing-typescript-4-4-beta/#cfa-aliased-conditions)',
          createdAt: new Date('2021-08-05T21:03:53.000Z'),
          updatedAt: new Date('2021-08-05T21:05:50.000Z'),
        },
        {
          title: 'Express is pretty nice as a framework',
          body: 'Today I learned how to working the Express.  \nSimply set up debugger and tracking program line by line.  \nFinally I thought Express handing everything manner before create Node.js webserver(`http.createServer()`).  \nThis is feels like ideal software as a library.  \nThis is because Express can raise the quality of the Entire webserver just by using it.  \nThat definitely contributing to making better Internet!',
          createdAt: new Date('2021-08-04T17:29:16.000Z'),
          updatedAt: new Date('2021-08-04T17:29:16.000Z'),
        },
        {
          title: 'Load to mastering React internal',
          body: "Today I was learing React internal.  \nI didn't know that long time React docs has such as page.  \n\n- [React: Codebase Overview](https://reactjs.org/docs/codebase-overview.html)\n\nAnd existing super cool document link in the paragrah.\n\n- [React Fiber Architecture](https://github.com/acdlite/react-fiber-architecture#review)\n\nSecond, Reduced this blog's bundle size to splitting heavy syntax hilight library contained bundle.\n\n- [apply code splitting to SyntaxHilighter](https://github.com/laststance/today-i-learned/commit/bdae84613b5643e0a01b3f796dd88105f81765dc)\n-------------------------------\n### Today I Read\n- [What’s the purpose of the HTML “nomodule” attribute for script elements if the default is text/javascript?](https://stackoverflow.com/questions/45943494/what-s-the-purpose-of-the-html-nomodule-attribute-for-script-elements-if-the-d)\n- [What Are Design Tokens?](https://css-tricks.com/what-are-design-tokens/)\n- [Global vs. Local Styling In Next.js](https://www.smashingmagazine.com/2021/07/global-local-styling-nextjs/)\n- [WebView2 and Electron](https://www.electronjs.org/blog/webview2)",
          createdAt: new Date('2021-08-03T07:45:02.000Z'),
          updatedAt: new Date('2021-08-03T07:50:07.000Z'),
        },
        {
          title:
            'Create React App + Express + Sequelize CLI == FullStack Framework',
          body: "This Sunday I've been working consider around create-react-app version up strategy and wrote comment on the issue.  \nIf create-react-app support `esbuild-loader` officially, dev-server speed improve drastically.  \n\n- [Comment on We need regualr CRA maintainer #11180](https://github.com/facebook/create-react-app/issues/11180#issuecomment-890454128)\n\nAnd I had many activity really wide.  \nHowever, I don't have enough time to research and implement everything I'm interested in.  \nAnyway that's enough achievement I could make `sequelize-cli` based setup DB backend of [today-i-learned](https://github.com/laststance/today-i-learned/blob/afd5b17b66881e84aebc79014911cc086f6db265/package.json#L104-L111).\n\nI'd like to mounted DB organizer command kind of `db:migrate`, `db:seed:all` on create-react-app project.  \nIt's looks like Ruby on Rails! Sounds like a FullStack Framework totally!\n\n----------------------------------------------------------\n### Articles\n\n- [Keyboard shortcuts](https://docs.github.com/en/get-started/using-github/keyboard-shortcuts)\n- [visionmedia/debug](https://github.com/visionmedia/debug#usage)\n- [Improved dark mode default styling with the color-scheme CSS property and the corresponding meta tag](https://web.dev/color-scheme/)\n- [prefers-color-scheme: Hello darkness, my old friend](https://web.dev/prefers-color-scheme/)\n- [Analyze your Create React App bundle size - without ejecting](https://tjaddison.com/blog/2020/12/analyze-your-create-react-app-bundle-size-without-ejecting/)",
          createdAt: new Date('2021-08-01T18:31:58.000Z'),
          updatedAt: new Date('2021-08-01T18:46:56.000Z'),
        },
        {
          title:
            "I didn't understand difference between sequelize and sequelize/cli",
          body: 'In the docs there are 2 command `sequelize` and `sequelize-cli`.  \nIn the beginning I thought those command has different feature but both are exact same executable command finally I got it.\n\n- [Profiler API](https://reactjs.org/docs/profiler.html)\n- [sequelize/cli](https://github.com/sequelize/cli)\n- [How to Generate Fake Data in Node.js Using Faker.js](https://www.section.io/engineering-education/how-to-generate-fake-data-in-node-using-faker.js/)\n- [webpack or esbuild: Why not both?](https://blog.logrocket.com/webpack-or-esbuild-why-not-both/)\n- [Yarn 3.0](https://dev.to/arcanis/yarn-3-0-performances-esbuild-better-patches-e07)',
          createdAt: new Date('2021-07-31T08:52:37.000Z'),
          updatedAt: new Date('2021-07-31T13:39:42.000Z'),
        },
        {
          id: 21,
          title: 'Researching production docker-compose setting',
          body: '- [Use Compose in production](https://docs.docker.com/compose/production/)',
          createdAt: new Date('2021-07-30T01:03:23.000Z'),
          updatedAt: new Date('2021-07-30T07:03:17.000Z'),
        },
        {
          title: 'React Rush',
          body: "- [MDN: Object.defineProperty()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)\n\nIn this page introduce the great example code that contains the essence of this function.\n\n```javascript\n// using __proto__\nvar obj = {};\nvar descriptor = Object.create(null); // no inherited properties\ndescriptor.value = 'static';\n\n// not enumerable, not configurable, not writable as defaults\nObject.defineProperty(obj, 'key', descriptor);\n\n// being explicit\nObject.defineProperty(obj, 'key', {\n  enumerable: false,\n  configurable: false,\n  writable: false,\n  value: 'static'\n});\n\n// recycling same object\nfunction withValue(value) {\n  var d = withValue.d || (\n    withValue.d = {\n      enumerable: false,\n      writable: false,\n      configurable: false,\n      value: value\n    }\n  );\n\n  // avoiding duplicate operation for assigning value\n  if (d.value !== value) d.value = value;\n\n  return d;\n}\n// ... and ...\nObject.defineProperty(obj, 'key', withValue('static'));\n\n// if freeze is available, prevents adding or\n// removing the object prototype properties\n// (value, get, set, enumerable, writable, configurable)\n(Object.freeze || Object)(Object.prototype);\n\n```\n\n\n- [What's the difference between a regular push and an Array.prototype.push.apply](https://stackoverflow.com/questions/35638511/whats-the-difference-between-a-regular-push-and-an-array-prototype-push-apply)\n\nSo if you do something like this:\n\n```javascript\nlet numbersArray = [1, 2]\nnumbersArray.push([3, 4])\nYou will have an array in array:\n\n[1, 2, [3,4]]\nWhen you have a list of variables which you want to add, you can use push.apply()\n\nlet numbersArray = [1, 2]\nnumbersArray.push.apply(numbersArray, [3, 4])\nThen your result will looks like that:\n\n[1, 2, 3, 4]\n```\n\n\n- [Bug: Potential bug in “official” useInterval example #21912](https://github.com/facebook/react/issues/21912)\n\n",
          createdAt: new Date('2021-07-26T21:13:36.000Z'),
          updatedAt: new Date('2021-07-26T21:14:14.000Z'),
        },
        {
          title: 'Satisfied todays code things',
          body: '- [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)\n- [React: Strict Mode](https://reactjs.org/docs/strict-mode.html)\n- [Node.js: what is ENOSPC error and how to solve?](https://stackoverflow.com/questions/22475849/node-js-what-is-enospc-error-and-how-to-solve)',
          createdAt: new Date('2021-07-25T20:12:47.000Z'),
          updatedAt: new Date('2021-07-31T09:37:43.000Z'),
        },
        {
          title: 'Understanding How to use type definition with Deno',
          body: '- [Overview of TypeScript in Deno](https://deno.land/manual@v1.12.1/typescript/overview)\n- [ypes and Type Declarations](https://deno.land/manual@v1.12.1/typescript/types)',
          createdAt: new Date('2021-07-23T12:04:39.000Z'),
          updatedAt: new Date('2021-07-23T12:04:39.000Z'),
        },
        {
          title: "What's the ESBuild? What's the Vite? What's the Deno?",
          body: '- [Why eslint consider JSX or some react @types undefined, since upgrade typescript-eslint/parser to version 4.0.0](https://stackoverflow.com/questions/64170868/why-eslint-consider-jsx-or-some-react-types-undefined-since-upgrade-typescript)\n- [Dockerize your Node app](https://dev.to/karanpratapsingh/dockerize-node-application-222k)\n- [Workaround for anchor-is-valid with next/link](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/issues/402)\n- [Using CSS custom properties (variables)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)\n- [fmt: add config flag #3827](https://github.com/denoland/deno/issues/3827)\n- [esBuild Getting Started](https://esbuild.github.io/getting-started/#build-scripts)\n- [Vite Dependency Pre-Bundling](https://vitejs.dev/guide/dep-pre-bundling.html)',
          createdAt: new Date('2021-07-20T07:16:44.000Z'),
          updatedAt: new Date('2021-07-20T07:16:44.000Z'),
        },
        {
          title: 'How I created in-memory DOM?',
          body: '- [How I created in-memory DOM?](https://dev.to/abhishekraj272/how-i-created-this-mini-virtual-dom-13lp)',
          createdAt: new Date('2021-07-17T13:17:31.000Z'),
          updatedAt: new Date('2021-07-17T13:17:31.000Z'),
        },
        {
          title: 'Deno super rush',
          body: '# Today I read\n\n- [Deno Internal details](https://deno.land/manual@v1.12.0/contributing/architecture)\n- [A Guide to Deno Core](https://denolib.gitbook.io/guide/)\n- [Suggestion: Look into porting to Rust and using Tokio #205](https://github.com/denoland/deno/issues/205)\n- [https://esm.sh/](https://esm.sh/)\n- [How to get started with Deno Tutorial](https://www.robinwieruch.de/deno-tutorial?utm_campaign=Robin%20Wieruch%20-%20A%20Developer%27s%20Newsletter&utm_medium=email&utm_source=Revue%20newsletter)',
          createdAt: new Date('2021-07-15T18:12:03.000Z'),
          updatedAt: new Date('2021-07-15T18:12:03.000Z'),
        },
        {
          title: 'Deno docs to Webassembly',
          body: '### Today I Read\n\n- [Direct links to my single page app don’t work](https://answers.netlify.com/t/support-guide-direct-links-to-my-single-page-app-spa-dont-work/126)\n\n- [Why is the initial connection time for a HTTP request so long?](https://stackoverflow.com/questions/37919706/why-is-the-initial-connection-time-for-a-http-request-so-long)\n\n- [Deno WebAssembly support](https://deno.land/manual/getting_started/webassembly)\n\n- [WebAssembly Guide](https://developer.mozilla.org/en-US/docs/WebAssembly#guides)',
          createdAt: new Date('2021-07-14T16:39:57.000Z'),
          updatedAt: new Date('2021-08-01T14:53:02.000Z'),
        },
        {
          title: 'Why Deno could have TypeScript Runtime?',
          body: '- [Getting Started with Compression in Node.js](https://www.digitalocean.com/community/tutorials/nodejs-compression)\n- [Redbird Reverse Proxy](https://github.com/OptimalBits/redbird)\n\n- [renderToHTML](https://github.com/vercel/next.js/blob/canary/packages/next/server/render.tsx#L372-L1159)',
          createdAt: new Date('2021-07-13T14:45:58.000Z'),
          updatedAt: new Date('2021-07-13T14:45:58.000Z'),
        },
        {
          title: 'I learned what is the Buffer',
          body: '- [Node.js Buffers](https://nodejs.dev/learn/nodejs-buffers) Buffer is an area of memory.\n\n- [MDN Web Docs: Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) re-learn Promise data flow\n\n- [Ubuntu Package Management](https://ubuntu.com/server/docs/package-management)\n- [What does the `is` keyword do in typescript?](https://stackoverflow.com/questions/40081332/what-does-the-is-keyword-do-in-typescript)\n- [One config format, in one place #1596](https://github.com/rome/tools/issues/1596)\n- [deno.land / std@0.100.0 / http / server.ts](https://deno.land/std@0.100.0/http/server.ts)',
          createdAt: new Date('2021-07-08T11:42:47.000Z'),
          updatedAt: new Date('2021-07-08T18:40:13.000Z'),
        },
        {
          title: 'Read Newsletters',
          body: '- [July 07 - Top 3 React resources: short and sweet](https://buttondown.email/tinyreact/archive/july-07-top-3-react-resources-short-and-sweet/)',
          createdAt: new Date('2021-07-08T04:47:38.000Z'),
          updatedAt: new Date('2021-07-08T04:47:38.000Z'),
        },
        {
          title: 'Rome: independent force',
          body: '- [Philosophy](https://rome.tools/#philosophy)',
          createdAt: new Date('2021-07-07T17:22:00.000Z'),
          updatedAt: new Date('2021-07-07T17:22:00.000Z'),
        },
        {
          title: 'Write long text in Issue thread',
          body: '- [We need regualr CRA maintainer #11180](https://github.com/facebook/create-react-app/issues/11180)',
          createdAt: new Date('2021-07-07T16:30:40.000Z'),
          updatedAt: new Date('2021-07-07T16:30:40.000Z'),
        },
        {
          title: 'Who report npm audit?',
          body: '- [Help, npm audit says I have a vulnerability in react-scripts! #11174](https://github.com/facebook/create-react-app/issues/11174)\n- [npm-audit](https://docs.npmjs.com/cli/v7/commands/npm-audit)\n- [Auditing package dependencies for security vulnerabilities](https://docs.npmjs.com/auditing-package-dependencies-for-security-vulnerabilities)',
          createdAt: new Date('2021-07-06T21:57:03.000Z'),
          updatedAt: new Date('2021-07-06T22:03:01.000Z'),
        },
        {
          title: 'Future of Create React App',
          body: '- [We need regualr CRA maintainer #11180](https://github.com/facebook/create-react-app/issues/11180)\n\nJust React development Out of the Box without specific framework.  \nWhether there is Server Component or not.',
          createdAt: new Date('2021-07-06T15:37:14.000Z'),
          updatedAt: new Date('2021-07-06T15:41:10.000Z'),
        },
        {
          title: 'ANSI? Color?',
          body: '# Reading\n- [Colorizing your terminal and shell environment?](https://unix.stackexchange.com/questions/148/colorizing-your-terminal-and-shell-environment)',
          createdAt: new Date('2021-07-06T15:33:27.000Z'),
          updatedAt: new Date('2021-07-06T15:33:40.000Z'),
        },
        {
          title: "Finaly I got it RTK Query's transformResponse",
          body: '### Reading\n- [Customizing queries](https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#customizing-query-responses-with-transformresponse)',
          createdAt: new Date('2021-07-06T05:06:12.000Z'),
          updatedAt: new Date('2021-07-30T13:57:19.000Z'),
        },
        {
          title: 'close your eyes',
          body: '\n- [CSS Weekly #464](https://css-weekly.com/issue-464/)\n- [Content-Disposition](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition)\n- [Contributor Covenant](https://www.contributor-covenant.org/)\n- [RTK Query Overview](https://redux-toolkit.js.org/rtk-query/overview)\n- [Queries](https://redux-toolkit.js.org/rtk-query/usage/queries)\n- [Mutation](https://redux-toolkit.js.org/rtk-query/usage/mutations)\n- [RTK Query Quick Start](https://redux-toolkit.js.org/tutorials/rtk-query)\n- [Usage With TypeScript](https://redux-toolkit.js.org/rtk-query/usage-with-typescript)\n- [Fix the "React Hook is Called Conditionally" Error in React](https://typeofnan.dev/fix-the-react-hook-is-called-conditionally-error-in-react/)',
          createdAt: new Date('2021-07-03T13:09:16.000Z'),
          updatedAt: new Date('2021-07-25T00:56:50.000Z'),
        },
      ],
      {}
    )
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('posts', null, {})
  },
}
