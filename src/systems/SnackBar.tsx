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
    dispatch({ type: 'DEQUEUE_SNACKBAR_MESSAGE' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <div>{message}</div>
}

export default SnackBar
