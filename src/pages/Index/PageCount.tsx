import React, { memo } from 'react'

interface Props {
  page: number
  total_page: number
}

const PageCount: React.FC<Props> = memo(({ page, total_page }) => (
  <div>
    {page} / {total_page}
  </div>
))
PageCount.displayName = 'PageNumber'

export default PageCount
