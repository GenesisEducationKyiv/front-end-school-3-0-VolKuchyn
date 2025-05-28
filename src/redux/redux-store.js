import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import tracksReducer from './tracks-reducer';
import formReducer from './form-reducer';
import toastReduceer from './toast-reducer'
import playerReducer from './player-reducer'
import trackModalReducer from './track-modal-reducer'
import confirmReducer from './confirm-reducer'

const reducers = combineReducers({
    tracks: tracksReducer,
    form: formReducer,
    toast: toastReduceer,
    player: playerReducer,
    trackModal: trackModalReducer,
    confirm: confirmReducer,

})

const store = configureStore({
    reducer: reducers,
})

export default store;