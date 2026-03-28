import React, { useEffect, useState } from "react";
import { Table, Input, Tabs, Pagination } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployeesByRole } from "../../../redux/feature/overview/employeeSlice";

const OverviewTable = () => {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeRole, setActiveRole] = useState("Fit2Lead Intern");
  const pageSize = 5;

  const dispatch = useDispatch();
  const { employees, loading, pagination } = useSelector(
    (state) => state.employeeFilter
  );

  useEffect(() => {
    dispatch(
      fetchEmployeesByRole({
        employee_role: activeRole,
        page: currentPage,
        limit: pageSize,
      })
    );
  }, [dispatch, activeRole, currentPage]);

  useEffect(() => {
    const delay = setTimeout(() => {
      dispatch(
        fetchEmployeesByRole({
          page: currentPage,
          limit: pageSize,
          search: searchText,
        })
      );
    }, 300);

    return () => clearTimeout(delay);
  }, [searchText]);

  const columns = [
    {
      title: "User Name",
      dataIndex: "firstName",
      key: "firstName",
      render: (text, record) => (
        <span style={{ fontSize: "16px" }}>
          {record.firstName} {record.lastName}
        </span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <span style={{ fontSize: "16px" }}>{text}</span>,
    },
    {
      title: "Joining Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => (
        <span style={{ fontSize: "16px" }}>
          {new Date(text).toLocaleDateString()}
        </span>
      ),
    },
  ];

  const handleTabChange = (key) => {
    setActiveRole(key);
    setCurrentPage(1);
  };

  // AntD v5 Tabs items array
  const tabsItems = [
    {
      key: "Fit2Lead Intern",
      label: <span style={{ color: "#fff", fontSize: "28px" }}>Intern</span>,
    },
    {
      key: "Temporary Employee",
      label: <span style={{ color: "#fff", fontSize: "28px" }}>Temporary</span>,
    },
  ];

  return (
    <div style={{ padding: "10px", paddingTop: "50px", minHeight: "100vh" }}>
      <Input
        placeholder="Search here..."
        className="!py-3.5"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 20, width: 300 }}
      />

      <Tabs
        activeKey={activeRole}
        onChange={handleTabChange}
        style={{ marginBottom: 30 }}
        tabBarStyle={{ color: "#fff", fontSize: "28px", fontWeight: "600" }}
        items={tabsItems}
      />

      <Table
        columns={columns}
        dataSource={employees}
        loading={loading}
        pagination={false}
        bordered
        style={{ background: "#fff", borderRadius: "12px", overflow: "hidden" }}
        rowKey="_id"
      />

      <div style={{ marginTop: 20, textAlign: "right", color: "#fff" }}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={pagination?.total || 0}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default OverviewTable;
