import React, { useEffect, useState } from 'react';
import WebAppAPI from '../../api';
import { message } from 'antd';

const GeolocationComponent = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [pois, setPois] = useState([]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        error => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  useEffect(() => {
    if (latitude && longitude) {
      const fetchPois = async () => {
        const params = {
          latitude,
          longitude,
          radius: 2
        }
        try {
          const res = WebAppAPI.Travel.getSuggestions(params);
          if (res.error) {
            message.error(res.msg);
          } else {
            res.data.length === 0
              ? message.warning('No direct flight found')
              : setPois(res.data);;
          }
        } catch (error) {
          console.error('Error fetching POIs:', error);
        }
      };

      fetchPois();
    }
  }, [latitude, longitude]);

  return (
    <div>
      <h1>POIs near you</h1>
      {pois.length ? (
        pois.map((poi, index) => (
          <div key={index}>
            <h2>{poi.name}</h2>
            <p>{poi.category}</p>
          </div>
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default GeolocationComponent;
