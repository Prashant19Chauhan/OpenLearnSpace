import React, { useEffect, useState } from 'react';
import { createSubject } from '../../Api/Academics'; // API function
import { teacherList } from '../../Api/Teacher';
import { useParams } from 'react-router-dom';

function AddSubject() {
  const details = useParams();
  const [formData, setFormData] = useState({
    subjectName: '',
    subjectCode: '',
    subjectDescription: '',
    teacherId: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [teachers, setTeachers] = useState([]);

  //teacher data fetching
  const fetchTeacher = async() => {
    try{
      const response = await teacherList();
      setTeachers(response.data);
    }
    catch(error){
      console.log(error);
    }
  }

  useEffect(()=>{
    fetchTeacher();
  }, [])

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await createSubject(formData, details.batchId, details.programId); // API call
      setMessage('✅ Subject added successfully!');
      console.log('Response:', response);
      setFormData({
        subjectName: '',
        subjectCode: '',
        subjectDescription: '',
        teacherId: '',
      });
    } catch (error) {
      console.error('Error adding subject:', error);
      setMessage('❌ Failed to add subject. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md w-full max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Add New Subject</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Subject Name */}
        <div>
          <label className="block font-medium">Subject Name</label>
          <input
            type="text"
            name="subjectName"
            value={formData.subjectName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Enter subject name"
            required
          />
        </div>

        {/* Subject Code */}
        <div>
          <label className="block font-medium">Subject Code</label>
          <input
            type="text"
            name="subjectCode"
            value={formData.subjectCode}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Enter subject code"
            required
          />
        </div>

        {/* Subject Description */}
        <div>
          <label className="block font-medium">Subject Description</label>
          <textarea
            name="subjectDescription"
            value={formData.subjectDescription}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Enter subject description"
            rows={3}
          />
        </div>

        <div>
          <select
            name="teacherId"
            value={formData.teacherId}
            onChange={handleChange}
          >
            <option value="">select teacher</option>
            {teachers?.map((teacher)=> {
              return (
                <option key={teacher.teacherId} value={teacher.teacherId}>
                  {teacher.name}
                </option>
              )
            })}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          {loading ? 'Adding...' : 'Add Subject'}
        </button>
      </form>

      {/* Success/Error Message */}
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}

export default AddSubject;
