import React from 'react';
import PhotoGrid from '../components/PhotoGrid';
import StudioBanner from '../components/StudioBanner';
import ServiceCards from '../components/ServiceCards';
import Location from '../components/Location';
import VideoSection from '../components/VideoSection';
import Equipe from '../components/Equipe';

const Home = () => {
  return (
    <>
      <PhotoGrid />
      <ServiceCards />
      <StudioBanner />
      <Equipe />
      <Location />
    </>
  );
};

export default Home;