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
      state.listOrder.push(payload)
      state.keyOrderActive = payload.key
      state.orderDetail = { key: payload.key, listOrder: new Array() }
    },
    removeOrder: (state, { payload }) => {
      const index = state.listOrder.findIndex(order => order?.key == payload)
      state.listOrder = state.listOrder.length != 0 ? state.listOrder.filter(order => order.key !== payload) : []
      if (state.keyOrderActive == payload) {
        state.keyOrderActive =
          state.listOrder.length === 1
            ? state.listOrder[0]?.key
            : state.listOrder[index - 1]?.key ?? state.listOrder[index + 1]?.key ?? null
      }

      // load orderDetail if keyOrderActive !null
      const keyActive = state.keyOrderActive
      if (keyActive == null) {
        state.orderDetail = null
      } else {
        const listOrder = state.listOrder
        const order = listOrder.find(order => order.key == keyActive)
        listOrder
          ? (state.orderDetail = {
              key: order?.key,
              listOrder: order?.orderDetail
            })
          : (state.orderDetail = null)
      }
    },
    updateOrder: (state, { payload }) => {
      const orderDetail = state.orderDetail.listOrder
      const productExits = orderDetail.find(item => item.id == payload.orderDetail.id)
      if (payload.status == 'up') {
        if (!productExits) {
          state.orderDetail = {
            key: payload?.key,
            listOrder: state.orderDetail
              ? [...state.orderDetail.listOrder, payload.orderDetail]
              : [{ ...payload.orderDetail }]
          }
        } else {
          const updatedOrderList = state.orderDetail.listOrder.map(item =>
            item.id === payload.orderDetail.id ? { ...item, quantity: item.quantity + 1 } : item
          )

          state.orderDetail = {
            key: payload?.key,
            listOrder: updatedOrderList
          }
        }
      } else if (payload.status == 'change') {
        let updatedOrderList = state.orderDetail.listOrder.map(item =>
          item.id === payload.orderDetail.id ? { ...item, quantity: payload.quantity } : item
        )
        state.orderDetail = {
          key: payload?.key,
          listOrder: updatedOrderList
        }
      } else {
        let updatedOrderList = state.orderDetail.listOrder.map(item =>
          item.id === payload.orderDetail.id ? { ...item, quantity: item.quantity - 1 } : item
        )
        if (productExits.quantity == 1) {
          updatedOrderList = state.orderDetail.listOrder.filter(item => item.id !== payload.orderDetail.id)
        }

        state.orderDetail = {
          key: payload?.key,
          listOrder: updatedOrderList
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
    },
    removeOrderDetailInOrder: (state, { payload }) => {
      const updatedOrderList = state.orderDetail.listOrder.filter(item => item.id !== payload.id)
      state.orderDetail = {
        key: payload?.key,
        listOrder: updatedOrderList
      }
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
