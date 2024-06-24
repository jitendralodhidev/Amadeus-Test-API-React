import React, { useState } from 'react';
import { Button, DatePicker, Radio, Form, InputNumber, message, Input } from 'antd';
import WebAppAPI from '../../api';
import FlightOffersTable from './View';
import AirportSuggeston from './SuggestAirport';

import './Index.css';

const { RangePicker } = DatePicker;

const FlightBookingForm = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form] = Form.useForm();

  const handleSearch = async (values) => {
    const data = {
      originLocationCode: values.origin,
      destinationLocationCode: values.destination,
      departureDate: values.date[0].format('YYYY-MM-DD'),
      returnDate: values.date[1].format('YYYY-MM-DD'),
      adults: values.adults,
      // includedAirlineCodes: values.airline || '',
    };

    setLoading(true);
    setError(null);
    try {
      const res = await WebAppAPI.Flight.getOffers(data);
      if (res.error) {
        message.error(res.msg);
      } else {
        res.data.length === 0
          ? message.warning('No direct flight found')
          : setSearchResults(res.data);
      }
    } catch (error) {
      setError('Failed to fetch flight offers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flight-booking-form">
        <p className="form-header">Book Over 600 Airlines</p>
        <Form form={form} layout="vertical" onFinish={handleSearch}>
          <Form.Item name="origin" rules={[{ required: true, message: 'Please enter origin!' }]} className="form-item">
            <AirportSuggeston
              placeholder="Origin Location Code (e.g., SYD)"
              onSelect={(value) => form.setFieldsValue({ origin: value })}
            />
          </Form.Item>

          <Form.Item name="destination" rules={[{ required: true, message: 'Please enter destination!' }]} className="form-item">
            <AirportSuggeston
              placeholder="Destination Location Code (e.g., BKK)"
              onSelect={(value) => form.setFieldsValue({ destination: value })}
            />
          </Form.Item>

          <Form.Item name="date" rules={[{ required: true, message: 'Please select dates!' }]} className="form-item">
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="adults" initialValue={1} rules={[{ required: true, message: 'Please enter number of adults!' }]} className="form-item">
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="airline" rules={[{ message: 'Please enter airline code!' }]} className="form-item">
            <Input placeholder="Included Airline Codes (e.g., TG)" />
          </Form.Item>

          <Form.Item className="form-item">
            <Button type="primary" htmlType="submit" className="search-button" loading={loading}>
              Search
            </Button>
          </Form.Item>
        </Form>
      </div>
      {searchResults?.length > 0 && <FlightOffersTable data={searchResults} />}
    </>
  );
};

export default FlightBookingForm;
