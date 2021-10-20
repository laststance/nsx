import React, { memo } from 'react'

import ArrowButton from '../elements/ArrowButton'
import PageCount from '../pages/Index/PageCount'

interface Props {
  page: number
  total_page: number
  prevPage: AnyFunction
  nextPage: AnyFunction
}

const Pagenation: React.FC<Props> = memo(
  ({ page, total_page, prevPage, nextPage }) => (
    <div className="flex items-center justify-center p-10 space-x-4">
      <ArrowButton
        direction="left"
        onClick={() => prevPage(page)}
        disabled={page <= 1 ? true : false}
      />
      <PageCount page={page} total_page={total_page} />
      <ArrowButton
        direction="right"
        onClick={() => nextPage(page)}
        disabled={page === total_page ? true : false}
      />
    </div>
  )
)
Pagenation.displayName = 'Pagenation'

export default Pagenation
