import React from 'react';
import PhotoGrid from '../components/PhotoGrid';
import StudioBanner from '../components/StudioBanner';
import ServiceCards from '../components/ServiceCards';
import Location from '../components/Location';
import VideoSection from '../components/VideoSection';

const Home = () => {
  return (
    <>
      <PhotoGrid />
      <StudioBanner />
      <ServiceCards />
      <VideoSection />
      <Location />
    </>
  );
};

export default Home;