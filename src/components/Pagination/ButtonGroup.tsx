import React, { memo } from 'react'

import PageCount from '../../pages/Index/PageCount'
import type { PagenationState } from '../../redux/pagenationSlice'
import ArrowButton from '../ArrowButton'

import type { UsePagenationResult } from './usePagination'

interface Props {
  page: PagenationState['page']
  totalPage: UsePagenationResult['totalPage']
  dispatch: UsePagenationResult['dispatch']
  prevPage: UsePagenationResult['prevPage']
  nextPage: UsePagenationResult['nextPage']
}

const ButtonGroup: React.FC<React.PropsWithChildren<Props>> = memo(
  ({ page, totalPage, dispatch, prevPage, nextPage }) => (
    <div className="flex items-center justify-center space-x-4 p-8 px-10">
      <ArrowButton
        direction="left"
        onClick={() => prevPage(dispatch, page)}
        disabled={page <= 1 ? true : false}
        data-cy="prev-page-btn"
      />
      <PageCount
        className="text-color-primary"
        page={page}
        totalPage={totalPage}
        data-cy="page-count"
      />
      <ArrowButton
        direction="right"
        onClick={() => nextPage(dispatch, page)}
        disabled={page === totalPage ? true : false}
        data-cy="next-page-btn"
      />
    </div>
  )
)
ButtonGroup.displayName = 'Pagination.ButtonGroup'

export default ButtonGroup
