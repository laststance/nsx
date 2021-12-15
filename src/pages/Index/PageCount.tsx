import type { HTMLAttributes } from 'react'
import React, { memo } from 'react'

import type { PagenationState } from '../../redux/pagenationSlice'

interface Props {
  page: PagenationState['page']
  totalPage: PagenationState['totalPage']
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
