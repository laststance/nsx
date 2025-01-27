import React, { memo } from 'react'

import { API } from '../../../../redux/API'

import { handleClick } from './handleClick'

const StockList: React.FC = memo(() => {
  const { data, refetch } = API.endpoints.getStockList.useQuery()
  if (data === undefined) return null

  return (
    <div className="items-left flex flex-col gap-2">
      {data.length
        ? data.map((stock: Stock) => (
            <button
              onClick={handleClick(stock, refetch)}
              className="text-color-primary text-left font-bold whitespace-nowrap hover:text-cyan-300"
              key={stock.id}
            >
              {stock.pageTitle}
            </button>
          ))
        : null}
    </div>
  )
})
StockList.displayName = 'StockList'

export default StockList
