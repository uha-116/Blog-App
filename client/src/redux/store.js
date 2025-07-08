import {configureStore} from '@reduxjs/toolkit'
import  userauthorslice  from './slices/userauthorslice'

export const reduxstore=configureStore({
    reducer:{
        userauthorlogin:userauthorslice
    }
})