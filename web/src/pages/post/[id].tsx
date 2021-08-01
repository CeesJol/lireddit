import { Box, Button, Heading, Link } from "@chakra-ui/react";
import { withApollo } from "../../util/withApollo";
import { withUrqlClient } from "next-urql";
import React from "react";
import EditDeletePostButtons from "../../components/EditDeletePostButtons";
import Layout from "../../components/Layout";
import { createUrqlClient } from "../../util/createUrqlClient";
import { useGetPostFromUrl } from "../../util/useGetPostFromUrl";
import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useGetCommentsQuery,
  useMeQuery,
} from "../../generated/graphql";
import { Form, Formik } from "formik";
import { InputField } from "../../components/InputField";
import { useRouter } from "next/router";
import { CommentComponent } from "../../components/CommentComponent";
import NextLink from "next/link";

export const Post = ({}) => {
  const router = useRouter();
  const { id } = router.query;

  const [createComment] = useCreateCommentMutation();
  const { data, error, loading } = useGetPostFromUrl();
  const { data: meData } = useMeQuery();
  const {
    data: data2,
    error: error2,
    loading: loading2,
  } = useGetCommentsQuery({
    variables: {
      relatedPostId: parseInt(id as string) as never,
    },
  });

  if (loading) {
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    );
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  if (!data?.post) {
    return (
      <Layout>
        <Box>could not find post</Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Heading mb={4}>{data.post.title}</Heading>
      <Box mb={4}>{data.post.text}</Box>
      <EditDeletePostButtons
        id={data.post.id}
        creatorId={data.post.creator.id}
      />
      <br />
      <Heading size="md" mb={4}>
        Comments {data2?.comments ? `(${data2.comments.length})` : ""}
      </Heading>

      {!meData?.me ? (
        <Box mb={4}>
          <NextLink href="/login">
            <Link>Log in</Link>
          </NextLink>{" "}
          or{" "}
          <NextLink href="/register">
            <Link>register</Link>
          </NextLink>{" "}
          to place a comment
        </Box>
      ) : (
        <Formik
          initialValues={{ text: "" }}
          onSubmit={async (values) => {
            await createComment({
              variables: {
                text: values.text,
                relatedPostId: parseInt(id as string) as number,
              },
              update: (cache) => {
                cache.evict({ fieldName: "comments" });
                router.reload();
              },
            });
          }}
        >
          {({ isSubmitting, values }) => (
            <Form>
              <Box mt={4}>
                <InputField textarea name="text" placeholder="text..." />
              </Box>
              <Button
                mt={4}
                mb={4}
                type="submit"
                colorScheme="teal"
                isLoading={isSubmitting}
                disabled={values.text.length === 0}
              >
                Comment
              </Button>
            </Form>
          )}
        </Formik>
      )}

      {error2 && (
        <>
          <div>Could not load comments</div>
          <div>{error2.message}</div>
        </>
      )}
      {data2 && !loading2 && data2.comments.length === 0 && (
        <Box>There are no comments yet</Box>
      )}
      {data2 &&
        !loading2 &&
        data2.comments.map((c) => (
          <CommentComponent key={c.id} c={c} meId={meData?.me?.id} />
        ))}
    </Layout>
  );
};

export default withApollo({ ssr: true })(Post);
