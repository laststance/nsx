import type { HTMLAttributes } from 'react'
import React, { memo } from 'react'

import type { PageState } from '../../redux/pageSlice'

interface Props {
  page: PageState['page']
  total_page: number
}

const PageCount: React.FC<Props & HTMLAttributes<HTMLDivElement>> = memo(
  ({ page, total_page, ...rest }) => (
    <div {...rest}>
      {page} / {total_page}
    </div>
  )
)
PageCount.displayName = 'PageCounter'

export default PageCount
