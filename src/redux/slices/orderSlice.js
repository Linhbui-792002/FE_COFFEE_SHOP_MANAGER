import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  listOrder: [],
  keyOrderActive: null
}

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addOrder: (state, { payload }) => {
      state.listOrder.push(payload)
      state.keyOrderActive = payload?.key
    },
    removeOrder: (state, { payload }) => {
      const index = state.listOrder.findIndex(order => order?.key == payload)
      if (state.keyOrderActive == payload) {
        state.keyOrderActive = state.listOrder[index - 1]?.key ?? state.listOrder[index + 1]?.key
      }
      state.listOrder = state.listOrder.filter(order => order.key !== payload)
    },
    updateOrder: (state, { payload }) => {
      const index = state.listOrder.findIndex(order => order.key === payload.key)
      // console.log(payload.orderDetail)
      state.listOrder[index] = {
        ...state.listOrder[index],
        orderDetail: [...state.listOrder[index].orderDetail, payload.orderDetail]
      }
    },
    setKeyOrderActive: (state, { payload }) => {
      state.keyOrderActive = payload
    }
  }
})

export const { addOrder, removeOrder, updateOrder, setKeyOrderActive } = orderSlice.actions

export default orderSlice.reducer
