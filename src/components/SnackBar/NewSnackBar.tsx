import React, { memo } from 'react'

const NewSnackBar: React.FC = memo(() => {
  return (
    <div
      className="mb-6 box-border rounded border border-solid border-transparent bg-emerald-50 px-4 py-2 font-sans text-sm leading-5 text-teal-800"
      style={{ borderImage: 'initial' }}
    >
      <div className="mb-2 box-border flex items-center text-sm text-teal-800">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mr-2 box-border h-6 w-6 leading-5"
          role="img"
          aria-label="check-circle-full"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M0 8a8 8 0 0 1 8-8 8.01 8.01 0 0 1 8 8A8 8 0 1 1 0 8zm12.814-2.919a1 1 0 1 0-1.628-1.162l-4.314 6.04-2.165-2.166a1 1 0 0 0-1.414 1.414l3 3a1 1 0 0 0 1.52-.126l5-7z"
            fill="#6F7488"
            className="box-border text-teal-800"
            style={{ fill: 'rgb(30, 158, 124' }}
          ></path>
        </svg>
        <h1
          className="m-0 box-border inline-block text-base font-semibold"
          style={{ lineHeight: 1.2, textRendering: 'optimizeLegibility' }}
        >
          You have successfully unsubscribed.
        </h1>
      </div>
      <p className="my-0 ml-6 mr-0 box-border pl-2 text-sm text-teal-800">
        You'll no longer receive our opt-in messages, but you can change your
        decision at any time.
      </p>
    </div>
  )
})
NewSnackBar.displayName = 'SnackBar'

export default NewSnackBar
