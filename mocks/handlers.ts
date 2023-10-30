import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('http://localhost:3000/api/post_list', async () => {
    return HttpResponse.json({
      postList: [
        {
          id: 64,
          title: 'What is matter my $500 for',
          body: 'It represent the deepness.',
          createdAt: '2022-01-14T07:52:55.000Z',
          updatedAt: '2022-01-14T07:54:36.000Z',
        },
        {
          id: 63,
          title: 'Please MUI Components all argTypes Json generator',
          body: "Oh shit, I have to report it if there is no other report already.  \nI noticed typescript controls autogeneration not working with vite-storybook-builder.  \nI spend over 4 hour this probrem, but thanks alan.  your blue project saving me! \n\nToday I've throw the time for storybook for all, and I didn't thought maintain webpack project again.\n\n- [hipstersmoothie/react-docgen-typescript-plugin: A webpack plugin to inject react typescript docgen information](https://github.com/hipstersmoothie/react-docgen-typescript-plugin)\n\n- [storybook/addons/controls at next · storybookjs/storybook](https://github.com/storybookjs/storybook/tree/next/addons/controls)\n\nhttps://docs.google.com/document/d/1Mhp1UFRCKCsN8pjlfPdz8ZdisgjNXeMXpXvGoALjxYM/edit?usp=sharing",
          createdAt: '2021-12-29T14:53:42.000Z',
          updatedAt: '2021-12-29T14:53:42.000Z',
        },
        {
          id: 62,
          title: 'Fully Design Token Styling',
          body: 'https://mui.com/system/styled/#using-the-theme',
          createdAt: '2021-12-26T15:07:31.000Z',
          updatedAt: '2021-12-26T15:07:31.000Z',
        },
        {
          id: 61,
          title: 'figma cource 7 hours',
          body: 'https://youtu.be/RYDiDpW2VkM',
          createdAt: '2021-12-26T15:07:02.000Z',
          updatedAt: '2021-12-26T15:07:02.000Z',
        },
        {
          id: 60,
          title: 'Override interface properly type',
          body: '- [javascript - Overriding interface property type defined in Typescript d.ts file - Stack Overflow](https://stackoverflow.com/questions/41285211/overriding-interface-property-type-defined-in-typescript-d-ts-file)',
          createdAt: '2021-12-25T11:45:47.000Z',
          updatedAt: '2021-12-25T11:45:47.000Z',
        },
        {
          id: 59,
          title: 'I have no religion',
          body: "So don't doing any special event or went to church.  \nJust code.\nAt all.",
          createdAt: '2021-12-24T13:57:43.000Z',
          updatedAt: '2021-12-24T13:57:43.000Z',
        },
        {
          id: 58,
          title: 'zzzzsb',
          body: "- [How to write stories](https://storybook.js.org/docs/react/writing-stories/introduction)\n\n- [What's a Story](https://storybook.js.org/docs/react/get-started/whats-a-story)\n\n\n- [Creating custom generic TypeScript utility types | Ben Ilegbodu](https://www.benmvp.com/blog/creating-custom-generic-typescript-utility-types/?utm_source=twitter&utm_medium=social&utm_campaign=init_share)",
          createdAt: '2021-12-23T15:20:03.000Z',
          updatedAt: '2021-12-23T15:20:03.000Z',
        },
        {
          id: 57,
          title: 'validation',
          body: '- [Command-line options | Node.js v17.2.0 Documentation](https://nodejs.org/api/cli.html#--heapsnapshot-near-heap-limitmax_count)\n\n- [PHP: Description of core php.ini directives - Manual](https://www.php.net/manual/en/ini.core.php#ini.memory-limit)\n\n- [Refining Validation - Superstruct](https://docs.superstructjs.org/guides/04-refining-validation)',
          createdAt: '2021-12-20T23:44:32.000Z',
          updatedAt: '2021-12-23T14:20:17.000Z',
        },
        {
          id: 56,
          title: 'monorepo?',
          body: 'NX will fit for utility collective.',
          createdAt: '2021-12-16T17:04:33.000Z',
          updatedAt: '2021-12-16T17:04:33.000Z',
        },
        {
          id: 55,
          title: 'migrated vite!',
          body: "- [Nx and Turborepo | Nx](https://nx.dev/l/r/guides/turbo-and-nx)\n- [vue.js - Proxy `changeOrigin` setting doesn't seem to work - Stack Overflow](https://stackoverflow.com/questions/51802324/proxy-changeorigin-setting-doesnt-seem-to-work)\n- [Cypress request and cookies | Better world by better software](https://glebbahmutov.com/blog/cypress-request-and-cookies/)\n- [steadicat/eslint-plugin-react-memo: memo/useMemo/useCallback all the things!](https://github.com/steadicat/eslint-plugin-react-memo)",
          createdAt: '2021-12-15T19:32:38.000Z',
          updatedAt: '2021-12-15T20:10:40.000Z',
        },
        {
          id: 54,
          title: 'Making Tailwind CSS + React-Hook-Form <Input />',
          body: "Still WIP though, clsx is essential for almost UI control.\n\n```tsx\nimport { ExclamationCircleIcon } from '@heroicons/react/solid'\nimport clsx from 'clsx'\nimport type { InputHTMLAttributes } from 'react'\nimport React, { memo } from 'react'\nimport type { FormState, InternalFieldName } from 'react-hook-form'\n\ninterface Props {\n  register: AnyFunction\n  name: InternalFieldName\n  errors: FormState<any>['errors']\n  placeholder?: string\n}\nconst styles = {\n  basic:\n    ' focus:bg-white focus:border-purple-500 w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border-2 border-gray-200 rounded appearance-none',\n  error:\n    'focus:ring-red-500 focus:border-red-500 sm:text-sm block w-full pr-10 text-red-900 placeholder-red-300 border-red-300 rounded-md',\n}\n\nconst Input: React.FC<Props & InputHTMLAttributes<HTMLInputElement>> = memo(\n  ({ register, name, errors, placeholder, ...rest }) => {\n    const hasError: boolean = errors[name]\n    return (\n      <div>\n        <div className=\"relative mt-1 rounded-md shadow-sm\">\n          <input\n            {...register(name, { required: true, minLength: 6 })}\n            className={\n              'focus:outline-none ' +\n              clsx(hasError && styles.error, !hasError && styles.basic)\n            }\n            placeholder={placeholder}\n            {...rest}\n          />\n\n          {hasError && (\n            <div className=\"absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none\">\n              <ExclamationCircleIcon\n                className=\"w-5 h-5 text-red-500\"\n                aria-hidden=\"true\"\n              />\n            </div>\n          )}\n        </div>\n        {hasError && (\n          <p className=\"mt-2 text-sm text-red-600\">\n            Your password must be less than 4 characters.\n          </p>\n        )}\n      </div>\n    )\n  }\n)\n\n```",
          createdAt: '2021-12-09T04:53:09.000Z',
          updatedAt: '2021-12-09T16:34:05.000Z',
        },
        {
          id: 53,
          title:
            'I was challenged reusable input component with React Hook Form',
          body: '- [React without memo](https://twitter.com/reactjs/status/1466465874039222275?utm_campaign=thisweekinreact&utm_medium=email&utm_source=Revue%20newsletter)\n- [Get Started | React Hook Form - Simple React forms validation](https://react-hook-form.com/get-started)',
          createdAt: '2021-12-08T23:54:23.000Z',
          updatedAt: '2021-12-08T23:54:23.000Z',
        },
        {
          id: 52,
          title: 'superstruct',
          body: "is masterpiece of validation library ever.\n\n```js\nimport { is, define, object, string } from 'superstruct'\nimport isUuid from 'is-uuid'\nimport isEmail from 'is-email'\n\nconst Email = define('Email', isEmail)\nconst Uuid = define('Uuid', isUuid.v4)\n\nconst User = object({\n  id: Uuid,\n  email: Email,\n  name: string(),\n})\n\nconst data = {\n  id: 'c8d63140-a1f7-45e0-bfc6-df72973fea86',\n  email: 'jane@example.com',\n  name: 'Jane',\n}\n\nif (is(data, User)) {\n  // Your data is guaranteed to be valid in this block.\n}\n\n```\n\n- [ianstormtaylor/superstruct: A simple and composable way to validate data in JavaScript (and TypeScript).](https://github.com/ianstormtaylor/superstruct)",
          createdAt: '2021-12-06T23:19:43.000Z',
          updatedAt: '2021-12-06T23:19:43.000Z',
        },
        {
          id: 51,
          title: "I'm tired as a OSS fan boy",
          body: "I'm so busy recently.  \nI can't take plenty time for explore open source topics which I've got interest.  \nProbably I need technique for make OSS time constantly in working time.  \nI have already that idea but I couldn't do actually...\n\n\n-  [javascript ArrayBuffer, what's it for? - Stack Overflow](https://stackoverflow.com/questions/11554006/javascript-arraybuffer-whats-it-for)\n- [[ESLint] Feedback for 'exhaustive-deps' lint rule · Issue #14920 · facebook/react](https://github.com/facebook/react/issues/14920)",
          createdAt: '2021-11-29T18:02:23.000Z',
          updatedAt: '2021-11-29T18:02:23.000Z',
        },
        {
          id: 49,
          title:
            'Hide error within Redux-Toolkit and Redux-persist combination ',
          body: '- [javascript - Getting an error "A non-serializable value was detected in the state" when using redux toolkit - but NOT with normal redux - Stack Overflow](https://stackoverflow.com/questions/61704805/getting-an-error-a-non-serializable-value-was-detected-in-the-state-when-using)',
          createdAt: '2021-11-25T16:25:26.000Z',
          updatedAt: '2021-11-25T16:25:26.000Z',
        },
      ],
      total: 60,
    })
  }),
  http.get('/api/post/:id', async () => {
    return HttpResponse.json({
      id: 52,
      title: 'superstruct',
      body: "is masterpiece of validation library ever.\n\n```js\nimport { is, define, object, string } from 'superstruct'\nimport isUuid from 'is-uuid'\nimport isEmail from 'is-email'\n\nconst Email = define('Email', isEmail)\nconst Uuid = define('Uuid', isUuid.v4)\n\nconst User = object({\n  id: Uuid,\n  email: Email,\n  name: string(),\n})\n\nconst data = {\n  id: 'c8d63140-a1f7-45e0-bfc6-df72973fea86',\n  email: 'jane@example.com',\n  name: 'Jane',\n}\n\nif (is(data, User)) {\n  // Your data is guaranteed to be valid in this block.\n}\n\n```\n\n- [ianstormtaylor/superstruct: A simple and composable way to validate data in JavaScript (and TypeScript).](https://github.com/ianstormtaylor/superstruct)",
      createdAt: '2021-12-06T23:19:43.000Z',
      updatedAt: '2021-12-06T23:19:43.000Z',
    })
  }),
  http.delete('/post/:id', async () => {
    return HttpResponse.json([])
  }),
  http.post('/signup', async () => {
    return HttpResponse.json([])
  }),
  http.post('/login', async () => {
    return HttpResponse.json([])
  }),
  http.get('/logout', async () => {
    return HttpResponse.json([])
  }),
  http.post('/create', async () => {
    return HttpResponse.json([])
  }),
  http.post('/update', async () => {
    return HttpResponse.json([])
  }),
  http.get('http://localhost:3000/api/stock_list', async () => {
    return HttpResponse.json([])
  }),
]
