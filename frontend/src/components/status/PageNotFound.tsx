import { useNavigate } from "react-router-dom";

export default function PageNotFound({
  message = "Sorry, we couldn’t find the page you’re looking for.",
}) {
  const navigate = useNavigate();
  return (
    <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-indigo-600"></p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
          404
        </h1>
        <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
          {message}
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-[#49475B] text-white rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Go Back
          </a>
        </div>
      </div>
    </main>
  );
}
