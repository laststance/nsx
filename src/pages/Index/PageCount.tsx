import type { HTMLAttributes } from 'react'
import React, { memo } from 'react'

import type { PageState } from '../../redux/pageSlice'

interface Props {
  page: PageState['page']
  totalPage: PageState['totalPage']
}

const PageCount: React.FC<Props & HTMLAttributes<HTMLDivElement>> = memo(
  ({ page, totalPage, ...rest }) => (
    <div {...rest}>
      {page} / {totalPage}
    </div>
  )
)
PageCount.displayName = 'PageCounter'

export default PageCount
