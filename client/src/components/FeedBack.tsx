import { useState } from "react";
import { useSubmitFeedBackMutation } from "../state/api/interview";
import { toast } from "react-toastify";

type Props = {
    interviewId: string
};

function FeedBack({interviewId}: Props) {
  const [feedbackNote, setFeedbackNote] = useState("");
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log(feedbackNote, rating);

  const [submitFeedback] = useSubmitFeedBackMutation();

    const handleSubmitFeedBack = async()=>{
        setIsSubmitting(true);
        await submitFeedback({
        data: {
            interviewId,
            rating,
            note: feedbackNote,
        },
        });
        toast.success("feedback submitted");
        setIsSubmitting(false)
    }
  return (
    <div className="p-4 border-t border-gray-800 bg-gray-200 dark:bg-gray-950/40">
      <h2 className="text-base sm:text-lg font-semibold dark:text-blue-400 text-blue-600 mb-2">
        🧠 Feedback
      </h2>

      {/* ⭐ Rating Stars */}
      <div className="flex items-center gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            onClick={() => setRating(star)}
            xmlns="http://www.w3.org/2000/svg"
            fill={star <= rating ? "gold" : "gray"}
            viewBox="0 0 24 24"
            stroke="none"
            className="w-6 h-6 cursor-pointer hover:scale-110 transition"
          >
            <path d="M12 .587l3.668 7.568L24 9.748l-6 5.848L19.335 24 12 19.897 4.665 24 6 15.596 0 9.748l8.332-1.593z" />
          </svg>
        ))}
        <span className="ml-2 text-sm dark:text-gray-300 text-gray-800">
          {rating}/5
        </span>
      </div>
      <textarea
        placeholder="Write your feedback..."
        className="w-full h-20 sm:h-24 px-3 py-2 rounded-xl text-black dark:text-white bg-gray-100 dark:bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none resize-none text-sm sm:text-base"
        value={feedbackNote}
        onChange={(e) => setFeedbackNote(e.target.value)}
      ></textarea>
      <button
        className="w-full mt-3 bg-blue-600 hover:bg-blue-700 py-2 rounded-xl transition text-sm sm:text-base"
        onClick={handleSubmitFeedBack}
      >
        {isSubmitting? "Processing" : "Submit Feedback"}
      </button>
    </div>
  );
}

export default FeedBack;
