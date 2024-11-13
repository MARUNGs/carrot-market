export default function Search() {
  return (
    <>
      <div
        className="h-screen p-5 flex items-center justify-center 
        bg-gray-100
        sm:bg-red-100
        md:bg-green-100
        lg:bg-cyan-100
        xl:bg-orange-100
        2xl:bg-purple-100"
      >
        <div className="md:flex-row gap-2 bg-white max-w-screen-sm w-full shadow-lg p-5 rounded-3xl flex flex-col">
          <input
            className="py-3 w-full rounded-full h-10 bg-gray-200 pl-5 outline-none
              ring 
              ring-transparent
              focus:ring-orange-500 
              focus:ring-offset-2 
              transition-shadow
              placeholder:drop-shadow"
            type="text"
            placeholder="Search here ..."
          />
          <button className="md:px-10 bg-black bg-opacity-50 text-white py-2 rounded-full active:scale-90 transition-transform font-medium outline-none">
            Search
          </button>
        </div>
      </div>
    </>
  );
}
