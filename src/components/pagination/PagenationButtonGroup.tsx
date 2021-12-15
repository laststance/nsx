import React, { memo } from 'react'

import ArrowButton from '../../elements/ArrowButton'
import PageCount from '../../pages/Index/PageCount'
import type { PagenationState } from '../../redux/pagenationSlice'

import type { UsePagenationResult } from './usePagination'

interface Props {
  page: PagenationState['page']
  totalPage: UsePagenationResult['totalPage']
  dispatch: UsePagenationResult['dispatch']
  prevPage: UsePagenationResult['prevPage']
  nextPage: UsePagenationResult['nextPage']
}

const PagenationButtonGroup: React.FC<Props> = memo(
  ({ page, totalPage, dispatch, prevPage, nextPage }) => (
    <div className="flex items-center justify-center p-8 px-10 space-x-4">
      <ArrowButton
        direction="left"
        onClick={() => prevPage(dispatch, page)}
        disabled={page <= 1 ? true : false}
        data-cy="prev-page-btn"
      />
      <PageCount page={page} totalPage={totalPage} data-cy="page-count" />
      <ArrowButton
        direction="right"
        onClick={() => nextPage(dispatch, page)}
        disabled={page === totalPage ? true : false}
        data-cy="next-page-btn"
      />
    </div>
  )
)
PagenationButtonGroup.displayName = 'PagenationButtonGroup'

export default PagenationButtonGroup
