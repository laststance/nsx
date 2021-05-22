import React, { useEffect } from 'react'
import { Dispatch } from 'redux'
import { useDispatch } from 'react-redux'
import { DequeueSnackbarAction } from '../redux'
import { SnackBarMessage } from '../../DataStructure'

interface Props {
  message: SnackBarMessage
}

const SnackBar: React.FC<Props> = ({ message }) => {
  const dispatch: Dispatch<DequeueSnackbarAction> = useDispatch()
  useEffect(() => {
    setTimeout(() => dispatch({ type: 'DEQUEUE_SNACKBAR_MESSAGE' }), 9000)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div className="z-10 absolute bg-green-400 w-40 h-24">
      <p>{message}</p>
    </div>
  )
}

export default SnackBar
