import React from "react";

const Dashboard = () => {
  return (
    <>
      <div className="min-h-screen flex bg-gradient-to-br from-[#f8f8f8] to-[#eaeaea]">
        <main className="flex-1 flex flex-col">
          <div className="flex justify-center">
            <header className="bg-white/80 w-[100%] backdrop-blur-md border-b border-gray-200 shadow-sm px-8 py-6 flex flex-col md:flex-row md:items-center md:justify-between rounded-b-2xl mx-auto">
              <div className="flex items-center gap-6">
                <h4 className="text-5xl !font-light text-gray-900 leading-tight">
                  HBH Dashboard
                </h4>
              </div>
              <div className="w-1/2 md:w-1/6 flex justify-center mt-3 md:mt-0">
                <button className="mt-2 w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-700 transition shadow-md cursor-pointer">
                  <p className="!leading-none !m-0 !italic !font-semibold">
                    Logout
                  </p>
                </button>
              </div>
            </header>
          </div>

          <div className="p-10 grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 flex flex-col relative">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-4xl !font-black !text-gray-900 !italic underline">
                  Profile
                </h3>
                <p
                  className="inline-block px-6 py-2 sm:px-5 sm:py-1.5 xs:px-4 xs:py-1 
                              !text-sm xs:!text-xs !font-semibold !tracking-wide 
                           bg-gray-50 !text-gray-700 rounded-full border border-gray-200 
                          shadow-sm hover:shadow-md transition-all duration-300 uppercase !opacity-100"
                >
                  Boarder
                </p>
              </div>

              <div className="flex flex-col items-center mb-6">
                <img
                  src="https://static.vecteezy.com/system/resources/thumbnails/020/911/740/small_2x/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png"
                  alt="Profile Picture"
                  className="w-28 h-28 rounded-full border-4 border-gray-200 shadow-md object-cover"
                />
                <p className="!mt-6 !text-lg !font-semibold !opacity-100 !text-gray-900 !leading-none">
                  Divyam Singh Duhoon
                </p>
                <p className="!text-sm !text-gray-500 !opacity-100 !leading-none">
                  24BCS041
                </p>
              </div>

              <div className="space-y-5 text-gray-700 text-base flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Phone:</span>
                  <span className="text-gray-600">+91 7698630094</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Email:</span>
                  <span className="text-gray-600">24bcs041@nith.ac.in</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Room No:</span>
                  <span className="text-gray-600">509</span>
                </div>
              </div>

              <button
                disabled
                className="mt-8 w-full bg-gray-300 text-gray-500 py-2.5 rounded-lg cursor-not-allowed shadow-inner"
              >
                Edit Profile
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 lg:col-span-2 ">
              <h3 className="text-2xl !font-black text-gray-900 mb-10 tracking-tight !italic underline">
                Features
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                <div
                  className="group relative p-6 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm 
                    hover:shadow-lg hover:border-gray-200 transition-all duration-300 cursor-pointer h-fit"
                >
                  <div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gray-100 to-white 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  ></div>
                  <div className="relative">
                    <h3 className="!text-left !font-semibold !text-gray-800 !text-3xl mb-2 group-hover:!text-gray-900 transition">
                      Complaints
                    </h3>
                    <p className="!text-left !text-gray-600 !text-sm !leading-relaxed !opacity-100">
                      Raise and track hostel-related complaints.
                    </p>
                  </div>
                </div>

                <div
                  className="group relative p-6 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm 
                    hover:shadow-lg hover:border-gray-200 transition-all duration-300 cursor-pointer h-fit"
                >
                  <div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gray-100 to-white 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  ></div>
                  <div className="relative">
                    <h3 className="!text-left !font-semibold !text-gray-800 !text-3xl mb-2 group-hover:!text-gray-900 transition">
                      Mess Menu
                    </h3>
                    <p className="!text-left !text-gray-600 !text-sm !leading-relaxed !opacity-100">
                      Check today’s food menu.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-10 border border-gray-100 lg:col-span-3">
              <h3 className="text-2xl font-extrabold text-gray-900 mb-8 tracking-tight !italic underline ">
                Notice Board
              </h3>

              <ul className="space-y-6 text-gray-700 text-base"></ul>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
