import React, { memo } from 'react'

interface Props {
  page: number
  total_page: number
}

const PageNumber: React.FC<Props> = memo(({ page, total_page }) => (
  <div>
    {page} / {total_page}
  </div>
))
PageNumber.displayName = 'PageNumber'

export default PageNumber
