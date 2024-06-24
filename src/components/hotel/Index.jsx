import React, { useState } from 'react';
import { Input, Button, List, Card, message } from 'antd';

import WebAppAPI from '../../api';
import { withRouter } from '../../hoc/withRouter';

const HotelSearchForm = (props) => {
  const [city, setCity] = useState('');
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const res = await WebAppAPI.Hotel.getHotel(city);
      if (res.error) {
        message.error(res.msg);
      } else {
        setHotels(res.data);
      }
    } catch (error) {
      message.error('An error occurred while fetching hotels');
    }
    setLoading(false);
  };

  return (
    <div>
      <Input
        placeholder="Enter city"
        value={city}
        onChange={handleCityChange}
        style={{ width: 300, marginRight: 10 }}
      />
      <Button type="primary" onClick={fetchHotels} loading={loading}>
        Search Hotels in Your city
      </Button>
      <Button style={{ marginLeft: 10 }} type="primary" onClick={() => { props.router.navigate('/hotel-booking') }} loading={loading}>
        Book Hotel
      </Button>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={hotels}
        renderItem={hotel => (
          <List.Item>
            <Card title={hotel.name}>
              <p><b>Address:</b> {hotel.address.countryCode}</p>
              <p><b>Latitude:</b> {hotel.geoCode.latitude}</p>
              <p><b>Longitude:</b> {hotel.geoCode.longitude}</p>
              <p><b>Last Update:</b> {hotel.lastUpdate}</p>
            </Card>
          </List.Item>
        )}
        style={{ marginTop: 20 }}
      />
    </div>
  );
};

export default withRouter(HotelSearchForm);
