import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Tracks from './components/tracks/Tracks';
import Toast from './components/toast/Toast';
import Player from './components/player/Player';

import ConfirmDialog from './components/confirm-dialog/ConfirmDialog';
import Header from './components/header/Header';
import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './redux/redux-store';

import Preloader from './assets/Preloader';

import './App.css';

const TrackModal = React.lazy(() => import('./components/track-modal/TrackModal'));
const TrackFormModal = React.lazy(() => import('./components/form/TrackFormModal'));

function App(): React.JSX.Element {

    const isFormModalOpened = useSelector((state: RootState) => state.form.isModalOpened);
    const isTrackModalOpened = useSelector((state: RootState) => state.trackModal.isOpen);
  
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/tracks" replace />} />
        <Route path="/tracks" element={<Tracks />} />
        <Route path="/tracks/:slug" element={<Tracks />} />
      </Routes>
      <Toast />
      <Player />
      <Suspense fallback={<Preloader />}>
        {isTrackModalOpened && <TrackModal />}
      </Suspense>
      <Suspense fallback={<Preloader />}>
        {isFormModalOpened && <TrackFormModal />}
      </Suspense>
      <ConfirmDialog />
    </BrowserRouter>
  );
}

export default App;