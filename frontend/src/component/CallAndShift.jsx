import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from './Layout';

const CallShiftSchedule = () => {
  const [blockData, setBlockData] = useState([]);
  const [editingBlockId, setEditingBlockId] = useState(null);
  const [newBlock, setNewBlock] = useState({ blockName: '', startDate: '', endDate: '' });

  useEffect(() => {
    // Fetch blocks data on component mount
    axios.get('https://medrezserver-lake.vercel.app:5000/api/blocks')
      .then(response => setBlockData(response.data))
      .catch(error => console.error('Error fetching blocks:', error));
  }, []);

  const handleAddBlock = () => {
    axios.post('https://medrezserver-lake.vercel.app:5000/api/blocks', newBlock)
      .then(response => setBlockData([...blockData, response.data]))
      .catch(error => console.error('Error adding block:', error));
  };

  const handleEdit = (id) => {
    setEditingBlockId(id);
  };

  const handleSave = (id) => {
    const block = blockData.find(b => b.id === id);
    axios.put(`https://medrezserver-lake.vercel.app:5000/api/blocks/${id}`, block)
      .then(response => {
        setBlockData(blockData.map(b => (b.id === id ? response.data : b)));
        setEditingBlockId(null);
      })
      .catch(error => console.error('Error updating block:', error));
  };

  const handleRemove = (id) => {
    axios.delete(`https://medrezserver-lake.vercel.app:5000/api/blocks/${id}`)
      .then(() => setBlockData(blockData.filter(b => b.id !== id)))
      .catch(error => console.error('Error deleting block:', error));
  };

  const handleInputChange = (e, id) => {
    const { name, value } = e.target;
    setBlockData(blockData.map(block => block.id === id ? { ...block, [name]: value } : block));
  };

  return (
    <Layout>
    <div className="p-5 w-[70%] flex flex-col gap-5 bg-gray-50 rounded-lg shadow-md">
      <h2 className="font-semibold text-xl text-gray-800">Call & Shift Schedule</h2>
      <div>
        <div className="flex justify-end mb-4">
          <button className="bg-green-500 text-white font-bold py-2 px-4 rounded" onClick={handleAddBlock}>
            Add Block
          </button>
        </div>
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 border-b font-semibold text-left">Block Name</th>
              <th className="p-4 border-b font-semibold text-left">Start Date</th>
              <th className="p-4 border-b font-semibold text-left">End Date</th>
              <th className="p-4 border-b font-semibold text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {blockData.map(block => (
              <tr key={block.id}>
                <td className="p-4">
                  {editingBlockId === block.id ? (
                    <input
                      type="text"
                      name="blockName"
                      value={block.blockName}
                      onChange={(e) => handleInputChange(e, block.id)}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    block.blockName
                  )}
                </td>
                <td className="p-4">
                  {editingBlockId === block.id ? (
                    <input
                      type="text"
                      name="startDate"
                      value={block.startDate}
                      onChange={(e) => handleInputChange(e, block.id)}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    block.startDate
                  )}
                </td>
                <td className="p-4">
                  {editingBlockId === block.id ? (
                    <input
                      type="text"
                      name="endDate"
                      value={block.endDate}
                      onChange={(e) => handleInputChange(e, block.id)}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    block.endDate
                  )}
                </td>
                <td className="p-4 flex space-x-2">
                  {editingBlockId === block.id ? (
                    <>
                      <button onClick={() => handleSave(block.id)} className="bg-green-500 text-white font-bold py-1 px-2 rounded">Save</button>
                      <button onClick={() => setEditingBlockId(null)} className="bg-red-500 text-white font-bold py-1 px-2 rounded">Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(block.id)} className="bg-blue-500 text-white font-bold py-1 px-2 rounded">Edit</button>
                      <button onClick={() => handleRemove(block.id)} className="bg-red-500 text-white font-bold py-1 px-2 rounded">Remove</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </Layout>
  );
};

export default CallShiftSchedule;
