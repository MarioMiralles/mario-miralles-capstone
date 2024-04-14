import React, { useState, useEffect } from 'react';
import './App.scss';
import UserInput from './components/UserInput/UserInput';
import PublicGalleryModal from './components/PublicGalleryModal/PublicGalleryModal';
import PublicGallery from './components/PublicGallery/PublicGallery';
// import BreakingNews from './components/BreakingNews/BreakingNews';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<UserInput />} />
          <Route exact path="/gallery" element={<PublicGallery />} />
          <Route path="/gallery/:imageId" element={<RenderPublicGalleryModal />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

function RenderPublicGalleryModal() {
  // Extract imageId from URL params
  const { imageId } = useParams();

  // Return null if imageId is not provided
  if (!imageId) {
    return null;
  }

  // Otherwise, render the PublicGalleryModal component with the imageId
  return <PublicGalleryModal imageId={imageId} />;
}

export default App;