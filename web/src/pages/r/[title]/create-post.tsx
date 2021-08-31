import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { InputField } from "../../../components/InputField";
import { useCreatePostMutation } from "../../../generated/graphql";
import { useIsAuth } from "../../../util/useIsAuth";
import { withApollo } from "../../../util/withApollo";
import Layout from "../../../components/Layout";
import { Wrapper } from "../../../components/Wrapper";
import { PostFormComponent } from "../../../components/PostFormComponent";

export const CreatePost: React.FC<{}> = ({}) => {
  const router = useRouter();
  const title: string | undefined = router.query.title as never;
  useIsAuth();
  const [createPost] = useCreatePostMutation();

  const [url, setUrl] = useState<string>("");
  const urlCallbackParent = (url: string) => {
    setUrl(url);
  };

  return (
    <Layout>
      <Wrapper variant="small">
        <Formik
          initialValues={{
            title: "",
            imgUrl: "",
            text: "",
            subredditTitle: title,
          }}
          onSubmit={async (values) => {
            values["imgUrl"] = url;
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
            <PostFormComponent
              isSubmitting={isSubmitting}
              values={values}
              buttonText="Create post"
              urlCallbackParent={urlCallbackParent}
            />
          )}
        </Formik>
      </Wrapper>
    </Layout>
  );
};

export default withApollo({ ssr: false })(CreatePost);
