import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Tracks from './components/tracks/Tracks';
import Toast from './components/toast/Toast';
import Player from './components/player/Player';
import TrackModal from './components/track-modal/TrackModal';
import TrackFormModal from './components/form/TrackFormModal';
import ConfirmDialog from './components/confirm-dialog/confirmDialog';
import Header from './components/header/Header';
import React from 'react';

import './App.css';

function App(): React.JSX.Element {
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
      <TrackModal />
      <TrackFormModal />
      <ConfirmDialog />
    </BrowserRouter>
  );
}

export default App;