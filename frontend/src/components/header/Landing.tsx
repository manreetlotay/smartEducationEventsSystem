import React, { useState } from "react";
import { Link } from "react-router-dom";
import bg from "../../assets/images/homeBg.jpg";
import Footer from "../footer/Footer";

const stats = [
  { name: "Events hosted", value: "1,200+ " },
  { name: "Attendees engaged", value: "500,000+" },
  { name: "Event interactions", value: "10,000+" },
  { name: "Satisfaction rate", value: "95%" },
];

export default function Landing() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const renderStar = (starNumber, currentValue) => {
    if (currentValue >= starNumber) {
      return <span className="text-3xl text-yellow-400">★</span>;
    } else {
      return <span className="text-3xl text-gray-300">★</span>;
    }
  };

  const currentRating = hoverRating || rating;

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
          <img
            alt=""
            src={bg}
            className="absolute inset-0 -z-10 size-full object-cover object-right md:object-center"
          />
          <div
            aria-hidden="true"
            className="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="aspect-1097/845 w-[68.5625rem] bg-linear-to-tr from-[#ff4694] to-[#776fff] opacity-20"
            />
          </div>
          <div
            aria-hidden="true"
            className="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0 sm:transform-gpu"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="aspect-1097/845 w-[68.5625rem] bg-linear-to-tr from-[#ff4694] to-[#776fff] opacity-20"
            />
          </div>
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h2 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">
                Connecting Minds
              </h2>
              <p className="mt-8 text-lg font-medium text-pretty text-gray-300 sm:text-xl/8">
                From planning and scheduling to managing participants and speakers,
                our platform streamlines the entire process, ensuring every event—be
                it a seminar, workshop, or conference—runs smoothly and efficiently,
                delivering exceptional value to attendees and organizers alike.
              </p>
            </div>
            <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
              <dl className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                  <div key={stat.name} className="flex flex-col-reverse gap-1">
                    <dt className="text-base/7 text-gray-300">{stat.name}</dt>
                    <dd className="text-4xl font-semibold tracking-tight text-white">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <Link to="/signIn">
            {/*Sign Up Button*/}
            <button
              type="button"
              className="absolute bottom-8 right-8 bg-blue-500 text-white px-8 py-3 rounded-full shadow hover:bg-blue-600 transition duration-300 group"
            >
              Join now
              <span className="inline-block ml-2 transform transition duration-300 group-hover:translate-x-2">
                →
              </span>
            </button>
          </Link>
        </div>
        
        {/*Review Section*/}
        <section className="bg-gray-100 py-16">
          <div className="mx-auto max-w-2xl px-6 text-center">
            <h2 className="text-3xl font-semibold text-gray-900">Leave a Review</h2>
            <p className="mt-4 text-lg text-gray-600">
              We value your feedback. Please share your thoughts about our platform.
            </p>
            <div
              onMouseLeave={() => setHoverRating(0)}
              className="flex justify-center items-center mt-6 mb-4 space-x-1"
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseMove={() => setHoverRating(star)}
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  {renderStar(star, currentRating)}
                </button>
              ))}
            </div>
            <form className="mt-8 space-y-4">
              <textarea
                className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                rows="4"
                placeholder="Write your review here..."
              ></textarea>
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-3 rounded-full shadow hover:bg-blue-600 transition duration-300"
              >
                Submit Review
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
