import React, { memo } from 'react'

import PageCount from '../../pages/Index/PageCount'
import type { PagenationState } from '../../redux/pagenationSlice'
import { updatePage, selectPagenation } from '../../redux/pagenationSlice'
import { dispatch, getRootState } from '../../redux/store'
import ArrowButton from '../ArrowButton'

import type { UsePagenationResult } from './usePagination'

export interface Props {
  page: PagenationState['page']
  totalPage: UsePagenationResult['totalPage']
}

const prevPage = () => {
  const { page } = selectPagenation(getRootState())
  dispatch(updatePage({ page: page - 1 }))
}
const nextPage = () => {
  const { page } = selectPagenation(getRootState())
  dispatch(updatePage({ page: page + 1 }))
}

const ButtonGroup: React.FC<Props> = memo(({ page, totalPage }) => (
  <div className="flex items-center justify-center space-x-4 p-8 px-10">
    <ArrowButton
      direction="left"
      onClick={prevPage}
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
      onClick={nextPage}
      disabled={page === totalPage ? true : false}
      data-cy="next-page-btn"
    />
  </div>
))
ButtonGroup.displayName = 'Pagination.ButtonGroup'

export default ButtonGroup
