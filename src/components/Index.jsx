import React from 'react';
import { Tabs } from 'antd';
import TabPane from 'antd/es/tabs/TabPane';

// Importing components
import FlightBookingForm from './flights/Index';
import HotelSearchForm from './hotel/Index';
import GeolocationComponent from './travel/GeoLocation';

const Home = () => (
  <Tabs defaultActiveKey="1" type="card">
    <TabPane tab="Flights" key="1">
      <FlightBookingForm />
    </TabPane>
    <TabPane tab="Hotel" key="2">
      <HotelSearchForm />
    </TabPane>
    <TabPane tab="Activities" key="3">
      <GeolocationComponent/>
    </TabPane>
  </Tabs>
);
export default Home;