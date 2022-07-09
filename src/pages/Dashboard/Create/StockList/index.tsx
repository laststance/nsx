import React, { memo } from 'react'

import { API } from '../../../../redux/API'

import { handleClick } from './handleClick'

const StockList: React.FC = memo(() => {
  const { data, refetch } = API.endpoints.getStockList.useQuery()
  if (data === undefined) return <></>

  return (
    <div className="items-left flex flex-col gap-2">
      {data.length ? (
        data.map((stock: Stock) => (
          <button
            onClick={handleClick(stock, refetch)}
            className="text-color-primary whitespace-nowrap text-left font-bold hover:text-cyan-300"
            key={stock.id}
          >
            {stock.pageTitle}
          </button>
        ))
      ) : (
        <></>
      )}
    </div>
  )
})
StockList.displayName = 'StockList'

export default StockList
