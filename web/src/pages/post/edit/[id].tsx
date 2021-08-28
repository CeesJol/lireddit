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
          initialValues={{ title: data.post.title, text: data.post.text }}
          onSubmit={async (values) => {
            await updatePost({ variables: { id: intId, ...values } });
            router.back();
          }}
        >
          {({ isSubmitting, values }) => (
            <Form>
              <Box mt={4}>
                <InputField name="title" placeholder="title" label="Title" />
              </Box>
              <Box mt={4}>
                <InputField
                  textarea
                  name="text"
                  placeholder="text..."
                  label="Body"
                />
              </Box>
              <Button
                mt={4}
                type="submit"
                colorScheme="teal"
                isLoading={isSubmitting}
                disabled={values.title.length === 0 || values.text.length === 0}
              >
                update post
              </Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </Layout>
  );
};

export default withApollo({ ssr: false })(EditPost);
