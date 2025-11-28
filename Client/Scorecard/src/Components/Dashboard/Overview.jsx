
const Overview = () => {
    return (
      <div className="flex-1 p-6">
        {/* Top Bar */}
        <div className="flex justify-between items-center">
          <input
            type="text"
            placeholder="Search Institute"
            className="w-1/2 px-4 py-2 rounded-full border border-gray-300 shadow-sm focus:outline-none"
          />
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 bg-pink-500 text-white font-semibold rounded-full">
              + New enrollment
            </button>
            <div className="flex items-center space-x-2">
              <img
                src="https://i.pravatar.cc/40"
                alt="profile"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold text-sm">Welcome to</p>
                <p className="text-sm font-bold">EduManage!</p>
              </div>
            </div>
          </div>
        </div>
  
        {/* Greeting */}
        <h2 className="mt-6 text-lg font-bold">
          Good morning, Prashant Chauhan
        </h2>
      </div>
    );
  };
  
  export default Overview;
  