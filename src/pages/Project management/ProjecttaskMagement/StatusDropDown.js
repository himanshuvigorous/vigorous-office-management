import { Dropdown, Menu, Tag, Tooltip } from "antd";
import { DownOutlined } from "@ant-design/icons";

// Tag colors
const statusColors = {
    reviewed: "blue",
    done: "purple",
    rejected: "error",
    reassign: "warning",
};

// Background colors for trigger box
const statusBgColors = {
    assigned: "#f5f5f5",
    "in-progress": "#e6f7ff",
    completed: "#f6ffed",
    reviewed: "#e6f4ff",
    done: "#f9f0ff",
    rejected: "#fff1f0",
    reassign: "#fffbe6",
};

const StatusDropdown = ({ element, handleStatusChange, employeePortal = false }) => {
    const isEditable =
        element?.status === "completed" || element?.status === "reviewed";
    if (employeePortal) {
        return (
            <td className="whitespace-nowrap border-none p-2">
                <div
                    className="flex capitalize items-center gap-2 px-2 py-1 border rounded-md"
                    style={{
                        backgroundColor: statusBgColors[element?.status] || "#fafafa",
                    }}
                >
                    {element?.status}
                </div>
            </td>
        );
    }
    const menu = (
        <Menu
            onClick={({ key }) => {
                if (isEditable) {
                    handleStatusChange(key, element?._id);
                }
            }}
            selectedKeys={[element?.status]}
        >
            {Object.keys(statusColors).map((status) => {
                const isDisabled =
                    !isEditable ||
                    ["assigned", "in-progress", "completed"].includes(status);

                // Tooltip message handling
                let tooltipMsg = "";
                if (!isEditable) {
                    tooltipMsg = "You can only change status when it is Completed or Reviewed";
                } else if (["assigned", "in-progress", "completed"].includes(status)) {
                    tooltipMsg = "Status will change according to Working";
                }

                return (
                    <Menu.Item
                        key={status}
                        disabled={isDisabled}
                        style={{
                            cursor: isDisabled ? "not-allowed" : "pointer",
                            opacity: isDisabled ? 0.6 : 1,
                        }}
                    >
                        {tooltipMsg ? (
                            <Tooltip title={tooltipMsg} placement="right">
                                <div>
                                    <Tag color={statusColors[status]}>{status}</Tag>
                                </div>
                            </Tooltip>
                        ) : (
                            <Tag color={statusColors[status]}>{status}</Tag>
                        )}
                    </Menu.Item>
                );
            })}
        </Menu>
    );

    return (
        <td className="whitespace-nowrap border-none p-2">
            <Tooltip
                placement="topLeft"
                title={
                    isEditable
                        ? "Change Status"
                        : `Already ${element?.status}`
                }
            >
                <Dropdown overlay={menu} trigger={["click"]}>
                    <div
                        className={`flex capitalize items-center gap-2 px-2 py-1 border rounded-md transition ${isEditable ? "cursor-pointer hover:shadow" : "cursor-not-allowed"
                            }`}
                        style={{
                            backgroundColor: statusBgColors[element?.status] || "#fafafa",
                        }}
                    >
                        {element?.status}
                        {isEditable && <DownOutlined style={{ fontSize: 10, color: "#666" }} />}
                    </div>
                </Dropdown>
            </Tooltip>
        </td>
    );
};

export default StatusDropdown;
