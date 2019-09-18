import { combineReducers } from 'redux';
import AppNavigation from 'navigation/AppNavigation';
import AsyncStorage from '@react-native-community/async-storage';
import Data from 'services/Data';

const settings = [{
  title: 'Auto Retrieve',
  description: 'Automatically retrieve item every read of nfc',
  flag: true
}, {
  title: 'Auto Remove',
  description: 'Automatically remove item every read of nfc',
  flag: true
}];

const types = {
  LOGOUT: 'LOGOUT',
  LOGIN: 'LOGIN',
  PRODUCT_DETAIL: 'PRODUCT_DETAIL',
  ADD_PRODUCT: 'ADD_PRODUCT',
  UPDATE_PRODUCT: 'UPDATE_PRODUCT',
  REMOVE_PRODUCT: 'REMOVE_PRODUCT',
  UPDATE_SETTING: 'UPDATE_SETTING',
  SELECTION: 'SELECTION',
  nav: null
}

const products = [
  {batch_number: '12312', id: 1, title: '12312', selected: false, link: false},
  {batch_number: '12313', id: 2, title: '12313', selected: false, link: true},
  {batch_number: '12314', id: 3, title: '12314', selected: false, link: true}
];

export const actions = {
  login: (user, token) => {
    return { type: types.LOGIN, user, token };
  },
  logout() {
    return { type: types.LOGOUT };
  },
  addProduct: (product) => {
    return {type: types.ADD_PRODUCT, product}
  },
  updateProduct: (product) => {
    return {type: types.UPDATE_PRODUCT, product: product}
  },
  removeProduct: () => {
    return {type: types.REMOVE_PRODUCT}
  },
  productDetail: (product) => {
    return {type: types.PRODUCT_DETAIL, product: product}
  },
  selection: (product) => {
    return {type: types.SELECTION, product: product}
  },
  updateSetting: (value, index) => {
    settings.map((item, j) => {
      if(index == j){
        item.flag = value
      }
      return item;
    })
    return {type: types.UPDATE_SETTING, settings};
  }
};

const initialState = {
  token: null,
  user: null,
  nav: null,
  products: [],
  settings: settings,
  product: null,
  selection: []
}

storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(`@Tutorial_${key}`, value)
  } catch (e) {
    // saving error
  }
}

const reducer = (state = initialState, action) => {
  const { type, user, token, product} = action;
  const { products } = state;
  switch (type) {
    case types.LOGOUT:
      AsyncStorage.clear();
      return Object.assign({}, initialState);
    case types.LOGIN:
      storeData('token', token);
      Data.setToken(token)
      return { ...state, user, token };
    case types.ADD_PRODUCT:
      return {...state, products: [...products, product]};
    case types.UPDATE_PRODUCT:
      return {
        ...state,
        products: state.products.map((item) => {
          if(item.id == product.id){
            return product
          }else{
            return item
          }
        })
      }
    case types.REMOVE_PRODUCT:
      let newProducts = state.products;
      state.selection.map((mapItem) => {
        newProducts = newProducts.filter(filterItem => {
          return mapItem.id != filterItem.id
        })
      })
      return {
        ...state, 
        products: newProducts,
        selection: []
      }
    case types.PRODUCT_DETAIL: 
      return {
        ...state,
        product: product
      };
    case types.SELECTION: 
      if(state.selection.length == 0){
        return {
          ...state,
          selection: [...state.selection, product]
        }
      }else{
        let existFlag = false;
        let newSelection = [];
        state.selection.map((item, index) => {
          if(item.id == parseInt(product.id)){
            existFlag = true;
            return item;
          }else{
            return item;
          }
        })
        if(existFlag == false){
          newSelection = [...state.selection, product]
        }else{
          newSelection = state.selection.filter((item) => {
            return item.id != product.id
          })
        }
        return {
          ...state,
          selection: newSelection
        };
      }
    case types.UPDATE_SETTING:
      return {...state, settings};
    default:
      return {...state, nav: state.nav};
  }
}
export default reducer;