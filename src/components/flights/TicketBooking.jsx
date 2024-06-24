import React from 'react';
import { Form, Input, Button, DatePicker, Select, InputNumber, message } from 'antd';
import moment from 'moment';
import WebAppAPI from '../../api';
import './TicketBooking.css';

const { Option } = Select;

const TicketBookingForm = () => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    console.log("Form submitted with values: ", values);
    const payload = {
      data: {
        type: "flight-order",
        flightOffers: [values?.flightOfferPriceData],
        travelers: values?.travelers?.map((traveler, index) => ({
          id: (index + 1).toString(),
          dateOfBirth: moment(traveler.dateOfBirth).format('YYYY-MM-DD'),
          name: {
            firstName: traveler.firstName,
            lastName: traveler.lastName
          },
          gender: traveler.gender,
          contact: {
            emailAddress: traveler.emailAddress,
            phones: [
              {
                deviceType: "MOBILE",
                countryCallingCode: traveler.countryCallingCode,
                number: traveler.phoneNumber
              }
            ]
          },
          documents: traveler.documents ? [{
            documentType: traveler.documentType,
            birthPlace: traveler.birthPlace,
            issuanceLocation: traveler.issuanceLocation,
            issuanceDate: moment(traveler.issuanceDate).format('YYYY-MM-DD'),
            number: traveler.documentNumber,
            expiryDate: moment(traveler.expiryDate).format('YYYY-MM-DD'),
            issuanceCountry: traveler.issuanceCountry,
            validityCountry: traveler.validityCountry,
            nationality: traveler.nationality,
            holder: true
          }] : []
        })),
        remarks: {
          general: [
            {
              subType: "GENERAL_MISCELLANEOUS",
              text: "ONLINE BOOKING FROM INCREIBLE VIAJES"
            }
          ]
        },
        ticketingAgreement: {
          option: "DELAY_TO_CANCEL",
          delay: "6D"
        },
        contacts: [
          {
            addresseeName: {
              firstName: values.contactFirstName,
              lastName: values.contactLastName
            },
            companyName: "INCREIBLE VIAJES",
            purpose: "STANDARD",
            phones: [
              {
                deviceType: "LANDLINE",
                countryCallingCode: "34",
                number: values.landlineNumber
              },
              {
                deviceType: "MOBILE",
                countryCallingCode: "33",
                number: values.mobileNumber
              }
            ],
            emailAddress: values.contactEmail,
            address: {
              lines: [values.addressLine],
              postalCode: values.postalCode,
              cityName: values.cityName,
              countryCode: values.countryCode
            }
          }
        ]
      }
    };

    try {
      console.log("Payload: ", payload);
      const res = await WebAppAPI.Flight.bookTicket(payload);
      if (res.error) {
        message.error(res.msg);
      } else {
        console.log(res.data, 'response data');
      }
    } catch (error) {
      console.log("Error in API call: ", error);
    }
  };

  return (
    <div className="form-container">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="booking-form"
      >
        <Form.Item
          name="flightOfferPriceData"
          label="Flight Offer Price Data"
          rules={[{ required: true, message: 'Please enter flight offer price data' }]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.List name="travelers">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <div key={key}>
                  <h3>Traveler {key + 1}</h3>
                  <div className="two-column">
                    <Form.Item
                      {...restField}
                      name={[name, 'firstName']}
                      fieldKey={[fieldKey, 'firstName']}
                      label="First Name"
                      rules={[{ required: true, message: 'Please enter first name' }]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'lastName']}
                      fieldKey={[fieldKey, 'lastName']}
                      label="Last Name"
                      rules={[{ required: true, message: 'Please enter last name' }]}
                    >
                      <Input />
                    </Form.Item>
                  </div>
                  <div className="two-column">
                    <Form.Item
                      {...restField}
                      name={[name, 'dateOfBirth']}
                      fieldKey={[fieldKey, 'dateOfBirth']}
                      label="Date of Birth"
                      rules={[{ required: true, message: 'Please select date of birth' }]}
                    >
                      <DatePicker />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'gender']}
                      fieldKey={[fieldKey, 'gender']}
                      label="Gender"
                      rules={[{ required: true, message: 'Please select gender' }]}
                    >
                      <Select>
                        <Option value="MALE">Male</Option>
                        <Option value="FEMALE">Female</Option>
                      </Select>
                    </Form.Item>
                  </div>
                  <Form.Item
                    {...restField}
                    name={[name, 'emailAddress']}
                    fieldKey={[fieldKey, 'emailAddress']}
                    label="Email Address"
                    rules={[{ required: true, message: 'Please enter email address' }]}
                  >
                    <Input />
                  </Form.Item>
                  <div className="two-column">
                    <Form.Item
                      {...restField}
                      name={[name, 'countryCallingCode']}
                      fieldKey={[fieldKey, 'countryCallingCode']}
                      label="Country Calling Code"
                      rules={[{ required: true, message: 'Please enter country calling code' }]}
                    >
                      <InputNumber />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'phoneNumber']}
                      fieldKey={[fieldKey, 'phoneNumber']}
                      label="Phone Number"
                      rules={[{ required: true, message: 'Please enter phone number' }]}
                    >
                      <Input />
                    </Form.Item>
                  </div>

                  {/* Optional: Traveler Documents */}
                  <Form.List name={[name, 'documents']}>
                    {(docFields, { add: addDoc, remove: removeDoc }) => (
                      <>
                        {docFields.map(({ key: docKey, name: docName, fieldKey: docFieldKey, ...restDocField }) => (
                          <div key={docKey}>
                            <h4>Document {docKey + 1}</h4>
                            <div className="two-column">
                              <Form.Item
                                {...restDocField}
                                name={[docName, 'documentType']}
                                fieldKey={[docFieldKey, 'documentType']}
                                label="Document Type"
                                rules={[{ required: true, message: 'Please enter document type' }]}
                              >
                                <Input />
                              </Form.Item>
                              <Form.Item
                                {...restDocField}
                                name={[docName, 'birthPlace']}
                                fieldKey={[docFieldKey, 'birthPlace']}
                                label="Birth Place"
                                rules={[{ required: true, message: 'Please enter birth place' }]}
                              >
                                <Input />
                              </Form.Item>
                            </div>
                            <div className="two-column">
                              <Form.Item
                                {...restDocField}
                                name={[docName, 'issuanceLocation']}
                                fieldKey={[docFieldKey, 'issuanceLocation']}
                                label="Issuance Location"
                                rules={[{ required: true, message: 'Please enter issuance location' }]}
                              >
                                <Input />
                              </Form.Item>
                              <Form.Item
                                {...restDocField}
                                name={[docName, 'issuanceDate']}
                                fieldKey={[docFieldKey, 'issuanceDate']}
                                label="Issuance Date"
                                rules={[{ required: true, message: 'Please select issuance date' }]}
                              >
                                <DatePicker />
                              </Form.Item>
                            </div>
                            <div className="two-column">
                              <Form.Item
                                {...restDocField}
                                name={[docName, 'expiryDate']}
                                fieldKey={[docFieldKey, 'expiryDate']}
                                label="Expiry Date"
                                rules={[{ required: true, message: 'Please select expiry date' }]}
                              >
                                <DatePicker />
                              </Form.Item>
                              <Form.Item
                                {...restDocField}
                                name={[docName, 'issuanceCountry']}
                                fieldKey={[docFieldKey, 'issuanceCountry']}
                                label="Issuance Country"
                                rules={[{ required: true, message: 'Please enter issuance country' }]}
                              >
                                <Input />
                              </Form.Item>
                            </div>
                            <div className="two-column">
                              <Form.Item
                                {...restDocField}
                                name={[docName, 'validityCountry']}
                                fieldKey={[docFieldKey, 'validityCountry']}
                                label="Validity Country"
                                rules={[{ required: true, message: 'Please enter validity country' }]}
                              >
                                <Input />
                              </Form.Item>
                              <Form.Item
                                {...restDocField}
                                name={[docName, 'nationality']}
                                fieldKey={[docFieldKey, 'nationality']}
                                label="Nationality"
                                rules={[{ required: true, message: 'Please enter nationality' }]}
                              >
                                <Input />
                              </Form.Item>
                            </div>
                            <Button type="danger" onClick={() => removeDoc(docName)}>Remove Document</Button>
                          </div>
                        ))}
                        <Button type="dashed" onClick={() => addDoc()}>Add Document</Button>
                      </>
                    )}
                  </Form.List>

                  <Button type="danger" onClick={() => remove(name)}>Remove Traveler</Button>
                </div>
              ))}
              <Button type="dashed" onClick={() => add()}>Add Traveler</Button>
            </>
          )}
        </Form.List>

        <h3>Contact Information</h3>
        <div className="two-column">
          <Form.Item
            name="contactFirstName"
            label="First Name"
            rules={[{ required: true, message: 'Please enter first name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="contactLastName"
            label="Last Name"
            rules={[{ required: true, message: 'Please enter last name' }]}
          >
            <Input />
          </Form.Item>
        </div>
        <div className="two-column">
          <Form.Item
            name="landlineNumber"
            label="Landline Number"
            rules={[{ required: true, message: 'Please enter landline number' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="mobileNumber"
            label="Mobile Number"
            rules={[{ required: true, message: 'Please enter mobile number' }]}
          >
            <Input />
          </Form.Item>
        </div>
        <Form.Item
          name="contactEmail"
          label="Email Address"
          rules={[{ required: true, message: 'Please enter email address' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="addressLine"
          label="Address Line"
          rules={[{ required: true, message: 'Please enter address line' }]}
        >
          <Input />
        </Form.Item>
        <div className="two-column">
          <Form.Item
            name="postalCode"
            label="Postal Code"
            rules={[{ required: true, message: 'Please enter postal code' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="cityName"
            label="City Name"
            rules={[{ required: true, message: 'Please enter city name' }]}
          >
            <Input />
          </Form.Item>
        </div>
        <Form.Item
          name="countryCode"
          label="Country Code"
          rules={[{ required: true, message: 'Please enter country code' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">Book Flight</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default TicketBookingForm;
