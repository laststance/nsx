import type { ComponentProps } from 'react'
import React, { memo } from 'react'

import type { PagenationParamsState } from '../../redux/pagenationSlice'

interface Props {
  page: PagenationParamsState['page']
  totalPage: PagenationParamsState['totalPage']
}

const PageCount: React.FC<ComponentProps<'div'> & Props> = memo(
  ({ page, totalPage, ...rest }) => (
    <div {...rest}>
      {page} / {totalPage}
    </div>
  )
)
PageCount.displayName = 'PageCounter'

export default PageCount
