import React from 'react'
import { RouteComponentProps } from '@reach/router'
import Layout from '../components/Layout'

const Create: React.FC<RouteComponentProps> = () => {
  // @TODO editor
  // @TODO submit
  return (
    <Layout className="flex flex-col justify-start">
      <input type="text" className="mt-3" />
      <textarea className="w-full h-60 mt-3" />
      <div className="flex gap-4 justify-end">
        <button className="mt-3 shadow bg-green-400 hover:bg-green-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded">
          Submit
        </button>
      </div>
    </Layout>
  )
}

export default Create
