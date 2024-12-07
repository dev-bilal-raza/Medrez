import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import PopupModal from "./PopupModal";
import ScheduleIcon from "../assets/ScheduleIcon.png";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsIcon from "@mui/icons-material/Notifications";
import io from 'socket.io-client'; // Import Socket.IO client

const socket = io('https://medrezserver-lake.vercel.app:5000'); // Connect to the server

function Dashboard() {
  const navigate = useNavigate();
  const [hasNotifications, setHasNotifications] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [newScheduleName, setNewScheduleName] = useState("");
  const [annualRotationData, setAnnualRotationData] = useState([]);
  const [shiftScheduleData, setShiftScheduleData] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [stickyNote, setStickyNote] = useState("");
  const [trashedSchedules, setTrashedSchedules] = useState([]); // State for trashed schedules
  const [showTrash, setShowTrash] = useState(false); // State to control trash visibility

  const saveAnnualRotation = async (newScheduleName) => {
    if (!newScheduleName) {
      alert("Please enter a schedule name.");
      return;
    }

    const newSchedule = {
      name: newScheduleName,
      color: "#FF0707",
      staffingRequirements: [],
      vacations: "Allowed",
      blockSets: "Allowed",
      tallies: [],
    };

    try {
      const response = await fetch('https://medrezserver-lake.vercel.app:5000/api/rotations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSchedule),
      });

      if (response.ok) {
        fetchAnnualRotationData();
      } else {
        console.error('Failed to save annual rotation schedule');
      }
    } catch (error) {
      console.error('Error saving annual rotation schedule:', error);
    }
  };

  const fetchAnnualRotationData = async () => {
    try {
      const response = await fetch('https://medrezserver-lake.vercel.app:5000/api/schedules');

      if (!response.ok) {
        const text = await response.text();
        console.error('Error fetching annual rotation data:', response.status, text);
        return;
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        setAnnualRotationData(data);
      } else {
        console.error('Expected JSON but received:', contentType);
      }
    } catch (error) {
      console.error('Error fetching annual rotation data:', error);
    }
  };

  const fetchShiftScheduleData = async () => {
    try {
      const response = await fetch('https://medrezserver-lake.vercel.app:5000/api/shift-schedules');
      const data = await response.json();
      setShiftScheduleData(data);
    } catch (error) {
      console.error('Error fetching shift schedule data:', error);
    }
  };

  useEffect(() => {
    fetchAnnualRotationData();
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
      setToken(storedToken);
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await fetch('https://medrezserver-lake.vercel.app:5000/api/notifications');
      const data = await response.json();
      setNotifications(data);
    };

    fetchNotifications();

    socket.on('notifications', (data) => {
      setNotifications(data);
    });

    return () => {
      socket.off('notifications');
    };
  }, []);

  const handleEditSchedule = (scheduleName) => {
    const encodedName = encodeURIComponent(scheduleName);
    navigate(`/annual-rotate/${getYearRangeText(startYear)}/${encodedName}`);
  };

  const handleEdit = () => {
    navigate('/call-and-shift');
  }

  const currentYear = new Date().getFullYear();
  const [startYear, setStartYear] = useState(currentYear);

  const getYearRangeText = (start) => {
    return `Jul 1 ${start} - Jun 30 ${start + 1}`;
  };

  const handlePreviousYear = () => setStartYear(startYear - 1);
  const handleNextYear = () => setStartYear(startYear + 1);

  const handleDeleteSchedule = async (id) => {
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      try {
        const response = await fetch(`https://medrezserver-lake.vercel.app:5000/api/rotations/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setAnnualRotationData((prevSchedules) =>
            prevSchedules.filter((schedule) => schedule._id !== id)
          );
          alert("Schedule deleted successfully.");
        } else {
          const errorText = await response.text();
          console.error('Failed to delete schedule:', response.status, errorText);
          alert(`Failed to delete schedule: ${errorText}`);
        }
      } catch (error) {
        console.error('Error deleting schedule:', error);
        alert("An error occurred while deleting the schedule.");
      }
    }
  };


  const togglePopup = () => {
    setShowPopup((prev) => !prev);
  };

  const markAsRead = (id) => {
    socket.emit('markAsRead', id);
  };

  const saveStickyNote = () => {
    console.log("Sticky note saved:", stickyNote);
    setStickyNote("");
  };


  const openTrash = async () => {
    try {
      const response = await fetch('https://medrezserver-lake.vercel.app:5000/api/trashed-schedules'); // Fetch trashed schedules from the server
      const data = await response.json();
      setTrashedSchedules(data);
      setShowTrash(true);
    } catch (error) {
      console.error('Error fetching trashed schedules:', error);
    }
  };

  const closeTrash = () => {
    setShowTrash(false); // Close the trash modal or section
  };

  return (
    <Layout>
      <div className="w-[80%]">
        <div className="bg-[#F5F5F5] flex flex-row  items-center justify-between px-6 py-4">
          <div className="flex items-center gap-12">
            <h1 className="font-semibold font-heading text-2xl text-[#010F2D]">Dashboard</h1>
            <div className="flex items-center justify-center bg-[#073AA8] text-white p-2 rounded-md">
              <button
                onClick={handlePreviousYear}
                className="py-1 px-3 bg-blue-800 rounded-full hover:bg-blue-700 transition duration-200"
              >
                &lt;
              </button>
              <div className="mx-4 text-lg font-bold">
                {getYearRangeText(startYear)}
                {startYear === currentYear && (
                  <span className="text-green-500 ml-2 text-sm">Current Year</span>
                )}
              </div>
              <button
                onClick={handleNextYear}
                className="py-1 px-3 bg-blue-800 rounded-full hover:bg-blue-700 transition duration-200"
              >
                &gt;
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-[#010F2D] text-lg font-heading">Welcome {user ? user.username : ''}</span>
            <div className="relative">
              <button
                className="p-2 bg-white rounded-full shadow focus:outline-none"
                onClick={togglePopup}
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
              {hasNotifications && (
                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
              )}
            </div>
          </div>
        </div>

        <div className={`fixed top-0 right-0 h-full w-[400px] bg-white shadow-lg transform transition-transform ${showPopup ? "translate-x-0" : "translate-x-full"}`}>
          <div className="p-6 w-full">
            <div className="flex items-center justify-between w-full">
              <h2 className="text-sm font-semibold text-gray-500">Notifications</h2>
              <button onClick={togglePopup}>
                <CloseIcon />
              </button>
            </div>
            <ul className="mt-4 space-y-4">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <li key={notification.id} className="p-4 bg-gray-100 rounded-lg flex justify-between shadow">
                    <div>
                      <div className="flex">
                        <NotificationsIcon />
                        <p className="text-gray-700">{notification.message}</p>
                      </div>
                      <span className="text-sm text-blue-500 underline" onClick={() => markAsRead(notification.id)}>Mark as Read</span>
                    </div>
                    <button onClick={() => { }}>
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

        <div className="flex">
          <div className="w-[70%] p-5">
            <div className="p-5 flex flex-col gap-5 bg-white rounded-lg shadow-md">
              <h2 className="font-semibold text-xl font-heading text-[#010F2D]">Annual Rotations Schedules</h2>
              <div className="bg-[#F5F5F5] px-4 py-8 rounded-lg shadow-md space-y-6 min-h-60 flex justify-center items-center">
                <div className="w-full">

                  {/* {
                  annualRotationData.length > 0 &&
                  <div className="bg-white rounded-lg p-3 flex justify-end space-x-2">
                    <div className="flex gap-2">
                      <button
                        className="text-white font-semibold bg-[#073AA8] py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center gap-1"
                        onClick={handleEditSchedule}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-[#C11818] hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
                        onClick={() => handleDeleteSchedule(schedule._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                } */}

                  {annualRotationData.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full shadow-md p-3">
                        <tbody className="divide-y space-y-3">
                          {annualRotationData.map((schedule) => (
                            <tr key={schedule._id} className="bg-white rounded-lg hover:bg-gray-50 transition duration-200 flex justify-between items-center p-2 px-3">
                              <td className="text-[#6E6E6E] font-para font-medium text-base ">{schedule.scheduleName}</td>
                              <td className="flex items-center space-x-2">
                                <button
                                  className="text-white font-semibold bg-[#073AA8] py-2 px-6 pl-4 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center gap-1"
                                  onClick={() => handleEditSchedule(schedule.scheduleName)}
                                >
                                  <DriveFileRenameOutlineOutlinedIcon />
                                  Edit
                                </button>
                                <button
                                  className="bg-[#C11818] hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
                                  onClick={() => handleDeleteSchedule(schedule.scheduleName)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-center text-gray-600">No Annual Rotation Schedules available.</p>
                  )}

                  <div className="text-center mt-4 space-y-2">
                    {
                      annualRotationData.length > 0 &&
                      <p className="text-gray-600">Want to create more schedules?</p>
                    }
                    <PopupModal FormName="Annual Rotations Schedule" onSave={saveAnnualRotation} />
                  </div>
                </div>
              </div>


              <div className="p-5 flex flex-col gap-5">
                <h2 className="font-semibold text-xl text-gray-800">Call & Shift Schedule</h2>
                <div className="bg-[#F5F5F5] px-6 py-8 rounded-lg shadow-md min-h-60 flex justify-center items-center">
                  <div className="w-full">

                    {/* {
                    shiftScheduleData.length > 0 &&
                    <div className="flex space-x-2 bg-white p-3 rounded-lg">
                    <button
                    className="text-white font-semibold bg-blue-600 py-2 rounded-lg px-6 hover:bg-blue-700 flex gap-1 items-center"
                        onClick={() => handleEdit()}
                      >
                        Edit
                        <DriveFileRenameOutlineOutlinedIcon />
                      </button>
                      <button
                        className="bg-red-600 text-white font-semibold py-2 rounded-lg px-6"
                        onClick={() => handleDeleteSchedule()}
                      >
                        Delete
                      </button>
                    </div>
                  } */}
                    {shiftScheduleData.length > 0 ? (
                      <div>
                        <ul className="space-y-6">
                          {shiftScheduleData.map((schedule, index) => (
                            <li
                              key={index}
                              className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm transition-transform transform hover:scale-105 hover:shadow-lg"
                            >
                              <span className="text-lg font-medium text-gray-800 flex gap-4 items-center">
                                <img src={ScheduleIcon} alt="" className="w-8 h-8 rounded-full" />
                                {schedule.scheduleName}
                              </span>
                            </li>
                          ))}
                        </ul>
                        <div className="flex flex-col items-center justify-center mt-10 gap-3">
                          {
                            shiftScheduleData.length > 0 &&
                            <p className="text-gray-600">Want to create more schedules?</p>
                          }
                          <PopupModal FormName="Annual Rotations Schedule" onSave={saveAnnualRotation} />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-3">
                        <p className="text-gray-600">No Call and Shift Schedules till now!</p>
                        <PopupModal
                          FormName="Call and Shift Schedule"
                          selectedYear={getYearRangeText(startYear)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-[30%] p-4">
            <div className="space-y-4">
              <div className="p-4 bg-[#F5F5F5] rounded-lg shadow">
                <h2 className="text-xl font-bold mb-2">Notifications</h2>
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div key={notification.id} className="p-2 bg-gray-100 rounded-lg mb-2 flex items-center">
                      <span className="text-gray-700">{notification.message}</span>
                      <button onClick={() => markAsRead(notification.id)} className="ml-2 text-blue-500 underline">Mark as Read</button>
                    </div>
                  ))
                ) : (
                  <p>No notifications.</p>
                )}
              </div>

              <div className="p-4 bg-[#F5F5F5] rounded-lg shadow">
                <h2 className="text-xl font-bold mb-2">Sticky Notes</h2>
                <textarea
                  className="w-full h-24 p-2 rounded-lg min-h-40"
                  placeholder="Write Something Important"
                  value={stickyNote}
                  onChange={(e) => setStickyNote(e.target.value)}
                />
                <button onClick={saveStickyNote} className="mt-2 bg-blue-600 text-white rounded-lg px-4 py-2">Save Note</button>
              </div>

              <div className="p-4 bg-[#F5F5F5] rounded-lg shadow">
                <h2 className="text-xl font-bold mb-2">Announcements</h2>
                <div className="flex bg-gray-50 p-3 rounded-lg items-center mb-2">
                  <span className="text-green-600 font-bold">Aug 30</span>
                  <span className="ml-2">- Summer 2024 fixes and improvements</span>
                </div>
                <div className="flex bg-gray-50 p-3 rounded-lg items-center mb-2">
                  <span className="text-green-600 font-bold">May 2</span>
                  <span className="ml-2">- New: Days Off Per Week rule now has a "do not average over block" option!</span>
                </div>
                <a href="#!" className="text-blue-600 underline">More on the Forums</a>
              </div>

              <div className="p-4 bg-[#F5F5F5] rounded-lg shadow flex justify-between items-center">
                <span className="text-xl font-bold">Trashed Schedules</span>
                <button onClick={openTrash} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">Open Trash</button>
              </div>
              <div className="p-4 bg-[#FFFEE3] rounded-lg shadow flex justify-between items-center">
                <div>
                  <span className="text-xl font-bold">Customer Support</span>
                  <ul className="list-disc p-5">
                    <li>Browse the Schedule Maker's Guide</li>
                    <li>Visit the Support Forums</li>
                    <li>Email: support@medrez.net</li>
                  </ul>
                  <p>Support is available during regular West Coast business hours.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {
        showTrash && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-5 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-2">Trashed Schedules</h2>
              {trashedSchedules.length > 0 ? (
                <ul className="space-y-2">
                  {trashedSchedules.map((schedule) => (
                    <li key={schedule._id} className="p-2 bg-gray-100 rounded-lg flex justify-between">
                      <span>{schedule.scheduleName}</span>
                      <button
                        className="bg-green-600 text-white font-semibold py-1 px-3 rounded-lg hover:bg-green-700 transition duration-200"
                        onClick={() => restoreSchedule(schedule._id)} // Function to restore the schedule
                      >
                        Restore
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No trashed schedules available.</p>
              )}
              <button onClick={closeTrash} className="mt-4 bg-red-600 text-white rounded-lg px-4 py-2">Close</button>
            </div>
          </div>
        )
      }
    </Layout >
  );
}

export default Dashboard;
