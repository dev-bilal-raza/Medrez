import React, { useState } from "react";
import UserLayout from "./UserLayout";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Calendar from "../CallandShift/Calendar";

const UserDashboard = () => {
  const currentYear = new Date().getFullYear();
  const [startYear, setStartYear] = useState(currentYear);
  const [hasNotifications, setHasNotifications] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [residentDetails, setResidentDetails] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const residents = [
    { id: 1, name: "John Doe", age: 30, address: "123 Elm St." },
    { id: 2, name: "Jane Smith", age: 40, address: "456 Oak St." },
    { id: 3, name: "Emily Davis", age: 25, address: "789 Pine St." },
  ];

  const notifications = [
    {
      id: 1,
      message: "You have a new message from John",
      isRead: false,
    },
  ];

  const togglePopup = () => setShowPopup((prev) => !prev);
  const getYearRangeText = (start) => `Jul 1 ${start} - Jun 30 ${start + 1}`;
  const handlePreviousYear = () => setStartYear(startYear - 1);
  const handleNextYear = () => setStartYear(startYear + 1);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowModal(true); // Ensure modal shows when date is selected
  };

  const handleResidentClick = (residentId) => {
    const resident = residents.find((r) => r.id === residentId);
    setResidentDetails(resident);
  };

  const filteredResidentsList = residents.filter((resident) =>
    resident.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const closeModal = () => {
    setShowModal(false);
    setSelectedDate(null);
  };

  const renderResidentDetails = () => (
    <div className="flex justify-between gap-6 p-6 bg-white rounded-lg mt-6">
      {/* Left Side - Resident Details */}
      <div className="w-2/3">
        <h2 className="text-2xl font-semibold mb-4">Resident Details</h2>
        <div className="mt-4">
          <h3 className="text-xl font-semibold">Name:</h3>
          <p>{residentDetails.name}</p>
          <h3 className="text-xl font-semibold">Age:</h3>
          <p>{residentDetails.age}</p>
          <h3 className="text-xl font-semibold">Address:</h3>
          <p>{residentDetails.address}</p>
        </div>
      </div>

      {/* Right Side - Calendar */}
      <div className="w-1/3 bg-MedrezLightGray rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-2">Select Date</h3>
        <Calendar onClickDay={handleDateChange} />
      </div>

      {/* Modal for Selected Date */}
      {showModal && selectedDate && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h3 className="text-2xl font-semibold text-center">
              {selectedDate.toDateString()}
            </h3>

            <div className="mt-4">
              <h4 className="text-xl font-semibold">Calls & Shifts</h4>
              <p>No Calls</p>
              <p>No Shifts</p>
              <p>Clinic</p>
            </div>

            <div className="flex justify-center mt-6">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderDashboard = () => (
    <div>
      <div className="flex bg-[#F5F5F5] justify-between p-4 px-6">
        <h1 className="text-3xl font-semibold text-gray-800">Dashboard</h1>
        <header className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="text-gray-800">Welcome!</span>
            <div className="relative">
              <button
                className="p-2 bg-white rounded-full focus:outline-none"
                onClick={togglePopup}
              >
                <NotificationsIcon />
              </button>
              {hasNotifications && (
                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
              )}
            </div>
          </div>
        </header>
      </div>

      <div
        className={`fixed top-0 right-0 h-full w-[400px] bg-white shadow-lg transform transition-transform ${showPopup ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="p-6 w-full">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-500">Notifications</h2>
            <button onClick={togglePopup}>
              <CloseIcon />
            </button>
          </div>

          <ul className="mt-4 space-y-4">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <li
                  key={notification.id}
                  className="p-4 bg-gray-100 rounded-lg flex justify-between"
                >
                  <div>
                    <p className="text-gray-700">{notification.message}</p>
                  </div>
                  <button onClick={() => togglePopup(notification.id)}>
                    <CloseIcon />
                  </button>
                </li>
              ))
            ) : (
              <p>No new notifications.</p>
            )}
          </ul>
        </div>
      </div>

      <div className="flex justify-between gap-5 p-6 bg-white">
        <div className="bg-MedrezLightGray rounded-lg p-6 w-1/3">
          <h2 className="text-xl font-semibold mb-4">On Now</h2>
          <p className="text-gray-500">No shifts or calls in progress now.</p>
        </div>

        <div className="bg-MedrezLightGray rounded-lg p-6 w-1/3">
          <h2 className="text-xl font-semibold mb-4">Schedules</h2>
          <div className="flex items-center justify-center bg-MedrezBlue text-white p-1 rounded-md">
            <button
              onClick={handlePreviousYear}
              className="py-1 px-3 bg-blue-800 rounded-full hover:bg-blue-700"
            >
              &lt;
            </button>

            <div
              className="mx-4 text-lg font-bold cursor-pointer"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              {getYearRangeText(startYear)}
            </div>

            <button
              onClick={handleNextYear}
              className="py-1 px-3 bg-blue-800 rounded-full hover:bg-blue-700"
            >
              &gt;
            </button>
          </div>
          {showCalendar && (
            <div className="absolute">
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                inline
              />
            </div>
          )}
        </div>

        <div className="bg-MedrezLightGray rounded-lg p-6 w-1/3">
          <h2 className="text-xl font-semibold mb-4">Residents</h2>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <input
              type="text"
              className="p-2 mb-4 w-full border rounded"
              placeholder="Search residents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {filteredResidentsList.length === 0 ? (
              <p className="text-gray-500">No assigned residents today.</p>
            ) : (
              <ul>
                {filteredResidentsList.map((resident) => (
                  <li
                    key={resident.id}
                    className="cursor-pointer text-blue-500 hover:text-blue-700"
                    onClick={() => handleResidentClick(resident.id)}
                  >
                    {resident.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <UserLayout className="p-8 overflow-y-scroll h-screen bg-gray-100">
      {residentDetails ? renderResidentDetails() : renderDashboard()}
    </UserLayout>
  );
};

export default UserDashboard;
