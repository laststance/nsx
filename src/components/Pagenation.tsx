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
    <div className="flex justify-center items-center space-x-4 p-10">
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
