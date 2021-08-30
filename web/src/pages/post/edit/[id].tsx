import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withApollo } from "../../../util/withApollo";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../../../components/InputField";
import Layout from "../../../components/Layout";
import {
  usePostQuery,
  useUpdatePostMutation,
} from "../../../generated/graphql";
import { createUrqlClient } from "../../../util/createUrqlClient";
import { useGetIntId } from "../../../util/useGetIntId";
import { Wrapper } from "../../../components/Wrapper";
import { PostFormComponent } from "../../../components/PostFormComponent";

export const EditPost = ({}) => {
  const router = useRouter();
  const intId = useGetIntId();
  const { data, loading } = usePostQuery({
    skip: intId === -1,
    variables: {
      id: intId,
    },
  });
  const [updatePost] = useUpdatePostMutation();
  if (loading) {
    return (
      <Layout>
        <Wrapper>
          <div>loading...</div>
        </Wrapper>
      </Layout>
    );
  }

  if (!data?.post) {
    return (
      <Layout>
        <Wrapper>
          <Box>could not find post</Box>
        </Wrapper>
      </Layout>
    );
  }

  return (
    <Layout>
      <Wrapper variant="small">
        <Formik
          initialValues={{
            title: data.post.title,
            text: data.post.text,
            subredditTitle: data.post.subredditTitle,
          }}
          onSubmit={async (values) => {
            await updatePost({ variables: { id: intId, ...values } });
            router.back();
          }}
        >
          {({ isSubmitting, values }) => (
            <PostFormComponent
              isSubmitting={isSubmitting}
              values={values}
              buttonText="Update post"
            />
          )}
        </Formik>
      </Wrapper>
    </Layout>
  );
};

export default withApollo({ ssr: false })(EditPost);
