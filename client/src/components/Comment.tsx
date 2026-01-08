import { useState } from "react";
import { toast } from "react-toastify";
import { useAddCommentMutation, useDeleteCommentMutation, useUpdateCommentMutation } from "../state/api/interview";
import { Comment } from "../types/notification";
import { Interview } from "../types/interview";
import { Pencil, Trash2, User } from "lucide-react";

interface CommentInputProps {
  interviewId: string;
  authorId: string;
  onSuccess?: () => void; 
}

const CommentInput = ({ interviewId, authorId, onSuccess }: CommentInputProps) => {
  const [content, setContent] = useState("");

  const [addComment, { isLoading }] = useAddCommentMutation();

  const handleSubmit = async () => {
    if (!content.trim()) return toast.error("Comment cannot be empty");

    try {
      await addComment({ interviewId, authorId, content }).unwrap();
      toast.success("Comment submitted!");

      setContent(""); 
      onSuccess?.();     // refresh so that comment can be fetched again   

    } catch (err) {
      console.error(err);
      toast.error("Failed to submit comment");
    }
  };

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
      <textarea
        placeholder="Write your comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full h-24 px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 dark:text-white"
      />

      <button
        disabled={isLoading}
        onClick={handleSubmit}
        className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
      >
        {isLoading ? "Submitting..." : "Submit Comment"}
      </button>
    </div>
  );
};

export default CommentInput;

export const CommentItem = ({ comment, interview, loggedInUserId }: {comment:Comment, interview:Interview, loggedInUserId:string}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedContent, setUpdatedContent] = useState(comment.content);

  const [updateComment] = useUpdateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  // Determine author name properly
  const authorName =
    comment.authorId === interview.candidate.id
      ? interview.candidate.username
      : comment.authorId === interview.interviewr.id
      ? interview.interviewr.username
      : "Anonymous";

  const handleSave = async () => {
    if (!updatedContent.trim()) return;

    await updateComment({
      commentId: comment.id,
      content: updatedContent,
    });

    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm("Delete this comment?")) {
      await deleteComment({ commentId: comment.id });
    }
  };

  return (
    <li className="p-2 border-l-4 border-blue-400 bg-white dark:bg-gray-900 rounded-md shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-300">
        <div className="flex items-center gap-1">
          <User size={14} />
          {authorName}
        </div>

        <span>{new Date(comment.createdAt).toLocaleString()}</span>
      </div>

      {/* Comment text or editor */}
      {isEditing ? (
        <textarea
          value={updatedContent}
          onChange={(e) => setUpdatedContent(e.target.value)}
          className="w-full mt-2 p-2 bg-gray-200 dark:bg-gray-800 rounded"
        />
      ) : (
        <p className="text-gray-700 dark:text-gray-100 mt-1">
          {comment.content}
        </p>
      )}

      {/* Buttons only if the logged-in user is the author */}
      {loggedInUserId === comment.authorId && (
        <div className="flex gap-3 mt-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-3 py-1 text-white bg-green-600 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 text-white bg-gray-500 rounded"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setIsEditing(true)}>
                <Pencil size={18} className="text-yellow-500" />
              </button>

              <button onClick={handleDelete}>
                <Trash2 size={18} className="text-red-500" />
              </button>
            </>
          )}
        </div>
      )}
    </li>
  );
};
