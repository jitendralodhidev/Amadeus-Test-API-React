import React, { useState } from 'react';
import { Form, Input, InputNumber, DatePicker, Select, Button, message, AutoComplete } from 'antd';
import './HotelBooking.css';
import WebAppAPI from '../../api';

const { Option } = Select;

const HotelBookingForm = () => {
  const [hotelIds, setHotelIds] = useState('');
  const [adults, setAdults] = useState(1);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [offers, setOffers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hotelOptions, setHotelOptions] = useState([]);

  const handleSearchHotelIds = async (value) => {
    if (!value) {
      setHotelOptions([]);
      return;
    }
    try {
      const params = {
        keyword: value,
        subType: 'HOTEL_LEISURE',
      }
      const res = await WebAppAPI.Hotel.getHotelSuggestion(params);
      const options = res.data.map((hotel) => ({
        value: hotel.hotelIds[0],
        label: `${hotel.name} (${hotel.address.cityName}, ${hotel.address.countryCode})`,
      }));
      setHotelOptions(options);
    } catch (error) {
      console.error('Error fetching hotel data:', error);
      setHotelOptions([]);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    setError(null);

    const params = {
      hotelIds: values.hotelIds.split(',').map(id => id.trim()),
      adults: values.adults,
      checkInDate: values.checkInDate.format('YYYY-MM-DD'),
      checkOutDate: values.checkOutDate.format('YYYY-MM-DD'),
    };

    try {
      const res = await WebAppAPI.Hotel.hotelOffers(params);
      if (res.error) {
        message.error(res.msg);
      } else {
        if (res.data.length === 0) {
          message.warning('No hotel offers found');
        } else {
          setOffers(res.data);
        }
      }
    } catch (error) {
      setError('Failed to fetch hotel offers. Please try again.');
      message.error('Failed to fetch hotel offers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2 className="form-title">Hotel Booking Form</h2>
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            adults: 1,
            roomQuantity: 1,
            paymentPolicy: 'NONE',
            boardType: 'ROOM_ONLY',
            includeClosed: false,
            bestRateOnly: true,
            lang: 'en',
          }}
        >
          <Form.Item
            label="Hotel IDs (comma-separated)"
            name="hotelIds"
            rules={[{ required: true, message: 'Please input hotel IDs!' }]}
          >
            <AutoComplete
              options={hotelOptions}
              onSearch={handleSearchHotelIds}
              onSelect={(value) => setHotelIds(value)}
              value={hotelIds}
              onChange={(value) => setHotelIds(value)}
              placeholder='Example : MCLONGHM'
            >
              <Input />
            </AutoComplete>
          </Form.Item>

          <Form.Item
            label="Number of Adults"
            name="adults"
            rules={[{ required: true, message: 'Please input number of adults!' }]}
          >
            <InputNumber min={1} max={9} value={adults} onChange={setAdults} />
          </Form.Item>

          <Form.Item
            label="Check-In Date"
            name="checkInDate"
            rules={[{ required: true, message: 'Please select check-in date!' }]}
          >
            <DatePicker value={checkInDate} onChange={setCheckInDate} />
          </Form.Item>

          <Form.Item
            label="Check-Out Date"
            name="checkOutDate"
            rules={[{ required: true, message: 'Please select check-out date!' }]}
          >
            <DatePicker value={checkOutDate} onChange={setCheckOutDate} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>Search</Button>
          </Form.Item>
        </Form>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {offers && (
          <div>
            <h2>Hotel Offers</h2>
            <pre>{JSON.stringify(offers, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelBookingForm;
