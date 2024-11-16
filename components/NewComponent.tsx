export default function New() {
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
        {/* <div className="bg-white shadow-lg p-5 rounded-3xl w-full max-w-screen-sm flex flex-col gap-4">
          {["Nico", "Me", "You", "yesrself", ""].map((person, idx) => (
            <div key={idx} className="group flex items-center gap-5 rounded-xl">
              <div className="size-10 bg-blue-400 rounded-full" />
              <span
                className="text-lg font-medium 
                group-hover:bg-red-500
                empty:w-24 empty:h-5 empty:rounded-full empty:animate-pulse empty:bg-gray-300"
              >
                {person}
              </span>
              <div className="size-6 relative animate-bounce bg-red-500 text-white flex justify-center items-center rounded-full">
                <span className="z-10">{idx}</span>
                <div className="size-6 bg-red-500 rounded-full absolute animate-ping" />
              </div>
            </div>
          ))}
        </div> */}

        <div className="bg-white shadow-lg p-5 rounded-3xl w-full max-w-screen-sm flex flex-col gap-4">
          <div className="group flex flex-col">
            <input
              className="bg-gray-100 w-full"
              placeholder="작성해주세요..."
            />
            <a href="#">asdasd</a>
            <span className="group-focus-within:block hidden">
              꼬옥 작성해주세요
            </span>
            <button className="btn">submit</button>
          </div>
        </div>
      </div>
    </>
  );
}
