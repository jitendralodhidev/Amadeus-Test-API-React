import React, { useState, useEffect } from 'react';
import { Input, AutoComplete, message } from 'antd';
import { debounce } from 'lodash';
import WebAppAPI from '../../api';

const AirportSuggeston = ({ name, placeholder, onSelect }) => {
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const fetchSuggestions = debounce(async (value) => {
    if (value.length > 1) {
      try {
        const res = await WebAppAPI.Flight.getSuggestions('AIRPORT', value);
        if (res.error) {
          message.error(res.msg);
          console.log(res)
        }
        const suggestions = res.data.map((item) => ({
          value: item.iataCode,
          label: `${item.name} (${item.iataCode})`
        }));
        setOptions(suggestions);
      } catch (error) {
        console.error('Failed to fetch location suggestions:', error);
      }
    } else {
      setOptions([]);
    }
  }, 500);

  useEffect(() => {
    fetchSuggestions(inputValue);
  }, [inputValue]);

  return (
    <AutoComplete
      options={options}
      onSelect={(value) => {
        setInputValue(value);
        onSelect(value); // Update the form state on selection
      }}
      onSearch={setInputValue}
      placeholder={placeholder}
      style={{ width: '100%' }}
    >
      <Input />
    </AutoComplete>
  );
};

export default AirportSuggeston;
