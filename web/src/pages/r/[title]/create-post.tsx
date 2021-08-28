import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../../../components/InputField";
import { useCreatePostMutation } from "../../../generated/graphql";
import { useIsAuth } from "../../../util/useIsAuth";
import { withApollo } from "../../../util/withApollo";
import Layout from "../../../components/Layout";

export const CreatePost: React.FC<{}> = ({}) => {
  const router = useRouter();
  const title: string | undefined = router.query.title as never;
  useIsAuth();
  const [createPost] = useCreatePostMutation();
  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: "", text: "", subredditTitle: title }}
        onSubmit={async (values) => {
          const { errors } = await createPost({
            variables: { input: values },
            update: (cache) => {
              cache.evict({ fieldName: "posts:{}" });
            },
          });

          if (!errors) {
            router.push("/");
          }
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
              Create post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withApollo({ ssr: false })(CreatePost);
