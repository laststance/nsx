import React, { memo } from 'react'

import Layout from '../../../components/Layout/index'

const Config: React.FC = memo(() => {
  return <div>Config</div>
})
Config.displayName = 'Config'

const ConfigPage = memo(() => (
  <Layout className="flex flex-col justify-start">
    <Config />
  </Layout>
))
ConfigPage.displayName = 'ConfigPage'

export default ConfigPage
