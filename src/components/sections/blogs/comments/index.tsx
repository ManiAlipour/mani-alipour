import { FaRegComments } from "react-icons/fa";
import AddCommentForm from "./AddCommentForm";
import CommentsLists from "./CommentsList";

type TUser = {
  _id: string;
  name: string;
  image?: string;
  isAdmin?: boolean;
};

export type TComment = {
  _id: string;
  postId: string;
  content: string;
  createdAt: string;
  userId: TUser;
};

export default async function CommentsSection({
  postId,
  slug,
}: {
  postId: string;
  slug: string;
}) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/blogs/${postId}/comments`,
    {
      cache: "no-store",
    },
  );

  const result = await res.json();
  const comments: TComment[] = result?.data || [];

  return (
    <section className="mt-24 space-y-12">
      <div
        id="comments"
        className="flex items-center gap-3 text-neon-green text-3xl font-bold"
      >
        <FaRegComments />
        <span>کامنت ها</span>
        <span className="text-sm text-white/40 font-normal">
          ({comments.length})
        </span>
      </div>

      <AddCommentForm postId={postId} slug={slug} />


      <CommentsLists comments={comments} />
    </section>
  );
}
