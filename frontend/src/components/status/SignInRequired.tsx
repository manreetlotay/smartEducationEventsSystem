import { useNavigate } from "react-router-dom";

export default function SignInRequired({ message = "Sign in to proceed" }) {
  const navigate = useNavigate();
  return (
    <>
      <div className="text-center mt-60 mb-40">
        <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
          {message}
        </p>
        <div className="mt-5 flex items-center justify-center gap-x-6">
          <button
            onClick={() => navigate("/signin")}
            className="px-6 py-2 bg-[#49475B] text-white rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    </>
  );
}
