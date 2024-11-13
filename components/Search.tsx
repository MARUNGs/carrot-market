export default function Search() {
  return (
    <>
      <div className="bg-gray-100 h-screen p-5 flex items-center justify-center ">
        <div className="gap-2 bg-white max-w-screen-sm w-full shadow-lg p-5 rounded-3xl flex flex-col">
          <input
            className="py-3 w-full rounded-full h-10 bg-gray-200 pl-5"
            type="text"
            placeholder="Search here ..."
          />
          <button className="bg-black text-white py-2 rounded-full active:scale-90 transition-transform font-medium">
            Search
          </button>
        </div>
      </div>
    </>
  );
}
