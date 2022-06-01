import React from 'react'
import ReactDOM from 'react-dom/client'

import { sleep } from '../lib/sleep'

import App from './App'

test('My React App is working', async () => {
  const container = window.document.createElement('div')
  const root = ReactDOM.createRoot(container)

  root.render(<App />)

  await sleep(300)

  expect(container).toMatchInlineSnapshot(`
<div>
  <div
    class="bg-primary flex h-screen w-screen flex-col justify-between"
    data-cy="top-page-content-root"
  >
    <header
      class="w-full border-b border-gray-200"
      data-cy="header"
    >
      <div
        class="container mx-auto my-4 flex h-16 flex-col flex-wrap items-center gap-2 sm:flex-row sm:content-center"
      >
        <a
          class="col-auto"
          data-cy="blog-title-top-page-link"
          href="/"
        >
          <h1
            class="text-color-primary text-xl font-bold sm:text-2xl"
          >
            Today I Learned
          </h1>
        </a>
        <p
          class="text-color-secondary justify-self-start text-base sm:pt-2.5 sm:pl-1.5"
        >
          Daily log for programming things
          <span
            aria-label="note emoji"
            class="pl-1"
            role="img"
          >
            📝
          </span>
        </p>
        <div
          class="flex space-x-2 sm:flex-grow sm:justify-end"
        >
          <div
            class="flex-initial"
          >
            <a
              href="/about"
            >
              <div
                class="text-color-secondary text-lg hover:text-gray-300 dark:hover:text-gray-500"
              >
                about
              </div>
            </a>
          </div>
          <div
            class="flex-initial pt-0.5"
          >
            <label
              class="sr-only"
              id="headlessui-listbox-label-:r0:"
            >
              Theme
            </label>
            <div
              class="relative"
            >
              <button
                aria-expanded="false"
                aria-haspopup="true"
                aria-labelledby="headlessui-listbox-label-:r0: headlessui-listbox-button-:r1:"
                data-cy="theme-menu-button"
                id="headlessui-listbox-button-:r1:"
                type="button"
              >
                <span
                  class="dark:hidden"
                >
                  <svg
                    class="h-6 w-6"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      class="stroke-neutral-400 dark:stroke-slate-500"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                    <path
                      class="stroke-slate-400 dark:stroke-slate-500"
                      d="M12 4v1M17.66 6.344l-.828.828M20.005 12.004h-1M17.66 17.664l-.828-.828M12 20.01V19M6.34 17.664l.835-.836M3.995 12.004h1.01M6 6l.835.836"
                    />
                  </svg>
                </span>
                <span
                  class="hidden dark:inline"
                >
                  <svg
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      class="fill-transparent"
                      clip-rule="evenodd"
                      d="M17.715 15.15A6.5 6.5 0 0 1 9 6.035C6.106 6.922 4 9.645 4 12.867c0 3.94 3.153 7.136 7.042 7.136 3.101 0 5.734-2.032 6.673-4.853Z"
                      fill-rule="evenodd"
                    />
                    <path
                      class="fill-slate-400 dark:fill-slate-500"
                      d="m17.715 15.15.95.316a1 1 0 0 0-1.445-1.185l.495.869ZM9 6.035l.846.534a1 1 0 0 0-1.14-1.49L9 6.035Zm8.221 8.246a5.47 5.47 0 0 1-2.72.718v2a7.47 7.47 0 0 0 3.71-.98l-.99-1.738Zm-2.72.718A5.5 5.5 0 0 1 9 9.5H7a7.5 7.5 0 0 0 7.5 7.5v-2ZM9 9.5c0-1.079.31-2.082.845-2.93L8.153 5.5A7.47 7.47 0 0 0 7 9.5h2Zm-4 3.368C5 10.089 6.815 7.75 9.292 6.99L8.706 5.08C5.397 6.094 3 9.201 3 12.867h2Zm6.042 6.136C7.718 19.003 5 16.268 5 12.867H3c0 4.48 3.588 8.136 8.042 8.136v-2Zm5.725-4.17c-.81 2.433-3.074 4.17-5.725 4.17v2c3.552 0 6.553-2.327 7.622-5.537l-1.897-.632Z"
                    />
                    <path
                      class="fill-slate-400 dark:fill-slate-500"
                      clip-rule="evenodd"
                      d="M17 3a1 1 0 0 1 1 1 2 2 0 0 0 2 2 1 1 0 1 1 0 2 2 2 0 0 0-2 2 1 1 0 1 1-2 0 2 2 0 0 0-2-2 1 1 0 1 1 0-2 2 2 0 0 0 2-2 1 1 0 0 1 1-1Z"
                      fill-rule="evenodd"
                    />
                  </svg>
                </span>
              </button>
            </div>
          </div>
          <div
            class="flex-initial"
          >
            <a
              href="https://github.com/laststance/nsx"
              rel="noreferrer"
              target="_blank"
            >
              <svg
                class="inline h-6 w-6 text-gray-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <title>
                  Github
                </title>
                <path
                  clip-rule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  fill-rule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </header>
    <main
      class="container mx-auto flex-grow px-4 py-4 flex flex-col justify-between"
    >
      <div
        class="flex h-full flex-col justify-between"
      >
        <ul
          class="post-row-container"
        >
          <li
            class="post-row"
          >
            <div
              class="w-24 flex-initial flex-shrink-0 text-center text-lg text-gray-500"
            >
              01/14/22
            </div>
            <div
              class="w-64 flex-initial flex-shrink-0 break-all text-lg sm:w-auto"
            >
              <a
                class="text-color-primary hover:text-gray-400"
                data-cy="single-post-page-link-1"
                href="/post/64"
              >
                What is matter my $500 for
              </a>
            </div>
          </li>
          <li
            class="post-row"
          >
            <div
              class="w-24 flex-initial flex-shrink-0 text-center text-lg text-gray-500"
            >
              12/29/21
            </div>
            <div
              class="w-64 flex-initial flex-shrink-0 break-all text-lg sm:w-auto"
            >
              <a
                class="text-color-primary hover:text-gray-400"
                data-cy="single-post-page-link-2"
                href="/post/63"
              >
                Please MUI Components all argTypes Json generator
              </a>
            </div>
          </li>
          <li
            class="post-row"
          >
            <div
              class="w-24 flex-initial flex-shrink-0 text-center text-lg text-gray-500"
            >
              12/27/21
            </div>
            <div
              class="w-64 flex-initial flex-shrink-0 break-all text-lg sm:w-auto"
            >
              <a
                class="text-color-primary hover:text-gray-400"
                data-cy="single-post-page-link-3"
                href="/post/62"
              >
                Fully Design Token Styling
              </a>
            </div>
          </li>
          <li
            class="post-row"
          >
            <div
              class="w-24 flex-initial flex-shrink-0 text-center text-lg text-gray-500"
            >
              12/27/21
            </div>
            <div
              class="w-64 flex-initial flex-shrink-0 break-all text-lg sm:w-auto"
            >
              <a
                class="text-color-primary hover:text-gray-400"
                data-cy="single-post-page-link-4"
                href="/post/61"
              >
                figma cource 7 hours
              </a>
            </div>
          </li>
          <li
            class="post-row"
          >
            <div
              class="w-24 flex-initial flex-shrink-0 text-center text-lg text-gray-500"
            >
              12/25/21
            </div>
            <div
              class="w-64 flex-initial flex-shrink-0 break-all text-lg sm:w-auto"
            >
              <a
                class="text-color-primary hover:text-gray-400"
                data-cy="single-post-page-link-5"
                href="/post/60"
              >
                Override interface properly type
              </a>
            </div>
          </li>
          <li
            class="post-row"
          >
            <div
              class="w-24 flex-initial flex-shrink-0 text-center text-lg text-gray-500"
            >
              12/24/21
            </div>
            <div
              class="w-64 flex-initial flex-shrink-0 break-all text-lg sm:w-auto"
            >
              <a
                class="text-color-primary hover:text-gray-400"
                data-cy="single-post-page-link-6"
                href="/post/59"
              >
                I have no religion
              </a>
            </div>
          </li>
          <li
            class="post-row"
          >
            <div
              class="w-24 flex-initial flex-shrink-0 text-center text-lg text-gray-500"
            >
              12/24/21
            </div>
            <div
              class="w-64 flex-initial flex-shrink-0 break-all text-lg sm:w-auto"
            >
              <a
                class="text-color-primary hover:text-gray-400"
                data-cy="single-post-page-link-7"
                href="/post/58"
              >
                zzzzsb
              </a>
            </div>
          </li>
          <li
            class="post-row"
          >
            <div
              class="w-24 flex-initial flex-shrink-0 text-center text-lg text-gray-500"
            >
              12/21/21
            </div>
            <div
              class="w-64 flex-initial flex-shrink-0 break-all text-lg sm:w-auto"
            >
              <a
                class="text-color-primary hover:text-gray-400"
                data-cy="single-post-page-link-8"
                href="/post/57"
              >
                validation
              </a>
            </div>
          </li>
          <li
            class="post-row"
          >
            <div
              class="w-24 flex-initial flex-shrink-0 text-center text-lg text-gray-500"
            >
              12/17/21
            </div>
            <div
              class="w-64 flex-initial flex-shrink-0 break-all text-lg sm:w-auto"
            >
              <a
                class="text-color-primary hover:text-gray-400"
                data-cy="single-post-page-link-9"
                href="/post/56"
              >
                monorepo?
              </a>
            </div>
          </li>
          <li
            class="post-row"
          >
            <div
              class="w-24 flex-initial flex-shrink-0 text-center text-lg text-gray-500"
            >
              12/16/21
            </div>
            <div
              class="w-64 flex-initial flex-shrink-0 break-all text-lg sm:w-auto"
            >
              <a
                class="text-color-primary hover:text-gray-400"
                data-cy="single-post-page-link-10"
                href="/post/55"
              >
                migrated vite!
              </a>
            </div>
          </li>
          <li
            class="post-row"
          >
            <div
              class="w-24 flex-initial flex-shrink-0 text-center text-lg text-gray-500"
            >
              12/09/21
            </div>
            <div
              class="w-64 flex-initial flex-shrink-0 break-all text-lg sm:w-auto"
            >
              <a
                class="text-color-primary hover:text-gray-400"
                data-cy="single-post-page-link-11"
                href="/post/54"
              >
                Making Tailwind CSS + React-Hook-Form &lt;Input /&gt;
              </a>
            </div>
          </li>
          <li
            class="post-row"
          >
            <div
              class="w-24 flex-initial flex-shrink-0 text-center text-lg text-gray-500"
            >
              12/09/21
            </div>
            <div
              class="w-64 flex-initial flex-shrink-0 break-all text-lg sm:w-auto"
            >
              <a
                class="text-color-primary hover:text-gray-400"
                data-cy="single-post-page-link-12"
                href="/post/53"
              >
                I was challenged reusable input component with React Hook Form
              </a>
            </div>
          </li>
          <li
            class="post-row"
          >
            <div
              class="w-24 flex-initial flex-shrink-0 text-center text-lg text-gray-500"
            >
              12/07/21
            </div>
            <div
              class="w-64 flex-initial flex-shrink-0 break-all text-lg sm:w-auto"
            >
              <a
                class="text-color-primary hover:text-gray-400"
                data-cy="single-post-page-link-13"
                href="/post/52"
              >
                superstruct
              </a>
            </div>
          </li>
          <li
            class="post-row"
          >
            <div
              class="w-24 flex-initial flex-shrink-0 text-center text-lg text-gray-500"
            >
              11/30/21
            </div>
            <div
              class="w-64 flex-initial flex-shrink-0 break-all text-lg sm:w-auto"
            >
              <a
                class="text-color-primary hover:text-gray-400"
                data-cy="single-post-page-link-14"
                href="/post/51"
              >
                I'm tired as a OSS fan boy
              </a>
            </div>
          </li>
          <li
            class="post-row"
          >
            <div
              class="w-24 flex-initial flex-shrink-0 text-center text-lg text-gray-500"
            >
              11/26/21
            </div>
            <div
              class="w-64 flex-initial flex-shrink-0 break-all text-lg sm:w-auto"
            >
              <a
                class="text-color-primary hover:text-gray-400"
                data-cy="single-post-page-link-15"
                href="/post/49"
              >
                Hide error within Redux-Toolkit and Redux-persist combination 
              </a>
            </div>
          </li>
        </ul>
        <div
          class="flex items-center justify-center space-x-4 p-8 px-10"
        >
          <button
            class="flex h-10 w-14 items-center justify-center rounded border border-gray-500 bg-white hover:border-gray-200 hover:bg-gray-100 hover:text-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-30"
            data-cy="prev-page-btn"
            disabled=""
          >
            <svg
              class="h-6 w-6"
              data-testid="arrow-left"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 16l-4-4m0 0l4-4m-4 4h18"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
          </button>
          <div
            class="text-color-primary"
            data-cy="page-count"
          >
            1
             / 
            4
          </div>
          <button
            class="flex h-10 w-14 items-center justify-center rounded border border-gray-500 bg-white hover:border-gray-200 hover:bg-gray-100 hover:text-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-30"
            data-cy="next-page-btn"
          >
            <svg
              class="h-6 w-6"
              data-testid="arrow-right"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17 8l4 4m0 0l-4 4m4-4H3"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
          </button>
        </div>
      </div>
    </main>
    <footer
      class="w-full"
    >
      <div
        class="flex w-full flex-col items-center border-t border-gray-200 px-6"
      >
        <div
          class="py-6 text-center sm:w-2/3"
        >
          <p
            class="text-sm text-gray-600"
          >
            © 2022 by Ryota Murakami
          </p>
        </div>
      </div>
    </footer>
  </div>
</div>
`)

  root.unmount()

  expect(container).toMatchInlineSnapshot(`<div />`)
})
