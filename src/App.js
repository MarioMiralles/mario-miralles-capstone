import React from 'react';
import './App.scss';
import UserInput from './components/UserInput/UserInput';
import PublicGalleryModal from './components/PublicGalleryModal/PublicGalleryModal';
import PublicGallery from './components/PublicGallery/PublicGallery';
// import BreakingNews from './components/BreakingNews/BreakingNews';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<UserInput />} />
          <Route exact path="/gallery" element={<PublicGallery />} />
          <Route path="/gallery/:imageId" element={<PublicGalleryModal />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
