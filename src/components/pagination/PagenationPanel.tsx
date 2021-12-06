import React, { memo } from 'react'

import ArrowButton from '../../elements/ArrowButton'
import PageCount from '../../pages/Index/PageCount'
import type { PageState } from '../../redux/pageSlice'

import type { UsePagenationResult } from './usePagination'

interface Props {
  page: PageState['page']
  totalPage: UsePagenationResult['totalPage']
  dispatch: UsePagenationResult['dispatch']
  prevPage: UsePagenationResult['prevPage']
  nextPage: UsePagenationResult['nextPage']
}

const PagenationPanel: React.FC<Props> = memo(
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
PagenationPanel.displayName = 'PagenationPanel'

export default PagenationPanel
