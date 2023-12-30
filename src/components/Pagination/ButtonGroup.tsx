import React, { memo } from 'react'

import type { PagenationState } from '../../redux/pagenationSlice'
import { updatePage } from '../../redux/pagenationSlice'
import { dispatch } from '../../redux/store'
import ArrowButton from '../ArrowButton/ArrowButton'

import PageCount from './PageCount'
import type { UsePagenationResult } from './usePagination'

interface Props {
  page: PagenationState['page']
  totalPage: UsePagenationResult['totalPage']
}

const prevPage = (page: Props['page']) => () => {
  dispatch(updatePage({ page: page - 1 }))
}
const nextPage = (page: Props['page']) => () => {
  dispatch(updatePage({ page: page + 1 }))
}

const ButtonGroup: React.FC<Props> = memo(({ page, totalPage }) => (
  <div className="flex items-center justify-center space-x-4 p-8 px-10">
    <ArrowButton
      direction="left"
      onClick={prevPage(page)}
      disabled={page <= 1 ? true : false}
      data-testid="prev-page-btn"
    />
    <PageCount
      className="text-color-primary"
      page={page}
      totalPage={totalPage}
      data-testid="page-count"
    />
    <ArrowButton
      direction="right"
      onClick={nextPage(page)}
      disabled={page === totalPage ? true : false}
      data-testid="next-page-btn"
    />
  </div>
))
ButtonGroup.displayName = 'Pagination.ButtonGroup'

export default ButtonGroup
