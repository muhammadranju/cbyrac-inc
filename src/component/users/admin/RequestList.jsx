import React, { useEffect, useState } from "react";
import { Table, Input, Tabs, Dropdown, Button, Tag, Pagination } from "antd";
import {
  MoreOutlined,
  SearchOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEmployeesByRole,
  updateEmployeeStatus,
  updateStatusLocally,
} from "../../../redux/feature/overview/employeeSlice";
import axiosInstance from "../../../utils/axiosInstance";

// Status colors for tags
const statusColors = {
  Approved: "#d8f5e0", // light green
  Reject: "#ffd6d6", // light red
  Pending: "#e6e6e6", // light gray
};

// Action dropdown menu
const getActionItems = (record, handleAction) => [
  {
    key: "view",
    label: "View",
    icon: <EyeOutlined />,
    onClick: () => handleAction("view", record),
  },
  {
    key: "approve",
    label: "Approve",
    icon: <CheckOutlined />,
    style: { color: "green" },
    onClick: () => handleAction("approve", record),
  },
  {
    key: "reject",
    label: "Reject",
    icon: <CloseOutlined />,
    style: { color: "red" },
    onClick: () => handleAction("reject", record),
  },
  {
    key: "download",
    label: "Download PDF",
    icon: <DownloadOutlined />,
    onClick: () => handleAction("download", record),
  },
];

const RequestList = () => {
  const dispatch = useDispatch();
  const { employees, loading, pagination } = useSelector(
    (state) => state.employeeFilter
  );

  const [search, setSearch] = useState("");
  const [currentTab, setCurrentTab] = useState("Fit2Lead Intern");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  // Fetch employees whenever tab, page, or search changes
  useEffect(() => {
    const delay = setTimeout(() => {
      dispatch(
        fetchEmployeesByRole({
          employee_role: currentTab,
          page: currentPage,
          limit: pageSize,
          search: search,
        })
      );
    }, 300); // debounce search by 300ms

    return () => clearTimeout(delay);
  }, [dispatch, currentTab, currentPage, search]);

  // Action handler
  const handleAction = async (actionType, employee) => {
    switch (actionType) {
      case "view":
        console.log("View employee", employee);
        break;

      case "approve":
        console.log(actionType);
        dispatch(updateStatusLocally({ id: employee._id, status: "approve" }));
        dispatch(
          updateEmployeeStatus({ id: employee._id, status: actionType })
        );
        break;

      case "reject":
        console.log(actionType);
        console.log(employee._id);
        dispatch(updateStatusLocally({ id: employee._id, status: "reject" }));
        dispatch(
          updateEmployeeStatus({ id: employee._id, status: actionType })
        );
        break;

      case "download":
        console.log("Download PDF for employee", employee);
        break;

      default:
        break;
    }
  };

  // Table columns
  const columns = [
    {
      title: (
        <span style={{ fontSize: "18px", fontWeight: "bold" }}>User Name</span>
      ),
      dataIndex: "firstName",
      key: "firstName",
      render: (text, record) => (
        <span style={{ fontSize: "16px" }}>
          {record.firstName} {record.lastName}
        </span>
      ),
    },
    {
      title: <span style={{ fontWeight: "bold" }}>Email</span>,
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
    {
      title: <span style={{ fontWeight: "bold" }}>Status</span>,
      dataIndex: "employee_status",
      key: "employee_status",
      render: (employee_status) => {
        const color = statusColors[employee_status] || "#444";
        return (
          <Tag
            style={{
              background: color,
              color: "#111",
              fontWeight: 700,
              borderRadius: 8,
              padding: "4px 10px",
              fontSize: 16,
            }}
          >
            {employee_status}
          </Tag>
        );
      },
    },
    {
      title: <span style={{ fontWeight: "bold" }}>Action</span>,
      key: "action",
      render: (_, record) => (
        <Dropdown
          menu={{ items: getActionItems(record, handleAction) }}
          trigger={["click"]}
        >
          <Button icon={<MoreOutlined />} style={{ fontSize: 16 }} />
        </Dropdown>
      ),
    },
  ];

  // Tabs items fix
  const tabsItems = [
    {
      key: "Fit2Lead Intern",
      label: (
        <span
          style={{
            color: currentTab === "Fit2Lead Intern" ? "blue" : "#fff",
            fontSize: 20,
          }}
        >
          Intern
        </span>
      ),
    },
    {
      key: "Temporary Employee",
      label: (
        <span
          style={{
            color: currentTab === "Temporary Employee" ? "#946344" : "#fff",
            fontSize: 20,
          }}
        >
          Temporary
        </span>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px", background: "#0c0c1a", minHeight: "100vh" }}>
      {/* Search Input */}
      <Input
        className="!py-3"
        placeholder="Search here..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        prefix={<SearchOutlined style={{ color: "#888" }} />}
        style={{
          marginBottom: 16,
          width: 400,
          borderRadius: 8,
          background: "#fff",
          color: "#000",
        }}
      />

      {/* Tabs */}
      <Tabs
        activeKey={currentTab}
        onChange={(key) => {
          setCurrentTab(key);
          setCurrentPage(1);
        }}
        items={tabsItems}
        style={{ marginBottom: 16 }}
        tabBarStyle={{ backgroundColor: "#0c0c1a", borderRadius: 8 }}
        tabBarGutter={16}
        type="line"
      />

      {/* Employee Table */}
      <Table
        columns={columns}
        dataSource={employees || []}
        loading={loading}
        rowKey={(record) => record.id || record.key || Math.random()} // unique key
        pagination={false}
        rowClassName={() => "custom-row"}
        style={{ background: "#0c0c1a", borderRadius: 10, overflow: "hidden" }}
      />

      {/* Pagination */}
      <div
        style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}
      >
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={pagination?.total || employees?.length || 0}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default RequestList;
