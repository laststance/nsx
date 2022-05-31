import React, { memo } from 'react'

import Layout from '../../../components/Layout/index'

const Setting: React.FC = memo(() => {
  return <div>Setting</div>
})
Setting.displayName = 'Setting'

const SettingPage = memo(() => (
  <Layout className="flex flex-col justify-start">
    <Setting />
  </Layout>
))
SettingPage.displayName = 'SettingPage'

export default SettingPage
