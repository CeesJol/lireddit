import { Box, Button } from "@chakra-ui/react";
import { Form } from "formik";
import React from "react";
import { PostInput } from "../generated/graphql";
import { InputField } from "./InputField";

interface PostFormComponentProps {
  isSubmitting: boolean;
  values: PostInput;
  buttonText: "Create post" | "Update post";
}

export const PostFormComponent: React.FC<PostFormComponentProps> = ({
  isSubmitting,
  values,
  buttonText,
}) => {
  return (
    <Form>
      <Box mt={4}>
        <InputField name="title" placeholder="title" label="Title" />
      </Box>
      <Box mt={4}>
        <InputField textarea name="text" placeholder="text..." label="Body" />
      </Box>
      <Button
        mt={4}
        type="submit"
        colorScheme="teal"
        isLoading={isSubmitting}
        disabled={values.title.length === 0 || values.text.length === 0}
      >
        {buttonText}
      </Button>
    </Form>
  );
};
