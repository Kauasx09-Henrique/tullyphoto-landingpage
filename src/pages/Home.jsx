import React from 'react';
import PhotoGrid from '../components/PhotoGrid';
import StudioBanner from '../components/StudioBanner';
import ServiceCards from '../components/ServiceCards';
import Location from '../components/Location';

const Home = () => {
  return (
    <>
      <PhotoGrid />
      <StudioBanner />
      <ServiceCards />
      <Location />
    </>
  );
};

export default Home;