"use client";

import React, { useCallback, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Controller, useForm } from "react-hook-form";
import * as zod from "zod";

import authClient from "../../lib/auth/client";

// Zod schema for form validation
const schema = zod.object({
  email: zod.string().min(1, { message: "Email is required" }).email(),
});

const defaultValues = { email: "" };

export function ResetPasswordForm() {
  const [isPending, setIsPending] = useState(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const onSubmit = useCallback(
    async (values) => {
      setIsPending(true);

      const { error } = await authClient.resetPassword(values);

      if (error) {
        setError("root", { type: "server", message: error });
        setIsPending(false);
        return;
      }

      setIsPending(false);

      // Redirect or notify user about successful password reset
      alert("Password reset link sent to your email.");
    },
    [setError]
  );

  return (
    <Stack
      spacing={4}
      sx={{
        padding: "3rem 2rem",
        borderRadius: "1px",
        border: "1px solid",
        maxWidth: "none",
        width: "100%",
        color: "white",
      }}
    >
      <Typography variant="h3">Forgot Password</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormControl error={Boolean(errors.email)}>
                <Typography style={{ marginBottom: ".5rem" }}>Email</Typography>
                <OutlinedInput
                  {...field}
                  type="text"
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.822)",
                    color: "black",
                    mb: 1
                  }}
                />
                {errors.email ? (
                  <FormHelperText>{errors.email.message}</FormHelperText>
                ) : null}
              </FormControl>
            )}
          />
          {errors.root && <Alert color="error">{errors.root.message}</Alert>}
          <Button disabled={isPending} type="submit" variant="contained">
            Send Password Reset Link
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
