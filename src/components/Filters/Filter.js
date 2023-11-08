import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  Table,
  Row,
  Col,
} from "reactstrap";

const FilterForm = ({ onApplyFilter }) => {
  const [filterValues, setFilterValues] = useState({
    conatainer_name: "",
    date_start: "",
    date_end: "",
    // Add more fields as needed
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFilterValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleApplyFilter = (event) => {
    event.preventDefault();
    onApplyFilter(filterValues);
  };

  return (
    <Form onSubmit={handleApplyFilter}>
      <Row>
        <Col className='pr-1' md='3'>
          <FormGroup>
            <Input
              defaultValue={filterValues.conatainer_name}
              placeholder='Container Name'
              type='text'
              name='conatainer_name'
              onChange={handleInputChange}
            />
          </FormGroup>
        </Col>
        <Col className='px-1' md='3'>
          <FormGroup>
            <Input
              placeholder='End Date'
              type='text'
              name='date_start'
              value={filterValues.date_start}
              onChange={handleInputChange}
            />
          </FormGroup>
        </Col>
        <Col className='pl-1' md='3'>
          <FormGroup>
            <Input
              placeholder='End Date'
              type='text'
              name='date_end'
              value={filterValues.date_end}
              onChange={handleInputChange}
            />
          </FormGroup>
        </Col>
        <Col className='pl-1' md='3'>
          <div className='update ml-auto mr-auto'>
            <Button color='primary' type='submit'>
              Apply
            </Button>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default FilterForm;
