import React, { useState } from "react";

import axios from "axios";
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
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";

function convertUTCtoIST(utcDate) {
  const istDate = utcDate.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  return istDate;
}

function convertTimestampToReadable(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return formattedDate;
}

function Tables() {
  const [containerNames, setContainerNames] = useState([]);
  const [selectedContainer, setSelectedContainer] = useState("");
  const [APIData, setAPIData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 1000;
  const [filterValues, setFilterValues] = useState({
    container_name: "",
    date_start: "",
    date_end: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFilterValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const [loading, setLoading] = useState(false);

  const handleApplyFilter = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const requestData = {
        api_name: filterValues.container_name,
        start_date: filterValues.date_start,
        end_date: filterValues.date_end,
      };

      const response = await axios.post("http://127.0.0.1:5000/get_data", requestData);

      if (response.status === 200) {
        const responseData = await axios.get("http://127.0.0.1:5000/send_data");
        if (Array.isArray(responseData.data)) {
          setAPIData(responseData.data);
          setLoading(false);
        } else {
          console.error("Invalid response data format");
          setLoading(false);
        }
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  const renderTableData = () => {
    const filteredData = APIData.filter((item) => {
      const timestamp = new Date(item.timestamp);
      const startDate = new Date(filterValues.date_start);
      const endDate = new Date(filterValues.date_end);
      return timestamp >= startDate && timestamp <= endDate;
    });
  
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  
    return currentItems.map((item, index) => (
      <tr key={index}>
        <td>{convertTimestampToReadable(item.timestamp)}</td>
        <td>{item.message}</td>
      </tr>
    ));
  };
  
  // const renderTableData = () => {
  //   const indexOfLastItem = currentPage * itemsPerPage;
  //   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  //   const currentItems = APIData.slice(indexOfFirstItem, indexOfLastItem);

  //   return currentItems.map((item, index) => (
  //     <tr key={index}>
  //       <td>{convertTimestampToReadable(item.timestamp)}</td>
  //       <td>{item.message}</td>
  //     </tr>
  //   ));
  // };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(APIData.length / itemsPerPage); i++) {
    pageNumbers.push(
      <PaginationItem key={i} active={i === currentPage}>
        <PaginationLink onClick={() => setCurrentPage(i)}>{i}</PaginationLink>
      </PaginationItem>
    );
  }
  const renderPageNumbers = () => {
    const pageNeighbours = 2;
    const totalPageCount = Math.ceil(APIData.length / itemsPerPage);

    const getPageNumbers = (from, to) => {
      return Array.from({ length: to - from + 1 }, (_, i) => from + i);
    };

    const leftBound = Math.max(1, currentPage - pageNeighbours);
    const rightBound = Math.min(totalPageCount, currentPage + pageNeighbours);

    let pageNumbers = getPageNumbers(leftBound, rightBound);

    if (currentPage - pageNeighbours <= 1) {
      pageNumbers = ['1', '2', '3', '...', totalPageCount];
    }

    if (currentPage + pageNeighbours >= totalPageCount) {
      pageNumbers = ['1', '...', totalPageCount - 2, totalPageCount - 1, totalPageCount];
    }

    return (
      <>
        <PaginationItem>
          <PaginationLink previous onClick={() => setCurrentPage(currentPage - 1)} />
        </PaginationItem>
        {pageNumbers.map((number, index) => (
          <PaginationItem key={index} active={parseInt(number) === currentPage}>
            <PaginationLink onClick={() => setCurrentPage(parseInt(number))}>
              {number}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationLink next onClick={() => setCurrentPage(currentPage + 1)} />
        </PaginationItem>
      </>
    );
  };
  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card>
            <CardBody>
              <Form onSubmit={handleApplyFilter}>
                <Row>
                  <Col className="pr-1" md="3">
                    <FormGroup>
                      <Input
                        type="select"
                        name="container_name"
                        value={filterValues.container_name}
                        onChange={handleInputChange}
                      >
                        <option value="ls-logs-dashboard">ls-logs-dashboard</option>
                        <option value="api-order-management">api-order-management</option>
                        <option value="ui-patient-management">ui-patient-management</option>
                        <option value="api-super-admin">api-super-admin</option>
                        <option value="api-admin-user-management">api-admin-user-management</option>
                        <option value="api-result-management">api-result-management</option>
                        <option value="api-dashboard-report">api-dashboard-report</option>
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col className="px-1" md="3">
                  <FormGroup>
                      <Input
                        placeholder="Start Date"
                        type="datetime-local" // Use datetime-local input for date and time
                        name="date_start"
                        value={filterValues.date_start}
                        onChange={handleInputChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col className="pl-1" md="3">
                    <FormGroup>
                      <Input
                        placeholder="End Date"
                        type="datetime-local" // Use datetime-local input for date and time
                        name="date_end"
                        value={filterValues.date_end}
                        onChange={handleInputChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col className="pl-1" md="3">
                    <div className="update ml-auto mr-auto">
                      <Button color="primary" type="submit">
                        Show Logs
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>

            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Table responsive>
                <thead className="text-primary">
                  <tr>
                    <th>timestamp</th>
                    <th>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {renderTableData()}
                </tbody>
              </Table>

            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Pagination>{renderPageNumbers()}</Pagination>
            </CardBody>
          </Card>
        </Col>
      </Row>

    </div>
  );
}

export default Tables;
