import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  listOrder: [],
  keyOrderActive: null,
  orderDetail: null
}

/*
listOrder: {
  key
  label
  orderDetail: [
    {
      id
      name
      price
      quantity
      note
    }
  ]  
}

orderDetail :{
  key
  listOrder: [
    {
      id
      name
      price
      quantity
      note
    }
  ]
}
*/

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addOrder: (state, { payload }) => {
      console.log(payload.key, 'payload.key')
      console.log(payload, 'payload')
      state.listOrder.push(payload)
      state.keyOrderActive = payload.key
      state.orderDetail = { key: payload.key, listOrder: new Array() }
      console.log(state.listOrder, '  state.listOrder')
    },
    removeOrder: (state, { payload }) => {
      const index = state.listOrder.findIndex(order => order?.key == payload)
      state.listOrder = state.listOrder.length != 0 ? state.listOrder.filter(order => order.key !== payload) : []
      if (state.keyOrderActive == payload) {
        state.keyOrderActive =
          state.listOrder.length != 0 ? state.listOrder[index - 1]?.key ?? state.listOrder[index + 1]?.key : null
      }
      state.orderDetail = null
    },
    updateOrder: (state, { payload }) => {
      if (payload.status == 'up') {
        console.log('vo up')
        state.orderDetail = {
          key: payload?.key,
          listOrder: state.orderDetail
            ? [...state.orderDetail.listOrder, payload.orderDetail]
            : [{ ...payload.orderDetail }]
        }
      }
      const indexListOrder = state.listOrder.findIndex(order => order.key === state.keyOrderActive)

      state.listOrder[indexListOrder] = {
        key: state.listOrder[indexListOrder].key,
        label: state.listOrder[indexListOrder].label,
        orderDetail: [...state.orderDetail.listOrder]
      }
      state.listOrder = indexListOrder != -1 ? [...state.listOrder] : []

      state.keyOrderActive = indexListOrder != -1 ? payload?.key : null
      // console.log(index, 'index')
      // // Check if orderDetail exists
      // // if (state.orderDetail?.listOrder?.length !== 0) {
      // //   state.orderDetail = { key: payload.key, listOrder: [] }
      // // }
      // const orderIndex = state.orderDetail.listOrder.findIndex(item => item.id === payload.orderDetail.id)
      // if (orderIndex !== undefined) {
      //   const quantity = state?.orderDetail?.listOrder?.[orderIndex]?.quantity
      //   if (payload?.status == 'up') {
      //     state.orderDetail.listOrder[orderIndex] = {
      //       ...state.orderDetail.listOrder[orderIndex],
      //       quantity: quantity + 1
      //     }
      //   } else {
      //     state.orderDetail.listOrder[orderIndex] = {
      //       ...state.orderDetail.listOrder[orderIndex],
      //       quantity: quantity - 1
      //     }
      //   }
      // } else {
      //   state.orderDetail.listOrder.push({
      //     id: payload.orderDetail.id,
      //     name: payload.orderDetail.name,
      //     price: payload.orderDetail.price,
      //     quantity: 1,
      //     note: ''
      //   })
      // }
      // state.listOrder[index].orderDetail = [...state.orderDetail.listOrder]
    },
    removeOrderDetailInOrder: (state, { payload }) => {
      const index = state.listOrder.findIndex(order => order.key === payload.key)
      state.listOrder[index].orderDetail = state.listOrder[index].orderDetail.filter(item => item.id !== payload.id)
      state.orderDetail.listOrder = state.orderDetail.listOrder.filter(item => item.id !== payload.id)
    },
    setKeyOrderActive: (state, { payload }) => {
      const index = state.listOrder.findIndex(order => order.key === payload)
      const orderDetail = state.listOrder[index].orderDetail
      state.keyOrderActive = payload
      state.orderDetail = { key: payload, listOrder: [...orderDetail] }
    }
  }
})

export const { addOrder, removeOrder, updateOrder, setKeyOrderActive, removeOrderDetailInOrder } = orderSlice.actions

export default orderSlice.reducer
