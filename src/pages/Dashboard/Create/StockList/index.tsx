import React, { memo } from 'react'

import { API } from '../../../../redux/API'

function handleClick() {
  // @TODO delete request
  // @TODO insert url&page_name DraftState body
}

const StockList: React.FC = memo(() => {
  const { data } = API.endpoints.getStockList.useQuery()
  if (data === undefined) return <></>

  return (
    <section className="ml-4 w-[30%] overflow-x-visible">
      <div className="items-left flex flex-col gap-2">
        {data.length ? (
          data.map((stock: Stock) => (
            <button
              onClick={handleClick}
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
    </section>
  )
})
StockList.displayName = 'StockList'

export default StockList
