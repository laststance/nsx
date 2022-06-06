import axios from 'axios'
import React, { useLayoutEffect, useState, useCallback } from 'react'

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true }
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions)
  return tab
}

function App() {
  const [state, setState] = useState({ title: '', url: '' })

  useLayoutEffect(() => {
    getCurrentTab().then((tab) =>
      setState(() => {
        return { title: tab.title, url: tab.url }
      })
    )
  }, [])

  const onCheckedHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.checked) return
      axios
        .post('http://localhost:4000/api/push_stock', {
          title: state.title,
          url: state.url,
        })
        .then(() => {
          const span = document.createElement('span')
          span.innerHTML = 'Success!'
          document.querySelector('#popup').appendChild(span)
          setTimeout(() => {
            span.remove()
          }, 2000)
        })
        .catch()
    },
    [state.title, state.url]
  )

  return (
    <main id="app-root">
      <section>
        <p>{state.title.length ? state.title : ''}</p>
      </section>
      <section>
        <input type="checkbox" onChange={onCheckedHandler} />
      </section>
    </main>
  )
}

export default App
