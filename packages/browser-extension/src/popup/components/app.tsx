import axios from 'axios'
import React, { useLayoutEffect, useState, useCallback } from 'react'

import { getCurrentTab } from '../../background/background.js'

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
        .post(process.env.ENDPOINT, {
          title: state.title,
          url: state.url,
        })
        .then(() => {
          const span = document.createElement('span')
          document.querySelector('#popup').appendChild(span)
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
